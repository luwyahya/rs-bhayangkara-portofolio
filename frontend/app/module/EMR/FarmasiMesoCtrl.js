define(['initialize', 'Configuration'], function(initialize, config) {
    'use strict';
    initialize.controller('FarmasiMesoCtrl', ['$q', '$scope', 'ModelItem', '$state', 'MedifirstService', '$timeout', 'CacheHelper', '$rootScope','$mdDialog',
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
            loadMeso()
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
            $scope.listEfekSamping = [
                    { "id": 1, "nama": "YA" },
                    { "id": 2, "nama": "TIDAK" }
            ]

            $scope.listJenisKelamin = [
                    { "id": 1, "nama": "LAKI-LAKI" },
                    { "id": 2, "nama": "PEREMPUAN" }
            ]

            $scope.listHamil = [
                { "id": 1, "nama": "HAMIL" },
                { "id": 2, "nama": "TIDAK HAMIL" },
                { "id": 3, "nama": "TIDAK TAHU" }
            ]            

            $scope.listKondisi = [
                { "id": 1, "nama": "SEMBUH" },
                { "id": 2, "nama": "MENINGGAL" },
                { "id": 3, "nama": "SEMBUH DENGAN GELAJA SISA" },
                { "id": 4, "nama": "BELUM SEMBUH" },
                { "id": 5, "nama": "TIDAK TAHU" },
            ]
            $scope.listReaksi = [
                    { "id": 1, "nama": "YA" },
                    { "id": 2, "nama": "TIDAK" },
                    { "id": 3, "nama": "TIDAK TAHU" }
            ]

            function loadMeso() {
                medifirstService.get('emr/get-meso-pasien?norec=' + $scope.norecPd).then(function(dat) {
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
                    template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Obat</button>'
                }, ],
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    { field: "no", title: "No", width: 30 },
                    { field: "obat", title: "Nama Obat", width: 100 },
                    { field: "obatsediaan", title: "Bentuk Sediaan", width: 150 },
                    { field: "obatdicurigai", title: "Obat yang Dicurigai Menimbulkan ESO", width: 150 },
                    { field: "rute", title: "Rute", width: 150 },
                    { field: "dosis", title: "Dosis", width: 150 },
                    { field: "tglmulai", title: "Tgl Mulai", width: 150 },
                    { field: "tglakhir", title: "Tgl Akhir", width: 100 },
                    { field: "indikasipenggunaan", title: "Indikasi Penggunaan", width: 100 }
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


            $scope.$watch('item.obj[411003]', function(e) {
                if (e.nama == 'PEREMPUAN') {
                    $scope.isPerempuan = true
                } else {
                    $scope.isPerempuan = false
                } 
            })

            $scope.inputBaru = function() {
                
                if ($scope.item.tglpengkajian == undefined || $scope.item.tglpengkajian == null || $scope.item.tglpengkajian == "") {                    
                    toastr.error("Masukkan tanggal pengkajian");
                    return;
                }
                if ($scope.item.obj[411000] == undefined || $scope.item.obj[411000] == null || $scope.item.obj[411000] == "") {
                    toastr.error("Isi pertanyaan Efek Samping Obat");
                    return;
                }
                if ($scope.item.obj[411001] == undefined || $scope.item.obj[411001] == null || $scope.item.obj[411001] == "") {
                    toastr.error("Masukkan penyakit utama");
                    return;
                }

                if ($scope.item.obj[411003] == undefined || $scope.item.obj[411003] == null || $scope.item.obj[411003] == "") {
                    toastr.error("Masukkan jenis kelamin");
                    return;
                }
                if ($scope.item.obj[411002] == undefined || $scope.item.obj[411002] == null || $scope.item.obj[411002] == "") {
                    toastr.error("Masukkan kondisi");
                    return;
                }
                
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
                                    medifirstService.post('emr/delete-meso-pasien/delete', item).then(function(e) {
                                        clear()
                                        init();
                                        loadMeso()
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
                $scope.norecmeso=""
                $scope.isTambah=2;               
                $scope.item.obj = []
                if($scope.modelGrid==null || $scope.modelGrid=='undefined') {
                    toastr.error("Pilih data yang akan diedit");
                    return;
                }

                var norec = $scope.modelGrid.norec

                medifirstService.get('emr/get-edit-meso-pasien?norec=' + norec).then(function(dat) {
                    $scope.item.tglpengkajian = dat.data[0].tglpengkajian

                    if(dat.data[0].efeksampingobat==1) $scope.item.obj[411000] = { id: '1', nama: 'YA' }
                    else  $scope.item.obj[411000] =  { id: '2', nama: 'TIDAK' }
                    
                    $scope.item.obj[411001] =dat.data[0].penyakitutama

                    if(dat.data[0].kondisi = "1") var kondisi="SEMBUH"
                    else if(dat.data[0].kondisi = "2") var kondisi="MENINGGAL"
                    else if(dat.data[0].kondisi = "3") var kondisi="SEMBUH DENGAN GEJALA SISA"
                    else if(dat.data[0].kondisi = "4") var kondisi="BELUM SEMBUH"
                    else if(dat.data[0].kondisi = "5") var kondisi="TIDAK TAHU"
                    $scope.item.obj[411002] ={ id: '1', nama: 'TIDAK' }

                    if(dat.data[0].jeniskelamin==1) $scope.item.obj[411003] = { id: '1', nama: 'LAKI-LAKI' }
                    else if(dat.data[0].jeniskelamin==2)  $scope.item.obj[411003] =  { id: '2', nama: 'PEREMPUAN' }
             
                    if(dat.data[0].hamil==1) $scope.item.obj[411004] = { id: '1', nama: 'HAMIL' }
                    else if(dat.data[0].hamil==2) $scope.item.obj[411004] = { id: '2', nama: 'TIDAK HAMIL' }
                    else if(dat.data[0].hamil==3) $scope.item.obj[411004] =  { id: '3', nama: 'TIDAK TAHU' }
            
                    $scope.iChecked1=false;
                    $scope.iChecked2=false;
                    $scope.iChecked3=false;
                    $scope.iChecked4=false;
                    $scope.iChecked5=false;
                    $scope.iChecked6=false;
                    
                    if(dat.data[0].gangguanginjal==true) $scope.iChecked1=true
                    if(dat.data[0].gangguanhati==true) $scope.iChecked2=true
                    if(dat.data[0].alergi==true) viChecked3=true
                    if(dat.data[0].kondisimedis==true) $scope.iChecked4=true
                    if(dat.data[0].faktorindustri==true) $scope.iChecked5=true
                    if(dat.data[0].kimia==true) $scope.iChecked6=true

                    $scope.item.obj[411011] =dat.data[0].tgleso
                    $scope.item.obj[411012] =dat.data[0].bentukeso
                    $scope.item.obj[411013] =dat.data[0].tindakaneso

                    if(dat.data[0].reaksieso==1) $scope.item.obj[411014] = { id: '1', nama: 'YA' }
                    else if(dat.data[0].reaksieso==2)  $scope.item.obj[411014] =  { id: '2', nama: 'TIDAK' }
                    else if(dat.data[0].reaksieso==3)  $scope.item.obj[411014] =  { id: '3', nama: 'TIDAK TAHU' }
             

                    $scope.item.obj[411015] = { id: dat.data[0].asalruangan, nama: dat.data[0].ruangan }
                    $scope.item.obj[411016] = { id: dat.data[0].apoteker, nama: dat.data[0].namaapoteker }
                })
                
                loadObat()

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
            
            $scope.simpanMeso = function() {
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
                    noregistrasifk: $scope.norecPd 
                }
                medifirstService.post('emr/save-meso-pasien', objSave).then(function(e) {
                    if (e.status == 201) {
                        //$scope.item.pengkajian = moment($scope.now).format('YYYY-MM-DD hh:mm')
                        //delete $scope.item.obj
                        
                        $scope.isEdit = false
                        $scope.isGrid = true

                        loadMeso()
                        init();
                    }
                })
            }

            
            $scope.simpanMesoTambah = function() {
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
                        $scope.norecmeso=e.nilainorec;
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
                        loadMeso()
                        init();
                    }
                })
            }

            //tabel meso
            $scope.resumeOptHead = {
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    { field: "no", title: "No", width: 40 },
                    { field: "tglpengkajian", title: "Tgl Pengkajian", width: 150 },
                    { field: "ruangan", title: "Ruangan", width: 150 },
                    { field: "penyakitutama", title: "Penyakit Utama", width: 150 },                    
                    { field: "tgleso", title: "Tgl ESO", width: 150 },
                    { field: "apoteker", title: "Apoteker", width: 150 }
                ],

            };

            $scope.data2 = function(dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1
                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        { field: "no", title: "No", width: 40 },
                        { field: "namaobat", title: "Nama Obat", width: 200 },
                        { field: "jumlah", title: "Jumlah", width: 120 },
                        { field: "dosis", title: "Dosis", width: 120 },
                        { field: "frekuensi", title: "Frekuensi", width: 120 },
                        { field: "carapemberian", title: "Cara Pemberian", width: 150 },
                    ]
                }
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
                loadMeso()
            }




            

            function init() {
                debugger
                //$scope.isEdit = false
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-combo-meso").then(function(e) {
                    $scope.listDokter = e.data.dokter
                    $scope.listRuangan = e.data.ruangan
                    //$scope.listobatobat = e.data.dataProduk
                    //$scope.listobatdicurigai = e.data.dataProduk
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
                delete $scope.item.no
                delete $scope.item.namaobat
                delete $scope.item.jumlah
                delete $scope.item.dosis
                delete $scope.item.frekuensi
                delete $scope.item.carapemberian
            }

        }
    ]);
});