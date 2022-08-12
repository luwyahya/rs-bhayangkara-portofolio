define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PermohonanCutiCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', 'DateHelper', '$mdDialog', 'CetakHelper', '$state', 'MedifirstService', '$timeout',
        function ($q, $rootScope, $scope, ModelItem, DateHelper, $mdDialog, cetakHelper, $state, medifirstService, $timeout) {

            $scope.pegawai = JSON.parse(localStorage.getItem('pegawai'));
            $scope.isRouteLoading = false;
            $scope.item = {};
            var urlDaftarPermohonan;
            var listPegawaiAdminSDM = [];
            $scope.item.qRows = 100
            $scope.istempatLaporan = true;
            $scope.tanggalPermohonan = [{
                id: 1,
                tgl: "",
                isDuplicate: false
            }]
            $scope.tanggalPermohonanBersama = [{
                id: 1,
                tgl: "",
                isDuplicate: false
            }]

            var isLoginSDM = true
            var isNotSDM = false

            if (medifirstService.getKelompokUser() == 'sdm') {
                isLoginSDM = false
                isNotSDM = true
                $scope.bukanLoginSDM = false
            } else {
                $scope.bukanLoginSDM = true

            }
            $scope.isRouteLoading = false
            $scope.now = new Date();
            $scope.item.tglPengajuan = new Date()
            $scope.titlePelimpahan = ''
            $scope.listApprove = [
                { id: 0, name: ' Belum diputuskan' },
                { id: 1, name: 'Disetujui' },
                { id: 2, name: 'Dibatalkan' }
            ]
            $scope.listTglCekbox = [];

            function twoDaysAfter(date) {
                var newDate = date;

                newDate.setDate(newDate.getDate() + 2);

                var dd = newDate.getDate(),
                    mm = newDate.getMonth() + 1,
                    yy = newDate.getFullYear();

                if (dd.length < 10) {
                    dd = "0" + dd;
                }

                return yy + "-" + mm + "-" + dd;
            }
            loadData()
            $scope.cari = function () {
                loadData()
            }
            $scope.next2days = new Date().setDate(new Date().getDate() + 2);
            $scope.monthSelectorOptions = {
                start: "year",
                depth: "year"
            };
            $scope.datePickerOptions = {
                format: 'dd-MM-yyyy',
                change: onChangeDate
                // min: twoDaysAfter($scope.now)
            }
            $scope.datePickerOptions2 = {
                format: 'dd-MM-yyyy',
                change: onChangeDate2
                // min: twoDaysAfter($scope.now)
            }
            medifirstService.get("sdm/get-data-combo-sdm?", true).then(function (dat) {
                var dataCombo = dat.data
                // var dataLogin = dat.datalogin[0];
                $scope.listUnitKerja = dataCombo.dataunitkerja;
                $scope.ListKedudukanPegawai = dataCombo.statuspegawai;
                $scope.ListStatusPegawai = dataCombo.kategorypegawai;
            });
            medifirstService.get('sdm/get-pegawai-all').then(function (e) {
                $scope.listPegawai = e.data.pegawai

                $scope.listStatusCuti = e.data.jeniscuti
            })
            $scope.getDetailPegawai = function (data) {
                $scope.item.nip = data.nip
                $scope.item.jabatan = data.namajabatan
                $scope.item.ruangan = data.subunitkerja
            }

            $scope.mainGridOptions = {
                pageable: true,
                selectable: true,
                toolbar: [{
                    name: "add",
                    text: "Tambah",
                    template: '<button ng-click="tambahCutiBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                },
                {

                    name: "add",
                    text: "Cuti Bersama",
                    template: '<button ng-click="tambahCutiBersama()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Cuti Bersama</button>'
                },
                ],
                columns: [


                    {
                        "field": "noplanning",
                        "title": "No Permohonan"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Pegawai"
                    },
                    {
                        "field": "namajabatan",
                        "title": "Jabatan"
                    },
                    {
                        "field": "unitkerja",
                        "title": "Sub Unit Kerja"
                    },
                    {
                        "field": "desk",
                        "title": "Deskripsi "
                    },
                    {
                        "field": "tglpengajuan",
                        "title": "Tgl Permohonan",
                        "template": "#= kendo.toString(new Date(tglpengajuan), 'dd-MM-yyyy') #",
                        width: 100
                    },
                    {
                        "field": "statuspermohonan",
                        "title": "Status Permohonan"
                    },
                    {
                        "field": "listtanggal",
                        "title": "Tgl Permohonan",
                        "template": "# for(var i=0; i < listtanggal.length;i++){# <button class=\"k-button custom-button\" style=\"margin:0 0 5px\">#= kendo.toString(new Date(listtanggal[i].tgl), \"dd-MM-yyyy\") #</button> #}#",
                    },
                    {
                        "field": "listtanggalapprove",
                        "title": "Tgl Permohonan Disetujui",
                        "template": "# for(var i=0; i < listtanggalapprove.length;i++){# <button class=\"k-button custom-button\" style=\"margin:0 0 5px\">#= kendo.toString(new Date(listtanggalapprove[i].tgl), \"dd-MM-yyyy\") #</button> #}#",
                    },
                    {
                        "field": "approvalstatus",
                        "title": "Persetujuan",
                        "template": "#if(approvalstatus== null){# Menunggu Persetujuan Kasi/Kasubbag #}  if(approvalstatus==1) {# Menunggu Persetujuan KABID YANMEDWAT/LAKHAR KABAG RENIM #} if(approvalstatus==2) {# Menunggu Persetujuan Direktur #} if(approvalstatus==3) {# Menunggu Persetujuan SDM #} else if(approvalstatus == 4) {# Sudah Disetujui #} #",
                        width: 100
                    },



                    // {template: '<button class="k-button" ng-click="cetakSuratPengajuan(dataItem)">Cetak</button>' }
                    {
                        "command": [

                            { text: "Cetak", click: cetakJasper, imageClass: "k-icon k-i-download" },
                            { text: "Edit", click: showDetails, imageClass: "k-icon k-i-pencil" },
                            { text: "Hapus", click: hapus, imageClass: "k-icon k-i-close" },
                        ],
                        hidden: isNotSDM
                    },

                    {
                        "command": [
                            { text: "Verif", click: setKeputusan, imageClass: "k-icon k-i-pencil", },
                            { text: "Unverif", click: setUnverifikasi, imageClass: "k-icon k-i-cancel" },
                            { text: "Edit", click: showDetails, imageClass: "k-icon k-i-pencil" },
                            { text: "Hapus", click: hapus, imageClass: "k-icon k-i-close" },
                            { text: "Cetak", click: cetakJasper, imageClass: "k-icon k-i-download" },
                        ],
                        hidden: isLoginSDM
                    },

                ]
            };
            $scope.tambahCutiBersama = function () {
                if (medifirstService.getKelompokUser() == 'sdm')
                    $scope.winCutiBersama.center().open()
                else {
                    toastr.error('Hanya bisa dilakukan oleh bagian SDM')
                    return
                }

            }
            $scope.saveCutiBersama = function () {
                var confirm = $mdDialog.confirm()
                    .title('Info')
                    .textContent('Peringatan, Yakin mau menyimpan Cuti Untuk Semua Pegawai?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Simpan')
                $mdDialog.show(confirm).then(function () {
                    var listDate = []

                    for (var i = 0; i < $scope.tanggalPermohonanBersama.length; i++) {
                        var element = $scope.tanggalPermohonanBersama[i];
                        for (var key in element) {
                            if (element.hasOwnProperty(key)) {
                                if (key === "tgl") {
                                    if (element[key] instanceof Date)
                                        listDate.push({
                                            tgl: DateHelper.getTanggalFormattedNew(element[key])
                                        });
                                }
                            }
                        }
                    }

                    var dataSend = {
                        "listtanggal": listDate,

                    }
                    medifirstService.post('sdm/save-permohonan-cuti-bersama', dataSend).then(function (e) {
                        $scope.item = {}
                        $scope.tanggalPermohonanBersama = []
                        loadData()
                    })
                })
            }

            function setKeputusan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem.approvalstatus == 1) {
                    toastr.error('Sudah verifikasi')
                    return
                }
                $scope.listTglCekbox = [];
                medifirstService.get('sdm/get-permohonan-cuti?pgId=' + dataItem.objectpegawaifk).then(function (e) {

                })
                $scope.item.listtanggal = dataItem.listtanggal
                $scope.item.listtanggal.forEach(function (tanggal) {
                    for (var key in tanggal) {
                        if (tanggal.hasOwnProperty(key)) {
                            if (key === "tgl") {
                                tanggal[key] = DateHelper.getTanggalFormattedNew(new Date(tanggal[key]));
                            }
                        }
                    }
                })
                // if ($scope.item.statusPegawaiId == 25 || $scope.item.statusPegawaiId == 24 ){
                for (let index = 0; index < $scope.item.listtanggal.length; index++) {
                    $scope.listTglCekbox.push({
                        tgl: $scope.item.listtanggal[index].tgl,
                        norec: $scope.item.listtanggal[index].norec,
                        tanggalDefault: $scope.item.listtanggal[index].tgl
                    })

                }
                // }
                $scope.winDialogVerif.center().open()
                var actions = $scope.winDialogVerif.options.actions;
                // Remove "Close" button
                actions.splice(actions.indexOf("Close"), 1);
                // Set the new options
                $scope.winDialogVerif.setOptions({ actions: actions });
            }
            $scope.saveVerif = function () {
                var data = {
                    'data': $scope.item.tglPermohonanVerif
                }
                medifirstService.post('sdm/verifkasi-cuti', data).then(function (e) {
                    loadData()
                    $scope.batalVerif()
                })
            }
            $scope.saveVerif1 = function () {
                var data = {
                    'data': $scope.item.tglPermohonanVerif
                }
                medifirstService.post('sdm/verifkasi-cuti1', data).then(function (e) {
                    loadData()
                    $scope.batalVerif()
                })
            }
            $scope.batalVerif = function () {
                $scope.item.listtanggal = []
                $scope.item.tglPermohonan = [];
                $scope.winDialogVerif.close()
                $scope.item.ceklisAll = false
            }

            function cetakJasper(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "norec"],
                    "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176",
                        dataItem.norec.toString()
                    ],
                    "paramType": ["", "", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:8797/generic/report/cetakPersetujuanCuti.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/cetakPersetujuanCuti.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/cetakPersetujuanCuti.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:8797/generic/report/cetakPersetujuanCuti.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakPersetujuanCuti.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakPersetujuanCuti.pdf');
                }

                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;



            }
            // $scope.cetakJasper = function (e) {
            //     e.preventDefault();
            //     $scope.isRouteLoading = true;
            //     $scope.dataItem.norec
            //     var norec = $scope.dataItem.norec
            //     var data = {
            //             "gambarLogo": "logodokkes.jpg",
            //             "paramKey": ["namaRS","alamatRS","norec"],
            //             "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176",
            //             dataItem.norec],
            //             "paramType" : ["","",""]
            //             };
            //    debugger
            //    var xhr = new XMLHttpRequest();
            //    xhr.onreadystatechange = function(){
            //        if (this.readyState == 4 && this.status == 200){

            //             // cetakttd();
            //            //this.response is what you're looking for
            //            // handler(this.response);
            //            console.log(this.response, typeof this.response);
            //            //var res = this.response
            //            //var file = new Blob( [res], {type: 'application/pdf'});
            //            debugger;
            //            var url = window.URL.createObjectURL(this.response)
            //            var pdf = document.getElementById('tempatLaporan');
            //            pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
            //            var win = window.open(url, '_blank');
            //            win.focus();
            //        }
            //    }
            //    if (window.location.hostname.indexOf('192.168.0.62') > -1) {
            //        xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakPersetujuanCuti.pdf');
            //    }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
            //        xhr.open('POST', 'http://192.168.88.56:1002/generic/report/cetakPersetujuanCuti.pdf');
            //    }else if(window.location.hostname.indexOf('10.10.20.167') > -1){
            //        xhr.open('POST', 'http://10.10.20.167:1002/generic/report/cetakPersetujuanCuti.pdf');
            //    }else if(window.location.hostname.indexOf('202.51.105.98') > -1){
            //        xhr.open('POST', 'http://202.51.105.98:1002/generic/report/cetakPersetujuanCuti.pdf');
            //    }else if(window.location.hostname.indexOf('10.8.8.8') > -1){
            //        xhr.open('POST', '/jasper1/generic/report/cetakPersetujuanCuti.pdf');
            //    }else{
            //        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakPersetujuanCuti.pdf');
            //    }
            //    debugger
            //    // set `Content-Type` header
            //    xhr.setRequestHeader('Content-Type', 'application/json');
            //    xhr.setRequestHeader('Access-Control-Allow-Origin','*');
            //    xhr.responseType = 'blob';
            //    // send rquest with JSON payload
            //    xhr.send(JSON.stringify(data)); 
            //    $scope.isRouteLoading = false;
            // }

            $scope.item.tglPermohonanVerif = [];
            $scope.toogleCheckVerifikasi = function (current) {
                if (current.verif) {
                    $scope.item.tglPermohonanVerif.push(current);
                } else {
                    for (var i = 0; i < $scope.item.tglPermohonanVerif.length; i++) {
                        if ($scope.item.tglPermohonanVerif[i].norec == current.norec) {
                            $scope.item.tglPermohonanVerif.splice(i, 1);
                        }
                    }
                }
            }
            $scope.ceklisAllVerif = function (bool) {
                $scope.item.tglPermohonanVerif = [];
                if (bool) {
                    for (let i = 0; i < $scope.listTglCekbox.length; i++) {
                        const element = $scope.listTglCekbox[i];
                        element.verif = true
                        $scope.item.tglPermohonanVerif.push({
                            'tgl': element.tgl,
                            'norec': element.norec,
                            'tanggalDefault': element.tanggalDefault,
                            'verif': true
                        })
                    }

                } else {
                    for (let i = 0; i < $scope.listTglCekbox.length; i++) {
                        const element = $scope.listTglCekbox[i];
                        element.verif = false
                    }

                    $scope.item.tglPermohonanVerif = []
                }
            }

            function setUnverifikasi(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                medifirstService.post('sdm/unverif-permohonan-cuti', { norec: dataItem.norec }).then(function (e) {
                    loadData()
                })
            }

            function hapus(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem.approvalstatus == 1) {
                    messageContainer.error("Data tidak dapat dihapus");
                    return;
                } else {
                    medifirstService.post('sdm/delete-permohonan-cuti', { norec: dataItem.norec }).then(function (e) {
                        loadData()
                    })
                }
            }

            function showDetails(e) {
                //debugger;
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem.approvalstatus == 1) {
                    messageContainer.error("Data tidak dapat diubah");
                    return;
                } else {
                    medifirstService.get('sdm/get-permohonan-cuti?pgId=' + dataItem.objectpegawaifk).then(function (e) {

                    })
                    $scope.item.norecPlanning = dataItem.norec
                    var pegawai = []
                    for (let i = 0; i < $scope.listPegawai.length; i++) {
                        const element = $scope.listPegawai[i];
                        if (element.id == dataItem.objectpegawaifk) {
                            pegawai = element
                            break
                        }
                    }
                    var listStatusCuti = []
                    for (let i = 0; i < $scope.listStatusCuti.length; i++) {
                        const element = $scope.listStatusCuti[i];
                        if (element.id == dataItem.objectstatuspegawaiplanfk) {
                            listStatusCuti = element
                            break
                        }
                    }
                    $scope.item.namaPegawai = pegawai
                    $scope.getDetailPegawai(pegawai)
                    $scope.item.statusPegawai = listStatusCuti
                    $scope.item.deskripsiUsulan = dataItem.desk
                    $scope.item.keterangan = dataItem.keterangan
                    $scope.item.tglPengajuan = new Date(dataItem.tglpengajuan)

                    dataItem.listtanggal.forEach(function (lisTgl) {
                        for (var subKeys in lisTgl) {
                            if (lisTgl.hasOwnProperty(subKeys)) {
                                if (subKeys == "tgl") {
                                    lisTgl[subKeys] =
                                        // DateHelper.getTanggalFormattedNew(
                                        new Date(lisTgl[subKeys])
                                    // );
                                }
                            }
                        }
                    })


                    // $scope.tanggalPermohonan = dataItem.listtanggal;
                    $scope.item.noUsulan = dataItem.noplanning
                    // for (var i = 0; i < $scope.tanggalPermohonan.length; i++) {
                    //     $scope.tanggalPermohonan[i].id = i + 1;
                    // }
                    $scope.item.tglAwalCuti = dataItem.listtanggal[0].tgl
                    $scope.item.tglAkhirCuti = dataItem.listtanggal[dataItem.listtanggal.length].tgl
                    $scope.winDialogBaru.center().open()

                }

            }

            $scope.Batal = function () {
                $scope.winDialogBaru.close()
                $scope.item = {
                    tglPengajuan: new Date(),
                    qRows: 100
                }

            }

            function getDates(startDate, stopDate) {
                var dateArray = new Array();
                var currentDate = startDate;
                while (currentDate <= stopDate) {
                    dateArray.push({ 'tgl': moment(currentDate).format('YYYY-MM-DD') });
                    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
                }
                return dateArray;
            }
            $scope.Simpan = function () {
                var listRawRequired = [
                    "item.namaPegawai|k-ng-model|Pegawai",
                    "item.tglPengajuan|k-ng-model|Tanggal pengajuan",
                    "item.statusPegawai|k-ng-model|Status Pemohonan",
                    "item.tglAwalCuti|k-ng-model|Tgl Awal",
                    "item.tglAkhirCuti|k-ng-model|Tgl Akhir",
                    // "item.Alamat|k-ng-model|Alamat",
                ]
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {

                    var listDate = []
                    listDate = getDates($scope.item.tglAwalCuti, $scope.item.tglAkhirCuti)
                    // console.log(listDate)
                    // return
                    if (listDate.length == 0) {
                        toastr.error('Belum ada tanggal yang di pilih')
                        return
                    }
                    // for (var i = 0; i < $scope.tanggalPermohonan.length; i++) {
                    //     var element = $scope.tanggalPermohonan[i];
                    //     for (var key in element) {
                    //         if (element.hasOwnProperty(key)) {
                    //             if (key === "tgl") {
                    //                 if (element[key] instanceof Date)
                    //                     listDate.push({
                    //                         tgl: DateHelper.getTanggalFormattedNew(element[key])
                    //                     });
                    //             }
                    //         }
                    //     }
                    // }
                    debugger
                    var dataSend = {
                        "norec": $scope.item.norecPlanning != undefined ? $scope.item.norecPlanning : '',
                        "objectpegawaifk": $scope.item.namaPegawai.id,
                        "objectpegawainama": $scope.item.namaPegawai.namalengkap,
                        "statuspegawaiplan": $scope.item.statusPegawai.id,
                        "statuspegawaiplannama": $scope.item.statusPegawai.name,
                        "deskripsi": $scope.item.deskripsiUsulan != undefined ? $scope.item.deskripsiUsulan : null,
                        "keteranganlain": $scope.item.keterangan != undefined ? $scope.item.keterangan : null,
                        "alamatcuti": $scope.item.alamatcuti != undefined ? $scope.item.alamatcuti : null,
                        "tglpengajuan": moment($scope.item.tglPengajuan).format('YYYY-MM-DD HH:mm'), // DateHelper.getTanggalFormattedNew($scope.item.tglPengajuan),
                        "listtanggal": listDate,
                        "jumlah": listDate.length
                    }
                    medifirstService.post('sdm/save-permohonan-cuti', dataSend).then(function (e) {
                        $scope.item = {}
                        $scope.tanggalPermohonan = []

                        loadData()
                        $scope.item.tglPermohonanVerif = []
                        if ($scope.bukanLoginSDM == false) {

                            $scope.item.tglPermohonanVerif = e.data.detail

                            if ($scope.item.tglPermohonanVerif.length > 0)
                                $scope.saveVerif()
                        }
                        $scope.Batal()
                    })


                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }
            $scope.SearchEnter = function () {
                loadData()
            }

            function loadData() {
                $scope.isRouteLoading = true
                var namaPegawa = ''
                if ($scope.item.qnamaPegawai != undefined) {
                    namaPegawa = 'namaLengkap=' + $scope.item.qnamaPegawai
                }
                var qunitKerja = ''
                if ($scope.item.qunitKerja != undefined) {
                    qunitKerja = '&unitKerjaId=' + $scope.item.qunitKerja.id
                }
                var qsubUnitKerja = ''
                if ($scope.item.qsubUnitKerja != undefined) {
                    qsubUnitKerja = '&subUnitId=' + $scope.item.qsubUnitKerja.id
                }
                var qkedudukanPegawai = ''
                if ($scope.item.qkedudukanPegawai != undefined) {
                    qkedudukanPegawai = '&kedudukanId=' + $scope.item.qkedudukanPegawai.id
                }
                var qstatusPegawai = ''
                if ($scope.item.qstatusPegawai != undefined) {
                    qstatusPegawai = '&statusPegawaiId=' + $scope.item.qstatusPegawai.id
                }
                var tglMasuk = ''
                if ($scope.item.tglMasuk != undefined) {
                    tglMasuk = '&tglMasuk=' + moment($scope.item.tglMasuk).format('YYYY-MM')
                }
                var qstatusApprove = ''
                if ($scope.item.qstatusApprove != undefined) {
                    qstatusApprove = '&qstatusApprove=' + $scope.item.qstatusApprove.id
                }
                var qPermohonan = ''
                if ($scope.item.qPermohonan != undefined) {
                    qPermohonan = '&qPermohonan=' + $scope.item.qPermohonan.id
                }
                var qRows = ''
                if ($scope.item.qRows != undefined) {
                    qRows = '&rows=' + $scope.item.qRows
                }


                medifirstService.get('sdm/get-permohonan-cuti?' + namaPegawa + qunitKerja +
                    qsubUnitKerja + qkedudukanPegawai + qstatusPegawai + tglMasuk + qstatusApprove +
                    qPermohonan + qRows)
                    .then(function (e) {
                        $scope.isRouteLoading = false
                        var data = e.data.data
                        $scope.dataSource = new kendo.data.DataSource({
                            pageSize: 10,
                            data: data,
                            autoSync: true
                        });
                    })
            }

            function onChangeDate(e) {
                if ($scope.tanggalPermohonan.length > 1) {
                    var lastModel = $scope.tanggalPermohonan.length - 1;
                    for (var i = 0; i < $scope.tanggalPermohonan.length; i++) {
                        if (i < lastModel && kendo.toString($scope.tanggalPermohonan[i].tgl, "MM/dd/yyyy") === kendo.toString(this.value(), "MM/dd/yyyy")) {
                            if ($scope.item.statusPegawai.id != 24 && $scope.item.statusPegawai.id != 25 && $scope.item.statusPegawai.id != 29) {
                                toastr.error("Tanggal " + kendo.toString(this.value(), "dd/MM/yyyy") + " sudah diajukan", "Peringatan");
                                $scope.tanggalPermohonan[lastModel].tgl = "";
                                $(this.element).closest('span').addClass("duplicateDate");
                                $(this.element).parent('span').addClass("duplicateDate");
                                this.value("");
                            }
                        } else {
                            $(this.element).closest('span').removeClass("duplicateDate");
                            $(this.element).parent('span').removeClass("duplicateDate");
                        }
                    }
                }
            }
            $scope.$watch('item.tglAwalCuti', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    if ($scope.item.tglAkhirCuti != undefined) {
                        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                        const firstDate = new Date(newVal);
                        const secondDate = new Date($scope.item.tglAkhirCuti);

                        const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                        $scope.item.jumlahHari = diffDays + 1
                    }
                }

            });
            $scope.$watch('item.tglAkhirCuti', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    if ($scope.item.tglAwalCuti != undefined) {
                        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                        const firstDate = new Date($scope.item.tglAwalCuti);
                        const secondDate = new Date(newVal);

                        const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                        $scope.item.jumlahHari = diffDays + 1
                    }
                }

            });

            function onChangeDate2(e) {
                if ($scope.tanggalPermohonanBersama.length > 1) {
                    var lastModel = $scope.tanggalPermohonanBersama.length - 1;
                    for (var i = 0; i < $scope.tanggalPermohonanBersama.length; i++) {
                        if (i < lastModel && kendo.toString($scope.tanggalPermohonanBersama[i].tgl, "MM/dd/yyyy") === kendo.toString(this.value(), "MM/dd/yyyy")) {

                            toastr.error("Tanggal " + kendo.toString(this.value(), "dd/MM/yyyy") + " sudah diajukan", "Peringatan");
                            $scope.tanggalPermohonanBersama[lastModel].tgl = "";
                            $(this.element).closest('span').addClass("duplicateDate");
                            $(this.element).parent('span').addClass("duplicateDate");
                            this.value("");

                        } else {
                            $(this.element).closest('span').removeClass("duplicateDate");
                            $(this.element).parent('span').removeClass("duplicateDate");
                        }
                    }
                }
            }
            $scope.addNewTgl = function () {
                // debugger
                var listRawRequired = [
                    "item.namaPegawai|k-ng-model|Nama pegawai",
                    "item.statusPegawai|k-ng-model|Status kehadiran"
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var lastDate = $scope.tanggalPermohonan.length - 1;
                    if ($scope.tanggalPermohonan[lastDate].tgl instanceof Date) {

                        var newItemNo = $scope.tanggalPermohonan.length + 1;
                        $scope.tanggalPermohonan.push({
                            id: newItemNo,
                            tgl: "dd/MM/yyyy"
                        })
                        // if ($scope.item.statusPegawai.id == 27 || $scope.item.statusPegawai.id == 26 || $scope.item.statusPegawai.id == 28) {
                        //     var newItemNo = $scope.tanggalPermohonan.length + 1;
                        //     $scope.tanggalPermohonan.push({
                        //         id: newItemNo,
                        //         tgl: "dd/MM/yyyy"
                        //     })
                        // } else if ($scope.item.statusPegawai.id == 24 || $scope.item.statusPegawai.id == 25) {
                        //     if ($scope.tanggalPermohonan.length < 2) {
                        //         var newItemNo = $scope.tanggalPermohonan.length + 1;
                        //         $scope.tanggalPermohonan.push({
                        //             id: newItemNo,
                        //             tgl: "dd/MM/yyyy"
                        //         })
                        //     } else {
                        //         messageContainer.error('Tanggal terdiri dari tanggal awal dan tanggal akhir (periode)')
                        //     }
                        // //untuk sakit
                        // } else if ($scope.item.statusPegawai.id == 29) {
                        //     if ($scope.tanggalPermohonan.length < 2) {
                        //         var newItemNo = $scope.tanggalPermohonan.length + 1;
                        //         $scope.tanggalPermohonan.push({
                        //             id: newItemNo,
                        //             tgl: "dd/MM/yyyy"
                        //         })
                        //     }else {
                        //         messageContainer.error('Tanggal terdiri dari tanggal awal dan tanggal akhir (periode)')
                        //     }
                        // //untuk cuti tahunan
                        // } else if ($scope.item.statusPegawai.id == 1) {


                        //     var jumlahCutiN3=12
                        //     if($scope.item.jumlahCutiN3==undefined||$scope.item.jumlahCutiN3==null||$scope.item.jumlahCutiN3==0){
                        //         jumlahCutiN3=$scope.item.jumlahCutiN3
                        //     }



                        //     var isBolehCuti=false
                        //     if($scope.item.sisaCuti+$scope.item.jumlahCutiN3>24 && $scope.item.isTangguhkanN1==true && $scope.tanggalPermohonan.length<24+$scope.item.sisaCutiN1){
                        //         isBolehCuti=true
                        //     }else if($scope.item.sisaCuti+$scope.item.jumlahCutiN3>24 && $scope.item.isTangguhkanN1==false && $scope.tanggalPermohonan.length<24){
                        //         isBolehCuti=true
                        //     }else if($scope.item.sisaCuti+$scope.item.jumlahCutiN3<=24 && $scope.item.isTangguhkanN1==true && $scope.tanggalPermohonan.length<$scope.item.sisaCutiN1+$scope.item.sisaCuti+$scope.item.jumlahCutiN3){
                        //         isBolehCuti=true
                        //     }else if($scope.item.sisaCuti+$scope.item.jumlahCutiN3<=24 && $scope.item.isTangguhkanN1==false && $scope.tanggalPermohonan.length<$scope.item.sisaCuti+$scope.item.jumlahCutiN3){
                        //         isBolehCuti=true
                        //     }

                        //     if(!isBolehCuti){
                        //         toastr.warning('Jumlah tanggal permohonan melebihi jatah cuti tahunan yang ditetapkan !')
                        //         return 
                        //     }    



                        // } else {
                        //     messageContainer.error('Jumlah sisa cuti tidak cukup, Jumlah sisa cuti anda : ' + $scope.item.sisaCuti + ' hari')
                        // }
                        // } else if($scope.item.statusPegawai.id == 24 || $scope.item.statusPegawai.id == 25 || $scope.item.statusPegawai.id == 29) {

                        // if($scope.item.statusPegawai.id == 29){
                        //         if($scope.loginUser.idPegawai==$scope.item.namaPegawai.id){
                        //             if ($scope.tanggalPermohonan.length < 2) {
                        //                 var newItemNo = $scope.tanggalPermohonan.length + 1;
                        //                 $scope.tanggalPermohonan.push({
                        //                     id: newItemNo,
                        //                     tgl: "dd/MM/yyyy"
                        //                 })
                        //             } else {
                        //                 messageContainer.error('Tanggal terdiri dari tanggal awal dan tanggal akhir (periode)')
                        //             }
                        //         }     
                        // }else {


                        //         if ($scope.tanggalPermohonan.length < 2) {
                        //             var newItemNo = $scope.tanggalPermohonan.length + 1;
                        //             $scope.tanggalPermohonan.push({
                        //                 id: newItemNo,
                        //                 tgl: "dd/MM/yyyy"
                        //             })
                        //         } else {
                        //             messageContainer.error('Tanggal terdiri dari tanggal awal dan tanggal akhir (periode)')
                        //         }

                        // }




                    } else {

                        messageContainer.error('Tanggal yang diajukan belum dipilih.')
                    }
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }
            $scope.addNewTglBersama = function () {
                // debugger

                var lastDate = $scope.tanggalPermohonanBersama.length - 1;
                if ($scope.tanggalPermohonanBersama[lastDate].tgl instanceof Date) {

                    var newItemNo = $scope.tanggalPermohonanBersama.length + 1;
                    $scope.tanggalPermohonanBersama.push({
                        id: newItemNo,
                        tgl: "dd/MM/yyyy"
                    })


                } else {

                    messageContainer.error('Tanggal  belum dipilih.')
                }

            }

            $scope.showAddTgl = function (current) {
                return current.id === $scope.tanggalPermohonan[$scope.tanggalPermohonan.length - 1].id;
            }
            $scope.showAddTgl2 = function (current) {
                return current.id === $scope.tanggalPermohonanBersama[$scope.tanggalPermohonanBersama.length - 1].id;
            }
            $scope.removeNewTglBersama = function (id) {
                if (id == 1) return;
                if ($scope.tanggalPermohonanBersama.length > 1) {
                    for (var i = 0; i < $scope.tanggalPermohonanBersama.length; i++) {
                        if (id == $scope.tanggalPermohonanBersama[i].id) {
                            $scope.tanggalPermohonanBersama.splice(i, 1);
                            break;
                        }
                    }
                }

            }
            $scope.removeNewTgl = function (id) {
                if (id == 1) return;

                if ($scope.item.statusPegawai.id == 24 || $scope.item.statusPegawai.id == 25 || $scope.item.statusPegawai.id == 29) {

                } else {

                    if ($scope.tanggalPermohonan.length > 1) {
                        for (var i = 0; i < $scope.tanggalPermohonan.length; i++) {
                            if (id == $scope.tanggalPermohonan[i].id) {
                                $scope.tanggalPermohonan.splice(i, 1);
                                break;
                            }
                        }
                    }


                }


            }
            $scope.tambahCutiBaru = function () {
                if ($scope.bukanLoginSDM == true) {
                    for (let x = 0; x < $scope.listPegawai.length; x++) {
                        const element = $scope.listPegawai[x];
                        if (element.id == medifirstService.getPegawaiLogin().id) {
                            $scope.item.namaPegawai = element
                            $scope.getDetailPegawai(element)
                            break
                        }
                    }

                }
                $scope.winDialogBaru.center().open()
                var actions = $scope.winDialogBaru.options.actions;
                // Remove "Close" button
                actions.splice(actions.indexOf("Close"), 1);
                // Set the new options
                $scope.winDialogBaru.setOptions({ actions: actions });
            }


            // $q.all([
            //     ManageSdmNew.getListData("sdm/get-login-user-permohonan-status"),
            //     ManageSdmNew.getListData("pegawai/get-all-pegawai-kepala-ruangan"),
            //     ManageSdmNew.getListData("pegawai/get-all-jabatan"),
            //     ManageSdmNew.getListData("pegawai/get-pegawai-sdm-for-cred")
            //     // ManageSdm.findPegawaiById(ModelItem.getPegawai().id)
            // ]).then(function(result) {
            //     if (result[0].statResponse) {
            //         $scope.loginUser = result[0].data.data;
            //         load();
            //         $scope.loadGrid();
            //     }
            //     if (result[1].statResponse) {
            //         $scope.listKaRuangan = result[1].data.data;
            //     }
            //     if (result[2].statResponse) {
            //         $scope.listAllJabatan = result[2].data.data;
            //     }
            //     if (result[2].statResponse) {
            //         listPegawaiAdminSDM = result[3].data.data;
            //     }
            //     // condition base if bagian sdm can view all permohonan perubahan status kehadiran
            //     // uncomment codes below to activate
            //     // if(result[2].statResponse){
            //     //  if(result[2].data.data.subUnitKerja.indexOf("Sub Bagian Kesejahteraan Pegawai") >= 0){
            //     //      urlDaftarPermohonan = "sdm/get-list-approval-status?namaPegawai=";
            //     //  } else {
            //     //      urlDaftarPermohonan = "sdm/get-list-approval-status?namaPegawai="+pegawaiLogin.nama
            //     //  }
            //     // }
            // })
            // ManageSdm.getItem("sdm/get-login-user-permohonan-status", true).then(function(dat){
            //  $scope.loginUser = dat.data.data;
            //  load();
            //  $scope.loadGrid();
            // }, function(err){
            //  console.log('error get user login data');
            // });

            // var load = function () {
            //     $scope.item = {
            //         tglPengajuan: new Date()
            //     };
            //     $scope.tanggalPermohonan = [{
            //         id: 1,
            //         tgl: "",
            //         isDuplicate: false
            //     }]
            //     //ManageSdm.getItem("sdm/get-load-permohonan-status?ruanganId="+$scope.loginUser.idRuangan, true).then(function(dat){
            //     ManageSdmNew.getListData("sdm/get-load-permohonan-status?subUnitKerjaId=" + $scope.loginUser.idSubUnitKerja, true).then(function (dat) {
            //         $scope.item.noUsulan = dat.data.data.noUsulan;
            //         $scope.listStatusPegawai = dat.data.data.listStatusPegawai;
            //     });
            //     ManageSdm.getItem("service/list-generic/?view=Pegawai&select=id,namaLengkap,tglMasuk&criteria=statusEnabled&values=true", true).then(function (dat) {

            //         $scope.listPegawai = dat.data;
            //     }).then(function () {
            //         if ($scope.loginUser.idSubUnitKerja !== 26) {
            //             // $scope.item.namaPegawai = {
            //             //     id: $scope.loginUser.idPegawai,
            //             //     namaLengkap: $scope.loginUser.name,
            //             //     tglMasuk:
            //             // };

            //             $scope.item.namaPegawai = _.find($scope.listPegawai, function (e) {
            //                 return e.id === $scope.loginUser.idPegawai;
            //             });

            //             $scope.bukanLoginSdm = true;
            //         } else {
            //             $scope.bukanLoginSdm = false;
            //         }
            //     });
            // }
            // $scope.$watch('item.namaPegawai', function (e) {
            //     // debugger;
            //     if (!e) return;
            //     $scope.getDataPegawai(e);
            // })
            // $scope.getDataPegawai = function (e) {
            //     $scope.isRouteLoading = true;
            //     ManageSdmNew.getListData("sdm/get-data-pegawai?pegawaiId=" + e.id, true).then(function (dat) {
            //         // debugger;
            //         $scope.item.jabatan = dat.data.data.jabatan;
            //         $scope.item.nip = dat.data.data.nip;
            //         $scope.item.ruangan = dat.data.data.subUnitKerja;
            //         $scope.item.ruanganId = dat.data.data.subUnitKerjaId;
            //         $scope.item.kategoriPegawaiId = dat.data.data.kategoriPegawaiId;
            //         $scope.item.Alamat = dat.data.data.alamat
            //         if (!$scope.item.kategoriPegawaiId) {
            //             $scope.item.jumlahCuti = "";
            //             $scope.item.sisaCuti = "";
            //             $scope.item.jumlahIjin = "";
            //             $scope.item.sisaIjin = "";
            //             // $scope.item.jmlsakit = "";
            //         }
            //         /*else{
            //             $scope.getIzin(e);
            //         } */
            //         $scope.isRouteLoading = false;
            //     }, (err) => {
            //         $scope.isRouteLoading = false;
            //     });
            // }
            // $scope.getJabatan = function (params, value) {
            //     if (!value) return;
            //     ManageSdmNew.getListData("sdm/get-data-pegawai?pegawaiId=" + value.id, true).then(function (dat) {
            //         if (params === 'pegawai1') {
            //             $scope.currentData.jabatan1 = dat.data.data.jabatan;
            //         } else if (params === 'pegawai2') {
            //             $scope.currentData.jabatan2 = dat.data.data.jabatan;
            //         } else {
            //             // debugger;
            //         }
            //     })
            // }
            $scope.getCuti = function () {
                // $scope.cutiHabis = false;
                // ManageSdmNew.getListData("sdm/get-data-cuti?pegawaiId=" + $scope.item.namaPegawai.id + "&statusPegawaiId=" + $scope.item.statusPegawai.id, true).then(function (dat) {
                //     // +$scope.item.kategoriPegawaiId

                //     $scope.item.dataCutiB = dat.data.data.dataCutiB;
                //     var data = {
                //         "statusEnabled": true,
                //         "tahun": DateHelper.formatDate($scope.now, "YYYY"),
                //         "kdProfile": 0,
                //         "pegawai": {
                //             "id": $scope.item.namaPegawai.id
                //         },
                //         "value": $scope.item.dataCutiB,
                //         "komponenIndex": {
                //             "id": 21
                //         },
                //         "isTangguhkan": false
                //     }
                //     ManageSdmNew.saveData(data, "sdm/save-jatah-cuti-dan-izin-pegawai").then(function (e) {

                //     }, function (err) {
                //         throw err;
                //     })

                //     // $scope.item.dataCutiN = dat.data.data.dataCutiN;
                //     // var data = {
                //     //     "statusEnabled": true,
                //     //     "tahun": dateHelper.formatDate($scope.now, "YYYY"),
                //     //     "kdProfile": 0,
                //     //     "pegawai": {
                //     //         "id": $scope.item.namaPegawai.id
                //     //     },
                //     //     "value": $scope.item.dataCutiN,
                //     //     "komponenIndex": {
                //     //         "id": 5
                //     //     },
                //     //     "isTangguhkan": false
                //     // }
                //     // manageSdmNew.saveData(data, "sdm/save-jatah-cuti-dan-izin-pegawai").then(function(e){

                //     // }, function(err){
                //     //     throw err;
                //     // })     

                //     $scope.item.isTangguhkanN = dat.data.data.isTangguhkanN;
                //     $scope.item.isTangguhkanN1 = dat.data.data.isTangguhkanN1;

                //     $scope.item.sisaCuti = dat.data.data.sisaCutiN;
                //     $scope.item.sisaCutiN1 = dat.data.data.sisaCutiN1;
                //     $scope.item.sisaCutiN2 = dat.data.data.sisaCutiN2;

                //     $scope.item.jumlahCutiB = dat.data.data.dataCutiB;
                //     $scope.item.sisaCutiB = dat.data.data.sisaCutiB;

                //     $scope.item.jumlahCuti = dat.data.data.dataCutiN;
                //     $scope.item.jumlahCutiN1 = dat.data.data.dataCutiN1;
                //     $scope.item.jumlahCutiN2 = dat.data.data.dataCutiN2;
                //     $scope.item.jumlahCutiN3 = dat.data.data.dataCutiN3;

                //     var d = new Date();
                //     var y = d.getFullYear();
                //     $scope.item.tahunCutiN1 = y - 1
                //     $scope.item.tahunCutiN2 = y - 2

                //     if ($scope.item.jumlahCuti <= 0) {
                //         $scope.cutiHabis = true;
                //     } else {
                //         $scope.cutiHabis = false;
                //     }

                // });
            }

            $scope.getIzin = function (e) {
                // debugger;
                $scope.cutiHabis = false;
                ManageSdmNew.getListData("sdm/get-data-cuti?pegawaiId=" + $scope.item.namaPegawai.id + "&statusPegawaiId=" + $scope.item.statusPegawai.id, true).then(function (dat) {
                    // +$scope.item.kategoriPegawaiId

                    $scope.item.jumlahIjin = dat.data.data.jatahCuti;
                    $scope.item.sisaIjin = dat.data.data.sisaCuti;
                    if ($scope.item.jumlahIjin <= 0) {
                        $scope.cutiHabis = true;
                    } else {
                        $scope.cutiHabis = false;
                    }
                });
            }
            $scope.cutiHabis = false;
            $scope.dataVOloaded = true;
            $scope.disJumlahCuti = true;
            $scope.disSakit = true;
            $scope.hideJumlahCuti = false;
            $scope.showJumlahCuti = function () {
                for (var i = 0; i < $scope.tanggalPermohonan.length; i++) {
                    if ($scope.tanggalPermohonan.length != 1) {
                        $scope.tanggalPermohonan.splice(i, 1);
                    }
                }
                $scope.tanggalPermohonan[0] = new Date();
                //Cuti Tahunan
                if ($scope.item.statusPegawai.id == 1) {
                    $scope.hideJumlahCuti = true;
                    $scope.getCuti();

                } else {
                    $scope.hideJumlahCuti = false;
                }
                //Sakit
                if ($scope.item.statusPegawai.id == 29) {
                    // toastr.warning('Info! Pengajuan sakit selama satu hari silakan langsung menyerahkan surat sakit kepada pihak SDM')

                    $scope.hideSakit = true;
                    $scope.cutiHabis = false;
                } else {
                    $scope.hideSakit = false;
                }

                //Ijin
                //Cuti Alasan Penting   26
                //Tugas Luar    28 
                //Cuti Melahirkan   25
                //Cuti Besar    24 
                if ($scope.item.statusPegawai.id == 27 || $scope.item.statusPegawai.id == 26 ||
                    $scope.item.statusPegawai.id == 28 ||
                    $scope.item.statusPegawai.id == 24 || $scope.item.statusPegawai.id == 25) {
                    $scope.hideSakit = false;
                    $scope.cutiHabis = false;
                } else {
                    $scope.hideJumlahIjin = false;
                }

                if ($scope.item.statusPegawai.id == 24 || $scope.item.statusPegawai.id == 25) {

                    $scope.hideTglpermohonan = true;
                    $scope.showTglAwal = true;
                    $scope.showTglAkhir = true;
                    $scope.addNewTgl();

                } else {
                    $scope.hideTglpermohonan = false;
                    $scope.showTglAwal = false;
                    $scope.showTglAkhir = false;
                }

                if ($scope.item.statusPegawai.id == 29) {

                    if ($scope.loginUser.idPegawai == $scope.item.namaPegawai.id) {

                        $scope.hideTglpermohonan = true;
                        $scope.showTglAwal = true;
                        $scope.showTglAkhir = true;

                        $scope.addNewTgl();
                    } else {
                        $scope.hideTglpermohonan = false;
                        $scope.showTglAwal = false;
                        $scope.showTglAkhir = false;

                    }

                }


            }

            // $scope.showJumlahSakit = function() {
            //     if ($scope.item.sakit.id == 1) {
            //         $scope.item.jmlsakit = 3;
            //     } else {
            //         $scope.item.jmlsakit = 5;
            //     }
            //     var RealDay = days(new Date($scope.item.tglAkhir), new Date($scope.item.tglAwal));
            //     var dateDiff = days(new Date($scope.item.tglAkhir), new Date($scope.item.tglAwal));
            //     removeA(dateDiff, 'Sunday');
            //     removeA(dateDiff, 'Saturday');
            //     var totalHari = dateDiff.length + 1;
            //     if (totalHari > $scope.item.jmlsakit) {
            //         alert('Jumlah Permohonan Tidak Boleh Lebih dari : ' + $scope.item.jmlsakit + ' hari')
            //         $scope.item.tglAwal = "";
            //         $scope.item.tglAkhir = "";
            //     }
            // }

            $scope.listDetailSakit = [{
                "id": 1,
                "sakit": "Rawat Jalan"
            }, {
                "id": 2,
                "sakit": "Rawat Inap"
            }]
            $scope.loadGrid = function () {
                $scope.isRouteLoading = true;
                // get daftar permohonan cuti per ruangan
                // var idSubUnitKerja = '';
                // if ($scope.loginUser.idSubUnitKerja) var idSubUnitKerja = $scope.loginUser.idSubUnitKerja;
                // ManageSdm.getItem("sdm/get-list-permohonan-status?unitKerjaId="+ idSubUnitKerja, true).then(function(dat){
                //  $scope.dataMaster = dat.data.data.listData;

                // get daftar cuti per pegawai (berdasarkan hasil meeting dengan pihak SDM)
                // ManageSdm.findPegawaiById(ModelItem.getPegawai().id).then(function(res) {
                ManageSdmNew.getListData("pegawai/find-pegawai-by-id-custom/" + ModelItem.getPegawai().id).then(function (res) {
                    if (res.statResponse) {
                        var pegawaiLogin = res.data.data;
                        // get permohonan status by user login
                        ManageSdmNew.getListData("sdm/get-list-approval-status?idPegawai=" + pegawaiLogin.idPegawai).then(function (e) {
                            //debugger;
                            var data = e.data.data.listData;
                            // filter data yang approvalStatusnya !== 3
                            var filteredData = _.filter(e.data.data.listData, function (element) {
                                return element.approvalStatus !== 3;
                            });

                            for (var i = 0; i < filteredData.length; i++) {
                                if (filteredData[i].eselonId == undefined)
                                    filteredData[i].eselonId = null

                            }

                            $scope.dataSource = new kendo.data.DataSource({
                                pageSize: 5,
                                data: filteredData,
                                autoSync: true
                            });
                            $scope.isRouteLoading = false;
                        }, (err) => {
                            $scope.isRouteLoading = false;
                        });
                    }
                }, (err) => {
                    $scope.isRouteLoading = false;
                });



                // $scope.dataMaster.forEach(function(data){
                //  var date1 = new Date(data.tglAwalPlan);
                //  var date2 = new Date(data.tglAkhirPlan);
                //  var date3 = new Date(data.tglPengajuan);
                //  data.tglAwalPlan = DateHelper.getTanggalFormattedNew(date1);
                //  data.tglAkhirPlan = DateHelper.getTanggalFormattedNew(date2);
                //  data.tglPengajuan = DateHelper.getTanggalFormattedNew(date3);
                // });

            }

            var timeoutPromise;
            $scope.$watch('item.cariDaftarPengajuanCuti', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("namaPegawai", newVal)
                    }
                }, 1000);
            });

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#gridPermohonanStatus").data("kendoGrid");
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
                currentFilters.push({
                    field: filterField,
                    operator: "contains",
                    value: filterValue
                });
                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                });
            }

            // $scope.cari = function () {
            //     $scope.isRouteLoading = true;
            //     ManageSdmNew.getListData("pegawai/find-pegawai-by-id-custom/" + ModelItem.getPegawai().id).then(function (res) {
            //         if (res.statResponse) {
            //             var pegawaiLogin = res.data.data;
            //             // get permohonan status by user login
            //             ManageSdmNew.getListData("sdm/get-list-approval-status?idPegawai=" + pegawaiLogin.idPegawai).then(function (e) {
            //                 //debugger;
            //                 var data = e.data.data.listData;
            //                 // filter data yang approvalStatusnya !== 3
            //                 var filteredData = _.filter(e.data.data.listData, function (element) {
            //                     return element.approvalStatus !== 3;
            //                 });


            //                 var filteredData2 = _.filter(filteredData, function (element) {

            //                     return element['namaPegawai'].toLowerCase().indexOf($scope.item.cariDaftarPengajuanCuti.toLowerCase()) > -1


            //                     xxx.match(re);
            //                 });


            //                 $scope.dataSource = new kendo.data.DataSource({
            //                     pageSize: 5,
            //                     data: filteredData2,
            //                     autoSync: true
            //                 });
            //                 $scope.isRouteLoading = false;
            //             }, (err) => {
            //                 $scope.isRouteLoading = false;
            //             });
            //         }
            //     }, (err) => {
            //         $scope.isRouteLoading = false;
            //     });





            // }




            $scope.radioIsCutiLuarNegeri = [
                { "id": 1, "nama": "Ya" }, { "id": 2, "nama": "Tidak" }
            ]



            $scope.alertTgl = function (ev) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(false)
                        .title('Peringatan')
                        .textContent('Jumlah hari yang anda pilih melebihi sisa cuti')
                        .ariaLabel('Alert Tgl')
                        .ok('OK')
                        .targetEvent(ev)
                );
            };
            var days = function (date1, date2) {
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                var diff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                var _days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                var days = [];
                for (var i = 0; i < diff; i++) {
                    date1.setDate(date1.getDate() + i);
                    days.push(_days[date1.getDay()]);
                }
                return days;
            };

            var removeA = function (arr) {
                var what, a = arguments,
                    L = a.length,
                    ax;
                while (L > 1 && arr.length) {
                    what = a[--L];
                    while ((ax = arr.indexOf(what)) !== -1) {
                        arr.splice(ax, 1);
                    }
                }
                return arr;
            }



            $scope.cetakCutiAlasanPenting = function (data) {
                var idKaRuangan = data.kepalaRuangan ? data.kepalaRuangan.id : "";
                var urlLaporan = cetakHelper.openURLReporting("reporting/lapPermohonanCuti?noRecPlanning=" + data.noRec + "&idAtasan1=" + data.atasanLangsung.id + "&idAtasan2=" + data.pejabatPenilai.id + "&periode=" + DateHelper.formatDate(data.until, "YYYY-MM") + "&idKaRu=" + idKaRuangan + "&idJabatanAtasan1=" + data.jabatanAtasanLangsung.id + "&idJabatanAtasan2=" + data.jabatanPejabatPenilai.id);
                window.open(urlLaporan, "halamanCetakDua");
            }

            var holderCallback = function () { }
            $scope.cetakPermohonan = function (data) {
                //debugger;
                if (!data) {
                    messageContainer.error("Data Tidak Ditemukan");
                    return;
                }
                var listRawRequired = [
                    "currentData.atasanLangsung|k-ng-model|Atasan langsung",
                    "currentData.jabatanAtasanLangsung|ng-model|Jabatan atasan langsung",
                    "currentData.pejabatPenilai|k-ng-model|Pejabat penilai",
                    "currentData.jabatanPejabatPenilai|ng-model|Jabatan pejabat penilai"
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    if (data.statusPegawai === "Izin") {
                        var idKaRuangan = data.kepalaRuangan ? data.kepalaRuangan.id : "";
                        var urlLaporan = cetakHelper.openURLReporting("reporting/lapSuratIzin?noRecPlanning=" + data.noRec + "&idAtasan=" + data.atasanLangsung.id + "&idJabatanAtasan=" + data.jabatanAtasanLangsung.id);
                        $scope.winDialog.close();
                        delete $scope.currentData.pegawai1;
                        delete $scope.currentData.pegawai2;
                        window.open(urlLaporan, "halamanCetak", "width=800, height=600");
                        // messageContainer.error("Tidak dapat mencetak Surat Izin Cuti");
                        // return;
                    } else if (data.statusPegawai === "Cuti Alasan Penting") {
                        var idKaRuangan = data.kepalaRuangan ? data.kepalaRuangan.id : "";
                        var urlSuratIzinSementara = cetakHelper.openURLReporting("reporting/suratIzinSementara?noRecPlanning=" + data.noRec + "&idAtasan1=" + data.atasanLangsung.id + "&idAtasan2=" + data.pejabatPenilai.id + "&periode=" + DateHelper.formatDate(data.until, "YYYY-MM") + "&idKaRu=" + idKaRuangan + "&idJabatanAtasan1=" + data.jabatanAtasanLangsung.id + "&idJabatanAtasan2=" + data.jabatanPejabatPenilai.id);
                        var urlLaporan = cetakHelper.openURLReporting("reporting/lapPermohonanCuti?noRecPlanning=" + data.noRec + "&idAtasan1=" + data.atasanLangsung.id + "&idAtasan2=" + data.pejabatPenilai.id + "&periode=" + DateHelper.formatDate(data.until, "YYYY-MM") + "&idKaRu=" + idKaRuangan + "&idJabatanAtasan1=" + data.jabatanAtasanLangsung.id + "&idJabatanAtasan2=" + data.jabatanPejabatPenilai.id);
                        $scope.winDialog.close();
                        delete $scope.currentData.pegawai1;
                        delete $scope.currentData.pegawai2;
                        if (listPegawaiAdminSDM.includes($scope.pegawai.id)) {
                            if (data.pegwaiId == $scope.pegawai.id) {
                                window.open(urlLaporan, "halamanCetakDua", "width=800, height=600, top=10, left=10");
                            }
                            var popUp = window.open(urlSuratIzinSementara, "halamanCetakSatu", "width=800, height=600, top=30, left=30");
                            if (popUp == null || typeof (popUp) == 'undefined') {
                                alert('Please disable your pop-up blocker and click "Cetak" button again.');
                            }
                        } else {
                            window.open(urlLaporan, "halamanCetakDua", "width=800, height=600, top=10, left=10");
                        }
                    } else if (data.statusPegawai === "Tugas Luar") {
                        var idKaRuangan = data.kepalaRuangan ? data.kepalaRuangan.id : "";
                        var urlLaporan = cetakHelper.openURLReporting("reporting/suratTugas?noRecPlanning=" + data.noRec + "&idAtasan1=" + data.atasanLangsung.id + "&idAtasan2=" + data.pejabatPenilai.id + "&periode=" + DateHelper.formatDate(data.until, "YYYY-MM") + "&idKaRu=" + idKaRuangan + "&idJabatanAtasan1=" + data.jabatanAtasanLangsung.id + "&idJabatanAtasan2=" + data.jabatanPejabatPenilai.id);
                        $scope.winDialog.close();
                        delete $scope.currentData.pegawai1;
                        delete $scope.currentData.pegawai2;
                        window.open(urlLaporan, "halamanCetak", "width=800, height=600");
                    } else {
                        var idKaRuangan = data.kepalaRuangan ? data.kepalaRuangan.id : "";

                        var urlLaporan = cetakHelper.openURLReporting("reporting/lapPermohonanCuti?noRecPlanning=" + data.noRec + "&idAtasan1=" + data.atasanLangsung.id + "&idAtasan2=" + data.pejabatPenilai.id + "&periode=" + DateHelper.formatDate(data.until, "YYYY-MM") + "&idKaRu=" + idKaRuangan + "&idJabatanAtasan1=" + data.jabatanAtasanLangsung.id + "&idJabatanAtasan2=" + data.jabatanPejabatPenilai.id);
                        $scope.winDialog.close();
                        delete $scope.currentData.pegawai1;
                        delete $scope.currentData.pegawai2;
                        window.open(urlLaporan, "halamanCetak", "width=800, height=600");
                        // messageContainer.error("Tidak dapat mencetak Surat Izin Cuti");
                        // return;
                    }

                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }

            $scope.cetakPelimpahan = function (data) {
                if (!data) {
                    messageContainer.error("Data Tidak Ditemukan");
                    return;
                }
                var listRawRequired = [
                    "currentData.pegawaiDilimpah|k-ng-model|Pegawai yang dilimpahkan",
                    "currentData.jabatanPelimpah|ng-model|Jabatan yang dilimpahkan"
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var urlLaporan = cetakHelper.openURLReporting("reporting/suratPelimpahanTugas?noRecPlanning=" + data.noRec + "&idPegawaiPelimpah=" + data.pegwaiId + "&idJabatanPelimpah=" + data.jabatanPelimpah.id + "&idPegawaiDilimpah=" + data.pegawaiDilimpah.id);
                    $scope.winCetakPelimpahan.close();
                    window.open(urlLaporan, "halamanCetak", "width=800, height=600");
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }

            // $scope.pilihDokter = function(item, data) {
            //     if (data === undefined)
            //         data = $scope.item;

            //     $scope.item = data;
            //     findPegawai.getDokterBaru($scope.item.noRec, dateHelper.formatDate($scope.item.pasienDaftar.tglRegistrasi, 'YYYY-MM-DD')).then(function(data){
            //         debugger;
            //         $scope.dokters = new kendo.data.DataSource({
            //             data: data.data.data.data
            //         });
            //     })
            //     // show popup untuk pilih dokter
            //     $scope.winDialog.center().open();
            // }

            function penangguhan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var r = confirm("Lakukan Penangguhan ?");
                if (r == false) {
                    return;
                }


                var dataSend = {};
                dataSend = {
                    "noRec": dataItem.noRec,
                    "statusEnabled": dataItem.statusEnabled,

                }


                ManageSdmNew.saveData(dataSend, "sdm/save-pegawai-status").then(function (e) {
                    // console.log(JSON.stringify(e.data));

                    $scope.loadGrid();
                    load();
                });
            }


            function cetakSuratPengajuan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var win = window.open(medifirstService.getApiBackend() + 'report/cetak-cuti?norec=' + dataItem.norec, '_blank');
                win.focus();
                // $scope.item = dataItem;
                // if (!dataItem) {
                //     messageContainer.error("Data Tidak Ditemukan");
                //     return;
                // }
                // if (dataItem.statusPegawaiId == 28) {
                //     if (dataItem.noSuratTugas == undefined || dataItem.noSuratTugas == null) {
                //         messageContainer.error("No Surat Tugas tidak boleh kosong");
                //         return;
                //     }
                //     if (dataItem.noNotaDinas == undefined || dataItem.noNotaDinas == null) {
                //         messageContainer.error("No Nota Dinas tidak boleh kosong");
                //         return;
                //     }
                //     if (dataItem.tglNotaDinas == undefined || dataItem.tglNotaDinas == null) {
                //         messageContainer.error("Tanggal Nota Dinas tidak boleh kosong");
                //         return;
                //     }
                //     if (dataItem.jabatanIdPemberiNotaDinas == undefined || dataItem.jabatanIdPemberiNotaDinas == null) {
                //         messageContainer.error("Pemberi Nota Dinas tidak boleh kosong");
                //         return;
                //     }
                //     if (dataItem.alamatTugas == undefined || dataItem.alamatTugas == null) {
                //         messageContainer.error("Alamat Tugas tidak boleh kosong");
                //         return;
                //     }
                // }
                // if ($scope.loginUser.idSubUnitKerja == 26 || dataItem.pegwaiId == $scope.loginUser.idPegawai) {
                //     ManageSdmNew.getListData("sdm/get-pegawai-atasan/" + dataItem.pegwaiId).then(function (res) {
                //         if (res.data.data.length > 0) {
                //             dataItem.atasanLangsung = {
                //                 id: res.data.data[0].idAtasanLangsung,
                //                 namaLengkap: res.data.data.namaAtasanLangsung
                //             };
                //             dataItem.pejabatPenilai = {
                //                 id: res.data.data[0].idAtasanPejabatPenilai,
                //                 namaLengkap: res.data.data.namaAtasanPejabatPenilai
                //             }
                //         }
                //     }, function (error) {
                //         throw error;
                //     }).then(function () {
                //         $scope.loadWindow(dataItem);
                //     })
                // } else {
                //     messageContainer.error("Tidak dapat mencetak Surat Izin Cuti");
                //     return;
                // }
            }

            $scope.cetakPelimpahanTugas = function (data) {
                if (!data) {
                    messageContainer.error("Data Tidak Ditemukan");
                    return;
                }
                var dataItem = data;
                $scope.loadPelimpahan(dataItem);
            };

            $scope.cancelData = function () {
                delete $scope.currentData.pegawai1;
                delete $scope.currentData.pegawai2;
                $scope.winDialog.close();
            }

            // $scope.Batal = function () {
            //     load();
            // }

            $scope.loadWindow = function (data) {
                // debugger
                data.until = $scope.now;
                $scope.currentData = data;
                $scope.winDialog.center().open();
            }

            $scope.loadPelimpahan = function (data) {
                // debugger
                data.until = $scope.now;
                $scope.currentData = data;
                manageSarprasPhp.getDataTableTransaksi("historypegawai/get-drop-down-riwayat-jabatan-registered?id=" + data.pegwaiId).then(function (res) {
                    $scope.listJabatan1 = res.data.dataJabatanInternal
                    $scope.currentData.jabatanPelimpah = $scope.listJabatan1[0]
                })
                $scope.winCetakPelimpahan.center().open();
            }

            $scope.$watch('currentData.atasanLangsung', function (e) {
                if (!e) return;
                manageSarprasPhp.getDataTableTransaksi("historypegawai/get-drop-down-riwayat-jabatan-registered?id=" +
                    e.id).then(function (res) {
                        $scope.listJabatan1 = res.data.dataJabatanInternal
                        $scope.currentData.jabatanAtasanLangsung = $scope.listJabatan1[0]
                    })
            })

            $scope.$watch('currentData.pejabatPenilai', function (e) {
                if (!e) return;
                manageSarprasPhp.getDataTableTransaksi("historypegawai/get-drop-down-riwayat-jabatan-registered?id=" +
                    e.id).then(function (res) {
                        $scope.listJabatan2 = res.data.dataJabatanInternal
                        $scope.currentData.jabatanPejabatPenilai = $scope.listJabatan2[0]
                    })
            })
        }
    ]);
});