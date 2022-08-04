define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('RegistrasiPasienIsomanLangsungCtrl', ['MedifirstService', '$scope', '$state', '$mdDialog', '$rootScope', 'CacheHelper', 'DateHelper', 'CetakHelper', 'ModelItem',
        function (medifirstService, $scope, $state, $mdDialog, $rootScope, cacheHelper, dateHelper, cetakHelper, ModelItem) {
            $scope.now = new Date();
            $scope.dataItem = {};
            $scope.itemRiwayat = {};
            $scope.currentNoCm = cacheHelper.get('pasien');
            $scope.currentNorec = $state.params.noRec;
            var norecPD = '';
            var noRegistrasis = '';
            var norecAPD = '';
            var isRegisOnline = '';
            var NomorRm = '';
            $scope.isTelemedicine = 'false';
            $scope.isSimpanAsuransi = true;
            $scope.isNext = true;
            $scope.item = {};
            $scope.item.tglRegistrasi = $scope.now;
            $scope.model = {};
            $scope.model.tglSEP = $scope.now;
            $scope.model.tglRujukan = $scope.now;
            $scope.model.tglPelayanan = $scope.now;
            $scope.isDaftarKeDua = false;
            $scope.isLoadEdit = false;
            $scope.istempatLaporan = true;
            $scope.item.tglPositif = moment($scope.now).format('YYYY-MM-DD HH:mm:ss');
            $scope.item.tglIsoman= moment($scope.now).format('YYYY-MM-DD HH:mm:ss');
            $scope.item.tglIsomanSelesai=moment($scope.now).format('YYYY-MM-DD HH:mm:ss');
            $scope.item.tglTestKembali=moment($scope.now).format('YYYY-MM-DD HH:mm:ss');
          
            var datas = [];
            var chacePenunjang = cacheHelper.get('isPenunjang');
            var cacheRegisOnline = cacheHelper.get('CacheRegisOnline');
            if (chacePenunjang != undefined) {
                $scope.isPenunjang = chacePenunjang
                var listruangan = JSON.parse(localStorage.getItem('mapLoginUserToRuangan'))
                $scope.listRuangan = listruangan
            }
            $scope.item.pegawaiLogin = medifirstService.getPegawaiLogin();
            $scope.dataUser = medifirstService.getUserLogin();

            medifirstService.get('registrasi/get-pegawai-use').then(function (e) {
                $scope.listKeluarga = e.data;
                $scope.listpegawai = e.data;
            })
            medifirstService.get("registrasi/get-combo-registrasi").then(function (e){
                $scope.listStatusKeluarga=e.data.hubungankeluarga;
                $scope.listpekerjaan=e.data.pekerjaan;
                $scope.listruangan=e.data.ruangan;
                
            })

            
            function cekPsnDaftarThisMonth(nocm) {
                
                if(nocm != "" && nocm != undefined)
                {
                medifirstService.get('registrasi/get-pasienisoman-satu?nocmfk=' + nocm).then(function (e) {
                    if(e.data.data.length > 0)
                    {
                        $scope.item.tglPositif = moment(e.data.data[0].tglpositif).format('YYYY-MM-DD HH:mm:ss');
                        $scope.item.tglIsoman= moment(e.data.data[0].tglisoman).format('YYYY-MM-DD HH:mm:ss');
                        $scope.item.tglIsomanSelesai=moment(e.data.data[0].tglisomanSelesai).format('YYYY-MM-DD HH:mm:ss');
                        $scope.item.tglTestKembali=moment(e.data.data[0].tgltestlabkembali).format('YYYY-MM-DD HH:mm:ss');
                        $scope.item.namaPegawaiUse = e.data.data[0].namapasien 
                        if(e.data.data[0].statuskaryawan == "Ya" )
                        {
                            $scope.model.ya =true; 
                        }else
                        {
                            $scope.model.tidak =true; 
                        }
                        if(e.data.data[0].statuskeluargakaryawan == "Ya" )
                        {
                            $scope.model.ya1 =true; 
                        }else
                        {
                            $scope.model.tidak1 =true; 
                        }
                        if(e.data.data[0].statuscovid == "Positif" )
                        {
                            $scope.model.positif =true; 
                        }else
                        {
                            $scope.model.negatif =true; 
                        }
                        if(e.data.data[0].hasiltestlab == "Positif" )
                        {
                            $scope.model.positifHasil =true; 
                        }else
                        {
                            $scope.model.negatifHasil =true; 
                        }
                        if(e.data.data[0].idpegawaifk != "0" )
                        {
                            $scope.item.Keluarga = {namalengkap:e.data.data[0].namakeluarga,id:e.data.data[0].idpegawaifk };
                            
                        }
                        if(e.data.data[0].hubungankeluargafk != "0")
                        {
                            $scope.item.setatusKeluarga = {hubungankeluarga:e.data.data[0].hubungankeluarga,id:e.data.data[0].hubungankeluargafk  };
                        }
                        if(e.data.data[0].objectpekerjaanfk != "0" )
                        {
                            $scope.item.pekerjaan = {pekerjaan:e.data.data[0].pekerjaan,id:e.data.data[0].objectpekerjaanfk  };
                        }
                        if(e.data.data[0].objectruanganfk != "0" )
                        {
                            $scope.item.ruanganKerja = {namaruangan:e.data.data[0].namaruangan,id:e.data.data[0].objectruanganfk  };
                        }
                        if(e.data.data[0].pegawai != "0" )
                        {
                            $scope.item.pegawai = {namalengkap:e.data.data[0].namapasien,id:e.data.data[0].idpegawaifksendiri  };
                        }
                        
                    }
                })
                }

            }
           
           
            loadPertama();
           
            function loadPertama() {
                $scope.nocmIgd = cacheHelper.get('CacheRegisTriage')
                

            };
            if (norecPD == '') {
                cekPsnDaftarThisMonth($scope.currentNoCm)
            }
            

            $scope.noCm = $state.params.noCm;
            $scope.cekRawatGabung = function (data) {
                // opsi untuk pasien bayi
                // apakah pasien bayi satu ruangan dengan ibunya (true/false) ?
                $scope.model.rawatGabung = data;
            }
            $scope.formatJam24 = {
                format: "dd-MM-yyyy HH:mm",	//set date format
                timeFormat: "HH:mm",		//set drop down time format to 24 hours
            };

            $scope.pegawai = medifirstService.getPegawaiLogin();

            $scope.listPasien = [];
            $scope.doneLoad = $rootScope.doneLoad;
            $scope.showFind = true;
            $scope.showTindakan = false;
            $scope.dataModelGrid = [];
            $scope.Save = function () {
                
                    $scope.lanjutDaftar()
               

            }
            $scope.lanjutDaftar = function () {
                
                    $scope.SimpanRegistrasi();

            }

            $scope.SimpanRegistrasi = function () {
                debugger
                
                var statuskaryawan ="";
                if($scope.model.ya == true && $scope.model.tidak == undefined)
                {
                    statuskaryawan = "1";
                }else if($scope.model.tidak == true && $scope.model.ya == undefined)
                {
                    statuskaryawan = "2";
                }else{
                    statuskaryawan = "2";
                }
                var statuscovid ="";
                if($scope.model.positif == true && $scope.model.negatif == undefined)
                {
                    statuscovid = "1";
                }else if($scope.model.negatif == true && $scope.model.positif == undefined)
                {
                    statuscovid = "2";
                }else{
                    statuscovid = "2";
                }
                var hasiltestlab ="";
                if($scope.model.positif1 == true && $scope.model.negatif1 == undefined)
                {
                    hasiltestlab = "1";
                }else if($scope.model.negatif1 == true && $scope.model.positif1 == undefined)
                {
                    hasiltestlab = "2";
                }else{
                    hasiltestlab = "2";
                }
                var statuskeluargakaryawan="";
                if($scope.model.ya1 == true)
                {
                    statuskeluargakaryawan = "1";
                }else if($scope.model.tidak1 == true)
                {
                    statuskeluargakaryawan = "2";
                }else{
                    statuskeluargakaryawan = "2";
                }
                var pegawai ="";
                if($scope.item.Keluarga == undefined && $scope.model.ya1 == true || $scope.item.Keluarga == "" && $scope.model.ya1 == true ) 
                {
                    toastr.warning('Pilih Nama Anggota Keluarga Pegawai !!!')
                    return
                }else if($scope.item.Keluarga == undefined)
                {
                    pegawai ="";  
                }
                else{
                    pegawai = $scope.item.Keluarga.id;
                }
                var pekerjaan ="";
                if($scope.item.pekerjaan  == undefined  || $scope.item.pekerjaan == ""  ) 
                {
                    toastr.warning('Pilih Pekerjaan !!!')
                    return
                }else if($scope.item.pekerjaan == undefined)
                {
                    pekerjaan ="";  
                }
                else{
                    pekerjaan = $scope.item.pekerjaan.id;
                }
                var hubungan ="";
                if($scope.item.setatusKeluarga == undefined && $scope.model.ya1 == true || $scope.item.setatusKeluarga == "" && $scope.model.ya1 == true ) 
                {
                    toastr.warning('Pilih Hubungan Keluarga Pegawai !!!')
                    return
                }else if($scope.item.setatusKeluarga == undefined)
                {
                    hubungan ="";  
                }else{
                    hubungan = $scope.item.setatusKeluarga.id;
                }
                var  nocmfksave ="";
                if($scope.item.nocmfk == undefined)
                {
                    if( $scope.currentNoCm !="" && $scope.currentNoCm != null && $scope.currentNoCm != undefined)  
                    {
                        nocmfksave = "";
                    }
                    else{
                        nocmfksave = "kosong";
                    }
                  
                }else{
                    nocmfksave =$scope.item.nocmfk;
                }
                var ruangan ="";
                if($scope.item.ruanganKerja == undefined  || $scope.item.ruanganKerja == "" ) 
                {
                    toastr.warning('Pilih Ruangan !!!')
                    return
                }else if($scope.item.ruanganKerja == undefined)
                {
                    ruangan ="";  
                }else{
                    ruangan = $scope.item.ruanganKerja.id;
                }
                var pegawaiuse ="";
                var namapasien ="";
                if($scope.item.pegawai == undefined  || $scope.item.pegawai == "" ) 
                {
                    toastr.warning('Pilih Hubungan Keluarga Pegawai !!!')
                    return
                }else if($scope.item.pegawai == undefined)
                {
                    pegawaiuse ="";  
                }else{
                    pegawaiuse = $scope.item.pegawai.id;
                    namapasien = $scope.item.pegawai.namalengkap;
                }
                var pasiendaftar = {
                    nocmfk: nocmfksave,
                    statuskaryawan: statuskaryawan,
                    statuskeluargakaryawan : statuskeluargakaryawan,
                    idpegawaifk: pegawai,
                    hubungankeluargafk: hubungan,
                    statuscovid: statuscovid,
                    tglpositif: moment($scope.item.tglPositif).format('YYYY-MM-DD HH:mm:ss'),
                    tglisoman: moment($scope.item.tglIsoman).format('YYYY-MM-DD HH:mm:ss'),
                    tglselesaiisoman: moment($scope.item.tglIsomanSelesai).format('YYYY-MM-DD HH:mm:ss'),
                    tgltestlabkembali: moment($scope.item.tglTestKembali).format('YYYY-MM-DD HH:mm:ss'),
                    hasiltestlab: hasiltestlab,
                    namapasien:namapasien,
                    pekerjaan: pekerjaan,
                    ruangan:ruangan,
                    idpasien:$scope.currentNoCm,
                    pegawaiuse:pegawaiuse
                    
                }
                // id, nocmfk, statuskaryawan, statuskeluargakaryawan, idpegawaifk, hubungankeluargafk,
                //  statuscovid, tglpositif, tglisoman, tglselesaiisoman, tgltestlabkembali, hasiltestlab

                var objSave = {
                    pasiendaftar: pasiendaftar,
                }
                $scope.isSimpan = true;

                medifirstService.post('registrasi/save-pasienisoman', objSave).then(function (e) {
                    $scope.isSimpan = false;
                   

                }, function (error) {
                    // throw error;
                    $scope.isSimpan = false;
                   
                })
            }

          
            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
                    + "&referensi=" + referensi
                    + "&noreff=" + noreff
                    + "&keterangan=" + ket
                ).then(function (data) {

                })
            }



            $scope.formatNum = {
                format: "#.#",
                decimals: 0
            }
            
          
            $scope.columnRiwayatRegistrasi = {
                columns: [
                    {
                        "field": "newno",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "80px",
                        // "template": "<span class='style-left'>{{formatTanggaljam('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "90px"
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruanganan Layanan Asal",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruanganasal #</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruanganan Layanan",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruangan #</span>"
                    },
                    {
                        "field": "namarekanan",
                        "title": "Kelompok Pasien",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namarekanan #</span>"
                    },
                    {
                        "field": "namadokter",
                        "title": "Nama Dokter",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namadokter #</span>"
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "80px",
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "lamarawat",
                        "title": "Lama Dirawat",
                        "width": "80px"
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "statuspulang",
                        "title": "Status Pulang",
                        "width": "100px"
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "isdiagnosis",
                        "title": "Diagnosis",
                        "width": "300px",
                        "template": '# if( isdiagnosis==false) {# - # } else {# #= isdiagnosis # #} #'
                    },
                    {
                        "field": "kesatuanpasien",
                        "title": "Kesatuan Pasien",
                        "width": "100px",
                        "template": '# if( kesatuanpasien==false) {# - # } else {# #= kesatuanpasien # #} #'
                    },
                ]
            };
         

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
          

         

            
           

            $scope.find = function () {
                $state.go('RegistrasiPasienLama');
            }

            $scope.Next = function () {
                $state.go('RegistrasiPasienBaru');
            }

            $scope.pasienBaru = function () {
                // body...
                $state.go("RegistrasiPasienBaru", {
                    noRec: 0,
                    idPasien: 0
                })
            }

          



        
            $scope.Back = function () {
                window.history.back()
            }
          

       

            // Batas */
        }
    ]);
});