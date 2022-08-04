define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('RincianLabRegistrasiCtrl', ['$scope', 'MedifirstService', '$state', 'CacheHelper', '$window',
        function ($scope, medifirstService, $state, cacheHelper, $window) {
            // debugger;
            $scope.item = {};
            // $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isLoading = false;
            var norec_apd = ''
            var norec_pd = ''
            var norecPPas = ''

            var norec_so = ''
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.PegawaiLogin2 = {};
            var namaRuangan = ''
            var namaRuanganFk = ''
            var departemenfk = ''
            var tglpulang = ''
            
            $scope.item = {
                tglInput: new Date(),
                tglInputCetak: new Date()
            };
            var urlHasilVansLab = ''
            medifirstService.get('sysadmin/settingdatafixed/get/urlHasilVansLab').then(function (dat) {
                urlHasilVansLab = dat.data

            })
            LoadCache();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('RincianLabRegistrasi');
                if (chacePeriode != undefined) {
                    $scope.item.noMr = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.kelompokPasien = chacePeriode[13]
                    $scope.item.umur = chacePeriode[4]
                    $scope.listKelas = ([{ id: chacePeriode[5], namakelas: chacePeriode[6] }])
                    $scope.item.kelas = { id: chacePeriode[5], namakelas: chacePeriode[6] }
                    $scope.item.tglRegistrasi = chacePeriode[7]
                    $scope.item.dokter = chacePeriode[14]
                    norec_apd = chacePeriode[8]
                    namaRuangan = chacePeriode[9]
                    namaRuanganFk = chacePeriode[10]
                    norec_pd = chacePeriode[11]
                    norec_so = chacePeriode[12]
                    departemenfk = chacePeriode[16]
                    $scope.item.jenisPenjamin = chacePeriode[17]
                    $scope.item.golonganDarah = chacePeriode[19]
                    tglpulang = chacePeriode[20]

                    //  ** cek status closing
                    medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                        if (rese.data.status == true) {
                            toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                            $scope.isSelesaiPeriksa = true
                        }
                    })




                    $scope.item.ruanganAsal = namaRuangan;

                    medifirstService.get("sysadmin/general/get-sudah-verif?noregistrasi=" +
                        $scope.item.noregistrasi, true).then(function (dat) {
                            $scope.item.statusVerif = dat.data.status
                        });

                    init()

                } else {

                }

            }
            loadEditor()
            function init() {
                $scope.isLoading = true;

                medifirstService.get("radiologi/get-data-combo-labrad").then(function (dat) {
                    $scope.listruangan = dat.data.ruangan;
                    // $scope.listLayanan = dat.data.produk;
                    $scope.listDokter = dat.data.dokter;
                })
                // if (norec_apd != null) {

                medifirstService.get("radiologi/get-rincian-pelayanan-lab?noregistrasifk=" + norec_apd
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
                            if( dat.data.data[i].statusperiksa == 1)
                            {
                                dat.data.data[i].statusperiksa = "✔";
                            }else
                            {
                                dat.data.data[i].statusperiksa = "✘";
                            }
                            
                            for (var j = 0; j < dat.data.data[i].pp.data.length; j++) {
                                debugger;
                                if(dat.data.data[i].pp.data[j].hasil) {
                                    // dat.data.data[i].flag = dat.data.data[i].pp.data[j].flag
                                    let HasilInput = dat.data.data[i].pp.data[j].hasil
                                    if(dat.data.data[i].flag != "Y") {
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
            
                                        }
                                        else {
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

                        if (dat.data.data[0].objectdepartemenfk == 27) {
                            $scope.showRadiologi = true;
                        }
                        
                        // if (dat.data.data.length > 0) {
                        //     $scope.item.tgllahir = dat.data.data[0].tgllahir
                        //     $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                        // }


                    },
                    function (error) {
                        $scope.isLoading = false;
                    });
                // } else {
                // $scope.isLoading = false;
                // }


            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            $scope.columnGrid = {
                columns: [
                    {
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

            $scope.selectRow = function (dataItem) {
                var dataSelect = _.find($scope.dataGrid._data, function (data) {
                    return data.norec_pp == dataItem.norec_pp;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                }
                else {
                    dataSelect.statCheckbox = true;
                }

                $scope.tempCheckbox = dataSelect.statCheckbox;

                reloadDataGrid($scope.dataGrid._data);

            }
            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.dataGrid._data;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                    }
                }
                else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                    }
                }

                reloadDataGrid(tempData);
            }

            function reloadDataGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    _data: ds,
                    // pageSize: 10,
                    total: ds.length,
                    serverPaging: false,
                    aggregate: [
                        { field: 'total', aggregate: 'sum' },
                    ]

                });

                var grid = $('#kGrids').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();

            }


            $scope.columnGridOrder = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Qty",
                    "width": "40px",
                }
            ];
            $scope.back = function () {
                window.history.back();
            }
            $scope.order = function () {
                $scope.CmdOrderPelayanan = false;
                $scope.OrderPelayanan = true;
            }
            $scope.Batal = function () {

            }


            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
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
            $scope.InputTindakan = function () {

                if ($scope.isSelesaiPeriksa == true) {
                    window.messageContainer.error("Pelayanan yang sudah di Closing tidak bisa di ubah!");
                    return;
                }
                if(namaRuanganFk==575 && departemenfk==16 && tglpulang!=null && $scope.item.password != "donatelo"){
                    toastr.error('Pasien Rawat Inap ini sudah Pulang', 'Peringatan!')
                    $scope.popupMergePendaftaran.center().open();
					return;
                }
                if ($scope.item) {
                    $state.go('InputTindakan', {
                        norecPD: norec_pd,
                        norecAPD: norec_apd,

                    });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }

            $scope.simpanPassword = function(){
                if ($scope.item.password != "donatelo") {
                    toastr.error("Password Salah!")
                    return;
                }
                toastr.info("Silahkan Klik Tombol Input Tindakan Kembali!")
                $scope.popupMergePendaftaran.close();
            }

             $scope.HapusTindakan2 = function () {
                if ($scope.isSelesaiPeriksa == true) {
                    window.messageContainer.error("Pelayanan yang sudah di Closing tidak bisa di ubah!");
                    return;
                }
                var logData = []
                var dataDel = []
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        var data = {
                            "norec_pp": $scope.dataGrid._data[i].norec_pp,
                            "namaruangan": $scope.dataGrid._data[i].ruangan,
                        }
                        dataDel.push(data)

                        logData.push({
                            "norec_apd": $scope.dataGrid._data[i].norec_apd,
                            "tglPelayanan": $scope.dataGrid._data[i].tglpelayanan,
                            "diskon": $scope.dataGrid._data[i].hargadiscount,
                            "harga": $scope.dataGrid._data[i].hargasatuan,
                            "jumlah": $scope.dataGrid._data[i].jumlah,
                            "klid": 6,
                            "prid": $scope.dataGrid._data[i].produkfk,
                            "jasa": 0,

                        })
                    }
                }

                var objDelete = {
                    "dataDel": dataDel,
                    "noregistrasi": $scope.item.noregistrasi,
                    "alasan": $scope.item.alasan,
                    "pegawai": nama
                };
                if (dataDel.length > 0) {

                    medifirstService.post('radiologi/delete-pelayanan-pasien', objDelete).then(function (e) {
                        if (e.status === 201) {
                            $scope.item.alasan ="";
                            $scope.popUpHapus.close();
                            var objLog = {
                                pelayananpasiendelete: logData
                            }
                            medifirstService.postNonMessage('sysadmin/logging/save-log-hapus-tindakan', objLog).then(function (e) {
                            })
                        }
                        init()
                    })
                }
                else {
                    toastr.error('Ceklis yang mau di hapus')
                }
            };
            $scope.HapusTindakan = function () {
                 if ($scope.isSelesaiPeriksa == true) {
                    window.messageContainer.error("Pelayanan yang sudah di Closing tidak bisa di ubah!");
                    return;
                }
               
                var x = []
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        var data = {
                            "norec_pp": $scope.dataGrid._data[i].norec_pp,
                            "namaruangan": $scope.dataGrid._data[i].ruangan,
                        }
                        x.push(data)
                 
                    }
                }

               
                if (x.length <= 0) {
                    toastr.error('Ceklis yang mau di hapus')
                    return;
                }
                $scope.popUpHapus.center().open();
            }
             $scope.kantongdarah = function () {                               
                var x = []
                debugger;
                 norecPPas = $scope.dataSelected.norec_pp
                 medifirstService.get('radiologi/get-nokantong?norec_pp=' + norecPPas).then(function (e) {
                    if (e.data.length > 0) {
                        $scope.item.nokantong = e.data[0].nokantong
                    } else {
                        // toastr.error('Hasil Belum Ada')
                        // return
                    }

                })
                $scope.popUpKantongdarah.center().open();
            }
             $scope.simpankantong = function () {                               
               
                var objsimpan = {                   
                    "norecpp": norecPPas,
                    "nokantong": $scope.item.nokantong
                };
              
                medifirstService.post('radiologi/simpan-nokantong', objsimpan).then(function (e) {
                    if (e.status === 201) {
                        $scope.item.alasan ="";
                        $scope.item.nokantong = "";
                        $scope.popUpKantongdarah.close();
                        init()
                    }
                    
                })
            
            }
            $scope.saveLogging = function (jenis, referensi, noreff, ket) {

                medifirstService.get("syadmin/logging/save-log-all?jenislog=" + jenis
                    + "&referensi=" + referensi
                    + "&noreff=" + noreff
                    + "&keterangan=" + ket
                ).then(function (data) {

                })
            }
            $scope.BridgingZeta = function () {
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        if ($scope.dataGrid._data[i].idbridging != null) {
                            toastr.error('Data Sudah Dikirim Ke RIS')
                            return
                        }
                        var parameter = $scope.dataGrid._data[i].ruangan;
                        if (parameter.indexOf('Laboratorium') >= 0 ||
                            parameter.indexOf('Bank Darah') >= 0) {
                            toastr.error('Kirim Ke RIS hanya untuk Radiologi')
                            return
                        }

                        if ($scope.dataGrid._data[i].noorder == null) {
                            var data2 = [];
                            for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                if ($scope.dataGrid._data[i].statCheckbox) {
                                    var data = {
                                        "produkfk": $scope.dataGrid._data[i].produkfk,
                                        "namaproduk": $scope.dataGrid._data[i].namaproduk,
                                        "qtyproduk": parseFloat($scope.dataGrid._data[i].jumlah),
                                        "objectruanganfk": $scope.dataGrid._data[i].objectruanganfk,
                                        "objectruangantujuanfk": $scope.dataGrid._data[i].objectruanganfk,
                                        "objectkelasfk": $scope.item.kelas.id,
                                        "norec_pp": $scope.dataGrid._data[i].norec_pp,
                                        "namadokter": $scope.dataGrid._data[i].dokter,
                                        "dokterid": $scope.dataGrid._data[i].dokterid,
                                        "iscito": $scope.dataGrid._data[i].iscito,
                                    }
                                    data2.push(data)
                                }
                            }

                            var objSave = {
                                status: "bridinglangsung",
                                norec_apd: norec_apd,
                                norec_pd: norec_pd,
                                norec_so: "",
                                qtyproduk: data2.length,
                                objectruanganfk: $scope.dataGrid._data[0].objectruanganfk,
                                objectruangantujuanfk: $scope.dataGrid._data[0].objectruanganfk,
                                departemenfk: $scope.dataGrid._data[0].objectdepartemenfk,
                                pegawaiorderfk: $scope.dataGrid._data[0].dokterid,
                                details: data2
                            }


                            medifirstService.post('radiologi/save-order-pelayanan', objSave).then(function (e) {
                                var responeData = e

                                var dataPost = [];
                                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                    if ($scope.dataGrid._data[i].statCheckbox) {
                                        var datasys = {
                                            "produkid": $scope.dataGrid._data[i].produkfk,
                                        }
                                        dataPost.push(datasys)
                                    }
                                }

                                var itemsave = {
                                    "bridging": dataPost,
                                    "noorder": e.data.strukorder.noorder,
                                    "objectkelasfk": $scope.item.kelas.id,
                                    "objectruangantujuanfk": $scope.dataGrid._data[0].objectruanganfk,
                                    "objectpegawaiorderfk": $scope.dataGrid._data[0].dokterid,
                                    "iddokterverif": $scope.dataGrid._data[0].dokterid,
                                    "namadokterverif": $scope.dataGrid._data[0].dokter,
                                }
                                medifirstService.post('bridging/penunjang/save-bridging-zeta', itemsave).then(function (e) {
                                    init()
                                })
                            })
                        } else {
                            if ($scope.dataGrid._data[i].idbridging == null) {
                                var dataPost = [];
                                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                    if ($scope.dataGrid._data[i].statCheckbox) {
                                        var datasys = {
                                            "produkid": $scope.dataGrid._data[i].produkfk,
                                            "noorder": $scope.dataGrid._data[i].noorder,
                                        }
                                        dataPost.push(datasys)
                                    }
                                }

                                var itemsave = {
                                    "bridging": dataPost,
                                    "noorder": dataPost[0].noorder,
                                    "objectkelasfk": $scope.item.kelas.id,
                                    "objectruangantujuanfk": $scope.dataGrid._data[0].objectruanganfk,
                                    "objectpegawaiorderfk": $scope.dataGrid._data[0].dokterid,
                                    "iddokterverif": $scope.dataGrid._data[0].dokterid,
                                    "namadokterverif": $scope.dataGrid._data[0].dokter,
                                }


                                medifirstService.post('bridging/penunjang/save-bridging-zeta', itemsave).then(function (e) {
                                    init()
                                })
                            }

                        }
                    }

                }

            }
            $scope.BridgingSysmex = function () {

                let datacek = []
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        datacek.push($scope.dataGrid._data[i])
                    }
                }
                if (datacek.length == 0) {
                    toastr.error('Ceklis data yang mau dikirim')
                    return
                }
                $scope.popUpDokter.center().open();
            }
            $scope.simpanDokter = function (dokter) {
                if (dokter == undefined) {
                    toastr.error('Pilih dokter dulu')
                    return
                }
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        if ($scope.dataGrid._data[i].idbridging != null) {
                            toastr.error('Data Sudah Dikirim Ke LIS')
                            return
                        }
                        var parameter = $scope.dataGrid._data[i].ruangan;
                        if (parameter.indexOf('Radiologi') >= 0) {
                            toastr.error('Kirim Ke LIS hanya untuk Lab')
                            return
                        }

                        if ($scope.dataGrid._data[i].noorder == null) {
                            var data2 = [];
                            for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                if ($scope.dataGrid._data[i].statCheckbox) {
                                    var data = {
                                        "produkfk": $scope.dataGrid._data[i].produkfk,
                                        "namaproduk": $scope.dataGrid._data[i].namaproduk,
                                        "qtyproduk": parseFloat($scope.dataGrid._data[i].jumlah),
                                        "objectruanganfk": $scope.dataGrid._data[i].objectruanganfk,
                                        "objectruangantujuanfk": $scope.dataGrid._data[i].objectruanganfk,
                                        "objectkelasfk": $scope.item.kelas.id,
                                        "norec_pp": $scope.dataGrid._data[i].norec_pp,
                                        "namadokter": $scope.dataGrid._data[i].dokter,
                                        "dokterid": $scope.dataGrid._data[i].dokterid,
                                        "iscito": $scope.dataGrid._data[i].iscito,
                                    }
                                    data2.push(data)
                                }
                            }

                            var objSave = {
                                status: "bridinglangsung",
                                norec_apd: norec_apd,
                                norec_pd: norec_pd,
                                norec_so: "",
                                qtyproduk: data2.length,
                                // norec_pp:$scope.dataGrid._data[0].norec_pp,
                                objectruanganfk: $scope.dataGrid._data[0].objectruanganfk,
                                objectruangantujuanfk: $scope.dataGrid._data[0].objectruanganfk,
                                departemenfk: $scope.dataGrid._data[0].objectdepartemenfk,
                                pegawaiorderfk: $scope.dataGrid._data[0].dokterid,
                                details: data2
                            }


                            medifirstService.post('radiologi/save-order-pelayanan', objSave).then(function (e) {
                                var responeData = e

                                var dataPost = [];
                                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                    if ($scope.dataGrid._data[i].statCheckbox) {
                                        var datasys = {
                                            "produkid": $scope.dataGrid._data[i].produkfk,
                                        }
                                        dataPost.push(datasys)
                                    }
                                }

                                var itemsave = {
                                    "bridging": dataPost,
                                    "noorder": e.data.strukorder.noorder,
                                    "objectkelasfk": $scope.item.kelas.id,
                                    "objectruangantujuanfk": $scope.dataGrid._data[0].objectruanganfk,
                                    "objectpegawaiorderfk": $scope.dataGrid._data[0].dokterid,
                                    "iddokterverif": $scope.dataGrid._data[0].dokterid,
                                    "namadokterverif": $scope.dataGrid._data[0].dokter,
                                    "iddokterorder": dokter.id,
                                    "namadokterorder": dokter.namalengkap,
                                }
                                medifirstService.post('bridging/penunjang/save-bridging-vans-lab', itemsave).then(function (e) {
                                    // medifirstService.post('bridging/penunjang/save-bridging-sysmex', itemsave).then(function (e) {
                                    init()
                                })
                            })

                        } else {
                            if ($scope.dataGrid._data[i].idbridging == null) {
                                var dataPost = [];
                                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                                    if ($scope.dataGrid._data[i].statCheckbox) {
                                        var datasys = {
                                            "produkid": $scope.dataGrid._data[i].produkfk,
                                            "noorder": $scope.dataGrid._data[i].noorder,
                                        }
                                        dataPost.push(datasys)
                                    }
                                }

                                var itemsave = {
                                    "bridging": dataPost,
                                    "noorder": dataPost[0].noorder,
                                    "objectkelasfk": $scope.item.kelas.id,
                                    "objectruangantujuanfk": $scope.dataGrid._data[0].objectruanganfk,
                                    "objectpegawaiorderfk": $scope.dataGrid._data[0].dokterid,
                                    "iddokterverif": $scope.dataGrid._data[0].dokterid,
                                    "namadokterverif": $scope.dataGrid._data[0].dokter,
                                    "iddokterorder": dokter.id,
                                    "namadokterorder": dokter.namalengkap,
                                }
                                medifirstService.post('bridging/penunjang/save-bridging-vans-lab', itemsave).then(function (e) {
                                    // medifirstService.post('bridging/penunjang/save-bridging-sysmex', itemsave).then(function (e) {
                                    init()
                                })
                            }
                        }
                    }

                }
                $scope.popUpDokter.close();
            }


            $scope.LihatHasil = function () {
                if ($scope.dataSelected == undefined) {

                    toastr.error('Pilih No Order dulu')
                    return
                }
                if ($scope.dataSelected.statusbridging != '✔') {
                    toastr.error('Belum Di kirim Ke RIS')
                    return
                }
                medifirstService.get('radiologi/get-hasil-radiologi?norec_pp=' + $scope.dataSelected.norec_pp).then(function (e) {
                    if (e.data.length > 0) {
                        var acc = e.data[0].acc_number
                        $window.open("http://10.10.100.6/ZFP?mode=proxy&lights=on&titlebar=on#View&ris_exam_id=" + acc + "&un=p0l1&pw=dr5sqaoU5WiMkzGx%2fuplGybTyEKpoZMsJMqT9Ib1qLtg18b1bRrEEru7I%2flvB1Zg", "_blank");


                    } else {
                        toastr.error('Hasil Belum Ada')
                        return
                    }

                })

                // $scope.noOrder = $scope.dataSelected.noorder;
                // let acc  = $scope.dataSelected.noorder+ $scope.dataSelected.no
                // acc = acc.replace('R','')

                // if ($scope.showRadiologi == true) {
                //     medifirstService.get("radiologi/get-acc-number?noOrder=" + $scope.noOrder)
                //         .then(function (e) {
                //             $scope.dataRisOrder = e.data.data[0];

                //             if ($scope.dataRisOrder != undefined) {
                //                 $window.open("http://182.23.26.34:1111/URLCall.do?LID=dok&LPW=dok&LICD=003&PID=" + $scope.item.noMr + '&ACN=' + $scope.dataRisOrder.accession_num, "_blank");
                //             } else {
                //                 toastr.error('Data Belum dikirim ke RIS')
                //             }
                //         })
                // } else {
                //     if(urlHasilVansLab ==''){
                //         toastr.error('Periksa Setting Data Fixed VANS LAB ')
                //         return
                //     }
                //     $window.open(urlHasilVansLab + $scope.noOrder, "_blank");

                //     // if (norec_apd != null) {
                //     //     var arrStr = {
                //     //         0: $scope.dataSelected.nocm,
                //     //         1: $scope.dataSelected.namapasien,
                //     //         2: $scope.dataSelected.jeniskelamin,
                //     //         3: $scope.item.noregistrasi,
                //     //         4: $scope.item.umur,
                //     //         5: $scope.item.kelompokPasien,
                //     //         6: $scope.item.tglRegistrasi,
                //     //         7: norec_apd,
                //     //         8: norec_pd,
                //     //         9: $scope.item.kelas.id,
                //     //         10: $scope.item.kelas.namakelas,
                //     //         11: namaRuanganFk,
                //     //         12: namaRuangan
                //     //     }
                //     //     cacheHelper.set('chaceHasilLab', arrStr);

                //     //     $state.go('HasilLaboratorium', {
                //     //         norecPd: norec_pd,
                //     //         noOrder: $scope.noOrder,
                //     //         norecApd: norec_apd
                //     //     })
                //     // } else {
                //     //     toastr.info('Hasil Lab belum ada')
                //     // }
                // }


            }
            $scope.cetakBuktiLayanan = function () {
                if ($scope.item.noregistrasi != undefined && norec_apd != null) {
                    //cetakan langsung service VB6 by grh
                    var stt = 'false'
                    if (confirm('View Bukti Layanan? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();

                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec='
                        + $scope.item.noregistrasi + '&strIdPegawai=' + $scope.pegawai.id +
                        '&strIdRuangan=ORDERRADIOLOGI' + norec_apd + '&view=' + stt, function (response) {
                            // do something with response
                        });

                }
            }
            $scope.CetakBuktiLayananPerTindakan = function () {
                var daftarCetak = [];
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        daftarCetak.push($scope.dataGrid._data[i].norec_pp)
                    }
                }

                if (daftarCetak.length == 0) {
                    toastr.error('Ceklis data yang mau di cetak')
                    return
                }

                var resultCetak = daftarCetak.map(a => a).join("|");
                var pegawai = JSON.parse(localStorage.getItem('pegawai'))
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-norec_apd=1&norec=' + resultCetak + '&strIdPegawai=' + pegawai.id + '&strIdRuangan=-&view=true', function (response) {

                });
            }
            // $scope.LihatEkpertise = function () {
            //     if ($scope.dataSelected == undefined) {

            //         toastr.error('Pilih Pelayanan Dulu')
            //         return
            //     }
            //     $scope.noOrder = $scope.dataSelected.noorder;
            //     if ($scope.showRadiologi == true) {


            //             var arrStr = {
            //                 0: $scope.dataSelected.nocm,
            //                 1: $scope.dataSelected.namapasien,
            //                 2: $scope.dataSelected.jeniskelamin,
            //                 3: $scope.item.noregistrasi,
            //                 4: $scope.item.umur,
            //                 5: $scope.item.kelompokPasien,
            //                 6: $scope.item.tglRegistrasi,
            //                 7: norec_apd,
            //                 8: norec_pd,
            //                 9: $scope.item.kelas.id,
            //                 10: $scope.item.kelas.namakelas,
            //                 11: namaRuanganFk,
            //                 12: namaRuangan
            //             }
            //             cacheHelper.set('chaceHasilRadiologi', arrStr);

            //             $state.go('HasilRadiologi', {
            //                 norecPd: norec_pd,
            //                 noOrder: $scope.noOrder,
            //                 norecApd: norec_apd
            //             })
            //         } 
            //     }

            $scope.LihatEkpertise = function () {
                if ($scope.dataSelected == undefined) {
                    window.messageContainer.error("Pilih Data Dulu!");
                    return;
                }
                $scope.hideExper = false
                $scope.norecHasilRadiologi = ''
                $scope.item.namaPelayanan = $scope.dataSelected.namaproduk
                // $scope.item.dokters = $scope.dataSelected.dokter
                if($scope.dataSelected.iddokterpengirim != undefined && $scope.dataSelected.iddokterpengirim != "" && $scope.dataSelected.iddokterpengirim != 0)
                {
                    $scope.item.dokterperujuk = { id: $scope.dataSelected.iddokterpengirim, namalengkap: $scope.dataSelected.dokterpengirim }
                }
                // $scope.item.dokter = { id: e.data[0].pegawaifk, namalengkap: e.data[0].namalengkap }
                $scope.item.dokter = { id: $scope.dataSelected.dokterid, namalengkap:  $scope.dataSelected.dokter}
                medifirstService.get('radiologi/get-hasil-radiologi?norec_pp=' + $scope.dataSelected.norec_pp + '&idproduk=' + $scope.dataSelected.produkfk).then(function (e) {
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
                            $scope.item.keterangan = e.data[0].keterangan;//.replace(/~/g, "\n")

                            $scope.item.dokterperujuk = { id: e.data[0].dokterperujuk, namalengkap: e.data[0].namadokterperujuk }
                            $scope.item.ruanganperujuk = { id: e.data[0].ruanganperujukfk, namaruangan: e.data[0].namaruangan }
                        // }
                    }
                    else
                    {
                        // medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk=' + $scope.dataSelected.produkfk + '&objectpegawaifk=' + $scope.dataSelected.dokterid).then(function (res) {
                        //     if (res.data.data.length > 0) 
                        //              $scope.item.keterangan = res.data.data[0].keterangan;//.replace(/~/g, "\n")
                        //              $scope.item.tglInput = new Date()
                        //              $scope.item.dokter = { id:  $scope.dataSelected.dokterid, namalengkap:  $scope.dataSelected.dokter}
                        //     })
                    }
                   
                    $scope.popUpEkpertise.center().open();
                   
                })
                
                // medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk' + $scope.dataSelected.produkfk + '&objectpegawaifk=' + $scope.dataSelected.dokterid).then(function (res) {
                //         if (res.data.data.length > 0) 
                //                  $scope.item.keterangan = e.data[0].keterangan;//.replace(/~/g, "\n")
                //                  $scope.popUpEkpertise.center().open();
                //         })
                   
            
                
                
            }
            $scope.cetakEks = function () {

                if ($scope.norecHasilRadiologi != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    var nama = medifirstService.getPegawaiLogin().namaLengkap
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-ekspertise?norec=" + $scope.norecHasilRadiologi + '&kdprofile=' + profile
                            + '&nama=' + nama, '_blank');
                    }
                }
            }
            $scope.BatalEkpertise = function () {

                $scope.norecHasilRadiologi = ''
                $scope.item.nofoto = undefined
                $scope.item.tglInput = new Date()
                $scope.item.dokter = undefined
                $scope.item.keterangan = undefined
                $scope.popUpEkpertise.close();
            }


            $scope.SaveEkpertise = function () {
                var r = confirm("Yakin Simpan?");
                var dokterperujuk = null;
                var ruanganperujuk = null;
                  if (r == false) {
                    return;                
                  }
                if ($scope.item.nofoto == undefined) {
                    window.messageContainer.error("No Foto Tidak Boleh Kosong!");
                    return;
                }
                if ($scope.item.tglInput == undefined) {
                    window.messageContainer.error("Tanggal Tidak Boleh Kosong!");
                    return;
                }
                if ($scope.item.dokter == undefined) {
                    window.messageContainer.error("Dokter Tidak Boleh Kosong!");
                    return;
                }
                if ($scope.item.keterangan == undefined) {
                    window.messageContainer.error("Keterangan Tidak Boleh Kosong!");
                    return;
                }
                if ($scope.item.dokterperujuk != null){
                    dokterperujuk = $scope.item.dokterperujuk.id
                }
                if ($scope.item.ruanganperujuk != null){
                    ruanganperujuk = $scope.item.ruanganperujuk.id
                }
                var objSave = {
                    noregistrasi: $scope.item.noregistrasi,
                    nofoto: $scope.item.nofoto,
                    tglinput: moment($scope.item.tglInput).format('YYYY-MM-DD HH:mm'),
                    dokterid: $scope.item.dokter.id,
                    keterangan: $scope.item.keterangan,//.replace(/\n/ig, '~'),
                    pelayananpasienfk: $scope.dataSelected.norec_pp,
                    norec_pd: norec_pd,
                    norec: $scope.norecHasilRadiologi,
                    acc_number: 'radiologi',
                    tglinputcetak: moment($scope.item.tglInputCetak).format('YYYY-MM-DD HH:mm'),
                    dokterperujukid: dokterperujuk,
                    ruanganperujukid: ruanganperujuk
                }
                $scope.hideExper = false
                medifirstService.post('radiologi/save-hasil-radiologi', objSave).then(function (e) {
                    debugger
                    $scope.norecHasilRadiologi =e.data.strukorder.norec;
                    init();
                    $scope.hideExper = true
                    // $scope.popUpEkpertise.close()
                    // var client = new HttpClient();
                    // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-pacs-report=1&jenis=report&norec=' + $scope.dataSelected.norec_pp + '&noorder=' + $scope.dataSelected.noorder + $scope.dataSelected.no + '&view=true', function (response) {
                    //         // do something with response
                    // });
                }, function (error) {
                    $scope.hideExper = true
                })

                medifirstService.get('sysadmin/general/get-daftar-template-hasil?idproduk=' + $scope.dataSelected.produkfk + '&objectpegawaifk=' + $scope.item.dokter.id).then(function (res) {
                    if (res.data.data.length == 0) 
                        var objSave = {
                            id :"",
                            produkfk: $scope.dataSelected.produkfk,
                            keterangan:  $scope.item.keterangan,
                            objectpegawaifk: $scope.item.dokter.id,
                            "method": 'save'
                        }   
                        medifirstService.post('sysadmin/general/save-template-hasil', objSave).then(function (e) { 
                        }, function (error) {
                            $scope.hideExper = false
                        })
                    })
            }
            $scope.hasilLab = function () {
                var user = medifirstService.getPegawaiLogin();
                var daftarCetak = [];
                for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                    if ($scope.dataGrid._data[i].statCheckbox) {
                        // daftarCetak.push($scope.dataGrid._data[i].norec_pp)
                        daftarCetak.push(
                            {
                                "norec_pp": $scope.dataGrid._data[i].norec_pp,
                                "tglPelayanan": $scope.dataGrid._data[i].tglpelayanan,
                            }
                        )
                    }
                }
                var dataCetakFix = '';
                var result = ''
                for (let i = 0; i < daftarCetak.length; i++) {
                    const element = daftarCetak[i];
                    if (daftarCetak.length == 1) {
                        dataCetakFix = "'" + element.norec_pp + "'"
                    } else if (daftarCetak.length == i + 1) {
                        dataCetakFix = dataCetakFix + "" + "'" + element.norec_pp + "'" + ""
                    } else {
                        dataCetakFix = dataCetakFix + "" + "'" + element.norec_pp + "'" + ","
                    }

                }
                if (daftarCetak.length == 0) {
                    toastr.error('Ceklis data yang mau di cetak')
                    return
                }

                if (norec_apd != null) {
                    var arrStr = {
                        0: $scope.item.noMr,
                        1: $scope.item.namaPasien,
                        2: $scope.item.jenisKelamin,
                        3: $scope.item.noregistrasi,
                        4: $scope.item.umur,
                        5: $scope.item.kelompokPasien,
                        6: $scope.item.tglRegistrasi,
                        7: norec_apd,
                        8: norec_pd,
                        9: $scope.item.kelas.id,
                        10: $scope.item.kelas.namakelas,
                        11: namaRuanganFk,
                        12: namaRuangan,
                        13: $scope.item.tgllahir,
                        14: $scope.item.objectjeniskelaminfk,
                        15: dataCetakFix,
                        // 16: $scope.dataGrid._data[i].tglpelayanan ,
                    }
                    cacheHelper.set('chaceHasilLab2', arrStr);

                    $state.go('HasilLaboratoriumRev', {
                        norecPd: norec_pd,
                        norecApd: norec_apd,
                        norecPP: dataCetakFix

                    })
                }

            }
            $scope.closePopUp = function () {
                $scope.popUpRiwayatHasil.close();
            }

            function dynamicEditor(container, options) {

                // if(options.model.tipedata == 1){
                //   var input = $('<input type="number" class="k-input k-textbox" name="hasil" data-bind="value:hasil">')
                //   input.appendTo(container);
                // }else{
                var input = $('<input type="text" class="k-input k-textbox" name="hasil" data-bind="value:hasil">');
                input.appendTo(container);
                // }
            };
            $scope.getRiwayatLab = function () {
                $scope.resultGrids = new kendo.data.DataSource({
                    data: []
                })

                $scope.ColumnResult = {
                    toolbar: [
                        "excel",

                    ],
                    excel: {
                        fileName: "riwayatPemeriksaanLab.xlsx",
                        allPages: true,
                    },
                    selectable: 'row',
                    pageable: true,
                    editable: true,
                    serverPaging: true,
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
                            }];

                        sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                    },
                    columns: [{
                        field: "tglpelayanan",
                        title: "Tgl. Pelayanan",
                        width: "20%"
                    }, {
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
                        editor: dynamicEditor
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
                        hidden: true,
                        field: "detailjenisproduk",
                        title: "Jenis Pemeriksaan"
                    },

                    {
                        hidden: true,
                        field: "nourutdetail"

                    }]
                };
                $scope.isRouteLoading = true
                var noRmGet = "";
                // medifirstService.get("laboratorium/get-pasien-lab-manual?nocmfk=" + $scope.item.noMr +'&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk ).then(function (data) {
                //     $scope.isRouteLoading = false;
                //     if ( data.data.length > 0) {
                //         noRmGet =   data.data[0].id
                //     }


                // });
                var produkfkJoin = "";
                if ($scope.dataSelected == undefined) {
                    window.messageContainer.error("Pilih Pelayanan Yg Akan Di Lihat!");
                    return;
                }
                else if ($scope.dataSelected.length >= 2 & $scope.dataSelected.objectdepartemenfk == 3) {
                    window.messageContainer.error("Pilih salah Satu");
                    return;
                }
                // for (var i = 0; i < $scope.dataGrid._data.length; i++) {
                //     if ($scope.dataGrid._data[i].statCheckbox) {

                //                 produkfkJoin= $scope.dataGrid._data[i].produkfk
                //                 $scope.dataGrid._data.selectRow.set

                //     }
                // }
                produkfkJoin = $scope.dataSelected.produkfk
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                if ($scope.item.tglAwal == undefined) {
                    tglAwal = "";
                    tglAkhir = "";
                }
                medifirstService.get("laboratorium/get-riwayat-lab-manual?nocmfk=" + $scope.item.noMr + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk
                    + "&tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir + "&produkfk=" + produkfkJoin).then(function (data) {
                        // var sourceGrid = []
                        $scope.isRouteLoading = false;
                        if (data.statResponse == true && data.data.data.length > 0) {

                            $scope.resultGridsRiwayat = new kendo.data.DataSource({
                                data: data.data.data,
                                group: [
                                    { field: "tglpelayanan" },
                                    { field: "detailjenisproduk" },
                                    { field: "namaproduk" }

                                ],
                                // sort: { field: "nourutdetail", dir: "asc" },
                                schema: {
                                    model: {
                                        // id: "id",
                                        fields: {
                                            detailjenisproduk: { editable: false, type: "string" },
                                            detailpemeriksaan: { editable: false, type: "string" },
                                            memohasil: { editable: false, type: "string" },
                                            namaproduk: { editable: false, type: "string" },
                                            satuanstandar: { editable: false, type: "string" },
                                            // detailpemeriksaan: { editable: false, type: "string" },
                                            nilaimax: { editable: false, type: "number" },
                                            nilaimin: { editable: false, type: "number" },
                                            hasil: { editable: (dynamicEditor) },
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

                                            }
                                            else {
                                                if (e.items[0].nilaimin != null) {
                                                    let a = parseFloat(e.items[0].nilaimin)
                                                    let b = parseFloat(e.items[0].nilaimax)
                                                    let hssl = parseFloat(e.items[0].hasil)

                                                    if (hssl >= a && hssl <= b) {
                                                        e.items[0].flag = "N"
                                                    } else {
                                                        e.items[0].flag = "Y"
                                                    }
                                                } else {
                                                    let hssl = e.items[0].hasil
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
                                        }
                                        // $scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
                                        $scope.resultGrids.fetch();
                                    }
                                }
                            });
                        } else {
                            toastr.info('Data Hasil tidak ada', 'Info')

                        }
                    });
                $scope.popUpRiwayatHasil.center().open();
            }
            $("#editor").kendoEditor({
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
                    "print"],
                resizable: {
                    content: true,
                    toolbar: true
                }
            });
            $scope.itemdok = {}
            $scope.model = {}
            $scope.inputDokterPelaksana = function () {
                if ($scope.dataSelected == undefined) {
                    messageContainer.error("Pilih pelayanan dahulu!");
                    return;
                }

                SeeDokterPelaksana();
                $scope.itemdok.tglPelayanans = $scope.dataSelected.tglpelayanan;
                $scope.itemdok.namaPelayanans = $scope.dataSelected.namaproduk;
                if ($scope.dataSelected.isparamedis == true)
                    $scope.itemdok.paramedis = true
                else
                    $scope.itemdok.paramedis = false
                $scope.popup_editor.center().open();

            }

            function SeeDokterPelaksana() {
                medifirstService.get("tatarekening/get-combo-jenis-petugas").then(function (data) {
                    $scope.listJenisPelaksana = data.data.jenispetugaspelaksana;
                    // $scope.listPegawaiPemeriksa = data.data.pegawai;

                });
                medifirstService.getPart("tatarekening/get-pegawai-saeutik", true, true, 10).then(function (data) {
                    $scope.listPegawaiPemeriksa = data;

                });
                // $scope.isRouteLoading=true;
                medifirstService.get("tatarekening/get-petugasbypelayananpasien?norec_pp=" + $scope.dataSelected.norec_pp).
                    then(function (data) {
                        $scope.sourceDokterPelaksana = data.data.data;
                        // $scope.isRouteLoading=false;

                    });
            }


            $scope.columnDokters = [
                {
                    field: "jenispetugaspe",
                    title: "Jenis Pelaksana",
                    width: "100px",
                    // template: "#= jenisPetugas.jenisPelaksana #"
                },
                {
                    field: "namalengkap",
                    title: "Nama Pegawai",
                    width: "200px",
                    // template: multiSelectArrayToString
                }
            ];
            $scope.simpanDokterPelaksana = function () {
                if ($scope.model.jenisPelaksana == undefined && $scope.itemdok.paramedis == undefined) {
                    if ($scope.model.jenisPelaksana == undefined) {
                        messageContainer.error("Jenis Pelaksana Tidak Boleh Kosong")
                        return
                    }
                    if ($scope.model.pegawais == undefined) {
                        messageContainer.error("Pegawai Tidak Boleh Kosong")
                        return
                    }
                }


                var norec_ppp = "";
                if ($scope.dataDokterSelected != undefined) {
                    norec_ppp = $scope.dataDokterSelected.norec_ppp
                }

                if (norec_ppp == "") {
                    if ($scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length > 0 && $scope.model.jenisPelaksana != undefined) {
                        for (let i = 0; i < $scope.sourceDokterPelaksana.length; i++) {
                            if ($scope.sourceDokterPelaksana[i].jenispetugaspe == $scope.model.jenisPelaksana.jenisPetugasPelaksana
                                // && $scope.sourceDokterPelaksana[i].pg_id ==$scope.model.pegawais.id
                            ) {
                                messageContainer.error("Jenis Pelaksana yg sama sudah ada !")
                                return
                            }
                        }
                    }
                }


                var pelayananpasienpetugas = {
                    norec_ppp: norec_ppp,
                    norec_pp: $scope.dataSelected.norec_pp,
                    norec_apd: $scope.dataSelected.norec_apd,
                    objectjenispetugaspefk: $scope.model.jenisPelaksana != undefined ? $scope.model.jenisPelaksana.id : undefined,
                    objectpegawaifk: $scope.model.pegawais != undefined ? $scope.model.pegawais.id : undefined,
                    isparamedis: $scope.itemdok.paramedis,
                }

                var objSave = {
                    pelayananpasienpetugas: pelayananpasienpetugas,

                }

                medifirstService.post('tatarekening/save-ppasienpetugas', objSave).then(function (e) {
                    var jenis = 'Input/Ubah Petugas Layanan';
                    var norec = e.data.data.norec
                    $scope.saveLogging(jenis, 'norec Pelayanan Pasien Petugas', norec, '')
                    SeeDokterPelaksana();
                    // LoadData();
                    init()

                    var data = {};
                    if ($scope.dataSelected != undefined && $scope.model.jenisPelaksana != undefined && $scope.model.jenisPelaksana.id == 4) {
                        if ($scope.dataSelected.namaPelayanan == $scope.item.namaPelayanans) {
                            data.dokter = $scope.model.pegawais.namalengkap
                            $scope.dataSelected.dokter = data.dokter

                        }
                    }

                    if ($scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length > 0) {
                        for (var i = $scope.sourceDokterPelaksana.length - 1; i >= 0; i--) {
                            if ($scope.sourceDokterPelaksana[i].jpp_id == '4' && $scope.itemdok.paramedis != true && $scope.model.pegawais == undefined) {
                                $scope.dataSelected.dokter = $scope.sourceDokterPelaksana[i].namalengkap
                                break
                            }

                        }
                    }
                    if ($scope.itemdok.paramedis == true) {
                        $scope.dataSelected.paramedis = "✔"

                    } else {
                        $scope.dataSelected.paramedis = ""

                    }
                    $scope.model.jenisPelaksana = undefined;
                    $scope.model.pegawais = undefined;
                    $scope.dataDokterSelected = undefined;
                })

            }


            $scope.hapusDokterPelaksana = function () {
                if ($scope.dataDokterSelected == undefined) {
                    messageContainer.error("Pilih data Pegawai dulu!!")
                    return
                }

                var pelayananpasienpetugas = {
                    norec_ppp: $scope.dataDokterSelected.norec_ppp,

                }

                var objSave = {
                    pelayananpasienpetugas: pelayananpasienpetugas,

                }
                medifirstService.post('tatarekening/hapus-ppasienpetugas', objSave).then(function (e) {
                    SeeDokterPelaksana();
                    // LoadData();
                    $scope.model.jenisPelaksana = "";
                    $scope.model.pegawais = "";
                    $scope.dataDokterSelected = undefined;
                })
                var data = {};
                if ($scope.dataSelected != undefined && $scope.model.jenisPelaksana.id == 4) {
                    if ($scope.dataSelected.namaPelayanan == $scope.itemdok.namaPelayanans) {
                        $scope.dataSelected.dokter = "-"

                    }
                }
            }

            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
                    + "&referensi=" + referensi
                    + "&noreff=" + noreff
                    + "&keterangan=" + ket
                ).then(function (data) {

                })
            }

            $scope.batalDokterPelaksana = function () {
                // LoadData();
                $scope.model.jenisPelaksana = "";
                $scope.model.pegawais = "";
                $scope.dataDokterSelected = undefined;
                $scope.popup_editor.center().close();
            }

            $scope.clickD = function (dataDokterSelected) {
                if (dataDokterSelected != undefined) {
                    medifirstService.get("tatarekening/get-pegawai-saeutik?namapegawai=" + dataDokterSelected.namalengkap, true, true, 10)
                        .then(function (data) {

                            $scope.listPegawaiPemeriksa.add(data.data[0])
                            $scope.model.pegawais = data.data[0];

                        })
                    $scope.model.jenisPelaksana = { id: dataDokterSelected.jpp_id, jenisPetugasPelaksana: dataDokterSelected.jenispetugaspe }

                }
            }
            $scope.itemPA = {}
            $scope.labPA = function () {
                if ($scope.dataSelected == undefined) {
                    window.messageContainer.error("Pilih Data Dulu!");
                    return;
                }
                $scope.norecPA = ''

                $scope.itemPA.namaPelayanan = $scope.dataSelected.namaproduk
                $scope.itemPA.dokters = $scope.dataSelected.dokter
                // $scope.itemPA.tglInput = new Date()
                $scope.itemPA.hasilPA = ''

                // $scope.findBy = 1
                medifirstService.get('laboratorium/get-hasil-lab-pa?norec_pp=' + $scope.dataSelected.norec_pp + '&idproduk=' + $scope.dataSelected.produkfk).then(function (e) {
                    if (e.data.length > 0) {
                        let res = e.data[0]
                        $scope.itemdok.NoPa = res.nomorpa,
                            $scope.norecPA = res.norec
                        $scope.itemPA.hasilPA = res.expertise
                        // $scope.itemPA.tglInput = new Date(res.tanggal)
                        // $scope.itemPA.dokter = { id: res.pegawaifk, namalengkap: res.namalengkap }
                        // $scope.itemPA.keterangan=res.keterangan.replace(/~/g,"\n")
                        // if (res.jenis != null && res.jenis == 'sitologi')
                        //     $scope.findBy = 1
                        // else
                        //     $scope.findBy = 0
                        // if(res.dokterpengirimfk)
                        //     $scope.itemPA.dokterPengirim1 = { id: res.dokterpengirimfk, namalengkap: res.namadokterpengirim }
                        // if( res.dokterluar)
                        //     $scope.itemPA.dokterPengirim2 = res.dokterluar
                        // $scope.itemPA.diagnosaKlinik = res.diagnosaklinik
                        // $scope.itemPA.ketKlinik = res.keteranganklinik
                        // $scope.itemPA.diagnosaPB = res.diagnosapb
                        // $scope.itemPA.ketPB = res.keteranganpb
                        // $scope.itemPA.topografi = res.topografi
                        // $scope.itemPA.morfologi = res.morfologi
                        // if (res.makroskopik)
                        //     $scope.itemPA.makroskopik = res.makroskopik.replace(/~/g, "\n")
                        // if (res.mikroskopik)
                        //     $scope.itemPA.mikroskopik = res.mikroskopik.replace(/~/g, "\n")
                        // if (res.kesimpulan)
                        //     $scope.itemPA.kesimpulan = res.kesimpulan.replace(/~/g, "\n")
                        // if (res.anjuran)
                        //     $scope.itemPA.anjuran = res.anjuran.replace(/~/g, "\n")

                    } else {
                        medifirstService.get('sysadmin/general/get-daftar-template?id=1').then(function (res) {
                            if (res.data.data.length > 0) 
                                $scope.itemPA.hasilPA = res.data.data[0].template

                            })
                    }
                    $scope.popUpPA.center().open();
                })
                // $scope.item.html = ""
                // $scope.popUpPA.center().open();
            }


            $scope.batalPA = function () {
                $scope.norecPA = ''
                $scope.itemPA = {}
                // $scope.findBy = 1
                // $scope.itemPA.tglInput = new Date()
                $scope.popUpPA.close();
            }

            $scope.saveLabPa = function () {

                // return
                // if ($scope.itemdok.NoPa == undefined) {
                //     window.messageContainer.error("Nomor Pa Tidak Boleh Kosong!");
                //     return;
                // }

                // if ($scope.itemPA.tglInput == undefined) {
                //     window.messageContainer.error("Tanggal Tidak Boleh Kosong!");
                //     return;
                // }
                // if ($scope.itemPA.dokter == undefined) {
                //     window.messageContainer.error("Dokter Tidak Boleh Kosong!");
                //     return;
                // }
                if ($scope.itemPA.hasilPA == undefined) {
                    window.messageContainer.error("Hasil Tidak Boleh Kosong!");
                    return;
                }

                var objSave = {
                    noregistrasi: $scope.item.noregistrasi,
                    // tglinput: moment($scope.itemPA.tglInput).format('YYYY-MM-DD HH:mm'),
                    // dokterid: $scope.itemPA.dokter.id,
                    // nomor: $scope.itemdok.NoPa,
                    // keterangan: $scope.itemPA.keterangan.replace(/\n/ig,'~'),
                    pelayananpasienfk: $scope.dataSelected.norec_pp,
                    // jenis: $scope.findBy == 1 ? 'sitologi' : 'pa',
                    // isDokterLuar: $scope.itemPA.dokterLuar,
                    // dokterpengirim1: $scope.itemPA.dokterPengirim1 != undefined ?$scope.itemPA.dokterPengirim1.id :null,
                    // dokterpengirim2: $scope.itemPA.dokterPengirim2 != undefined ? $scope.itemPA.dokterPengirim2 : null,
                    // diagnosaklinik: $scope.itemPA.diagnosaKlinik != undefined ? $scope.itemPA.diagnosaKlinik : null,
                    // keteranganklinik: $scope.itemPA.ketKlinik != undefined ? $scope.itemPA.ketKlinik : null,
                    // diagnosapb: $scope.itemPA.diagnosaPB != undefined ? $scope.itemPA.diagnosaPB : null,
                    // keteranganpb: $scope.itemPA.ketPB != undefined ? $scope.itemPA.ketPB : null,
                    // topografi: $scope.itemPA.topografi != undefined ? $scope.itemPA.topografi : null,
                    // morfologi: $scope.itemPA.morfologi != undefined ? $scope.itemPA.morfologi : null,
                    // makroskopik: $scope.itemPA.makroskopik != undefined ? $scope.itemPA.makroskopik.replace(/\n/ig, '~') : null,
                    // mikroskopik: $scope.itemPA.mikroskopik != undefined ? $scope.itemPA.mikroskopik.replace(/\n/ig, '~') : null,
                    // kesimpulan: $scope.itemPA.kesimpulan != undefined ? $scope.itemPA.kesimpulan.replace(/\n/ig, '~') : null,
                    // anjuran: $scope.itemPA.anjuran != undefined ? $scope.itemPA.anjuran.replace(/\n/ig, '~') : null,
                    // jaringanasal: $scope.itemPA.jaringanAsal != undefined ? $scope.itemPA.jaringanAsal : null,
                    norec_pd: norec_pd,
                    norec: $scope.norecPA,
                    expertise: $scope.itemPA.hasilPA
                }
                $scope.hideExper = true
                medifirstService.post('laboratorium/save-hasil-lab-pa', objSave).then(function (e) {
                    init();
                    $scope.hideExper = false
                    $scope.popUpPA.close()

                }, function (error) {
                    $scope.hideExper = false
                })
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
                    "print"],
                resizable: {
                    content: true,
                    toolbar: true
                }

            };
            function loadEditor() {

            }
            $scope.cetakLabPA = function () {
                if ($scope.norecPA != '') {

                    // var local =JSON.parse(localStorage.getItem('profile')) 
                    var user = medifirstService.getPegawaiLogin().namaLengkap

                    var profile = 0;//local.id;
                    // if($scope.findBy == 0){
                    window.open(config.baseApiBackend + "report/cetak-hasil-lab-histopatologi?norec=" + $scope.norecPA + '&kdprofile=' + profile
                        + '&user=' + user + '&jenis=his', '_blank');
                    // }else{
                    //      window.open(config.baseApiBackend + "report/cetak-hasil-lab-histopatologi?norec=" +$scope.dataSelected.norec_pp+'&kdprofile='+profile 
                    //         +'&user='+user+'&jenis=sitologi',  '_blank');
                    // }
                }



            }

            
            //***********************************

        }
    ]);
});

