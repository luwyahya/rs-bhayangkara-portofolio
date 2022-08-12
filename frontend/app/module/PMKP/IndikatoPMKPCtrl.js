define(['initialize'], function (initialize) {

    'use strict';
    initialize.controller('IndikatoPMKPCtrl', ['$state', 'MedifirstService', '$rootScope', '$scope', 'DateHelper', '$timeout',
        function ($state, medifirstService, $rootScope, $scope, dateHelper, $timeout) {
            $scope.titleButton = 'Input Edukasi'
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.arrDokter = [];
            $scope.selectedData = [];
            var dataGrid = [];
            var datana = [];
            var data_head = [];
            var dataARR = [];
            var norecSasaran = '';
            var dataTea = [];
            $scope.istempatLaporan = true;
            $scope.item2 = {}
            $scope.monthSelectorOptions = function () {
                return {
                    start: "year",
                    depth: "year",
                    format: "MMMM yyyy",
                }
            }
            FormLoad();

            function FormLoad() {
                $scope.item.bulan = $scope.now;
                $scope.item2.bulan = $scope.now;
                // $scope.monthOnly = {
                //     start: "year",
                //     depth: "year",
                //     format: "MMMM yyyy",
                // };
                LoadCombo();
            }

            function LoadCombo() {
                // medifirstService.get('sysadmin/general/get-combo-ruangan?departemenfk=16').then(function (e) {
                //     $scope.listRuangan = e;
                // });

                medifirstService.get('sysadmin/general/get-combo-pegawai').then(function (e) {
                    $scope.listPegawai = e.data
                });

                // medifirstService.getPart("sysadmin/general/get-datacombo-departemen", true, true, 20).then(function (data) {
                //     $scope.listDepartemen = data;
                // });

                medifirstService.get("pmkp/get-data-combo-pmkp").then(function (data) {
                    var datas = data.data
                    $scope.listDepartemen = datas.listdept;
                })
            }

            $scope.getIsiComboRuangan = function () {
                if ($scope.item.departemen == undefined) {
                    $scope.listRuangan = $scope.item2.departemen.ruangan
                } else {
                    $scope.listRuangan = $scope.item.departemen.ruangan
                }

            }

            $scope.cekAll = function (bool) {
                if (bool) {
                    $scope.listDokter.forEach(function (e) {
                        e.isChecked = true
                        $scope.arrDokter.push(e)
                    })
                } else {
                    $scope.listDokter.forEach(function (e) {
                        e.isChecked = false
                        $scope.arrDokter = []
                    })
                }

            }

            $("#calendar").kendoCalendar();
            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.dataSourceGrid._data;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                        $scope.selectedData = []
                    }
                } else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                        $scope.selectedData.push(tempData[i])
                    }
                }

                console.log($scope.selectedData)
                reloaddataSourceGrid(tempData);
            }

            function reloaddataSourceGrid(ds) {

                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 20,
                    total: ds.length,
                    serverPaging: true,


                });
                dataTea = [];
                var grid = $('#kGrid').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();

            }

            $scope.selectRow = function (dataItem) {
                var dataSelect = _.find($scope.dataSourceGrid._data, function (data) {
                    return data.id == dataItem.id;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                    for (let i = 0; i < $scope.selectedData.length; i++) {
                        if (dataSelect.norec == $scope.selectedData[i].norec) {
                            $scope.selectedData.splice([i], 1)
                            break
                        }
                    }
                } else {
                    dataSelect.statCheckbox = true;
                    $scope.selectedData.push(dataSelect)
                }
                console.log($scope.selectedData)
            }


            $scope.formatTanggal = function (tanggal) {
                if (tanggal != "null")
                    return moment(tanggal).format('DD-MMM-YYYY HH:mm');
                else
                    return '-'
            }

            $scope.cariDokter = function () {
                $scope.listTempDokter = []
                if ($scope.item.cariDokter != undefined) {
                    var textbox = $scope.item.cariDokter.toLowerCase()
                    for (let i = 0; i < $scope.listDokterCari.length; i++) {
                        var arr = $scope.listDokterCari[i].namalengkap.toLowerCase()
                        if (arr.indexOf(textbox) != -1) {
                            $scope.listTempDokter.push($scope.listDokterCari[i])
                        }
                    }
                    $scope.listDokter = []
                    $scope.listDokter = $scope.listTempDokter
                }
                if ($scope.item.cariDokter == "" || $scope.item.cariDokter == undefined)
                    $scope.listDokter = $scope.listDokterCari
            }

            $scope.cariLaporan = function () {

                if ($scope.item2.bulan == undefined) {
                    toastr.error('Bulan Belum di pilih ')
                    return
                }
                if ($scope.item2.departemen == undefined) {
                    toastr.error('Departemen Belum di pilih ')
                    return
                }
                var bln = ''
                if ($scope.item2.bulan != undefined) {
                    bln = moment($scope.item2.bulan).format('YYYY-MM')
                }

                if ($scope.item2.departemen == undefined) {
                    medifirstService.get('pmkp/get-lap-indikator-mutu-pmkp?bln=' + bln).then(function (e) {
                        $scope.isRouteLoading = false;
                        debugger;
                        $scope.generateTable2(e)
                    })
                    medifirstService.get('pmkp/get-capaian-indikator-pmkp?bln=' + bln).then(function (res) {
                        $scope.isRouteLoading = false;
                        if (res.statResponse) {
                            var data = res.data
                            if (data.length > 0) {
                                for (let i = 0; i < data.length; i++) {
                                    data[i].no = i + 1;
                                    data[i].capaian = data[i].capaian + '%'
                                }
                            }
                            $scope.dataSourceCapaian = new kendo.data.DataSource({
                                data: data,
                                pageSize: 20,


                            })
                        }
                    })
                } else {


                    var idDept = ''
                    if ($scope.item2.departemen != undefined) {
                        // idDept = $scope.item2.departemen.id
                        if ($scope.item2.departemen.value == undefined) {
                            idDept = $scope.item2.departemen.id
                        } else {
                            idDept = $scope.item2.departemen.value
                        }
                    }
                    var idRuangan = ''
                    if ($scope.item2.ruangan != undefined) {
                        idRuangan = $scope.item2.ruangan.id
                    }
                    $scope.isRouteLoading = true;
                    //'pmkp/get-data-sasaran-mutu-pmkp?bulan=' + bln + idDept
                    //pmkp/get-data-indikator-departemen-pmkp?" + "idDept=" + $scope.item.Departemen.value        

                    medifirstService.get('pmkp/get-lap-indikator-mutu-pmkp?departemenfk=' + idDept + '&bln=' + bln + '&idRuangan=' + idRuangan).then(function (e) {
                        $scope.isRouteLoading = false;
                        debugger;
                        $scope.generateTable2(e)
                    })

                    medifirstService.get('pmkp/get-capaian-indikator-pmkp?departemenfk=' + idDept + '&bln=' + bln + '&idRuangan=' + idRuangan).then(function (res) {
                        $scope.isRouteLoading = false;
                        if (res.statResponse) {
                            var data = res.data
                            if (data.length > 0) {
                                for (let i = 0; i < data.length; i++) {
                                    data[i].no = i + 1;
                                    data[i].capaian = data[i].capaian + '%'
                                }
                            }

                            $scope.dataSourceCapaian = new kendo.data.DataSource({
                                data: data,
                                pageSize: 20,


                            })
                        }
                    })
                }

            }
            $scope.generateTable2 = function (e) {

                $scope.columnnss = [{
                    "field": "no",
                    "title": "<h3 align=center>No.<h3>",
                    "width": "48px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                },
                {
                    "field": "indikator",
                    "title": "<h3 align=center>Indikator<h3>",
                    "width": "210px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: left;"
                    }
                },
                {
                    "field": "keteranganinput",
                    "title": "<h3 align=center>Keterangan<h3>",
                    "width": "250px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: left;"
                    }
                },
                {
                    "field": "keterangan",
                    "title": "<h3 align=center>Numerator Dan Denominator<h3>",
                    "width": "210px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: left;"
                    }
                },
                {
                    "title": "<h3 align=center>" + $scope.getBulan() + "<h3>",
                    "columns": $scope.createColumn222(),
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                    // title: $scope.getBulan(),
                    // columns: $scope.createColumn(),
                },
                {
                    "field": "total",
                    "title": "<h3 align=center>Total<h3>",
                    "width": "410px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: left;"
                    },
                },
                    // {
                    //     "field": "denum",
                    //     "title": "<h3 align=center>Denum (B)<h3>",
                    //     "width": "410px",
                    //     "filterable": false,
                    //     attributes: {
                    //         "class": "table-cell",
                    //         style: "text-align: left;"
                    //     }
                    // },
                    // {
                    //     "field": "capaian",
                    //     "title": "<h3 align=center>Capaian (%)<h3>",
                    //     "width": "410px",
                    //     "filterable": false,
                    //     attributes: {
                    //         "class": "table-cell",
                    //         style: "text-align: left;"
                    //     }
                    // }
                ]
                $scope.mainGridLap = {
                    selectable: "row",
                    // dataBound: $scope.onDataBound,
                    // change: onChange,
                    columns: $scope.columnnss

                }
                var result = e.data
                let sama = false
                let arrGroup = [];
                for (let i = 0; i < result.length; i++) {
                    sama = false
                    for (let x = 0; x < arrGroup.length; x++) {
                        if (arrGroup[x].indikator == result[i].indikator && arrGroup[x].keterangan == result[i].keterangan) {
                            arrGroup[x].keterangan = result[i].keterangan
                            // arrGroup[x].total = parseFloat(result[i].nilai) + parseFloat(arrGroup[x].nilai)
                            var tgls = new Date(result[i].tgl).getDate().toString()
                            arrGroup[x]['date' + tgls] = result[i].nilai
                            sama = true;
                        }
                    }

                    if (sama == false) {
                        var tgls = new Date(result[i].tgl).getDate().toString()
                        let data = {
                            'tglnilai': result[i].tglnilai,
                            'tgl': result[i].tgl,
                            'nilai': result[i].nilai,
                            'num': result[i].num,
                            'denum': result[i].denum,
                            'capaian': result[i].capaian,
                            'keterangan': result[i].keterangan,
                            'indikator': result[i].indikator,
                            'denominator': result[i].denominator,
                            'numerator': result[i].numerator,
                            'keteranganinput': result[i].keteranganinput,
                            'ND': result[i].ND,
                            ['date' + tgls]: result[i].nilai
                        }
                        arrGroup.push(data)
                    }
                }


                var grid = $("#gridLap").data("kendoGrid");
                if (grid != undefined) {
                    grid.destroy();
                    // grid.gridLap( $scope.sourceJadwalBulanan);
                    $("#gridLap").empty().kendoGrid({
                        dataSource: $scope.sourceLaporan,
                        columns: $scope.columnnss,
                        // selectable: "cell",
                        // dataBound: $scope.onDataBound,
                        // options: $scope.mainGridOptionss
                    });
                }

                for (let x = 0; x < arrGroup.length; x++) {
                    const element = arrGroup[x];
                    var totalNum = 0
                    for (let l = 0; l <= $scope.createColumn222().length; l++) {
                        for (var key in element) {
                            if (element.hasOwnProperty(key)) {
                                if (key == "date" + l) {
                                    totalNum = totalNum + parseFloat(element["date" + l])
                                }
                            }
                        }
                    }
                    element.no = x + 1
                    element.total = totalNum
                }



                $scope.sourceLaporan = new kendo.data.DataSource({
                    data: arrGroup,
                });

            }

            $scope.inputJadwal = function () {
                $scope.isInput = !$scope.isInput
                // if ($scope.isInput) {
                //     $scope.titleButton = 'Hide Input Edukasi'                    
                // } else { $scope.titleButton = 'Input Edukasi' }     
                var deptID = ""
                if ($scope.item.departemen != undefined) {
                    deptID = $scope.item.departemen.id
                }

                var idRuangan = ""
                if ($scope.item.ruangan != undefined) {
                    idRuangan = $scope.item.ruangan.id
                }
                // if ($scope.item.departemen != undefined) {

                // } else {
                //     window.messageContainer.error("Departemen Masih Kosong");
                // }
                datana = [];
                medifirstService.get("pmkp/get-data-indikator-departemen-pmkp?idDept=" + deptID + "&idRuangan=" + idRuangan).then(function (e) {
                    var datas = e.data.data
                    for (let i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                    }
                    datana.push(datas);
                    $scope.generateTable()
                });
            }

            $scope.Hide = function () {
                $scope.isInput = false;
                $scope.sourceJadwalBulanan = new kendo.data.DataSource({
                    data: [],
                });
                $scope.item.departemen = undefined;
            }

            $scope.generateTable = function () {
                $scope.column = [{
                    "field": "no",
                    "title": "<h3 align=center>No.<h3>",
                    "width": "48px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                },
                {
                    "field": "indikator",
                    "title": "<h3 align=center>Indikator<h3>",
                    "width": "210px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: left;"
                    }
                },
                {
                    "field": "keteranganinput",
                    "title": "<h3 align=center>Keterangan<h3>",
                    "width": "250px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: left;"
                    }
                },
                {
                    "field": "keterangan",
                    "title": "<h3 align=center>Numerator Dan Denominator<h3>",
                    "width": "210px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: left;"
                    }
                },
                {
                    // numeratordenominator
                    "title": "<h3 align=center>" + $scope.getBulan() + "<h3>",
                    "columns": $scope.createColumn(),
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                    // title: $scope.getBulan(),
                    // columns: $scope.createColumn(),
                },
                    // {
                    //     "field": "num",
                    //     "title": "<h3 align=center>NUM (A)<h3>",
                    //     "width": "410px",
                    //     "filterable": false,
                    //     attributes: {
                    //         "class": "table-cell",
                    //         style: "text-align: left;"
                    //     },
                    // },
                    // {
                    //     "field": "denum",
                    //     "title": "<h3 align=center>Denum (B)<h3>",
                    //     "width": "410px",
                    //     "filterable": false,
                    //     attributes: {
                    //         "class": "table-cell",
                    //         style: "text-align: left;"
                    //     }
                    // },
                    // {
                    //     "field": "capaian",
                    //     "title": "<h3 align=center>Capaian (%)<h3>",
                    //     "width": "410px",
                    //     "filterable": false,
                    //     attributes: {
                    //         "class": "table-cell",
                    //         style: "text-align: left;"
                    //     }
                    // }
                ]
                $scope.mainGridOptionss = {
                    selectable: "cell",
                    dataBound: $scope.onDataBound,
                    // change: onChange,
                    columns: $scope.column

                }

                var grid = $("#gridBulan").data("kendoGrid");
                if (grid != undefined) {
                    grid.destroy();
                    // grid.setDataSource( $scope.sourceJadwalBulanan);
                    $("#gridBulan").empty().kendoGrid({
                        dataSource: $scope.sourceJadwalBulanan,
                        columns: $scope.column,
                        selectable: "cell",
                        dataBound: $scope.onDataBound,
                        // options: $scope.mainGridOptionss
                    });
                }
                for (let i = 0; i < datana[0].length; i++) {
                    const element = datana[0][i];
                    element.listTgl = []
                    element.detail = [];

                }
                dataARR = []
                dataARR = datana[0]
                $scope.kuntul = datana[0]
                $scope.sourceJadwalBulanan = new kendo.data.DataSource({
                    data: datana[0],
                });

            }

            $scope.bulanSelected = moment($scope.item.bulan).format("MMMM YYYY")

            $scope.getBulan = function () {
                $scope.bulanString = moment($scope.item.bulan).format("MMMM YYYY")
                return "<center>" + $scope.bulanString + "</center>";
            }

            function getHeader() {
                var kolomTitle = "Capaian : " + DateHelper.getBulanFormatted(new Date($scope.item.bulan));
                return kolomTitle;
            }

            $scope.createColumn = function () {
                var year = parseInt(moment($scope.item.bulan).format("Y"))
                var month = parseInt(moment($scope.item.bulan).format("M"))
                var tempDate = new Date(year, month, 0);

                var list = [];

                for (var i = 0; i < tempDate.getDate(); i++) {
                    var data = {
                        field: "[" + (i + 1) + "]",
                        title: (i + 1).toString(),
                        format: "{0:n1}",
                        width: "50px"
                    };

                    list.push(data);
                }

                return list;
            }
            $scope.createColumn222 = function () {
                var year = parseInt(moment($scope.item2.bulan).format("Y"))
                var month = parseInt(moment($scope.item2.bulan).format("M"))
                var tempDate = new Date(year, month, 0);

                var list = [];

                for (var i = 0; i < tempDate.getDate(); i++) {
                    var data = {
                        field: "date" + (i + 1),
                        title: (i + 1).toString(),
                        format: "{0:n1}",
                        width: "50px"
                    };

                    list.push(data);
                }

                return list;

            }

            $scope.addDokter = function (bool, data) {
                var index = $scope.arrDokter.indexOf(data);
                if (_.filter($scope.arrDokter, {
                    id: data.id
                }).length === 0 && bool)

                    $scope.arrDokter.push(data);
                else
                    $scope.arrDokter.splice(index, 1);
            }


            $scope.onDataBound = function (e) {
                data_head = [];
                var grid = $("#gridBulan").data("kendoGrid");
                $(grid.tbody).on("click", "td", function (e) {
                    var row = $(this).closest("tr");
                    var colIdx = $("td", row).index(this);
                    var num = 0;
                    var denum = 0;
                    var capaian = 0;
                    data_head = [];
                    $scope.selectedData = grid.dataItem(row);
                    if (colIdx > 3) {
                        var person = prompt("Masukan Nilai Sensus", "");
                        e.currentTarget.innerText = person
                        var colDateIdx = colIdx - 3;
                        if (colIdx > 33) {
                            var colMain = colIdx - 32
                            var colReal = 0;
                            if (colMain == 4) {
                                colReal = colMain + 1
                            } else if (colMain == 3) {
                                colReal = colMain + 2
                            } else if (colMain == 2) {
                                colReal = colMain + 3
                            } else {
                                colReal = colMain
                            }
                            var columns = grid.options.columns[colReal].title;
                            var field = grid.options.columns[colReal].field;
                            if (field == "num") {
                                var totNum = 0;
                                num = e.currentTarget.innerText
                                $scope.numerator = parseFloat(totNum) + parseFloat(num)
                            } else if (field == "denum") {
                                var totDen = 0;
                                denum = e.currentTarget.innerText
                                $scope.denumerator = parseFloat(totDen) + parseFloat(denum)
                            } else if (field == "capaian") {
                                var totCap = 0;
                                capaian = e.currentTarget.innerText
                                $scope.Capaian = parseFloat(totCap) + parseFloat(capaian)
                            }
                        }
                        var colName = $('#gridBulan tr').eq(1).find('th').eq(colDateIdx).text();
                        if (colName.length == 1) {
                            colName = "0" + colName;
                        }
                        if (colName.length <= 3) {
                            // var date = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + colName;  
                            var tgl = dateHelper.getFormatMonthPicker($scope.item.bulan);
                            var Tglset = "";
                            var tglTea = colDateIdx
                            if (tglTea.toString().length > 1) {
                                Tglset = colDateIdx
                            } else {
                                Tglset = '0' + colDateIdx
                            }
                            // $scope.selectedData.listTgl = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + Tglset;
                            var date = null;
                            if (colDateIdx <= 31) {
                                var date = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + Tglset //$scope.selectedData.listTgl
                            }
                            $scope.pushKeArray($scope.selectedData.no, norecSasaran, $scope.selectedData.id, $scope.selectedData.indikator, $scope.selectedData.listTgl, date, e.currentTarget.innerText, num, denum, capaian, $scope.selectedData.keterangan, $scope.selectedData.numeratordenominator);
                        }
                    }
                });
            }

            $scope.batal = function () {
                $scope.item.jumlahPengunjung = undefined;
            }

            $scope.pushKeArray = function (no, norec, id, indikator, list, date, isi, num, denum, capaian, keterangan, ND) {
                // debugger

                for (let i = 0; i < dataARR.length; i++) {
                    const element = dataARR[i];
                    if (isi == '') {
                        if (element.id == id && element.keterangan == keterangan) {
                            for (let e = 0; e < element.listTgl.length; e++) {
                                // const element2 = element.listTgl[e];
                                if (element.listTgl[e] == date) {
                                    element.listTgl.splice([e])
                                }
                            }

                        }
                    } else {
                        if (element.id == id && element.keterangan == keterangan) {
                            // element.listTgl.push(date);
                            // var data = {
                            //     'norecSasaran': norec,
                            //     'isi': isi,
                            //     'tglnilai': date,
                            //     'tgl': date,
                            //     'num': num,
                            //     'denum': denum,
                            //     'capaian': capaian
                            // }
                            // element.detail.push(data)
                            // for (var o = dataARR.length - 1; o >= 0; o--) {
                            // if (element.id == id) {
                            var data = {
                                'indikatorfk': id,
                                'norecSasaran': norec,
                                'isi': isi,
                                'tglnilai': date,
                                'tgl': date,
                                'num': num,
                                'denum': denum,
                                'capaian': capaian,
                                'keterangan': ND,
                            }
                            dataTea.push(data);
                            // dataARR[o].norec = norecSasaran;
                            // dataARR[o].isi = isi;                                   
                            // dataARR[o].listTgl = date;
                            // dataARR[o].tglnilai = date;
                            // dataARR[o].num = num;
                            // dataARR[o].denum = denum;
                            // dataARR[o].capaian = capaian;
                            // }
                            // }
                            // dataTea.push(dataARR);                   
                        }
                    }
                }
                console.log(dataTea)
            }

            $scope.save = function () {
                if ($scope.item.departemen == undefined) {
                    toastr.error('Departemen Tidak Boleh Kosong')
                    return
                }
                var data2 = []
                // var isi = ' ';                
                // for (let i = 0; i < dataARR.length; i++) {
                //     for (let j = 0; j < dataARR[i].listTgl.length; j++) {
                //         for (let k = 0; k < dataARR[i].detail.length; j++) {
                //             data2.push({
                //                 'tgl': dataARR[i].listTgl[j],
                //                 'detail': dataARR[i].detail[k],
                //                 'indikatorfk': dataARR[i].id,
                //             })
                //         }
                //     }
                // }
                if (dataTea == undefined) {
                    // data2.push(dataTea);
                    toastr.error('Data Tidak Boleh Kosong')
                    return
                }
                var objSave = {
                    'departemenfk': $scope.item.departemen != undefined ? $scope.item.departemen.id : null,
                    'ruanganfk': $scope.item.ruangan != undefined ? $scope.item.ruangan.id : null,
                    'capaian': $scope.Capaian != undefined ? $scope.Capaian : 0,
                    'denumerator': $scope.denumerator != undefined ? $scope.denumerator : 0,
                    'numerator': $scope.numerator != undefined ? $scope.numerator : 0,
                    'data': dataTea
                }
                medifirstService.post('pmkp/save-data-sasaran-mutu', objSave).then(function (e) {
                    searchData()
                })
            }

            function searchData() {
                var bln = moment($scope.item.bulan).format('MM.YYYY')
                var idDept = ''
                if ($scope.item.departemen != undefined) {
                    if ($scope.item.departemen.value == undefined) {
                        idDept = '&idDept=' + $scope.item.departemen.id
                    } else {
                        idDept = '&idDept=' + $scope.item.departemen.value
                    }

                }
                $scope.isRouteLoading = true;
                //'pmkp/get-data-sasaran-mutu-pmkp?bulan=' + bln + idDept
                //pmkp/get-data-indikator-departemen-pmkp?" + "idDept=" + $scope.item.Departemen.value             
                medifirstService.get('pmkp/get-data-indikator-departemen-pmkp?' + idDept).then(function (e) {
                    $scope.isRouteLoading = false;
                    dataGrid = e.data.data;
                    for (let i = 0; i < dataGrid.length; i++) {
                        dataGrid[i].no = i + 1;
                    }

                    $("#gridOrder").kendoGrid({
                        dataSource: {
                            data: dataGrid,
                        },
                        toolbar: [
                            "excel",
                        ],
                        excel: {
                            fileName: "sensushariansasaranmutu.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) { },
                        editable: false,
                        scrollable: true,
                        selectable: "row",
                        columns: [{
                            "field": "no",
                            "title": "<h3 align=center>NO<h3>",
                            "width": "50px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        },
                        {
                            "field": "indikator",
                            "title": "<h3 align=center>Indikator<h3>",
                            "width": "600px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        },
                        {
                            "field": "keterangan",
                            "title": "<h3 align=center>Keterangan<h3>",
                            "width": "600px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        },
                        {
                            "title": "<h3 align=center>Tanggal<h3>",
                            "columns": $scope.createColumn(),
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: center;"
                            }
                        },
                        {
                            "field": "num",
                            "title": "<h3 align=center>NUM (A)<h3>",
                            "width": "410px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            },
                        },
                        {
                            "field": "denum",
                            "title": "<h3 align=center>Denum (B)<h3>",
                            "width": "410px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        },
                        {
                            "field": "capaian",
                            "title": "<h3 align=center>Capaian (%)<h3>",
                            "width": "410px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        }
                        ]
                    })

                    $scope.dataSource = new kendo.data.DataSource({
                        data: dataGrid,
                        total: dataGrid.length,
                        // group: { field: "jeniskeselamatan" },
                        schema: {
                            model: {}
                        }
                    });
                    GetLaporan();
                })
            }

            function GetLaporan() {
                var bln = moment($scope.item.bulan).format('MM.YYYY')
                var idDept = ''
                if ($scope.item.departemen != undefined) {

                    // idDept = '&idDept=' + $scope.item.departemen.value
                    if ($scope.item.departemen.value == undefined) {
                        idDept = '&idDept=' + $scope.item.departemen.id
                    } else {
                        idDept = '&idDept=' + $scope.item.departemen.value
                    }
                }
                $scope.isRouteLoading = false;
                medifirstService.get('pmkp/get-data-sasaran-mutu-pmkp?bulan=' + bln + idDept).then(function (e) {
                    $scope.datasSearch = e.data
                    for (var i = $scope.datasSearch.length - 1; i >= 0; i--) {
                        $scope.datasSearch[i].no = i + 1
                        if (parseFloat($scope.datasSearch[i].nilai) != 0) {
                            $scope.datasSearch[i].isian = parseFloat($scope.datasSearch[i].nilai)
                        } else {
                            $scope.datasSearch[i].isian = 0
                        }
                    }

                    if (!$scope.datasSearch) {
                        return toastr.success('Data tidak ditemukan', 'Info');
                    };

                    var Data = e.data.data;
                    var Datas = $scope.dataSource._data
                    $scope.datasSearch.forEach(function (element) {
                        var customData = {};
                        for (var key in element) {
                            switch (key) {
                                case "tgl":
                                    var tgl = element.tgl;
                                    var key = tgl.slice(-1);
                                    if (key[0] === "0") {
                                        customData[key] = element.isian;
                                    } else {
                                        customData[key] = element.isian;
                                    }
                                    break;
                                default:
                                    customData[key] = element[key];
                                    break;
                            }
                        };
                        dataGrid.push(customData);
                    });

                    $scope.mainGridOption = {
                        // $("#gridOrder").kendoGrid({
                        dataSource: {
                            data: dataGrid,

                        },
                        toolbar: [
                            "excel",
                        ],
                        excel: {
                            fileName: "sensushariansasaranmutu.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) { },
                        editable: false,
                        scrollable: true,
                        selectable: "row",
                        // sortable: true,
                        columns: [{
                            "field": "no",
                            "title": "<h3 align=center>NO<h3>",
                            "width": "50px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        },
                        {
                            "field": "keselamatan",
                            "title": "<h3 align=center>Insiden Keselamatan Pasien<h3>",
                            "width": "600px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        },
                        {
                            "field": "isian",
                            "title": "<h3 align=center>Tanggal<h3>",
                            "columns": $scope.createColumn(),
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: center;"
                            }
                        }, ,
                        {
                            "field": "num",
                            "title": "<h3 align=center>NUM (A)<h3>",
                            "width": "410px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            },
                        },
                        {
                            "field": "denum",
                            "title": "<h3 align=center>Denum (B)<h3>",
                            "width": "410px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        },
                        {
                            "field": "capaian",
                            "title": "<h3 align=center>Capaian (%)<h3>",
                            "width": "410px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        }
                        ]
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: dataGrid,
                    });
                });
            }

            var timeoutPromise;
            $scope.$watch('item.cariDokters', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("namalengkap", newVal)
                    }
                }, 500)
            })

            $scope.cariDokterGrid = function () {
                applyFilter("namalengkap", $scope.item.cariDokters)
            }

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#kGrid").data("kendoGrid");
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
                var dataGrid = $("#kGrid").data("kendoGrid");
                dataGrid.dataSource.filter({});
                delete $scope.item.cariDokters;
            }

            $scope.hapusJadwal = function () {
                if ($scope.selectedData.length == 0) {
                    toastr.error('Ceklis data yang mau dihapus')
                    return
                }
                var json = {
                    'data': $scope.selectedData
                }
                medifirstService.post('rawatinap/hapus-jadwal-perbulan-pegawai', json).then(function (e) {
                    searchData()
                }, function error() {

                })
            }

            $scope.cari = function () {
                searchData();
            }

            $scope.generateTables = function () {
                $scope.columns = [{
                    "field": "no",
                    "title": "<h3 align=center>No.<h3>",
                    "width": "48px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                },
                {
                    "field": "jeniskegiatan",
                    "title": "<h3 align=center>Jenis Kegiatan<h3>",
                    "width": "410px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: left;"
                    }
                },
                {
                    "field": "isian",
                    "title": "<h3 align=center>" + $scope.getBulan() + "<h3>",
                    "columns": $scope.createColumn(),
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                    // title: $scope.getBulan(),
                    // columns: $scope.createColumn(),
                }
                ]
            }

            $scope.generateGridColumn = function () {
                var year = $scope.item.bulan.getYear();
                var month = $scope.item.bulan.getMonth();
                var dateInMonth = new Date(year, month + 1, 0);
                var listDay = [];
                for (var i = 0; i < dateInMonth.getDate(); i++) {
                    var data = {
                        field: "[" + (i + 1) + "]",
                        title: (i + 1).toString(),
                        width: "50px",
                        attributes: { style: "text-align: right;" },
                        headerAttributes: { style: "text-align: center;  " }
                    };
                    listDay.push(data);
                }
                return listDay;
            }

            $scope.optionGridMaster = {
                pageable: true,
                columns: [
                    { field: "no", title: "No", width: '10%' },
                    { field: "indikator", title: "Indikator", width: '70%' },
                    { field: "capaian", title: "Capaian", width: '20%' },
                ],
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
                var bln = ''
                if ($scope.item2.bulan != undefined) {
                    bln = moment($scope.item2.bulan).format('YYYY-MM')
                }

                var idDept = ''
                if ($scope.item2.departemen != undefined) {
                    idDept = $scope.item2.departemen.id
                }

                var idRuangan = ''
                if ($scope.item2.ruangan != undefined) {
                    idRuangan = $scope.item2.ruangan.id
                }

                var stt = 'false'
                if (confirm('View Laporan Indikator Mutu? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/pmkp?cetak-lap-sensus-indikator-mutu&tgl=' + bln + '&dept=' + idDept + '&idruangan=' + idRuangan + '&view=' + stt, function (response) {
                    // do something with response
                });
            }

            $scope.cetakJasper = function () {
                debugger


                if ($scope.item2.bulan == undefined) {
                    toastr.error('Bulan Belum di pilih ')
                    return
                }
                if ($scope.item2.departemen == undefined) {
                    toastr.error('Departemen Belum di pilih ')
                    return
                }
                var bln = ''
                if ($scope.item2.bulan != undefined) {
                    bln = moment($scope.item2.bulan).format('YYYY-MM')
                }


                var idDept = ''
                if ($scope.item2.departemen != undefined) {
                    idDept = $scope.item2.departemen.id
                }
                var idRuangan = ''
                var Ruangan = ''
                if ($scope.item2.ruangan != undefined) {
                    idRuangan = $scope.item2.ruangan.id
                    Ruangan = $scope.item2.ruangan.namaruangan
                } else {
                    if ($scope.item2.departemen != undefined) {
                        Ruangan = $scope.item2.departemen.departemen;
                    }
                }

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "departemenfk", "tglnilai", "idRuangan", "namaRuangan"],
                    "paramValue": ["", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176, Telp. (0751)8465000", idDept, bln, idRuangan, Ruangan],
                    "paramType": ["", "", "", "", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakSensusHarianSasaranMutuPMKP.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1003/generic/report/cetakSensusHarianSasaranMutuPMKP.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1003/generic/report/cetakSensusHarianSasaranMutuPMKP.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakSensusHarianSasaranMutuPMKP.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakSensusHarianSasaranMutuPMKP.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakSensusHarianSasaranMutuPMKP.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));


            }
            //** BATAS SUCI */
        }
    ]);

});