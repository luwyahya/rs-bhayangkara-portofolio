define(['initialize'], function (initialize) {
    'use strict';
    // initialize.controller('DaftarAntrianSusterRanapCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'FindPasien', 'DateHelper', 'socket', 'ManagePasien', '$mdDialog', '$window', 'CetakHelper', 'medifirstService', 'CacheHelper', '$q',
    // function (saveToWindow, $rootScope, $scope, ModelItem, $state, findPasien, DateHelper, socket, managePasien, $mdDialog, window, cetakHelper, medifirstService, cacheHelper, $q) {
    initialize.controller('DaftarAntrianSusterRanapCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, DateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.itema = {};
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item = {};
            $scope.isRouteLoading = false;
            $rootScope.isOpen = true;
            $scope.item.tglterimapasien = '';
            $scope.cboUbahDokter = true;
            $scope.tombolSimpanBatalPindah = true
            $scope.item.isFindMPP = false
            $scope.istempatLaporan = true;
            var tempbedah = '';
            cekSTRPegawai()
            cekSIPPegawai()
            // $scope.isRouteLoading = true;
            // $scope.title = "ini page pencarian pasien";
            // $scope.kodeRuangan = $state.params.kodeRuangan;
            // $scope.isCalling = false;

            $scope.pegawai = ModelItem.getPegawai();
            $scope.cekMPP = function (bool) {
                if (bool) {
                    $scope.item.isFindMPP = true
                    loadData()
                } else {
                    $scope.item.isFindMPP = false
                    loadData()
                }
            }
            loadCombo()
            loadData()
            insertSensusHarian()
            // bridging siranap
            if ($scope.now.getHours() >= 19 && $scope.now.getHours() <= 21) {
                var ppkRumahSakit = ''
                medifirstService.get('sysadmin/settingdatafixed/get/kodePPKRujukan').then(function (dat) {
                    ppkRumahSakit = dat.data
                    medifirstService.get('sysadmin/settingdatafixed/get/statusBridgingAplicare').then(function (es) {
                        var status = es.data
                        if (status == 'true') {
                            updateKetersediaanTT()

                        }
                    })

                })
            }

            function updateBridgingDinkes() {
                medifirstService.postNonMessage("dinkes-jkt/post-bed").then(function (e) { })
            }

            function updateKetersediaanTT() {
                debugger
                medifirstService.get("bridging/bpjs2/aplicaresws/get-tt?namaruangan=&kelas=").then(function (e) {
                    var res = e.data
                    for (var i = 0; i < res.length; i++) {
                        const element = res[i]
                        var tersedia = (element.tersedia.valueOf() < 0 ? 0 : element.tersedia);
                        var tersediapria = (element.tersediapria.valueOf() < 0 ? 0 : element.tersediapria);
                        var tersediawanita = (element.tersediawanita.valueOf() < 0 ? 0 : element.tersediawanita);
                        var tersediapriawanita = (element.tersediapriawanita.valueOf() < 0 ? 0 : element.tersediapriawanita);
                        let data = {
                            "json": {
                                "kodekelas": element.kodekelas,
                                "koderuang": element.koderuang,
                                "namaruang": element.namaruang,
                                "kapasitas": element.kapasitas,
                                "tersedia": tersedia,
                                "tersediapria": tersediapria,
                                "tersediawanita": tersediawanita,
                                "tersediapriawanita": tersediapriawanita,
                            }
                        }
                        medifirstService.postNonMessage('bridging/bpjs2/aplicaresws/rest/bed/update/' + ppkRumahSakit, data).then(function (e) {
                            if (e.data.metadata.code == 1) {
                                // toastr.success(e.data.metadata.message, 'Info')
                            } else {
                                // toastr.error(e.data.metadata.message, 'Info')
                            }
                            // $scope.isRouteLoading = false
                        }, function (error) {
                            // $scope.isRouteLoading = false
                        })
                    }
                })

            }
            $scope.SearchEnter = function () {
                loadData();
            }
            // $scope.saveTT = function (method) {
            //     // if ($scope.item5.tglsave1 == undefined) {
            //     //     toastr.error('Pilih tanggal dulu')
            //     //     return
            //     // }
            //     // var tgl = moment($scope.item4.tglsave1).format('YYYY-MM-DD')
            //     medifirstService.postSIRS('Fasyankes/'+method, {}).then(function (e) {
            //         // toastr.success(e.data.fasyankes[0].message)
            //         // // $scope.BatalKeluar()
            //         // loadTT()
            //     })

            // }
            function insertSensusHarian() {
                medifirstService.postSIRS('Fasyankes/' + 'put', {}).then(function (e) {
                    // toastr.success(e.data.fasyankes[0].message)
                    // // $scope.BatalKeluar()
                    // loadTT()
                })
                medifirstService.get("rawatinap/get-data-sensus", false).then(function (data) {
                    debugger
                    data
                });
                medifirstService.get("bridging/sisrute/push-pasien-masuk", false).then(function (data) {
                    debugger
                    data
                });
                medifirstService.get("bridging/sisrute/push-pasien-komorbid", false).then(function (data) {
                    debugger
                    data
                });
                medifirstService.get("bridging/sisrute/push-pasien-nonkomorbid", false).then(function (data) {
                    debugger
                    data
                });
                medifirstService.get("bridging/sisrute/push-pasien-keluar", false).then(function (data) {
                    debugger
                    data
                });
            }
            $scope.formatNum = {
                format: "#.#",
                decimals: 0
            }
            $scope.cetaklabel = function () {
                $scope.dats = {
                    qty: 0
                }
                $scope.dialogCetakLabel.center().open();
            }
            $scope.pilihQty = function (data) {
                let query = "";
                loopCetakan(data, query)

            };

            function loopCetakan(data, query) {
                debugger
                let queryjadi = ""
                let sintak = " SELECT pd.noregistrasi,pd.tglregistrasi,p.nocm,upper((p.namapasien)::text) AS namapasien,jk.jeniskelamin AS jk,upper((alm.alamatlengkap)::text) AS alamat,to_char(p.tgllahir, 'DD-TMMonth-YYYY HH12:MIPM'::text) AS tgllahir,CASE WHEN (pg.namalengkap IS NULL) THEN '-'::character varying ELSE pg.namalengkap END AS namadokter," +
                    "TO_CHAR(age(now( ), P.tgllahir ), 'YY " + 'Tahun' + " mm " + 'Bulan' + " DD " + 'Hari' + "') AS umur " +
                    "FROM ((((pasiendaftar_t pd JOIN pasien_m p ON ((pd.nocmfk = p.id))) JOIN jeniskelamin_m jk ON ((jk.id = p.objectjeniskelaminfk))) LEFT JOIN pegawai_m pg ON ((pg.id = pd.objectpegawaifk))) LEFT JOIN alamat_m alm ON ((alm.nocmfk = p.id)))"
                for (let i = 1; data.qty >= i; i++) {

                    // for (const item of data) {
                    // query = ``
                    if (queryjadi == "") {
                        // queryjadi = 'SELECT * from "V_labelPasien" where noregistrasi = ' + $scope.dataPasienSelected.noregistrasi;
                        queryjadi = sintak + 'where noregistrasi = ' + "'" + $scope.item.noregistrasi + "'";
                    } else {
                        // queryjadi = $queryjadi + " UNION ALL SELECT * from V_labelPasien where noregistrasi = " + $scope.dataPasienSelected.noregistrasi;
                        queryjadi = queryjadi + " UNION ALL " + sintak + 'where noregistrasi = ' + "'" + $scope.item.noregistrasi + "'";
                    }
                }
                Labelpasienjasper(queryjadi)
            }

            function Labelpasienjasper(datas) {
                var qrcode = $scope.dataPasienSelected.noregistrasi
                // var qrcode = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg="+$scope.dataPasienSelected.noregistrasi
                var norec = $scope.dataPasienSelected.norec
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noreg", "qrcode", "query"],
                    "paramValue": [$scope.dataPasienSelected.noregistrasi, qrcode, datas], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.response, typeof this.response);
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }

                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/labelPasien.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/labelPasien.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            $scope.pilihQty2 = function () {
                debugger
                let queryjadi = ""
                let sintak = " SELECT pd.noregistrasi,pd.tglregistrasi,p.nocm,upper((p.namapasien)::text) AS namapasien,jk.jeniskelamin AS jk,upper((alm.alamatlengkap)::text) AS alamat,to_char(p.tgllahir, 'DD-TMMonth-YYYY HH12:MIPM'::text) AS tgllahir,CASE WHEN (pg.namalengkap IS NULL) THEN '-'::character varying ELSE pg.namalengkap END AS namadokter," +
                    "TO_CHAR(age(now( ), P.tgllahir ), 'YY " + 'Tahun' + " mm " + 'Bulan' + " DD " + 'Hari' + "') AS umur " +
                    "FROM ((((pasiendaftar_t pd JOIN pasien_m p ON ((pd.nocmfk = p.id))) JOIN jeniskelamin_m jk ON ((jk.id = p.objectjeniskelaminfk))) LEFT JOIN pegawai_m pg ON ((pg.id = pd.objectpegawaifk))) LEFT JOIN alamat_m alm ON ((alm.nocmfk = p.id)))" +
                    'where noregistrasi = ' + "'" + $scope.item.noregistrasi + "'"
                Labelpasienjaspera4(sintak)
            }

            function Labelpasienjaspera4(datas) {
                var qrcode = $scope.item.noregistrasi
                // var norec = $scope.item.norec
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noreg", "qrcode", "query"],
                    "paramValue": [$scope.item.noregistrasi, qrcode, datas], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log(this.response, typeof this.response);
                        debugger;
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }


                if (window.location.hostname.indexOf('localhost') > -1) {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/labelPasienA4.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/labelPasienA4.pdf');
                }
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                xhr.send(JSON.stringify(data));
            }

            $scope.diganosa = function () {
                debugger;
                // $scope.Detail = function () {
                if ($scope.item.noregistrasi != undefined) {
                    var obj = {
                        noRegistrasi: $scope.item.noregistrasi
                    }
                    var arrStr = {
                        0: $scope.item.nocm,
                        1: $scope.item.namapasien,
                        2: $scope.item.jeniskelamin,
                        3: $scope.item.noregistrasi,
                        4: $scope.item.umurzz,
                        5: $scope.item.kelompokpasien,
                        6: $scope.item.tglregistrasi,
                        7: $scope.item.norec_apd,
                        8: $scope.item.norec_pd,
                        9: $scope.item.idkelas,
                        10: $scope.item.namakelas,
                        11: $scope.item.objectruanganfk,
                        12: $scope.item.namaruangan
                    }
                    cacheHelper.set('InputDiagnosaDokterAllCtrl', arrStr);
                    $state.go('InputDiagnosaDokterAll', {
                        dataPasien: JSON.stringify(obj)
                    });
                } else {
                    toastr.error('Data belum dipilih', 'Info');
                }
            }

            function loadCombo() {
                var chacePeriode = cacheHelper.get('DaftarAntrianSusterRanapCtrl');
                if (chacePeriode != undefined) {
                    //debugger;
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);
                    $scope.itema.ruangan = {
                        id: arrPeriode[2],
                        namaruangan: arrPeriode[3]
                    }
                    // $scope.item.tglpulang = new Date(arrPeriode[2]);                
                } else {
                    $scope.item.periodeAwal = $scope.now;
                    $scope.item.periodeAkhir = $scope.now;
                    // $scope.item.tglpulang = $scope.now;                 
                }
                medifirstService.get("rawatinap/get-data-combo-dokter", false).then(function (data) {
                    $scope.listRuangan = data.data.ruanganRanap;
                    $scope.listRuanganKosul = data.data.dataRuanganKonsul;
                    $scope.listRuanganDokter = data.data.ruanganall;
                    $scope.listKelompok = data.data.kelompokPasien;
                });
            }

            function loadData() {
                $scope.isRouteLoading = true;
                // var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                // var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

                var nocm = ""
                if ($scope.itema.noCm != undefined) {
                    var nocm = "&norm=" + $scope.itema.noCm
                }
                var nama = ""
                if ($scope.itema.namaPasien != undefined) {
                    var nama = "&nama=" + $scope.itema.namaPasien
                }
                var noRegistrasi = ""
                if ($scope.itema.noRegistrasi != undefined) {
                    var noRegistrasi = "&noreg=" + $scope.itema.noRegistrasi
                }
                // var dokId=""
                // if ($scope.pegawai.id != undefined){
                //    var dokId = "&dokId=" +$scope.pegawai.id
                // }
                var ruangId = ""
                if ($scope.itema.ruangan != undefined) {
                    var ruangId = "&ruangId=" + $scope.itema.ruangan.id
                }
                var kelompokId = ""
                if ($scope.itema.kelompok != undefined) {
                    var kelompokId = "&kelompokId=" + $scope.itema.kelompok.id
                }

                var isMPP = ""
                if ($scope.item.isFindMPP == true) {
                    var isMPP = "&isMPP=" + 1
                }


                medifirstService.get("rawatinap/get-daftar-antrian-ranapbedah", true).then(function (dat) {
                    debugger;
                    tempbedah = dat.data
                });
                $q.all([
                    medifirstService.get("rawatinap/get-daftar-antrian-ranap?" +
                        "&norm=" + nocm +
                        "&noreg=" + noRegistrasi +
                        "&nama=" + nama +
                        ruangId + kelompokId + isMPP),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    var datas = data[0].data;

                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1
                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(datas[i].tgllahir);
                        var umurzz = DateHelper.CountAge(tanggalLahir, tanggal);
                        datas[i].umurzz = umurzz.year + ' thn ' + umurzz.month + ' bln ' + umurzz.day + ' hari'
                        datas[i].bedah = "";
                        // datas[i].flag = "";
                    }
                    for (var i = 0; i < datas.length; i++) {
                        for (var x = 0; x < tempbedah.length; x++) {
                            if (tempbedah[x].nocm == datas[i].nocm) {
                                datas[i].bedah = "orderbedah"
                                // datas[i].flag = "N";
                            }

                        }
                    }
                    debugger
                    $scope.GridPasien = new kendo.data.DataSource({
                        data: datas,
                        group: $scope.group,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    updateBridgingDinkes()
                    var chacePeriode = '' + "~" + '' + "~" + $scope.itema.ruangan.id + "~" + $scope.itema.ruangan.namaruangan;
                    cacheHelper.set('DaftarAntrianSusterRanapCtrl', chacePeriode);
                });
            }

            $scope.klikGrid = function (item) {
                loadCombo();
                // if (item != undefined) {
                //     $scope.item.namadokter = {id:item.objectpegawaifk,namalengkap:item.namadokter}
                // }
            }

            $scope.group = {
                field: "namaruangan",
                aggregates: [
                    // {
                    //     field: "pasien",
                    //     aggregate: "count"
                    // }, 
                    {
                        field: "namaruangan",
                        aggregate: "count"
                    }
                ]
            };
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

            $scope.ColumnPasien = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "DaftarPasienRawatInap.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Sheet";

                    var myHeaders = [{
                        value: "Daftar Pasien Rawat Inap",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, {
                        cells: myHeaders,
                        type: "header",
                        height: 70
                    });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                     {
                   "command": [
                        {
                            text: " ",
                            click: cipherPol2,
                            imageClass: "clinic fa fa-stethoscope"
                        }],
                        title: "",
                        width: "70px",
                    },{
                    "field": "no",
                    "title": "No",
                    "width": "25px",
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "template": "#= new moment(new Date(tglregistrasi)).format('DD-MM-YYYY HH:mm') #",
                    "width": "80px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "60px"
                },
                {
                    "field": "nocm",
                    "title": "No. Rekam Medis",
                    "width": "60px"
                },
                {
                    "field": "kasuspenyakit",
                    "title": "Status Covid-19",
                    "width": "100px"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "160px"
                },
                {
                    "field": "umurzz",
                    "title": "Umur",
                    "width": "80px"
                },
                {
                    "field": "namadokter",
                    "title": "Dokter",
                    "width": "100px"
                },
                {
                    "field": "jeniskelamin",
                    "title": "Jenis Kelamin",
                    "width": "80px"
                },
                {
                    "field": "kelompokpasien",
                    "title": "Tipe Pembayaran",
                    "width": "80px"
                },
                {
                    "field": "namakelas",
                    "title": "Kelas",
                    "width": "80px"
                },
                {
                    "field": "kelasditanggung",
                    "title": "Kelas Ditanggung",
                    "width": "80px"
                },
                {
                    "field": "iskompleks",
                    "title": "Kompleks",
                    "width": "50px",
                    "template": '# if( iskompleks==1 ) {# ✔ # } else {#  #} #'

                },
                {
                    "field": "isMPP",
                    "title": "MPP",
                    "width": "50px",
                    "template": '# if( isMPP==1 ) {# ✔ # } else {#  #} #'

                },
                {
                    "field": "namaruanganasal",
                    "title": "Ruangan Asal",
                    "width": "80px"
                },
                {
                    "field": "diagnosa",
                    "title": "Diagnosa",
                    "width": "80px"
                },
                {
                    "field": "totaltagihan",
                    "title": "Biaya RS",
                    "width": "80px",
                    "template": "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: totaltagihan #', 'Rp. ')}}</span>",
                },
                {
                    "field": "totalpiutangpenjamin",
                    "title": "Tarif Inacbg",
                    "width": "80px",
                    "template": "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: totalpiutangpenjamin #', 'Rp. ')}}</span>",
                },
                {
                    "field": "bedah",
                    "title": "bedah",
                    "width": "80px",
                    attributes: {
                        class: "#=bedah != '' ? 'red' : '' #"
                    },
                },
                // {
                //     field: "statusAntrian",
                //     title: "Status",
                //     aggregates: ["count"]
                // }, 
                {
                    hidden: true,
                    field: "namaruangan",
                    title: "Nama Ruangan",
                    aggregates: ["count"],
                    groupHeaderTemplate: "Ruangan #= value # (Jumlah: #= count#)"
                }
                ]
            };
             function cipherPol2(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                 cacheHelper.set('cacheCP', {
                        0: dataItem.noregistrasi,
                        1: dataItem.norec_pd,
                        2: dataItem.norec_apd,
                        3: '',
                        4: '',
                        5: '',
                        6: '',
                        7: '',
                        8: '',
                        9: '',
                        10: ''
                    }
                )
                 var url = $state.href("CPHead");
                // $state.go("CPHead")
                 window.open(globalThis.location.origin + "/app/"+ url,'_blank').focus();    

            }
            $scope.formatRupiah = function (value, currency) {
                if (value == 'null')
                    value = 0
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }

            $scope.diagnosaICD10 = function () {
                debugger;
                // $state.go('RiwayatRegistrasi3', {
                //     nocm: $scope.item.nocm,
                //     noregistrasi: $scope.item.noregistrasi
                // });
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan
                }
                cacheHelper.set('DiagnosaDokterCtrl', arrStr);
                $state.go('DiagnosaDokter')
            }
            $scope.diagnosaICD9 = function () {
                debugger;
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan
                }
                cacheHelper.set('DiagnosaDokterICD9Ctrl', arrStr);
                $state.go('DiagnosaDokterICD9')
            }
            $scope.showInputDiagnosaDokter = function () {
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan
                }
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                $state.go('InputDiagnosaDokter')

            }
            $scope.rekamMedisElektronik = function () {
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                if ($scope.item.koderuangancovid == '19' && $scope.item.objectkomorbidfk == null) {
                    $scope.popUpCovid.center().open();
                    return;
                }
                if ($scope.item.kasuspenyakit == null) {
                    $scope.popUpKasusPenyakit.center().open();
                    return;
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan + '`'
                }
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.item.norec_apd
                })

            }

            $scope.resep = function () {
                debugger;
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan
                }
                cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                $state.go('InputResepApotikOrderRev')
            }

            $scope.laboratorium = function () {
                debugger;
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan
                }
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananLaboratoriumDokterRev')
            }

            $scope.radiologi = function () {
                debugger;
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan
                }
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananRadiologiDokterRev')
            }

            $scope.inputTindakanDokter = function () {
                debugger;
                if ($scope.item.nocm == null && $scope.item.norec_apd == null) {
                    window.messageContainer.error("Pilih Dahulu Pasien!")
                    return
                }
                // debugger;
                var arrStr = {
                    0: $scope.item.nocm,
                    1: $scope.item.namapasien,
                    2: $scope.item.jeniskelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umurzz,
                    5: $scope.item.kelompokpasien,
                    6: $scope.item.tglregistrasi,
                    7: $scope.item.norec_apd,
                    8: $scope.item.norec_pd,
                    9: $scope.item.idkelas,
                    10: $scope.item.namakelas,
                    11: $scope.item.objectruanganfk,
                    12: $scope.item.namaruangan
                }
                // cacheHelper.set('inputTindakanDokterRevCtrl', arrStr);
                // $state.go('inputTindakanDokterRev')
                $state.go('InputTindakanPelayananDokterRev', {
                    norecPD: $scope.item.norec_pd,
                    norecAPD: $scope.item.norec_apd,

                });
            }
            // $scope.detailOrder = function() {
            //     debugger;
            //     if ($scope.item.nocm ==null && $scope.item.norec_apd == null){
            //         window.messageContainer.error("Pilih Dahulu Pasien!")
            //         return
            //     }else{
            //         $state.go('dashboardpasien.BillingDetail', {
            //             noRecRegistrasi: $scope.item.norec_pd,
            //             noRec: $scope.item.norec_apd
            //         });
            //     }

            // }
            $scope.Monitoring = function () {
                $state.go('MonitoringPasien', {
                    noCm: $scope.item.nocm
                });
            }
            $scope.skriningGizi = function () {
                if ($scope.item == undefined) {
                    toastr.error('Pilih Pasien dulu', 'Info');
                    return
                }
                $state.go('SkriningGizi&TandaVitalRev', {
                    norecPD: $scope.item.norec_apd,
                });
            }
            $scope.PengkajianAwal = function () {
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                // if (objValid.status) {
                saveToWindow.setItemToWindowChace("isRawatInap", false);
                cookie = cookie[0].split('=');
                // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                $state.go('dashboardpasien.DashboardPAP', {
                    noCM: $scope.item.nocm,
                    tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                    noRec: $scope.item.norec_apd,
                    ruangana: $scope.item.objectruanganfk
                });
                // } else {
                //     $state.go('dashboardpasien.DashboardPAP', {
                //         noCM: $scope.item.nocm,
                //         tanggal: moment(new Date($scope.item.nocm .tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                //         noRec: $scope.item.noRec,
                //         ruangana:$scope.item.ruangan.id
                //     });
                // }
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }

            $scope.PengkajianMedis = function () {
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                // if (objValid.status) {
                saveToWindow.setItemToWindowChace("isRawatInap", false);
                cookie = cookie[0].split('=');
                // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                $state.go('dashboardpasien.PengkajianMedis', {
                    noCM: $scope.item.nocm,
                    tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                    noRec: $scope.item.norec_apd,
                    ruangana: $scope.item.objectruanganfk
                });
                // } else {
                //         $state.go('dashboardpasien.PengkajianMedis', {
                //             noCM: $scope.item.pasien.noCm,
                //             tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                //             noRec: $scope.item.noRec,
                //             ruangana:$scope.item.ruangan.id
                //         });
                //     }
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }

            // $scope.detailOrder = function() {

            //     $state.go('dashboardpasien.BillingDetail', {
            //         noRecRegistrasi: $scope.item.norec_pd,
            //         noRec: $scope.item.norec_apd
            //     });
            // }

            $scope.detailPasien = function () {
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                // if (objValid.status) {
                saveToWindow.setItemToWindowChace("isRawatInap", false);
                cookie = cookie[0].split('=');
                // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                $state.go('dashboardpasien.pasien', {
                    noCM: $scope.item.nocm,
                    tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                    noRec: $scope.item.norec_apd
                });
                //     } else {
                //         $state.go('dashboardpasien.pasien', {
                //             noCM: $scope.item.pasien.noCm,
                //             tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                //             noRec: $scope.item.noRec
                //         });
                //     }
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }

            $scope.PengkajianLanjutan = function () {
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                // if (objValid.status) {
                saveToWindow.setItemToWindowChace("isRawatInap", false);
                cookie = cookie[0].split('=');
                // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                $state.go('dashboardpasien.pengkajianLanjutan', {
                    noCM: $scope.item.nocm,
                    tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                    noRec: $scope.item.norec_apd,
                    ruangana: $scope.item.objectruanganfk
                });
                //     } else {
                //         $state.go('dashboardpasien.pengkajianLanjutan', {
                //             noCM: $scope.item.pasien.noCm,
                //             tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                //             noRec: $scope.item.noRec,
                //             ruangana:$scope.item.ruangan.id
                //         });
                //     }
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }

            // var arrFieldSelectVoPekerjaan = ['id', 'namaRuangan'];
            // ModelItem.getDataDummyGeneric("Ruangan", true, undefined, 10).then(function(data) {
            //     $scope.ruangans = data;
            // });

            $scope.findData = function () {
                loadData()
            }

            $scope.pemeriksaanPasien = function () {
                var cookie = document.cookie.split(';');

                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                if (objValid.status) {
                    saveToWindow.setItemToWindowChace("isRawatInap", false);
                    cookie = cookie[0].split('=');
                    if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                        $state.go('dashboardpasien.pengkajianUtama', {
                            noCM: $scope.item.pasien.noCm,
                            tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                            noRec: $scope.item.noRec
                        });
                    } else {
                        $state.go('dashboardpasien.pengkajianUtama', {
                            noCM: $scope.item.pasien.noCm,
                            tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                            noRec: $scope.item.noRec
                        });
                    }
                } else {
                    window.messageContainer.error(objValid.msg);
                }
            }

            $scope.orderPenunjang = function () {
                // * Validasi Untuk Sekali Bayar
                //if(status==true){
                // 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!");
                //return;
                // }
                // * Validasi Untuk Sekali Bayar
                debugger

                if ($scope.item.norec_pd != undefined) {
                    $state.go('OrderPenunjang', {
                        norecPD: $scope.item.norec_pd,
                        norecAPD: $scope.item.norec_apd,
                    });
                } else {
                    window.messageContainer.error("Pasien Belum di Pilih!!");
                    return;
                }
            }

            $scope.cekStatusBeforePemeriksaan = function (statusCode, statusAntrian) {
                var obj = {
                    "msg": "",
                    "status": true
                }
                switch (statusCode) {
                    case "suster":
                        switch (statusAntrian) {
                            case "DIPANGGIL_DOKTER":
                                obj.msg = "Pasien sudah di panggil dokter";
                                obj.status = false;
                                break;
                            case "DIPANGGIL_SUSTER":
                                obj.status = true;
                                break;
                            case "MENUNGGU":
                                obj.msg = "Pasien harus di panggil suster terlebih dahulu";
                                obj.status = false;
                                break;
                        };
                        break;
                    case "dokter":
                        switch (statusAntrian) {
                            case "DIPANGGIL_DOKTER":
                                obj.status = true;
                                break;
                            case "DIPANGGIL_SUSTER":
                                obj.msg = "Pasien harus di panggil dokter terlebih dahulu";
                                obj.status = false;
                                break;
                            case "MENUNGGU":
                                obj.msg = "Pasien harus di panggil suster terlebih dahulu";
                                obj.status = false;
                                break;
                        };
                        break;
                }

                return obj;
            }

            $scope.cekStatusBeforePanggil = function (statusCode, statusAntrian) {
                var obj = {
                    "msg": "",
                    "status": false,
                    "statusAntrian": 0
                }

                switch (statusCode) {
                    case "suster":
                        switch (statusAntrian) {
                            case "DIPANGGIL_DOKTER":
                                obj.msg = "Pasien sudah di panggil dokter";
                                obj.status = false;
                                break;
                            case "DIPANGGIL_SUSTER":
                                obj.msg = "Pasien sudah di panggil suster";
                                obj.status = false;
                                break;
                            case "MENUNGGU":
                                obj.status = true;
                                obj.statusAntrian = 1;
                                break;
                        };
                        break;
                    case "dokter":
                        switch (statusAntrian) {
                            case "DIPANGGIL_DOKTER":
                                obj.msg = "Pasien sudah di panggil dokter";
                                obj.status = false;
                                break;
                            case "DIPANGGIL_SUSTER":
                                obj.status = true;
                                obj.statusAntrian = 2;
                                break;
                            case "MENUNGGU":
                                obj.msg = "Pasien harus di panggil suster terlebih dahulu";
                                obj.status = false;
                                break;
                        };
                        break;
                }

                return obj;
            }

            $scope.UbahDokter = function (item, data) {
                debugger;
                if (data === undefined)
                    data = $scope.item;

                $scope.item = data;
                medifirstService.get("rawatinap/get-dokters-combos", false).then(function (data) {
                    $scope.listDokter = data.data.dokter;
                })
                // show popup untuk pilih dokter
                $scope.winDialogss.center().open();
            }


            $scope.simpanDokter = function (item, data) {
                debugger;
                var listRawRequired = [
                    "items.pilihDokter|k-ng-model|Dokter"
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);

                if (isValid.status) {
                    // munculkan nama dokter di grid
                    // items.pilihDokter = data.data.dokter.namalengkap;

                    // save dokter yang dipilih
                    var tmpData = {
                        norec_apd: $scope.item.norec_apd,
                        iddokter: $scope.items.pilihDokter.id
                    }
                    medifirstService.post('rawatinap/save-update-dokter-antrian', tmpData).then(function (e) {
                        // update status antrian
                        $scope.winDialogss.close();
                        loadData();
                        // $scope.findData(); 
                        $scope.items.pilihDokter = '';

                    });

                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            }

            $scope.cetakGelang = function () {
                if ($scope.item != undefined) {
                    var fixUrlLaporan = cetakHelper.open("registrasi-pelayanan/gelangPasien?id=" + $scope.item.nocmfk);
                    window.open(fixUrlLaporan, '_blank')
                }
            }
            $scope.SaveKasus = function () {
                var norReg = ""
                if ($scope.item.noregistrasi != undefined) {
                    norReg = $scope.item.noregistrasi;
                }
                if ($scope.konsul == undefined) {
                    alert('Kasus Komorbid Belum di pilih')
                    return;
                }
                if ($scope.konsul.kp == undefined) {
                    alert('Kasus Belum di pilih')
                    return;
                }
                var json = {
                    'noregistrasi': norReg,
                    'kasuspenyakit': $scope.konsul.kp
                }
                medifirstService.post('registrasi/save-kasus-penyakit', json).then(function (x) {
                    $scope.popUpKasusPenyakit.close();
                    loadData();
                });
            }
            $scope.pasienPulang = function () {

                if ($scope.item == undefined) {
                    toastr.error('Pilih data dulu', 'Informasi');
                } else {
                    if ($scope.item.koderuangancovid == '19' && $scope.item.objectkomorbidfk == null) {
                        $scope.popUpCovid.center().open();
                        return;
                    }
                    medifirstService.get("rawatinap/get-ruangan-last?norec_pd=" + $scope.item.norec_pd).then(function (a) {
                        $scope.item.ruanganLast = a.data.data[0].objectruanganlastfk
                        if ($scope.item.ruanganLast != undefined) {
                            $state.go('PindahPulangPasien', {
                                norecPD: $scope.item.norec_pd,
                                norecAPD: $scope.item.norec_apd
                            });
                            var CachePindah = $scope.item.ruanganLast
                            cacheHelper.set('CachePindah', CachePindah);
                        }
                    })
                }

            }

            $scope.pemeriksaanUscom = function () {
                if ($scope.item.namadokter == undefined) {
                    alert("Dokter Belum Dipilih!!");
                    return;
                    // $scope.cekDokter();
                } else {
                    $state.go('HasilPemeriksaanUscom', {
                        noRecRegistrasi: $scope.item.norec_pd,
                        noRec: $scope.item.norec_apd
                    });
                }
            }

            // $scope.skriningGizi = function() {
            //     if ($scope.item.namadokter == undefined) {
            //         alert("Dokter Belum Dipilih!!");
            //         return;
            //     } else {
            //         var cookie = document.cookie.split(';');
            //         var statusCode = ModelItem.getStatusUser();
            //         // var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
            //         // if (objValid.status) {
            //             saveToWindow.setItemToWindowChace("isRawatInap", false);
            //             cookie = cookie[0].split('=');
            //             // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
            //                 $state.go('DashboarSkriningGizi', {
            //                     noCM: $scope.item.nocm,
            //                     tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
            //                     noRec: $scope.item.norec_apd,
            //                     ruangana: $scope.item.objectruanganfk
            //                 });
            //         //     } else {
            //         //         $state.go('DashboarSkriningGizi', {
            //         //             noCM: $scope.item.pasien.noCm,
            //         //             tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
            //         //             noRec: $scope.item.noRec,
            //         //             ruangana:$scope.item.ruangan.id
            //         //         });
            //         //     }
            //         // } else {
            //         //     window.messageContainer.error(objValid.msg);
            //         // }
            //     }
            // }

            $scope.observasi = function () {
                if ($scope.item.namadokter == undefined) {
                    alert("Dokter Belum Dipilih!!");
                    return;
                } else {
                    var cookie = document.cookie.split(';');
                    var statusCode = ModelItem.getStatusUser();
                    var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                    // if (objValid.status) {
                    saveToWindow.setItemToWindowChace("isRawatInap", false);
                    cookie = cookie[0].split('=');
                    // if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                    $state.go('FormulirObservasiHarianTerintegrasiIntensiveCareUnit', {
                        noCM: $scope.item.nocm,
                        tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                        noRec: $scope.item.norec_apd,
                        noRecDaftar: $scope.item.norec_pd,
                        ruangana: $scope.item.objectruanganfk
                    });
                    //     } else {
                    //         $state.go('FormulirObservasiHarianTerintegrasiIntensiveCareUnit', {
                    //             noCM: $scope.item.pasien.noCm,
                    //             tanggal: moment(new Date($scope.item.pasienDaftar.tglRegistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                    //             noRec: $scope.item.noRec,
                    //             noRecDaftar: $scope.item.pasienDaftar.noRec,
                    //             ruangana:$scope.item.ruangan.id
                    //         });
                    //     }
                    // } else {
                    //     window.messageContainer.error(objValid.msg);
                    // }
                }
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

            // edit data registrasi pasien
            $scope.cekStatusBeforeEdit = function (statusAntrian) {
                var obj = {
                    "msg": "",
                    "status": true
                }

                switch (statusAntrian) {
                    case "DIPANGGIL_DOKTER":
                        obj.msg = "Pasien sudah di panggil dokter";
                        obj.status = false;
                        break;
                    case "DIPANGGIL_SUSTER":
                        obj.msg = "Pasien sudah di panggil dokter";
                        obj.status = false;
                        break;
                    case "MENUNGGU":
                        obj.status = true;
                        break;
                }
                return obj;
            }
            $scope.editRegistrasi = function () {
                // var objValid = $scope.cekStatusBeforeEdit($scope.item.statusAntrian);
                // if (objValid.status) {
                $state.go('editRegistrasiPelayanan', {
                    noCm: $scope.item.pasien.noCm,
                    noRec: $scope.item.pasienDaftar.noRec
                });
                // } else {
                //     window.messageContainer.error(objValid.msg);
                // }
            }
            $scope.formatJam24 = {
                value: new Date(), //set default value
                format: "dd-MM-yyyy HH:mm", //set date format
                timeFormat: "HH:mm", //set drop down time format to 24 hours
            }
            $scope.Detail = function () {
                debugger
                let user = medifirstService.getMapLoginUserToRuangan();
                if ($scope.item.noregistrasi != undefined) {
                    if ($scope.item.objectruanganfk == 720 || $scope.item.objectruanganfk == 777 || $scope.item.objectruanganfk == 778 || $scope.item.objectruanganfk == 779 || $scope.item.objectruanganfk == 753 || $scope.item.objectruanganfk == 754 || $scope.item.objectruanganfk == 755 || $scope.item.objectruanganfk == 747 || $scope.item.objectruanganfk == 748 || $scope.item.objectruanganfk == 769 || $scope.item.objectruanganfk == 770 || $scope.item.objectruanganfk == 731) {
                        medifirstService.get("emr/get-emr-transaksi?nocm=" + $scope.item.nocm + "&jenisEmr=askepnew&noregistrasi=" + $scope.item.noregistrasi, true).then(function (dat) {
                            debugger
                            if (dat.data.data.length == 0) {
                                toastr.error('Harus Mengisi SIDOPAK Terlebih Dahulu', 'Info');
                            } else {
                                medifirstService.get("emr/get-combolistaskep?noregistrasi=" + $scope.item.noregistrasi).then(function (dat) {
                                    if (dat.data.askep.length == 0) {
                                        toastr.error('Harus Mengisi SIDOPAK Terlebih Dahulu', 'Info');
                                    } else {
                                        RincianTagihan();
                                    }
                                });
                            }
                        });
                    } else {
                        RincianTagihan();
                    }

                    // if($scope.item.objectruanganfk == 569) {

                    // } else {
                    //     RincianTagihan();
                    // }

                    function RincianTagihan() {
                        if ($scope.item.koderuangancovid == '19' && $scope.item.objectkomorbidfk == null) {
                            $scope.popUpCovid.center().open();
                            return;
                        }

                        if ($scope.item.kasuspenyakit == null) {
                            $scope.popUpKasusPenyakit.center().open();
                            return;
                        }
                        var obj = {
                            noRegistrasi: $scope.item.noregistrasi
                        }
                        debugger

                        var statusOtomatis = "YA"
                        cacheHelper.set('statusOtomatis', statusOtomatis);
                        $state.go('RincianTagihan', {
                            dataPasien: JSON.stringify(obj)
                        });
                    }
                } else {
                    toastr.error('Data belum dipilih', 'Info');
                }
            }

            $scope.terimaPasien = function () {
                debugger
                if ($scope.item.noregistrasi) {
                    if ($scope.item.isterimapasien === null) {
                        $scope.item.tglterimapasien = new Date();
                        $scope.item.tglterimapasien = new Date(moment($scope.item.tglterimapasien).format('YYYY-MM-DD HH:mm'));
                        $scope.popUpTglTerima.center().open();
                    } else {
                        messageContainer.error('Pasien sudah diterima pada ' + $scope.item.tglregistrasi)
                    }
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }

            $scope.simpanTerimaPasien = function () {
                debugger;
                var json = {
                    'noregistrasi': $scope.item.noregistrasi,
                    'norec_apd': $scope.item.norec_apd,
                    'tglterimapasien': $scope.item.tglterimapasien,
                    'isterimapasien': true
                }
                debugger;
                medifirstService.post('rawatinap/update-tanggal-terimapasien', json).then(function (e) {
                    // if (e.status === 201) {
                    // debugger;
                    // medifirstService.post('sysadmin/logging/save-log-ganti-tanggal-resep', json).then(function (e) {
                    // 	LoadCache();
                    // 	})
                    // }
                })
                $scope.popUpTglResep.close()
            }
            $scope.TransaksiLayanan = function () {
                // debugger;
                if ($scope.item.norec_apd == undefined) {
                    toastr.error('Pilih Pasien dulu', 'Info');
                    return
                } else {
                    $state.go('DashboardPasien', {
                        noregistrasi: $scope.item.noregistrasi,
                        norec_pd: $scope.item.norec_pd,
                        norec_apd: $scope.item.norec_apd,
                        umur: $scope.item.umurzz,
                        idpegawai: $scope.pegawai.id
                    });
                }
            }

            $scope.pengkajianMedis = function () {
                // debugger
                if ($scope.item.noregistrasi == undefined) {
                    toastr.error('Pilih Data dulu')
                    return
                }
                var cookie = document.cookie.split(';');
                var statusCode = ModelItem.getStatusUser();
                var objValid = $scope.cekStatusBeforePemeriksaan(statusCode, $scope.item.statusAntrian);
                if (objValid.status) {
                    saveToWindow.setItemToWindowChace("isRawatInap", false);
                    cookie = cookie[0].split('=');
                    if ($scope.item.isKajianAwal || cookie[1] === 'suster') {
                        $state.go('dashboardpasien.PengkajianMedis', {
                            noCM: $scope.item.nocm,
                            tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                            noRec: $scope.item.norec_pd,
                            ruangana: $scope.item.objectruanganfk
                        });
                    } else {
                        $state.go('dashboardpasien.PengkajianMedis', {
                            noCM: $scope.item.nocm,
                            tanggal: moment(new Date($scope.item.tglregistrasi)).format('YYYY-MM-DD HH:mm:ss'),
                            noRec: $scope.item.norec_pd,
                            ruangana: $scope.item.objectruanganfk
                        });
                    }
                } else {
                    window.messageContainer.error(objValid.msg);
                }
            }


            // **** Kejadian pasien jatuh
            $scope.dialog = {
                tglJatuh: $scope.now
            }
            $scope.pasienJatuh = function () {
                if (!$scope.item.norec_pd) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.dialog.nocm = $scope.item.nocm
                $scope.dialog.namapasien = $scope.item.namapasien
                $scope.dialog.norec_pd = $scope.item.norec_pd
                $scope.dialog.nocmfk = $scope.item.nocmfk

                $scope.dialogPasienJatuh.center().open()
            }
            $scope.simpanJatuh = function (data) {
                var objsave = {
                    "norec": "",
                    "statusenabled": true,
                    "nocmfk": $scope.dialog.nocmfk,
                    "noregistrasifk": $scope.dialog.norec_pd,
                    "jumlah": $scope.dialog.jumlah != undefined ? $scope.dialog.jumlah : 0,
                    "tgljatuh": moment(data.tglJatuh).format('YYYY-MM-DD HH:mm'),
                    "keterangan": data.keterangan != undefined ? data.keterangan : '-',
                }
                medifirstService.post('rawatinap/save-pasien-jatuh', objsave).then(function (e) {
                    $scope.dialog = {}
                })
            }
            $scope.klikdua = function (item) {
                // if (item.foto != null) {
                //     $scope.item.image = item.foto
                //     $scope.popUpPhoto.center().open()

                // }

            }
            $scope.tutupPhoto = function () {
                $scope.item.image = "../app/images/avatar.jpg"
                $scope.popUpPhoto.close()
            }
            $scope.showKompleks = function () {
                if ($scope.item == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                if ($scope.item.iskompleks == true)
                    $scope.item.isKompleks = true
                $scope.popUpKompleks.center().open()
            }
            $scope.saveKompleks = function (komplek) {

                var data = {
                    'nocm': $scope.item.nocm,
                    'iskompleks': komplek
                }
                medifirstService.post('rawatjalan/save-pasien-kompleks', data).then(function (e) {
                    loadData()
                    $scope.item.isKompleks = false
                })
            }
            $scope.simpanCovid = function () {
                debugger;
                if ($scope.konsul == undefined) {
                    alert('Kasus Komorbid Belum di pilih')
                    return;
                }
                if ($scope.konsul.komorbid == undefined) {
                    alert('Kasus Komorbid Belum di pilih')
                    return;
                }
                if ($scope.konsul.pertanyaan == undefined) {
                    alert('Kasus Ventilator Belum di pilih')
                    return;
                }
                if ($scope.konsul.kp == undefined) {
                    alert('Kasus Belum di pilih')
                    return;
                }
                var dataKonsul = {
                    "norec_pd": $scope.item.norec_pd,
                    "objectkomorbidfk": $scope.konsul.komorbid,
                    "objectkomorbiddetailfk": $scope.konsul.pertanyaan,
                    "kasuspenyakit": $scope.konsul.kp
                }
                medifirstService.post('tatarekening/save-komorbid', dataKonsul).then(function (e) {
                    $scope.popUpCovid.close();
                    $scope.item = {};
                    loadData()
                    // $scope.saveLogKonsul();
                    debugger;

                })
            }
            $scope.simpanKonsul = function () {
                debugger;
                var current = $scope.item;
                var length = 0
                var kelasTujuan = "";
                if ($scope.konsul.ruangan.id == "569") {
                    kelasTujuan = "6";
                } else if ($scope.konsul.ruangan.objectdepartemenfk == "18") {
                    kelasTujuan = "6";
                } else {
                    kelasTujuan = current.idkelas;
                }
                var dataKonsul = {
                    "asalrujukanfk": current.objectasalrujukanfk,
                    "kelasfk": kelasTujuan,
                    "noantrian": length,
                    "norec_pd": $scope.item.norec_pd,
                    "dokterfk": $scope.item.objectpegawaifk,
                    "objectruangantujuanfk": $scope.konsul.ruangan.id,
                    "objectruanganasalfk": $scope.item.objectruanganfk
                }
                medifirstService.post('tatarekening/save-konsul-keruangan', dataKonsul).then(function (e) {
                    // LoadData();
                    // $scope.saveLogKonsul();
                    debugger;
                    $scope.now = new Date();
                    var data = {
                        "norec_kdr": '',
                        "objectruangantujuanfk": $scope.konsul.ruangan.id,
                        "objectruanganasalfk": $scope.item.objectruanganfk,
                        "tglupdate": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'), //items.tglUpdate,//.getTime(), 
                        "objectstatuskendalidokumenfk": 2,
                        "nocmfk": $scope.item.nocmfk,
                        "tglkeluar": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                        "catatan": "",
                        "noregistrasifk": e.data.data.norec
                        //"tglkembali": tglkembali
                    };
                    $scope.batalKonsul();
                    medifirstService.post('registrasi/dokumenrm/save-kendali-dokumen', data).then(function (e) {

                    });
                })
            }
            $scope.batalKonsul = function () {
                $scope.popUpSx.close();
            }
            $scope.DaftarRuangan = function () {
                // debugger;
                if ($scope.item === undefined) {
                    messageContainer.error("Pilih data terlebih dahulu");
                    return
                } else {
                    if ($scope.item.koderuangancovid == '19' && $scope.item.objectkomorbidfk == null) {
                        $scope.popUpCovid.center().open();
                        return;
                    }
                    if ($scope.item.kasuspenyakit == null) {
                        $scope.popUpKasusPenyakit.center().open();
                        return;
                    }
                    $scope.popUpSx.center().open()
                    $scope.konsul.kelas = $scope.listKelas[3]

                    $scope.cboDokter = false;
                    $scope.cboUbahDokter = false;
                    $scope.cboKonsul = true;
                    $scope.showUbahTanggal = false;
                }
            }
            $scope.showMPP = function () {
                if ($scope.item == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                if ($scope.item.isMPP == true)
                    $scope.item.isMPP = true
                $scope.popUpMPP.center().open()
            }
            $scope.saveMPP = function (MPP) {

                var data = {
                    'nocm': $scope.item.nocm,
                    'isMPP': MPP
                }
                medifirstService.post('rawatjalan/save-pasien-mpp', data).then(function (e) {
                    loadData()
                    $scope.item.isMPP = false
                })
            }
            $scope.batalPindah = function () {
                medifirstService.get("rawatinap/get-ruangan-last?norec_pd=" + $scope.item.norec_pd).then(function (e) {
                    $scope.item.ruanganLast = e.data.data[0].objectruanganlastfk

                    var tes = {
                        "norec_pd": $scope.item.norec_pd,
                        "objectruanganlastfk": $scope.item.ruanganLast
                    }

                    if (tes == undefined) {
                        window.messageContainer.error("Pilih Pasien Dahulu!");
                        return;
                    }

                    $scope.tombolSimpanBatalPindah = false
                    medifirstService.post('rawatinap/save-batal-pindah-ruangan', tes).then(function (e) {
                        loadData();
                        $scope.tombolSimpanBatalPindah = true
                    }, function (error) {
                        $scope.tombolSimpanBatalPindah = true
                    });
                })
            }

            $scope.InsidenInternal = function () {
                if ($scope.item.norec_pd == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }
                var chacePeriode = {
                    0: $scope.item.norec_pd,
                    1: 'InputInsidenInternal',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('InsidenInternalCtrl', chacePeriode);
                $state.go('InsidenInternal', {
                    kpid: $scope.item.norec_pd,
                    noOrder: 'InputInsidenInternal'
                });
            }

            $scope.inputTindakan = function (item, data) {
                debugger;
                $scope.hideBtnSimpan = true;
                if ($scope.item.iddokter === undefined || $scope.item.iddokter === '' || $scope.item.iddokter === '1' || $scope.item.iddokter === null) {

                    // $scope.UbahDokter = function (item, data) {
                    if (data === undefined)
                        data = $scope.item;

                    $scope.item = data;
                    medifirstService.get("rawatinap/get-dokters-combos", false).then(function (data) {
                        $scope.listDokter = data.data.dokter;
                    })
                    // show popup untuk pilih dokter
                    $scope.winDialogss.center().open();
                    // }
                    // toastr.error('Dokter Belum Di Pilih', 'Peringatan');
                    $scope.hideBtnSimpan = false;
                    return;
                }

                if ($scope.item.objectkelasdijaminfk === null && $scope.item.objectkelompokpasienlastfk != 1) {
                    alert('Kelas Tanggungan Belum di isi, Hubungi Admisi Untuk Mengisinya')
                    return;
                }

                debugger;
                if ($scope.item.koderuangancovid == '19' && $scope.item.objectkomorbidfk == null) {
                    $scope.popUpCovid.center().open();
                    return;
                }
                if ($scope.item.kasuspenyakit == null) {
                    $scope.popUpKasusPenyakit.center().open();
                    return;
                }
                if ($scope.item) {
                    $state.go('InputTindakan', {
                        norecPD: $scope.item.norec_pd,
                        norecAPD: $scope.item.norec_apd,
                    });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }

            function cekSTRPegawai() {
                debugger
                var idPegawai = medifirstService.getPegawaiLogin().id
                var idJenisPegawai = medifirstService.getPegawaiLogin().jenisPegawai.id
                if (idJenisPegawai == 1 || idJenisPegawai == 2) {
                    medifirstService.get('sdm/get-str-pegawai?idPegawai=' + idPegawai).then(function (dat) {
                        debugger
                        if (dat.data.length == 0) {
                            toastr.warning('STR Anda Belum Diinput ! Silahkan Input STR Terlebih Dahulu !', 'Peringatan !')
                            return
                        }
                        var tglsekarang = moment($scope.now).format('YYYY-MM-DD HH:mm')
                        var tglberakhir = moment(dat.data[0].berakhirstr).format('YYYY-MM-DD HH:mm')
                        debugger
                        var tampung1 = new Date(tglberakhir).getTime()
                        var tampung2 = new Date(tglsekarang).getTime()

                        var diff = tampung1 - tampung2
                        var diff2 = diff.toString()
                        for (var i = 0; i < diff2.length; i++) {
                            if (diff2[0] == '-') {
                                toastr.warning('Masa Berlaku STR Anda Sudah Habis ! Harap Segera Diperbaharui !', 'Peringatan !')
                                return
                            }
                        }
                        if (diff < 15770000000) {
                            toastr.warning('Masa Berlaku STR Anda Kurang Dari 6 Bulan ! Harap Segera Diperbaharui !', 'Peringatan !')
                            return
                        }
                    })
                }
            }

            function cekSIPPegawai() {
                debugger
                var idPegawai = medifirstService.getPegawaiLogin().id
                var idJenisPegawai = medifirstService.getPegawaiLogin().jenisPegawai.id
                if (idJenisPegawai == 1 || idJenisPegawai == 2) {
                    medifirstService.get('sdm/get-sip-pegawai?idPegawai=' + idPegawai).then(function (dat) {
                        debugger
                        if (dat.data.length == 0) {
                            toastr.warning('SIP Anda Belum Diinput ! Silahkan Input SIP Terlebih Dahulu !', 'Peringatan !')
                            return
                        }
                        var tglsekarang = moment($scope.now).format('YYYY-MM-DD HH:mm')
                        var tglberakhir = moment(dat.data[0].berakhirsip).format('YYYY-MM-DD HH:mm')
                        debugger
                        var tampung1 = new Date(tglberakhir).getTime()
                        var tampung2 = new Date(tglsekarang).getTime()

                        var diff = tampung1 - tampung2
                        var diff2 = diff.toString()
                        for (var i = 0; i < diff2.length; i++) {
                            if (diff2[0] == '-') {
                                toastr.warning('Masa Berlaku SIP Anda Sudah Habis ! Harap Segera Diperbaharui !', 'Peringatan !')
                                return
                            }
                        }
                        if (diff < 15770000000) {
                            toastr.warning('Masa Berlaku SIP Anda Kurang Dari 6 Bulan ! Harap Segera Diperbaharui !', 'Peringatan !')
                            return
                        }
                    })
                }
            }
        }
    ]);
});