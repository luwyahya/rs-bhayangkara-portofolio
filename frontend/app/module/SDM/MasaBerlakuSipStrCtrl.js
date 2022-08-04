define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MasaBerlakuSipStrCtrl', ['$mdDialog','CacheHelper', '$scope', '$state', 'MedifirstService', 'DateHelper', '$window',
    function ($mdDialog,cacheHelper, $scope, $state, medifirstService, DateHelper, $window) {
        $scope.item = {};
        $scope.model = {};
        $scope.dataSelected = {};
        $scope.isRouteLoading = false;
        $scope.now = new Date();
        loadCombo()
        // loadDataSip()
        // loadFixLahAsu()
        $scope.cari = function () {
            var idPegawai = ''
            if ($scope.item.pegawai != undefined) {
                idPegawai = "idPegawai=" + $scope.item.pegawai.id
            }
            var ruangan = ''
            if (idPegawai == '') {
                if ($scope.item.ruangan != undefined) {
                    ruangan = "idRuangan=" + $scope.item.ruangan.id
                }
            } else {
                if ($scope.item.ruangan != undefined) {
                    ruangan = "&idRuangan=" + $scope.item.ruangan.id
                }
            }
            var instalasi = ''
            if (idPegawai == '' && ruangan == '') {
                if ($scope.item.instalasi != undefined) {
                    instalasi = "idInstalasi=" + $scope.item.instalasi.id
                }
            } else {
                if ($scope.item.instalasi != undefined) {
                    instalasi = "&idInstalasi=" + $scope.item.instalasi.id
                }
            }
            debugger
            var isDokter = ''
            if (idPegawai == '' && ruangan == '' && instalasi == '') {
                if ($scope.model.cekpilihManual == true) {
                    isDokter = "isDokter=" + $scope.model.cekpilihManual
                }
            } else {
                if ($scope.model.cekpilihManual == true) {
                    isDokter = "&isDokter=" + $scope.model.cekpilihManual
                }
            }
            loadFixLahAsu(idPegawai, ruangan, instalasi, isDokter)
        }

        function loadFixLahAsu(idPegawai, ruangan, instalasi, isDokter) {
            $scope.isRouteLoading = true
            medifirstService.get('sdm/get-masa-berlaku-sipstr-pegawai?' + idPegawai + ruangan + instalasi + isDokter).then(function(dat) {
                debugger
                $scope.isRouteLoading = false
                var data = dat.data
                for (let i = 0; i < data.length; i++) {
                    data[i].flagsip = "N"
                    data[i].flagstr = "N"
                    if(data[i].berakhirsip != "") {
                        var tglsip = moment(data[i].berakhirsip).format('YYYY-MM-DD')
                        if (tglsip <= moment($scope.now).add('days', -90).format('YYYY-MM-DD')) {
                            data[i].flagsip = "Y"
                        }
                    }
                    if (data[i].berakhirstr != "") {
                        var tglstr = moment(data[i].berakhirstr).format('YYYY-MM-DD')
                        if (tglstr <= moment($scope.now).add('days', -90).format('YYYY-MM-DD')) {
                            data[i].flagstr = "Y"
                        }
                    }
                }
                if ($scope.model.cekpilihManual2 == true) {
                    var data2 = [];
                    for (let j = 0; j < data.length; j++) {
                        if (data[j].flagsip == "Y" && data[j].flagstr == "N") {
                            data2.push(data[j])
                        }
                        if (data[j].flagsip == "N" && data[j].flagstr == "Y") {
                            data2.push(data[j])
                        }
                        if (data[j].flagsip == "Y" && data[j].flagstr == "Y") {
                            data2.push(data[j])
                        }
                    }
                    data = [];
                    data = data2;
                }
                $scope.sourceLaporan = new kendo.data.DataSource({
                    data: data,
                    pageSize: 50,
                    total: data.length,
                    schema:{
                        model: {
                            fields: {
                                
                            }
                        }
                    },
                    refresh: true,
                    selectable: true,
                    refresh: true,
                    groupable: true,
                    allowCopy: true,
                })
                $scope.columnLaporan = {
                    toolbar: [
                        "excel"
                    ],
                    excel: {
                        fileName: "SipStrExpired.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
    
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:P1"];
                        sheet.name = "LAPORAN";
    
                        // var myHeaders = [
    
                        //     {
                        //         value: "LAPORAN POLRI PNS PERIODE REGISTRASI " + DateHelper.formatDate($scope.item.tanggalAwal, 'DD-MM-YY') + ' sampai ' +
                        //             DateHelper.formatDate($scope.item.tanggalAkhir, 'DD-MM-YY'),
                        //         fontSize: 15,
                        //         textAlign: "center",
                        //         background: "#c1d2d2",
                        //     }];
    
                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                    },
                    selectable: 'row',
                    sortable: true,
                    reorderable: true,
                    filterable: true,
                    pageable: true,
                    columnMenu: false,
                    resizable: true,
                    scrollable: false,
                    columns: [
                        {
                            "field": "namalengkap",
                            "title": "Nama",
                        },
                        {
                            "field": "ruangankerja",
                            "title": "Ruang Kerja",
                        },
                        {
                            "field": "jenispegawai",
                            "title": "Jenis Pegawai",
                        },
                        {
                            "field": "nosip",
                            "title": "No Sip",
                        },
                        {
                            "field": "terbitsip",
                            "title": "Terbit Sip",
                            "template": "<span class='style-left'>{{formatTanggal('#: terbitsip #')}}</span>"
                        },
                        {
                            "field": "berakhirsip",
                            "title": "Berakhir SIP",
                            "template": "<span class='style-left'>{{formatTanggal('#: berakhirsip #')}}</span>",
                            attributes: {
                                class: "#=flagsip == 'Y' ? 'red' : 'green' #"
                            },
                        },
                        {
                            "title": "File SIP",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"fileSip(dataItem)\" style=\"margin:0 0 5px\">Lihat File SIP</button>",
                        },
                        {
                            "field": "nostr",
                            "title": "No STR"
                        },
                        {
                            "field": "terbitstr",
                            "title": "Terbit STR",
                            "template": "<span class='style-left'>{{formatTanggal('#: terbitstr #')}}</span>"
                        },
                        {
                            "field": "berakhirstr",
                            "title": "Berakhir STR",
                            "template": "<span class='style-left'>{{formatTanggal('#: berakhirstr #')}}</span>",
                            attributes: {
                                class: "#=flagstr == 'Y' ? 'red' : 'green' #"
                            },
                        },
                        {
                            "title": "File STR",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"fileStr(dataItem)\" style=\"margin:0 0 5px\">Lihat File STR</button>",
                        }
                    ]
                }
            })
        }
        
        function loadCombo() {
            medifirstService.get('sdm/get-combo-sip-str?').then(function(dat) {
                $scope.listPegawai = dat.data.pegawai;
                $scope.listRuangan = dat.data.ruangan;
                $scope.listInstalasi = dat.data.instalasi;
                dataPegawai = dat.data.pegawai;
            })
        }
        $scope.fileSip = function(dataItem) {
            $scope.isRouteLoading = true
            medifirstService.get('sdm/get-file-sip?idPegawai=' + dataItem.idPegawai).then(function(dat) {
                debugger
                $scope.isRouteLoading = false
                if (dat.data.length == 0) {
                    alert('File SIP tidak ditemukan !')
                    return
                }
                const win = window.open("","_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="'+dat.data[0].filesip2+'" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                win.document.write(html);
                }, 0);
            })
        }
        $scope.fileStr = function(dataItem) {
            $scope.isRouteLoading = true;
            medifirstService.get('sdm/get-file-str?idPegawai=' + dataItem.idPegawai).then(function(dat) {
                debugger
                $scope.isRouteLoading = false;
                if (dat.data.length == 0) {
                    alert('File STR tidak ditemukan !')
                    return
                }
                const win = window.open("","_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="'+dat.data[0].filestr2+'" type="application/pdf" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                win.document.write(html);
                }, 0);
            })
        }
        $scope.formatTanggal = function (tanggal) {
            if (tanggal == '')
                return ''
            else
                return moment(tanggal).format('DD-MMM-YYYY');
        }
    }
])
})