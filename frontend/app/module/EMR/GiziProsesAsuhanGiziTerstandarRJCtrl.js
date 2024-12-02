define(['initialize', 'Configuration'], function(initialize, config) {
    'use strict';
    initialize.controller('GiziProsesAsuhanGiziTerstandarRJCtrl', ['$q', '$scope', 'ModelItem', '$state', 'MedifirstService', '$timeout', 'CacheHelper', '$rootScope','$mdDialog',
        function($q, $scope, ModelItem, $state, medifirstService, $timeout, cacheHelper, $rootScope,$mdDialog) {
            $scope.isRouteLoading = false;
            $scope.item = {
                    tglresume: $scope.now
                } // set defined object
            $scope.isGrid = true
            $scope.isNext = true
            $scope.isTambah=0;
            var noregistrasi = '';
            $scope.item.norec_pp = '';
            // $qrcodedokter = ''
            $scope.statusSelesaiPeriksaPp = false
            $scope.istempatLaporan = true
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false
            $scope.norecAPD = $state.params.noRec
            $scope.isLainnya = false

            
            var data2 = [];

            $scope.isAdult=false
            $scope.isNotAdult=false
            $scope.isFisikKlinis=false

            $scope.pegawaiLogin = JSON.parse(localStorage.getItem('pegawai'))
            var cookie = document.cookie.split(';')
            var kelompokUser = cookie[0].split('=')
            var getCache = cacheHelper.get('cacheRekamMedis')
            debugger
            if (getCache != undefined) {
                $scope.nocm = getCache[0]
                $scope.noregistrasi = getCache[3]
                $scope.norecPd = getCache[8]
                $scope.tglregistrasi = getCache[6]
                $scope.objectpegawaifk = getCache[17]
                $scope.namadokter = getCache[16]
                if (!$scope.norecAPD)
                    $scope.norecAPD = getCache[7]
                $scope.objectruanganfk = getCache[11]
                $scope.namaruangan = getCache[12]
                $scope.item.namaruangan = getCache[12]
            }


            //--ash 03-08-2023---------------------------
            //INIT---------------------------------------
            loadGizi()
            $scope.item.obj = []
            $scope.now = new Date()
            $scope.item.tglpengkajian = $scope.now
            $scope.item.tglpengkajianmeso = $scope.now

            $scope.item.obj[411011] = $scope.now



            function loadRmPp(norec_pp) {
                medifirstService.get("registrasi/daftar-registrasi/get-status-rm-pp?norec_pp=" + norec_pp).then(function(rmpp) {
                    $scope.statusSelesaiPeriksaRm = rmpp.data.isrm;
                });
            }

            
            //ash -- 03-08-2023
            $scope.listAntropometri = [
                    { "id": 1, "nama": "PASIEN USIA <= 18 TAHUN" },
                    { "id": 2, "nama": "PASIEN USIA > 18 TAHUN DAN IBU HAMIL" }
            ]

            $scope.listJenisKelamin = [
                    { "id": 1, "nama": "LAKI-LAKI" },
                    { "id": 2, "nama": "PEREMPUAN" }
            ]

            $scope.listBbHamil = [
                { "id": 1, "nama": "YA" },
                { "id": 2, "nama": "TIDAK" }
            ]            
            
            $scope.listStatusGizi = [
                { "id": 1, "nama": "BURUK" },
                { "id": 2, "nama": "KURANG" },
                { "id": 2, "nama": "BAIK" },
                { "id": 2, "nama": "LEBIH" },
                { "id": 2, "nama": "OBESITAS" }
            ]            

            $scope.listFisikKlinis = [
                    { "id": 1, "nama": "ADA" },
                    { "id": 2, "nama": "TIDAK ADA" }
            ]

            $scope.listAsupanMakanan = [
                    { "id": 1, "nama": "TIDAK ADA" },
                    { "id": 2, "nama": "ADA : ASUPAN MAKAN < 50%" },
                    { "id": 3, "nama": "ADA : ASUPAN MAKAN 50% - 75%" }
            ]        

            $scope.listAlergiMakanan = [
                    { "id": 1, "nama": "YA" },
                    { "id": 2, "nama": "TIDAK" }
            ]
       

            $scope.listPengalamanDiet = [
                { "id": 1, "nama": "YA" },
                { "id": 2, "nama": "TIDAK" }
            ]


            $scope.listFaktorResiko = [
                { "id": 1, "nama": "YA" },
                { "id": 2, "nama": "TIDAK" }
            ]

            $scope.listInteraksiObatMakanan = [
                { "id": 1, "nama": "TIDAK ADA" },
                { "id": 2, "nama": "ADA" }
            ]

            $scope.listBentukMakanan = [
                { "id": 1, "nama": "BIASA" },
                { "id": 2, "nama": "LUNAK" },
                { "id": 2, "nama": "SARING" },
                { "id": 2, "nama": "CAIR" }
            ]


            $scope.listCaraPemeberian = [
                { "id": 1, "nama": "PER ORAL" },
                { "id": 2, "nama": "PER NGT" }
            ]


            $scope.$watch('item.antropometri', function(e) {
                if (e.id == '1') {
                    $scope.isNotAdult = true
                    $scope.isAdult = false
                } else if (e.id == '2') {
                    $scope.isNotAdult = false
                    $scope.isAdult = true
                } else {
                    $scope.isAdult = false
                    $scope.isNotAdult = false
                } 
            })


            $scope.$watch('item.fisikklinis', function(e) {
                if (e.id == '1') {
                    $scope.isFisikKlinis = true
                } else if (e.id == '2') {
                    $scope.isFisikKlinis = false
                } else {
                    $scope.isFisikKlinis = false
                } 
            })

            
            $scope.$watch('item.interaksiobatmakanan', function(e) {
                if (e.id == '1') {
                    $scope.isInteraksiObat = false
                } else if (e.id == '2') {
                    $scope.isInteraksiObat = true
                } else {
                    $scope.isInteraksiObat = false
                } 
            })


            
            $scope.$watch('item.fisikadalainnya', function(e) {
                if (e == true) {
                    $scope.isLainnya = true
                } else {
                    $scope.isLainnya = false
                } 
            })


            function loadGizi() {
                medifirstService.get('emr/get-gizi-pasien?norec=' + $scope.norecPd + '&type=RJ').then(function(dat) {
                    for(let i = 0; i < dat.data.length; i++) {
                        dat.data[i].no = i + 1
                    }
                    $scope.sourceResumeHead = new kendo.data.DataSource({
                        data: dat.data,
                        length: dat.data.length,
                        pageSize: 20
                    });
                })
            }
            function loadObat() {
                //if($scope.modelGrid!=undefined || $scope.modelGrid!=null ) {
                    var norec=""
                    if($scope.modelGrid!=undefined || $scope.modelGrid!="") var norec = $scope.modelGrid.norec
                    else if($scope.norecmeso!=undefined || $scope.norecmeso!="") var norec = $scope.norecmeso
                    
                    if(norec!="") {
                        medifirstService.get('emr/get-obat-pasien?norec=' + norec).then(function(dat) {
                            for(let i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
                            }
                            $scope.dataGridObat = new kendo.data.DataSource({
                                data: dat.data,
                                length: dat.data.length,
                                pageSize: 20
                            });
                        })
                    } else {
                        $scope.dataGridObat = new kendo.data.DataSource({
                            data: "",
                            length: 0,
                            pageSize: 20
                        });

                    }
                //}
            }


            $scope.GridObat = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Monitoring</button>'
                }, ],
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    { field: "no", title: "No", width: 30 },
                    { field: "indikatormonitoring", title: "Indikator Monitoring", width: 200 },
                    { field: "hari1", title: "Hari Ke 1", width: 150 },
                    { field: "hari2", title: "Hari Ke 2", width: 150 },
                    { field: "hari3", title: "Hari Ke 3", width: 150 },
                    { field: "hari4", title: "Hari Ke 4", width: 150 },
                    { field: "hari5", title: "Hari Ke 5", width: 150 },
                    { field: "hari6", title: "Hari Ke 6", width: 150 },
                    { field: "hari7", title: "Hari Ke 7", width: 150 }
                ],

            };
            
            $scope.hapusObat = function() {
                debugger
                if($scope.modelObat==null || $scope.modelObat=='undefined') {
                    toastr.error("Pilih data obat yang akan dihapus");
                    return;
                }

                var item = {
                    "norec": $scope.modelObat.norec
                }

                var confirm = $mdDialog.confirm()
                                    .title('Peringatan')
                                    .textContent('Anda yakin akan menghapus data obat yang dipilih?')
                                    .ariaLabel('Lucky day')
                                    .cancel('Tidak')
                                    .ok('Ya')
                                $mdDialog.show(confirm).then(function () {
                                    medifirstService.post('emr/delete-obat-pasien/delete', item).then(function(e) {                                        
                                        loadObat()
                                    });
                                })

            };


            $scope.tambah = function () {
                if ($scope.item.indikatormonitoring == null || $scope.item.indikatormonitoring == undefined || $scope.item.indikatormonitoring == "") {
                    alert("Indikator Monitoring harus di isi!")
                    return;
                }

                var nomor = 0
                if ($scope.dataGridObat == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no

                            data.indikatormonitoring = $scope.item.indikatormonitoring
                            data.tglhari1 = $scope.item.tglhari1
                            data.hari1 = $scope.item.hari1
                            data.tglhari2 = $scope.item.tglhari2
                            data.hari2 = $scope.item.hari2
                            data.tglhari3 = $scope.item.tglhari3
                            data.hari3 = $scope.item.hari3
                            data.tglhari4 = $scope.item.tglhari4
                            data.hari4 = $scope.item.hari4
                            data.tglhari5 = $scope.item.tglhari5
                            data.hari5 = $scope.item.hari5
                            data.tglhari6 = $scope.item.tglhari6
                            data.hari6 = $scope.item.hari6
                            data.tglhari7 = $scope.item.tglhari7
                            data.hari7 = $scope.item.hari7

                            data2[i] = data;
                            debugger
                            $scope.dataGridObat = new kendo.data.DataSource({
                                data: data2
                            });

                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        indikatormonitoring : $scope.item.indikatormonitoring,
                        tglhari1 : $scope.item.tglhari1,
                        hari1 : $scope.item.hari1,
                        tglhari2 : $scope.item.tglhari2,
                        hari2 : $scope.item.hari2,
                        tglhari3 : $scope.item.tglhari3,
                        hari3 : $scope.item.hari3,
                        tglhari4 : $scope.item.tglhari4,
                        hari4 : $scope.item.hari4,
                        tglhari5 : $scope.item.tglhari5,
                        hari5 : $scope.item.hari5,
                        tglhari6 : $scope.item.tglhari6,
                        hari6 : $scope.item.hari6,
                        tglhari7 : $scope.item.tglhari7,
                        hari7 : $scope.item.hari7
                    }

                    data2.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    debugger
                    $scope.dataGridObat = new kendo.data.DataSource({
                        data: data2
                    });
                }
                //Kosongkan();
                //clear();
            }

            $scope.inputBaru = function() {
                                
                $scope.item.obatobat2 =""
                $scope.item.bentuksediaan ="" 
                $scope.item.obatdicurigai2  =""
                $scope.item.obatrute  =""
                $scope.item.obatdosis  =""
                $scope.item.obattglmulai  =""
                $scope.item.obattglakhir  =""
                $scope.item.obatindikasipenggunaan =""
                $scope.popUpTambah.center().open()
            }
            
            $scope.tutupObat = function() {
                $scope.popUpTambah.close()
            }
            
            function clear() {
                $scope.item = {}

            }

            $scope.hapusGrid = function() {
                
                if($scope.modelGrid==null || $scope.modelGrid=='undefined') {
                    toastr.error("Pilih data yang akan dihapus");
                    return;
                }

                var item = {
                    "norec": $scope.modelGrid.norec
                }

                var confirm = $mdDialog.confirm()
                                    .title('Peringatan')
                                    .textContent('Peringatan, Anda yakin akan menghapus pengkajian yang dipilih?')
                                    .ariaLabel('Lucky day')
                                    .cancel('Tidak')
                                    .ok('Ya')
                                $mdDialog.show(confirm).then(function () {
                                    medifirstService.post('emr/delete-gizi-pasien/delete', item).then(function(e) {
                                        clear()
                                        init();
                                        loadGizi()
                                    });
                                })

            }

            
            $scope.cetakjs = function() {
                
                if($scope.modelGrid==null || $scope.modelGrid=='undefined') {
                    toastr.error("Pilih data yang akan dicetak");
                    return;
                }

                var item = {
                    "norec": $scope.modelGrid.norec
                }


            }


            $scope.editGrid = function() {
                if($scope.modelGrid==null || $scope.modelGrid=='undefined') {
                    toastr.error("Pilih data yang akan diedit");
                    return;
                }

                var norec = $scope.modelGrid.norec

                medifirstService.get('emr/get-hiji-gizi-pasien?norec=' + norec).then(function(dat) {
                    $scope.item.tglpengkajian = dat.data[0].tglpengkajian
                    $scope.item.diagnosamasuk = dat.data[0].diagnosamasuk
                    $scope.item.dietmasuk = dat.data[0].dietmasuk
                    $scope.item.hasillaboratorium = dat.data[0].hasillab
                    $scope.item.kebiasaanmakan = dat.data[0].kebiasaanmakan
                    $scope.item.energi = dat.data[0].recallenergi
                    $scope.item.protein = dat.data[0].recallprotein
                    $scope.item.lemak = dat.data[0].recalllemak
                    $scope.item.karbohidrat = dat.data[0].recallkarbohidrat
                    $scope.item.beratbadan = dat.data[0].beratbadan
                    $scope.item.tinggibadan = dat.data[0].tinggibadan
                    $scope.item.lila = dat.data[0].lila
                    $scope.item.nilaiimt = dat.data[0].nilaiimt
                    $scope.item.bbu = dat.data[0].bbu
                    $scope.item.tbu = dat.data[0].tbu
                    $scope.item.bbtb = dat.data[0].bbtb
                    $scope.item.imtu = dat.data[0].imtu
                    $scope.item.beratbadanB = dat.data[0].beratbadan18
                    $scope.item.tinggibadanB = dat.data[0].tinggibadan18
                    $scope.item.lilaB = dat.data[0].lila18
                    $scope.item.tinggilututB = dat.data[0].tinggilutut
                    $scope.item.bbideal = dat.data[0].bbideal18
                    $scope.item.bbkoreksi = dat.data[0].bbkoreksi18
                    $scope.item.bbsebelumhamil = dat.data[0].bbsebelumhamil18
                    $scope.item.nilaiimtB = dat.data[0].nilaiimt18
                    $scope.item.apoteker = { id: dat.data[0].apotekerfk, nama: dat.data[0].apoteker }
                    $scope.item.diagnosagizi = dat.data[0].diagnosagizi
                    $scope.item.intervensigizi = dat.data[0].intervensigizi
                    $scope.item.diagnosagizi = dat.data[0].diagnosagizi
                    $scope.item.prinsipenergi = dat.data[0].kebutuhanenergi
                    $scope.item.prinsipprotein = dat.data[0].kebutuhanprotein
                    $scope.item.prinsiplemak = dat.data[0].kebutuhanlemak
                    $scope.item.prinsipkarbohidrat = dat.data[0].kebutuhankarbohidrat
                    $scope.item.jenisdiet = dat.data[0].jenisdiet
                    $scope.item.frekuensi = dat.data[0].frekuensi
                    $scope.item.evaluasi = dat.data[0].evaluasi
                    $scope.item.frekuensi = dat.data[0].frekuensi
                    $scope.item.ahligizi = { id: dat.data[0].ahligizifk, nama: dat.data[0].ahligizi }

                    if (dat.data[0].antropometri==1) $scope.item.antropometri = { id: '1', nama: 'PASIEN USIA <= 18 TAHUN' }
                    else if (dat.data[0].antropometri==2) $scope.item.antropometri = { id: '2', nama: 'PASIEN USIA > 18 TAHUN DAN IBU HAMIL' }

                    if (dat.data[0].perubahanbb18==1) $scope.item.bbhamil = { id: '1', nama: 'YA' }
                    else $scope.item.bbhamil = { id: '2', nama: 'TIDAK' }
                    
                    if (dat.data[0].statusgizi18==1) $scope.item.statusgizi = { id: '1', nama: 'BURUK' }
                    else if (data.data[0].statusgizi18==2) $scope.item.statusgizi = { id: '2', nama: 'KURANG' }
                    else if (dat.data[0].statusgizi18==3) $scope.item.statusgizi = { id: '3', nama: 'BAIK' }
                    else if (dat.data[0].statusgizi18==4) $scope.item.statusgizi = { id: '4', nama: 'LEBIH' }
                    else if (dat.data[0].statusgizi18==5) $scope.item.statusgizi = { id: '5', nama: 'OBESITAS' }
                    
                    if (dat.data[0].fisikklinisgizi==1) $scope.item.fisikklinis = { id: '1', nama: 'ADA' }
                    else if (dat.data[0].fisikklinisgizi==2)$scope.item.fisikklinis = { id: '2', nama: 'TIDAK ADA' }

                    $scope.iChecked1 = false
                    $scope.iChecked2 = false
                    $scope.iChecked3 = false
                    $scope.iChecked4 = false
                    $scope.iChecked5 = false
                    $scope.iChecked6 = false
                    $scope.iChecked7 = false
                    $scope.iChecked8 = false
                    $scope.iChecked9 = false
                    $scope.iChecked10 = false
                    $scope.iChecked11 = false

                    if (dat.data[0].mual == true) $scope.iChecked1 = true
                    if (dat.data[0].muntah == true) $scope.iChecked2 = true
                    if (dat.data[0].edema == true) $scope.iChecked3 = true
                    if (dat.data[0].nyeriuluhati == true) $scope.iChecked4 = true
                    if (dat.data[0].anoreksia == true) $scope.iChecked5 = true
                    if (dat.data[0].asites == true) $scope.iChecked6 = true
                    if (dat.data[0].gangguanmenelan == true) $scope.iChecked7 = true
                    if (dat.data[0].gangguanmengunyah == true) $scope.iChecked8 = true
                    if (dat.data[0].konstipasidiare == true) $scope.iChecked9 = true
                    if (dat.data[0].babhitam == true) $scope.iChecked10 = true
                    if (dat.data[0].lainnya == true) $scope.iChecked11 = true

                    if (dat.data[0].perubahanasupanmakanan == 1) $scope.item.asupanmakanan = { id: '1', nama: 'TIDAK ADA' }
                    else if (dat.data[0].perubahanasupanmakanan == 2) $scope.item.asupanmakanan = { id: '2', nama: 'ADA : ASUPAN MAKAN < 50%' }
                    else if (dat.data[0].perubahanasupanmakanan == 3) $scope.item.asupanmakanan = { id: '3', nama: 'ADA : ASUPAN MAKAN 50% - 75%' }

                    if (dat.data[0].alergimakanan == 1) $scope.item.alergimakanan = { id: '1', nama: 'YA' }
                    else if (dat.data[0].alergimakanan == 2) $scope.item.alergimakanan = { id: '2', nama: 'TIDAK' }

                    if (dat.data[0].pengalamandiet == 1) $scope.item.pengalamandiet = { id: '1', nama: 'YA' }
                    else if (dat.data[0].pengalamandiet == 2) $scope.item.pengalamandiet = { id: '2', nama: 'TIDAK' }

                    if (dat.data[0].faktorresikopenyakit == 1) $scope.item.faktorresiko = { id: '1', nama: 'YA' }
                    else if (dat.data[0].faktorresikopenyakit == 2) $scope.item.faktorresiko = { id: '2', nama: 'TIDAK' }

                    if (dat.data[0].interaksiantarobat == 1) $scope.item.interaksiobatmakanan = { id: '1', nama: 'TIDAK ADA' }
                    else if (dat.data[0].interaksiantarobat == 2) $scope.item.interaksiobatmakanan = { id: '2', nama: 'ADA' }
                    
                    if (dat.data[0].bentukmakanan == 1) $scope.item.bentukmakanan = { id: '1', nama: 'BIASA' }
                    else if (dat.data[0].bentukmakanan == 2) $scope.item.bentukmakanan = { id: '2', nama: 'LUNAK' }
                    else if (dat.data[0].bentukmakanan == 3) $scope.item.bentukmakanan = { id: '3', nama: 'SARING' }
                    else if (dat.data[0].bentukmakanan == 4) $scope.item.bentukmakanan = { id: '4', nama: 'CAIR' }

                    if (dat.data[0].carapemberian == 1) $scope.item.carapemberian = { id: '1', nama: 'PER ORAL' }
                    else if (dat.data[0].carapemberian == 2) $scope.item.carapemberian = { id: '2', nama: 'PER NGT' }
                })
                
                loadGizi()

                $scope.isGrid = false
                $scope.isEdit = true
                $scope.isButtonTambah = false
                $scope.isButtonEdit = true
            }


            $scope.simpanObat = function() {
                $scope.norec = ""
                let obatobat = ""
                let idobatobat = ""
                let bentuksediaan = "" 
                let obatdicurigai = "" 
                let idobatdicurigai = "" 
                let obatrute = "" 
                let obatdosis = "" 
                let obattglmulai = "" 
                let obattglakhir = "" 
                let obatindikasipenggunaan = ""
debugger
                if ($scope.item.obatobat2 != undefined) {
                    obatobat = $scope.item.obatobat2
                    //obatobat = $scope.item.obatobat.namaproduk
                    //idobatobat = $scope.item.obatobat.id
                }
                if ($scope.item.bentuksediaan != undefined) {
                    bentuksediaan = $scope.item.bentuksediaan
                }
                if ($scope.item.obatdicurigai2 != undefined) {
                    obatdicurigai = $scope.item.obatdicurigai2
                    /*obatdicurigai = $scope.item.obatdicurigai.namaproduk
                    idobatdicurigai = $scope.item.obatdicurigai.id*/
                }
                if ($scope.item.obatrute != undefined) {
                    obatrute = $scope.item.obatrute
                }
                if ($scope.item.obatdosis != undefined) {
                    obatdosis = $scope.item.obatdosis
                }
                if ($scope.item.obattglmulai != undefined) {
                    obattglmulai = $scope.item.obattglmulai
                }
                if ($scope.item.obattglakhir != undefined) {
                    obattglakhir = $scope.item.obattglakhir
                }
                if ($scope.item.obatindikasipenggunaan != undefined) {
                    obatindikasipenggunaan = $scope.item.obatindikasipenggunaan
                }
                
                
                if ($scope.isTambah==2) {
                    if($scope.modelGrid.norec!=undefined) $scope.norec = $scope.modelGrid.norec
                    else if($scope.norecmeso!=undefined) $scope.norec = $scope.norecmeso
                } else {
                    //-----------------------------------------------
                    let tglpengkajian = ''
                    let eso = 0
                    let penyakitutama = ''
                    let kondisi = ''
                    let jeniskelamin = 0
                    let hamil = 0
                    let gangguanginjal = false
                    let gangguanhati = false
                    let alergi = false
                    let kondisimedis = false
                    let factorindustri = false
                    let kimia = false
                    let tgleso = ''
                    let bentukeso = ''
                    let tindakaneso = ''
                    let reaksieso = 0
                    let asalruangan = 0
                    let apoteker = 0
    debugger
                    if ($scope.item.tglpengkajian != undefined) {
                        tglpengkajian = moment($scope.item.tglpengkajian).format('YYYY-MM-DD HH:mm')
                    }
                    if ($scope.item.obj[411000] != undefined) {
                        eso = $scope.item.obj[411000].id
                    }
                    if ($scope.item.obj[411001] != undefined) {
                        penyakitutama = $scope.item.obj[411001]
                    }
                    if ($scope.item.obj[411002] != undefined) {
                        kondisi = $scope.item.obj[411001].id
                    }
                    if ($scope.item.obj[411003] != undefined) {
                        jeniskelamin = $scope.item.obj[411003].id
                    }
                    if ($scope.item.obj[411004] != undefined) {
                        hamil = $scope.item.obj[411004].id
                    }
                    if ($scope.item.obj[411005] != undefined) {
                        gangguanginjal = $scope.item.obj[411005]
                    }
                    if ($scope.item.obj[411006] != undefined) {
                        gangguanhati = $scope.item.obj[411006]
                    }
                    if ($scope.item.obj[411007] != undefined) {
                        alergi = $scope.item.obj[411007]
                    }
                    if ($scope.item.obj[411008] != undefined) {
                        kondisimedis = $scope.item.obj[411008]
                    }
                    if ($scope.item.obj[411009] != undefined) {
                        factorindustri = $scope.item.obj[411009]
                    }
                    if ($scope.item.obj[411010] != undefined) {
                        kimia = $scope.item.obj[411010]
                    }
                    if ($scope.item.obj[411011] != undefined) {
                        tgleso = moment($scope.item.obj[411011]).format('YYYY-MM-DD hh:mm')
                    }
                    if ($scope.item.obj[411012] != undefined) {
                        bentukeso = $scope.item.obj[411012]
                    }
                    if ($scope.item.obj[411013] != undefined) {
                        tindakaneso = $scope.item.obj[411013]
                    }
                    
                    if ($scope.item.obj[411014] != undefined) {
                        reaksieso = $scope.item.obj[411014].id
                    }
                    if ($scope.item.obj[411015] != undefined) {
                        asalruangan = $scope.item.obj[411015].id
                    }
                    if ($scope.item.obj[411016] != undefined) {
                        apoteker = $scope.item.obj[411016].id
                    }
                    let objSave = {
                        tglpengkajian :tglpengkajian,
                        eso : eso,
                        penyakitutama : penyakitutama,
                        kondisi : kondisi,
                        jeniskelamin : jeniskelamin, 
                        hamil : hamil,
                        gangguanginjal : gangguanginjal,
                        gangguanhati : gangguanhati,
                        alergi : alergi,
                        kondisimedis : kondisimedis,
                        factorindustri : factorindustri,
                        kimia : kimia,
                        tgleso : tgleso,
                        bentukeso : bentukeso,
                        tindakaneso : tindakaneso,
                        reaksieso : reaksieso,
                        asalruangan : asalruangan,
                        apoteker : apoteker,
                        noregistrasifk: $scope.norecPd 
                    }
                    medifirstService.post('emr/save-meso-pasien', objSave).then(function(e) {
                        if (e.status == 201) {
                            $scope.norecmeso=e.data.nilainorec;

                            let objSavex = {
                                norec : e.data.nilainorec,
                                obatobat : obatobat,
                                idobatobat : idobatobat,
                                bentuksediaan : bentuksediaan,
                                obatdicurigai : obatdicurigai, 
                                idobatdicurigai : idobatdicurigai, 
                                obatrute : obatrute, 
                                obatdosis : obatdosis,
                                obattglmulai : obattglmulai,
                                obattglakhir : obattglakhir,
                                obatindikasipenggunaan : obatindikasipenggunaan
                            }
                            medifirstService.post('emr/save-obat-pasien', objSavex).then(function(ex) {
                                if (ex.status == 201) {
                                    loadObat()
                                    $scope.isTambah=2
                                    $scope.isButtonTambah=false
                                    $scope.isButtonUpdate=true
                                    $scope.popUpTambah.close()
                                }
                            })

                        }
                    })
                    $scope.norec=$scope.norecmeso
                    //-----------------------------------------------
                }

                if($scope.isTambah==2) {
                    if($scope.norec != undefined || $scope.norec != null || $scope.norec != "" ) {
                        let objSave = {
                            norec :$scope.norec,
                            obatobat : obatobat,
                            idobatobat : idobatobat,
                            bentuksediaan : bentuksediaan,
                            obatdicurigai : obatdicurigai, 
                            idobatdicurigai : idobatdicurigai, 
                            obatrute : obatrute, 
                            obatdosis : obatdosis,
                            obattglmulai : obattglmulai,
                            obattglakhir : obattglakhir,
                            obatindikasipenggunaan : obatindikasipenggunaan
                        }
                        medifirstService.post('emr/save-obat-pasien', objSave).then(function(e) {
                            if (e.status == 201) {
                                $scope.popUpTambah.close()
                                $scope.isTambah=2
                                loadObat()
                            }
                        })
                    }
                }
            }

            
            
            $scope.simpanGizi = function() {
                let tglpengkajian = ''
                let diagnosamasuk = ''
                let dietmasuk = ''
                let antropometri = 0
                let beratbadan = ''
                let tinggibadan = ''
                let lila = ''
                let nilaiimt = ''
                let bbu = ''
                let tbu = ''
                let bbtb = ''
                let imtu  = ''                
                let beratbadanB = ''
                let tinggibadanB = ''
                let lilaB = ''
                let tinggilututB = ''
                let bbideal = ''
                let bbkoreksi = ''
                let bbsebelumhamil = ''
                let bbhamil = 0
                let nilaiimtB = ''
                let statusgizi = 0
                let hasillaboratorium = ''
                let fisikklinis = 0
                let fisikadamual = false
                let fisikadamuntah = false
                let fisikadaedema = false
                let fisikadauluhati = false
                let fisikadaasites = false
                let fisikadamenelan = false
                let fisikadamengunyah = false
                let fisikadakonstipasidiare = false
                let fisikadababhitam = false
                let fisikadalainnya = false
                let keteranganlainnya = false
                let asupanmakanan = 0
                let kebiasaanmakan = ''
                let energi = ''
                let protein = ''
                let lemak = ''
                let karbohidrat = ''
                let alergimakanan = 0
                let pengalamandiet = 0
                let faktorresiko = 0
                let interaksiobatmakanan = 0           
                let apoteker = 0
                let diagnosagizi = ''
                let intervensigizi = ''
                let prinsipenergi = ''
                let prinsipprotein = ''
                let prinsiplemak = ''
                let prinsipkarbohidrat = ''
                let jenisdiet = ''
                let bentukmakanan = 0
                let carapemberian = 0
                let frekuensi = ''
                let evaluasi = ''
                let ahligizi = 0

                if ($scope.item.tglpengkajian != undefined) {
                    tglpengkajian = moment($scope.item.tglpengkajian).format('YYYY-MM-DD hh:mm')
                }
                if ($scope.item.diagnosamasuk != undefined) {
                    diagnosamasuk = $scope.item.diagnosamasuk
                }
                if ($scope.item.dietmasuk != undefined) {
                    dietmasuk = $scope.item.dietmasuk
                }
                if ($scope.item.antropometri != undefined) {
                    antropometri = $scope.item.antropometri.id
                }
                if ($scope.item.beratbadan != undefined) {
                    beratbadan = $scope.item.beratbadan
                }
                if ($scope.item.tinggibadan != undefined) {
                    tinggibadan = $scope.item.tinggibadan
                }
                if ($scope.item.lila != undefined) {
                    lila = $scope.item.lila
                }
                if ($scope.item.nilaiimt != undefined) {
                    nilaiimt = $scope.item.nilaiimt
                }
                if ($scope.item.bbu != undefined) {
                    bbu = $scope.item.bbu
                }
                if ($scope.item.tbu != undefined) {
                    tbu = $scope.item.tbu
                }
                if ($scope.item.bbtb != undefined) {
                    bbtb = $scope.item.bbtb
                }
                if ($scope.item.imtu != undefined) {
                    imtu = $scope.item.imtu
                }
                if ($scope.item.beratbadanB != undefined) {
                    beratbadanB = $scope.item.beratbadanB
                }
                if ($scope.item.tinggibadanB != undefined) {
                    tinggibadanB = $scope.item.tinggibadanB
                }
                if ($scope.item.lilaB != undefined) {
                    lilaB = $scope.item.lilaB
                }
                if ($scope.item.tinggilututB != undefined) {
                    tinggilututB = $scope.item.tinggilututB
                }
                if ($scope.item.bbideal != undefined) {
                    bbideal = $scope.item.bbideal
                }
                if ($scope.item.bbkoreksi != undefined) {
                    bbkoreksi = $scope.item.bbkoreksi
                }
                if ($scope.item.bbsebelumhamil != undefined) {
                    bbsebelumhamil = $scope.item.bbsebelumhamil
                }
                if ($scope.item.bbhamil != undefined) {
                    bbhamil = $scope.item.bbhamil.id
                }
                if ($scope.item.nilaiimtB != undefined) {
                    nilaiimtB = $scope.item.nilaiimtB
                }
                if ($scope.item.statusgizi != undefined) {
                    statusgizi = $scope.item.statusgizi.id
                }
                if ($scope.item.hasillaboratorium != undefined) {
                    hasillaboratorium = $scope.item.hasillaboratorium
                }
                if ($scope.item.fisikklinis != undefined) {
                    fisikklinis = $scope.item.fisikklinis.id
                }
                if ($scope.item.fisikadamual != undefined) {
                    fisikadamual = $scope.item.fisikadamual
                }
                if ($scope.item.fisikadamuntah != undefined) {
                    fisikadamuntah = $scope.item.fisikadamuntah
                }
                if ($scope.item.fisikadaedema != undefined) {
                    fisikadaedema = $scope.item.fisikadaedema
                }
                if ($scope.item.fisikadauluhati != undefined) {
                    fisikadauluhati = $scope.item.fisikadauluhati
                }
                if ($scope.item.fisikadaasites != undefined) {
                    fisikadaasites = $scope.item.fisikadaasites
                }
                if ($scope.item.fisikadamenelan != undefined) {
                    fisikadamenelan = $scope.item.fisikadamenelan
                }
                if ($scope.item.fisikadamengunyah != undefined) {
                    fisikadamengunyah = $scope.item.fisikadamengunyah
                }
                if ($scope.item.fisikadakonstipasidiare != undefined) {
                    fisikadakonstipasidiare = $scope.item.fisikadakonstipasidiare
                }
                if ($scope.item.fisikadababhitam != undefined) {
                    fisikadababhitam = $scope.item.fisikadababhitam
                }
                if ($scope.item.fisikadalainnya != undefined) {
                    fisikadalainnya = $scope.item.fisikadalainnya
                }
                if ($scope.item.asupanmakanan != undefined) {
                    asupanmakanan = $scope.item.asupanmakanan.id
                }
                if ($scope.item.kebiasaanmakan != undefined) {
                    kebiasaanmakan = $scope.item.kebiasaanmakan
                }
                if ($scope.item.energi != undefined) {
                    energi = $scope.item.energi
                }
                if ($scope.item.protein != undefined) {
                    protein = $scope.item.protein
                }
                if ($scope.item.lemak != undefined) {
                    lemak = $scope.item.lemak
                }
                if ($scope.item.karbohidrat != undefined) {
                    karbohidrat = $scope.item.karbohidrat
                }
                if ($scope.item.alergimakanan != undefined) {
                    alergimakanan = $scope.item.alergimakanan.id
                }
                if ($scope.item.pengalamandiet != undefined) {
                    pengalamandiet = $scope.item.pengalamandiet.id
                }
                if ($scope.item.faktorresiko != undefined) {
                    faktorresiko = $scope.item.faktorresiko.id
                }
                if ($scope.item.interaksiobatmakanan != undefined) {
                    interaksiobatmakanan = $scope.item.interaksiobatmakanan.id
                }
                if ($scope.item.apoteker != undefined) {
                    apoteker = $scope.item.apoteker.id
                }
                if ($scope.item.diagnosagizi != undefined) {
                    diagnosagizi = $scope.item.diagnosagizi
                }
                if ($scope.item.intervensigizi != undefined) {
                    intervensigizi = $scope.item.intervensigizi
                }
                if ($scope.item.prinsipenergi != undefined) {
                    prinsipenergi = $scope.item.prinsipenergi
                }
                if ($scope.item.prinsipprotein != undefined) {
                    prinsipprotein = $scope.item.prinsipprotein
                }
                if ($scope.item.prinsiplemak != undefined) {
                    prinsiplemak = $scope.item.prinsiplemak
                }
                if ($scope.item.prinsipkarbohidrat != undefined) {
                    prinsipkarbohidrat = $scope.item.prinsipkarbohidrat
                }
                if ($scope.item.jenisdiet != undefined) {
                    jenisdiet = $scope.item.jenisdiet
                }
                if ($scope.item.bentukmakanan != undefined) {
                    bentukmakanan = $scope.item.bentukmakanan.id
                }
                if ($scope.item.carapemberian != undefined) {
                    carapemberian = $scope.item.carapemberian.id
                }
                if ($scope.item.frekuensi != undefined) {
                    frekuensi = $scope.item.frekuensi
                }
                if ($scope.item.evaluasi != undefined) {
                    evaluasi = $scope.item.evaluasi
                }
                if ($scope.item.ahligizi != undefined) {
                    ahligizi = $scope.item.ahligizi.id
                }

                let objSave = {
                    noregistrasifk: $scope.norecPd,
                    norec: $scope.modelGrid.norec,
                    tglpengkajian :  tglpengkajian,
                    diagnosamasuk :  diagnosamasuk,
                    dietmasuk :  dietmasuk,
                    antropometri :  antropometri,
                    beratbadan :  beratbadan,
                    tinggibadan :  tinggibadan,
                    lila :  lila,
                    nilaiimt :  nilaiimt,
                    bbu :  bbu,
                    tbu :  tbu,
                    bbtb :  bbtb,
                    imtu :  imtu,
                    
                    beratbadanB :  beratbadanB,
                    tinggibadanB :  tinggibadanB,
                    lilaB :  lilaB,
                    tinggilututB :  tinggilututB,
                    bbideal :  bbideal,
                    bbkoreksi :  bbkoreksi,
                    bbsebelumhamil :  bbsebelumhamil,
                    bbhamil :  bbhamil,
                    nilaiimtB :  nilaiimtB,
                    statusgizi :  statusgizi,

                    hasillaboratorium :  hasillaboratorium,
                    fisikklinis :  fisikklinis,
                    fisikadamual :  fisikadamual,
                    fisikadamuntah :  fisikadamuntah,
                    fisikadaedema :  fisikadaedema,
                    fisikadauluhati :  fisikadauluhati,
                    fisikadaasites :  fisikadaasites,
                    fisikadamenelan :  fisikadamenelan,
                    fisikadamengunyah :  fisikadamengunyah,
                    fisikadababhitam :  fisikadababhitam,
                    fisikadakonstipasidiare :  fisikadakonstipasidiare,
                    fisikadalainnya :  fisikadalainnya,
                    keteranganlainnya :  keteranganlainnya,
                    asupanmakanan :  asupanmakanan,
                    kebiasaanmakan :  kebiasaanmakan,
                    energi :  energi,
                    protein :  protein,
                    lemak :  lemak,
                    karbohidrat :  karbohidrat,
                    alergimakanan : alergimakanan,
                    pengalamandiet :  pengalamandiet,
                    faktorresiko :  faktorresiko,
                    interaksiobatmakanan :  interaksiobatmakanan,
                
                    apoteker :  apoteker,
                    diagnosagizi :  diagnosagizi,
                    intervensigizi :  intervensigizi,
                    prinsipenergi :  prinsipenergi,
                    prinsipprotein :  prinsipprotein,
                    prinsiplemak :  prinsiplemak,
                    prinsipkarbohidrat :  prinsipkarbohidrat,
                    jenisdiet :  jenisdiet,
                    bentukmakanan :  bentukmakanan,
                    
                    carapemberian : carapemberian,
                    frekuensi :  frekuensi,
                    evaluasi :  evaluasi,
                    ahligizi :  ahligizi,
                    type: "RJ"

                }
                medifirstService.post('emr/save-gizi-pasien', objSave).then(function(e) {
                    if (e.status == 201) {                        
                        $scope.isEdit = false
                        $scope.isGrid = true

                        loadGizi()
                        init();
                    }
                })
            }

            
            
            $scope.UpdateMeso = function() {

                let tglpengkajian = ''
                let eso = 0
                let penyakitutama = ''
                let kondisi = ''
                let jeniskelamin = 0
                let hamil = 0
                let gangguanginjal = false
                let gangguanhati = false
                let alergi = false
                let kondisimedis = false
                let factorindustri = false
                let kimia = false
                let tgleso = ''
                let bentukeso = ''
                let tindakaneso = ''
                let reaksieso = 0
                let asalruangan = 0
                let apoteker = 0
                let norec = ''
                if ($scope.item.tglpengkajian != undefined) {
                    tglpengkajian = moment($scope.item.tglpengkajian).format('YYYY-MM-DD hh:mm')
                }
                if ($scope.item.obj[411000] != undefined) {
                    eso = $scope.item.obj[411000].id
                }
                if ($scope.item.obj[411001] != undefined) {
                    penyakitutama = $scope.item.obj[411001]
                }
                if ($scope.item.obj[411002] != undefined) {
                    kondisi = $scope.item.obj[411001].id
                }
                if ($scope.item.obj[411003] != undefined) {
                    jeniskelamin = $scope.item.obj[411003].id
                    
                    if($scope.item.obj[411003].nama=='LAKI-LAKI') hamil = 0;
                }
                if ($scope.item.obj[411004] != undefined) {
                    hamil = $scope.item.obj[411004].id
                }
                if ($scope.item.obj[411005] != undefined) {
                    gangguanginjal = $scope.item.obj[411005]
                }
                if ($scope.item.obj[411006] != undefined) {
                    gangguanhati = $scope.item.obj[411006]
                }
                if ($scope.item.obj[411007] != undefined) {
                    alergi = $scope.item.obj[411007]
                }
                if ($scope.item.obj[411008] != undefined) {
                    kondisimedis = $scope.item.obj[411008]
                }
                if ($scope.item.obj[411009] != undefined) {
                    factorindustri = $scope.item.obj[411009]
                }
                if ($scope.item.obj[411010] != undefined) {
                    kimia = $scope.item.obj[411010]
                }
                if ($scope.item.obj[411011] != undefined) {
                    tgleso = moment($scope.item.obj[411011]).format('YYYY-MM-DD hh:mm')
                }
                if ($scope.item.obj[411012] != undefined) {
                    bentukeso = $scope.item.obj[411012]
                }
                if ($scope.item.obj[411013] != undefined) {
                    tindakaneso = $scope.item.obj[411013]
                }
                
                if ($scope.item.obj[411014] != undefined) {
                    reaksieso = $scope.item.obj[411014].id
                }
                if ($scope.item.obj[411015] != undefined) {
                    asalruangan = $scope.item.obj[411015].id
                }
                if ($scope.item.obj[411016] != undefined) {
                    apoteker = $scope.item.obj[411016].id
                }
                let objSave = {
                    tglpengkajian :tglpengkajian,
                    eso : eso,
                    penyakitutama : penyakitutama,
                    kondisi : kondisi,
                    jeniskelamin : jeniskelamin, 
                    hamil : hamil,
                    gangguanginjal : gangguanginjal,
                    gangguanhati : gangguanhati,
                    alergi : alergi,
                    kondisimedis : kondisimedis,
                    factorindustri : factorindustri,
                    kimia : kimia,
                    tgleso : tgleso,
                    bentukeso : bentukeso,
                    tindakaneso : tindakaneso,
                    reaksieso : reaksieso,
                    asalruangan : asalruangan,
                    apoteker : apoteker,
                    noregistrasifk: $scope.norecPd,
                    norec: $scope.modelGrid.norec 
                }
                medifirstService.post('emr/update-meso-pasien', objSave).then(function(e) {
                    if (e.status == 201) {
                        loadGizi()
                        init();
                    }
                })
            }

            $scope.UpdateGizi = function() {
                let tglpengkajian = ''
                let diagnosamasuk = ''
                let dietmasuk = ''
                let antropometri = 0
                let beratbadan = ''
                let tinggibadan = ''
                let lila = ''
                let nilaiimt = ''
                let bbu = ''
                let tbu = ''
                let bbtb = ''
                let imtu  = ''                
                let beratbadanB = ''
                let tinggibadanB = ''
                let lilaB = ''
                let tinggilututB = ''
                let bbideal = ''
                let bbkoreksi = ''
                let bbsebelumhamil = ''
                let bbhamil = 0
                let nilaiimtB = ''
                let statusgizi = 0
                let hasillaboratorium = ''
                let fisikklinis = 0
                let fisikadamual = false
                let fisikadamuntah = false
                let fisikadaedema = false
                let fisikadauluhati = false
                let fisikadaasites = false
                let fisikadamenelan = false
                let fisikadamengunyah = false
                let fisikadakonstipasidiare = false
                let fisikadababhitam = false
                let fisikadalainnya = false
                let keteranganlainnya = false
                let asupanmakanan = 0
                let kebiasaanmakan = ''
                let energi = ''
                let protein = ''
                let lemak = ''
                let karbohidrat = ''
                let alergimakanan = 0
                let pengalamandiet = 0
                let faktorresiko = 0
                let interaksiobatmakanan = 0           
                let apoteker = 0
                let diagnosagizi = ''
                let intervensigizi = ''
                let prinsipenergi = ''
                let prinsipprotein = ''
                let prinsiplemak = ''
                let prinsipkarbohidrat = ''
                let jenisdiet = ''
                let bentukmakanan = 0
                let carapemberian = 0
                let frekuensi = ''
                let evaluasi = ''
                let ahligizi = 0

                if ($scope.item.tglpengkajian != undefined) {
                    tglpengkajian = moment($scope.item.tglpengkajian).format('YYYY-MM-DD hh:mm')
                }
                if ($scope.item.diagnosamasuk != undefined) {
                    diagnosamasuk = $scope.item.diagnosamasuk
                }
                if ($scope.item.dietmasuk != undefined) {
                    dietmasuk = $scope.item.dietmasuk
                }
                if ($scope.item.antropometri != undefined) {
                    antropometri = $scope.item.antropometri.id
                }
                if ($scope.item.beratbadan != undefined) {
                    beratbadan = $scope.item.beratbadan
                }
                if ($scope.item.tinggibadan != undefined) {
                    tinggibadan = $scope.item.tinggibadan
                }
                if ($scope.item.lila != undefined) {
                    lila = $scope.item.lila
                }
                if ($scope.item.nilaiimt != undefined) {
                    nilaiimt = $scope.item.nilaiimt
                }
                if ($scope.item.bbu != undefined) {
                    bbu = $scope.item.bbu
                }
                if ($scope.item.tbu != undefined) {
                    tbu = $scope.item.tbu
                }
                if ($scope.item.bbtb != undefined) {
                    bbtb = $scope.item.bbtb
                }
                if ($scope.item.imtu != undefined) {
                    imtu = $scope.item.imtu
                }
                if ($scope.item.beratbadanB != undefined) {
                    beratbadanB = $scope.item.beratbadanB
                }
                if ($scope.item.tinggibadanB != undefined) {
                    tinggibadanB = $scope.item.tinggibadanB
                }
                if ($scope.item.lilaB != undefined) {
                    lilaB = $scope.item.lilaB
                }
                if ($scope.item.tinggilututB != undefined) {
                    tinggilututB = $scope.item.tinggilututB
                }
                if ($scope.item.bbideal != undefined) {
                    bbideal = $scope.item.bbideal
                }
                if ($scope.item.bbkoreksi != undefined) {
                    bbkoreksi = $scope.item.bbkoreksi
                }
                if ($scope.item.bbsebelumhamil != undefined) {
                    bbsebelumhamil = $scope.item.bbsebelumhamil
                }
                if ($scope.item.bbhamil != undefined) {
                    bbhamil = $scope.item.bbhamil.id
                }
                if ($scope.item.nilaiimtB != undefined) {
                    nilaiimtB = $scope.item.nilaiimtB
                }
                if ($scope.item.statusgizi != undefined) {
                    statusgizi = $scope.item.statusgizi.id
                }
                if ($scope.item.hasillaboratorium != undefined) {
                    hasillaboratorium = $scope.item.hasillaboratorium
                }
                if ($scope.item.fisikklinis != undefined) {
                    fisikklinis = $scope.item.fisikklinis.id
                }
                if ($scope.item.fisikadamual != undefined) {
                    fisikadamual = $scope.item.fisikadamual
                }
                if ($scope.item.fisikadamuntah != undefined) {
                    fisikadamuntah = $scope.item.fisikadamuntah
                }
                if ($scope.item.fisikadaedema != undefined) {
                    fisikadaedema = $scope.item.fisikadaedema
                }
                if ($scope.item.fisikadauluhati != undefined) {
                    fisikadauluhati = $scope.item.fisikadauluhati
                }
                if ($scope.item.fisikadaasites != undefined) {
                    fisikadaasites = $scope.item.fisikadaasites
                }
                if ($scope.item.fisikadamenelan != undefined) {
                    fisikadamenelan = $scope.item.fisikadamenelan
                }
                if ($scope.item.fisikadamengunyah != undefined) {
                    fisikadamengunyah = $scope.item.fisikadamengunyah
                }
                if ($scope.item.fisikadakonstipasidiare != undefined) {
                    fisikadakonstipasidiare = $scope.item.fisikadakonstipasidiare
                }
                if ($scope.item.fisikadababhitam != undefined) {
                    fisikadababhitam = $scope.item.fisikadababhitam
                }
                if ($scope.item.fisikadalainnya != undefined) {
                    fisikadalainnya = $scope.item.fisikadalainnya
                }
                if ($scope.item.asupanmakanan != undefined) {
                    asupanmakanan = $scope.item.asupanmakanan.id
                }
                if ($scope.item.kebiasaanmakan != undefined) {
                    kebiasaanmakan = $scope.item.kebiasaanmakan
                }
                if ($scope.item.energi != undefined) {
                    energi = $scope.item.energi
                }
                if ($scope.item.protein != undefined) {
                    protein = $scope.item.protein
                }
                if ($scope.item.lemak != undefined) {
                    lemak = $scope.item.lemak
                }
                if ($scope.item.karbohidrat != undefined) {
                    karbohidrat = $scope.item.karbohidrat
                }
                if ($scope.item.alergimakanan != undefined) {
                    alergimakanan = $scope.item.alergimakanan.id
                }
                if ($scope.item.pengalamandiet != undefined) {
                    pengalamandiet = $scope.item.pengalamandiet.id
                }
                if ($scope.item.faktorresiko != undefined) {
                    faktorresiko = $scope.item.faktorresiko.id
                }
                if ($scope.item.interaksiobatmakanan != undefined) {
                    interaksiobatmakanan = $scope.item.interaksiobatmakanan.id
                }
                if ($scope.item.apoteker != undefined) {
                    apoteker = $scope.item.apoteker.id
                }
                if ($scope.item.diagnosagizi != undefined) {
                    diagnosagizi = $scope.item.diagnosagizi
                }
                if ($scope.item.intervensigizi != undefined) {
                    intervensigizi = $scope.item.intervensigizi
                }
                if ($scope.item.prinsipenergi != undefined) {
                    prinsipenergi = $scope.item.prinsipenergi
                }
                if ($scope.item.prinsipprotein != undefined) {
                    prinsipprotein = $scope.item.prinsipprotein
                }
                if ($scope.item.prinsiplemak != undefined) {
                    prinsiplemak = $scope.item.prinsiplemak
                }
                if ($scope.item.prinsipkarbohidrat != undefined) {
                    prinsipkarbohidrat = $scope.item.prinsipkarbohidrat
                }
                if ($scope.item.jenisdiet != undefined) {
                    jenisdiet = $scope.item.jenisdiet
                }
                if ($scope.item.bentukmakanan != undefined) {
                    bentukmakanan = $scope.item.bentukmakanan.id
                }
                if ($scope.item.carapemberian != undefined) {
                    carapemberian = $scope.item.carapemberian.id
                }
                if ($scope.item.frekuensi != undefined) {
                    frekuensi = $scope.item.frekuensi
                }
                if ($scope.item.evaluasi != undefined) {
                    evaluasi = $scope.item.evaluasi
                }
                if ($scope.item.ahligizi != undefined) {
                    ahligizi = $scope.item.ahligizi.id
                }

                let objSave = {
                    tglpengkajian :  tglpengkajian,
                    diagnosamasuk :  diagnosamasuk,
                    dietmasuk :  dietmasuk,
                    antropometri :  antropometri,
                    beratbadan :  beratbadan,
                    tinggibadan :  tinggibadan,
                    lila :  lila,
                    nilaiimt :  nilaiimt,
                    bbu :  bbu,
                    tbu :  tbu,
                    bbtb :  bbtb,
                    imtu :  imtu,                    
                    beratbadanB :  beratbadanB,
                    tinggibadanB :  tinggibadanB,
                    lilaB :  lilaB,
                    tinggilututB :  tinggilututB,
                    bbideal :  bbideal,
                    bbkoreksi :  bbkoreksi,
                    bbsebelumhamil :  bbsebelumhamil,
                    bbhamil :  bbhamil,
                    nilaiimtB :  nilaiimtB,
                    statusgizi :  statusgizi,
                    hasillaboratorium :  hasillaboratorium,
                    fisikklinis :  fisikklinis,
                    fisikadamual :  fisikadamual,
                    fisikadamuntah :  fisikadamuntah,
                    fisikadaedema :  fisikadaedema,
                    fisikadauluhati :  fisikadauluhati,
                    fisikadaasites :  fisikadaasites,
                    fisikadamenelan :  fisikadamenelan,
                    fisikadamengunyah :  fisikadamengunyah,
                    fisikadakonstipasidiare :  fisikadakonstipasidiare,
                    fisikadababhitam :  fisikadababhitam,
                    fisikadalainnya :  fisikadalainnya,
                    keteranganlainnya :  keteranganlainnya,
                    asupanmakanan :  asupanmakanan,
                    kebiasaanmakan :  kebiasaanmakan,
                    energi :  energi,
                    protein :  protein,
                    lemak :  lemak,
                    karbohidrat :  karbohidrat,
                    alergimakanan : alergimakanan,
                    pengalamandiet :  pengalamandiet,
                    faktorresiko :  faktorresiko,
                    interaksiobatmakanan :  interaksiobatmakanan,                
                    apoteker :  apoteker,
                    diagnosagizi :  diagnosagizi,
                    intervensigizi :  intervensigizi,
                    prinsipenergi :  prinsipenergi,
                    prinsipprotein :  prinsipprotein,
                    prinsiplemak :  prinsiplemak,
                    prinsipkarbohidrat :  prinsipkarbohidrat,
                    jenisdiet :  jenisdiet,
                    bentukmakanan :  bentukmakanan,
                    carapemberian : carapemberian,
                    frekuensi :  frekuensi,
                    evaluasi :  evaluasi,
                    ahligizi :  ahligizi,
                    type: "RJ",
                    noregistrasifk: $scope.norecPd,
                    norec: $scope.modelGrid.norec
                }
                medifirstService.post('emr/update-gizi-pasien', objSave).then(function(e) {
                    if (e.status == 201) {
                        loadGizi()
                        init();
                    }
                })
            }

            //tabel asuhan gizi
            $scope.resumeOptHead = {
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    { field: "no", title: "No", width: 40 },
                    { field: "tglpengkajian", title: "Tgl Pengkajian", width: 150 },
                    { field: "diagnosamasuk", title: "Diagnosa Masuk", width: 150 },                    
                    { field: "dietmasuk", title: "Diet Masuk", width: 150 },
                    { field: "namalengkap", title: "Apoteker", width: 150 }
                ],

            };

            
            $scope.batal = function() {
                $scope.popUp.close()
            }
            init();

            $scope.showInput = function() {
                $scope.modelGrid=[]
                $scope.isTambah=1;
                $scope.iChecked1=false;
                $scope.iChecked2=false;
                $scope.iChecked3=false;
                $scope.iChecked4=false;
                $scope.iChecked5=false;
                $scope.iChecked6=false;
                $scope.item = {}
                $scope.item.obj = []
                $scope.now=new Date();
                $scope.item.tglpengkajian = $scope.now
                $scope.item.obj[411011] = $scope.now
                $scope.item.obj[411016] = { id: $scope.objectpegawaifk, nama: $scope.namadokter }
                
                $scope.item.obj[411015] = { id: $scope.objectruanganfk, nama: $scope.namaruangan }
                
                noregistrasi = $scope.noregistrasi
                //$scope.modelGrid=""
                loadObat()
                
                $scope.isEdit = true
                $scope.isGrid = false
                $scope.isButtonTambah = true
                $scope.isButtonEdit = false

                //init();
                //$scope.sourceResume = new kendo.data.DataSource({
                //    data: data2
                //});

            }

            $scope.Back = function() {
                $scope.isEdit = false
                $scope.isGrid = true
                init()
                loadGizi()
            }




            

            function init() {
                debugger
                //$scope.isEdit = false
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-combo-gizi").then(function(e) {
                    $scope.listDokter = e.data.apoteker
                    $scope.listAhliGizi = e.data.ahligizi
                })

            };




            $scope.kembali = function() {
                debugger
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.norecAPD,
                    emr: 'LaporanOperasi',
                });
            }



            function kosongkan() {
                $scope.item.tglpengkajian = ''
                $scope.item.diagnosamasuk = ''
                $scope.item.dietmasuk = ''
                $scope.item.antropometri = 0
                $scope.item.beratbadan = ''
                $scope.item.tinggibadan = ''
                $scope.item.lila = ''
                $scope.item.nilaiimt = ''
                $scope.item.bbu = ''
                $scope.item.tbu = ''
                $scope.item.bbtb = ''
                $scope.item.imtu = ''
                
                $scope.item.beratbadanB = ''
                $scope.item.tinggibadanB = ''
                $scope.item.lilaB = ''
                $scope.item.tinggilututB = ''
                $scope.item.bbideal = ''
                $scope.item.bbkoreksi = ''
                $scope.item.bbsebelumhamil = ''
                $scope.item.bbhamil = 0
                $scope.item.nilaiimtB = ''
                $scope.item.statusgizi = ''

                $scope.item.hasillaboratorium = ''
                $scope.item.fisikklinis = 0
                $scope.item.fisikadamual = 0
                $scope.item.fisikadamuntah = 0
                $scope.item.fisikadaedema = 0
                $scope.item.fisikadauluhati = 0
                $scope.item.fisikadaasites = 0
                $scope.item.fisikadamenelan = 0
                $scope.item.fisikadamengunyah = 0
                $scope.item.fisikadababhitam = 0
                $scope.item.fisikadalainnya = 0
                $scope.item.asupanmakanan = ''
                $scope.item.kebiasaanmakan = ''
                $scope.item.energi = ''
                $scope.item.protein = ''
                $scope.item.lemak = ''
                $scope.item.karbohidrat = ''
                $scope.item.alergimakanan = 0
                $scope.item.pengalamandiet = 0
                $scope.item.faktorresiko = 0
                $scope.item.interaksiobatmakanan = 0
                
                $scope.item.apoteker = 0
                $scope.item.diagnosagizi = ''
                $scope.item.prinsipenergi = ''
                $scope.item.prinsipprotein = ''
                $scope.item.prinsiplemak = ''
                $scope.item.prinsipkarbohidrat = ''
                $scope.item.jenisdiet = ''
                $scope.item.bentukmakanan = ''
                
                $scope.item.carapemberian = 0
                $scope.item.frekuensi = ''
                $scope.item.evaluasi = ''
                $scope.item.ahligizi = 0
                $scope.item.type="RJ"
            }

        }
    ]);
});