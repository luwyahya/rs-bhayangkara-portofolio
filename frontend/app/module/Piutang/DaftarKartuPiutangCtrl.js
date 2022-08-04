define(['initialize'], function(initialize) {
  'use strict';
  initialize.controller('DaftarKartuPiutangCtrl', ['$q', '$scope', 'MedifirstService', 'DateHelper',
        function($q, $scope, medifirstService, dateHelper) {
    	//Inisial Variable
        $scope.isRouteLoading=false;    
        $scope.now = new Date();
        $scope.dataSelected={};
        $scope.item={};
        $scope.monthSelectorOptions = { start: "year",depth: "year" };
        $scope.item.tgl=$scope.now;
        $scope.item.tglawal=$scope.now;
        $scope.item.tglakhir=$scope.now;
        $scope.isRouteLoading=false;
        $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
        $scope.listPeriode=[{id: 1,name: "Per Tanggal"},{id: 2,name: "Per Bulan"}];
        FormLoad()

        function FormLoad(){
            medifirstService.getPart("sysadmin/general/get-datacombo-rekanan", true, true, 20).then(function (data) {
                $scope.listRekanan = data;
            });
        }       

        $scope.klikPeriode=function(ss){
            if(ss.id==1){
                $scope.isDate=true
                $scope.isMonth=false
            }else{
                $scope.isDate=false
                $scope.isMonth=true
            }
        }
        
        $scope.formatRupiah = function(value, currency) {
            return currency  + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        }
        
        $scope.loadData = function(){
            $scope.isRouteLoading = true;
            if($scope.isDate==true){
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59:59');
            }
            if($scope.isMonth==true){
                var tgl = new Date($scope.item.tgl.getFullYear(), $scope.item.tgl.getMonth()+1, 0).getDate();
                var tglAwal = moment($scope.item.tgl).format('YYYY-MM-01 00:00:00');
                var tglAkhir = moment($scope.item.tgl).format('YYYY-MM-'+tgl+' 23:59:59');
            }
            var noPosting = "";
            if($scope.item.noCollect != undefined){
                noPosting = $scope.item.noCollect;
            }
            var idPerusahaan = "";
            if($scope.item.perusahaan != undefined){
                idPerusahaan = $scope.item.perusahaan.id;
            }

            medifirstService.get("piutang/get-daftar-kartupiutang?"
            + "&tglAwal=" + tglAwal
            + "&tglAkhir=" + tglAkhir
            + "&noPosting=" + noPosting
            + "&idPerusahaan=" + idPerusahaan
            , true).then(function(dat){
                $scope.isRouteLoading = false;
                var datas = dat.data[0].data;
                for (var i = 0; i < datas.length; i++) {
                    var no = 0 ;
                    datas[i].no = no+1
                    var tanggal = $scope.now;
                    var tanggalLahir = new Date(datas[i].tglstruk);
                    var umurzz = dateHelper.CountAge(tanggalLahir, tanggal);
                    datas[i].umurzz = umurzz.day + ' hari'
                }
                $scope.dataSource = {
                    data:datas,
                    schema:{
                        model:{
                            fields:{
                                // pasien:{type:"string"},
                                // tglBayar:{type:"string"},
                                // keterangan:{type:"string"},
                                // kps:{type:"string"},
                                // namarekanan:{type:"string"},
                                // piutang:{type:"number"},
                                // bayar:{type:"number"},
                                // adm:{type:"number"},
                                // saldo:{type:"number"},
                            }
                        }
                    },
                    group:[
                        {
                            field:"namarekanan", aggregates:[
                                {field:'sistagihan', aggregate:'sum'}
                            ]                           
                        },                        
                    ],
                    groupable: true,
                    selectable: true,
                    refresh: true,
                    // groupable:true,
                    aggregate:[
                        {field:'sistagihan', aggregate:'sum'}
                    ]

                };                            
            });
        }

        $scope.detailOption = {
            // columns: $scope.columnLapRehab,
            toolbar: "<button type='button' class='k-button' data-toggle='tooltip' title='cetak laporan' style='width:10%' ng-click='cetak()'><i class='fa fa-print'></i>&nbsp;Cetak</button><button type='button' class='k-button' data-toggle='tooltip' title='cetak rekap' style='width:10%' ng-click='cetakRekap()'><i class='fa fa-print'></i>&nbsp;Cetak Rekap</button>",
            columns: [
                // {
                //     field: "no",
                //     title: "No",
                //     width:"45px",
                // },
                {
                    field: "tglstruk",
                    title: "Tgl Verifikasi",
                    width:"85px",
                    template: "#= moment(new Date(tglstruk)).format('DD-MM-YYYY') #",
                },
                {
                    field: "pasien",
                    title: "Nocm / Noregistrasi",
                    width:"150px",
                },
                {
                    field: "namapasien",
                    title: "Nama Pasien",
                    width:"150px",
                },
                {
                    field: "namaruangan",
                    title: "Ruangan",
                    width:"150px",
                },
                {
                    field: "piutang",
                    title: "Piutang",
                    width:"100px",
                    template: "<span class='style-left'>{{formatRupiah('#: piutang #', 'Rp.')}}</span>"
                },
                {
                    field: "totalsudahdibayar",
                    title: "Dibayar",
                    width:"100px",
                    template: "<span class='style-left'>{{formatRupiah('#: totalsudahdibayar #', 'Rp.')}}</span>"
                },
                {
                    field: "administrasi",
                    title: "ADM",
                    width:"50px",
                    template: "<span class='style-left'>{{formatRupiah('#: administrasi #', 'Rp.')}}</span>",
                    // footerTemplate:"Total"
                },
                {
                    field: "sistagihan",
                    title: "Saldo",
                    width:"100px",
                    template: "<span class='style-left'>{{formatRupiah('#: sistagihan #', 'Rp.')}}</span>",
                    // aggregates:["sum"],
                    // groupFooterTemplate:"<span>Rp. {{formatRupiah('#:data.sistagihan.sum  #', '')}}</span>",
                    // footerTemplate:"<span>Rp. {{formatRupiah('#:data.sistagihan.sum  #', '')}}</span>"
                },
                {
                    field: "umurzz",
                    title: "Umur Piutang",
                    width:"120px",
                },
                {
                    hidden: true,
                    field: "namarekanan",
                    title: "Perusahaan",
                    groupHeaderTemplate: "#= value #"
                },
                {
                    hidden: true,
                    field: "namarekanan",
                    title: "Perusahaan",
                    groupHeaderTemplate: "{{('#: value.idrekanan #'}} #= value #"
                }
            ],
            sortable: {
                mode: "single",
                allowUnsort: false,
            },
            pageable:{
                messages: {
                    display: "Menampilkan {2} data"
                    // display: "Menampilkan {0} - {1} data dari {2} data"
                  }
            },
            groupable :{
                field: "namarekanan",
                title: "namarekanan",
                // template: "<span class='style-right'>{{'#: idrekanan #'}} &nbsp;{{'#: namarekanan #'}}</span>",
            }
        }        

        $scope.formatRupiah = function(value, currency) {
            return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
        }

        var HttpClient = function() {
            this.get = function(aUrl, aCallback) {
                var anHttpRequest = new XMLHttpRequest();
                anHttpRequest.onreadystatechange = function() { 
                    if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                        aCallback(anHttpRequest.responseText);
                }

                anHttpRequest.open( "GET", aUrl, true );            
                anHttpRequest.send( null );
            }
        }

        $scope.tglPelayanan = $scope.item.pelayanan;
        $scope.dokter = $scope.item.namaPegawai;
        
        $scope.date = new Date();
        var tanggals = dateHelper.getDateTimeFormatted3($scope.date);

        // Tanggal Inputan
        $scope.tglawal = $scope.item.tglawal;
        $scope.pegawai = medifirstService.getPegawaiLogin();
		
        $scope.cetak = function() {
            if($scope.isDate==true){
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59:59');
            }
            if($scope.isMonth==true){
                var tgl = new Date($scope.item.tgl.getFullYear(), $scope.item.tgl.getMonth()+1, 0).getDate();
                var tglAwal = moment($scope.item.tgl).format('YYYY-MM-01 00:00:00');
                var tglAkhir = moment($scope.item.tgl).format('YYYY-MM-'+tgl+' 23:59:59');
            }
            var noPosting = "";
            if($scope.item.noCollect != undefined){
                noPosting = $scope.item.noCollect;
            }
            var idPerusahaan = "";
            if($scope.item.perusahaan != undefined){
                idPerusahaan = $scope.item.perusahaan.id;
            }
            var stt = 'false'
            if (confirm('View Kartu Piutang Perusahaan? ')){
                // Save it!
                stt='true';
            }else {
                // Do nothing!
                stt='false'
            }
            var client = new HttpClient();        
            client.get('http://127.0.0.1:1237/printvb/Piutang?cetak-KartuPiutangPerusahaanDetail=1&tglAwal='+tglAwal+'&tglAkhir='+tglAkhir+'&strPerusahaan='+idPerusahaan+'&noPosting='+noPosting+'&strIdPegawai='+$scope.dataLogin.namaLengkap+'&view='+ stt, function(response) {
                // do something with response
            }); 
        }
        
	    $scope.cetakRekap = function() {
           if($scope.isDate==true){
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD 00:00:00');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD 23:59:59');
            }
            if($scope.isMonth==true){
                var tgl = new Date($scope.item.tgl.getFullYear(), $scope.item.tgl.getMonth()+1, 0).getDate();
                var tglAwal = moment($scope.item.tgl).format('YYYY-MM-01 00:00:00');
                var tglAkhir = moment($scope.item.tgl).format('YYYY-MM-'+tgl+' 23:59:59');
            }
            var noPosting = "";
            if($scope.item.noCollect != undefined){
                noPosting = $scope.item.noCollect;
            }
            var idPerusahaan = "";
            if($scope.item.perusahaan != undefined){
                idPerusahaan = $scope.item.perusahaan.id;
            }
            var stt = 'false'
            if (confirm('View Rekapitulasi Kartu Piutang Perusahaan? ')){
                // Save it!
                stt='true';
            }else {
                // Do nothing!
                stt='false'
            }
            var client = new HttpClient();        
            client.get('http://127.0.0.1:1237/printvb/Piutang?cetak-RekapKartuPiutangPerusahaan=1&tglAwal='+tglAwal+'&tglAkhir='+tglAkhir+'&strPerusahaan='+idPerusahaan+'&noPosting='+noPosting+'&strIdPegawai='+$scope.dataLogin.namaLengkap+'&view='+ stt, function(response) {
                // do something with response
            });
	   	}   
  
       }
    ]);
});