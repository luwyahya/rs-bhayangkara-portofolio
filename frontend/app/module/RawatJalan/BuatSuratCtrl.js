define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('BuatSuratCtrl', ['$rootScope', '$state', '$q', '$scope', '$window', 'CacheHelper', 'MedifirstService', 'DateHelper',
        function ($rootScope, $state, $q, $scope, window, cacheHelper, medifirstService, dateHelper) {
            $scope.dataVOloaded = true;
            $scope.item = {}
            $scope.now = new Date();
            $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00')
            $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59')
            $scope.norecpd = '';
            $scope.nomorsurat = false
            $scope.suratketeranganmedis = false
            $scope.nomorsurat2 = false
            $scope.suratpemeriksankesehatanberkala = false
            $scope.rapid = false
            $scope.rapidLN = false
            $scope.item.pengambilan = new Date();
            $scope.item.daftar = new Date();
            $scope.istempatLaporan = true;
            LoadCache();
            LoadData()
            // loadHPM1()
            LoadCombo()

            function LoadCache() {

                var chacePeriode = cacheHelper.get('BuatSurat');
                if (chacePeriode != undefined) {
                    $scope.norecpd = chacePeriode[0]
                    $scope.item.norm = chacePeriode[1]
                    $scope.item.noregistrasi = chacePeriode[2]
                    $scope.item.namapasien = chacePeriode[3]
                    $scope.item.tglregistrasi = chacePeriode[4]
                    $scope.item.jeniskelamin = chacePeriode[5]
                    $scope.item.ruangan = chacePeriode[6]
                    $scope.item.alamat = chacePeriode[7]
                    $scope.item.umur = chacePeriode[8]
                    $scope.item.daftar = chacePeriode[4]
                } else {

                }
            }

            function LoadCombo() {
                medifirstService.get('registrasi/laporan/get-combo-buat-surat?').then(function (b) {
                    $scope.listSurat = b.data.surat
                    $scope.listPegawai = b.data.dokter
                    $scope.listJabatan = b.data.jabatan
                    $scope.lab = b.data.lab
                    $scope.ekg = b.data.ekg
                    $scope.treadmill = b.data.treadmill
                    $scope.rontgent = b.data.rontgent
                    $scope.stakes = b.data.stakes
                    $scope.kuantitatif = b.data.kuantitatif
                    $scope.listJenisPemeriksaan = b.data.jenis
                })
            }

            function LoadData() {

            }
            $scope.Cari = function () {
                if ($scope.item.surat == undefined) {
                    toastr.error('Pilih Surat Dahulu !')
                    return;
                } else if ($scope.item.surat.id == 1) {
                    // medifirstService.get('registrasi/laporan/get-template?id=14').then(function(q) {
                    $scope.nomorsurat = true
                    $scope.suratketeranganmedis = true
                    $scope.nomorsurat2 = false
                    $scope.suratpemeriksankesehatanberkala = false
                    $scope.rapid = false
                    $scope.rapidLN = false
                    loadHPM1()
                    // $scope.item.templatesurat = q.data[0].template
                    // })
                } else if ($scope.item.surat.id == 2) {
                    $scope.nomorsurat = false
                    $scope.suratketeranganmedis = false
                    $scope.nomorsurat2 = true
                    $scope.suratpemeriksankesehatanberkala = true
                    $scope.rapid = false
                    $scope.rapidLN = false
                    loadHPM2()
                } else if ($scope.item.surat.id == 3) {
                    $scope.nomorsurat = false
                    $scope.suratketeranganmedis = false
                    $scope.nomorsurat2 = false
                    $scope.suratpemeriksankesehatanberkala = false
                    $scope.rapid = true
                    $scope.rapidLN = false
                    loadHPM3()
                } else if ($scope.item.surat.id == 4) {
                    $scope.nomorsurat = false
                    $scope.suratketeranganmedis = false
                    $scope.nomorsurat2 = false
                    $scope.suratpemeriksankesehatanberkala = false
                    $scope.rapid = false
                    $scope.rapidLN = true
                    loadHPM4()
                }
            }
            // $scope.optionEdit = {
            //     tools: [
            //         "bold",
            //         "italic",
            //         "underline",
            //         "strikethrough",
            //         "justifyLeft",
            //         "justifyCenter",
            //         "justifyRight",
            //         "justifyFull",
            //         "insertUnorderedList",
            //         "insertOrderedList",
            //         "indent",
            //         "outdent",
            //         "createLink",
            //         "unlink",
            //         "insertImage",
            //         "insertFile",
            //         "subscript",
            //         "superscript",
            //         "tableWizard",
            //         "createTable",
            //         "addRowAbove",
            //         "addRowBelow",
            //         "addColumnLeft",
            //         "addColumnRight",
            //         "deleteRow",
            //         "deleteColumn",
            //         "mergeCellsHorizontally",
            //         "mergeCellsVertically",
            //         "splitCellHorizontally",
            //         "splitCellVertically",
            //         "viewHtml",
            //         "formatting",
            //         "cleanFormatting",
            //         "copyFormat",
            //         "applyFormat",
            //         "foreColor",
            //         "backColor",
            //         "print"],
            //     resizable: {
            //         content: true,
            //         toolbar: true
            //     }

            // };

            $scope.SimpanSKM = function () {
                // if($scope.item.pegawai2 == null || $scope.item.pegawai2 == undefined || $scope.item.pegawai2 == 'null' || $scope.item.pegawai2.id == null){
                //     $scope.item.pegawai2.id = '';
                //     $scope.item.pegawai2.id = 0;
                // }
                // if($scope.item.pegawai3 == null){
                //     $scope.item.pegawai3.id = 0;
                // }
                debugger
                if ($scope.item.nomorsurat == undefined || $scope.item.nomorsurat == null) {
                    $scope.item.nomorsurat = ""
                }
                if ($scope.item.stakes1 == undefined || $scope.item.stakes1 == null) {
                    $scope.item.stakes1 = ""
                }
                if ($scope.item.stakes2 == undefined || $scope.item.stakes2 == null) {
                    $scope.item.stakes2 = ""
                }

                if ($scope.item.nomorurut == undefined || $scope.item.nomorurut == null || $scope.item.nomorurut == "") {
                    toastr.error('Nomor Urut Wajib Diisi !');
                    return;
                }

                var objSave = {
                    // 'pekerjaan': {
                    //     'id': $scope.item.pekerjaan != undefined ? $scope.item.pekerjaan.id : null,
                    // },
                    norec_pd: $scope.norecpd,
                    nomor: $scope.item.nomorsurat,
                    pegawai1: $scope.item.pegawai1 != undefined ? $scope.item.pegawai1.id : null,
                    pegawai2: $scope.item.pegawai2 != undefined ? $scope.item.pegawai2.id : null,
                    pegawai3: $scope.item.pegawai3 != undefined ? $scope.item.pegawai3.id : null,
                    jabatan: $scope.item.jabatan.id,
                    stakes1: $scope.item.stakes1.stakes,
                    stakes2: $scope.item.stakes2.kuantitatif,
                    tinggibadan: $scope.item.tinggibadan,
                    beratbadan: $scope.item.beratbadan,
                    komposisitubuh: $scope.item.komposisitubuh,
                    lingkarperut: $scope.item.lingkarperut,
                    tensisist: $scope.item.tensi1,
                    tensidias: $scope.item.tensi2,
                    nadi: $scope.item.nadi,
                    gigi: $scope.item.gigi,
                    mata: $scope.item.mata,
                    laboratorium: $scope.item.laboratorium.lab,
                    ekg: $scope.item.ekg.ekg,
                    treadmill: $scope.item.treadmill.treadmill,
                    rontgent: $scope.item.rontgent.rontgent,
                    kesimpulan: $scope.item.kesimpulan,
                    saran: $scope.item.saran,
                    nomorurut: $scope.item.nomorurut,
                    norec: $scope.norecHPM

                }
                debugger;
                var tahun = moment($scope.now).format('YYYY');
                medifirstService.get('laboratorium/get-nomor-surat?nomor=' + $scope.item.nomorsurat + '&tahun=' + tahun).then(function (x) {
                    debugger;
                    if (x.data.length > 1) {
                        var nomor = x.data[0].nomor3
                    } else {
                        nomor = ""
                    }

                    if ($scope.norecHPM == "" && $scope.item.nomorsurat == nomor) {
                        alert('Nomor Surat Sudah Dipakai 2 Kali Tahun Ini !!')
                        return;
                    }
                    medifirstService.post('laboratorium/save-hasil-keterangan-medis', objSave).then(function (e) {

                    })
                    loadHPM1()
                })
                // debugger;
                // if ($scope.item.nomorsurat == undefined || $scope.item.nomorsurat == "") {
                //     toastr.error('Nomor Surat Tidak Boleh Kosong !')
                //     return;

                // }

                // loadHPM1()
            }
            $scope.SimpanSPKB = function () {
                var objSave = {
                    norec_pd: $scope.norecpd,
                    nomor: $scope.item.nomorsurat,
                    pegawai1: $scope.item.pegawai.id,
                    tinggibadan: $scope.item.tinggibadan,
                    beratbadan: $scope.item.beratbadan,
                    tensi: $scope.item.tensi,
                    nadi: $scope.item.nadi,
                    tht: $scope.item.tht,
                    gigimulut: $scope.item.gigimulut,
                    jantung: $scope.item.jantung,
                    abdomendanvincera: $scope.item.abdomendanvincera,
                    anusrectum: $scope.item.anusrectum,
                    badanatas: $scope.item.badanatas,
                    badanbawah: $scope.item.badanbawah,
                    sgu: $scope.item.sgu,
                    darah: $scope.item.darah,
                    hb: $scope.item.hb,
                    led: $scope.item.led,
                    trombosit: $scope.trombosit,
                    hematokrit: $scope.item.hematokrit,
                    kolesterol: $scope.item.kolesterol,
                    hdl: $scope.item.hdl,
                    ldl: $scope.item.ldl,
                    trigeliterid: $scope.item.trigeliterid,
                    urine: $scope.item.urine,
                    ph: $scope.item.ph,
                    protein: $scope.item.protein,
                    glukosa: $scope.item.glukosa,
                    uroblinogen: $scope.item.uroblinogen,
                    ekg: $scope.item.ekg,
                    rontgent: $scope.item.rontgent,
                    treadmill: $scope.item.treadmill,
                    leko: $scope.item.leko,
                    ba: $scope.item.ba,
                    eos: $scope.item.eos,
                    bt: $scope.item.bt,
                    seg: $scope.item.seg,
                    lim: $scope.item.lim,
                    mon: $scope.item.mon,
                    erithosit2: $scope.item.erithosit2,
                    bilirobintotal: $scope.item.bilirobintotal,
                    bilirobindirek: $scope.item.bilirobindirek,
                    bilirobinindirek: $scope.item.bilirobinindirek,
                    sgot: $scope.item.sgot,
                    sgpt: $scope.item.sgpt,
                    selepitel: $scope.item.selepitel,
                    darahhb: $scope.item.darahhb,
                    lekosit: $scope.item.lekosit,
                    sedimenlekosit: $scope.item.sedimenlekosit,
                    ureum: $scope.item.ureum,
                    creatin: $scope.item.creatin,
                    asamurat: $scope.item.asamurat,
                    guladarahpuasa: $scope.item.guladarahpuasa,
                    gd2pp: $scope.item.gd2pp,
                    hbsag: $scope.item.hbsag,
                    antihiv: $scope.item.antihiv,
                    erithosit: $scope.item.erithosit,
                    keton: $scope.item.keton,
                    kristal: $scope.item.kristal,
                    silinder: $scope.item.silinder,
                    lainlain: $scope.item.lainlain,
                    anjuran: $scope.item.anjuran,
                    keluhan: $scope.item.keluhan

                }
                medifirstService.post('laboratorium/save-hasil-pemeriksaan-berkala', objSave).then(function (e) {

                })
                loadHPM2()
            }
            $scope.SimpanSKPC = function () {
                debugger
                var objSave = {
                    norec_pd: $scope.norecpd,
                    nomor: $scope.item.nomorsurat,
                    pegawaifk: $scope.item.pegawai.id,
                    tinggibadan: $scope.item.tinggibadan,
                    beratbadan: $scope.item.beratbadan,
                    tensidarah: $scope.item.tensidarah,
                    suhutubuh: $scope.item.suhutubuh,
                    persyaratan: $scope.item.persyaratan,
                    jenispemeriksaan: $scope.item.jenis.jenis
                }

                medifirstService.post('laboratorium/save-hasil-pemeriksaan-covid', objSave).then(function (e) {

                })
                loadHPM3()
            }
            $scope.item.pengambilan = moment($scope.item.pengambilan).format('YYYY-MM-DD HH:mm:ss')
            $scope.SimpanRapidLN = function () {
                debugger
                var objSave = {
                    norec_pd: $scope.norecpd,
                    pegawaifk: $scope.item.pegawai.id,
                    tglregis: $scope.item.daftar,
                    tglambil: $scope.item.pengambilan,
                    passpor: $scope.item.paspor,
                }

                medifirstService.post('laboratorium/save-hasil-pemeriksaan-covid-luar-negeri', objSave).then(function (e) {

                })
                loadHPM4()
            }

            function loadHPM1() {
                medifirstService.get('laboratorium/get-hasil-keterangan-medis?norec_pd=' + $scope.norecpd).then(function (d) {
                    debugger;
                    if (d.data.length > 0) {
                        var data = d.data[0]
                        $scope.norecHPM = data.norec
                        $scope.item.stakes1 = { id: data.stakes1, stakes: data.stakes1 }
                        $scope.item.stakes2 = { id: data.stakes2, kuantitatif: data.stakes2 }
                        $scope.item.tinggibadan = data.tinggibadan
                        $scope.item.beratbadan = data.beratbadan
                        $scope.item.komposisitubuh = data.komposisitubuh
                        $scope.item.lingkarperut = data.lingkarperut
                        $scope.item.tensi1 = data.tensisist
                        $scope.item.tensi2 = data.tensidias
                        $scope.item.nadi = data.nadi
                        $scope.item.gigi = data.gigi
                        $scope.item.mata = data.mata
                        $scope.item.laboratorium = { id: data.laboratorium, lab: data.laboratorium }
                        $scope.item.ekg = { id: data.ekg, ekg: data.ekg }
                        $scope.item.treadmill = { id: data.treadmill, treadmill: data.treadmill }
                        $scope.item.rontgent = { id: data.rontgent, rontgent: data.rontgent }
                        $scope.item.kesimpulan = data.kesimpulan
                        $scope.item.saran = data.saran
                        $scope.item.nomorurut = data.nomorurut
                        $scope.item.nomorsurat = data.nomor3
                        $scope.item.pegawai1 = { id: data.pegawai1fk, namalengkap: data.namalengkap }
                        $scope.item.pegawai2 = { id: data.pegawai2fk, namalengkap: data.namalengkap }
                        $scope.item.pegawai3 = { id: data.pegawai3fk, namalengkap: data.namalengkap }
                        $scope.item.jabatan = { id: data.jabatanfk, namajabatan: data.namajabatan }
                    } else {
                        $scope.norecHPM = ''
                    }
                })
                medifirstService.get('registrasi/laporan/get-hasil-lab-surat?noregistrasi=' + $scope.item.noregistrasi).then(function (dat) {
                    if (dat.data != undefined) {
                        $scope.hasillab = $scope.item.kesimpulan + ". " + dat.data
                    } else {
                        $scope.hasillab = $scope.item.kesimpulan + ". " + "-"
                    }
                });
            }

            function loadHPM2() {
                medifirstService.get('laboratorium/get-hasil-pemeriksaan-berkala?norec_pd=' + $scope.norecpd).then(function (d) {
                    if (d.data.length > 0) {
                        $scope.norecHPM = d.data[0].norec
                    } else {
                        $scope.norecHPM = ''
                    }
                })
            }

            function loadHPM3() {
                medifirstService.get('laboratorium/get-hasil-pemeriksaan-covid?norec_pd=' + $scope.norecpd).then(function (d) {
                    if (d.data.length > 0) {
                        $scope.norecHPM = d.data[0].norec
                    } else {
                        $scope.norecHPM = ''
                    }
                })
            }

            function loadHPM4() {
                medifirstService.get('laboratorium/get-hasil-pemeriksaan-covid-luar-negeri?norec_pd=' + $scope.norecpd).then(function (d) {
                    if (d.data.length > 0) {
                        $scope.norecHPM = d.data[0].norec
                    } else {
                        $scope.norecHPM = ''
                    }
                })
            }

            function lihatNomorUrut() {
                debugger
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm')
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm')

                medifirstService.get('laboratorium/get-nomor?' + "tglAwal=" + tglAwal + "&tglAkhir=" + tglAkhir).then(function (s) {
                    debugger;
                    var data = s.data
                    var datareal = []
                    var datasesungguhnya = []
                    datareal.push(data[0])
                    for (var i = 1; i < data.length; i++) {
                        var podo = false
                        var noregistrasi = data[i].noregistrasi
                        var noregistrasireal = datareal[datareal.length - 1].noregistrasi
                        if (noregistrasi == noregistrasireal) {
                            podo = true
                        }
                        if (podo == false) {
                            datareal.push(data[i])
                        }
                    }
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: datareal,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,

                    });

                })
            }
            $scope.CekNomor = function () {
                $scope.popUpNomor.center().open()
            }
            $scope.columnGrid = {
                scrollable: true,
                selectable: 'row',
                pageable: true,
                columns: [{
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "130px",
                    "template": "<span class='style-left'>#: noregistrasi #</span>"
                },
                {
                    "field": "namapasien",
                    "title": "Nama",
                    "width": "130px",
                    "template": "<span class='style-left'>#: namapasien #</span>"
                },
                {
                    "field": "nomor2",
                    "title": "Nomor Surat",
                    "width": "130px",
                    "template": "<span class='style-left'>#: nomor2 #</span>"
                },
                {
                    "field": "nomorurut",
                    "title": "Nomor Urut",
                    "width": "100px",
                    "template": "<span class='style-left'>#: nomorurut #</span>"
                }
                ]
            }
            $scope.close = function () {
                $scope.popUpNomor.close()
            }

            $scope.CetakSKM = function () {
                debugger
                if ($scope.item.pegawai3.id == 25647) {

                    var user = medifirstService.getPegawaiLogin();
                    var stt = 'false'
                    if (confirm('View Surat Keterangan Medis? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    // var diagnosa ="";
                    // medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.item.noregistrasi).then(function (data) {
                    //     debugger
                    //     if(data.data.datas == undefined)
                    //     {
                    //         diagnosa= "-";
                    //     }else{
                    //        if(data.data.datas[0].namadiagnosa != null){
                    //         diagnosa= data.data.datas[0].namadiagnosa;
                    //        }else
                    //        {
                    //         diagnosa= "-";
                    //        }

                    //     }
                    // });


                    // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                    // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                    // var dokter = $scope.item.DataPegawai
                    // var ruangan = $scope.item.Ruangan.namaruangan;
                    // var dokterPeriksa =  $scope.item.DataPegawaiPemeriksa.namalengkap;
                    // var catatan = "-";
                    // if ($scope.item.catatan != undefined) {
                    //     catatan = $scope.item.catatan;
                    // }
                    // var jumlah = $scope.item.salary2
                    // // var tanggal = $scope.item.tanggal
                    var tanggal = moment($scope.now).format('DD MMM YYYY');
                    var tahun = moment($scope.now).format('YYYY');
                    // var idruangan = $scope.item.ruangan.id
                    var norec = $scope.norecHPM
                    var hasillab = $scope.hasillab


                    // var x= "WHERE (pp.noregistrasifk = '"+ $scope.norecAPD +"')and (pp.norec in ("+$scope.item.norecPP+ ')) and hh.flag is not null'
                    // var y="http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg="+$scope.item.noregistrasi
                    debugger;
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaPasien", "jenisKelamin", "alamat", "umur", "norechpm", "tglcetak", "tahun", "hasillab1"],
                        // , "namaRSS","namaRSSS","tgllahir","alamatRS","printedBy","norecapd","umur","jeniskelamin","tglpelayanan","tglhasil","dokter","ruangan","linkqr","diagnosa","dokterPeriksa","catatan"],
                        "paramValue": [$scope.item.namapasien, $scope.item.jeniskelamin, $scope.item.alamat, $scope.item.umur, norec, tanggal, tahun, hasillab],
                        // "RS BHAYANGKARA TK IV CIANJUR","INSTALASI LABORATORIUM","1980-12-25 00:00:00","Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211, Telp. (0751)8465000, Psw. 177",user.namaLengkap,
                        // x,$scope.item.umurDay,$scope.item.objectjeniskelaminfk,tgl,tglhasil,dokter.namalengkap,ruangan,y,diagnosa.toString(),dokterPeriksa.toString(),catatan],
                        "paramType": ["", "", "", "", "", "", "", ""]
                        // ,"","","date","","","","","","","","","","","","",""]
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
                    if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                        xhr.open('POST', 'http://192.168.100.209:8797/generic/report/suratketeranganmedis2.pdf');
                    } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                        xhr.open('POST', 'http://36.93.6.186:8797/generic/report/suratketeranganmedis2.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/suratketeranganmedis2.pdf');
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
                    // tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                    // var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                    // var statusUpdate =1;
                    // if($scope.item.cekUpdate == true)
                    // {
                    //    statusUpdate = 2
                    // }

                    //    var objSave = {
                    //        norec_pp: editkenNorecPP,
                    //        tanggalPelayanan: tgl,
                    //        tglcetak:tglcetak,
                    //        tglhasil:tglhasil,
                    //        dokterkirim:dokter.id,
                    //        status: statusUpdate
                    //    }

                    //    medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function (data) {
                    //        $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                    //        LoadData()
                    //    });
                } else {
                    var user = medifirstService.getPegawaiLogin();
                    var stt = 'false'
                    if (confirm('View Surat Keterangan Medis? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    // var diagnosa ="";
                    // medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.item.noregistrasi).then(function (data) {
                    //     debugger
                    //     if(data.data.datas == undefined)
                    //     {
                    //         diagnosa= "-";
                    //     }else{
                    //        if(data.data.datas[0].namadiagnosa != null){
                    //         diagnosa= data.data.datas[0].namadiagnosa;
                    //        }else
                    //        {
                    //         diagnosa= "-";
                    //        }

                    //     }
                    // });


                    // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                    // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                    // var dokter = $scope.item.DataPegawai
                    // var ruangan = $scope.item.Ruangan.namaruangan;
                    // var dokterPeriksa =  $scope.item.DataPegawaiPemeriksa.namalengkap;
                    // var catatan = "-";
                    // if ($scope.item.catatan != undefined) {
                    //     catatan = $scope.item.catatan;
                    // }
                    // var jumlah = $scope.item.salary2
                    // // var tanggal = $scope.item.tanggal
                    var tanggal = moment($scope.now).format('DD MMM YYYY');
                    var tahun = moment($scope.now).format('YYYY');
                    // var idruangan = $scope.item.ruangan.id
                    var norec = $scope.norecHPM
                    var hasillab = $scope.hasillab


                    // var x= "WHERE (pp.noregistrasifk = '"+ $scope.norecAPD +"')and (pp.norec in ("+$scope.item.norecPP+ ')) and hh.flag is not null'
                    // var y="http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg="+$scope.item.noregistrasi
                    debugger;
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaPasien", "jenisKelamin", "alamat", "umur", "norechpm", "tglcetak", "tahun", "hasillab1"],
                        // , "namaRSS","namaRSSS","tgllahir","alamatRS","printedBy","norecapd","umur","jeniskelamin","tglpelayanan","tglhasil","dokter","ruangan","linkqr","diagnosa","dokterPeriksa","catatan"],
                        "paramValue": [$scope.item.namapasien, $scope.item.jeniskelamin, $scope.item.alamat, $scope.item.umur, norec, tanggal, tahun, hasillab],
                        // "RS BHAYANGKARA TK IV CIANJUR","INSTALASI LABORATORIUM","1980-12-25 00:00:00","Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211, Telp. (0751)8465000, Psw. 177",user.namaLengkap,
                        // x,$scope.item.umurDay,$scope.item.objectjeniskelaminfk,tgl,tglhasil,dokter.namalengkap,ruangan,y,diagnosa.toString(),dokterPeriksa.toString(),catatan],
                        "paramType": ["", "", "", "", "", "", "", ""]
                        // ,"","","date","","","","","","","","","","","","",""]
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
                    if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                        xhr.open('POST', 'http://192.168.100.209:8797/generic/report/suratketeranganmedis.pdf');
                    } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                        xhr.open('POST', 'http://36.93.6.186:8797/generic/report/suratketeranganmedis.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/suratketeranganmedis.pdf');
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
                    // tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                    // var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                    // var statusUpdate =1;
                    // if($scope.item.cekUpdate == true)
                    // {
                    //    statusUpdate = 2
                    // }

                    //    var objSave = {
                    //        norec_pp: editkenNorecPP,
                    //        tanggalPelayanan: tgl,
                    //        tglcetak:tglcetak,
                    //        tglhasil:tglhasil,
                    //        dokterkirim:dokter.id,
                    //        status: statusUpdate
                    //    }

                    //    medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function (data) {
                    //        $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                    //        LoadData()
                    //    });
                }

            }
            $scope.CetakSKPC = function () {
                debugger
                if ($scope.norecHPM != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-pemeriksaan-covid?norec=" + $scope.norecHPM + '&kdprofile=' + profile +
                            '&jenis=his', '_blank');
                    }
                }
            }

            $scope.CetakRapidLN = function () {
                debugger
                if ($scope.norecHPM != '') {
                    var local = JSON.parse(localStorage.getItem('profile'))
                    if (local != null) {
                        var profile = local.id;
                        window.open(config.baseApiBackend + "report/cetak-pemeriksaan-covid-ln?norec=" + $scope.norecHPM + '&kdprofile=' + profile +
                            '&jenis=his' + '&tgldafta=' + $scope.item.daftar + '&tglambil=' + $scope.item.pengambilan, '_blank');
                    }
                }
            }

            $scope.CetakSPKB = function () {
                var user = medifirstService.getPegawaiLogin();
                var stt = 'false'
                if (confirm('View Surat Pemeriksaan Berkala? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                // var diagnosa ="";
                // medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.item.noregistrasi).then(function (data) {
                //     debugger
                //     if(data.data.datas == undefined)
                //     {
                //         diagnosa= "-";
                //     }else{
                //        if(data.data.datas[0].namadiagnosa != null){
                //         diagnosa= data.data.datas[0].namadiagnosa;
                //        }else
                //        {
                //         diagnosa= "-";
                //        }

                //     }
                // });

                // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                // var dokter = $scope.item.DataPegawai
                // var ruangan = $scope.item.Ruangan.namaruangan;
                // var dokterPeriksa =  $scope.item.DataPegawaiPemeriksa.namalengkap;
                // var catatan = "-";
                // if ($scope.item.catatan != undefined) {
                //     catatan = $scope.item.catatan;
                // }
                // var jumlah = $scope.item.salary2
                // // var tanggal = $scope.item.tanggal
                var tanggal = moment($scope.now).format('DD MMM YYYY');
                var tahun = moment($scope.now).format('YYYY');
                var tglregistrasi = $scope.item.tglregistrasi
                // var idruangan = $scope.item.ruangan.id
                var norec = $scope.norecHPM

                // var x= "WHERE (pp.noregistrasifk = '"+ $scope.norecAPD +"')and (pp.norec in ("+$scope.item.norecPP+ ')) and hh.flag is not null'
                // var y="http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg="+$scope.item.noregistrasi
                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaPasien", "jenisKelamin", "alamat", "umur", "tglcetak", "norec", "tglregistrasi", "tahun"],
                    // , "namaRSS","namaRSSS","tgllahir","alamatRS","printedBy","norecapd","umur","jeniskelamin","tglpelayanan","tglhasil","dokter","ruangan","linkqr","diagnosa","dokterPeriksa","catatan"],
                    "paramValue": [$scope.item.namapasien, $scope.item.jeniskelamin, $scope.item.alamat, $scope.item.umur, tanggal, norec, tglregistrasi, tahun],
                    // "RS BHAYANGKARA TK IV CIANJUR","INSTALASI LABORATORIUM","1980-12-25 00:00:00","Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211, Telp. (0751)8465000, Psw. 177",user.namaLengkap,
                    // x,$scope.item.umurDay,$scope.item.objectjeniskelaminfk,tgl,tglhasil,dokter.namalengkap,ruangan,y,diagnosa.toString(),dokterPeriksa.toString(),catatan],
                    "paramType": ["", "", "", "", "", "", "", ""]
                    // ,"","","date","","","","","","","","","","","","",""]
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
                if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', 'http://192.168.100.209:8797/generic/report/suratpemeriksaanberkala.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', 'http://36.93.6.186:8797/generic/report/suratpemeriksaanberkala.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/suratpemeriksaanberkala.pdf');
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
                // tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                // var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                // var statusUpdate =1;
                // if($scope.item.cekUpdate == true)
                // {
                //    statusUpdate = 2
                // }

                //    var objSave = {
                //        norec_pp: editkenNorecPP,
                //        tanggalPelayanan: tgl,
                //        tglcetak:tglcetak,
                //        tglhasil:tglhasil,
                //        dokterkirim:dokter.id,
                //        status: statusUpdate
                //    }

                //    medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function (data) {
                //        $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                //        LoadData()
                //    });

            }
            $scope.cariNomor = function () {
                debugger
                lihatNomorUrut()
            }
        }
    ])
})