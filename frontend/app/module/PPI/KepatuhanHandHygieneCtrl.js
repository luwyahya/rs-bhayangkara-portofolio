define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('KepatuhanHandHygieneCtrl', ['$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($state, $q, $scope, cacheHelper, DateHelper, medifirstService) {

            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.cari = {};
            $scope.jumlah = 0;
            $scope.ya = 0;
            $scope.tidak = 0;
            $scope.item.nilaiPopUp = 0;
            $scope.periodeAwal = new Date();
            $scope.periodeAkhir = new Date();
            $scope.tanggal = new Date();
            $scope.now = new Date();
            var norec = '';
            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.monthSelectorOptions = function () {
                return {
                    start: "year",
                    depth: "year",
                    format: "MMMM yyyy",
                }
            }


            $scope.checkObjectPegawai = function () {
                $scope.isRouteLoading = false;
                var tglAwal = moment($scope.tanggal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.tanggal).format('YYYY-MM-DD 23:59:59');
                var peg = ""
                var tempNoReg = "";
                if ($scope.item.objectpegawaifk != undefined) {
                    var peg = "&pgid=" + $scope.item.objectpegawaifk.value
                    tempNoReg = { value: $scope.item.objectpegawaifk.value, text: $scope.item.objectpegawaifk.text }
                }
                var pr = ""
                var temppr = "";
                if ($scope.item.profesor != undefined) {
                    var pr = "&prid=" + $scope.item.profesor.value
                    temppr = { value: $scope.item.profesor.value, text: $scope.item.profesor.jenispegawai }


                }
                var bng = ""
                var tembng = "";
                if ($scope.item.bangsal != undefined) {
                    var bng = "&bngid=" + $scope.item.bangsal.value
                    tembng = { value: $scope.item.bangsal.value, text: $scope.item.bangsal.namaruangan }


                }
                var ind = ""
                var temindikasi = "";
                if ($scope.item.indikasi2 != undefined) {
                    var ind = "&indikasiid=" + $scope.item.indikasi2.value
                    temindikasi = { value: $scope.item.indikasi2.value, text: $scope.item.indikasi2.indikasi }
                }
                medifirstService.get('emr/get-data-kepatuhan-handhygiene-pegawai?' + "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + peg + pr + bng + ind
                ).then(function (data) {

                    $scope.isLoadingData = false;

                    var result = data.data.data;
                    // for (var i = 0; i < result.length; i++) {
                    //     if(result[i].carapemberian == null){
                    //         var dataTemp ={id :"-", text :"-"}
                    //     }else{
                    //         var dataTemp ={ id : result[i].carapemberian,text : result[i].carapemberian  }
                    //     }
                    //     result[i].carapemberian = dataTemp;
                    // }

                    var datas = data.data.data;
                    for (let index = 0; index < datas.length; index++) {
                        datas[index].no = index + 1;
                        var langkah = datas[index].langkah
                        if (langkah == 0) {
                            datas[index].nilailangkah = 0
                            datas[index].snilailangkah = "0 %"
                        } else if (langkah == 1) {
                            datas[index].nilailangkah = 50
                            datas[index].snilailangkah = "50 %"
                        } else if (langkah == 2) {
                            datas[index].nilailangkah = 100
                            datas[index].snilailangkah = "100 %"
                        }
                        if (datas[index].objectindikasifk != null) {
                            var inidikasiArr = datas[index].objectindikasifk.split(',')
                            var a = ''
                            var b = ''
                            for (var i = 0; i < inidikasiArr.length; i++) {
                                var elem = inidikasiArr[i]

                                var listIndikasi = ''
                                for (var u = 0; u < $scope.listIndikasi.length; u++) {
                                    var indik = $scope.listIndikasi[u]

                                    if (indik.value == elem) {
                                        if (result[index].objectindikasifk == null || result[index].objectindikasifk == undefined) {
                                            var dataTemp = { value: "-", indikasi: "-" }
                                        } else {
                                            var dataTemp = { value: indik.value, indikasi: indik.text }
                                        }
                                        result[index].objectindikasifk = dataTemp;
                                        // if(result[index].carapemberian == null){
                                        //     var dataTemp ={id :"-", text :"-"}
                                        // }else{
                                        //     var dataTemp ={ id : result[index].carapemberian,text : result[index].carapemberian  }
                                        // }
                                        // result[index].namaindikasi = indik.text;
                                        // var c = indik.indikasi
                                        //   b = "," + c
                                        //    a = a + b
                                    }
                                }
                                listIndikasi = a.slice(1, a.length)
                                datas[index].indikasi = listIndikasi
                            }
                        }

                        if (datas[index].objecthygienefk != null) {
                            var objecthygienefkArr = datas[index].objecthygienefk.split(',')
                            var a = ''
                            var b = ''
                            for (var i = 0; i < objecthygienefkArr.length; i++) {
                                var elem = objecthygienefkArr[i]

                                var listHand = ''
                                for (var u = 0; u < $scope.listHand.length; u++) {
                                    var indik = $scope.listHand[u]

                                    if (indik.value == elem) {
                                        if (result[index].objecthygienefk == null || result[index].objecthygienefk == undefined) {
                                            var dataTemp = { value: "-", tindakan: "-" }
                                        } else {
                                            var dataTemp = { value: indik.value, tindakan: indik.text }
                                        }
                                        result[index].objecthygienefk = dataTemp;
                                        // var c = indik.tindakan
                                        //   b = "," + c
                                        //    a = a + b
                                    }
                                }
                                listHand = a.slice(1, a.length)
                                datas[index].tindakan = listHand
                            }
                        }
                    }

                    // $scope.isLoadingData = false;
                    // var datas = data.data.data;
                    // for (let index = 0; index < datas.length; index++) {
                    //         datas[index].no = index + 1;
                    //         var langkah = datas[index].langkah
                    //         if (langkah==0){
                    //           datas[index].nilailangkah=0
                    //           datas[index].snilailangkah="0 %"
                    //         } else if (langkah==1){
                    //           datas[index].nilailangkah=50
                    //           datas[index].snilailangkah="50 %"
                    //         } else if (langkah==2){
                    //           datas[index].nilailangkah=100
                    //           datas[index].snilailangkah="100 %"
                    //         }
                    //         if(  datas[index].objectindikasifk != null){
                    //           var inidikasiArr =   datas[index].objectindikasifk .split(',')
                    //             var a = ''
                    //                var b =''
                    //           for (var i = 0; i < inidikasiArr.length; i++) {
                    //              var elem = inidikasiArr[i]

                    //                var listIndikasi =''
                    //             for (var u = 0; u < $scope.listIndikasi.length; u++) {
                    //                 var indik = $scope.listIndikasi[u]


                    //             // }

                    //                if(indik.value == elem){
                    //             //     var c = indik.indikasi
                    //             //       b = "," + c
                    //             //        a = a + b
                    //             //    }
                    //                 if(datas[index].objecthygienefk == null){
                    //                     var dataTemp ={id :"-", indikasi :"-"}
                    //                 }else{
                    //                     var dataTemp ={ id : indik.value,indikasi : indik.indikasi  }
                    //                 }
                    //                 datas[index].indikasi = dataTemp;
                    //                 }
                    //             }
                    //             //  listIndikasi = a.slice(1, a.length)
                    //             //   datas[index].indikasi =listIndikasi
                    //           }
                    //         }

                    //          if(  datas[index].objecthygienefk != null){

                    //             // if(datas[index].objecthygienefk == null){
                    //             //     var dataTemp ={id :"-", indikasi :"-"}
                    //             // }else{
                    //             //     var dataTemp ={ id : datas[index].objectindikasifk,indikasi : datas[index].indikasi  }
                    //             // }
                    //             // datas[index].indikasi = dataTemp;


                    //         //   var objecthygienefkArr =   datas[index].objecthygienefk .split(',')
                    //         //     var a = ''
                    //         //        var b =''
                    //         //   for (var i = 0; i < objecthygienefkArr.length; i++) {
                    //         //      var elem = objecthygienefkArr[i]

                    //         //        var listHand =''
                    //         //     for (var u = 0; u < $scope.listHand.length; u++) {
                    //         //        var indik = $scope.listHand[u]

                    //         //        if(indik.value == elem){
                    //         //         var c = indik.tindakan
                    //         //           b = "," + c
                    //         //            a = a + b
                    //         //        }
                    //         //     }
                    //         //      listHand = a.slice(1, a.length)
                    //         //       datas[index].tindakan =listHand
                    //         //   }
                    //         }
                    //     }
                    for (var i = result.length; i < 9; i++) {
                        result.push({
                            // var dataTemp ={ objecthygienefk : indik.value,namahygiene : indik.text  }
                            "no": i + 1,
                            "indikasi": "",
                            "objecthygienefk": { value: "-", tindakan: "-" },
                            "objectindikasifk": { value: "-", indikasi: "-" }

                        });
                    }
                    $scope.dataIPCLN = new kendo.data.DataSource({
                        data: result,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    indikasi: { editable: 'incell', type: "string" },
                                    // namahygiene: { editable: 'incell', type: "string" },
                                    tindakan: { editable: 'incell', type: "string" },
                                    //   nilailangkah: {type: "number"},
                                    //   namalengkap: {type: "string"}
                                }
                            }
                        },
                        // group:{
                        //   field: "namalengkap", aggregates: [
                        //     { field: "nilailangkah", aggregate: "average" }
                        //   ]
                        // },
                        // aggregate:[{ field: "nilailangkah", aggregate: "average"}]

                        // hitungNilai();
                    });
                    var chacePeriode = {
                        0: tglAwal,
                        1: tglAkhir,
                        2: tempNoReg,
                        3: temppr,
                        4: tembng,
                        5: temindikasi,

                    }

                    function resolveAfter2Seconds() {
                        return new Promise(resolve => {
                            setTimeout(() => {
                                hitungNilai();
                            }, 500);
                        });
                    }

                    async function asyncCall() {
                        console.log('calling');
                        const result = await resolveAfter2Seconds();
                        console.log(result);
                        // expected output: "resolved"
                    }

                    asyncCall();

                    cacheHelper.set('KepatuhanHandHygieneCtrl', chacePeriode);
                }, function (error) {
                    $scope.isRouteLoading = false;
                    throw error;
                })
            }

            LoadCombo();

            function LoadCombo() {
                var chacePeriode = cacheHelper.get('KepatuhanHandHygieneCtrl');
                if (chacePeriode != undefined) {
                    $scope.periodeAwal = new Date(chacePeriode[0]);;
                    $scope.periodeAkhir = new Date(chacePeriode[1]);

                    // if (chacePeriode[2] != undefined) {
                    //     $scope.item.pegawai = chacePeriode[2]
                    // }

                    // if (chacePeriode[3] != undefined) {
                    //     $scope.item.profesor = chacePeriode[3]
                    // }

                    // if (chacePeriode[4] != undefined) {
                    //     $scope.item.bangsal = chacePeriode[4]
                    // }

                    // if (chacePeriode[5] != undefined) {
                    //     $scope.item.indikasi = chacePeriode[5]
                    // }

                    // if (chacePeriode[6] != undefined) {
                    //     $scope.listRuangan = [chacePeriode[6]]
                    //     $scope.item.ruangan = chacePeriode[6]
                    // }

                    // if (chacePeriode[7] != undefined) {
                    //     $scope.item.listKelompokPasien = [chacePeriode[7]]
                    //     $scope.item.kelompokpasien = chacePeriode[7]
                    // }

                    // if (chacePeriode[8] != undefined) {
                    //     $scope.item.dokter = chacePeriode[8]
                    //     $scope.item.listDokter2 = chacePeriode[8]
                    // }

                    // if (chacePeriode[9] != undefined) {
                    //     $scope.item.jmlRows = chacePeriode[9]
                    // }

                } else {
                    $scope.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))

                }
                medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                    $scope.listRuang = data;
                });
                medifirstService.get("sysadmin/general/get-datacombo-handhygiene-general", true, true, 20).then(function (data) {
                    $scope.listHand = data.data;
                });
                medifirstService.getPart("sysadmin/general/get-datacombo-departemen", true, true, 20).then(function (data) {
                    $scope.listDepartemen = data;
                });
                medifirstService.getPart("sysadmin/general/get-datacombo-jenispegawai-general", true, true, 20).then(function (data) {
                    $scope.listJenisPegawai = data;
                });
                medifirstService.get("sysadmin/general/get-datacombo-indikasi-general", true, true, 20).then(function (data) {
                    $scope.listIndikasi = data.data;
                });
                medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                    $scope.listPegawai = data
                });

                $scope.item.bulan = moment($scope.now).format('MMMM');
                $scope.tanggal = moment(new Date()).format('YYYY-MM-DD HH:mm');
                // $scope.listStatus = [{ "id": "1", "langkah": "Melakukan tapi salah" }, { "id": "0", "langkah": "Tidak Melakukan" }, { "id": "2", "langkah": "melakukan dengan" }, { "id": "4", "namaExternal": "Lunas" }]   
                // init();    
            }


            //  $scope.group = {
            //     field: "namaruangan",
            //     aggregates: [
            //         // {
            //         //     field: "pasien",
            //         //     aggregate: "count"
            //         // }, 
            //         {
            //             field: "namaruangan",
            //             aggregate: "count",
            //         }]
            // };
            $scope.aggregate = [
                // {
                //     field: "pasien",
                //     aggregate: "count"
                // }, 
                {
                    field: "namaruangan",
                    aggregate: "count"
                }
            ]

            $scope.optionGridMaster = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "LaporanRincianSurveilans.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:I1"];
                    sheet.name = "LAPORAN";
                    var myHeaders = [{
                        value: "Data Surveilans Ruangan " + DateHelper.formatDate($scope.periodeAwal, 'DD-MM-YY') + ' sampai ' +
                            DateHelper.formatDate($scope.periodeAkhir, 'DD-MM-YY'),
                        fontSize: 15,
                        textAlign: "center",
                        background: "#c1d2d2",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },

                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                scrollable: false,
                columns: [
                    // { 
                    //    "field": "no",
                    //    "title": "No",
                    //    "width": "50px",
                    //    attributes: {
                    //         "class": "table-cell",
                    //         style: "text-align: center;"
                    //     } 

                    // },
                    {
                        "field": "tanggal",
                        "title": "Tanggal",
                        "template": "<span class='style-center'>#: tanggal #</span>",
                        "width": "200px"

                    },
                    {
                        "field": "namaruangan",
                        "title": "Nama Ruangan",
                        "width": "200px"

                    },
                    {
                        "field": "jenispegawai",
                        "title": "Profesi",
                        "width": "200px"

                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Pegawai",
                        "width": "200px"

                    },
                    {
                        "field": "indikasi",
                        "title": "Moment",
                        "width": "200px"

                    },
                    // { 
                    //    "field": "indikasi", 
                    //    "title": "Indikasi",
                    //    "width": "200px"

                    // }, 
                    {
                        "field": "tindakan",
                        "title": "Metode",
                        "width": "250px",
                        groupFooterTemplate: "Rata-rata",
                        footerTemplate: "Total Rata-rata"

                    },

                    // { 
                    //    "field": "langkah", 
                    //    "title": "Audit Cuci tangan",
                    //    "width": "200px"

                    // },
                    // { 
                    //    "field": "kesempatan", 
                    //    "title": "Kesempatan ke",
                    //    "width": "200px",
                    //    groupFooterTemplate: "Rata-rata",
                    //    footerTemplate: "Total Rata-rata"

                    // },                
                    {
                        "field": "snilailangkah",
                        "title": "Total Nilai",
                        "width": "200px",
                        aggregates: ["average"],
                        //    footerTemplate: "#= kendo.toString(data.nilailangkah.average, '0.00')# %",
                        //    footerTemplate: "<span>data.nilailangkah.average </span>",
                        footerTemplate: "#: data.nilailangkah.average #",
                        footerTemplate: "#= kendo.toString(data.nilailangkah.average, '0.00')# %",
                        groupFooterTemplate: "#= kendo.toString(data.nilailangkah.average, '0.00')# %",
                        //    footerAttributes: { style: "text-align: right;" }
                    },
                    // {
                    //     hidden: true,
                    //     "field": "groupjudul",
                    //     "title": "",
                    //     "width": "180px",
                    //     "template": "<span class='style-center'>#: groupjudul #</span>",
                    //     // footerTemplate: "<span>namaruangan </span>"
                    //     aggregates: ["sum"],
                    //     footerTemplate: "#: data.jasaTotal.sum #",
                    //     footerTemplate: "<span class='style-right'>{{formatRupiah('#: data.jasaTotal.sum #', 'Rp.')}}</span>",
                    //     footerAttributes: { style: "text-align: right;" },
                    // }   
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: true,
                }
            }

            $scope.optionGridBulanan = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "IPCLN Bulanan.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:E1"];
                    sheet.name = "Reservasi";

                    var myHeaders = [{
                        value: "IPCLN Bulanan",
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
                    field: "namaruangan",
                    title: "Nama Ruangan",
                    width: 200
                }, {
                    field: "ya",
                    title: "Ya",
                    width: 100
                }, {
                    field: "tidak",
                    title: "tidak",
                    width: 100
                }, {
                    field: "jumlah",
                    title: "jumlah",
                    width: 100
                },
                {
                    field: "persentase",
                    title: "Persentase",
                    width: 100
                }
                ]
            };

            $scope.optionGridBulananTahun = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "IPCLN Bulanan Tahun.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:E1"];
                    sheet.name = "Reservasi";

                    var myHeaders = [{
                        value: "IPCLN Bulanan Tahun",
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
                    field: "bulan",
                    title: "Bulan",
                    width: 100
                }, {
                    field: "persentase_dokter",
                    title: "Dokter",
                    width: 100
                }, {
                    field: "persentase_perawat",
                    title: "Perawat",
                    width: 100
                }, {
                    field: "persentase_fisioterapi",
                    title: "Fisioterapi",
                    width: 100
                }, {
                    field: "persentase_avg",
                    title: "Rata-rata Capaian",
                    width: 100
                }, {
                    field: "standar",
                    title: "Standar",
                    width: 100
                }]
            };

            $scope.optionGridIndikasi = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "IPCLN Indikasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:E1"];
                    sheet.name = "Reservasi";

                    var myHeaders = [{
                        value: "IPCLN Bulanan",
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
                    field: "indikasi",
                    title: "Nama Indikasi",
                    width: 200
                }, {
                    field: "ya",
                    title: "Ya",
                    width: 100
                }, {
                    field: "tidak",
                    title: "tidak",
                    width: 100
                }, {
                    field: "jumlah",
                    title: "jumlah",
                    width: 100
                },
                {
                    field: "persentase",
                    title: "Persentase",
                    width: 100
                }
                ]
            };

            function textareaNameEditor(container, options) {
                $('<textarea required name="' + options.field + '" cols="20" row="4" style="line-height: 6em;"></textarea>')
                    .appendTo(container)
            }




            $scope.cariFilter = function () {
                init()
            }

            function init() {
                $scope.jumlah = 0;
                $scope.ya = 0;
                $scope.tidak = 0;
                $scope.item.nilaiPopUp = 0;
                $scope.isRouteLoading = false;
                var tglAwal = moment($scope.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var peg = ""
                var tempNoReg = "";
                if ($scope.item.pegawai != undefined) {
                    var peg = "&pgid=" + $scope.item.pegawai.value
                    tempNoReg = { value: $scope.item.pegawai.value, text: $scope.item.pegawai.namalengkap }
                }
                var pr = ""
                var temppr = "";
                if ($scope.item.profesor != undefined) {
                    var pr = "&prid=" + $scope.item.profesor.value
                    temppr = { value: $scope.item.profesor.value, text: $scope.item.profesor.jenispegawai }


                }
                var bng = ""
                var tembng = "";
                if ($scope.item.bangsal != undefined) {
                    var bng = "&bngid=" + $scope.item.bangsal.value
                    tembng = { value: $scope.item.bangsal.value, text: $scope.item.bangsal.namaruangan }


                }
                var ind = ""
                var temindikasi = "";
                if ($scope.item.indikasi2 != undefined) {
                    var ind = "&indikasiid=" + $scope.item.indikasi2.value
                    temindikasi = { value: $scope.item.indikasi2.value, text: $scope.item.indikasi2.indikasi }
                }
                medifirstService.get('emr/get-data-kepatuhan-handhygiene?' + "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + peg + pr + bng + ind
                ).then(function (data) {
                    $scope.isLoadingData = false;
                    var datas = data.data.data;
                    // var idpegawai = 0;
                    // $scope.persen = {};
                    // $scope.persen.jumlah = 0;
                    // $scope.persen.ya = 0;
                    // $scope.persen.tidak = 0;
                    // $scope.persen.persentase = 0;
                    for (let index = 0; index < datas.length; index++) {
                        datas[index].no = index + 1;
                        var langkah = datas[index].langkah



                        // for(var i = 0; i < $scope.dataIPCLN._data.length; i++) {
                        //     if($scope.dataIPCLN._data[i].objecthygienefk.value != '-') {
                        //         if($scope.dataIPCLN._data[i].objecthygienefk.value == 3) {
                        //             $scope.tidak = $scope.tidak + 1;
                        //         } else {
                        //             $scope.ya = $scope.ya + 1;
                        //         }
                        //         $scope.jumlah = $scope.jumlah + 1;
                        //         // $scope.item.nilaiPopUp = (String(num.toFixed(($scope.ya/($scope.jumlah)) * 100))) + '%';
                        //         var hitung = ($scope.ya/$scope.jumlah) * 100
                        //         var jadi = hitung.toFixed(0);
                        //         $scope.item.nilaiPopUp = jadi;
                        //     }
                        // }

                        // if(idpegawai == datas[index].objectpegawaifk){
                        //     if(datas[index].objecthygienefk == 3) {
                        //         $scope.persen.tidak = $scope.persen.tidak + 1;
                        //     } else {
                        //         $scope.persen.ya = $scope.persen.ya + 1;
                        //     }
                        //     $scope.persen.jumlah = $scope.persen.jumlah + 1;
                        // }

                        if (langkah == 0) {
                            datas[index].nilailangkah = 0
                            datas[index].snilailangkah = "0 %"
                        } else if (langkah == 1) {
                            datas[index].nilailangkah = 50
                            datas[index].snilailangkah = "50 %"
                        } else if (langkah == 2) {
                            datas[index].nilailangkah = 100
                            datas[index].snilailangkah = "100 %"
                        }
                        if (datas[index].objectindikasifk != null) {
                            var inidikasiArr = datas[index].objectindikasifk.split(',')
                            var a = ''
                            var b = ''
                            for (var i = 0; i < inidikasiArr.length; i++) {
                                var elem = inidikasiArr[i]

                                var listIndikasi = ''
                                for (var u = 0; u < $scope.listIndikasi.length; u++) {
                                    var indik = $scope.listIndikasi[u]

                                    if (indik.value == elem) {
                                        var c = indik.indikasi
                                        b = "," + c
                                        a = a + b
                                    }
                                }
                                listIndikasi = a.slice(1, a.length)
                                datas[index].indikasi = listIndikasi
                            }
                        }

                        if (datas[index].objecthygienefk != null) {
                            var objecthygienefkArr = datas[index].objecthygienefk.split(',')
                            var a = ''
                            var b = ''
                            for (var i = 0; i < objecthygienefkArr.length; i++) {
                                var elem = objecthygienefkArr[i]

                                var listHand = ''
                                for (var u = 0; u < $scope.listHand.length; u++) {
                                    var indik = $scope.listHand[u]

                                    if (indik.value == elem) {
                                        var c = indik.tindakan
                                        b = "," + c
                                        a = a + b
                                    }
                                }
                                listHand = a.slice(1, a.length)
                                datas[index].tindakan = listHand
                            }
                        }
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: datas,
                        group: $scope.group,
                        pageSize: 1000,
                        total: datas.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                    nilailangkah: { type: "number" },
                                    namalengkap: { type: "string" }
                                }
                            }
                        },
                        aggregate: [
                            { field: "nilailangkah", aggregate: "average" },

                        ],
                        // aggregate: [
                        //     {
                        //         field: "namaruangan", aggregates: [
                        //             { field: "nilailangkah", aggregate: "average" }
                        //         ],
                        //         aggregate:[{ field: "nilailangkah", aggregate: "average"}]
                        //     },
                        //     {
                        //         field: "namalengkap", aggregates: [
                        //             { field: "nilailangkah", aggregate: "average" }
                        //         ],
                        //         aggregate:[{ field: "nilailangkah", aggregate: "average"}]
                        //     },
                        // ],
                        // group:{
                        //   field: "namaruangan", aggregates: [
                        //     { field: "nilailangkah", aggregate: "average" }
                        //   ]
                        // },
                        // group:{
                        //   field: "namalengkap", aggregates: [
                        //     { field: "nilailangkah", aggregate: "average" }
                        //   ]
                        // },
                        // aggregate:[{ field: "nilailangkah", aggregate: "average"}]

                    });
                    var chacePeriode = {
                        0: tglAwal,
                        1: tglAkhir,
                        2: tempNoReg,
                        3: temppr,
                        4: tembng,
                        5: temindikasi,

                    }

                    cacheHelper.set('KepatuhanHandHygieneCtrl', chacePeriode);
                }, function (error) {
                    $scope.isRouteLoading = false;
                    throw error;
                })
                medifirstService.get('emr/get-data-kepatuhan-handhygiene-bulanan?' + "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + peg + pr + bng + ind
                ).then(function (databul) {

                    $scope.dataSourceBulanan = new kendo.data.DataSource({
                        data: databul.data.data,
                        pageSize: 10,
                        total: databul.data.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                })
                medifirstService.get('emr/get-data-kepatuhan-handhygiene-bulanan-tahun?' + "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + peg + pr + bng + ind
                ).then(function (databultah) {

                    $scope.dataSourceBulananTahun = new kendo.data.DataSource({
                        data: databultah.data.data,
                        pageSize: 200,
                        total: databultah.data.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                })

                medifirstService.get('emr/get-data-kepatuhan-handhygiene-indikasi?' + "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + peg + pr + bng + ind
                ).then(function (databulink) {

                    $scope.dataSourceIndikasi = new kendo.data.DataSource({
                        data: databulink.data.data,
                        pageSize: 200,
                        total: databulink.data.data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                })
            }
            $scope.group = [{
                field: "namaruangan",
                aggregates: [
                    { field: "nilailangkah", aggregate: "average" }
                ],
                aggregate: [{ field: "nilailangkah", aggregate: "average" }]
            },
            {
                field: "namalengkap",
                aggregates: [
                    { field: "nilailangkah", aggregate: "average" }
                ],
                aggregate: [{ field: "nilailangkah", aggregate: "average" }]
            },

            ];

            $scope.dropDownIndikasi = function (container, options) {
                var editor = $('<input kendo-combo-box required k-data-text-field="\'text\'" k-data-value-field="\'text\'" k-filter="\'contains\'" k-data-source="listIndikasi" data-bind="value:' + options.field + '"/>')
                    .appendTo(container);
            };

            $scope.dropDownHand = function (container, options) {
                if (options.model.objectindikasifk == undefined || options.model.objectindikasifk == null || options.model.objectindikasifk.value == '-') {
                    toastr.error('Pilih Indikasi Terlebih dahulu')
                    return
                } else {
                    var editor = $('<input k-on-change="hitungNilai()" kendo-combo-box required k-data-text-field="\'text\'" k-data-value-field="\'text\'" k-filter="\'contains\'" k-data-source="listHand" data-bind="value:' + options.field + '"/>')
                        .appendTo(container);
                }
            };

            function hitungNilai() {
                $scope.hitungNilai();
            }
            $scope.hitungNilai = function () {
                $scope.jumlah = 0;
                $scope.ya = 0;
                $scope.tidak = 0;
                $scope.item.nilaiPopUp = 0;
                for (var i = 0; i < $scope.dataIPCLN._data.length; i++) {
                    if ($scope.dataIPCLN._data[i].objecthygienefk.value != '-') {
                        if ($scope.dataIPCLN._data[i].objecthygienefk.value == 3) {
                            $scope.tidak = $scope.tidak + 1;
                        } else {
                            $scope.ya = $scope.ya + 1;
                        }
                        $scope.jumlah = $scope.jumlah + 1;
                        // $scope.item.nilaiPopUp = (String(num.toFixed(($scope.ya/($scope.jumlah)) * 100))) + '%';
                        var hitung = ($scope.ya / $scope.jumlah) * 100
                        var jadi = hitung.toFixed(0);
                        $scope.item.nilaiPopUp = jadi;
                    }
                }
            };

            $scope.listIPCLN = {
                // editable: true,
                editable: "incell",
                columns: [
                    //     {
                    //     field: "namaproduk",
                    //     title: "Nama Produk",
                    //     width: "60%"
                    // },
                    // {
                    //     field: "dosisobat",
                    //     title: "Dosis Obat",
                    //     width: "10%"
                    // },
                    // {
                    //     field: "frekuensi",
                    //     title: "Frekuensi",
                    //     width: "10%"
                    // },
                    {
                        field: "no",
                        title: "No",
                        width: "5%"
                    },
                    {
                        field: "objectindikasifk",
                        title: "Indikasi",
                        width: "50%",
                        editor: $scope.dropDownIndikasi,
                        template: "#=objectindikasifk.indikasi#"
                    },
                    {
                        field: "objecthygienefk",
                        title: "Tindakan",
                        width: "45%",
                        editor: $scope.dropDownHand,
                        template: "#=objecthygienefk.tindakan#"
                    },
                    // {
                    //     field: "carapemberian",
                    //     title: "Cara Pemberian",
                    //     width: "15%"
                    // },
                    // { command: 
                    //     [{text: "Hapus", click: simpanDeleteObatPulang }], 
                    //     title: "&nbsp;", 
                    //     width: "10%" 
                    // },
                    // { 
                    //     field: "carapemberians", 
                    //     title: "Cara Pemberian", 
                    //     width: "15%",
                    //     editor: $scope.dropDownReouteFarmasi, 
                    //     template: "#=carapemberians.text#"
                    // },
                ]
            };





            function loadData() {
                // $scope.item = {}
                $scope.isRouteLoading = false;
                var tanggal = parseFloat(moment($scope.item.bulan).format('MM'));
                medifirstService.get('emr/get-data-kepatuhan-cuci-tanganload?&bulan=' + tanggal).then(function (data) {
                    $scope.isLoadingData = false;
                    var datas = data.data.data;
                    for (let index = 0; index < datas.length; index++) {
                        datas[index].no = index + 1;
                    }
                    $scope.bambang = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                }, function (error) {
                    $scope.isRouteLoading = false;
                    var tglAwal = moment($scope.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                    var tglAkhir = moment($scope.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                    throw error;
                })

            }
            $scope.Tambah = function () {
                // $scope.item = {}
                $scope.isRouteLoading = false;
                $scope.isEdit = false
                $scope.disabledText = false
                $scope.dialogPopup.center().open()

                var tglAwal = moment($scope.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
            }

            $scope.cetakPerRuangan = function () {

                var user = medifirstService.getPegawaiLogin();
                var periodeAwal = moment($scope.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var periodeAkhir = moment($scope.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                // var x= "WHERE (pp.noregistrasifk = '"+ $scope.norecAPD +"')and (pp.norec in ("+$scope.item.norecPP+ ')) and hh.flag is not null'
                // var y="http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg="+$scope.item.noregistrasi
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "periodeAwal", "periodeAkhir"],
                    "paramValue": ["", "RS BHAYANGKARA TK IV CIANJUR", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211, Telp. (0751)8465000, Psw. 177", user.namaLengkap, periodeAwal, periodeAkhir],
                    "paramType": ["", "", "", "date", "", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/chartPerRuangan.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1003/generic/report/chartPerRuangan.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1003/generic/report/chartPerRuangan.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/chartPerRuangan.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/chartPerRuangan.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/chartPerRuangan.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                //     });

                // $scope.isRouteLoading = true;
                // var tglAwal = moment($scope.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                //  var tglAkhir = moment($scope.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                //  var peg = ""
                //  var tempNoReg = "";
                //  if ($scope.item.pegawai != undefined) {
                //      var peg = "&pgid=" + $scope.item.pegawai.value
                //      tempNoReg =  { value: $scope.item.pegawai.value, text: $scope.item.pegawai.namalengkap }
                //  }
                //  var pr = ""
                //  var temppr = "";
                //  if ($scope.item.profesor != undefined) {
                //      var pr = "&prid=" + $scope.item.profesor.value
                //      temppr =  { value: $scope.item.profesor.value, text: $scope.item.profesor.jenispegawai }


                //  }
                //  var bng = ""
                //  var tembng = "";
                //  if ($scope.item.bangsal != undefined) {
                //      var bng = "&bngid=" + $scope.item.bangsal.value
                //      tembng =  { value: $scope.item.bangsal.value, text: $scope.item.bangsal.namaruangan }


                //  }
                //  var ind = ""
                //  var temindikasi = "";
                //  if ($scope.item.indikasi2 != undefined) {
                //      var ind = "&indikasiid=" + $scope.item.indikasi2.value
                //      temindikasi =  { value: $scope.item.indikasi2.value, text: $scope.item.indikasi2.indikasi }
                //  }       
                // medifirstService.get('emr/get-data-kepatuhan-handhygiene-perruangan?' + "tglAwal=" + tglAwal +
                //         "&tglAkhir=" + tglAkhir + peg + pr + bng + ind
                //     ).then(
                //     function (data) {
                //         debugger
                //         $scope.isLoadingData = false;
                //         var datas = data.data.data;

                //     },function (error) {
                //     $scope.isRouteLoading = false;
                //     throw error;
                // })

                // $scope.isRouteLoading = false;
            }
            $scope.clickedPopup = function () {
                $scope.item = {}
                $scope.dialogPopup.close();
            }
            $scope.Batal = function () {
                // $scope.item = {}
                $scope.dialogPopup.close();
            }
            $scope.Batal2 = function () {
                $scope.item = {}
                $scope.dialogPopup2.close();
            }
            $scope.lihatDetail = function () {
                init();
            }

            $scope.currentlistIndikasi = [];
            $scope.addlistIndikasi = function (data) {
                var index = $scope.currentlistIndikasi.indexOf(data);
                if (_.filter($scope.currentlistIndikasi, {
                    value: data.value
                }).length === 0)
                    $scope.currentlistIndikasi.push(data);
                else {
                    $scope.currentlistIndikasi.splice(index, 1);
                }
            }
            $scope.currentlistHand = [];
            $scope.addlistHand = function (data) {
                var index = $scope.currentlistHand.indexOf(data);
                if (_.filter($scope.currentlistHand, {
                    value: data.value
                }).length === 0)
                    $scope.currentlistHand.push(data);
                else {
                    $scope.currentlistHand.splice(index, 1);
                }
            }

            $scope.Save = function () {
                if ($scope.item.objectruanganfk == undefined || $scope.item.objectruanganfk.value == undefined) {
                    toastr.error('Pilih Bangsal Terlebih dahulu');
                    return
                }
                if ($scope.item.objectjenispegawaifk == undefined || $scope.item.objectjenispegawaifk.value == undefined) {
                    toastr.error('Pilih Pforesi Terlebih dahulu');
                    return
                }
                if ($scope.item.objectpegawaifk == undefined || $scope.item.objectpegawaifk.value == undefined) {
                    toastr.error('Pilih Pegawai Terlebih dahulu');
                    return
                }
                // var listRawRequired = [
                //     // "item.indikator|k-ng-model|Indikator",
                //     // "item.jenisIndikator|k-ng-model|Jenis Indikator",
                //     // "item.Departemen|k-ng-model|Departemen"
                // ]
                // var listIndikasi = ""
                //         var a = ""
                //         var b = ""
                //         for (var i = $scope.currentlistIndikasi.length - 1; i >= 0; i--) {
                //             var c = $scope.currentlistIndikasi[i].value
                //             b = "," + c
                //             a = a + b
                //         }
                //         listIndikasi = a.slice(1, a.length)
                // var listHand = ""
                //         var a = ""
                //         var b = ""
                //         for (var i = $scope.currentlistHand.length - 1; i >= 0; i--) {
                //             var c = $scope.currentlistHand[i].value
                //             b = "," + c
                //             a = a + b
                //         }
                //         listHand = a.slice(1, a.length)

                // var isValid = medifirstService.setValidation($scope, listRawRequired);
                var dataArray = [];
                for (let i = 0; i < $scope.dataIPCLN._data.length; i++) {
                    var norec = '';
                    if ($scope.dataIPCLN._data[i].objecthygienefk != undefined && $scope.dataIPCLN._data[i].objecthygienefk.value != '-') {
                        debugger
                        var langkah = 0;
                        if ($scope.dataIPCLN._data[i].objecthygienefk.value != 3) {
                            langkah = 2;
                        }
                        if ($scope.dataIPCLN._data[i].norec == undefined || $scope.dataIPCLN._data[i].norec == null || $scope.dataIPCLN._data[i].norec.length != 32) {
                            norec = '';
                        } else {
                            norec = $scope.dataIPCLN._data[i].norec;
                        }

                        dataArray.push({
                            "norec": norec,
                            "tanggal": moment($scope.tanggal).format('YYYY-MM-DD HH:mm'),
                            "objectruanganfk": $scope.item.objectruanganfk != undefined ? $scope.item.objectruanganfk.value : null,
                            "objectjenispegawaifk": $scope.item.objectjenispegawaifk != undefined ? $scope.item.objectjenispegawaifk.value : null,
                            "objectpegawaifk": $scope.item.objectpegawaifk != undefined ? $scope.item.objectpegawaifk.value : null,
                            "objectindikasifk": $scope.dataIPCLN._data[i].objectindikasifk.value != undefined ? $scope.dataIPCLN._data[i].objectindikasifk.value : null,
                            "objecthygienefk": $scope.dataIPCLN._data[i].objecthygienefk.value != undefined ? $scope.dataIPCLN._data[i].objecthygienefk.value : null,
                            "langkah": langkah,
                            "kesempatan": $scope.item.kesempatan != undefined ? $scope.item.kesempatan : 0,
                        });
                    }
                }

                // if (isValid.status) {

                if (dataArray.length !== 0) {
                    var objSave = {
                        "datas": dataArray
                    }
                    // var data = {
                    //     "norec" : norec,
                    //     "tanggal" :moment($scope.tanggal).format('YYYY-MM-DD HH:mm'),                        
                    //     "objectruanganfk" :$scope.item.objectruanganfk != undefined ? $scope.item.objectruanganfk.value : null,
                    //     "objectjenispegawaifk" :$scope.item.objectjenispegawaifk != undefined ? $scope.item.objectjenispegawaifk.value : null,
                    //     "objectpegawaifk" :$scope.item.objectpegawaifk != undefined ? $scope.item.objectpegawaifk.value : null,
                    //     "objectindikasifk" :listIndikasi != undefined ? listIndikasi : null,
                    //     "objecthygienefk" :listHand != undefined ? listHand : null,
                    //     "langkah" :$scope.item.langkah != undefined ? $scope.item.langkah : 0,
                    //     "kesempatan" :$scope.item.kesempatan != undefined ? $scope.item.kesempatan : 0,
                    // }
                    medifirstService.post("emr/save-kepatuhanhandhygiene-array", objSave).then(function (e) {
                        $scope.item = {};
                        init();
                        loadData();
                        $scope.dataIPCLN = {};
                        // $scope.dialogPopup.close();
                        // $scope.Tambah()
                    });
                }
                // } else {
                //     medifirstService.showMessages(isValid.messages);
                // }
                $scope.isRouteLoading = false;
                // var tglAwal = moment($scope.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                // var tglAkhir = moment($scope.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

            }

            $scope.resetFilter = function () {
                $scope.cari = {};
                init()
            }
            $scope.edit = function (bool) {
                if ($scope.dataSelect == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                for (var i = 0; i < $scope.listIndikasi.length; i++) {
                    $scope.listIndikasi[i].isChecked = false
                }
                for (var i = 0; i < $scope.listHand.length; i++) {
                    $scope.listHand[i].isChecked = false
                }
                norec = $scope.dataSelect.norec;
                $scope.tanggal = new Date($scope.dataSelect.tanggal);
                $scope.item.langkah = $scope.dataSelect.langkah;
                $scope.item.objectjenispegawaifk = { value: $scope.dataSelect.objectjenispegawaifk, text: $scope.dataSelect.jenispegawai };
                $scope.item.objectpegawaifk = { value: $scope.dataSelect.objectpegawaifk, text: $scope.dataSelect.namalengkap };
                // $scope.item.objectindikasifk = { value: $scope.dataSelect.objectindikasifk, text: $scope.dataSelect.indikasi };
                // $scope.item.objecthygienefk = { value: $scope.dataSelect.objecthygienefk, text: $scope.dataSelect.tindakan };
                $scope.item.objectruanganfk = { value: $scope.dataSelect.objectruanganfk, text: $scope.dataSelect.namaruangan };
                $scope.currentlistIndikasi = []
                var penjaminsLaka = $scope.dataSelect.objectindikasifk.split(',')

                for (var i = penjaminsLaka.length - 1; i >= 0; i--) {

                    var elem = penjaminsLaka[i]
                    for (var x = $scope.listIndikasi.length - 1; x >= 0; x--) {
                        var elem2 = $scope.listIndikasi[x]
                        if (elem == elem2.value) {
                            elem2.isChecked = true
                            var dataid = {
                                "text": elem2.text,
                                "indikasi": elem2.indikasi,
                                "value": elem
                            }
                            $scope.currentlistIndikasi.push(dataid)
                        }
                    }
                }
                $scope.currentlistHand = []
                var penjaminsLaka = $scope.dataSelect.objecthygienefk.split(',')

                for (var i = penjaminsLaka.length - 1; i >= 0; i--) {

                    var elem = penjaminsLaka[i]
                    for (var x = $scope.listHand.length - 1; x >= 0; x--) {
                        var elem2 = $scope.listHand[x]
                        if (elem == elem2.value) {
                            elem2.isChecked = true
                            var dataid = {
                                "text": elem2.text,
                                "indikasi": elem2.indikasi,
                                "value": elem
                            }
                            $scope.currentlistHand.push(dataid)
                        }
                    }
                }



                $scope.dialogPopup.center().open()
                if (bool) {
                    $scope.isEdit = true
                    $scope.disabledText = true
                } else {
                    $scope.isEdit = false
                    $scope.disabledText = false
                }
            }
            $scope.klikGrid = function (current) {
                debugger
                toastr.info(current.tanggal + " Terpilih");
                $scope.current = current;
                console.log(JSON.stringify($scope.current));
            }
            $scope.hapus = function () {
                if ($scope.dataSelect == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                var data = {
                    "norec": $scope.dataSelect.norec,
                }
                medifirstService.post('emr/batal-kepatuhan-handhygiene', data).then(function (e) {
                    init();
                    loadData();
                    // $scope.item = {}
                });
                // medifirstService.post("emr/batal-kepatuhan-cuci-tangan", data).then(function (e) {
                //        init();
                //        $scope.item = {}
                //    });
            }

            function deleteRow(e) {
                e.preventDefault();

                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var data = {
                    "id": dataItem.id,
                    "statusenabled": false,
                    "definisioperasional": dataItem.definisioperasional,
                    "formula": dataItem.formula,
                    "indikator": dataItem.indikator,
                    "pic": dataItem.pic,
                    "jenisindikatorfk": dataItem.jenisindikatorfk,
                    "numerator": dataItem.numerator,
                    "denominator": dataItem.denominator,

                }
                medifirstService.post("sysadmin/general/rensar/save-master-indikator", data).then(function (e) {
                    loadData();
                    $scope.item = {}
                });
            }

            function editRow(e) {
                e.preventDefault();
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                // var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem) {
                    $scope.item.id = dataItem.id
                    $scope.item.indikator = dataItem.indikator
                    $scope.item.pic = dataItem.pic
                    $scope.item.jenisIndikator = { id: dataItem.jenisindikatorfk, jenisindikator: dataItem.jenisindikator }
                    $scope.item.formula = dataItem.formula
                    $scope.item.denominator = dataItem.denominator
                    $scope.item.numerator = dataItem.numerator
                    $scope.item.do = dataItem.definisioperasional
                    $scope.dialogPopup.center().open()
                }

            }

            $scope.formatTanggalAjah = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }
            var timeoutPromise;
            $scope.$watch('cari.indikator', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal != oldVal) {
                        applyFilter("indikator", newVal)
                    }
                }, 500)
            })
            $scope.$watch('cari.pic', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal != oldVal) {
                        applyFilter("pic", newVal)
                    }
                }, 500)
            })

            $scope.$watch('cari.jenisIndikator', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    applyFilter("jenisindikator", newVal.jenisindikator)
                }
            })

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#gridMaster").data("kendoGrid");
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

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }

            $scope.resetFilter = function () {
                var dataGrid = $("#gridMaster").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.cari = {};
            }

            $scope.$watch('item.numerator', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var text = '';
                    var num = '';
                    var denom = '';
                    if ($scope.item.numerator == undefined) {
                        text = num + ' / ' + $scope.item.denominator + ' ' + ' x 100%'
                    } else if ($scope.item.denominator == undefined) {
                        text = $scope.item.numerator + ' / ' + denom + ' ' + ' x 100%'
                    } else {
                        text = $scope.item.numerator + ' / ' + $scope.item.denominator + ' ' + ' x 100%'
                    }
                    $scope.item.formula = text
                }
            });

            $scope.$watch('item.denominator', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    var text = $scope.item.numerator + ' / ' + $scope.item.denominator + 'x 100%'
                    $scope.item.formula = text
                }
            });

            //** BATAS SUCI */
        }
    ])
})