define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MonitoringJadwalKerjaRuanganCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper', 
        function (cacheHelper, $scope, medifirstService, dateHelper) {
            //Inisial Variable 
            // MonitoringJadwalKerjaRuanganCtrl
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            FormLoad ();
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

            function FormLoad (){

                $scope.tglPelayanan = $scope.item.pelayanan;
                $scope.dokter = $scope.item.namaPegawai;
                $scope.date = new Date();
                var tanggals = dateHelper.getDateTimeFormatted3($scope.date);

                //Tanggal Default
                $scope.item.tglawal = tanggals + " 00:00";
                $scope.item.tglakhir = tanggals + " 23:59";

                // Tanggal Inputan
                $scope.tglawal = $scope.item.tglawal;
                $scope.tglakhir = $scope.item.tglakhir;
                $scope.pegawai = medifirstService.getPegawai();
              
                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function(dat){                                    
                    $scope.listRuangan = dat.ruangan;                                  
                });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPegawai = data;
                });               
            }                                  

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.Search = function () {
                $scope.isLoadingData = true;
                LoadData();              
            }

            function LoadData() {       

                $scope.isRouteLoading = true;                
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');

                var idRuangan = "";
                if ($scope.item.Ruangan != undefined) {
                    idRuangan = "&idRuangan=" + $scope.item.Ruangan.id;
                }
            
                var idPegawai = "";
                if ($scope.item.namaPegawai != undefined) {
                    idPegawai = "&idPegawai=" + $scope.item.namaPegawai.id;
                }


                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('MonitoringJadwalKerjaRuanganCtrl', chacePeriode);
                medifirstService.get("sdm/get-data-jadwal-kerja-pegawai-ruangan?"                   
                    + idRuangan
                    + idPegawai).then(function (data) {
                    $scope.isLoadingData = false;   
                    var datas = data.data;             
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i+1;
                        // var umur = dateHelper.CountAge(new Date(datas[i].tgllahir), new Date($scope.now));
                        // var bln = umur.month,
                        //     thn = umur.year,
                        //     day = umur.day                      
                        // umur = thn + 'thn ' + bln + 'bln ' + day + 'hr ';                     
                        // datas[i].umur = umur;
                    }
                    
                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                })
            }                    

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }
          
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }

            $scope.formatTanggal = function(tanggal){
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatJam = function(tanggal){
                return moment(tanggal).format('HH:mm');
            }

            $scope.columnLaporan = {

                toolbar:["excel"],
                excel: {
                    fileName:"DataMonitoringAbsensi"+moment($scope.now).format( 'DD/MMM/YYYY'),
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "namalengkap",
                        "title": "Nama Pegawai",
                        "width": "150px",                        
                    },                    
                    {
                        "field": "namashift",
                        "title": "Shift Kerja",
                        "width": "120px"
                    },
                    {
                        "field": "tgljadwal",
                        "title": "Tanggal",
                        "width": "100px"
                    },                    
                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "110px"
                    }
                ]
            }; 

///////////////////////////////////////////////////////////////////////
        }
    ]);
});