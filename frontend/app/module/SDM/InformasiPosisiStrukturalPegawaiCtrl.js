define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InformasiPosisiStrukturalPegawaiCtrl', ['$scope', 'MedifirstService', 'DateHelper', 
        function ($scope, medifirstService, dateHelper) {
            //Inisial Variable             
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
                $scope.pegawai = medifirstService.getPegawai();
              
                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function(datas){    
                    var dat = datas.data                                                   
                    $scope.listJabatan = dat.jabatan;         
                });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPegawai= data;
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
                var idJenisPegawai = "";
                if ($scope.item.Jabatan != undefined) {
                    idJenisPegawai = "&JabatanStrukturalfk=" + $scope.item.Jabatan.id;
                }
        
                var idPegawai = "";
                if ($scope.item.namaPegawai != undefined) {
                    idPegawai = "&idPegawai=" + $scope.item.namaPegawai.id;
                }
                
                medifirstService.get("sdm/get-data-urut-informasi-jabatan?"                                       
                    + idJenisPegawai
                    + idPegawai).then(function (data) {
                    $scope.isLoadingData = false;                    
                    var datas = data.data.data;             
                    for (var i = 0; i < datas.length; i++) {
                        datas[i].no = i+1;
                        var umur = dateHelper.CountAge(new Date(datas[i].tgllahir), new Date($scope.now));
                        var bln = umur.month,
                            thn = umur.year,
                            day = umur.day                      
                        umur = thn + 'thn ' + bln + 'bln ' + day + 'hr ';                     
                        datas[i].umur = umur;
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
                    fileName:"InformasiJabatanStrukturalPegawai"+moment($scope.now).format( 'DD/MMM/YYYY'),
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
                        "field": "nippns",
                        "title": "NIP",
                        "width": "100px"
                    },                                       
                    {
                        "field": "namajabatan",
                        "title": "Jabatan",
                        "width": "120px"
                    },
                    {
                        "field": "tgllahir",
                        "title": "Tgl Lahir",
                        "width":"87px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tgllahir #')}}</span>"
                    },
                    {
                        "field": "umur",
                        "title": "Umur",
                        "width": "100px"
                    }
                ]
            }; 

        //* BATAS SUCI *//
        }
    ]);
});