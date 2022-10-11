define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('OrderRadiologiCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$state', 'CacheHelper', '$window',
        function ($q, $rootScope, $scope, medifirstService, $state, cacheHelper, $window) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.tglPelayanan = $scope.now;
            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            $scope.item.qty = 1
            $scope.riwayatForm = false
            $scope.inputOrder = true
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.showTombol = false
            var produkDef = []
            $scope.pilihLayanan = 0
            var data2 = [];
            $scope.PegawaiLogin2 = {};
            var namaRuangan = ''
            var namaRuanganFk = ''
            var jenisPelayananId = ''
            var detail = ''
            $scope.header.DataNoregis = true
            LoadCacheHelper();
            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('TransaksiPelayananRadiologiDokterRevCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.noMr = chacePeriode[0]
                    nocm_str = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    namaRuanganFk = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.header.DataNoregis = chacePeriode[13]
                    // if ($scope.header.DataNoregis == undefined) {
                    //     $scope.header.DataNoregis = false;
                    // }
                    if ($scope.item.namaRuangan.substr($scope.item.namaRuangan.length - 1) == '`') {
                        $scope.showTombol = true
                    }
                    // medifirstService.get("tatarekening/get-sudah-verif?noregistrasi=" +
                    //     $scope.item.noregistrasi, true).then(function (dat) {
                    //         $scope.item.statusVerif = dat.data.status
                    //     });
                    //  ** cek status closing
                    medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                        if (rese.data.status == true) {
                            toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                            $scope.isSelesaiPeriksa = true
                        }
                    })
                    medifirstService.get('sysadmin/general/get-jenis-pelayanan/' + norec_pd).then(function (e) {
                        jenisPelayananId = e.data.jenispelayanan
                        init()
                    })
                    //** */
                }

            }
            //    modelItemAkuntansi.getDataDummyPHP('pelayanan/get-produk-penunjang-part',true,10,10).then(function(e){
            //     $scope.listLayanan = e
            //    })
            $scope.listProdukCek = []
            $scope.getProduk = function (ruangan) {
                $scope.listProdukCek = []
                produkDef = []
                $scope.item.layanan = []
                medifirstService.get("sysadmin/general/get-tindakan-with-details?idRuangan="
                    + ruangan.id
                    + "&idKelas="
                    + $scope.item.idKelas

                    + "&idJenisPelayanan="
                    + jenisPelayananId
                    + "&isLabRad=true")
                    .then(function (x) {
                        $scope.listProdukCek = x.data.details
                        produkDef = x.data.details

                    })
            }
            // $scope.$watch('item.ruangantujuan', function (newValue, oldValue) {
            //     var RuangRanap = "&Ruangan=" + $scope.item.namaRuangan;
            //     if (newValue != undefined && jenisPelayananId != '' && $scope.item.namaRuangan!= undefined) {

            //         medifirstService.getPart("sysadmin/general/get-tindakan?idRuangan="
            //             + newValue.id
            //             + "&idKelas="
            //             + 6
            //             + RuangRanap
            //             + "&idJenisPelayanan="
            //             + jenisPelayananId, true, 10, 10)
            //             .then(function (x) {
            //                 $scope.listLayanan = x;
            //                 //    $scope.isRouteLoading = false;

            //             })

            //         //  modelItemAkuntansi.getDataDummyPHPV2('pelayanan/get-produk-penunjang-part?idRuangan='+newValue.id,true,10,10).then(function(e){
            //         //      $scope.listLayanan = e
            //         //  })
            //     }

            // })
            //  LoadCache();
            //  function LoadCache(){
            //      var chacePeriode = cacheHelper.get('TransaksiPelayananRadiologiCtrl');
            //      if(chacePeriode != undefined){
            //          norec_apd = chacePeriode[0]
            //          nocm_str = chacePeriode[1]
            //          // $scope.item.ruanganAsal = namaRuangan;
            //          // medifirstService.get("logistik/get_detailPD?norec_apd="+norec_apd, true).then(function(data_ih){
            //          //     $scope.item.jenisPenjamin = data_ih.data.detailPD[0].namarekanan
            //          //     $scope.item.kelompokPasien = data_ih.data.detailPD[0].kelompokpasien
            //          //     $scope.item.beratBadan = data_ih.data.detailPD[0].beratbadan
            //          // });
            //          init()
            //     }else{

            //     }

            // }
            $scope.setRuangan = function () {
                $scope.listRuanganTujuan = $scope.item.instalasi.ruangan
            }
            function init() {
                $scope.isRouteLoading = true;
                medifirstService.get("sysadmin/general/get-tgl-posting", true).then(function (dat) {
                    var tgltgltgltgl = dat.data.mindate[0].max
                    var tglkpnaja = dat.data.datedate
                    $scope.minDate = new Date(tgltgltgltgl);
                    $scope.maxDate = new Date($scope.now);
                    $scope.startDateOptions = {
                        disableDates: function (date) {
                            var disabled = tglkpnaja;
                            if (date && disabled.indexOf(date.getDate()) > -1) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    };
                })

                medifirstService.get("emr/get-combo-penunjang?departemenfk=27", true).then(function (dat) {
                    // for (var i = 0; i < dat.data.length; i++) {
                    //     dat.data[i].no = i+1
                    //     // dat.data[i].total =parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan)-parseFloat(dat.data[i].hargadiscount))
                    // }
                    // $scope.dataGrid = dat.data.data;
                    $scope.item.ruanganAsal = $scope.item.namaRuangan

                    $scope.listRuanganTujuan = dat.data.ruangantujuan//  dat.data.ruangantujuan;
                    $scope.item.ruangantujuan = {
                        id: dat.data.ruangantujuan[0].id,
                        namaruangan: dat.data.ruangantujuan[0].namaruangan,
                        ipaddress: dat.data.ruangantujuan[0].ipaddress != undefined ? dat.data.ruangantujuan[0].ipaddress : null
                    };
                    $scope.getProduk($scope.item.ruangantujuan)
                    // $scope.listLayanan = dat.data.produk;
                    // namaRuanganFk = dat.data.data[0].objectruanganfk
                    // norec_pd = dat.data.data[0].noregistrasifk
                });
                $scope.PegawaiLogin2 = medifirstService.getPegawaiLogin()

                if ($scope.header.DataNoregis == true) {
                    loadRiwayat('noregistrasi=' + $scope.item.noregistrasi)


                } else {
                    loadRiwayat('NoCM=' + $scope.item.noMr)
                }

            }
            function loadRiwayat(params) {
                medifirstService.get('emr/get-riwayat-order-radiologi?' + params).then(function (e) {
                    for (var i = e.data.daftar.length - 1; i >= 0; i--) {
                        e.data.daftar[i].no = i + 1
                    }

                    for (var i = 0; i < e.data.daftar.length; i++) {
                        let details = e.data.daftar[i].details;
                        let risorder = e.data.daftar[i].risorder;
                        for (let yy = 0; yy < details.length; yy++) {
                            for (let zz = 0; zz < risorder.length; zz++) {
                                if (details[yy].norecopfk === risorder[zz].norec_op_fk) {
                                    e.data.daftar[i].details[yy].radiologiId = risorder[zz].patient_id + '-' + risorder[zz].order_cnt
                                }
                            }
                        }
                    }

                    $scope.dataGridRiwayat = new kendo.data.DataSource({
                        data: e.data.daftar,
                        pageSize: 10
                    });

                });
            }
            $rootScope.getRekamMedisCheck = function (bool) {
                if (bool) {
                    loadRiwayat('noregistrasi=' + $scope.item.noregistrasi)
                }
                else {
                    loadRiwayat('NoCM=' + $scope.item.noMr)
                }
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                },
                {
                    "field": "ruangan",
                    "title": "Nama Ruangan",
                    "width": "140px"
                },
                {
                    "field": "produkfk",
                    "title": "Kode",
                    "width": "40px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "40px",
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
                    "field": "total",
                    "title": "Total",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "nostruk",
                    "title": "No Struk",
                    "width": "80px"
                }
            ];

            $scope.columnGridOrder = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "10px",
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
            $scope.columnGridRiwayat = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "70px",
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
                    "field": "keteranganlainnya",
                    "title": "Keterangan",
                    "width": "100px",
                },
                {
                    "field": "statusorder",
                    "title": "Status",
                    "width": "70px",
                },
                {
                    "field": "cito",
                    "title": "Cito",
                    "template": '# if( cito==true) {# ✔ # } else {# ✘ #} #',
                    "width": "70px",
                }
            ];
            $scope.detailGridOptions = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1
                    if (dataItem.details[i].norec_hr != undefined && dataItem.details[i].norec_hr != '') {
                        dataItem.details[i].expertise = "✔";
                        // ✅
                        // ✔ expertise
                    } else {
                        dataItem.details[i].expertise = "✘";
                        // ✘
                        // ❎
                    }

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [
                        // {
                        //       field: "no",
                        //       title: "No",
                        //       width: "30px"
                        //   },
                        {
                            field: "namaproduk",
                            title: "Deskripsi",
                            width: "200px"
                        },
                        {
                            field: "expertise",
                            title: "Expertise",
                            width: "100px"
                        },
                        {
                            field: "qtyproduk",
                            title: "Qty",
                            width: "100px"
                        },
                        {
                            "command": [{
                                text: "Expertise",
                                click: experTise,
                                imageClass: "k-icon k-i-pencil"
                            },
                            {
                                text: "Lihat Hasil",
                                click: hasilRadDetil,
                                imageClass: "k-icon k-i-download"
                            }
                                /*,
                                {
                                    text: "Cetak",
                                    click: cetakHasil,
                                    imageClass: "k-icon k-i-search"
                                }*/
                            ],
                            title: "",
                            width: "150px",
                        }]
                };
            };
            function cetakHasil(e) {
                e.preventDefault();
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                medifirstService.get('radiologi/get-pelayananpasien-radiologi?norec=' + dataItem.norec + '&produkfk=' + dataItem.id).then(function (re) {
                    medifirstService.get('radiologi/get-hasil-radiologi?norec_pp=' + re.data.norec).then(function (es) {
                        if (es.data.length > 0) {
                            var acc = es.data[0].acc_number
                            var client = new HttpClient();
                            client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-hasil-rad&id='
                                + acc + '&view=true', function (response) {
                                    // do something with response
                                });
                        }
                    })
                })
            }

            var hasilRadDetil = function (e) {
                e.preventDefault();
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                if (dataItem.radiologiId === undefined || dataItem.radiologiId === null || dataItem.radiologiId === '') {
                    toastr.warning('Hasil belum ada', 'Peringatan')
                } else {
                    // syamsu
                    var datauserlogin = JSON.parse(localStorage.getItem('datauserlogin'));

                    var patienIdMr = dataItem.radiologiId.replace('null', '1')
                    var client = new HttpClient();

                    let viewer = null

                    var errorFunc = function () {
                        toastr.error('Ada kesalahan pada jaringan ke server', 'Kesalahan')
                    }

                    let awal = true

                    var noMrFunc = function (response) {
                        if (response === undefined || response === null || response == '') {
                            if (awal) {
                                awal = false
                                client.get(config.urlPACSEngine + '/dcm4chee-arc/aets/TRANSMEDIC/rs/' +
                                    'studies?limit=1&includefield=all&offset=0&PatientID=' + patienIdMr.split('-')[0],
                                    noMrFunc, errorFunc)
                            } else {
                                toastr.warning('Hasil foto belum dikirim ke PACS', 'Peringatan')
                            }
                        } else {
                            let data = JSON.parse(response)
                            viewer = data[0]["0020000D"].Value[0]
                            window.open(config.urlPACSViewer + "/viewer/" + datauserlogin.id + "/" + dataItem.norec_pp + "/" + dataItem.noorder + "/" + viewer, "pacs");
                        }
                    }

                    client.get(config.urlPACSEngine + '/dcm4chee-arc/aets/TRANSMEDIC/rs/' +
                        'studies?limit=1&includefield=all&offset=0&PatientID=' + patienIdMr,
                        noMrFunc, errorFunc)
                    // syamsu
                }
            };

            function hasil(e) {
                e.preventDefault();

                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                medifirstService.get('radiologi/get-pelayananpasien-radiologi?norec=' + dataItem.norec + '&produkfk=' + dataItem.id).then(function (re) {
                    // $scope.dataSelectedDetail.norec_pp  =re.data.norec
                    medifirstService.get('radiologi/get-hasil-radiologi?norec_pp=' + re.data.norec).then(function (es) {
                        if (es.data.length > 0) {
                            var acc = es.data[0].acc_number
                            $window.open("http://10.10.100.6/ZFP?mode=proxy&lights=on&titlebar=on#View&ris_exam_id=" + acc + "&un=p0l1&pw=dr5sqaoU5WiMkzGx%2fuplGybTyEKpoZMsJMqT9Ib1qLtg18b1bRrEEru7I%2flvB1Zg", "_blank");

                        } else {
                            toastr.error('Hasil Belum Ada')
                            return
                        }

                    })
                })

                // let acc  = dataItem.noorder+dataItem.no

                // acc = acc.replace('R','')
                // $window.open("http://10.10.100.6/ZFP?mode=proxy&lights=on&titlebar=on#View&ris_exam_id="+acc+"&un=p0l1&pw=dr5sqaoU5WiMkzGx%2fuplGybTyEKpoZMsJMqT9Ib1qLtg18b1bRrEEru7I%2flvB1Zg", "_blank");


            }
            function experTise(e) {
                e.preventDefault();

                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                $scope.norecHasilRadiologi = ''
                $scope.dataSelectedDetail = {}
                $scope.dataSelectedDetail = dataItem
                medifirstService.get('radiologi/get-pelayananpasien-radiologi?norec=' + dataItem.norec_pp + '&produkfk=' + dataItem.id).then(function (re) {
                    // $scope.dataSelectedDetail.norec_pp  =re.data.norec
                    if (re.data.data == undefined || re.data.data == '' || re.data.data == null) {
                        toastr.error("Belum ada Expertise!");
                        return;
                    }
                    $scope.norecHasilRadiologi = re.data.data.norec;
                    $scope.item.nofoto = re.data.data.nofoto;
                    $scope.item.namalengkap = re.data.data.namalengkap;
                    $scope.item.tglInput = re.data.data.tanggal;
                    $scope.item.keterangan = re.data.data.keterangan;
                    $scope.popUpEkpertise.center().open();




                    // medifirstService.get('radiologi/get-hasil-radiologi?norec_pp='+re.data.norec).then(function (e) {
                    //     if(e.data.length>0)
                    //     {

                    //         $scope.norecHasilRadiologi=e.data[0].norec
                    //         $scope.item.nofoto=e.data[0].nofoto
                    //         $scope.item.tglInput=new Date(e.data[0].tanggal )
                    //         $scope.item.dokter={id: e.data[0].pegawaifk,namalengkap:e.data[0].namalengkap}
                    //         $scope.item.keterangan=e.data[0].keterangan.replace(/~/g,"\n")
                    //     }else{
                    //         $scope.item.tglInput = new Date()
                    //     }
                    //     $scope.popUpEkpertise.center().open(); 
                    //  })
                })

                medifirstService.get('radiologi/get-ekspertise?norec_pp=' + $scope.dataSelected.norec_pp).then(function (e) {
                    if (e.data.status) {
                        if (e.data.data.list.length > 0) {
                            $scope.cekhasilrad = false;
                            $scope.listNamaGambar = e.data.data.list;
                            $scope.itemimg.gambar = { norec: e.data.data.list[0].norec, filename: e.data.data.list[0].filename }
                            $scope.itemimg.keterangan = e.data.data.list[0].keterangan
                            var temp = e.data.data.list[0].filename.slice(0, e.data.data.list[0].filename.indexOf('.'))
                            $scope.itemimg.img = config.urlPACSJpeg + "/service/medifirst2000/radiologi/images/pacs/" + temp + "/jpg"
                        }
                    } else {
                        $scope.cekhasilrad = true;
                        $scope.itemimg.img = "./images/noimage.png"
                        window.messageContainer.error("Belum Ada Ekspertise.");
                    }
                }).error(function (err) {
                    $scope.item.img = "./images/noimage.png"
                });
            }

            medifirstService.get("radiologi/get-data-combo-labrad").then(function (dat) {
                $scope.listDokter = dat.data.dokter;
            })

            // $scope.LihatEkpertise = function () {
            //     if($scope.dataSelectedRiwayat == undefined)
            //     {
            //         window.messageContainer.error("Pilih Data Dulu!");
            //         return;
            //     }
            //     $scope.norecHasilRadiologi=''
            //     medifirstService.get('radiologi/get-hasil-radiologi?norec_pp='+$scope.dataSelectedRiwayat.norec_pp).then(function (e) {
            //         if(e.data.length>0)
            //         {
            //             $scope.norecHasilRadiologi=e.data[0].norec
            //             $scope.item.nofoto=e.data[0].nofoto
            //             $scope.item.tglInput=new Date(e.data[0].tanggal )
            //             $scope.item.dokter={id: e.data[0].pegawaifk,namalengkap:e.data[0].namalengkap}
            //             $scope.item.keterangan=e.data[0].keterangan.replace(/~/g,"\n")
            //         }
            //         $scope.popUpEkpertise.center().open(); 
            //      })


            // }


            $scope.selectImage = function () {
                console.log($scope.itemimg.gambar.keterangan)
                $scope.itemimg.keterangan = $scope.itemimg.gambar.keterangan
                var temp = $scope.itemimg.gambar.filename.slice(0, $scope.itemimg.gambar.filename.indexOf('.'))
                $scope.itemimg.img = config.urlPACSJpeg + "/service/medifirst2000/radiologi/images/pacs/" + temp + "/jpg"
            }

            $scope.CheckImage = function () {
                // console.log($scope.itemimg.img)
                // console.log($scope.itemimg)
                // console.log($scope.itemimg.keterangan)
                var ket = $scope.itemimg.keterangan == null ? '' : $scope.itemimg.keterangan
                var html = "<style>"
                    + "body{background-color: black; margin: 0px}"
                    + ".frame-left{width: 100%; height: 86vh;  text-align: center; border: 1px solid #ffffff}"
                    + ".frame-right{width: 350px; margin-left: 5px; padding-left: 5px; padding-right: 5px; height: 86vh; background: black; border: 1px solid #ffffff}"
                    + "p{color: white; padding: 5px; margin: auto; font-family: 'Comfortaa', cursive;}"
                    + "h3{color: white; padding: 5px 0px 0px 0px; margin: auto; font-family: 'Comfortaa', cursive;}"
                    + ".container{margin: auto; padding-top: 5px; width: 100%; display: flex;}"
                    + "img{max-width: 90%; max-height: 90%; margin-top: 15px; padding: 20px}"
                    + "#header{background-color: #2a2d33;padding: 10px;}"
                    + ".title-top{font-family: 'Comfortaa', cursive;}"
                    + "</style>"
                    + "<head>"
                    + "<link href='https://fonts.googleapis.com/css2?family=Comfortaa&display=swap' rel='stylesheet'>"
                    + "<title>E-Healthcare | RSUD CIBINONG  :: Transmedic - PACS Viewer</title>"
                    + "</head>"
                    + "<div id='header'>"
                    + "<div style='margin-top: 9px'><span style='color:#ffffff; margin-left: 35px; font-size: 20pt !important; font-weight: bold; margin-top: 9px'>"
                    + "<span class='title-top'>Transmedic </span>"
                    + "<span class='title-top' style='font-weight: bold; color:#10c4b2;'>PACS Viewer</span>"
                    + "</span>"
                    + "<br>"
                    + "<span class='title-top' style='color:#ffffff; font-size: 10pt; font-style: italic; margin-left: 40px; margin-top: 2px;'>"
                    + "E-Healthcare | RSUD CIBINONG"
                    + "</span></div>"
                    + "</div>"
                    + "<div class='container'>"
                    + "<div class='frame-left'><img src='" + $scope.itemimg.img
                    + "'></></div>"
                    + "<div class='frame-right'><h3>Informasi dari Gambar: </h3><p style='font-size: 13px;'> "
                    + ket.replace(/\/n/g, '<br>')
                    + "</p></div>"
                    + "</div>"

                var tab = window.open('http://localhost', '_BLANK');
                tab.document.write(html);
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
                let acc = $scope.dataSelectedDetail.noorder + $scope.dataSelectedDetail.no
                acc = acc.replace('R', '')
                var objSave = {
                    noregistrasi: $scope.item.noregistrasi,
                    nofoto: $scope.item.nofoto,
                    tglinput: moment($scope.item.tglInput).format('YYYY-MM-DD HH:mm'),
                    dokterid: $scope.item.dokter.id,
                    keterangan: $scope.item.keterangan.replace(/\n/ig, '~'),
                    pelayananpasienfk: $scope.dataSelectedDetail.norec_pp,
                    norec_pd: norec_pd,
                    norec: $scope.norecHasilRadiologi,
                    acc_number: acc

                }
                medifirstService.post('radiologi/save-hasil-radiologi', objSave).then(function (e) {
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/bridging?cetak-pacs-report=1&jenis=report&norec=' + $scope.dataSelectedDetail.norec_pp
                        + '&noorder=' + $scope.dataSelectedDetail.noorder + $scope.dataSelectedDetail.no + '&view=true', function (response) {
                            // do something with response
                        });

                    $scope.BatalEkpertise()
                })

            }
            $scope.back = function () {
                window.history.back();
            }
            $scope.order = function () {
                $scope.CmdOrderPelayanan = false;
                $scope.OrderPelayanan = true;
            }
            $scope.Batal = function () {

            }
            $scope.add = function () {
                //    if ($scope.item.statusVerif == true) {
                //       toastr.error("Data Sudah Diclosing, Hubungi Tatarekening!");
                //       return;
                //   }
                if ($scope.isSelesaiPeriksa == true) {
                    toastr.error("Data Sudah Diclosing!");
                    return;
                }
                if ($scope.item.qty == 0) {
                    alert("Qty harus di isi!")
                    return;
                }
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return;
                }
                if ($scope.item.layanan == undefined) {
                    alert("Pilih Layanan terlebih dahulu!!")
                    return;
                }
                var nomor = 0
                if ($scope.dataGridOrder == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no

                            data.produkfk = $scope.item.layanan.id
                            data.namaproduk = $scope.item.layanan.namaproduk
                            data.qtyproduk = parseFloat($scope.item.qty)
                            data.objectruanganfk = namaRuanganFk
                            data.objectruangantujuanfk = $scope.item.ruangantujuan.id
                            data.objectkelasfk = $scope.item.idKelas,
                                data.iscito = $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false,
                                data.nourut = data.no // syamsu

                            data2[i] = data;
                            $scope.dataGridOrder = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        produkfk: $scope.item.layanan.id,
                        namaproduk: $scope.item.layanan.namaproduk,
                        qtyproduk: parseFloat($scope.item.qty),
                        objectruanganfk: namaRuanganFk,
                        objectruangantujuanfk: $scope.item.ruangantujuan.id,
                        objectkelasfk: $scope.item.idKelas,
                        iscito: $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false,
                        nourut: nomor // syamsu
                    }
                    data2.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.dataGridOrder = new kendo.data.DataSource({
                        data: data2
                    });
                }
                $scope.batal();
            }
            $scope.klikGrid = function (dataSelected) {
                var dataProduk = [];
                //no:no,
                $scope.item.no = dataSelected.no
                for (var i = $scope.listLayanan.length - 1; i >= 0; i--) {
                    if ($scope.listLayanan[i].id == dataSelected.produkfk) {
                        dataProduk = $scope.listLayanan[i]
                        break;
                    }
                }
                $scope.item.layanan = dataProduk;//{id:dataSelected.produkfk,namaproduk:dataSelected.namaproduk}
                // $scope.item.stok = dataSelected.jmlstok //* $scope.item.nilaiKonversi 

                $scope.item.qty = dataSelected.qtyproduk
            }
            $scope.hapus = function () {
                if ($scope.item.qty == 0) {
                    alert("Qty harus di isi!")
                    return;
                }
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return;
                }
                if ($scope.item.layanan == undefined) {
                    alert("Pilih Layanan terlebih dahulu!!")
                    return;
                }
                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data2.splice(i, 1);
                            for (var i = data2.length - 1; i >= 0; i--) {
                                data2[i].no = i + 1
                            }
                            // data2[i] = data;
                            $scope.dataGridOrder = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }
                }
                $scope.batal();
            }
            $scope.$watch('item.filterLayanan', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (newVal == "") {
                        $scope.listProdukCek = produkDef
                        return
                    }
                    if (newVal == undefined) return

                    $scope.listTempProduk = []
                    var name = newVal.toLowerCase()
                    for (var i = produkDef.length - 1; i >= 0; i--) {
                        const elem = produkDef[i]
                        $scope.listTempProduk.push({
                            id: elem.id,
                            detailjenisproduk: elem.detailjenisproduk,
                            details: []
                        })
                        for (var x = elem.details.length - 1; x >= 0; x--) {
                            const element = elem.details[x];
                            var arr = element.namaproduk.toLowerCase()
                            if ((arr.indexOf(name) > -1)) {
                                for (let y = 0; y < $scope.listTempProduk.length; y++) {
                                    const element2 = $scope.listTempProduk[y];
                                    if (element2.id == elem.id)
                                        element2.details.push(element)
                                }
                            }
                            // if ($scope.item.layanan != undefined) {
                            //     var arrobj = Object.keys($scope.item.layanan)
                            //     for (let x = 0; x < arrobj.length; x++) {
                            //         const element3 = arrobj[x];
                            //         for (let y = 0; y < $scope.listTempProduk.length; y++) {
                            //             const element2 = $scope.listTempProduk[y];
                            //             for (let z = 0; z < element2.details.length; z++) {
                            //                 const element4 = element2.details[z];
                            //                 if ($scope.item.layanan[element3] == true && element.id != element3 && element4.id !=element3 ) {
                            //                     element2.details.push(element)
                            //                 }
                            //             }
                                        
                            //         }
                            //     }
                            // }
                        }

                    }
                    $scope.listProdukCek = []
                    $scope.listProdukCek = $scope.listTempProduk
                    if ($scope.item.layanan != undefined && $scope.item.layanan != '') {
                        for (let i = 0; i < $scope.listProdukCek.length; i++) {
                            const element1 = $scope.listProdukCek[i];
                            var arrobj = Object.keys($scope.item.layanan)
                            for (let x = 0; x < element1.details.length; x++) {
                                const element2 = element1.details[x];
                                for (let x = 0; x < arrobj.length; x++) {
                                    const element3 = arrobj[x];
                                    if (element2.id == element3) {
                                        $scope.item.layanan[element3] = true
                                        // element.isChecked = true
                                    }
                                }
                            }
                        }
                    }
                }
            })
            $scope.resetFilter = function () {
                delete $scope.item.filterLayanan
                $scope.listProdukCek = []
                $scope.listProdukCek = produkDef
                if ($scope.item.layanan != undefined) {
                    for (let i = 0; i < $scope.listProdukCek.length; i++) {
                        const element1 = $scope.listProdukCek[i];
                        var arrobj = Object.keys($scope.item.layanan)
                        for (let x = 0; x < element1.details.length; x++) {
                            const element2 = element1.details[x];
                            for (let x = 0; x < arrobj.length; x++) {
                                const element3 = arrobj[x];
                                if (element2.id == element3) {
                                    $scope.item.layanan[element3] = true
                                    // element.isChecked = true
                                }
                            }
                        }
                    }
                }
            }
            $scope.batal = function () {
                $scope.item.layanan = ''
                $scope.item.qty = 1
                $scope.item.no = undefined
            }
            $scope.BatalOrder = function () {
                data2 = []
                $scope.dataGridOrder = new kendo.data.DataSource({
                    data: data2
                });
                $scope.item.layanan = []
                delete $scope.item.keterangan
                $scope.CmdOrderPelayanan = true;
                $scope.OrderPelayanan = false;
            }
            $scope.riwayat = function () {
                $scope.riwayatForm = true
                $scope.inputOrder = false;
            }
            $scope.newOrder = function () {
                $scope.riwayatForm = false
                $scope.inputOrder = true;
            }
            $scope.Simpan = function () {
                if ($scope.item.ruangantujuan == undefined) {
                    alert("Pilih Ruangan Tujuan terlebih dahulu!!")
                    return
                }
                if ($scope.item.tglPelayanan == undefined) {
                    alert("Pilih Tgl Order  terlebih dahulu!!")
                    return
                }
                // if (data2.length == 0) {
                //     alert("Pilih layanan terlebih dahulu!!")
                //     return
                // }
                if ($scope.item.layanan == undefined || $scope.item.layanan.length == 0) {
                    alert("Pilih layanan terlebih dahulu!!")
                    return
                }
                var arrobj = Object.keys($scope.item.layanan)
                var data2 = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.layanan[parseInt(arrobj[i])] == true) {
                        var data = {
                            no: i + 1,
                            produkfk: arrobj[i],
                            namaproduk: arrobj[i],
                            qtyproduk: 1,
                            objectruanganfk: namaRuanganFk,
                            objectruangantujuanfk: $scope.item.ruangantujuan.id,
                            pemeriksaanluar: $scope.item.pemeriksaanKeluar === true ? 1 : 0,
                            iscito: $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false,
                            objectkelasfk: $scope.item.idKelas,
                            nourut: null,
                        }
                        data2.push(data)
                    }
                }
                var objSave = {
                    tanggal: moment($scope.item.tglPelayanan).format('YYYY-MM-DD HH:mm:ss'),
                    norec_so: '',
                    norec_apd: norec_apd,
                    norec_pd: norec_pd,
                    qtyproduk: data2.length,//
                    objectruanganfk: namaRuanganFk,
                    objectruangantujuanfk: $scope.item.ruangantujuan.id,
                    departemenfk: 27,
                    pegawaiorderfk: $scope.PegawaiLogin2.id,
                    keterangan: $scope.item.keterangan != undefined ? $scope.item.keterangan : null,
                    iscito: $scope.item.iscito != undefined && $scope.item.iscito == true ? $scope.item.iscito : false,
                    details: data2
                }
                $scope.isSimpan = true
                medifirstService.post('emr/save-order-pelayanan', objSave).then(function (e) {
                    $scope.item.layanan = []
                    $scope.isSimpan = false
                    medifirstService.postLogging('Order Radiologi', 'Norec strukorder_t', e.data.strukorder.norec,
                        'Order Radiologi No Order - ' + e.data.strukorder.noorder + ' dengan No Registrasi ' + $scope.item.noregistrasi).then(function (res) {
                        })

                    /*
                call notif ds
                */
                    var noorder = e.data.strukorder.noorder
                    var tglorder = e.data.strukorder.tglorder
                    tglorder = tglorder.replace(' ', '%20');
                    var namaPasien = $scope.item.namaPasien
                    namaPasien = namaPasien.replace(' ', '%20');

                    if ($scope.item.ruangantujuan != undefined) {
                        if ($scope.item.ruangantujuan.ipaddress) {
                            var ip = $scope.item.ruangantujuan.ipaddress.split(',')
                            if (ip.length > 0) {
                                for (var i = 0; i < ip.length; i++) {
                                    const ips = ip[i]
                                    if (ips == null) return

                                    var client = new HttpClient();
                                    client.get('http://' + ips + ':3385/epicnotif/bewara?add-notif=1&noorder=' +
                                        noorder + '&tglorder=' + tglorder + '&noregistrasi=' + $scope.item.noregistrasi
                                        + '&nocm=' + $scope.item.noMr + '&namapasien=' + namaPasien
                                        + '&namaruangan=' + $scope.item.ruangantujuan.namaruangan
                                        , function (s) { });

                                }
                            }
                        }
                    }
                    init();
                    $scope.BatalOrder();

                    // $scope.item.resep = e.data.noresep.norec
                    // var stt = 'false'
                    // if (confirm('View resep? ')) {
                    //     // Save it!
                    //     stt='true';
                    // } else {
                    //     // Do nothing!
                    //     stt='false'
                    // }
                    // var client = new HttpClient();
                    // client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores='+e.data.noresep.norec+'&view='+stt+'&user='+pegawaiUser.namalengkap, function(response) {
                    //     //aadc=response;
                    // });
                    // if (noOrder == 'EditResep') {
                    //     var objDelete = {norec:norecResep}
                    //     manageLogistikPhp.posthapuspelayananapotik(objDelete).then(function(e) {

                    //     })
                    // }
                    // window.history.back();
                })
            }
            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            // $scope.back=function(){
            //     //$state.go("DaftarPasienApotik")
            //     window.history.back();
            // }
            // $scope.TambahObat =function(){
            //      ////debugger;
            //     var arrStr ={ 0 : $scope.item.noMr ,
            //         1 : $scope.item.namaPasien,
            //         2 : $scope.item.jenisKelamin,
            //         3 : $scope.item.noregistrasi, 
            //         4 : $scope.item.umur,
            //         5 : $scope.item.kelas.id,
            //         6 : $scope.item.kelas.namakelas,
            //         7 : $scope.item.tglRegistrasi,
            //         8 : norec_apd,
            //         9 : '',
            //         10 : $scope.item.jenisPenjamin,
            //         11 : $scope.item.kelompokPasien,
            //         12 : $scope.item.beratBadan,
            //         13 : $scope.item.AlergiYa
            //     }
            //     cacheHelper.set('InputResepApotikCtrl', arrStr);
            //     $state.go('InputResepApotik')
            // }
            // $scope.EditResep =function(){
            //      ////debugger;
            //     var arrStr ={ 0 : $scope.item.noMr ,
            //         1 : $scope.item.namaPasien,
            //         2 : $scope.item.jenisKelamin,
            //         3 : $scope.item.noregistrasi, 
            //         4 : $scope.item.umur,
            //         5 : $scope.item.kelas.id,
            //         6 : $scope.item.kelas.namakelas,
            //         7 : $scope.item.tglRegistrasi,
            //         8 : norec_apd,
            //         9 : 'EditResep',
            //         10 : $scope.item.jenisPenjamin,
            //         11 : $scope.item.kelompokPasien,
            //         12 : $scope.item.beratBadan,
            //         13 : $scope.item.AlergiYa,
            //         14 : $scope.dataSelected.norec_resep
            //     }
            //     cacheHelper.set('InputResepApotikCtrl', arrStr);
            //     $state.go('InputResepApotik')
            // }

            // $scope.orderApotik =function(){
            //     $state.go("InputResepApotikOrder")
            // }
            // $scope.HapusResep = function(){
            //     var objDelete = {norec:$scope.dataSelected.norec_resep}
            //     manageLogistikPhp.posthapuspelayananapotik(objDelete).then(function(e) {
            //         init();
            //     })
            // }
            // $scope.cetakEtiket = function(){
            //     var client = new HttpClient();
            //     client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec='+$scope.dataSelected.norec_resep+'&cetak=1', function(response) {
            //         // aadc=response;
            //     });
            // }
            $scope.cetakResep = function () {
                if ($scope.dataSelected == undefined) {
                    alert('Pilih resep yg akan di cetak')
                    return;
                }
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
            }
            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status < 400)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }
            $scope.back = function () {
                $state.go('DaftarAntrianDokterRajal')
            }

            $scope.click = function (dataSelectedRiwayat) {
                if (dataSelectedRiwayat != undefined) {
                    $scope.noOrder = dataSelectedRiwayat.noorder;
                    medifirstService.get("sysadmin/general/get-acc-number-radiologi?noOrder=" + $scope.noOrder)
                        .then(function (e) {
                            $scope.dataRisOrder = e.data.data[0]

                        })
                }
            }

            $scope.lihatHasil = function () {
                if ($scope.dataRisOrder != undefined) {
                    // 192.168.12.11:8080
                    $window.open("http://182.23.26.34:1111/URLCall.do?LID=dok&LPW=dok&LICD=003&PID=" + $scope.item.noMr + '&ACN=' + $scope.dataRisOrder.accession_num, "_blank");
                } else {
                    toastr.info('Hasil tidak ada')

                }

            }

            $scope.showInputDiagnosaDokter = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananRadiologiDokterRevCtrl');
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                $state.go('InputDiagnosaDokter')
            }
            $scope.resep = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananRadiologiDokterRevCtrl');
                cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                $state.go('InputResepApotikOrderRev')
            }
            $scope.inputTindakanDokter = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananRadiologiDokterRevCtrl')
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                $state.go('InputTindakanPelayananDokterRev', {
                    norecPD: norec_pd,
                    norecAPD: norec_apd,

                });
            }
            $scope.laboratorium = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananRadiologiDokterRevCtrl')
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananLaboratoriumDokterRev')
            }
            $scope.radiologi = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananRadiologiDokterRevCtrl')
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananRadiologiDokterRev')
            }
            $scope.rekamMedisElektronik = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananRadiologiDokterRevCtrl');
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedisElektronik')
            }
            $scope.inputCPPT = function () {
                var arrStr = cacheHelper.get('TransaksiPelayananRadiologiDokterRevCtrl');
                cacheHelper.set('cacheCPPT', arrStr);
                $state.go('CPPT')
            }

            $scope.hapusOrder = function () {
                if ($scope.dataSelectedRiwayat == undefined) {
                    toastr.error('Pilih data yang mau dihapus')
                    return
                }
                if ($scope.dataSelectedRiwayat.statusorder == 'Belum Kirim Ke RIS' && $scope.dataSelectedRiwayat.statusorder == 'Belum Verifikasi') {
                    toastr.error('Tidak bisa dihapus')
                    return
                }
                var data = {
                    norec_order: $scope.dataSelectedRiwayat.norec
                }
                medifirstService.post('emr/delete-order-pelayanan', data)
                    .then(function (e) {
                        init()

                    })
            }
            // $scope.getHargaTindakan = function () {
            //     $scope.item.hargaTindakan = $scope.item.layanan.hargasatuan;

            //   }

            $scope.getHargaTindakan = function () {
                delete $scope.item.hargaTindakan
                // $scope.item.qty = 1
                getKomponenHarga()
            }

            function getKomponenHarga() {

                if ($scope.item.layanan != undefined) {
                    $scope.listKomponen = []
                    medifirstService.get("sysadmin/general/get-komponenharga?idRuangan="
                        + $scope.item.ruangantujuan.id
                        + "&idKelas=" + $scope.item.idKelas
                        + "&idProduk=" + $scope.item.layanan.id
                        + "&idJenisPelayanan=" + jenisPelayananId
                        // +"&idKelas="
                        // +$scope.item.pasien.objectkelasfk
                        // +"&idJenisPelayanan="
                        // + $scope.item.pasien.objectjenispelayananfk
                    ).then(function (dat) {
                        $scope.listKomponen = dat.data.data;
                        $scope.item.hargaTindakan = dat.data.data2[0].hargasatuan //$scope.item.namaProduk.hargasatuan;
                        $scope.item.jumlah = 1;
                    })

                }
            }
            //***********************************
            $scope.cetakEks = function(){
				if ($scope.norecHasilRadiologi != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    var nama = medifirstService.getPegawaiLogin().namaLengkap
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-ekspertise?norec=" + $scope.norecHasilRadiologi + '&kdprofile=' + profile
                            + '&nama=' + nama, '_blank');
                    }
				}
				$scope.popUpEkpertise.close();
			}
        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1