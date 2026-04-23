define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('ResumeRICtrl', ['$q', '$scope', 'ModelItem', '$state', 'MedifirstService', '$timeout', 'CacheHelper', '$rootScope',
        function ($q, $scope, ModelItem, $state, medifirstService, $timeout, cacheHelper, $rootScope) {
            $scope.isRouteLoading = false;
            $scope.now = new Date()
            $scope.item = {
                tglresume: $scope.now
            } // set defined object
            // $scope.isGrid = true
            $scope.isNext = true
            $scope.isEdit = true
            $scope.isGrid = false
            $scope.isreaksiobatya = false
            var noregistrasi = '';
            var nocm = '';
            var norecpd = '';
            $scope.item.norec_pp = '';
            // $qrcodedokter = ''
            $scope.statusSelesaiPeriksaPp = false
            $scope.istempatLaporan = true
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false
            var data2 = []
            var dataRO = []
            var datalabstat = []
            var datalab = []
            var datalabs = []
            var dataRow = {}
            var umurDay = '';
            $scope.isfinal = false;
            $scope.isbuttonfinal = true
            var tglpelayanan = ''
            var norecAPD = ''
            var norecPP = ''
            var tglhasil = ''
            var tglcetak = ''
            var ruangan = ''
            var ruanganasal = ''
            var dokterpemeriksa = ''
            var dokterpengirim = ''
            $scope.norec = '-';
            var popc = true;
            let lab = [];
            let rad = [];
            let obat = [];
            let obatpulang = [];
            let tindakan = [];
            let norec_apd = ''
            $scope.penyebab1 = false;
            $scope.penyebab2 = false;
            let ICD10 = [];
            $scope.cc = {};
            var noreckematian = '';
            var nosuratkematian = '';
            SetCacheHelper();
            LoadCombo();
            $scope.norecAPD = $state.params.noRec
            $scope.pegawaiLogin = JSON.parse(localStorage.getItem('pegawai'))
            var cookie = document.cookie.split(';')
            var kelompokUser = cookie[0].split('=')
            var getCache = cacheHelper.get('cacheRekamMedis')
            if (getCache != undefined) {
                $scope.nocm = getCache[0]
                $scope.noregistrasi = getCache[3]
                $scope.norecPd = getCache[8]
                $scope.tglregistrasi = getCache[6]
                $scope.objectpegawaifk = getCache[17]
                $scope.namadokter = getCache[16]
                if (!$scope.norecAPD)
                    $scope.norecAPD = getCache[7]
                $scope.item.namaruangan = getCache[12]
            }
            $scope.prognosislainlain = false
            $scope.kondisikeluarlainlain = false
            $scope.saranalainlain = false
            $scope.keluarrslainlain = false
            $scope.istransport = false
            var tampungdiagnosa=[]

            
            
            //GET OBAT         
            getObat($scope.noregistrasi);
            getObatPulang($scope.noregistrasi); 
                

            function SetCacheHelper() {
                medifirstService.get('emr/get-antrian-pasien-norec/' + $state.params.noRec).then(function (e) {
                    var result = e.data.result
                    $scope.header = result
                    var arrStr = {
                        0: $scope.item.nocm = $scope.header.nocm,
                        1: $scope.item.namapasien = $scope.header.namapasien,
                        2: $scope.item.jeniskelamin = $scope.header.jeniskelamin,
                        3: $scope.item.noregistrasi = $scope.header.noregistrasi,
                        4: $scope.item.umur = $scope.header.umur,
                        5: $scope.item.kelompokpasien = $scope.header.kelompokpasien,
                        6: $scope.item.tglregistrasi = $scope.header.tglregistrasi,
                        7: $scope.header.norec,
                        8: $scope.header.norec_pd,
                        9: $scope.header.objectkelasfk,
                        10: $scope.header.namakelas,
                        11: $scope.header.objectruanganfk,
                        12: $scope.item.namaruangan = $scope.header.namaruangan,
                        13: $scope.checkNoregis,
                        14: $scope.item.tgllahir = moment($scope.header.tgllahir).format('DD-MM-YYYY'),
                        15: $scope.item.alamatlengkap = $scope.header.alamatlengkap,
                        16: $scope.header.dokterdpjp,
                        17: $scope.header.iddpjp,
                        18: $scope.header.tgllahir,
                        19: $scope.header.objectkelompokpasienlastfk,
                        20: $scope.header.golongandarah,
                        21: $scope.item.namarekanan = $scope.header.namarekanan,
                        22: $scope.header.objectrekananfk,
                        23: $scope.header.objectdepartemenfk,
                        24: $scope.item.poliklinik = $scope.header.ruanganterakhir,
                        25: $scope.header.nocmfk,
                        26: $scope.header.objectagamafk,
                        27: $scope.header.agama,
                        28: $scope.header.objectpendidikanfk,
                        29: $scope.header.pendidikan,
                        30: $scope.header.objectpekerjaanfk,
                        31: $scope.header.pekerjaan,
                        32: $scope.item.nik = $scope.header.noidentitas,
                        33: $scope.header.objectjeniskelaminfk,
                        34: $scope.item.tempatlahir = $scope.header.tempatlahir,
                        35: $scope.item.tglpulang = $scope.header.tglpulang,
                        36: $scope.item.notelepon = $scope.header.notelepon
                    }
                    cacheHelper.set('cacheRMelektronik', arrStr);
                    LoadCacheHelper();
                })
            }
            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('cacheRMelektronik');
                if (chacePeriode != undefined) {
                    $scope.cc.nocm = chacePeriode[0]
                    $scope.cc.namapasien = chacePeriode[1]
                    $scope.cc.jeniskelamin = chacePeriode[2]
                    $scope.cc.noregistrasi = chacePeriode[3]
                    $scope.cc.umur = chacePeriode[4]
                    $scope.cc.kelompokpasien = chacePeriode[5]
                    $scope.cc.tglregistrasi = chacePeriode[6]
                    $scope.cc.norec = chacePeriode[7]
                    $scope.cc.norec_pd = chacePeriode[8]
                    $scope.cc.objectkelasfk = chacePeriode[9]
                    $scope.cc.namakelas = chacePeriode[10]
                    $scope.cc.objectruanganfk = chacePeriode[11]
                    $scope.cc.namaruangan = chacePeriode[12]
                    $scope.cc.DataNoregis = chacePeriode[13]
                    $scope.cc.tgllahir = chacePeriode[14]
                    $scope.cc.dpjp = chacePeriode[16]
                    $scope.cc.iddpjp = chacePeriode[17]
                    if ($scope.cc.norec_emr = undefined) {
                        $scope.cc.norec_emr = '-'
                    } else {
                        $scope.cc.norec_emr = '-'
                    }
                    $scope.item.kdKelompokPasien = chacePeriode[19]
                    $scope.cc.namarekanan = chacePeriode[21]
                    $scope.cc.objectrekananfk = chacePeriode[22]
                    $scope.cc.objectdepartemenfk = chacePeriode[23]
                    $scope.cc.noregistrasi2 = chacePeriode[25]
                    $scope.cc.noidentitas = chacePeriode[32]
                    $scope.cc.objectjeniskelaminfk = chacePeriode[33]
                    $scope.cc.tempatlahir = chacePeriode[34]
                    norec_apd = $scope.cc.norec
                    init()
                    $scope.item.dokterpenulis = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap }
                    $scope.item.noregistrasi = $scope.cc.noregistrasi
                }
            }
            function init() {
                $scope.isRouteLoading = true;
                $scope.listKeadaanUmum = [
                    { 'id': 1, 'keadaanumum': 'Baik' }, 
                    { 'id': 2, 'keadaanumum': 'Tampak Sakit Ringan' },
                    { 'id': 3, 'keadaanumum': 'Tampak Sakit Sedang' },
                    { 'id': 4, 'keadaanumum': 'Tampak Sakit Berat' },
                ]
                $scope.listKesadaran = [
                    { kesadaran: "Compos Mentis", id: 1 },
                    { kesadaran: "Apatis", id: 2 },
                    { kesadaran: "Delirium", id: 3 },
                    { kesadaran: "Somnolent", id: 4 },
                    { kesadaran: "Sopor", id: 5 },
                    { kesadaran: "Semi Coma", id: 6 },
                    { kesadaran: "Coma", id: 7 }
                ]
                $scope.listGcsE = [
                    { pfe: "1", id: 1 },
                    { pfe: "2", id: 2 },
                    { pfe: "3", id: 3 },
                    { pfe: "4", id: 4 }
                ];
                $scope.listGcsM = [
                    { pfm: "1", id: 1 },
                    { pfm: "2", id: 2 },
                    { pfm: "3", id: 3 },
                    { pfm: "4", id: 4 },
                    { pfm: "5", id: 5 },
                    { pfm: "6", id: 6 }
                ];
                $scope.listGcsV = [
                    { pfv: "1", id: 1 },
                    { pfv: "2", id: 2 },
                    { pfv: "3", id: 3 },
                    { pfv: "4", id: 4 },
                    { pfv: "5", id: 5 }
                ];
                $q.all([
                    medifirstService.get("emr/get-resume-medis-inap-noregistrasi/" + $scope.noregistrasi)
                ]).then(function (res) {
                    $scope.isRouteLoading = false;
                    // console.log(res[0].statResponse);
                    if (res[0].statResponse) {
                        if (res[0].data.data.length > 0) {
                            debugger
                            var result = res[0].data.data
                            $scope.norec = result[0].norec
                            if ($scope.cc.norec_emr = undefined) {
                                $scope.cc.norec_emr = '-'
                            } else {
                            $scope.cc.norec_emr = result[0].emrpasienfk
                            }
                            //  
                            for (var i = 0; i < result[0].details.length; i++) {
                                if (result[0].details[i].carapemberian == null) {
                                    var dataTemp = { id: "-", text: "-" }
                                } else {
                                    var dataTemp = { id: result[0].details[i].carapemberian, text: result[0].details[i].carapemberian }
                                }
                                result[0].details.carapemberian = dataTemp;
                            }


                            //ash 2023-12-13
                            $scope.item.keluhanutama =result[0].keluhanutama
                            $scope.item.indikasirawatinap =result[0].indikasirawatinap
                            $scope.item.terapipengobatanrumahsakit =result[0].terapipengobatanrumahsakit
                            $scope.item.terapipulang =result[0].terapipulang
                            $scope.item.diagnosaDokter =result[0].diagdok
                            $scope.item.tindakanrm = String(result[0].tindakanrm)
                            $scope.item.alergi =result[0].alergi
                            $scope.item.riwayatPenyakit =result[0].ringkasanriwayatpenyakit
                            $scope.item.alasanrawat =result[0].alasanrawat
                            $scope.item.kesadaran = {'kesadaran' : result[0].kesadaran}
                            $scope.item.keadaanUmum  = result[0].keadaanUmum
                            $scope.item.denyutbefore =result[0].denyutbefor
                            $scope.item.pernafasanbefore =result[0].pernafasanbefore
                            $scope.item.suhubefore =result[0].suhubefore
                            $scope.item.tekanansystolebefore =result[0].tekanansystolebefore
                            $scope.item.tekanandiastolebefore =result[0].tekanandiastolebefore
                            $scope.item.pemeriksaanfisik =result[0].pemeriksaanfisik
                            $scope.item.tglpulang =result[0].tglkeluar
                            $scope.item.isreaksiobatya =result[0].isreaksiobatya
                            $scope.item.isreaksiobattidak =result[0].isreaksiobattidak
                            $scope.item.pfnadi =result[0].pfnadi
                            $scope.item.pfspo =result[0].pfspo
                            $scope.item.pfbb =result[0].pfbb
                            $scope.item.pftb =result[0].pftb
                            $scope.item.pfe ={'pfe' : result[0].pfe}
                            $scope.item.pfm ={'pfm' : result[0].pfm}
                            $scope.item.pfv ={'pfv' : result[0].pfv}
                            $scope.item.temuanPenting = result[0].temuanpenting
                            $scope.item.edukasi = result[0].edukasi
                            if (result[0].isfinal == 1 || result[0].isfinal == true) {
                                $scope.isfinal = true
                                $scope.isbuttonfinal = false
                            }

                            $scope.item.hasilkonsultasi =result[0].hasilkonsultasi
                            $scope.item.reaksiobat =result[0].reaksiobat
                            $scope.item.diet = { 'diet' : result[0].diet }
                            $scope.item.dietkal =result[0].keterangandiet
                            $scope.item.prognosis ={ 'prognosis' : result[0].prognosis }
                            //$scope.item.lainlainprognosis =result[0].alergi
                            $scope.item.kondisikeluar = { 'kondisikeluar' : result[0].kondisiwaktukeluar }
                            $scope.item.carapulang = { 'carapulang' : result[0].carapulang }
                            //$scope.item.lainlainkondisikeluar =result[0].alergi

                            $scope.item.denyutafter =result[0].denyutafter
                            $scope.item.pernafasanafter =result[0].pernafasanafter
                            $scope.item.suhuafter =result[0].suhuafter
                            $scope.item.tekanansystoleafter =result[0].tekanansystoleafter
                            $scope.item.tekanandiastoleafter =result[0].tekanandiastoleafter
                            $scope.item.kesadaranafter =result[0].kesadaranafter
                            $scope.item.ku =result[0].ku
                            $scope.item.kesadaranpulang =result[0].kesadaranpulang
                            $scope.item.tekanandarah =result[0].tekanandarah
                            $scope.item.suhupulang =result[0].suhupulang
                            $scope.item.pernafasanpulang =result[0].pernafasanpulang
                            $scope.item.nadipulang =result[0].nadipulang
                            $scope.item.faskesterdekat =result[0].faskesterdekat
                            $scope.item.pertolonganmendesak =result[0].pertolonganmendesak
                            $scope.item.kebutuhanedukasilainlain =result[0].kebutuhanedukasilainlain
                            $scope.item.pemeriksaanpenunjanglainlain =result[0].pemeriksaanpenunjanglainlain
                            $scope.item.keadaanumumafter = result[0].keadaanumumafter
                            $scope.item.darurat = result[0].keadaandarurat == null ? "IGD RS Bhayangkara Cianjur No. Tlp: (0263) 285299" : result[0].keadaandarurat



                            if( result[0].kondisi == "Pulang atas persetujuan Dokter" ) $scope.item.kondisi = 1;
                            else if( result[0].kondisi == "Pulang atas permintaan Sendiri") $scope.item.kondisi = 2;
                            else if( result[0].kondisi == "Dirujuk Ke") $scope.item.kondisi = 3;
                            else if( result[0].kondisi == "Rawat Inap") $scope.item.kondisi = 4;
                            else if( result[0].kondisi == "Lainnya") $scope.item.kondisi = 4;


                            $scope.item.rencanatindaklanjut = { 'nama' : result[0].kondisi }
                            $scope.item.lainlain =result[0].rencanalain

                            
                            $scope.item.transportasi = { 'transportasi' : result[0].transportasi }
                            $scope.item.transportasilain =result[0].transportasilain
                            $scope.item.dokter = {id: result[0].pegawaifk, namalengkap: result[0].namadokter}

                            if(result[0].iskontrolya == true) { 
                                $scope.item.iskontrolya  = true
                                $scope.iskontrolya  = true
                            }

                            if(result[0].iskontroltidak == true) { 
                                $scope.item.iskontroltidak  = true
                                $scope.iskontroltidak  = true
                            }

                            if(result[0].isreaksiobatya == true) { 
                                $scope.item.isreaksiobatya  = true
                                $scope.isreaksiobatya  = true
                            }

                            if(result[0].isreaksiobattidak == true) { 
                                $scope.item.isreaksiobattidak  = true
                                $scope.isreaksiobattidak  = true
                            }

                            if(result[0].israwatdirumahya == true) { 
                                $scope.item.israwatdirumahya  = true
                                $scope.israwatdirumahya  = true
                            }
                            
                            if(result[0].israwatdirumahtidak == true) { 
                                $scope.item.israwatdirumahtidak  = true
                                $scope.israwatdirumahtidak  = true
                            }

                            if(result[0].isfaskesterdekatya == true) { 
                                $scope.item.isfaskesterdekatya  = true
                                $scope.isfaskesterdekatya  = true
                            }

                            if(result[0].ispengobatanlanjutanya == true) { 
                                $scope.item.ispengobatanlanjutanya  = true
                                $scope.ispengobatanlanjutanya  = true
                            }

                            if(result[0].ispengobatanlukaya == true) { 
                                $scope.item.ispengobatanlukaya  = true
                                $scope.ispengobatanlukaya  = true
                            }

                            if(result[0].isperawatanlanjutanya == true) { 
                                $scope.item.isperawatanlanjutanya  = true
                                $scope.isperawatanlanjutanya  = true
                            }

                            if(result[0].ishomecareya == true) { 
                                $scope.item.ishomecareya  = true
                                $scope.ishomecareya  = true
                            }

                            if(result[0].islaboratoriumya == true) { 
                                $scope.item.islaboratoriumya  = true
                                $scope.islaboratoriumya  = true
                            }

                            if(result[0].isradiologiya == true) { 
                                $scope.item.isradiologiya  = true
                                $scope.isradiologiya  = true
                            }

                            if(result[0].ispemeriksaanpenunjanglainlainya == true) { 
                                $scope.item.ispemeriksaanpenunjanglainlainya  = true
                                $scope.ispemeriksaanpenunjanglainlainya  = true
                            }

                            if(result[0].ispenyakitya == true) { 
                                $scope.item.ispenyakitya  = true
                                $scope.ispenyakitya  = true
                            }

                            if(result[0].isefeksampingobatya == true) { 
                                $scope.item.isefeksampingobatya  = true
                                $scope.isefeksampingobatya  = true
                            }

                            if(result[0].isdietya == true) { 
                                $scope.item.isdietya  = true
                                $scope.isdietya  = true
                            }

                            if(result[0].isaktifitasistirahatya == true) { 
                                $scope.item.isaktifitasistirahatya  = true
                                $scope.isaktifitasistirahatya  = true
                            }

                            if(result[0].ispertolonganmendesakya == true) { 
                                $scope.item.ispertolonganmendesakya  = true
                                $scope.ispertolonganmendesakya  = true
                            }

                            if(result[0].iskebutuhanedukasilainlainya == true) { 
                                $scope.item.iskebutuhanedukasilainlainya  = true
                                $scope.iskebutuhanedukasilainlainya  = true
                            }

                            if(result[0].ishygieneya == true) { 
                                $scope.item.ishygieneya  = true
                                $scope.ishygieneya  = true
                            }

                            if(result[0].isperawatanlukadirumahya == true) { 
                                $scope.item.isperawatanlukadirumahya  = true
                                $scope.isperawatanlukadirumahya  = true
                            }

                            if(result[0].isnyeriya == true) { 
                                $scope.item.isnyeriya  = true
                                $scope.isnyeriya  = true
                            }

                            if(result[0].isperawatanibubayiya == true) { 
                                $scope.item.isperawatanibubayiya  = true
                                $scope.isperawatanibubayiya  = true
                            }

                            if(result[0].isizindokterya == true) { 
                                $scope.item.isizindokterya  = true
                                $scope.isizindokterya  = true
                            }

                            if(result[0].ispindahrslainya == true) { 
                                $scope.item.ispindahrslainya  = true
                                $scope.ispindahrslainya  = true
                            }

                            if(result[0].ispulangsendiriya == true) { 
                                $scope.item.ispulangsendiriya  = true
                                $scope.ispulangsendiriya  = true
                            }

                            if(result[0].ismelarikandiriya == true) { 
                                $scope.item.ismelarikandiriya  = true
                                $scope.ismelarikandiriya  = true
                            }

                            if(result[0].ismeninggalbeforeya == true) { 
                                $scope.item.ismeninggalbeforeya  = true
                                $scope.ismeninggalbeforeya  = true
                            }

                            if(result[0].ismeninggalafterya == true) { 
                                $scope.item.ismeninggalafterya  = true
                                $scope.ismeninggalafterya  = true
                            }

                            if(result[0].ismandiriya == true) { 
                                $scope.item.ismandiriya  = true
                                $scope.ismandiriya  = true
                            }

                            if(result[0].isdibantusetengahya == true) { 
                                $scope.item.isdibantusetengahya  = true
                                $scope.isdibantusetengahya  = true
                            }

                            if(result[0].isdibantupenuhya == true) { 
                                $scope.item.isdibantupenuhya  = true
                                $scope.isdibantupenuhya  = true
                            }

                            if(result[0].iswalkerya == true) { 
                                $scope.item.iswalkerya  = true
                                $scope.iswalkerya  = true
                            }

                            if(result[0].isalatbantulainlainya == true) { 
                                $scope.item.isalatbantulainlainya  = true
                                $scope.isalatbantulainlainya  = true
                            }

                            if(result[0].istidakadaalatkesehatanya == true) { 
                                $scope.item.istidakadaalatkesehatanya  = true
                                $scope.istidakadaalatkesehatanya  = true
                            }

                            if(result[0].isivcateterya == true) { 
                                $scope.item.isivcateterya  = true
                                $scope.isivcateterya  = true
                            }

                            if(result[0].isdobellumenya == true) { 
                                $scope.item.isdobellumenya  = true
                                $scope.isdobellumenya  = true
                            }

                            if(result[0].isngtya == true) { 
                                $scope.item.isngtya  = true
                                $scope.isngtya  = true
                            }

                            if(result[0].isoksigenya == true) { 
                                $scope.item.isoksigenya  = true
                                $scope.isoksigenya  = true
                            }

                            if(result[0].iscateterurineya == true) { 
                                $scope.item.iscateterurineya  = true
                                $scope.iscateterurineya  = true
                            }

                            if(result[0].isalatkesehatanlainlainya == true) { 
                                $scope.item.isalatkesehatanlainlainya  = true
                                $scope.isalatkesehatanlainlainya  = true
                            }

                            $scope.item.kontrolpoli  = { 'kontrolpoli' : result[0].kontrolpoli }
                            $scope.item.tglkontrolpoli  = result[0].tglkontrolpoli
                            $scope.item.dokterpenulis = { id: result[0].penulisfk, namalengkap: result[0].penulis }
                            $scope.item.dokter ={ 'id' : result[0].pegawaifk, 'namalengkap' : result[0].namadokter }
                            // loadAll();
                            loadTempResume();
                            getObat($scope.cc.noregistrasi)
                            getObatPulang($scope.cc.noregistrasi)
                            getReaksiObat()
                        } else {
                            $scope.item.darurat = "IGD RS Bhayangkara TK. IV Cianjur No. Tlp: (0263) 285299"
                            // loadAll();
                            getReaksiObat()
                            loadDaftarRmPp($scope.cc.noregistrasi)
                            // getVitalSignTerakhir($scope.cc.noregistrasi);
                            getValueTriaseIgd($scope.cc.noregistrasi)
                            $scope.item.diet = { id: 3, diet: 'Diet Biasa' }
                            $scope.item.kondisikeluar = { id: 3, kondisikeluar: "Perbaikan" },
                            $scope.item.carapulang = { id: 1, carapulang: "Izin Dokter (Pulang Atas Indikasi Medis)" }
                        }

                        // medifirstService.get('emr/get-value-from-cppt-dok?noRegistrasi=' + $scope.cc.noregistrasi)
                        // .then(function(dat) {
                        //     console.log(dat.data.data);
                        //     if (dat.data.data.length > 0) {
                        //         for(let i = 0; i < dat.data.data.length; i++) {
                        //             if (dat.data.data[i].emrdfk == 853) {
                        //                 $scope.item.diagnosaDokter = dat.data.data[i].value
                        //             }
                        //         }
                        //     }
                        // })

                        // if (result.length > 0) {
                        //     for (let index = 0; index < result.length; index++) {
                        //         result[index].no = index + 1
                        //     }
                        // }

                        // $scope.sourceResumeHead = new kendo.data.DataSource({
                        //     // data: result,
                        //     // pageSize: 20,

                        //     data: result,
                        //     _data: result,
                        //     // pageSize: 10,
                        //     selectable: true,
                        //     refresh: true,
                        //     total: result.length,
                        //     serverPaging: false,

                        // });
                    }
                    // loadAll()
                    $scope.isRouteLoading = false;
                }, (error) => {
                    $scope.isRouteLoading = false;
                    throw error;
                })
                // loadAll();
            };
            // function loadTempResume() {
            //     medifirstService.get('emr/get-temp-resume-ri?norec_resume=' + $scope.norec + "&noregistrasi=" + $scope.cc.noregistrasi).then(function(dat) {
            //         debugger
            //         // obat = dat.data.obat
            //         lab = dat.data.lab
            //         rad = dat.data.rad
            //         // obatpulang = dat.data.obatpulang
            //         $scope.dataGridLaborat = {
            //             data: dat.data.lab,
            //             // pageSize: 10,
            //             selectable: true,
            //             refresh: true,
            //             total: dat.data.lab.length,
            //             serverPaging: false,
            //             aggregate: [
            //                 { field: 'total', aggregate: 'sum' },
            //             ]
            //         };
            //         for(let i = 0; i < dat.data.rad.length; i++) {
            //             if (dat.data.rad[i].hr_norec != null) {
            //                 dat.data.rad[i].flagrad = 'Ada';
            //             } else {
            //                 dat.data.rad[i].flagrad = 'Tidak Ada';
            //             }
            //         }
            //         $scope.dataGridRadiologi = {
            //             data: dat.data.rad,
            //             // pageSize: 10,
            //             selectable: true,
            //             refresh: true,
            //             total: dat.data.rad.length,
            //             serverPaging: false,
            //             aggregate: [
            //                 { field: 'total', aggregate: 'sum' },
            //             ]
            //         };
            //         loadDiagnosa($scope.cc.noregistrasi);
            //     })
            // }
            function LoadCombo() {
                medifirstService.get("emr/get-combo").then(function (e) {
                    $scope.listDokter = e.data.dokter
                    $scope.listReouteFarmasi = e.data.reouteFarmasi
                })
                $scope.isLoadingDiagnosis = true;
                medifirstService.getPart("emr/get-combo-icd9", true, true, 10).then(function (data) {
                    $scope.listDiagnosaTindakan = data;
                });
                medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
                medifirstService.get('emr/get-combo-diagnosis').then(function (data) {
                    $scope.listJenisDiagnosa = data.data.jenisdiagnosa;
                });
            }

            

            //## Start get pengkajian medis ranap ##//
            function getFromPengkajianMedisRanap(noregistrasi) {
                medifirstService.get('emr/get-pengkajian-awal-medis-ranap?noRegistrasi=' + noregistrasi).then(function (dat) {
                    let pengkajianmedis = dat.data
                    let pemeriksaanfisik = '';
                    if (pengkajianmedis.length > 0) {
                        for (let i = 0; i < pengkajianmedis.length; i++) {
                            if (pengkajianmedis[i].emrdfk == 1238) {
                                $scope.item.keluhanutama = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 2586) {
                                $scope.item.alergi = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 1240) {
                                $scope.item.riwayatPenyakit = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 1168) {
                                $scope.item.kesadaran = {kesadaran: pengkajianmedis[i].value}
                            }
                            if (pengkajianmedis[i].emrdfk == 1258) {
                                 
                                $scope.item.keadaanUmum = {id: 1, keadaanumum: pengkajianmedis[i].value}
                            }
                            if (pengkajianmedis[i].emrdfk == 1170) {
                                $scope.item.denyutbefore = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 1173) {
                                $scope.item.pernafasanbefore = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 1172) {
                                $scope.item.suhubefore = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 1172) {
                                $scope.item.suhubefore = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 1169) {
                                let str = pengkajianmedis[i].value
                                let res = str.split("/");
                                $scope.item.tekanansystolebefore = res[0]
                                $scope.item.tekanandiastolebefore = res[1]
                            }
                            if (pengkajianmedis[i].emrdfk == 1245) {//kepala dan leher
                                pemeriksaanfisik += pengkajianmedis[i].value + "\n";
                            }
                            // if (pengkajianmedis[i].emrdfk == 1245) {
                            //     let originalValue = pengkajianmedis[i].value;
                            //     let replacedValue = originalValue.replace("Pemeriksaan Fisik :", "Kepala dan Leher :");
                            //     pemeriksaanfisik += replacedValue + "\n";
                            // }
                            if (pengkajianmedis[i].emrdfk == 1246) { //dada dan punggung
                                pemeriksaanfisik += pengkajianmedis[i].value + "\n";
                            }
                            if (pengkajianmedis[i].emrdfk == 1247) { //paru
                                pemeriksaanfisik += pengkajianmedis[i].value + "\n";
                            }
                            if (pengkajianmedis[i].emrdfk == 1248) { //jantung
                                pemeriksaanfisik += pengkajianmedis[i].value + "\n";
                            }
                            if (pengkajianmedis[i].emrdfk == 1249) { //perut dan pinggang
                                pemeriksaanfisik += pengkajianmedis[i].value + "\n";
                            }
                            if (pengkajianmedis[i].emrdfk == 1250) { //ANGGOTA GERAK
                                pemeriksaanfisik += pengkajianmedis[i].value + "\n";
                            }
                            if (pengkajianmedis[i].emrdfk == 1251) { //GENITALIA DAN ANUS
                                pemeriksaanfisik += pengkajianmedis[i].value + "\n";
                            }
                        }
                        $scope.item.pemeriksaanfisik = pemeriksaanfisik;
                    } else {
                        toastr.error('Pengkajian Medis Tidak Ada')
                        return
                    }
                });
            };
            //## End get pengkajian medis ranap ##//

            
            //## Start get pengkajian medis ranap anak ##//
            function getFromPengkajianMedisRanapAnak(noregistrasi) {
                medifirstService.get('emr/get-pengkajian-awal-medis-ranap-anak?noRegistrasi=' + noregistrasi).then(function (dat) {
                    let pengkajianmedis = dat.data
                    let pemeriksaanfisik = '';
                    if (pengkajianmedis.length > 0) {
                        for (let i = 0; i < pengkajianmedis.length; i++) {
                            if (pengkajianmedis[i].emrdfk == 4729) {
                                $scope.item.keluhanutama = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 4734) {
                                $scope.item.alergi = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 4730) {
                                $scope.item.riwayatPenyakit = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 4767) {
                                $scope.item.kesadaran = {kesadaran: pengkajianmedis[i].value}
                            }
                            if (pengkajianmedis[i].emrdfk == 4768) {
                                 
                                $scope.item.keadaanUmum = {id: 1, keadaanumum: pengkajianmedis[i].value}
                            }
                            if (pengkajianmedis[i].emrdfk == 4765) {
                                $scope.item.denyutbefore = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 4763) {
                                $scope.item.pernafasanbefore = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 4764) {
                                $scope.item.suhubefore = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 4762) {
                                let str = pengkajianmedis[i].value
                                let res = str.split("/");
                                $scope.item.tekanansystolebefore = res[0]
                                $scope.item.tekanandiastolebefore = res[1]
                            } 
                            if (pengkajianmedis[i].emrdfk == 4774) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4775) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Kepala : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4776) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4777) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4778) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Leher : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4779) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4780) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4781) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Thorax : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4782) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4783) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4784) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Abdomen : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4785) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4786) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4787) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Extremitas : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4788) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4789) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4790) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Genitalia : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4791) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4792) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4793) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Anus : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4794) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4795) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4796) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Pemeriksaan Neurologis : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4797) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4798) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4799) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Kulit : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4800) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            }
                        }
                        if (pemeriksaanfisik == '') {
                            $scope.item.pemeriksaanFisik = 'Tidak Ada Kelainan'
                        } else {
                            $scope.item.pemeriksaanFisik = pemeriksaanfisik
                        }
                    } else {
                        toastr.error('Pengkajian Medis Tidak Ada')
                        return
                    }
                });
            };
            //## End get pengkajian medis ranap anak ##//
            
            //## Start get pengkajian medis ranap saraf ##//
            function getFromPengkajianMedisRanapSaraf(noregistrasi) {
                medifirstService.get('emr/get-pengkajian-awal-medis-ranap-saraf?noRegistrasi=' + noregistrasi).then(function (dat) {
                    let pengkajianmedis = dat.data
                    let pemeriksaanfisik = '';
                    if (pengkajianmedis.length > 0) {
                        for (let i = 0; i < pengkajianmedis.length; i++) {
                            if (pengkajianmedis[i].emrdfk == 4644) {
                                $scope.item.keluhanutama = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 4670) {
                                $scope.item.alergi = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 4645) {
                                $scope.item.riwayatPenyakit = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 4652) {
                                $scope.item.kesadaran = {kesadaran: pengkajianmedis[i].value}
                            }
                            if (pengkajianmedis[i].emrdfk == 4653) {
                                 
                                $scope.item.keadaanUmum = {id: 1, keadaanumum: pengkajianmedis[i].value}
                            }
                            if (pengkajianmedis[i].emrdfk == 4650) {
                                $scope.item.denyutbefore = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 4648) {
                                $scope.item.pernafasanbefore = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 4649) {
                                $scope.item.suhubefore = pengkajianmedis[i].value
                            }
                            if (pengkajianmedis[i].emrdfk == 4647) {
                                let str = pengkajianmedis[i].value
                                let res = str.split("/");
                                $scope.item.tekanansystolebefore = res[0]
                                $scope.item.tekanandiastolebefore = res[1]
                            } 
                            if (pengkajianmedis[i].emrdfk == 4671) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4672) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Kepala : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4673) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4674) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4675) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Leher : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4676) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4677) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4678) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Thorax : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4679) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4680) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4681) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Abdomen : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4682) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4683) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4684) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Extremitas : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4685) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4686) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4687) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Genitalia : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4688) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4689) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4690) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Anus : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4691) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4692) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4693) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Pemeriksaan Neurologis : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4694) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4695) {
                                if (pengkajianmedis[i].value == "1") {
    
                                }
                            } else if (pengkajianmedis[i].emrdfk == 4696) {
                                if (pengkajianmedis[i].value == "1") {
                                    pemeriksaanfisik = pemeriksaanfisik + " Kulit : " + "Ada Kelainan "
                                    for (let j = 0; j < pengkajianmedis.length; j++) {
                                        if (pengkajianmedis[j].emrdfk == 4697) {
                                            pemeriksaanfisik = pemeriksaanfisik + pengkajianmedis[j].value + "\n"
                                        }
                                    }
                                }
                            }
                        }
                        if (pemeriksaanfisik == '') {
                            $scope.item.pemeriksaanFisik = 'Tidak Ada Kelainan'
                        } else {
                            $scope.item.pemeriksaanFisik = pemeriksaanfisik
                        }
                    } else {
                        toastr.error('Pengkajian Medis Tidak Ada')
                        return
                    }
                });
            };
            //## End get pengkajian medis ranap saraf ##//

            // get value from triase igd
            function getValueTriaseIgd(noregis) {
                medifirstService.get('emr/get-value-triase?noRegistrasi=' + noregis).then(function (e) {
                    if (e.data.messageCode == 200) {
                        var value = e.data.data
                        if (value.length > 0) {
                            for (let i = 0; i < value.length; i++) {
                                if (value[i].emrdfk == 1901300130) {
                                    $scope.item.keadaanUmum = value[i].value
                                }
                                if (value[i].emrdfk == 1901300127) {
                                    $scope.item.pernafasanbefore = value[i].value
                                }
                                if (value[i].emrdfk == 1901300125) {
                                    $scope.item.suhubefore = value[i].value
                                }
                                if (value[i].emrdfk == 1901300122) {
                                    let tekananDarah = value[i].value.split('/')
                                    if (tekananDarah.length === 2) {
                                        $scope.item.tekanansystolebefore = tekananDarah[0]
                                        $scope.item.tekanandiastolebefore = tekananDarah[1]
                                    } else {
                                        $scope.item.systole = value[i].value
                                    }
                                }
                                if (value[i].emrdfk == 1901300126) {
                                    $scope.item.pfnadi = value[i].value
                                }
                                if (value[i].emrdfk == 1901300129) {
                                    $scope.item.pfspo = value[i].value
                                }
                                if (value[i].emrdfk == 1901300129) {
                                    $scope.item.pfspo = value[i].value
                                }
                                if (value[i].emrdfk == 1901300124) {
                                    $scope.item.pfbb = value[i].value
                                }
                                if (value[i].emrdfk == 1901300123) {
                                    $scope.item.pftb = value[i].value
                                }
                                if (value[i].emrdfk == 1901300128) {
                                    $scope.item.kesadaran = {'kesadaran' : value[i].value.split('~')[1] }
                                }
                                if (value[i].emrdfk == 1901300131) {
                                    $scope.item.pfe = {'pfe' : value[i].value.split('~')[1] }
                                }
                                if (value[i].emrdfk == 1901300132) {
                                    $scope.item.pfm = {'pfm' : value[i].value.split('~')[1] }
                                }
                                if (value[i].emrdfk == 1901300133) {
                                    $scope.item.pfv = {'pfv' : value[i].value.split('~')[1] }
                                }
                            }
                            }
                        } else {
                            $scope.item.kesadaran = { id: 1, kesadaran: "Compos Mentis" }
                            $scope.item.pfe = { id: 4, pfe: "4" }
                            $scope.item.pfm = { id: 6, pfm: "6" }
                            $scope.item.pfv = { id: 5, pfv: "5" }
                            $scope.item.keadaanUmum = 'Tampak sakit sedang'
                        }
                })
            }

            //## Start get vital sign terakhir ##//
            function getVitalSignTerakhir(noregistrasi) {
                medifirstService.get('emr/get-vital-sign-terakhir?noRegistrasi=' + noregistrasi).then(function (dat) {
                    let vitalsign = dat.data
                    for (let i = 0; i < vitalsign.length; i++) {
                        if (vitalsign[i].emrdfk == 4245) {
                            $scope.item.denyutafter = vitalsign[i].value
                        }
                        if (vitalsign[i].emrdfk == 4246) {
                            $scope.item.pernafasanafter = vitalsign[i].value
                        }
                        if (vitalsign[i].emrdfk == 4244) {
                            $scope.item.suhuafter = vitalsign[i].value
                        }
                        if (vitalsign[i].emrdfk == 4241) {
                            let str = vitalsign[i].value
                            let res = str.split("/");
                            $scope.item.tekanansystoleafter = res[0]
                            $scope.item.tekanandiastoleafter = res[1]
                        }
                        if (vitalsign[i].emrdfk == 116064) {
                            var str = vitalsign[i].value
                            var res = str.split("~");
                            $scope.item.kesadaranafter = res[1]
                        }
                        if (vitalsign[i].emrdfk == 116066) {
                             
                            var str = vitalsign[i].value
                            var res = str.split("~");
                            $scope.item.keadaanumumafter = {id: res[0], keadaanumum: res[1] }
                        }
                    }
                    // getMateriEdukasi($scope.cc.norec_pd);
                    getKonsultasi($scope.cc.nocm);
                    // getObatPulang($scope.cc.noregistrasi);
                });
            };
            //## End get vital sign terakhir ##//

            function loadRmPp(norec_pp) {
                medifirstService.get("registrasi/daftar-registrasi/get-status-rm-pp?norec_pp=" + norec_pp).then(function (rmpp) {
                    $scope.statusSelesaiPeriksaRm = rmpp.data.isrm;
                });
            }

            function loadClaimPp(norec_pp) {
                medifirstService.get("registrasi/daftar-registrasi/get-status-rm-pp?norec_pp=" + norec_pp).then(function (rmpp) {
                    $scope.statusSelesaiPeriksaPp = rmpp.data.isrm;
                });
            }
            $scope.loadClaimPpLuar = function (dataItem) {
                var norec_pp = dataItem.norec_pp;
                var noregistrasifk = dataItem.norec_pd;
                var noregistrasi = dataItem.noregistrasi;
                var objectruanganfk = dataItem.objectruanganfk;
                var rmstat
                if (dataItem.rm == "Hapus") {
                    rmstat = false
                } else {
                    rmstat = true
                }
                // var norec_ppc = ''
                // norec_ppc = $scope.item.norec_pp
                var json = {
                    'norec': norec_pp,
                    'isrm': rmstat
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-add-rm', json).then(function (e) {
                    if (e.status === 201) {
                        medifirstService.get("registrasi/daftar-registrasi/get-status-rm-pp?norec_pp=" + norec_pp).then(function (rmpp) {
                            $scope.statusSelesaiPeriksaPp = rmpp.data.isrm;
                            loadClaimGridPp(noregistrasifk, objectruanganfk);
                            loadDaftarRmPp(noregistrasi);
                        });
                    }
                })
            }

            function loadClaimGridPp(noregistrasifk, objectruanganfk) {
                medifirstService.get("radiologi/get-lab-inacbg-grid-rm?noregistrasifk=" + noregistrasifk + "&objectruanganfk=" + objectruanganfk, true).then(function (dat) {
                    datalabstat = dat.data.data;
                    popUps();
                });
            }

            function popUps(datalab) {
                // var datafin = []
                // datalab.forEach()
                if (datalab != undefined || datalab != null) {
                    datalabs = datalab
                }
                if (datalabs.length != 0) {
                    for (var i = 0; i < datalabs.length; i++) {
                        datalabs[i].rm = datalabstat[i].rm;
                        // datalabs[i].splice(0, 1, datalabstat[i])
                    }
                    if (popc == true) {
                        if (datalabs[0].objectruanganfk == 576) {
                            $scope.dataGridRadio = {
                                data: datalabs,
                                _data: datalabs,
                                // pageSize: 10,
                                selectable: true,
                                refresh: true,
                                total: datalabs.length,
                                serverPaging: false,
                                aggregate: [
                                    { field: 'total', aggregate: 'sum' },
                                ]
                            };
                            $scope.popUpPelayananRadio.center().open();
                            popc == false;
                        } else if (datalabs[0].objectruanganfk == 575) {
                            $scope.dataGrid = {
                                data: datalabs,
                                _data: datalabs,
                                // pageSize: 10,
                                selectable: false,
                                refresh: true,
                                total: datalabs.length,
                                serverPaging: false,
                                aggregate: [
                                    { field: 'total', aggregate: 'sum' },
                                ]
                            };
                            $scope.popUpPelayanan.center().open();
                            popc == false;
                        }
                    }
                }
            }

            function popUps(datalab) {
                if (datalab != undefined || datalab != null) {
                    datalabs = datalab
                }
                if (datalabs.length != 0) {
                    for (var i = 0; i < datalabs.length; i++) {
                        datalabs[i].rm = datalabstat[i].rm;
                        // datalabs[i].splice(0, 1, datalabstat[i])
                    }

                    if (popc == true) {
                        if (datalabs[0].objectruanganfk == 576) {
                            $scope.dataGridRadio = {
                                data: datalabs,
                                _data: datalabs,
                                // pageSize: 10,
                                selectable: true,
                                refresh: true,
                                total: datalabs.length,
                                serverPaging: false,
                                aggregate: [
                                    { field: 'total', aggregate: 'sum' },
                                ]
                            };
                            $scope.popUpPelayananrad.center().open();
                            popc == false;
                        } else if (datalabs[0].objectruanganfk == 575) {
                            $scope.dataGrid = {
                                data: datalabs,
                                _data: datalabs,
                                // pageSize: 10,
                                selectable: false,
                                refresh: true,
                                total: datalabs.length,
                                serverPaging: false,
                                aggregate: [
                                    { field: 'total', aggregate: 'sum' },
                                ]
                            };
                            $scope.popUpPelayanan.center().open();
                            popc == false;
                        }
                    }
                }
            }

            //load konsultasi 
            function getKonsultasi(nocm) {
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-order-konsul?nocm=" + nocm).then(function (res) {
                    $scope.isRouteLoading = false;
                    let konsultasi = res.data.data;
                    let hasilKonsultasi = '';
                    let datakonsultasi = '';
                    for (let i = 0; i < konsultasi.length; i++) {
                        if(konsultasi[i].keteranganlainnya != null) {
                            datakonsultasi = konsultasi[i].keteranganlainnya
                            if(konsultasi[i].saran != null) {
                                datakonsultasi = datakonsultasi + ' ,Saran : ' + konsultasi[i].saran
                            }
                            hasilKonsultasi += konsultasi[i].namalengkap + " " + ':' + " " + datakonsultasi + '\n';
                        }
                    }
                    // $scope.item.hasilkonsultasi = hasilKonsultasi;
                });
            }
            //end konsultasi

            //load materi edukasi 
            // function getMateriEdukasi(norecpd) {
            //     $scope.isRouteLoading = true;
            //     medifirstService.get("emr/get-edukasi-pasien?norec=" + norecpd).then(function (res) {
            //         $scope.isRouteLoading = false;
            //         let edukasi = res.data;
            //         let materiedukasi = '';
            //         for (let i = 0; i < edukasi.length; i++) {
            //             materiedukasi += edukasi[i].materiedukasi + '\n';
            //         }
            //         $scope.item.edukasi = materiedukasi;
            //         // getKonsultasi($scope.cc.nocm);
            //         // getObatPulang($scope.cc.noregistrasi);
            //     });
            // }
            //end materi edukasi

            $scope.formatDecimal = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(0).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            //## Get Obat Go Home ##//
            function getObatPulang(noregistrasi) {
                if ($scope.norec == '-' || $scope.isfinal == false) {
                    medifirstService.get("emr/get-obat-pulang-ri?noregistrasi=" + noregistrasi).then(function (dat) {
                        obatpulang = dat.data.data
                        for (let i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1;
                        }
                        $scope.dataGridObatPulang = {
                            data: dat.data.data,
                            // pageSize: 10,
                            selectable: true,
                            refresh: true,
                            total: dat.data.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'total', aggregate: 'sum' },
                            ]
                        };
                    })
                } else {
                    medifirstService.get('emr/get-temp-resume?norec=' + $scope.norec + '&jenispenunjang=OBATPULANG').then(function(dat) {
                        obatpulang = dat.data
                        for (let i = 0; i < obatpulang.length; i++) {
                            obatpulang[i].no = i + 1
                        }
                        $scope.dataGridObatPulang = {
                            data: obatpulang,
                            // pageSize: 10,
                            selectable: true,
                            refresh: true,
                            total: obatpulang.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'total', aggregate: 'sum' },
                            ]
                        };
                    })
                }
            }
            
            $scope.columnGridObatPulang = {
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "15px"
                    },
                    {
                        "field": "tglresep",
                        "title": "Tgl Pelayanan",
                        "width": "50px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Obat",
                        "width": "180px"
                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah Obat",
                        "width": "50px",
                        template: "<span class='style-center'>{{formatDecimal('#: jumlah #', '')}}</span>",
                    },
                    {
                        "field": "namaruangan",
                        "title": "Depo",
                        "width": "80px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Pemberi Resep",
                        "width": "140px"
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }

            $scope.tambahDataObatPulang = function() {
				$scope.isRouteLoading = true;
				let tampungNorecObatPulang = '';
				let a = ""
				let b = ""
				for(let i = 0; i < obatpulang.length; i++) {
					let c = obatpulang[i].norecpp
					b = "," + c
					a = a + b
				}
				tampungNorecObatPulang = a.slice(1, a.length);
                //  
				// medifirstService.get('farmasi/get-transaksi-pelayanan?noReg=' + $scope.cc.noregistrasi + "&norec_pp=" + tampungNorec).then(function(dat) {
                    medifirstService.get("emr/get-obat-pulang?noregistrasi=" + $scope.cc.noregistrasi + "&norec_pp=" + tampungNorecObatPulang).then(function (dat) {
                    
					 
					$scope.isRouteLoading = false;
					for (let i = 0; i < dat.data.data.length; i++) {
						dat.data.data[i].no = i + 1;
					}
					$scope.dataGridObatPulangDelete = {
						data: dat.data.data,
						// pageSize: 10,
						selectable: true,
						refresh: true,
						total: dat.data.length,
						serverPaging: false,
						aggregate: [
							{ field: 'total', aggregate: 'sum' },
						]
					};
				})
				$scope.columnGridObatPulangDelete = {
					columns: [
						{
							"field": "no",
							"title": "No",
							"width": "30px"
						},
						{
							"field": "tglresep",
							"title": "Tgl Resep",
							"width": "90px"
						},
						{
							"field": "noresep",
							"title": "No Resep",
							"width": "120px"
						},
						{
							"field": "namaproduk",
							"title": "Nama Obat",
							"width": "160px",
						},
						{
							"field": "jumlah",
							"title": "Qty",
							"width": "30px",
						},
						{
							"field": "namaruangan",
							"title": "Depo",
							"width": "140px"
						},
						{
							"field": "namalengkap",
							"title": "Dokter",
							"width": "140px"
						}
	
					],
					sortable: {
						mode: "single",
						allowUnsort: false,
					}
				}
				$scope.popUpObatPulangDelete.center().open()
			}
            function tambahObatPulang(e) {
				e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				 
                if (dataItem == undefined) {
                    toast.warning('Data Belum Dipilih!')
                    return;
                };
					var grid = this;
                    var row = $(e.currentTarget).closest("tr");
                    var tr = $(e.target).closest("tr");

					obatpulang.push(dataItem)
					obatpulang.sort()
					for (let i = 0; i < obatpulang.length; i++) {
						obatpulang[i].no = i + 1
					}
					$scope.dataGridObatPulang = {
						data: obatpulang,
						_data: obatpulang,
						// pageSize: 10,
						selectable: true,
						refresh: true,
						total: obatpulang.length,
						serverPaging: false,
						aggregate: [
							{ field: 'total', aggregate: 'sum' },
						]
					};
					$scope.columnGridObatPulang = {
						columns: [
							{
								"field": "no",
								"title": "No",
								"width": "30px"
							},
							{
								"field": "tglpelayanan",
								"title": "Tgl Pelayanan",
								"width": "90px"
							},
							{
								"field": "noregistrasi",
								"title": "No Registrasi",
								"width": "120px"
							},
							{
								"field": "noresep",
								"title": "No Resep",
								"width": "120px"
							},
							{
								"field": "namaproduk",
								"title": "Layanan",
								"width": "160px",
							},
							{
								"field": "namaruangandepo",
								"title": "Depo",
								"width": "140px"
							},
							{
								"field": "dokter",
								"title": "Dokter",
								"width": "140px"
							},
							{
								"command": [
									{ text: "Hapus", click: hapusObatPulang, imageClass: "k-icon k-i-read" }
								],
								title: "Action",
								width: "100px"
							}
		
						],
						sortable: {
							mode: "single",
							allowUnsort: false,
						}
					}
					grid.removeRow(row);
			}
            function hapusObatPulang(e) {
                //  
                let obatpulangfix = [];
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (dataItem == undefined) {
                    toast.warning('Data Belum Dipilih!')
                    return;
                };
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                for (let i = 0; i < obatpulang.length; i++) {
                    if (obatpulang[i].norecpp == dataItem.norecpp) {
                        delete obatpulang[i];
                        grid.removeRow(row);
                    } else {
                        obatpulangfix.push(obatpulang[i])
                    }
                }
                obatpulang = obatpulangfix
            }
            //## End Obat Pulang ##//

            // Reaksi Obat Bila Ya
            $scope.tambahRO = function () {
                var nomorro = 0
                if ($scope.dataReaksiObat == undefined) {
                    nomorro = 1
                } else {
                    nomorro = dataRO.length + 1
                }
                if ($scope.item.namaobatro == undefined || $scope.item.namaobatro == null || $scope.item.namaobatro == '') {
                    toastr.error('Isi terlebih dahulu nama obatnya!')
                    return
                }
                if ($scope.item.manifestasiro == undefined || $scope.item.manifestasiro == null || $scope.item.manifestasiro == '') {
                    toastr.error('Isi terlebih dahulu manifestasi klinisnya!')
                    return
                }
                if ($scope.item.keteranganro == undefined || $scope.item.keteranganro == null || $scope.item.keteranganro == '') {
                    toastr.error('Isi terlebih dahulu keterangannya!')
                    return
                }
                var dataTampungRO = {}
                if ($scope.item.noro != undefined) {
                    for (var i = dataRO.length - 1; i >= 0; i--) {
                        if (dataRO[i].noro == $scope.item.noro) {
                            dataTampungRO.noro = $scope.item.noro
                            dataTampungRO.namaobatro = $scope.item.namaobatro
                            dataTampungRO.manifestasiro = $scope.item.manifestasiro
                            dataTampungRO.keteranganro = $scope.item.keteranganro
                            dataRO[i] = dataTampungRO

                            console.log(dataTampungRO)

                            $scope.dataReaksiObat = new kendo.data.DataSource({
                                data: dataRO
                            })
                            KosongkanRO()
                        }
                    }
                } else {
                    dataTampungRO = {
                        noro: nomorro,
                        namaobatro: $scope.item.namaobatro,
                        manifestasiro: $scope.item.manifestasiro,
                        keteranganro: $scope.item.keteranganro
                    }
                    dataRO.push(dataTampungRO)

                    $scope.dataReaksiObat = new kendo.data.DataSource({
                        data: dataRO
                    })
                    KosongkanRO()
                }
            }

            // function getReaksiObat() {
            //     medifirstService.get('emr/get-reaksi-obat-resume-ranap?norecresume=' + $scope.norec + "&noregistrasi=" + $scope.cc.noregistrasi).then(function (e) {
            //         dataRO = e.data.dataro
            //         $scope.dataReaksiObat = new kendo.data.DataSource({
            //             data: dataRO
            //         });
            //     })

            //     $scope.columnReaksiObat = [{
            //         "field": "noro",
            //         "title": "No",
            //         "width": "30px"
            //     },
            //     {
            //         "field": "namaobatro",
            //         "title": "Nama Obat",
            //         "width": "100px"
            //     }, {
            //         "field": "manifestasiro",
            //         "title": "Manifestasi Klinis",
            //         "width": "100px"
            //     }, {
            //         "field": "keteranganro",
            //         "title": "Keterangan",
            //         "width": "300px"
            //     }
            //     ];
            // }

            $scope.klikReaksiObat = function (dataReaksiObatSelected) {
                $scope.item.noro = dataReaksiObatSelected.noro
                $scope.item.namaobatro = dataReaksiObatSelected.namaobatro
                $scope.item.manifestasiro = dataReaksiObatSelected.manifestasiro
                $scope.item.keteranganro = dataReaksiObatSelected.keteranganro
            }

            function KosongkanRO() {
                $scope.item.noro = undefined
                $scope.item.namaobatro = ''
                $scope.item.manifestasiro = ''
                $scope.item.keteranganro = ''
                $scope.dataReaksiObatSelected = undefined
            }

            //## Get Obat ##//
            function getObat(noregistrasi) {
                if ($scope.norec == '-') {
                    medifirstService.get('farmasi/get-transaksi-pelayanan-resume-rj?noReg=' + noregistrasi + '&isresume=true').then(function (dat) {
                        debugger
                        obat = dat.data
                        for (let i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1;
                        }
                        $scope.dataGridObat = {
                            data: dat.data,
                            // pageSize: 10,
                            selectable: true,
                            refresh: true,
                            total: dat.data.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'total', aggregate: 'sum' },
                            ]
                        };
                    })
                } else {
                    medifirstService.get('emr/get-temp-resume?norec=' + $scope.norec + '&jenispenunjang=OBAT').then(function(dat) {
                        obat = dat.data
                        for (let i = 0; i < obat.length; i++) {
                            obat[i].no = i + 1
                        }
                        $scope.dataGridObat = {
                            data: obat,
                            // pageSize: 10,
                            selectable: true,
                            refresh: true,
                            total: obat.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'total', aggregate: 'sum' },
                            ]
                        };
                    })
                }
            }

            $scope.columnGridObat = {
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px"
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "120px"
                    },
                    {
                        "field": "noresep",
                        "title": "No Resep",
                        "width": "120px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                    },
                    {
                        "field": "dosisobat",
                        "title": "Dosis",
                        "width": "160px",
                    },
                    {
                        "field": "keteranganpakai",
                        "title": "Keterangan Pakai",
                        "width": "160px",
                    },
                    {
                        "field": "namaruangandepo",
                        "title": "Depo",
                        "width": "140px"
                    },
                    {
                        "field": "dokter",
                        "title": "Dokter",
                        "width": "140px"
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }

            $scope.tambahDataObat = function() {
				$scope.isRouteLoading = true;
				let tampungNorec = '';
				let a = ""
				let b = ""
				for(let i = 0; i < obat.length; i++) {
					let c = obat[i].norecpp
					b = "," + c
					a = a + b
				}
				tampungNorec = a.slice(1, a.length);
                //  
				//medifirstService.get('farmasi/get-transaksi-pelayanan?noReg=' + $scope.cc.noregistrasi + "&norec_pp=" + tampungNorec + "&isresume=true").then(function(dat) {
                medifirstService.get('farmasi/get-transaksi-pelayanan-resume-rj?noReg=' + $scope.cc.noregistrasi + "&isresume=true").then(function(dat) {
					 
					$scope.isRouteLoading = false;
					for (let i = 0; i < dat.data.length; i++) {
						dat.data[i].no = i + 1;
					}
					$scope.dataGridObatDelete = {
						data: dat.data,
						// pageSize: 10,
						selectable: true,
						refresh: true,
						total: dat.data.length,
						serverPaging: false,
						aggregate: [
							{ field: 'total', aggregate: 'sum' },
						]
					};
				})
				$scope.columnGridObatDelete = {
					columns: [
						{
							"field": "no",
							"title": "No",
							"width": "30px"
						},
						{
							"field": "tglpelayanan",
							"title": "Tgl Pelayanan",
							"width": "90px"
						},
						{
							"field": "noregistrasi",
							"title": "No Registrasi",
							"width": "120px"
						},
						{
							"field": "noresep",
							"title": "No Resep",
							"width": "120px"
						},
						{
							"field": "namaproduk",
							"title": "Layanan",
							"width": "160px",
						},
						{
							"field": "namaruangandepo",
							"title": "Depo",
							"width": "140px"
						},
						{
							"field": "dokter",
							"title": "Dokter",
							"width": "140px"
						}
	
					],
					sortable: {
						mode: "single",
						allowUnsort: false,
					}
				}
				$scope.popUpObatDelete.center().open()
			}
            // function tambahObat(e) {
			// 	e.preventDefault();
            //     var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				 
            //     if (dataItem == undefined) {
            //         toast.warning('Data Belum Dipilih!')
            //         return;
            //     };
			// 		var grid = this;
            //         var row = $(e.currentTarget).closest("tr");
            //         var tr = $(e.target).closest("tr");

			// 		obat.push(dataItem)
			// 		obat.sort()
			// 		for (let i = 0; i < obat.length; i++) {
			// 			obat[i].no = i + 1
			// 		}
			// 		$scope.dataGridObat = {
			// 			data: obat,
			// 			_data: obat,
			// 			// pageSize: 10,
			// 			selectable: true,
			// 			refresh: true,
			// 			total: obat.length,
			// 			serverPaging: false,
			// 			aggregate: [
			// 				{ field: 'total', aggregate: 'sum' },
			// 			]
			// 		};
			// 		$scope.columnGridObat = {
			// 			columns: [
			// 				{
			// 					"field": "no",
			// 					"title": "No",
			// 					"width": "30px"
			// 				},
			// 				{
			// 					"field": "tglpelayanan",
			// 					"title": "Tgl Pelayanan",
			// 					"width": "90px"
			// 				},
			// 				{
			// 					"field": "noregistrasi",
			// 					"title": "No Registrasi",
			// 					"width": "120px"
			// 				},
			// 				{
			// 					"field": "noresep",
			// 					"title": "No Resep",
			// 					"width": "120px"
			// 				},
			// 				{
			// 					"field": "namaproduk",
			// 					"title": "Layanan",
			// 					"width": "160px",
			// 				},
			// 				{
			// 					"field": "namaruangandepo",
			// 					"title": "Depo",
			// 					"width": "140px"
			// 				},
			// 				{
			// 					"field": "dokter",
			// 					"title": "Dokter",
			// 					"width": "140px"
			// 				},
			// 				{
			// 					"command": [
			// 						{ text: "Hapus", click: hapusObat, imageClass: "k-icon k-i-read" }
			// 					],
			// 					title: "Action",
			// 					width: "100px"
			// 				}
		
			// 			],
			// 			sortable: {
			// 				mode: "single",
			// 				allowUnsort: false,
			// 			}
			// 		}
			// 		grid.removeRow(row);
			// }
            function hapusObat(e) {
                let obatfix = [];
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (dataItem == undefined) {
                    toast.warning('Data Belum Dipilih!')
                    return;
                };
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                for (let i = 0; i < obat.length; i++) {
                    if (obat[i].norecpp == dataItem.norecpp) {
                        delete obat[i];
                        grid.removeRow(row);
                    } else {
                        obatfix.push(obat[i])
                    }
                }
                obat = obatfix
            }
            //## End Obat ##//


            //## Start Load Tindakan Medis ##//
            function loadTindakanMedis(noregistrasi) {
                $scope.isRouteLoading = true;
                var param = ""
                param = "noReg=" + noregistrasi;
                medifirstService.get("emr/get-diagnosapasienbynoregicd9?"
                    + param
                ).then(function (data) {
                    tindakan = data.data.datas
                    $scope.isRouteLoading = false;
                    var dataICD9 = data.data.datas;
                    $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                        data: dataICD9,
                        pageSize: 10
                    });
                });
                $scope.columnDiagnosaIcd9 = [{
                    "title": "No",
                    "template": "{{dataSourceDiagnosaIcd9.indexOf(dataItem) + 1}}",
                    "width": "30px"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "100px"
                }, {
                    "field": "kddiagnosatindakan",
                    "title": "Kode ICD 9",
                    "width": "100px"
                }, {
                    "field": "namadiagnosatindakan",
                    "title": "Nama ICD 9",
                    "width": "300px"
                }, {
                    "field": "keterangantindakan",
                    "title": "Keterangan",
                    "width": "200px"
                }, {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "200px"
                },
                {
                    "field": "namalengkap",
                    "title": "Penginput",
                    "width": "200px"
                },
                {
                    "field": "tglinputdiagnosa",
                    "title": "Tgl Input",
                    "width": "200px"
                }];
            }
            //## End Load Tindakan Medis ##//

            function hapusTindakan(e) {
                //  
                let tindakanfix = [];
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (dataItem == undefined) {
                    toast.warning('Data Belum Dipilih!')
                    return;
                };
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                for (let i = 0; i < tindakan.length; i++) {
                    if (tindakan[i].norec == dataItem.norec) {
                        delete tindakan[i];
                        grid.removeRow(row);
                    } else {
                        tindakanfix.push(tindakan[i])
                    }
                }
                tindakan = tindakanfix
            }
            $scope.tambahDataTindakan = function () {
                $scope.isRouteLoading = true;
                let tampungNorec = '';
                let a = ""
                let b = ""
                for (let i = 0; i < tindakan.length; i++) {
                    let c = tindakan[i].norec
                    b = "," + c
                    a = a + b
                }
                tampungNorec = a.slice(1, a.length);
                medifirstService.get('tatarekening/detail-tagihanv2/' + $scope.cc.noregistrasi + "?" + "jenisdata=layanan" + "&norec=" + tampungNorec).then(function (dat) {
                    //  
                    $scope.isRouteLoading = false;
                    let tindakan2 = dat.data.details;
                    $scope.dataGridTindakanDelete = {
                        data: tindakan2,
                        selectable: true,
                        refresh: true,
                        total: tindakan2.length,
                        serverPaging: false,
                    };
                    $scope.columnGridTindakanDelete = {
                        columns: [
                            {
                                "field": "tglPelayanan",
                                "title": "Tgl Pelayanan",
                                "width": "90px",
                            },
                            {
                                "field": "ruanganTindakan",
                                "title": "Ruangan",
                                "width": "120px",
                            },
                            {
                                "field": "namaPelayanan",
                                "title": "Tindakan",
                                "width": "120px",
                            },
                            {
                                "field": "dokter",
                                "title": "Dokter Pemeriksa",
                                "width": "140px",
                            }

                        ],
                        sortable: {
                            mode: "single",
                            allowUnsort: false,
                        }
                    }
                    $scope.popUpTindDelete.center().open()
                })
            }
            function tambahTindakan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (dataItem == undefined) {
                    toast.warning('Data Belum Dipilih!')
                    return;
                };
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");

                tindakan.push(dataItem)
                tindakan.sort()
                for (let i = 0; i < tindakan.length; i++) {
                    tindakan[i].no = i + 1
                }
                $scope.dataGridTindakan = {
                    data: tindakan,
                    // pageSize: 10,
                    selectable: true,
                    refresh: true,
                    total: tindakan.length,
                    serverPaging: false,
                };
                $scope.columnGridTindakan = {
                    toolbar: [{
                        name: "create", text: "Input Baru",
                        template: '<button ng-click="tambahDataTindakan()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Tindakan</button>'
                    },],
                    columns: [
                        {
                            "field": "tglPelayanan",
                            "title": "Tgl Pelayanan",
                            "width": "90px",
                        },
                        {
                            "field": "ruanganTindakan",
                            "title": "Ruangan",
                            "width": "120px",
                        },
                        {
                            "field": "namaPelayanan",
                            "title": "Tindakan",
                            "width": "120px",
                        },
                        {
                            "field": "dokter",
                            "title": "Dokter Pemeriksa",
                            "width": "140px",
                        },
                        {
                            "command": [
                                { text: "Hapus", click: hapusTindakan, imageClass: "k-icon k-i-read" }
                            ],
                            title: "Action",
                            width: "100px",
                        }

                    ],
                    sortable: {
                        mode: "single",
                        allowUnsort: false,
                    }
                }
                grid.removeRow(row);
            }
            //## End Load Tindakan ##//

            //## RADIOLOGI ##//
            function loadRadiologi(noregistrasi) {
                //  
                medifirstService.get('emr/get-rad-resume-rj?noregistrasi=' + noregistrasi + "&ruid=" + 576, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    rad = dat.data.data
                    let penunjangrad = "Radiologi : "
                    let tampung4 = '';
                    let tampung2 = '';
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
                        if (dat.data.data[i].statusperiksa == 1) {
                            dat.data.data[i].statusperiksa = "✔";
                        } else {
                            dat.data.data[i].statusperiksa = "✘";
                        }
                        if (dat.data.data[i].hr_norec != null) {
                            dat.data.data[i].flagrad = 'Ada';
                        } else {
                            dat.data.data[i].flagrad = 'Tidak Ada';
                        }
                        if ($scope.norec == '-') {
                            if (dat.data.data[i].keterangan != null) {
                                tampung4 = dat.data.data[i].keterangan
                                let kalimat = dat.data.data[i].keterangan
                                let panjang = kalimat.length;
                                let temukan = kalimat.indexOf("kesan");
                                if (temukan < 0) {
                                    temukan = kalimat.indexOf("Kesan");
                                }
                                if (temukan < 0) {
                                    temukan = kalimat.indexOf("KESAN");
                                }
                                if (temukan < 0) {
                                    temukan = kalimat.indexOf("Kesimpulan");
                                }
                                if (temukan < 0) {
                                    temukan = kalimat.indexOf("kesimpulan");
                                }
                                let filter = kalimat.slice(temukan, panjang)
                                filter = filter.replace(/(<([^>]+)>)/gi, "");
                                filter = filter.replace(/&nbsp;/g, " ");
                                tampung2 = filter
                                penunjangrad = penunjangrad + dat.data.data[i].namaproduk + " " + tampung2 + " \n"
                            }
                        }

                    }
                    if ($scope.norec == '-') {
                        // $scope.item.temuanPenting = $scope.item.temuanPenting + penunjangrad + " \n"
                    }
                    if (dat.data.data.length > 0) {
                        if (dat.data.data[0].objectdepartemenfk == 3)
                            $scope.disableRad = true
                        if (dat.data.data[0].objectdepartemenfk == 27)
                            $scope.disableLab = true
                    }
                    $scope.isLoading = false;
                    $scope.dataGridRadiologi = {
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
                    loadDiagnosa($scope.cc.noregistrasi);
                },
                    function (error) {
                        $scope.isLoading = false;
                    });
            }
            $scope.columnGridRadiologi = {
                toolbar: [{
                    name: "create", text: "Input Baru",
                    template: '<button ng-click="tambahDataRad()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Radiologi</button>'
                },],
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                        attributes: {
                            class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px",
                        attributes: {
                            class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "120px",
                        attributes: {
                            class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruangan Asal",
                        "width": "120px",
                        attributes: {
                            class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"cetakEkspertise(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                        attributes: {
                            class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "dokterpemeriksa",
                        "title": "Dokter Pemeriksa",
                        "width": "140px",
                        attributes: {
                            class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "field": "dokterpengirim",
                        "title": "Dokter Pengririm",
                        "width": "140px",
                        attributes: {
                            class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    },
                    {
                        "command": [
                            { text: "Hapus", click: hapusRad, imageClass: "k-icon k-i-read" }
                        ],
                        title: "Action",
                        width: "100px",
                        attributes: {
                            class: "# if(flagrad == 'Ada') { # hejo # } else { # blue # } #"
                        },
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
            $scope.tambahDataRad = function() {
				$scope.isRouteLoading = true;
				let tampungNorec = '';
				let a = ""
				let b = ""
				for(let i = 0; i < rad.length; i++) {
					let c = rad[i].norec_pp
					b = "," + c
					a = a + b
				}
				tampungNorec = a.slice(1, a.length);
				medifirstService.get('emr/get-rad-resume-rj?noregistrasi=' + $scope.cc.noregistrasi + "&ruid=" + $scope.item.objectruanganfk + "&norec=" + tampungNorec, true).then(function(dat) {
					 
					$scope.isRouteLoading = false;
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
						if (dat.data.data[i].statusperiksa == 1) {
							dat.data.data[i].statusperiksa = "✔";
						} else {
							dat.data.data[i].statusperiksa = "✘";
						}
						if (dat.data.data[i].hr_norec != null) {
							dat.data.data[i].flagrad = 'Ada';
						} else {
							dat.data.data[i].flagrad = 'Tidak Ada';
						}

					}
					if (dat.data.data.length > 0) {
						if (dat.data.data[0].objectdepartemenfk == 3)
							$scope.disableRad = true
						if (dat.data.data[0].objectdepartemenfk == 27)
							$scope.disableLab = true
					}
					$scope.isLoading = false;

					$scope.dataGridRadDelete = {
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
				})
				$scope.columnGridRadDelete = {
					columns: [
						// {
						// 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
						// 	template: "# if (statCheckbox) { #" +
						// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
						// 		"# } else { #" +
						// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
						// 		"# } #",
						// 	width: "30px",
						// 	attributes: {
						// 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
						//    },
						// },
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
							"title": "Ruangan",
							"width": "120px",
						},
						{
							"field": "namaruanganasal",
							"title": "Ruangan Asal",
							"width": "120px",
						},
						// {
						//     "field": "namaproduk",
						//     "title": "Layanan",
						//     "width": "160px",
						//     "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
						//     attributes: {
						//         class: "#=flaglab != 'N' ? 'red' : 'green' #"
						//     },
						// },
						{
							"field": "namaproduk",
							"title": "Layanan",
							"width": "160px",
							"template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
						},
						{
							"field": "dokterpemeriksa",
							"title": "Dokter Pemeriksa",
							"width": "140px",
						},
						{
							"field": "dokterpengirim",
							"title": "Dokter Pengririm",
							"width": "140px",
						},
						{
							"field": "tglhasil",
							"title": "Tgl Hasil",
							"width": "90px",
						},
						{
							"field": "tglcetak",
							"title": "Tgl Cetak",
							"width": "90px",
						},
						{
							"command": [
								{ text: "Tambah", click: tambahRad, imageClass: "k-icon k-i-read" }
							],
							title: "Action",
							width: "100px",
						}
	
					],
					sortable: {
						mode: "single",
						allowUnsort: false,
					}
				}
				$scope.popUpRadDelete.center().open()
			}
            function tambahRad(e) {
                //  
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (dataItem == undefined) {
                    toast.warning('Data Belum Dipilih!')
                    return;
                };
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");

                rad.push(dataItem)
                rad.sort()
                for (let i = 0; i < rad.length; i++) {
                    rad[i].no = i + 1
                }
                $scope.dataGridRadiologi = {
                    data: rad,
                    _data: rad,
                    // pageSize: 10,
                    selectable: true,
                    refresh: true,
                    total: rad.length,
                    serverPaging: false,
                    aggregate: [
                        { field: 'total', aggregate: 'sum' },
                    ]
                };
                $scope.columnGridRadiologi = {
                    toolbar: [{
                        name: "create", text: "Input Baru",
                        template: '<button ng-click="tambahDataRad()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Laboratorium</button>'
                    },],
                    columns: [
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
                            "title": "Ruangan",
                            "width": "120px",
                        },
                        {
                            "field": "namaruanganasal",
                            "title": "Ruangan Asal",
                            "width": "120px",
                        },
                        {
                            "field": "namaproduk",
                            "title": "Layanan",
                            "width": "160px",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"cetakEkspertise(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                        },
                        {
                            "field": "dokterpemeriksa",
                            "title": "Dokter Pemeriksa",
                            "width": "140px",
                        },
                        {
                            "field": "dokterpengirim",
                            "title": "Dokter Pengririm",
                            "width": "140px",
                        },
                        {
                            "field": "tglhasil",
                            "title": "Tgl Hasil",
                            "width": "90px",
                        },
                        {
                            "field": "tglcetak",
                            "title": "Tgl Cetak",
                            "width": "90px",
                        },
                        {
                            "command": [
                                { text: "Hapus", click: hapusRad, imageClass: "k-icon k-i-read" }
                            ],
                            title: "Action",
                            width: "100px",
                        }

                    ],
                    sortable: {
                        mode: "single",
                        allowUnsort: false,
                    }
                }
                grid.removeRow(row);
            }
            function hapusRad(e) {
                let radfix = [];
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (dataItem == undefined) {
                    toast.warning('Data Belum Dipilih!')
                    return;
                };
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                for (let i = 0; i < rad.length; i++) {
                    if (rad[i].norec_pp == dataItem.norec_pp) {
                        delete rad[i];
                        grid.removeRow(row);
                    } else {
                        radfix.push(rad[i])
                    }
                }
                rad = radfix
            }
            //##END RADIOLOGI##//

            //## LAB
            function loadDaftarRmPp(noregistrasi) {
                medifirstService.get("emr/get-lab-resume-rj?noregistrasi=" + noregistrasi).then(function (dat) {
                    lab = dat.data.data
                    if (dat.data.data.length > 0) {
                        $scope.item.tgllahir = dat.data.data[0].tgllahir
                        $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                    }
                    let penunjanglab = 'Laboratorium Patalogi Klinik : ';
                    let tampung7 = '';
                    let tampung6 = '';
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
                        if (dat.data.data[i].statusperiksa == 1) {
                            dat.data.data[i].statusperiksa = "✔";
                        } else {
                            dat.data.data[i].statusperiksa = "✘";
                        }
                        if ($scope.norec == '-') {
                            for (let j = 0; j < dat.data.data[i].pp.data.length; j++) {
                                if (dat.data.data[i].pp.data[j].flag == 'Y' || dat.data.data[i].pp.data[j].flag == 'K') {
                                    tampung7 = dat.data.data[i].pp.data[j].hasil
                                    tampung6 = tampung6 + dat.data.data[i].pp.data[j].detailpemeriksaan + ":" + dat.data.data[i].pp.data[j].hasil + " / "
                                }
                            }
                        }
                    }
                    if ($scope.norec == '-') {
                        penunjanglab = penunjanglab + tampung6
                        // $scope.item.temuanPenting = $scope.item.temuanPenting + penunjanglab + " \n"
                    }
                    // if (dat.data.data.length > 0) {
                    //     if (dat.data.data[0].objectdepartemenfk == 3)
                    //         $scope.disableRad = true
                    //     if (dat.data.data[0].objectdepartemenfk == 27)
                    //         $scope.disableLab = true
                    // }
                    $scope.isLoading = false;

                    $scope.dataGridLaborat = {
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
                    loadRadiologi(noregistrasi);
                },
                    function (error) {
                        $scope.isLoading = false;
                    });
            }
            $scope.columnGridLaborat = {toolbar: [{
				name: "create", text: "Input Baru",
				template: '<button ng-click="tambahDataLab()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Laboratorium</button>'
					},],
                columns: [
                    // {
                    // 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    // 	template: "# if (statCheckbox) { #" +
                    // 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                    // 		"# } else { #" +
                    // 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                    // 		"# } #",
                    // 	width: "30px",
                    // 	attributes: {
                    // 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //    },
                    // },
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "120px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruangan Asal",
                        "width": "120px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    // {
                    //     "field": "namaproduk",
                    //     "title": "Layanan",
                    //     "width": "160px",
                    //     "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                    //     attributes: {
                    //         class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    //     },
                    // },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                                // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                        },
                    },
                    {
                        "field": "dokterpemeriksa",
                        "title": "Dokter Pemeriksa",
                        "width": "140px",
                        attributes: {
                            // class: "#=flaglab == 'N' ? 'red' : #=flaglab == 'Belum Input Lab' ? 'blue' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "dokterpengirim",
                        "title": "Dokter Pengririm",
                        "width": "140px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "tglhasil",
                        "title": "Tgl Hasil",
                        "width": "90px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "field": "tglcetak",
                        "title": "Tgl Cetak",
                        "width": "90px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    },
                    {
                        "command": [
                            { text: "Hapus", click: hapusLab, imageClass: "k-icon k-i-read" }
                        ],
                        title: "Action",
                        width: "100px",
                        attributes: {
                            // class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							class: "# if(flaglab == 'N') { # hejo # } else if(flaglab == 'Belum Input Lab') { # blue # } else { # red # } #"
                        },
                    }

                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
            }
            $scope.tambahDataLab = function() {
				$scope.isRouteLoading = true;
				let tampungNorec = '';
				let a = ""
				let b = ""
				for(let i = 0; i < lab.length; i++) {
					let c = lab[i].norec_pp
					b = "," + c
					a = a + b
				}
				tampungNorec = a.slice(1, a.length);
				medifirstService.get('emr/get-lab-resume-rj-deleted?noregistrasi=' + $scope.cc.noregistrasi + "&ruid=" + $scope.item.objectruanganfk + "&norec=" + tampungNorec, true).then(function(dat) {
					 
					$scope.isRouteLoading = false;
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
						if (dat.data.data[i].statusperiksa == 1) {
							dat.data.data[i].statusperiksa = "✔";
						} else {
							dat.data.data[i].statusperiksa = "✘";
						}

					}
					if (dat.data.data.length > 0) {
						if (dat.data.data[0].objectdepartemenfk == 3)
							$scope.disableRad = true
						if (dat.data.data[0].objectdepartemenfk == 27)
							$scope.disableLab = true
					}
					$scope.isLoading = false;

					$scope.dataGridLabDelete = {
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
				})
				$scope.columnGridLabDelete = {
					columns: [
						// {
						// 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
						// 	template: "# if (statCheckbox) { #" +
						// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
						// 		"# } else { #" +
						// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
						// 		"# } #",
						// 	width: "30px",
						// 	attributes: {
						// 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
						//    },
						// },
						{
							"field": "no",
							"title": "No",
							"width": "30px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						{
							"field": "tglpelayanan",
							"title": "Tgl Pelayanan",
							"width": "90px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						{
							"field": "ruangan",
							"title": "Ruangan",
							"width": "120px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						{
							"field": "namaruanganasal",
							"title": "Ruangan Asal",
							"width": "120px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						// {
						//     "field": "namaproduk",
						//     "title": "Layanan",
						//     "width": "160px",
						//     "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
						//     attributes: {
						//         class: "#=flaglab != 'N' ? 'red' : 'green' #"
						//     },
						// },
						{
							"field": "namaproduk",
							"title": "Layanan",
							"width": "160px",
							"template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
									// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
							},
						},
						{
							"field": "dokterpemeriksa",
							"title": "Dokter Pemeriksa",
							"width": "140px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						{
							"field": "dokterpengirim",
							"title": "Dokter Pengririm",
							"width": "140px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						{
							"field": "tglhasil",
							"title": "Tgl Hasil",
							"width": "90px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						{
							"field": "tglcetak",
							"title": "Tgl Cetak",
							"width": "90px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						},
						{
							"command": [
								{ text: "Tambah", click: tambahLab, imageClass: "k-icon k-i-read" }
							],
							title: "Action",
							width: "100px",
							attributes: {
								class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
							},
						}
	
					],
					sortable: {
						mode: "single",
						allowUnsort: false,
					}
				}
				$scope.popUpLabDelete.center().open()
			}
            function tambahLab(e) {
                debugger
				e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				 
                if (dataItem == undefined) {
                    toast.warning('Data Belum Dipilih!')
                    return;
                };
					var grid = this;
                    var row = $(e.currentTarget).closest("tr");
                    var tr = $(e.target).closest("tr");
                    let objSave = {
                        norec: dataItem.norec_pp,
                        status: 'false'
                    }
                    medifirstService.post('emr/update-item-for-resume', objSave).then(function(e) {

                    })
					lab.push(dataItem)
					lab.sort()
					for (let i = 0; i < lab.length; i++) {
						lab[i].no = i + 1
					}
					$scope.dataGridLaborat = {
						data: lab,
						_data: lab,
						// pageSize: 10,
						selectable: true,
						refresh: true,
						total: lab.length,
						serverPaging: false,
						aggregate: [
							{ field: 'total', aggregate: 'sum' },
						]
					};
					$scope.columnGridLaborat = {toolbar: [{
						name: "create", text: "Input Baru",
						template: '<button ng-click="tambahDataLab()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Data Laboratorium</button>'
							},],
						columns: [
							// {
							// 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
							// 	template: "# if (statCheckbox) { #" +
							// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
							// 		"# } else { #" +
							// 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
							// 		"# } #",
							// 	width: "30px",
							// 	attributes: {
							// 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
							//    },
							// },
							{
								"field": "no",
								"title": "No",
								"width": "30px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							{
								"field": "tglpelayanan",
								"title": "Tgl Pelayanan",
								"width": "90px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							{
								"field": "ruangan",
								"title": "Ruangan",
								"width": "120px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							{
								"field": "namaruanganasal",
								"title": "Ruangan Asal",
								"width": "120px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							// {
							//     "field": "namaproduk",
							//     "title": "Layanan",
							//     "width": "160px",
							//     "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
							//     attributes: {
							//         class: "#=flaglab != 'N' ? 'red' : 'green' #"
							//     },
							// },
							{
								"field": "namaproduk",
								"title": "Layanan",
								"width": "160px",
								"template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
										// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
								},
							},
							{
								"field": "dokterpemeriksa",
								"title": "Dokter Pemeriksa",
								"width": "140px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							{
								"field": "dokterpengirim",
								"title": "Dokter Pengririm",
								"width": "140px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							{
								"field": "tglhasil",
								"title": "Tgl Hasil",
								"width": "90px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							{
								"field": "tglcetak",
								"title": "Tgl Cetak",
								"width": "90px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							},
							{
								"command": [
									{ text: "Hapus", click: hapusLab, imageClass: "k-icon k-i-read" }
								],
								title: "Action",
								width: "100px",
								attributes: {
									class: "#=flaglab != 'N' ? 'red' : 'hejo' #"
								},
							}
		
						],
						sortable: {
							mode: "single",
							allowUnsort: false,
						}
					}
					grid.removeRow(row);
			}
            function hapusLab(e) {
				let labfix = [];
				e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
				 
                if (dataItem == undefined) {
                    toast.warning('Data Belum Dipilih!')
                    return;
                };
					var grid = this;
                    var row = $(e.currentTarget).closest("tr");
                    var tr = $(e.target).closest("tr");
				for (let i = 0; i < lab.length; i++) {
					if (lab[i].norec_pp == dataItem.norec_pp) {
                        let objSave = {
                            norec: dataItem.norec_pp,
                            status: 'true'
                        }
                        $scope.isRouteLoading = true;
                        medifirstService.post('emr/update-item-for-resume', objSave).then(function(e) {
                            $scope.isRouteLoading = false;
                            delete lab[i];
                            grid.removeRow(row);
                        })
					} else {
						labfix.push(lab[i])
					}
				}
				lab = labfix
			}
            //## END LAB

            $scope.listKondisi = [{
                "id": 1,
                "nama": "Rencana Tindak Lanjut atau Cara Keluar Dari RS",
                "detail": [
                    { "id": 1, "nama": "Pulang atas persetujuan Dokter" },
                    { "id": 2, "nama": "Pulang atas permintaan Sendiri" },
                    { "id": 3, "nama": "Dirujuk Ke" },
                    { "id": 4, "nama": "Rawat Inap" },
                    { "id": 5, "nama": "Lainnya" }, // freetext apabila lain lain
                ]
            }]

            $scope.listRencanaTindakLanjut = [
                { "id": 1, "nama": "Pulang atas persetujuan Dokter" },
                { "id": 2, "nama": "Pulang atas permintaan Sendiri" },
                { "id": 3, "nama": "Dirujuk Ke" },
                { "id": 4, "nama": "Rawat Inap" },
                { "id": 5, "nama": "Lainnya" }, // freetext apabila lain lain
            ];

            $scope.listTransportasi = [
                { "id": 1, "transportasi": "Ambulance" },
                { "id": 2, "transportasi": "Lain-lain" }, // freetext apabila lain lain
            ];



            $scope.listtranspot = [{
                "id": 1,
                "nama": "Sarana Transportasi Dirujuk",
                "detail": [
                    { "id": 1, "transportasi": "Ambulance" },
                    { "id": 2, "transportasi": "Lain-lain" }, // freetext apabila lain lain
                ]
            }]
            $scope.listPrognosis = [
                { id: 1, prognosis: "Baik" },
                { id: 2, prognosis: "Cenderung Baik" },
                { id: 3, prognosis: "Cenderung Tidak Baik" },
                { id: 4, prognosis: "Tidak Baik" },
                { id: 5, prognosis: "Lain-lain" }
            ];
            $scope.listKondisiKeluar = [
                { id: 1, kondisikeluar: "Stabil" },
                { id: 2, kondisikeluar: "Tidak Stabil" },
                { id: 3, kondisikeluar: "Perbaikan" },
                { id: 4, kondisikeluar: "Sembuh" },
                { id: 4, kondisikeluar: "Meninggal" }
            ];
            $scope.listCaraPulang = [
                { id: 1, carapulang: "Izin Dokter (Pulang Atas Indikasi Medis)" },
                { id: 2, carapulang: "Pulang Atas Permintaan Sendiri" },
                { id: 3, carapulang: "Pindah/Rujuk ke RS Lain" },
                { id: 4, carapulang: "Melarikan Diri" },
                { id: 5, carapulang: "Meninggal < 48 Jam" },
                { id: 6, carapulang: "Meninggal > 48 Jam" },
            ];
            //sengaja patok dari FE nya biar ga ngambil dari BE biar gak bikin API/Route baru
            $scope.listKontrol = [
                { id: 1, kontrolpoli: "Poli Paru" },
                { id: 2, kontrolpoli: "Poli Mata" },
                { id: 3, kontrolpoli: "Hemodialisa" },
                { id: 4, kontrolpoli: "Poli Bedah Orthopedi" },
                { id: 5, kontrolpoli: "Poli Eksekutif" },
                { id: 6, kontrolpoli: "Poli Bedah Umum" },
                { id: 7, kontrolpoli: "Poli Kebidanan dan Kandungan" },
                { id: 8, kontrolpoli: "Poli Gigi" },
                { id: 9, kontrolpoli: "Poli SIM" },
                { id: 10, kontrolpoli: "Poli Gizi" },
                { id: 11, kontrolpoli: "Poli Umum" },
                { id: 12, kontrolpoli: "Poli Bedah Saraf" },
                { id: 13, kontrolpoli: "Poli THT" },
                { id: 14, kontrolpoli: "Poli Syaraf" },
                { id: 15, kontrolpoli: "Poli Anak" },
                { id: 16, kontrolpoli: "Poli Pskiatri" },
                { id: 17, kontrolpoli: "Poli Jantung" },
                { id: 18, kontrolpoli: "Poli Bedah Plastik" },
                { id: 19, kontrolpoli: "Medical Check Up" },
                { id: 20, kontrolpoli: "Poli Kedokteran Nuklir" },
                { id: 21, kontrolpoli: "Poli Penyakit Dalam" },
                { id: 22, kontrolpoli: "Poli Bedah Mulut" },
                { id: 23, kontrolpoli: "Endoskopi" },
                { id: 24, kontrolpoli: "Poli Kulit dan Kelamin" },
                { id: 25, kontrolpoli: "Poli Urologi" },
                { id: 26, kontrolpoli: "Poli Bedah Anak" },
                // { id: 27, kontrolpoli: "Poli Ginjal Hipertensi" },
                // { id: 28, kontrolpoli: "Poli Gizi" },
                // { id: 29, kontrolpoli: "Poli Hemato Onkologi" },
                // { id: 30, kontrolpoli: "Poli Jantung" },
                // { id: 31, kontrolpoli: "Poli Jiwa" },
                // { id: 32, kontrolpoli: "Poli Kardiologi" },
                // { id: 33, kontrolpoli: "Poli Kebidanan" },
                // { id: 34, kontrolpoli: "Poli Kedokteran Olahraga" },
                // { id: 35, kontrolpoli: "Poli Kesehatan Ibu dan Anak" },
                // { id: 36, kontrolpoli: "Poli Kosmetik" },
                // { id: 37, kontrolpoli: "Poli Kulit dan Kelamin" },
                // { id: 38, kontrolpoli: "Poli Mata" },
                // { id: 39, kontrolpoli: "Poli Onkologi Ginekologi" },
                // { id: 40, kontrolpoli: "Poli Paru" },
                // { id: 41, kontrolpoli: "Poli Penyakit Dalam" },
                // { id: 42, kontrolpoli: "Poli Psikologi" },
                // { id: 43, kontrolpoli: "Poli Saraf" },
                // { id: 44, kontrolpoli: "Poli Thalasemi" },
                // { id: 45, kontrolpoli: "Poli THT" },
                // { id: 46, kontrolpoli: "Rekam Medis" },
                // { id: 47, kontrolpoli: "Rikes (Medical Check Up)" },
                // { id: 48, kontrolpoli: "Sentra Visum" },
                // { id: 49, kontrolpoli: "Hemodialisa" },
            ];
            $scope.SaranaTransportasi = [{
                "id": 1,
                "nama": "Sarana Transportasi Dirujuk",
                "detail": [
                    { "id": 1, "nama": "Ambulance" },
                    { "id": 2, "nama": "Lain-lain" },// freetext apabila lain lain
                ]
            }]
            $scope.listDiet = [
                { 'id': 1, 'diet': 'Diet Makanan Cair' },
                { 'id': 2, 'diet': 'Diet Makanan Lunak' },
                { 'id': 3, 'diet': 'Diet Biasa' },
                { 'id': 4, 'diet': 'Diet Rendah Kalori' },
                { 'id': 5, 'diet': 'Diet Rendah Protein' },
                { 'id': 6, 'diet': 'Diet Rendah Lemak' },
                { 'id': 7, 'diet': 'Diet Rendah Garam' },
                { 'id': 8, 'diet': 'Diet Tinggi Kalori' },
                { 'id': 9, 'diet': 'Diet Tinggi Protein' },
                { 'id': 10, 'diet': 'Diet DM' },
                { 'id': 11, 'diet': 'Diet Jantung' },
                { 'id': 12, 'diet': 'Diet Luka Bakar' },
                { 'id': 13, 'diet': 'Diet Makanan Saring' },
                { 'id': 14, 'diet': 'Diet Tlepar' },
                { 'id': 15, 'diet': 'Diet Rendah Karbohidrat' },
                { 'id': 16, 'diet': 'Diet Hipertensi' },
                { 'id': 17, 'diet': 'Diet Palatoplasty' },
                { 'id': 18, 'diet': 'Lain - Lain' },
            ]
            $scope.resumeOpt = {
                // toolbar: [{
                //     name: "create", text: "Tambah",
                //     template: '<button ng-click="inputBaru()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                // },],
                selectable: "row",
                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    // { field: "no", title: "No", width: 40 },
                    { field: "namaobat", title: "Nama Obat", width: 350 },
                    { field: "jumlah", title: "Jumlah", width: 50 },
                    { field: "dosisobat", title: "Dosis", width: 50 },
                    { field: "frekuensi", title: "Frekuensi", width: 50 },
                    { field: "carapemberian", title: "Cara Pemberian", width: 100 },
                    // { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapusData2 }, { name: "edit", text: "Edit", click: editData2 }], title: "&nbsp;", width: 120 }
                    // {command: [{name: "destroy", text: "Hapus"},{name: "edit", text: "Edit"}], title: "&nbsp;", width: 120 }
                ],

            };

            // $scope.resumeOpt = {
            //     editable: true,
            //     columns: [{
            //         field: "namaobat",
            //         title: "Nama Prodak",
            //         width: "70%"
            //     },
            //     {
            //         field: "jumlah",
            //         title: "Jumlah",
            //         width: "70%"
            //     },
            //     {
            //         field: "dosisobat",
            //         title: "Dosis Obat",
            //         width: "30%",
            //         editor: dynamicEditor
            //     },
            //     {
            //         field: "carapemberian",
            //         title: "Cara Pemberian",
            //         width: "70%"
            //     },
            // ]
            // };
            
            $scope.resumeOptHead = {
                // toolbar: [{
                //     name: "create", text: "Tambah",
                //     template: '<button ng-click="AddObatPulang()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'
                // },],
                selectable: "row",
                // scrollable: true,
                pageable: true,
                scrollable: true,
                columns: [
                    { field: "no", title: "No", width: 40 },
                    { field: "tglresume", title: "Tgl Resume", width: 150 },
                    { field: "koderesume", title: "Kode Resume", width: 150 },
                    { field: "noregistrasi", title: "No Registrasi", width: 150 },
                    { field: "namaruangan", title: "Ruangan", width: 150 },
                    { field: "tglkontrolpoli", title: "Tgl Kontrol Poliklinik", width: 150 },
                    { field: "namadokter", title: "Pegawai", width: 150 },
                    { field: "ringkasanriwayatpenyakit", title: "Ringkasan Riwayat Penyakit", width: 250 },
                    { field: "pemeriksaanfisik", title: "Pemerisaan Fisik", width: 250 },
                    { field: "pemeriksaanpenunjangaddlab", title: "Pemerisaan Penunjang", width: 250 },
                    { field: "hasilkonsultasi", title: "Hasil Konsultasi", width: 250 },
                    { field: "diagnosisawal", title: "Diagnosi Awal", width: 150 },
                    { field: "diagnosissekunder", title: "Diagnosis Sekunder", width: 150 },
                    { field: "diet", title: "Diet", width: 150 },
                    // { field: "hasilkonsultasi", title: "Hasil Konsultasi", width: 150 },
                    { field: "hasillab", title: "Hasil Lab", width: 150 },
                    { field: "instruksianjuran", title: "Intruksi", width: 150 },
                    { field: "kondisiwaktukeluar", title: "Kondisi Keluar", width: 150 },
                    { field: "pengobatandilanjutkan", title: "Pengobatan Dilanjutkan", width: 150 },
                    { field: "tindakanprosedur", title: "Tindakan Prosedur", width: 150 },
                    { field: "terapi", title: "Terapi", width: 120 },
                    { field: "alasanrawat", title: "Alasan diRawat", width: 150 },
                    { field: "kondisiklinis", title: "Kondisi Klinis", width: 150 },
                    { field: "obatobatakhir", title: "Obat Pulang", width: 150 },
                    { field: "pasienkeluarga", title: "Pasien Keluarga", width: 250 },

                    // { command: [{ imageClass: "k-icon k-delete", text: "Hapus", click: hapusHead }, { name: "edit", text: "Edit", click: editHead }], title: "&nbsp;", width: 120 }
                ],

            };

            $scope.data2 = function (dataItem) {
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
            $scope.inputBaru = function () {
                $scope.popUp.center().open()
            }
            $scope.batal = function () {
                $scope.popUp.close()
            }
            // init();
            // $scope.showInput = function () {
            //     // noregistrasi = $scope.modelGrid.noregistrasi
            //     // loadDaftarRmPp(noregistrasi);
            //     // loadDiagnosa(noregistrasi);
            //     // init();
            //     $scope.isEdit = true
            //     $scope.isGrid = false
            //     $scope.item = {}
            //     $scope.item.dokter = { id: $scope.objectpegawaifk, namalengkap: $scope.namadokter }
            //     data2 = []
            //     noregistrasi = $scope.noregistrasi
            //     nocm = $scope.nocm
            //     norecpd = $scope.norecPd
            //     loadDaftarRmPp(noregistrasi);
            //     loadDiagnosa(noregistrasi);
            //     // loadObatResepAkhir(noregistrasi);
            //     // loadObatObat(noregistrasi);
            //     // editDosisObat(noregistrasi);
            //     // editDosisObatPulang(noregistrasi);
            //     loadTindakanMedis(noregistrasi);
            //     loadRadiologi(noregistrasi);
            //     getFromPengkajianMedisRanap(noregistrasi);
            //     getVitalSignTerakhir(noregistrasi);
            //     getKonsultasi(nocm);
            //     getMateriEdukasi(norecpd);
            //     getObat(noregistrasi);
            //     getObatPulang(noregistrasi);
            //     SetCacheHelper();
            //     // statusDosisObat(noregistrasi);
            //     init();
            //     kematian();
            //     $scope.sourceResume = new kendo.data.DataSource({
            //         data: data2
            //     });

            // }
            $scope.Back = function () {
                $scope.isEdit = false
                $scope.isGrid = true
                init()
            }

            $scope.$watch('item.prognosis', function (e) {
                if (e.id == 5) {
                    $scope.prognosislainlain = true;
                } else {
                    $scope.prognosislainlain = false;
                }
            })
            $scope.$watch('item.kondisikeluar', function (e) {
                if (e.id == 8) {
                    $scope.kondisikeluarlainlain = true;
                } else {
                    $scope.kondisikeluarlainlain = false;
                }
            })
            $scope.$watch('item.saranalainnya', function (e) {
                if (e == true) {
                    $scope.saranalainlain = true;
                } else {
                    $scope.saranalainlain = false;
                }
            })
            $scope.$watch('item.kondisi', function (e) {
                if (e == "Lain-lain") {
                    $scope.saranalainlain = true;
                } else {
                    $scope.saranalainlain = false;
                }
            })
            $scope.$watch('item.kondisi', function (e) {
                if (e == "Dirujuk Ke") {
                    $scope.istransport = true;
                } else {
                    $scope.istransport = false;
                }
            })

            
            $scope.$watch('item.rencanatindaklanjut', function (e) {
                if (e.nama == "Lainnya") {
                    $scope.saranalainlain = true;
                } else {
                    $scope.saranalainlain = false;
                }
            })
            $scope.$watch('item.rencanatindaklanjut', function (e) {
                if (e.nama == "Dirujuk Ke") {
                    $scope.istransport = true;
                } else {
                    $scope.istransport = false;
                }
            })
            
            $scope.$watch('item.transportasi', function (e) {
                if (e.transportasi == "Lain-lain") {
                    $scope.istransportasilain = true;
                } else {
                    $scope.istransportasilain = false;
                }
            })


            $scope.$watch('item.iskontrolya', function (e) {
                if (e == true) {
                    $scope.iskontrolya = true;
                } else {
                    $scope.iskontrolya = false;
                }
            })

            $scope.$watch('item.isreaksiobatya', function (e) {
                if (e == true) {
                    $scope.isreaksiobatya = true;
                } else {
                    $scope.isreaksiobatya = false;
                }
            })
            
            $scope.$watch('item.israwatdirumahya', function (e) {
                if (e == true) {
                    $scope.israwatdirumahya = true;
                } else {
                    $scope.israwatdirumahya = false;
                }
            })

            function hapusData2(e) {
                e.preventDefault();
                var grid = this
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                for (var i = data2.length - 1; i >= 0; i--) {
                    if (data2[i].no == dataItem.no) {
                        data2.splice(i, 1);
                    }
                }
                grid.removeRow(dataItem);

            }

            function simpanDeletePpRm(e) {
                e.preventDefault();
                var grid = this
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                var norec_pp = ''
                norec_pp = dataItem.norec_pp
                var json = {
                    'norec': norec_pp,
                    'isrm': false
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-add-rm', json).then(function (e) {
                    if (e.status === 201) {
                        loadDaftarRmPp(noregistrasi);
                    }
                })

            }

            function simpanDeleteObat(e) {
                e.preventDefault();
                var grid = this
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                // var norec_pp = ''
                var isrm = false;
                if (dataItem.isrm == 'Tambah') {
                    var isrm = true;
                }
                var produkfk = dataItem.produkfk
                var json = {
                    'noregistrasi': $scope.noregistrasi,
                    'produkfk': produkfk,
                    'isrm': isrm
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-obat-rm', json).then(function (e) {
                    if (e.status === 201) {
                        editDosisObat(noregistrasi);
                        editDosisObatPop($scope.noregistrasi);
                    }
                })

            }

            function simpanDeleteObatPulang(e) {
                e.preventDefault();
                var grid = this
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                //  
                // var norec_pp = ''
                var ispulang = false;
                if (dataItem.ispulang == 'Tambah') {
                    var ispulang = true;
                }
                var produkfk = dataItem.produkfk
                var json = {
                    'norec_pp': dataItem.norec_pp,
                    'noregistrasi': $scope.noregistrasi,
                    'produkfk': produkfk,
                    'ispulang': ispulang
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-obat-rm-pulang', json).then(function (e) {
                    if (e.status === 201) {
                        editDosisObatPulang(noregistrasi);
                        editDosisObatPulangPop($scope.noregistrasi);
                    }
                })

            }
            // function hapusHead(e) {
            //     e.preventDefault();
            //     var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            //     if (!dataItem) {
            //         toastr.error("Data Tidak Ditemukan");
            //         return
            //     }


            // }
            $scope.editGrid = function () {
                noregistrasi = $scope.modelGrid.noregistrasi
                loadDaftarRmPp(noregistrasi);
                loadDiagnosa(noregistrasi);
                loadObatObat(noregistrasi);
                editDosisObat(noregistrasi);
                editDosisObatPulang(noregistrasi);
                // statusDosisObat(noregistrasi);
                init();
                $scope.item.norec = $scope.modelGrid.norec
                // $scope.item.obatobat = $scope.modelGrid.obatobat
                $scope.item.riwayatPenyakit = $scope.modelGrid.ringkasanriwayatpenyakit
                $scope.item.pemeriksaanFisik = $scope.modelGrid.pemeriksaanfisik
                $scope.item.pemeriksaanPenunjang = $scope.modelGrid.pemeriksaanpenunjang
                $scope.item.hasilKonsultasi = $scope.modelGrid.hasilkonsultasi
                $scope.item.reaksiobat = $scope.modelGrid.reaksiobat
                $scope.item.alasanRawat = $scope.modelGrid.alasanrawat
                $scope.item.kondisiKlinis = $scope.modelGrid.kondisiklinis
                $scope.item.terapi = $scope.modelGrid.terapi
                $scope.item.diagnosaUtama = $scope.modelGrid.diagnosisawal
                $scope.item.diagnosisSekunder = $scope.modelGrid.diagnosissekunder
                $scope.item.tindakanProsedur = $scope.modelGrid.tindakanprosedur
                $scope.item.diagnosaDokter = $scope.modelGrid.diagdok
                $scope.item.tindakanrm = $scope.modelGrid.tindakanrm
                $scope.item.alergi = $scope.modelGrid.alergi
                $scope.item.diet = $scope.modelGrid.diet
                $scope.item.intruksi = $scope.modelGrid.instruksianjuran
                $scope.item.hasilLab = $scope.modelGrid.hasillab
                $scope.item.tgllahir = $scope.modelGrid.tgllahir
                $scope.item.kondisi = $scope.modelGrid.kondisiwaktukeluar
                $scope.item.pengobatan = $scope.modelGrid.pengobatandilanjutkan
                $scope.item.tglresume = $scope.modelGrid.tglresume
                $scope.item.tglkontrolpoli = $scope.modelGrid.tglkontrolpoli
                $scope.norecAPD = $scope.modelGrid.noregistrasifk
                $scope.item.dokter = { id: $scope.modelGrid.objectpegawaifk, namalengkap: $scope.modelGrid.namadokter }
                data2 = $scope.modelGrid.details
                $scope.item.pasienKeluarga = $scope.modelGrid.pasienkeluarga
                for (let index = 0; index < data2.length; index++) {
                    data2[index].no = index + 1;
                }
                $scope.sourceResume = new kendo.data.DataSource({
                    data: data2
                });
                $scope.isGrid = false
                $scope.isEdit = true
            }
            // function editHead(e) {
            //     e.preventDefault();
            //     var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            //     if (!dataItem) {
            //         toastr.error("Data Tidak Ditemukan");
            //         return
            //     }
            //     $scope.item.norec = dataItem.norec
            //     $scope.item.riwayatPenyakit = dataItem.ringkasanriwayatpenyakit
            //     $scope.item.pemeriksaanFisik = dataItem.pemeriksaanfisik
            //     $scope.item.pemeriksaanPenunjang = dataItem.pemeriksaanpenunjang
            //     $scope.item.hasilKonsultasi = dataItem.hasilkonsultasi
            //     $scope.item.terapi = dataItem.terapi
            //     $scope.item.diagnosaUtama = dataItem.diagnosisutama
            //     $scope.item.diagnosisSekunder = dataItem.diagnosissekunder
            //     $scope.item.tindakanProsedur = dataItem.tindakanprosedur
            //     $scope.item.alergi = dataItem.alergi
            //     $scope.item.diet = dataItem.diet
            //     $scope.item.intruksi = dataItem.instruksianjuran
            //     $scope.item.hasilLab = dataItem.hasillab
            //     $scope.item.kondisi = dataItem.kondisiwaktukeluar
            //     $scope.item.pengobatan = dataItem.pengobatandilanjutkan
            //     data2 = dataItem.details
            //     $scope.sourceResume = new kendo.data.DataSource({
            //         data: data2
            //     });
            //     $scope.isGrid = false
            //     $scope.isEdit = true


            // }
            function editData2(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (!dataItem) {
                    toastr.error("Data Tidak Ditemukan");
                    return
                }
                $scope.item.no = dataItem.no
                $scope.item.namaobat = dataItem.namaobat
                $scope.item.jumlah = dataItem.jumlah
                $scope.item.dosis = dataItem.dosis
                $scope.item.frekuensi = dataItem.frekuensi
                $scope.item.carapemberian = dataItem.carapemberian

                $scope.popUp.center().open()

            }

            function loadAll() {
                // noregistrasi = $scope.modelGrid.noregistrasi
                // loadDaftarRmPp(noregistrasi);
                // loadDiagnosa(noregistrasi);
                // init();
                // $scope.isEdit = true
                // $scope.isGrid = false
                // $scope.item = {}
                // $scope.item.dokter = { id: $scope.objectpegawaifk, namalengkap: $scope.namadokter }
                data2 = []
                noregistrasi = $scope.noregistrasi
                nocm = $scope.nocm
                norecpd = $scope.norecPd
                loadDaftarRmPp(noregistrasi);
                loadDiagnosa(noregistrasi);
                // loadObatResepAkhir(noregistrasi);
                // loadObatObat(noregistrasi);
                // editDosisObat(noregistrasi);
                // editDosisObatPulang(noregistrasi);
                loadTindakanMedis(noregistrasi);
                loadRadiologi(noregistrasi);
                // getFromPengkajianMedisRanap(noregistrasi);
                // getVitalSignTerakhir(noregistrasi);
                // getMateriEdukasi(norecpd);
                // getObat(noregistrasi);
                debugger
                if ($scope.norec == '-') {
                    getObatPulang(noregistrasi);
                    getKonsultasi(nocm);
                } else {
                    getObatPulang(noregistrasi);
                    getObat(noregistrasi);
                }
                // SetCacheHelper();
                // statusDosisObat(noregistrasi);
                // init();
                kematian();
                $scope.sourceResume = new kendo.data.DataSource({
                    data: data2
                });
            }



            $scope.saveIcd10 = function () {
                 
                if (tampungdiagnosa.length > 0) {
                    for (let i = 0; i < tampungdiagnosa.length; i++) {
                        if (tampungdiagnosa[i].objectjenisdiagnosafk == "1") {
                            if ($scope.item.jenisDiagnosis.id == "1") {
                                toastr.error('Diagnosa Primary / Utama Hanya Boleh Diinput 1 Kali !')
                                return
                            }
                        }
                    }
                }
                validasiIcd10();
                console.log(JSON.stringify($scope.objSave));
                medifirstService.post('emr/save-diagnosa-pasien', $scope.objSave).then(function (e) {

                    $scope.savePeriksaDokter()
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
                        'Input Diagnosis ICD 10 ( ' + $scope.item.diagnosa.kdDiagnosa + '-' + $scope.item.diagnosa.namaDiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
                        + '/ ' + $scope.item.nocm
                    ).then(function (res) {
                    })
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosa;
                    delete $scope.item.keterangan;
                    delete $scope.dataIcd10Selected;
                    
                    loadDiagnosa($scope.cc.noregistrasi)
                    
                })
            }
            function validasiIcd10() {
                var listRawRequired = [
                    "item.diagnosa|k-ng-model|kode / Nama Diagnosa",
                    "item.jenisDiagnosis|k-ng-model|kode / Jenis Diagnosa"
                ]
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var norec_diagnosapasien = "";
                    var tglinput = "";
                    if ($scope.dataIcd10Selected != undefined) {
                        norec_diagnosapasien = $scope.dataIcd10Selected.norec_diagnosapasien
                        tglinput = $scope.dataIcd10Selected.tglinputdiagnosa
                    } else {
                        tglinput = moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                    }
                    var keterangan = "";
                    if ($scope.item.keterangan == undefined) {
                        keterangan = "-"
                    }
                    else {
                        keterangan = $scope.item.keterangan
                    }

                    $scope.now = new Date();
                    var data = {
                        norec_dp: norec_diagnosapasien,
                        noregistrasifk: $scope.cc.norec,
                        tglregistrasi: moment($scope.cc.tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosafk: $scope.item.diagnosa.id,
                        objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                        tglinputdiagnosa: tglinput,
                        keterangan: keterangan,
                        kasusbaru: $scope.item.kasusbaru,
                        kasuslama: $scope.item.kasuslama
                    }

                    $scope.objSave =
                    {
                        detaildiagnosapasien: data,
                    }
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }

            $scope.deleteIcd10 = function () {
                if ($scope.item.diagnosa == undefined) {
                    toast.warning('Pilih data yang mau di hapus!!')
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.dataIcd10Selected.norec_diagnosapasien
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('emr/delete-diagnosa-pasien', objDelete).then(function (e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', '',
                        'Hapus Diagnosis ICD 10 ( ' + $scope.dataIcd10Selected.kddiagnosa + '-' + $scope.dataIcd10Selected.namadiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi +
                        '/ ' + $scope.item.noMr

                    ).then(function (res) { })
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosa;
                    delete $scope.item.keterangan;
                    delete $scope.dataIcd10Selected
                    loadDiagnosa($scope.cc.noregistrasi)


                })
            }

            function deleteIcd10(norec_diagnosapasien) {
                var diagnosa = {
                    norec_dp: norec_diagnosapasien
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('emr/delete-diagnosa-pasien', objDelete).then(function (e) {
                    // medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', '',
                    //     'Hapus Diagnosis ICD 10 ( ' + $scope.dataIcd10Selected.kddiagnosa + '-' + $scope.dataIcd10Selected.namadiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
                    //     + '/ ' + $scope.item.noMr

                    // ).then(function (res) {
                    // })
                    // delete $scope.item.jenisDiagnosis;
                    // delete $scope.item.diagnosa;
                    // delete $scope.item.keterangan;
                    // delete $scope.dataIcd10Selected
                    loadDiagnosa($scope.cc.noregistrasi)


                })
            }

            $scope.saveIcd9 = function () {
                //  if(medifirstService.getPegawai().jenisPegawai != undefined && medifirstService.getPegawai().jenisPegawai.jenispegawai !='DOKTER'){
                //     toastr.error('Hanya Dokter yang bisa mengisi Diagnosis','Peringatan')
                //     return
                // }
                validasi();
                console.log(JSON.stringify($scope.objSave));
                medifirstService.post('emr/save-diagnosa-tindakan-pasien', $scope.objSave).then(function (e) {

                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
                        'Input Diagnosis ICD 9 ( ' + $scope.item.diagnosaTindakan.kdDiagnosaTindakan + '-' + $scope.item.diagnosaTindakan.namaDiagnosaTindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi +
                        '/ ' + $scope.item.noMr

                    ).then(function (res) { })
                    delete $scope.item.diagnosaTindakan;
                    delete $scope.item.ketTindakan;
                    delete $scope.dataIcd9Selected;
                    loadDiagnosa($scope.cc.noregistrasi)
                })
            }

            function validasi() {
                var listRawRequired = [
                    "item.diagnosaTindakan|k-ng-model|kode / Nama Diagnosa"
                ]
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var norec_diagnosapasien = "";
                    if ($scope.dataIcd9Selected != undefined) {
                        norec_diagnosapasien = $scope.dataIcd9Selected.norec_diagnosapasien
                    }
                    var ketTindakans = "";
                    if ($scope.item.ketTindakan != undefined) {
                        ketTindakans = $scope.item.ketTindakan
                    }
                    var data = {
                        norec_dp: norec_diagnosapasien,
                        objectpasienfk: $scope.norecAPD,
                        tglpendaftaran: moment($scope.item.tglMasuk).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosatindakanfk: $scope.item.diagnosaTindakan.id,
                        keterangantindakan: ketTindakans
                    }

                    $scope.objSave = {
                        detaildiagnosatindakanpasien: data,
                    }
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }
            $scope.deleteIcd9 = function () {
                if ($scope.item.diagnosaTindakan == undefined) {
                    toastr.warning('Pilih data yang mau di hapus!!')
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.dataIcd9Selected.norec_diagnosapasien
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('emr/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', '',
                        'Hapus Diagnosis ICD 9 ( ' + $scope.dataIcd9Selected.kddiagnosatindakan + '-' + $scope.dataIcd9Selected.namadiagnosatindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi +
                        '/ ' + $scope.item.noMr

                    ).then(function (res) { })
                    delete $scope.item.diagnosaTindakan;
                    delete $scope.item.ketTindakan;
                    delete $scope.dataIcd9Selected
                    loadDiagnosa($scope.cc.noregistrasi)

                })
            }

            function deleteIcd9(norec_diagnosapasien) {
                var diagnosa = {
                    norec_dp: norec_diagnosapasien
                }
                var objDelete = {
                    diagnosa: diagnosa,
                }
                medifirstService.post('emr/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
                    // medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', '',
                    //     'Hapus Diagnosis ICD 10 ( ' + $scope.dataIcd10Selected.kddiagnosa + '-' + $scope.dataIcd10Selected.namadiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
                    //     + '/ ' + $scope.item.noMr

                    // ).then(function (res) {
                    // })
                    // delete $scope.item.jenisDiagnosis;
                    // delete $scope.item.diagnosa;
                    // delete $scope.item.keterangan;
                    // delete $scope.dataIcd10Selected
                    loadDiagnosa($scope.cc.noregistrasi)


                })
            }

            $scope.savePeriksaDokter = function () {

                var kelompokUser = medifirstService.getKelompokUser()
                // var chacePeriode = cacheHelper.get('InputTindakanPelayananDokterRevCtrl');
                if (kelompokUser == 'dokter') {
                    var data = {
                        "norec_apd": norec_apd,
                        "kelompokUser": kelompokUser
                    }
                    medifirstService.postNonMessage('rawatjalan/save-periksa', data)
                        .then(function (res) {

                        })
                }
            }
            $scope.klikIcd9 = function (dataIcd9Selected) {
                $scope.item.diagnosaTindakan = {
                    id: dataIcd9Selected.id,
                    namaDiagnosaTindakan: dataIcd9Selected.namadiagnosatindakan,
                    kodeNama: dataIcd9Selected.kddiagnosatindakan + ' - ' + dataIcd9Selected.namadiagnosatindakan,
                    kdDiagnosaTindakan: dataIcd9Selected.kddiagnosatindakan
                }
                $scope.item.ketTindakan = dataIcd9Selected.keterangantindakan
                $scope.findBy = "1";
            }
            $scope.klikIcd10 = function (dataIcd10Selected) {
                $scope.item.jenisDiagnosis = {
                    id: dataIcd10Selected.objectjenisdiagnosafk,
                    jenisDiagnosa: dataIcd10Selected.jenisdiagnosa
                }

                $scope.item.diagnosa = {
                    id: dataIcd10Selected.id,
                    namaDiagnosa: dataIcd10Selected.namadiagnosa,
                    kdDiagnosa: dataIcd10Selected.kddiagnosa,
                    kodeNama: dataIcd10Selected.kddiagnosa + ' - ' + dataIcd10Selected.namadiagnosa
                }
                $scope.item.keterangan = dataIcd10Selected.keterangan
                if (dataIcd10Selected.iskasusbaru == '1') {
                    $scope.item.kasusbaru = true
                    $scope.item.kasuslama = false
                } else {
                    $scope.item.kasusbaru = false
                    $scope.item.kasuslama = true
                }
                // if (dataIcd10Selected.iskasuslama = '1') {
                //     $scope.item.kasuslama = true
                //     $scope.item.kasusbaru = false
                // }else{
                //     $scope.item.kasuslama = false
                //     $scope.item.kasusbaru = true
                // }

                $scope.findBy = "1";
            }

            function validasiIcd10() {
                var listRawRequired = [
                    "item.diagnosa|k-ng-model|kode / Nama Diagnosa",
                    "item.jenisDiagnosis|k-ng-model|kode / Jenis Diagnosa"
                ]
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var norec_diagnosapasien = "";
                    var tglinput = "";
                    if ($scope.dataIcd10Selected != undefined) {
                        norec_diagnosapasien = $scope.dataIcd10Selected.norec_diagnosapasien
                        tglinput = $scope.dataIcd10Selected.tglinputdiagnosa
                    } else {
                        tglinput = moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                    }
                    var keterangan = "";
                    if ($scope.item.keterangan == undefined) {
                        keterangan = "-";
                    } else {
                        keterangan = $scope.item.keterangan
                    }

                    $scope.now = new Date();
                    var data = {
                        norec_dp: norec_diagnosapasien,
                        noregistrasifk: $scope.norecAPD,
                        tglregistrasi: moment($scope.item.tglMasuk).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosafk: $scope.item.diagnosa.id,
                        objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                        tglinputdiagnosa: tglinput,
                        keterangan: keterangan,
                        kasusbaru: $scope.item.kasusbaru,
                        kasuslama: $scope.item.kasuslama
                    }

                    $scope.objSave = {
                        detaildiagnosapasien: data,
                    }
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }

            // $rootScope.getRekamMedisCheck = function (bool) {
            //     if (bool) {
            //         $scope.isRouteLoading = true;
            //         var param = "noReg=" + $scope.item.noregistrasi;
            //         medifirstService.get("emr/get-diagnosapasienbynoregicd9?" +
            //             param
            //         ).then(function (data) {
            //             $scope.isRouteLoading = false;
            //             var dataICD9 = data.data.datas;
            //             $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
            //                 data: dataICD9,
            //                 pageSize: 10
            //             });
            //         });

            //         medifirstService.get("emr/get-diagnosapasienbynoreg?" +
            //             param
            //         ).then(function (data) {
            //             // $scope.isRouteLoading = false;
            //             var dataICD10 = data.data.datas;
            //             $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
            //                 data: dataICD10,
            //                 pageSize: 10
            //             });
            //         });
            //     } else {
            //         $scope.isRouteLoading = true;
            //         var param = "noCm=" + $scope.item.noMr;
            //         medifirstService.get("emr/get-diagnosapasienbynoregicd9?" +
            //             param
            //         ).then(function (data) {
            //             $scope.isRouteLoading = false;
            //             var dataICD9 = data.data.datas;
            //             $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
            //                 data: dataICD9,
            //                 pageSize: 10
            //             });
            //         });

            //         medifirstService.get("emr/get-diagnosapasienbynoreg?" +
            //             param
            //         ).then(function (data) {
            //             // $scope.isRouteLoading = fals e;
            //             var dataICD10 = data.data.datas;
            //             $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
            //                 data: dataICD10,
            //                 pageSize: 10
            //             });
            //         });

            //     }
            // }

            // loadDiagnosa();
            function loadDiagnosa(noregistrasi) {
                $scope.isLoading = true;
                $scope.isRouteLoading = true;
                $scope.data = {
                    names: [],
                    namey: [],
                    namez: [],
                    namea: []
                };

                $scope.isRouteLoading = true;
                var param = ""
                // if($scope.dataParams.noRegistrasi == true)
                param = "noReg=" + noregistrasi;
                // else
                //   param = "noCm=" + $scope.item.noCm;

                medifirstService.get("emr/get-diagnosapasienbynoregicd9-rm?" +
                    param
                ).then(function (data) {
                    var indez = 1;
                    // $scope.isRouteLoading = false;
                    if (data.data.datas.length > 0) {
                        // setRow();
                        for (var i = 0; i < data.data.datas.length; i++) {
                            if (data.data.datas[i].kddiagnosatindakan == null || data.data.datas[i].kddiagnosatindakan == "") {
                                var name = { kddiagnosatindakan: { id: data.data.datas[i].id, kdDiagnosaTindakan: data.data.datas[i].kddiagnosatindakan }, keterangan: data.data.datas[i].keterangantindakan, norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien, norec_apd: data.data.datas[i].norec_apd, objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk, tglregistrasi: $scope.tglregistrasi, iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa };
                            } else {
                                var name = { kddiagnosatindakan: { id: data.data.datas[i].id, kdDiagnosaTindakan: data.data.datas[i].kddiagnosatindakan }, keterangan: data.data.datas[i].namadiagnosatindakan, norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien, norec_apd: data.data.datas[i].norec_apd, objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk, tglregistrasi: $scope.tglregistrasi, iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa };
                            }
                            $scope.data.namez.splice(indez + 1, i, name);
                            indez = indez + 1
                        }
                        // } else {
                        //     var name = {kddiagnosatindakan:{id: null, kdDiagnosaTindakan: ""}, keterangan: "", norec_diagnosapasien: "", norec_apd: $scope.norecAPD, objectjenisdiagnosafk: "", tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'), iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss')};
                        //     if($scope.data.namez.length <= indey+1){
                        //          $scope.data.namez.splice(indey+1,0,name);
                        //      }
                        //     // $scope.data.names[0].kddiagnosa = 0
                        //     // $scope.data.names[0].keterangan = 0
                    }
                    if (indez == 1) {
                        var name = { kddiagnosatindakan: { id: null, kdDiagnosaTindakan: "" }, keterangan: "", norec_diagnosapasien: "", norec_apd: $scope.norecAPD, objectjenisdiagnosafk: "", tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'), iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss') };
                        // if($scope.data.namez.length <= indey+1){
                        $scope.data.namez.splice(indez + 1, 0, name);
                        //  }
                    }
                    // $scope.isRouteLoading = false;
                    var dataICD9 = data.data.datas;
                    tindakan = data.data.datas;
                    $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                        data: dataICD9,
                        pageSize: 10
                    });
                });

                medifirstService.get("emr/get-diagnosapasienbynoreg-rm?" +
                    param
                ).then(function (data) {
                    ICD10 = data.data.datas;
                    var index = 1;
                    var indey = 1;
                    var indea = 1;
                    // $scope.isRouteLoading = false;
                    if (data.data.datas.length > 0) {
                        // setRow();
                        for (var i = 0; i < data.data.datas.length; i++) {
                            if (data.data.datas[i].objectjenisdiagnosafk == 1) {
                                if (data.data.datas[i].kddiagnosa == null || data.data.datas[i].kddiagnosa == "") {
                                    var name = { kddiagnosa: { id: data.data.datas[i].id, kdDiagnosa: data.data.datas[i].kddiagnosa }, keterangan: data.data.datas[i].keterangan, norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien, norec_apd: data.data.datas[i].norec_apd, objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk, tglregistrasi: $scope.tglregistrasi, iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa };
                                } else {
                                    var name = { kddiagnosa: { id: data.data.datas[i].id, kdDiagnosa: data.data.datas[i].kddiagnosa }, keterangan: data.data.datas[i].namadiagnosa, norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien, norec_apd: data.data.datas[i].norec_apd, objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk, tglregistrasi: $scope.tglregistrasi, iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa };
                                }
                                $scope.data.names.splice(index + 1, i, name);
                                index = index + 1
                            } else if (data.data.datas[i].objectjenisdiagnosafk == 2) {
                                if (data.data.datas[i].kddiagnosa == null || data.data.datas[i].kddiagnosa == "") {
                                    var name = { kddiagnosa: { id: data.data.datas[i].id, kdDiagnosa: data.data.datas[i].kddiagnosa }, keterangan: data.data.datas[i].keterangan, norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien, norec_apd: data.data.datas[i].norec_apd, objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk, tglregistrasi: $scope.tglregistrasi, iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa };
                                } else {
                                    var name = { kddiagnosa: { id: data.data.datas[i].id, kdDiagnosa: data.data.datas[i].kddiagnosa }, keterangan: data.data.datas[i].namadiagnosa, norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien, norec_apd: data.data.datas[i].norec_apd, objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk, tglregistrasi: $scope.tglregistrasi, iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa };
                                }
                                $scope.data.namey.splice(indey + 1, i, name);
                                indey = indey + 1
                            } else if (data.data.datas[i].objectjenisdiagnosafk == 5) {
                                if (data.data.datas[i].kddiagnosa == null || data.data.datas[i].kddiagnosa == "") {
                                    var name = { kddiagnosa: { id: data.data.datas[i].id, kdDiagnosa: data.data.datas[i].kddiagnosa }, keterangan: data.data.datas[i].keterangan, norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien, norec_apd: data.data.datas[i].norec_apd, objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk, tglregistrasi: $scope.tglregistrasi, iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa };
                                } else {
                                    var name = { kddiagnosa: { id: data.data.datas[i].id, kdDiagnosa: data.data.datas[i].kddiagnosa }, keterangan: data.data.datas[i].namadiagnosa, norec_diagnosapasien: data.data.datas[i].norec_diagnosapasien, norec_apd: data.data.datas[i].norec_apd, objectjenisdiagnosafk: data.data.datas[i].objectjenisdiagnosafk, tglregistrasi: $scope.tglregistrasi, iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: data.data.datas[i].tglinputdiagnosa };
                                }
                                $scope.data.namea.splice(indea + 1, i, name);
                                indea = indea + 1
                            }
                        }
                    }
                    if (index == 1) {
                        var name = { kddiagnosa: { id: null, kdDiagnosa: "" }, keterangan: "", norec_diagnosapasien: "", norec_apd: $scope.norecAPD, objectjenisdiagnosafk: "", tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'), iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss') };
                        if ($scope.data.names.length <= index + 1) {
                            $scope.data.names.splice(index + 1, 0, name);
                        }
                    }
                    if (indey == 1) {
                        var name = { kddiagnosa: { id: null, kdDiagnosa: "" }, keterangan: "", norec_diagnosapasien: "", norec_apd: $scope.norecAPD, objectjenisdiagnosafk: "", tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'), iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss') };
                        if ($scope.data.namey.length <= indey + 1) {
                            $scope.data.namey.splice(indey + 1, 0, name);
                        }
                    }
                    if (indea == 1) {
                        var name = { kddiagnosa: { id: null, kdDiagnosa: "" }, keterangan: "", norec_diagnosapasien: "", norec_apd: $scope.norecAPD, objectjenisdiagnosafk: "", tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'), iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss') };
                        if ($scope.data.namea.length <= indea + 1) {
                            $scope.data.namea.splice(indea + 1, 0, name);
                        }
                    }
                    var dataICD10 = data.data.datas;
                    $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                        data: dataICD10,
                        pageSize: 10
                    });

                    // setTimeout(function() {
                    //     for (var x = 0; x < data.data.datas.length; x++) {
                    //     // $scope.data.names[x].kddiagnosa = {id: data.data.datas[x].kddiagnosa, namalengkap: data.data.datas[x].kddiagnosa}
                    //     $scope.data.names[x].keterangan = data.data.datas[x].keterangan
                    //     // var name = {kddiagnosa:data.data.datas[i].kddiagnosa, keterangan:data.data.datas[i].keterangan};
                    //     // $scope.data.names.splice(index + 1,0,name);
                    //     // index = index + 1
                    //     }
                    // }, 0);
                    // medifirstService.get("emr/get-diagnosapasienbynoreg?"
                    //     + param
                    // ).then(function (asd) {
                    //     for (var x = 0; x < asd.data.datas.length; x++) {
                    //     // $scope.data.names[x].kddiagnosa = {id: data.data.datas[x].kddiagnosa, namalengkap: data.data.datas[x].kddiagnosa}
                    //     $scope.data.names[x].keterangan = asd.data.datas[x].keterangan
                    //     // var name = {kddiagnosa:data.data.datas[i].kddiagnosa, keterangan:data.data.datas[i].keterangan};
                    //     // $scope.data.names.splice(index + 1,0,name);
                    //     // index = index + 1
                    //     }
                    // // if($scope.data.names.length <= index + 1 && i == j && j == k && k == l){
                    // //     $scope.data.names.splice(index + 1,0,name);
                    // //     index = index + 1
                    // // }
                    // icd10(param);
                    // });
                    // icd10(param);
                    $scope.isLoading = false;
                    $scope.isRouteLoading = false;
                });
            }

            $scope.columnDiagnosaIcd9 = [{
                "title": "No",
                "template": "{{dataSourceDiagnosaIcd9.indexOf(dataItem) + 1}}",
                "width": "30px"
            },
            {
                "field": "noregistrasi",
                "title": "No Registrasi",
                "width": "100px"
            }, {
                "field": "kddiagnosatindakan",
                "title": "Kode ICD 9",
                "width": "100px"
            }, {
                "field": "namadiagnosatindakan",
                "title": "Nama ICD 9",
                "width": "300px"
            }, {
                "field": "keterangantindakan",
                "title": "Keterangan",
                "width": "200px"
            }, {
                "field": "namaruangan",
                "title": "Ruangan",
                "width": "200px"
            },
            {
                "field": "namalengkap",
                "title": "Penginput",
                "width": "200px"
            },
            {
                "field": "tglinputdiagnosa",
                "title": "Tgl Input",
                "width": "200px"
            }
            ];
            $scope.columnDiagnosaIcd10 = [{
                "title": "No",
                "template": "{{dataSourceDiagnosaIcd10.indexOf(dataItem) + 1}}",
                "width": "30px"
            },
            {
                "field": "noregistrasi",
                "title": "No Registrasi",
                "width": "100px"
            }, {
                "field": "jenisdiagnosa",
                "title": "Jenis Diagnosis",
                "width": "150px"
            }, {
                "field": "kddiagnosa",
                "title": "Kode ICD 10",
                "width": "100px"
            }, {
                "field": "namadiagnosa",
                "title": "Nama ICD 10",
                "width": "300px"
            }, {
                "field": "keterangan",
                "title": "Keterangan",
                "width": "200px"
            }, {
                "field": "namaruangan",
                "title": "Ruangan",
                "width": "150px"
            },
            {
                "field": "namalengkap",
                "title": "Penginput",
                "width": "200px"
            },
            {
                "field": "tglinputdiagnosa",
                "title": "Tgl Input",
                "width": "200px"
            }
            ];

            // $scope.Save = function(data) {
            //     //  
            //     var dataDiagnosaD10 = [];
            //     var dataDiagnosaD9 = [];
            //     for (var i = 0; i < $scope.data.names.length; i++) {
            //         if ($scope.data.names[i].keterangan == null || $scope.data.names[i].keterangan == "") {
            //             messageContainer.error("Diagnosa Utama Harus Diisi!!");
            //             return;
            //         }
            //         var datanames = {
            //             norec_dp: $scope.data.names[i].norec_diagnosapasien,
            //             noregistrasifk: $scope.data.names[i].norec_apd,
            //             tglregistrasi: moment($scope.data.names[i].tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
            //             objectdiagnosafk: $scope.data.names[i].kddiagnosa.id,
            //             objectjenisdiagnosafk: "1",
            //             tglinputdiagnosa: moment($scope.data.names[i].tglinputdiagnosa).format('YYYY-MM-DD HH:mm:ss'),
            //             keterangan: $scope.data.names[i].keterangan,
            //             kasusbaru: undefined,
            //             kasuslama: undefined
            //         }
            //         dataDiagnosaD10.push(datanames);
            //     }
            //     for (var i = 0; i < $scope.data.namey.length; i++) {
            //         if ($scope.data.namey[i].keterangan == null || $scope.data.namey[i].keterangan == "") {
            //             messageContainer.error("Diagnosa Sekunder Harus Diisi!!");
            //             return;
            //         }
            //         var datanamey = {
            //             norec_dp: $scope.data.namey[i].norec_diagnosapasien,
            //             noregistrasifk: $scope.data.namey[i].norec_apd,
            //             tglregistrasi: moment($scope.data.namey[i].tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
            //             objectdiagnosafk: $scope.data.namey[i].kddiagnosa.id,
            //             objectjenisdiagnosafk: "2",
            //             tglinputdiagnosa: moment($scope.data.namey[i].tglinputdiagnosa).format('YYYY-MM-DD HH:mm:ss'),
            //             keterangan: $scope.data.namey[i].keterangan,
            //             kasusbaru: undefined,
            //             kasuslama: undefined
            //         }
            //         dataDiagnosaD10.push(datanamey);
            //     }
            //     for (var i = 0; i < $scope.data.namea.length; i++) {
            //         if ($scope.data.namea[i].keterangan == null || $scope.data.namea[i].keterangan == "") {
            //             messageContainer.error("Diagnosa Awal Harus Diisi!!");
            //             return;
            //         }
            //         var datanamea = {
            //             norec_dp: $scope.data.namea[i].norec_diagnosapasien,
            //             noregistrasifk: $scope.data.namea[i].norec_apd,
            //             tglregistrasi: moment($scope.data.namea[i].tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
            //             objectdiagnosafk: $scope.data.namea[i].kddiagnosa.id,
            //             objectjenisdiagnosafk: "5",
            //             tglinputdiagnosa: moment($scope.data.namea[i].tglinputdiagnosa).format('YYYY-MM-DD HH:mm:ss'),
            //             keterangan: $scope.data.namea[i].keterangan,
            //             kasusbaru: undefined,
            //             kasuslama: undefined
            //         }
            //         dataDiagnosaD10.push(datanamea);
            //     }

            //     for (var i = 0; i < $scope.data.namez.length; i++) {
            //         if ($scope.data.namez[i].keterangan == null || $scope.data.namez[i].keterangan == "") {
            //             messageContainer.error("Tindakan / Prosedur Harus Diisi!!");
            //             return;
            //         }
            //         var datanamez = {
            //                 norec_dp: $scope.data.namez[i].norec_diagnosapasien,
            //                 objectpasienfk: $scope.data.namez[i].norec_apd,
            //                 tglpendaftaran: moment($scope.data.namez[i].tglregistrasi).format('YYYY-MM-DD hh:mm:ss'),
            //                 objectdiagnosatindakanfk: $scope.data.namez[i].kddiagnosatindakan.id,
            //                 objectjenisdiagnosafk: "2",
            //                 tglinputdiagnosa: moment($scope.data.namez[i].tglinputdiagnosa).format('YYYY-MM-DD HH:mm:ss'),
            //                 keterangantindakan: $scope.data.namez[i].keterangan,
            //                 kasusbaru: undefined,
            //                 kasuslama: undefined
            //             }
            //             // var data = {
            //             //     norec_dp: norec_diagnosapasien,
            //             //     objectpasienfk: $scope.norecAPD,
            //             //     tglpendaftaran: moment($scope.item.tglMasuk).format('YYYY-MM-DD hh:mm:ss'),
            //             //     objectdiagnosatindakanfk: $scope.item.diagnosaTindakan.id,
            //             //     keterangantindakan: ketTindakans
            //             // }
            //         dataDiagnosaD9.push(datanamez);
            //     }

            //     var objSaveD10 = {
            //         dataDiagnosaD10: dataDiagnosaD10
            //     }

            //     var objSaveD9 = {
            //         dataDiagnosaD9: dataDiagnosaD9
            //     }

            //     medifirstService.post('emr/save-diagnosa-pasien-rm', JSON.stringify(objSaveD10)).then(function(e) {
            //         // medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
            //         //     'Input Diagnosis ICD 10 ( ' + $scope.data.namey[i].keterangan, + ' )' + ' No Registrasi ' + $scope.noregistrasi
            //         //     + '/ ' + $scope.nocm
            //         // ).then(function (res) {
            //         // })
            //     })

            //     medifirstService.post('emr/save-diagnosa-tindakan-pasien-rm', JSON.stringify(objSaveD9)).then(function(e) {
            //         // medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
            //         //     'Input Diagnosis ICD 10 ( ' + $scope.data.namey[i].keterangan, + ' )' + ' No Registrasi ' + $scope.noregistrasi
            //         //     + '/ ' + $scope.nocm
            //         // ).then(function (res) {
            //         // })
            //     })

            //     var item = {
            //         "norec": $scope.item.norec != undefined ? $scope.item.norec : "",
            //         "ringkasanriwayatpenyakit": $scope.item.riwayatPenyakit != undefined ? $scope.item.riwayatPenyakit : "",
            //         "pemeriksaanfisik": $scope.item.pemeriksaanFisik != undefined ? $scope.item.pemeriksaanFisik : "",
            //         "pemeriksaanpenunjang": $scope.item.pemeriksaanPenunjang != undefined ? $scope.item.pemeriksaanPenunjang : "",
            //         "pasienkeluarga": $scope.item.pasienKeluarga != undefined ? $scope.item.pasienKeluarga : "",
            //         "hasilkonsultasi": $scope.item.hasilKonsultasi != undefined ? $scope.item.hasilKonsultasi : "",
            //         "terapi": $scope.item.terapi != undefined ? $scope.item.terapi : null,
            //         "alasanrawat": $scope.item.alasanRawat != undefined ? $scope.item.alasanRawat : null,
            //         "kondisiklinis": $scope.item.kondisiKlinis != undefined ? $scope.item.kondisiKlinis : null,
            //         "diagnosisutama": $scope.item.diagnosaUtama != undefined ? $scope.item.diagnosaUtama : "",
            //         "diagnosissekunder": $scope.item.diagnosisSekunder != undefined ? $scope.item.diagnosisSekunder : "",
            //         "tindakanprosedur": $scope.item.tindakanProsedur != undefined ? $scope.item.tindakanProsedur : "",
            //         "alergi": $scope.item.alergi != undefined ? $scope.item.alergi : "",
            //         "diet": $scope.item.diet != undefined ? $scope.item.diet : "",
            //         "instruksianjuran": $scope.item.intruksi != undefined ? $scope.item.intruksi : "",
            //         "hasillab": $scope.item.hasilLab != undefined ? $scope.item.hasilLab : "",
            //         "kondisiwaktukeluar": $scope.item.kondisi != undefined ? $scope.item.kondisi : "",
            //         "pengobatandilanjutkan": $scope.item.pengobatan != undefined ? $scope.item.pengobatan : $scope.item.pengobatanLain,
            //         "tglkontrolpoli": $scope.item.tglkontrolpoli != undefined ?  moment($scope.item.tglkontrolpoli).format('YYYY-MM-DD') :  moment($scope.item.tglKontrolPoli).format('YYYY-MM-DD'),
            //         "tglresume": $scope.item.tglresume != undefined ? moment($scope.item.tglresume).format('YYYY-MM-DD') :  moment($scope.item.tglResume).format('YYYY-MM-DD'),
            //         "objectpegawaifk": $scope.item.dokter.id != undefined ? $scope.item.dokter.id : $scope.item.dokter.id,
            //         "noregistrasifk": $scope.norecAPD,
            //         "noregistrasi": $scope.noregistrasi,
            //         "detail": data2
            //     }


            //     medifirstService.post('emr/post-resume-medis-inap/save', item).then(function(e) {
            //         // delete $scope.item;
            //         // clear()
            //         // init();
            //         medifirstService.postLogging('Resume Medis', 'Norec resumemedis_t', e.data.resume.norec, 'Resume RI').then(function(res) {
            //             $scope.isEdit = false
            //             $scope.isGrid = true
            //             init()
            //         })
            //     });
            // };

            //## New Save
            $scope.SaveResume = function () {
                if($scope.isfinal == true) {
                    toastr.warning('Resume Sudah Final ! Tidak Bisa Di Edit !')
                    return
                }
                // if($scope.item.tglpulang == undefined){
                //     toastr.warning('Tanggal Pulang Belum Di isi !!')
                //     return;
                // }
                if ($scope.item.keluhanutama == undefined) {
                    toastr.warning('Anamnesis Masih kosong!')
                    return;
                }
                if ($scope.item.indikasirawatinap == undefined) {
                    toastr.warning('Indikasi Rawat Inap masih kosong!')
                    return;
                }
                // if ($scope.item.tekanansystolebefore == undefined || $scope.item.tekanandiastolebefore == undefined) {
                //     toastr.warning('Tekanan Darah masih kosong!')
                //     return;
                // }
                // if ($scope.item.pernafasanbefore == undefined) {
                //     toastr.warning('Pernafasan masih kosong!')
                //     return;
                // }
                // if ($scope.item.suhubefore == undefined) {
                //     toastr.warning('Suhu masih kosong!')
                //     return;
                // }
                // if ($scope.item.pfnadi == undefined) {
                //     toastr.warning('Nadi masih kosong!')
                //     return;
                // }
                // if ($scope.item.pfspo == undefined) {
                //     toastr.warning('Spo2 masih kosong!')
                //     return;
                // }
                // if ($scope.item.pfbb == undefined) {
                //     toastr.warning('Berat Badan masih kosong!')
                //     return;
                // }
                // if ($scope.item.pftb == undefined) {
                //     toastr.warning('Tinggi Badan masih kosong!')
                //     return;
                // }
                // if ($scope.item.pfe == undefined) {
                //     toastr.warning('E masih kosong!')
                //     return;
                // }
                // if ($scope.item.pfm == undefined) {
                //     toastr.warning('M masih kosong!')
                //     return;
                // }
                // if ($scope.item.pfv == undefined) {
                //     toastr.warning('V masih kosong!')
                //     return;
                // }
                if ($scope.item.pemeriksaanfisik == undefined) {
                    toastr.warning('Pemeriksaan Fisik masih kosong!')
                    return;
                }
                if ($scope.item.temuanPenting == undefined) {
                    toastr.warning('Temuan Penting masih kosong!')
                    return;
                }
                // if ($scope.item.hasilkonsultasi == undefined) {
                //     toastr.warning('Hasil Konsultasi masih kosong!')
                //     return;
                // }
                if ($scope.item.diagnosaDokter == undefined) {
                    toastr.warning('Diagnosis Dokter masih kosong!')
                    return;
                }
                if ($scope.item.tindakanrm == undefined) {
                    toastr.warning('Tindakan masih kosong!')
                    return;
                }
                // if ($scope.item.carapulang == undefined) {
                //     toastr.warning('Cara Pulang masih kosong!')
                //     return;
                // }
                // if ($scope.item.ku == undefined) {
                //     toastr.warning('Keadaan Saat Pulang bagian KU masih kosong!')
                //     return;
                // }
                // if ($scope.item.kesadaranpulang == undefined) {
                //     toastr.warning('Keadaan Saat Pulang bagian Kesadaran masih kosong!')
                //     return;
                // }
                // if ($scope.item.tekanandarah == undefined) {
                //     toastr.warning('Keadaan Saat Pulang bagian Tekanan Darah masih kosong!')
                //     return;
                // }
                // if ($scope.item.suhupulang == undefined) {
                //     toastr.warning('Keadaan Saat Pulang bagian Suhu masih kosong!')
                //     return;
                // }
                // if ($scope.item.pernafasanpulang == undefined) {
                //     toastr.warning('Keadaan Saat Pulang bagian Pernafasan masih kosong!')
                //     return;
                // }
                // if ($scope.item.nadipulang == undefined) {
                //     toastr.warning('Keadaan Saat Pulang bagian Nadi masih kosong!')
                //     return;
                // }
                // if ($scope.item.ismandiriya == undefined && $scope.item.isdibantusetengahya == undefined && $scope.item.isdibantupenuhya == undefined) {
                //     toastr.warning('Mobilisasi Saat Pulang masih kosong!')
                //     return;
                // }
                // if ($scope.item.iswalkerya == undefined && $scope.item.isalatbantulainlainya == undefined) {
                //     toastr.warning('Alat Bantu masih kosong!')
                //     return;
                // }
                // if ($scope.item.istidakadaalatkesehatanya == undefined && $scope.item.isivcateterya == undefined && $scope.item.isdobellumenya == undefined && $scope.item.isngtya == undefined && $scope.item.isoksigenya == undefined && $scope.item.iscateterurineya == undefined && $scope.item.isalatkesehatanlainlainya == undefined) {
                //     toastr.warning('Alat Kesehatan yang Terpasang masih kosong!')
                //     return;
                // }
                // if ($scope.item.islaboratoriumya == undefined && $scope.item.isradiologiya == undefined && $scope.item.ispemeriksaanpenunjanglainlainya == undefined) {
                //     toastr.warning('Perencanaan pemeriksaan penunjang masih kosong!')
                //     return;
                // }
                // if ($scope.item.ispenyakitya == undefined && $scope.item.isefeksampingobatya == undefined && $scope.item.isdietya == undefined && $scope.item.isaktifitasistirahatya == undefined && $scope.item.ishygieneya == undefined && $scope.item.isperawatanlukadirumahya == undefined && $scope.item.isnyeriya == undefined && $scope.item.isperawatanibubayiya == undefined && $scope.item.ispertolonganmendesakya == undefined && $scope.item.iskebutuhanedukasilainlainya == undefined) {
                //     toastr.warning('Kebutuhan Edukasi masih kosong!')
                //     return;
                // }
                // if ($scope.item.kesadaran == undefined) {
                //     toastr.warning('Tingkat Kesadaran Masih kosong, Harap diisi manual di Resume Medisnya atau bisa Mengisinya Di Pengkajian Medis Supaya Bisa Otomatis Masuk Ke Resume Medisnya !!')
                //     return;
                // }
                // if ($scope.item.keadaanUmum == undefined) {
                //     toastr.warning('Keadaan Umum Masih kosong, Harap diisi manual di Resume Medisnya atau bisa Mengisinya Di Pengkajian Medis Supaya Bisa Otomatis Masuk Ke Resume Medisnya !!')
                //     return;
                // }
                // if ($scope.item.diet == undefined) {
                //     toastr.warning('Diet Belum Dipilih, Silahkan Di Isi Dulu !!')
                //     return;
                // }
                // if ($scope.item.kondisikeluar == undefined) {
                //     toastr.warning('Kondisi Keluar Belum Dipilih, Silahkan Di Isi Dulu !!')
                //     return;
                // }
                // if ($scope.item?.dokter?.namalengkap == undefined) {
                //     toastr.warning('Dokter Penanggung Jawab Belum Dipilih, Silahkan Di Isi Dulu !!')
                //     return;
                // }
                // if ($scope.item.iskontroltidak == undefined && $scope.item.iskontrolya == undefined) {
                //     toastr.warning('Kontrol Ke Poliklinik Wajib Di Ceklis salah satu!')
                //     return;
                // }
                // if ($scope.item.isreaksiobattidak == undefined && $scope.item.isreaksiobatya == undefined) {
                //     toastr.warning('Reaksi Obat Wajib Di Ceklis salah satu!')
                //     return;
                // }
                // if ($scope.item.israwatdirumahya == undefined && $scope.item.israwatdirumahya == undefined) {
                //     toastr.warning('Perawatan dirumah Wajib Di Ceklis salah satu!')
                //     return;
                // }
                var iskontrolltidak = false
                if ($scope.item.iskontroltidak == true) {
                    iskontrolltidak = true;
                }
                var iskontrollya = false
                if ($scope.item.iskontrolya == true) {
                    iskontrollya = true;
                    // if($scope.item.kontrolpoli == undefined){
                    //  toastr.warning('Poliklinik Tujuan Belum Diisi !!')
                    //  return;
                    // }
                    // if($scope.item.tglkontrolpoli == undefined){
                    //  toastr.warning('Tanggal Kontrol Belum Di isi !!')
                    //  return;
                    // }
                }

                var isreaksiobatttidak = false
                if ($scope.item.isreaksiobattidak == true) {
                    isreaksiobatttidak = true;
                }
                var isreaksiobattya = false
                if ($scope.item.isreaksiobatya == true) {
                    isreaksiobattya = true;
                }

                var israwatdirumahhtidak = false
                if ($scope.item.israwatdirumahtidak == true) {
                    israwatdirumahhtidak = true;
                }
                var israwatdirumahhya = false
                if ($scope.item.israwatdirumahya == true) {
                    israwatdirumahhya = true;
                }

                var isfaskesterdekattya = false
                if ($scope.item.isfaskesterdekatya == true) {
                    isfaskesterdekattya = true;
                    // if($scope.item.faskesterdekat == undefined){
                    //     toastr.warning('Fasilitas Kesehatan Terdekat Dari Rumah Belum Diisi !!')
                    //     return;
                    // }
                }

                // if ($scope.item.keadaanumumafter == undefined) {
                //     toastr.warning('Keadaan Umum Wajib Di Isi!')
                //     return;
                // }

                var ispengobatanlanjutannya = false
                if ($scope.item.ispengobatanlanjutanya == true) {
                    ispengobatanlanjutannya = true;
                }

                var ispengobatanlukaaya = false
                if ($scope.item.ispengobatanlukaya == true) {
                    ispengobatanlukaaya = true;
                }

                var isperawatanlanjutannya = false
                if ($scope.item.isperawatanlanjutanya == true) {
                    isperawatanlanjutannya = true;
                }

                var ishomecareeya = false
                if ($scope.item.ishomecareya == true) {
                    ishomecareeya = true;
                }

                var islaboratoriummya = false
                if ($scope.item.islaboratoriumya == true) {
                    islaboratoriummya = true;
                }

                var isradiologiiya = false
                if ($scope.item.isradiologiya == true) {
                    isradiologiiya = true;
                }

                var ispemeriksaanpenunjanglainlainnya = false
                if ($scope.item.ispemeriksaanpenunjanglainlainya == true) {
                    ispemeriksaanpenunjanglainlainnya = true;
                }

                var ispenyakittya = false
                if ($scope.item.ispenyakitya == true) {
                    ispenyakittya = true;
                }

                var isefeksampingobattya = false
                if ($scope.item.isefeksampingobatya == true) {
                    isefeksampingobattya = true;
                }

                var isdiettya = false
                if ($scope.item.isdietya == true) {
                    isdiettya = true;
                }

                var isaktifitasistirahattya = false
                if ($scope.item.isaktifitasistirahatya == true) {
                    isaktifitasistirahattya = true;
                }

                var ispertolonganmendesakkya = false
                if ($scope.item.ispertolonganmendesakya == true) {
                    ispertolonganmendesakkya = true;
                }

                var iskebutuhanedukasilainlainnya = false
                if ($scope.item.iskebutuhanedukasilainlainya == true) {
                    iskebutuhanedukasilainlainnya = true;
                }

                var ishygieneeya = false
                if ($scope.item.ishygieneya == true) {
                    ishygieneeya = true;
                }

                var isperawatanlukadirumahhya = false
                if ($scope.item.isperawatanlukadirumahya == true) {
                    isperawatanlukadirumahhya = true;
                }

                var isnyeriiya = false
                if ($scope.item.isnyeriya == true) {
                    isnyeriiya = true;
                }

                var isperawatanibubayiiya = false
                if ($scope.item.isperawatanibubayiya == true) {
                    isperawatanibubayiiya = true;
                }

                var isizindokterrya = false
                if ($scope.item.isizindokterya == true) {
                    isizindokterrya = true;
                }

                var ispindahrslainnya = false
                if ($scope.item.ispindahrslainya == true) {
                    ispindahrslainnya = true;
                }

                var ispulangsendiriiya = false
                if ($scope.item.ispulangsendiriya == true) {
                    ispulangsendiriiya = true;
                }

                var ismelarikandiriiya = false
                if ($scope.item.ismelarikandiriya == true) {
                    ismelarikandiriiya = true;
                }

                var ismeninggalbeforeeya = false
                if ($scope.item.ismeninggalbeforeya == true) {
                    ismeninggalbeforeeya = true;
                }

                var ismeninggalafterrya = false
                if ($scope.item.ismeninggalafterya == true) {
                    ismeninggalafterrya = true;
                }

                var ismandiriiya = false
                if ($scope.item.ismandiriya == true) {
                    ismandiriiya = true;
                }

                var isdibantusetengahhya = false
                if ($scope.item.isdibantusetengahya == true) {
                    isdibantusetengahhya = true;
                }

                var isdibantupenuhhya = false
                if ($scope.item.isdibantupenuhya == true) {
                    isdibantupenuhhya = true;
                }

                var iswalkerrya = false
                if ($scope.item.iswalkerya == true) {
                    iswalkerrya = true;
                }

                var isalatbantulainlainnya = false
                if ($scope.item.isalatbantulainlainya == true) {
                    isalatbantulainlainnya = true;
                }

                var istidakadaalatkesehatannya = false
                if ($scope.item.istidakadaalatkesehatanya == true) {
                    istidakadaalatkesehatannya = true;
                }

                var isivcateterrya = false
                if ($scope.item.isivcateterya == true) {
                    isivcateterrya = true;
                }

                var isdobellumennya = false
                if ($scope.item.isdobellumenya == true) {
                    isdobellumennya = true;
                }

                var isngttya = false
                if ($scope.item.isngtya == true) {
                    isngttya = true;
                }

                var isoksigennya = false
                if ($scope.item.isoksigenya == true) {
                    isoksigennya = true;
                }

                var iscateterurineeya = false
                if ($scope.item.iscateterurineya == true) {
                    iscateterurineeya = true;
                }

                var isalatkesehatanlainlainnya = false
                if ($scope.item.isalatkesehatanlainlainya == true) {
                    isalatkesehatanlainlainnya = true;
                }

                var diagnosaDokter = ""
				if ($scope.item.diagnosaDokter != undefined) {
					diagnosaDokter = $scope.item.diagnosaDokter
				} else {
					diagnosaDokter = '-'
				}

                var dietkal = ''
                if($scope.item.dietkal != null && $scope.item.dietkal != undefined) dietkal=$scope.item.dietkal;


                let objSave = {
                    norec: $scope.norec,
                    satusehat: $scope.item.noSatuSehat,
                    passpor: $scope.item.passpor,
                    telppenjamin: $scope.item.notelepon,
                    tglmasuk: moment($scope.item.tglregistrasi).format('YYYY-MM-DD HH:mm'),
                    tglkeluar: moment($scope.item.tglpulang).format('YYYY-MM-DD HH:mm'),
                    keluhanutama: $scope.item.keluhanutama != undefined ? $scope.item.keluhanutama : null,
                    indikasirawatinap: $scope.item.indikasirawatinap != undefined ? $scope.item.indikasirawatinap : null,
                    terapipengobatanrumahsakit: $scope.item.terapipengobatanrumahsakit != undefined ? $scope.item.terapipengobatanrumahsakit : null,
                    terapipulang: $scope.item.terapipulang != undefined ? $scope.item.terapipulang : null,
                    tindakanrm: $scope.item.tindakanrm != undefined ? $scope.item.tindakanrm : null,
                    alergi: $scope.item.alergi != undefined ? $scope.item.alergi : null,
                    kesadaran: $scope.item.kesadaran != undefined ? $scope.item.kesadaran.kesadaran : null,
                    keadaanumum: $scope.item.keadaanUmum != undefined ? $scope.item.keadaanUmum : null,
                    jantung: $scope.item.denyutbefore != undefined ? $scope.item.denyutbefore : null,
                    pernapasan: $scope.item.pernafasanbefore != undefined ? $scope.item.pernafasanbefore : null,
                    systole: $scope.item.tekanansystolebefore != undefined ? $scope.item.tekanansystolebefore : null,
                    diastole: $scope.item.tekanandiastolebefore != undefined ? $scope.item.tekanandiastolebefore : null,                   
                    suhu: $scope.item.suhubefore != undefined ? $scope.item.suhubefore : null,                   
                    diet: $scope.item.diet != undefined ? $scope.item.diet.diet : null,
                    ketdiet: dietkal != undefined ? dietkal : null,
                    hasilkonsultasi: $scope.item.hasilkonsultasi != undefined ? $scope.item.hasilkonsultasi : null,
                    reaksiobat: $scope.item.reaksiobat != undefined ? $scope.item.reaksiobat : null,
                    prognosis: $scope.item.prognosis != undefined ? $scope.item.prognosis.prognosis : null,                   
                    kondisikeluar: $scope.item.kondisikeluar != undefined ? $scope.item.kondisikeluar.kondisikeluar : null,
                    carapulang: $scope.item.carapulang != undefined ? $scope.item.carapulang.carapulang : null,
                    //rencanatindaklanjut: $scope.item.kondisi,     
                    rencanatindaklanjut: $scope.item.rencanatindaklanjut  != undefined ? $scope.item.rencanatindaklanjut.nama : null,
                    rencanalain: $scope.item.lainlain  != undefined ? $scope.item.lainlain : null,
                    diagdok: diagnosaDokter,

                    transportasi: null,
                    transportasilain: $scope.item.transportasilain  != undefined ? $scope.item.transportasilain : null,
                    kontrolpoli: $scope.item.kontrolpoli != undefined ? $scope.item.kontrolpoli.kontrolpoli : null,
                    tglkontrolpoli: moment($scope.item.tglkontrolpoli).format('YYYY-MM-DD HH:mm'),
                    keadaandarurat: "RS Bhayangkara TK.I Pusdokkes Polri 0218093288 / 0218090559",
                    //transportasi: $scope.item.transportasi != undefined ? $scope.item.transportasi : null,
                    // meninggalkanrs: $scope.item.kondisiMeninggalkan.kondisi,
                    ttdpasien: $scope.item.ttdPasien,
                    dpjp: $scope.item.dokter.namalengkap,
                    pegawaifk: $scope.item.dokter.id,
                    riwayatPenyakit: $scope.item.riwayatPenyakit  != undefined ? $scope.item.riwayatPenyakit : null,
                    alasanrawat: $scope.item.alasanrawat  != undefined ? $scope.item.alasanrawat : null,
                    pasienkeluarga: $scope.item.namapasien  != undefined ? $scope.item.namapasien : null,
                    denyutjantungafter: $scope.item.denyutafter  != undefined ? $scope.item.denyutafter : null,
                    suhuafter: $scope.item.suhuafter  != undefined ? $scope.item.suhuafter : null,
                    pernafasanafter: $scope.item.pernafasanafter  != undefined ? $scope.item.pernafasanafter : null,
                    systoleafter: $scope.item.tekanansystoleafter != undefined ? $scope.item.tekanansystoleafter : null,
                    diastoleafter: $scope.item.tekanandiastoleafter != undefined ? $scope.item.tekanandiastoleafter : null,
                    pemeriksaanfisik: $scope.item.pemeriksaanfisik != undefined ? $scope.item.pemeriksaanfisik : null,
                    kesadaranafter: $scope.item.kesadaranafter  != undefined ? $scope.item.kesadaranafter : null,
                    pfnadi: $scope.item.pfnadi  != undefined ? $scope.item.pfnadi : null,
                    pfspo: $scope.item.pfspo  != undefined ? $scope.item.pfspo : null,
                    pfbb: $scope.item.pfbb  != undefined ? $scope.item.pfbb : null,
                    pftb: $scope.item.pftb  != undefined ? $scope.item.pftb : null,
                    pfe: $scope.item.pfe  != undefined ? $scope.item.pfe.pfe : null,
                    pfm: $scope.item.pfm  != undefined ? $scope.item.pfm.pfm : null,
                    pfv: $scope.item.pfv  != undefined ? $scope.item.pfv.pfv : null,
                    ku: $scope.item.ku != undefined ? $scope.item.ku : null,
                    kesadaranpulang: $scope.item.kesadaranpulang != undefined ? $scope.item.kesadaranpulang : null,
                    tekanandarah: $scope.item.tekanandarah != undefined ? $scope.item.tekanandarah : null,
                    suhupulang: $scope.item.suhupulang != undefined ? $scope.item.suhupulang : null,
                    pernafasanpulang: $scope.item.pernafasanpulang != undefined ? $scope.item.pernafasanpulang : null,
                    nadipulang: $scope.item.nadipulang != undefined ? $scope.item.nadipulang : null,
                    faskesterdekat: $scope.item.faskesterdekat != undefined ? $scope.item.faskesterdekat : null,
                    pertolonganmendesak: $scope.item.pertolonganmendesak != undefined ? $scope.item.pertolonganmendesak : null,
                    kebutuhanedukasilainlain: $scope.item.kebutuhanedukasilainlain != undefined ? $scope.item.kebutuhanedukasilainlain : null,
                    pemeriksaanpenunjanglainlain: $scope.item.pemeriksaanpenunjanglainlain != undefined ? $scope.item.pemeriksaanpenunjanglainlain : null,
                    // keadaanumumafter: $scope.item.keadaanumumafter.keadaanumum != undefined ? $scope.item.keadaanumumafter.keadaanumum : null,
                    iskontrolya: iskontrollya,
                    iskontroltidak: iskontrolltidak,
                    isreaksiobatya: isreaksiobattya,
                    isreaksiobattidak: isreaksiobatttidak,
                    israwatdirumahya: israwatdirumahhya,
                    israwatdirumahtidak: israwatdirumahhtidak,
                    isfaskesterdekatya: isfaskesterdekattya != undefined ? isfaskesterdekattya : false,
                    ispengobatanlanjutanya: ispengobatanlanjutannya != undefined ? ispengobatanlanjutannya : false,
                    ispengobatanlukaya: ispengobatanlukaaya != undefined ? ispengobatanlukaaya : false,
                    isperawatanlanjutanya: isperawatanlanjutannya != undefined ? isperawatanlanjutannya : false,
                    ishomecareya: ishomecareeya != undefined ? ishomecareeya : false,
                    islaboratoriumya: islaboratoriummya != undefined ? islaboratoriummya : false,
                    isradiologiya: isradiologiiya != undefined ? isradiologiiya : false,
                    ispemeriksaanpenunjanglainlainya: ispemeriksaanpenunjanglainlainnya != undefined ? ispemeriksaanpenunjanglainlainnya : false,
                    ispenyakitya: ispenyakittya != undefined ? ispenyakittya : false,
                    isefeksampingobatya: isefeksampingobattya != undefined ? isefeksampingobattya : false,
                    isdietya: isdiettya != undefined ? isdiettya : false,
                    ishygieneya: ishygieneeya != undefined ? ishygieneeya : false,
                    isperawatanlukadirumahya: isperawatanlukadirumahhya != undefined ? isperawatanlukadirumahhya : false,
                    isnyeriya: isnyeriiya != undefined ? isnyeriiya : false,
                    isperawatanibubayiya: isperawatanibubayiiya != undefined ? isperawatanibubayiiya : false,
                    isizindokterya: isizindokterrya != undefined ? isizindokterrya : false,
                    ispindahrslainya: ispindahrslainnya != undefined ? ispindahrslainnya : false,
                    ispulangsendiriya: ispulangsendiriiya != undefined ? ispulangsendiriiya : false,
                    ismelarikandiriya: ismelarikandiriiya != undefined ? ismelarikandiriiya : false,
                    ismeninggalbeforeya: ismeninggalbeforeeya != undefined ? ismeninggalbeforeeya : false,
                    ismeninggalafterya: ismeninggalafterrya != undefined ? ismeninggalafterrya : false,
                    ismandiriya: ismandiriiya != undefined ? ismandiriiya : false,
                    isdibantusetengahya: isdibantusetengahhya != undefined ? isdibantusetengahhya : false,
                    isdibantupenuhya: isdibantupenuhhya != undefined ? isdibantupenuhhya : false,
                    iswalkerya: iswalkerrya != undefined ? iswalkerrya : false,
                    isalatbantulainlainya: isalatbantulainlainnya != undefined ? isalatbantulainlainnya : false,
                    istidakadaalatkesehatanya: istidakadaalatkesehatannya != undefined ? istidakadaalatkesehatannya : false,
                    isivcateterya: isivcateterrya != undefined ? isivcateterrya : false,
                    isdobellumenya: isdobellumennya != undefined ? isdobellumennya : false,
                    isngtya: isngttya != undefined ? isngttya : false,
                    isoksigenya: isoksigennya != undefined ? isoksigennya : false,
                    iscateterurineya: iscateterurineeya != undefined ? iscateterurineeya : false,
                    isalatkesehatanlainlainya: isalatkesehatanlainlainnya != undefined ? isalatkesehatanlainlainnya : false,
                    isaktifitasistirahatya: isaktifitasistirahattya != undefined ? isaktifitasistirahattya : false,
                    ispertolonganmendesakya: ispertolonganmendesakkya != undefined ? ispertolonganmendesakkya : false,
                    iskebutuhanedukasilainlainya: iskebutuhanedukasilainlainnya != undefined ? iskebutuhanedukasilainlainnya : false,
                    temuanpenting: $scope.item.temuanPenting,
                    penulisfk: $scope.item.dokterpenulis.id,
                    penulis: $scope.item.dokterpenulis.namalengkap,
                    edukasi: $scope.item.edukasi != undefined ? $scope.item.edukasi: null,
                    lab: lab != undefined ? lab : null,
                    rad: rad != undefined ? rad : null,
                    obat: obat,
                    ICD10: ICD10,
                    tindakan: tindakan,
                    obatpulang: obatpulang,
                    norec_emr: '-',
                    head: $scope.cc,
                    datareaksiobat: dataRO,
                    keadaandarurat: $scope.item.darurat
                }
                medifirstService.post('emr/save-resume-medis-ri', objSave).then(function (e) {
                    // $scope.tampilanDepan = true;
                    // $scope.tampilanBelakang = false;
                    $scope.norec = e.data.norec_resume;
                    init()
                    saveToFilePapj();
                })
            }

            // function loadObatResepAkhir(noregistrasi) {
            //     $scope.isRouteLoading = true;
            //     var noresep = '';
            //     var param = ""
            //     // if($scope.dataParams.noRegistrasi == true)
            //     param = "noReg=" + noregistrasi;
            //     // else
            //     //   param = "noCm=" + $scope.item.noCm;

            //     medifirstService.get("emr/get-obat-resep-akhir?" +
            //         param
            //     ).then(function (data) {
            //         $scope.isRouteLoading = false;
            //         // for (var i = 0; i < data.data.datas.length; i++) {
            //         //     // data.data.datas[i].no = i + 1
            //         //     data.data.datas[i].total = parseFloat(data.data.datas[i].jumlah) * (parseFloat(data.data.datas[i].hargasatuan) - parseFloat(data.data.datas[i].hargadiscount))
            //         //     data.data.datas[i].total = parseFloat(data.data.datas[i].total) + parseFloat(data.data.datas[i].jasa)
            //         // }
            //         // $scope.isRouteLoading = false;
            //         var dataObat = data.data.datas;
            //         noresep = data.data.datas[0].noresep;
            //         $scope.sourceResume = new kendo.data.DataSource({
            //             data: dataObat,
            //             pageSize: 10

            //             // schema: {
            //             //     model: {
            //             //         id: "id",
            //             //         fields: {
            //             //             namaobat: { editable: false, type: "string" },
            //             //             jumlah: { editable: false, type: "string" },
            //             //             dosisobat: { editable: (dynamicEditor) },
            //             //             carapemberian: { editable: false, type: "string" },
            //             //         }
            //             //     }
            //             // },
            //         });
            //         // $scope.dataGridDosisObat = new kendo.data.DataSource({data: dat.data,
            //         //     // group: [
            //         //     //     { field: "detailjenisproduk" },
            //         //     //     // { field: "namaproduk" }
            //         //     // ],
            //         //     // sort: { field: "nourutdetail", dir: "asc" },
            //         //     schema: {
            //         //         model: {
            //         //             id: "id",
            //         //             fields: {
            //         //                 namaproduk: { editable: false, type: "string" },
            //         //                 dosisobat: { editable: (dynamicEditor) },
            //         //             }
            //         //         }
            //         //     },
            //         // });
            //     });

            // }

            // function loadObatObat(noregistrasi) {
            //     //  ;
            //     $scope.isRouteLoading = true;
            //     var noresep = '';
            //     var param = ""
            //     // if($scope.dataParams.noRegistrasi == true)
            //     param = "noReg=" + noregistrasi;
            //     // else
            //     //   param = "noCm=" + $scope.item.noCm;

            //     medifirstService.get("emr/get-obat-obat?" +
            //         param
            //     ).then(function (data) {
            //         $scope.item.obatobat = data.data.datas;
            //     });
            //     $scope.isRouteLoading = false;
            // }

            // function editDosisObat(noregistrasi) {

            //     $scope.isLoading = true;

            //     var ruid = 575;
            //     datalabs = []
            //     medifirstService.get("farmasi/get-transaksi-dosis-rm?noReg=" + noregistrasi, true).then(function (dat) {
            //         $scope.isRouteLoading = false;
            //         obat = dat.data
            //         for (var i = 0; i < dat.data.length; i++) {
            //             dat.data[i].no = i + 1
            //             dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
            //             dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
            //         }
            //         // $scope.dataGridDosisObat = dat.data;
            //         $scope.dataGridDosisObat = new kendo.data.DataSource({
            //             data: dat.data,
            //             // group: [
            //             //     { field: "detailjenisproduk" },
            //             //     // { field: "namaproduk" }
            //             // ],
            //             // sort: { field: "nourutdetail", dir: "asc" },
            //             schema: {
            //                 model: {
            //                     id: "id",
            //                     fields: {
            //                         namaproduk: { editable: false, type: "string" },
            //                         dosisobat: { editable: (dynamicEditor) },
            //                         frekuensi: { editable: (dynamicEditors) },
            //                     }
            //                 }
            //             },
            //         });
            //     });
            // }

            // function editDosisObatPulang(noregistrasi) {

            //     $scope.isLoading = true;

            //     medifirstService.get("farmasi/get-transaksi-dosis-pulang-rm?noReg=" + noregistrasi, true).then(function (dat) {
            //         $scope.isRouteLoading = false;
            //         //  
            //         for (var i = 0; i < dat.data.length; i++) {
            //             dat.data[i].no = i + 1
            //             dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
            //             dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
            //         }
            //         // $scope.dataGridDosisObat = dat.data;

            //         //  
            //         var result = dat.data
            //         for (var i = 0; i < result.length; i++) {
            //             if (result[i].carapemberian == null) {
            //                 var dataTemp = { id: "-", text: "-" }
            //             } else {
            //                 var dataTemp = { id: result[i].carapemberian, text: result[i].carapemberian }
            //             }
            //             result[i].carapemberian = dataTemp;
            //         }

            //         $scope.dataGridDosisObatPulang = new kendo.data.DataSource({
            //             data: result,
            //             // group: [
            //             //     { field: "detailjenisproduk" },
            //             //     // { field: "namaproduk" }
            //             // ],
            //             // sort: { field: "nourutdetail", dir: "asc" },
            //             schema: {
            //                 model: {
            //                     id: "id",
            //                     fields: {
            //                         // { field: "namaobat", title: "Nama Obat", width: 350 },
            //                         // { field: "jumlah", title: "Jumlah", width: 50 },
            //                         // { field: "dosisobat", title: "Dosis", width: 50 },
            //                         // { field: "frekuensi", title: "Frekuensi", width: 50 },
            //                         // { field: "carapemberian", title: "Cara Pemberian", width: 100 },
            //                         produkfk: { editable: false, type: "string" },
            //                         dosisobat: { editable: true, type: "string" },
            //                         namaproduk: { editable: false, type: "string" },
            //                         jumlah: { editable: false, type: "string" },
            //                         frekuensi: { editable: true, type: "string" },
            //                         ispulang: { editable: false, type: "string" },
            //                         text: { editable: 'incell', type: "string" },
            //                     }
            //                 }
            //             },
            //         });
            //     });
            // }


            function editDosisObatPop(noregistrasi) {
                $scope.isLoading = true;
                //  

                var ruid = 575;
                datalabs = []
                medifirstService.get("farmasi/get-transaksi-dosis-rm-pop?noReg=" + $scope.noregistrasi, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < dat.data.length; i++) {
                        dat.data[i].no = i + 1
                        dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                        dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                    }
                    // $scope.dataGridDosisObat = dat.data;
                    $scope.dataGridDosisObatPop = new kendo.data.DataSource({
                        data: dat.data,
                        // group: [
                        //     { field: "detailjenisproduk" },
                        //     // { field: "namaproduk" }
                        // ],
                        // sort: { field: "nourutdetail", dir: "asc" },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    namaproduk: { editable: false, type: "string" },
                                    dosisobat: { editable: false, type: "string" },
                                    frekuensi: { editable: false, type: "string" },
                                    // dosisobat: { editable: (dynamicEditor) },
                                }
                            }
                        },
                    });
                });
                // $scope.popUpDosisObat.center().open();
            }

            function editDosisObatPulangPop(noregistrasi) {
                $scope.isLoading = true;
                //  

                var ruid = 575;
                datalabs = []
                medifirstService.get("farmasi/get-transaksi-dosis-pulang-rm-pop?noReg=" + $scope.noregistrasi, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < dat.data.length; i++) {
                        dat.data[i].no = i + 1
                        dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                        dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                    }
                    // $scope.dataGridDosisObat = dat.data;
                    $scope.dataGridDosisObatPopPulang = new kendo.data.DataSource({
                        data: dat.data,
                        // group: [
                        //     { field: "detailjenisproduk" },
                        //     // { field: "namaproduk" }
                        // ],
                        // sort: { field: "nourutdetail", dir: "asc" },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    produkfk: { editable: false, type: "string" },
                                    dosisobat: { editable: false, type: "string" },
                                    namaproduk: { editable: false, type: "string" },
                                    jumlah: { editable: false, type: "string" },
                                    frekuensi: { editable: false, type: "string" },
                                    ispulang: { editable: false, type: "string" },
                                    carapemberian: { editable: false, type: "string" },
                                    // dosisobat: { editable: (dynamicEditor) },
                                }
                            }
                        },
                    });
                });
                // $scope.popUpDosisObat.center().open();
            }
            $scope.editDosisObat = function () {
                editDosisObatPop($scope.noregistrasi);
                $scope.popUpDosisObat.center().open();
            }

            $scope.editDosisObatPulang = function () {
                editDosisObatPulangPop($scope.noregistrasi);
                $scope.popUpDosisObatPulang.center().open();
            }

            function statusDosisObat(noregistrasi) {

                $scope.isLoading = true;
                //  

                var ruid = 575;
                datalabs = []
                medifirstService.get("farmasi/get-transaksi-status-dosis-rm?noReg=" + $scope.noregistrasi, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < dat.data.length; i++) {
                        dat.data[i].no = i + 1
                        dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                        dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                    }
                    // $scope.dataGridDosisObat = dat.data;
                    $scope.dataGridDosisObat = new kendo.data.DataSource({
                        data: dat.data,
                        // group: [
                        //     { field: "detailjenisproduk" },
                        //     // { field: "namaproduk" }
                        // ],
                        // sort: { field: "nourutdetail", dir: "asc" },
                        schema: {
                            model: {
                                id: "id",
                                fields: {
                                    namaproduk: { editable: false, type: "string" },
                                    dosisobat: { editable: (dynamicEditor) },
                                    frekuensi: { editable: (dynamicEditors) },
                                }
                            }
                        },
                    });
                });
            }

            $scope.cetakresumeranap = function () {
                medifirstService.get('emr/get-penunjang-resume-ranap?noregistrasifk=' + $scope.norec).then(function (dat) {
                    medifirstService.get('emr/get-kepentingan-resume-rj?norec=' + $scope.norec).then(function(dat2) {
                        medifirstService.get('emr/get-reaksi-obat-resume-ranap?norecresume=' + $scope.norec + "&noregistrasi=" + $scope.cc.noregistrasi).then(function (dataa) {
                    let penunjang2 = dat2.data;
                    let penunjang = dat.data.data;
                    let penunjangrek = dataa.data.dataro;
                    let obat = '';
                    let reaksiObat = '';
                    let obatCounter = 0;
                    // let obatqty = '';
                    // let obataturanpakai = '';
                    let labproduk = '';
                    let labpa = '';
                    let radiologiproduk = '';
                    let diagnosisawal = '';
                    let diagnosisprimer = '';
                    let diagnosissekunder = '';
                    let diagnosis = '';
                    let obatpulang = '';
                    let obatpulangcounter = 0;
                    let tindakanmedisicd9 = '';

                    let tampung = '';
					let tampung2 = '';
					let tampung3 = '';
					let tampung4 = '';
                    let tampung5 = '';
                    let tampung6 = '';
                    let tampung7 = '';
					let nourut = 1;
					let penunjanglab = ''
					let tindakanlab = ''
					let penunjangrad = ''
					let tindakanrad = ''
					let penunjangpa = ''
					let tindakanpa = ''
					let penunjangall = ''
                    tindakan
                    for (let k = 0; k < tindakan.length; k++) {
                        tindakanmedisicd9 += tindakan[k].kddiagnosatindakan + ' - ' + tindakan[k].namadiagnosatindakan + '\n';
                    }

                    for (let e = 0; e < penunjangrek.length; e++) {
                        reaksiObat += `${penunjangrek[e].namaobatro}  ${penunjangrek[e].manifestasiro} ${penunjangrek[e].keteranganro} \n`;
                    }

                    for (let i = 0; i < penunjang.length; i++) {
                        if (penunjang[i].jenispenunjang === 'OBAT') {
                            obatCounter++;
                            obat += `${obatCounter}. ${penunjang[i].namaproduk}  ${penunjang[i].frekuensi} \n`;
                            // obatqty += penunjang[i].qty + '\n';
                            // obataturanpakai += penunjang[i].frekuensi + '\n';
                        } 
                        // else if (penunjang[i].jenispenunjang === 'LAB') {
                        //     labproduk += 'Laboratorium Patalogi Klinik : ' + penunjang[i].namaproduk + '\n';
                            

                        //     if(penunjang[i].flaglab === 'Y') {
                        //         penunjanglab = 'Laboratorium Patologi Klinik : '
                        //         penunjanglab = penunjanglab + penunjang[i].namaproduk + '- Hasil : ' +  penunjang[i].hasilpenunjang + '\n';
                        //     }
                        // } 
                        else if (penunjang[i].jenispenunjang === 'LABPA') {
                            labpa += 'Laboratorium Patalogi Anatomi : ' + penunjang[i].namaproduk + '\n';

                            penunjangpa = 'Laboratorium Patologi Anatomi : '
                            
								if (penunjang[i].hasilpenunjang  != null) {
                                    penunjangpa = 'Laboratorium Patologi Anatomi : '
									tampung4 = penunjang[i].hasilpenunjang
									let kalimat = penunjang[i].hasilpenunjang;
									let panjang = kalimat.length;
									let temukan = kalimat.indexOf("KESIMPULAN");
									if (temukan < 0) {
										temukan = kalimat.indexOf("KESIMPULAN");
									}
									let filter = kalimat.slice(temukan, panjang)
									filter = filter.replace(/(<([^>]+)>)/gi, "");
									filter = filter.replace(/&nbsp;/g, "");
									tampung2 = filter
									penunjangpa = penunjangpa + tampung2
								}
                        } else if (penunjang[i].jenispenunjang === 'RAD') {
                            radiologiproduk += 'Radiologi : ' + penunjang[i].namaproduk + '\n';
                            
                            

							if (penunjang[i].hasilpenunjang  != null) {
                                    
					                penunjangrad = penunjangrad + 'Radiologi : '
									tampung4 = penunjang[i].hasilpenunjang
									let kalimat = penunjang[i].hasilpenunjang
									let panjang = kalimat.length;
									let temukan = kalimat.indexOf("kesan");
									if (temukan < 0) {
										temukan = kalimat.indexOf("Kesan");
									}
									if (temukan < 0) {
										temukan = kalimat.indexOf("KESAN");
									}
									if (temukan < 0) {
										temukan = kalimat.indexOf("Kesimpulan");
									}
									if (temukan < 0) {
										temukan = kalimat.indexOf("kesimpulan");
									}
									let filter = kalimat.slice(temukan, panjang)
									filter = filter.replace(/(<([^>]+)>)/gi, "");
									filter = filter.replace(/&nbsp;/g, " ");
									tampung2 = filter
									penunjangrad = penunjangrad + penunjang[i].namaproduk + " " + tampung2 + " \n"
							}
                        } else if (penunjang[i].jenispenunjang === 'TINDAKAN ICD 9') {
                            // tindakanmedisicd9 += penunjang[i].namadiagnosa + '\n';
                        } else if (penunjang[i].jenispenunjang === 'OBATPULANG') {
                            var num = parseInt(penunjang[i].qty)
                            var roman = {
                                M: 1000,
                                CM: 900,
                                D: 500,
                                CD: 400,
                                C: 100,
                                XC: 90,
                                L: 50,
                                XL: 40,
                                X: 10,
                                IX: 9,
                                V: 5,
                                IV: 4,
                                I: 1
                              };
                              var str = '';
                            
                              for (var k of Object.keys(roman)) {
                                var q = Math.floor(num / roman[k]);
                                num -= q * roman[k];
                                str += k.repeat(q);
                              }
                              penunjang[i].qty = str
                            obatpulangcounter++;
                            obatpulang += `${obatpulangcounter}. ${penunjang[i].namaproduk} ${penunjang[i].frekuensi}   (${penunjang[i].qty}) \n`;
                        }

                        if (penunjang[i].frekuensi === 'Primary') {
                            diagnosisprimer += 'Diagnosis Primer/utama :'+ " "+penunjang[i].kddiagnosa+"-"+ penunjang[i].namadiagnosa+ '\n';
                        } else if (penunjang[i].frekuensi === 'Secondary') {
                            diagnosissekunder += 'Diagnosis Sekunder :'+ " "+penunjang[i].kddiagnosa+"-"+ penunjang[i].namadiagnosa+ '\n';
                        } else if (penunjang[i].frekuensi === 'Diagnosa Awal') {
                            diagnosisawal += 'Diagnosis Awal :'+ " "+penunjang[i].kddiagnosa+"-"+ penunjang[i].namadiagnosa+ '\n';
                        }
                    }
                    labproduk = labproduk + labpa + radiologiproduk
                    diagnosis = diagnosisprimer + '\n' + diagnosissekunder + '\n' + diagnosisawal;
                    
                    //let y = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-new?idPegawai="+ $scope.modelGrid.pegawaifk
                    let y = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-fleksibel?idPegawai=" + $scope.item.dokter.id + "&pesan=RESUME MEDIS RAWAT INAP"  + "&noregistrasi=" + $scope.cc.noregistrasi
                    let z = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-pasien?noregistrasi=" + $scope.cc.noregistrasi
                    for (let p = 0; p < penunjang2.length; p++) {
						if (penunjang2[p].jenispenunjang == 'LAB') {
							// debugger
							tampung5 = tampung5 + nourut + ". " + penunjang2[p].namaproduk + " = " + "\n"
							labproduk = labproduk + 'Laboratorium Patalogi Klinik : ' + penunjang2[p].namaproduk + "\n"
							for (let j = 0; j < penunjang2[p].detail.length; j++) {
								if (penunjang2[p].detail[j].hasilpenunjang != null) {
									if (penunjang2[p].detail[j].flaglab == 'Y' || penunjang2[p].detail[j].flaglab == 'K') {
										tampung7 = penunjang2[p].detail[j].hasilpenunjang
										tampung6 = tampung6 + penunjang2[p].detail[j].detailpemeriksaan + ":" + penunjang2[p].detail[j].hasilpenunjang + " / "
									} else {

                                    }
								} else {
									// tampung = ''
								}
							}
							// penunjanglab = penunjanglab + tampung6
                            // tampung6 = ''
						} 
                    }
                    penunjanglab = penunjanglab + tampung6
                    penunjanglab = 'Laboratorium Patalogi Klinik : ' + penunjanglab
                    penunjangall=penunjanglab + " \n" + penunjangpa + " \n" + penunjangrad

                    var qrdok = "http://rsbsaonline.com/service/medifirst2000/report/cetak-ttd-new?idPegawai="+$scope.item.dokter.id
					
				    var data = {
					"gambarLogo": "logodokkes.jpg",
					"paramKey": ["norec_apd", "obat","labproduk","radiologiproduk","diagnosis","ttd","z","obatpulang","tindakanmedisicd9","penunjanglab","penunjangpa","penunjangrad","edukasi", "qrdok", "reaksiobat"],
					"paramValue": [$scope.norecAPD, obat, labproduk, radiologiproduk,diagnosis,y,z,obatpulang,tindakanmedisicd9,penunjangall,penunjangpa,penunjangrad,$scope.item.edukasi, qrdok, reaksiObat],
					"paramType": ["", "", "", "", "", "", "","","", "","","","","",""] 
				};
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
                        // console.log(this.response, typeof this.response);
                        // var res = this.response
                        // var file = new Blob( [res], {type: 'application/pdf'});
                        // var url = window.URL.createObjectURL(this.response)
                        // var jenis = 'resumemedis';
                        // getBase64(file,jenis)
						console.log(this.response, typeof this.response);
						var url = window.URL.createObjectURL(this.response)
						var pdf = document.getElementById('tempatLaporan');
						pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
						var win = window.open(url, '_blank');
						win.focus();
					}
				}

                
					
                    //ash 2023-11-30 untuk menentukan apa dia PPA atau bukan
                    var datauserkelompok = medifirstService.getKelompokUser();


                    if(datauserkelompok == "ppa") {
                        if (window.location.hostname.indexOf('localhost') > -1) {
                            xhr.open('POST', 'http://localhost:8797/generic/report/ResumeMedisRanap.pdf');
                        } else if (window.location.hostname.indexOf('36.78.27.51:8201') > -1) {
                            xhr.open('POST', 'http://103.151.226.36:2222/generic/report/ResumeMedisRanap.pdf');
                        } else {
                            xhr.open('POST', '/jasper1/generic/report/ResumeMedisRanap.pdf');
                        }
                    } else {
                        if (window.location.hostname.indexOf('localhost') > -1) {
                            xhr.open('POST', 'http://localhost:8797/generic/report/ResumeMedisRanapSalinan.pdf');
                        } else if (window.location.hostname.indexOf('36.78.27.51:8201') > -1) {
                            xhr.open('POST', 'http://103.151.226.36:2222/generic/report/ResumeMedisRanapSalinan.pdf');
                        } else {
                            xhr.open('POST', '/jasper1/generic/report/ResumeMedisRanapSalinan.pdf');
                        }
                    }

                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                    $scope.isRouteLoading = false;
                    saveToFilePapj();
                })  
            })  
                });
            }

            $scope.TutupPopUpPelayanan = function () {
                $scope.popUpPelayanan.center().close();
            }

            $scope.AddHasilKonsul = function (ruangan) {
                $scope.isLoading = true;


                // var noregistrasi = ''
                // noregistrasi = dataItem.norec_apd
                var ruid = ruangan;
                datalabs = []
                loadClaimGridPp($scope.norecPd, ruid);
                medifirstService.get("radiologi/get-rincian-pelayanan-lab-rm?noregistrasi=" + $scope.noregistrasi + "&ruid=" + ruid
                    // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                    , true).then(function (dat) {
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
                            if (dat.data.data[i].statusperiksa == 1) {
                                dat.data.data[i].statusperiksa = "✔";
                            } else {
                                dat.data.data[i].statusperiksa = "✘";
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

                        // $scope.popUpPelayanan.center().open();
                         
                        datalab = dat.data.data;
                        popUps(datalab)

                    },
                        function (error) {
                            $scope.isLoading = false;
                        });
                // loadEditor()
                //     if(dataItem.ruid === '576') {
                //         $scope.isLoading = true;

                //         // medifirstService.get("radiologi/get-data-combo-labrad").then(function (dat) {
                //         // 	$scope.listruangan = dat.data.ruangan;
                //         // 	// $scope.listLayanan = dat.data.produk;
                //         // 	$scope.listDokter = dat.data.dokter;
                //         // })
                //         // if (norec_apd != null) {

                //         medifirstService.get("radiologi/get-rincian-pelayanan-inacbg?noregistrasifk=" + dataItem.norec_apd + "&ruid=" + dataItem.ruid
                // // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                //         , true).then(function (dat) {
                //             if (dat.data.data.length > 0) {
                //                 $scope.item.tgllahir = dat.data.data[0].tgllahir
                //                 $scope.item.objectjeniskelaminfk = dat.data.data[0].objectjeniskelaminfk
                //             }
                //             $scope.statusSelesaiPeriksa = dat.data.data[0].isclaim
                //             for (var i = 0; i < dat.data.data.length; i++) {
                //                 dat.data.data[i].no = i + 1
                //                 dat.data.data[i].statCheckbox = false;
                //                 if (dat.data.data[i].statusbridging == "Sudah Dikirim") {
                //                     dat.data.data[i].statusbridging = "✔";
                //                     // ✅
                //                     // ✔
                //                 } else {
                //                     dat.data.data[i].statusbridging = "✘";
                //                     // ✘
                //                     // ❎
                //                 }
                //                 if (dat.data.data[i].iscito == "1") {
                //                     dat.data.data[i].statuscito = "✔";
                //                     // ✅
                //                     // ✔
                //                 } else {
                //                     dat.data.data[i].statuscito = "✘";
                //                     // ✘
                //                     // ❎
                //                 }
                //                 if( dat.data.data[i].statusperiksa == 1)
                //                 {
                //                     dat.data.data[i].statusperiksa = "✔";
                //                 }else
                //                 {
                //                     dat.data.data[i].statusperiksa = "✘";
                //                 }

                //             }
                //             if (dat.data.data.length > 0) {
                //                 if (dat.data.data[0].objectdepartemenfk == 3)
                //                     $scope.disableRad = true
                //                 if (dat.data.data[0].objectdepartemenfk == 27)
                //                     $scope.disableLab = true
                //             }
                //             $scope.isLoading = false;


                //             $scope.dataGridRadio = {
                //                 data: dat.data.data,
                //                 _data: dat.data.data,
                //                 // pageSize: 10,
                //                 selectable: true,
                //                 refresh: true,
                //                 total: dat.data.data.length,
                //                 serverPaging: false,
                //                 aggregate: [
                //                     { field: 'total', aggregate: 'sum' },
                //                 ]

                //             };

                //             $scope.popUpPelayananRadio.center().open();

                //         },
                //         function (error) {
                //             $scope.isLoading = false;
                //         });
                //     }
            }

            $scope.AddHasilKonsul = function (ruangan) {
                $scope.isLoading = true;

                var ruid = ruangan;
                datalabs = []
                loadClaimGridPp($scope.norecPd, ruid);
                medifirstService.get("radiologi/get-rincian-pelayanan-lab-rm?noregistrasi=" + $scope.noregistrasi + "&ruid=" + ruid
                    // medifirstService.get("lab-radiologi/get-rincian-pelayanan?objectdepartemenfk=" + departemenfk + "&noregistrasi=" +   $scope.item.noregistrasi
                    , true).then(function (dat) {
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
                            if (dat.data.data[i].statusperiksa == 1) {
                                dat.data.data[i].statusperiksa = "✔";
                            } else {
                                dat.data.data[i].statusperiksa = "✘";
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

                        // $scope.popUpPelayanan.center().open();
                         
                        if (ruid == 575) {
                            datalab = dat.data.data;
                            popUps(datalab)
                        } else {
                            datalab = dat.data.data;
                            popUps(datalab)
                        }

                    },
                        function (error) {
                            $scope.isLoading = false;
                        });
            }

            // $scope.editDosisObat = function () {
            //     $scope.isLoading = true;
            //      

            //     var ruid = 575;
            //     datalabs = []
            //     medifirstService.get("farmasi/get-transaksi-dosis-rm-pop?noReg=" + $scope.noregistrasi, true).then(function (dat) {
            //         $scope.isRouteLoading = false;
            //         for (var i = 0; i < dat.data.length; i++) {
            //             dat.data[i].no = i + 1
            //             dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
            //             dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
            //         }
            //         // $scope.dataGridDosisObat = dat.data;
            //         $scope.dataGridDosisObatPop = new kendo.data.DataSource({data: dat.data,
            //             // group: [
            //             //     { field: "detailjenisproduk" },
            //             //     // { field: "namaproduk" }
            //             // ],
            //             // sort: { field: "nourutdetail", dir: "asc" },
            //             schema: {
            //                 model: {
            //                     id: "id",
            //                     fields: {
            //                         namaproduk: { editable: false, type: "string" },
            //                         dosisobat: { editable: (dynamicEditor) },
            //                     }
            //                 }
            //             },
            //         });
            //     });
            //     $scope.popUpDosisObat.center().open();
            // }

            // $scope.simpanDosisObat = function () {
            //     var dataArray = [];
            //     for (var i = $scope.dataGridDosisObat._data.length - 1; i >= 0; i--) {
            //         if ($scope.dataGridDosisObat._data[i].dosisobat != null || $scope.dataGridDosisObat._data[i].dosisobat != '')
            //             dataArray.push({
            //                 "produkfk": $scope.dataGridDosisObat._data[i].produkfk,
            //                 "namaproduk": $scope.dataGridDosisObat._data[i].namaproduk,
            //                 "dosisobat": $scope.dataGridDosisObat._data[i].dosisobat,
            //                 "frekuensi": $scope.dataGridDosisObat._data[i].frekuensi,
            //             });
            //     }

            //     if (dataArray.length !== 0) {
            //         var objSave = {
            //             "noregistrasi": $scope.noregistrasi,
            //             "dosisobat": dataArray
            //         }
            //          
            //         medifirstService.post('farmasi/save-transaksi-dosis-rm', objSave).then(function (e) {
            //             if (e.status == 201) {
            //                 loadObatResepAkhir(noregistrasi);
            //                 editDosisObat(noregistrasi);
            //                 // loadObatObat(noregistrasi);
            //                 // $scope.popUpDosisObat.center().close();
            //             }
            //         })
            //     }
            // }

            $scope.simpanCaraPemberian = function () {
                var dataArray = [];
                 
                for (var i = $scope.dataGridDosisObatPulang._data.length - 1; i >= 0; i--) {
                    if ($scope.dataGridDosisObatPulang._data[i].dosisobat != null || $scope.dataGridDosisObatPulang._data[i].dosisobat != '')
                        dataArray.push({
                            "produkfk": $scope.dataGridDosisObatPulang._data[i].produkfk,
                            "norec_pp": $scope.dataGridDosisObatPulang._data[i].norec_pp,
                            "carapemberian": $scope.dataGridDosisObatPulang._data[i].carapemberian.text,
                            "namaproduk": $scope.dataGridDosisObatPulang._data[i].namaproduk,
                            "dosisobat": $scope.dataGridDosisObatPulang._data[i].dosisobat,
                            "frekuensi": $scope.dataGridDosisObatPulang._data[i].frekuensi,
                        });
                }
                 
                if (dataArray.length !== 0) {
                    var objSave = {
                        "noregistrasi": $scope.noregistrasi,
                        "dosisobat": dataArray
                    }
                     
                    medifirstService.post('farmasi/save-transaksi-dosis-pulang-rm', objSave).then(function (e) {
                        if (e.status == 201) {
                            editDosisObatPulang(noregistrasi);
                            // editDosisObat(noregistrasi);
                            // loadObatObat(noregistrasi);
                            // $scope.popUpDosisObat.center().close();
                        }
                    })
                }
            }

            $scope.columnGrid = {
                columns: [
                    // {
                    // 	"title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                    // 	template: "# if (statCheckbox) { #" +
                    // 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                    // 		"# } else { #" +
                    // 		"<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                    // 		"# } #",
                    // 	width: "30px",
                    // 	attributes: {
                    // 		// class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    //    },
                    // },
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "tglpelayanan",
                        "title": "Tgl Pelayanan",
                        "width": "90px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "ruangan",
                        "title": "Ruangan",
                        "width": "120px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruangan Asal",
                        "width": "120px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    // {
                    //     "field": "namaproduk",
                    //     "title": "Layanan",
                    //     "width": "160px",
                    //     "template": "<button class=\"k-button custom-button\" ng-click=\"detailHasilLab(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                    //     attributes: {
                    //         class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    //     },
                    // },
                    {
                        "field": "namaproduk",
                        "title": "Layanan",
                        "width": "160px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                            // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                        },
                    },
                    {
                        "field": "dokterpemeriksa",
                        "title": "Dokter Pemeriksa",
                        "width": "140px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        "field": "dokterpengirim",
                        "title": "Dokter Pengririm",
                        "width": "140px",
                        attributes: {
                            class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        },
                    },
                    {
                        // "field": "claim",
                        "title": "Resume Medis",
                        "width": "100px",
                        "template": "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(dataItem)\" style=\"margin:0 0 5px\">#: rm #</button>",
                    },
                    {
                        "field": "tglhasil",
                        "title": "Tgl Hasil",
                        "width": "90px",
                    },
                    {
                        "field": "tglcetak",
                        "title": "Tgl Cetak",
                        "width": "90px",
                    },
                    {
                        "field": "jumlah",
                        "title": "Qty",
                        "width": "40px",
                    },
                    // {
                    // 	"field": "hargasatuan",
                    // 	"title": "Harga Satuan",
                    // 	"width": "100px",
                    // 	"template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                    // },
                    // {
                    // 	"field": "hargadiscount",
                    // 	"title": "Diskon",
                    // 	"width": "80px",
                    // 	"template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>",
                    // 	// footerTemplate: "<span class='style-center'>Total</span>",
                    // },
                    // {
                    // 	"field": "jasa",
                    // 	"title": "Jasa Cito",
                    // 	"width": "80px",
                    // 	"template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>",
                    // 	footerTemplate: "<span class='style-center'>Total</span>",
                    // },
                    // {
                    // 	"field": "total",
                    // 	"title": "Total",
                    // 	"width": "100px",
                    // 	"template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
                    // 	aggregates: ["sum"],
                    // 	groupFooterTemplate: "<span>Sub Total: Rp. {{formatRupiah('#=data.total.sum  #', '')}}</span>",
                    // 	footerTemplate: "<span >Rp. {{formatRupiah('#:data.total.sum  #', '')}}</span>"
                    // },
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
            }

            $scope.columnGridrad = {
                columns: [{
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "ruangan",
                    "title": "Ruangan",
                    "width": "120px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "namaruanganasal",
                    "title": "Ruangan Asal",
                    "width": "120px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                    // "template": "<button class=\"k-button custom-button\" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                        // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "dokterpemeriksa",
                    "title": "Dokter Pemeriksa",
                    "width": "140px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    "field": "dokterpengirim",
                    "title": "Dokter Pengririm",
                    "width": "140px",
                    attributes: {
                        class: "#=flaglab != 'N' ? 'red' : 'green' #"
                    },
                },
                {
                    // "field": "claim",
                    "title": "Resume Medis",
                    "width": "100px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"Cetakexpertise(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",

                    // "template": "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(dataItem)\" style=\"margin:0 0 5px\">#: rm #</button>",
                },
                {
                    "field": "tglhasil",
                    "title": "Tgl Hasil",
                    "width": "90px",
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
            }
            $scope.Cetakexpertise = function (dataItem) {
                medifirstService.get('radiologi/get-hasil-radiologi?norec_pp=' + dataItem.norec_pp + '&idproduk=' + dataItem.produkfk).then(function (e) {
                     ;
                    var kalimat = e.data[0].keterangan;
                    var panjang = kalimat.length;
                    var temukan = kalimat.indexOf("kesan");
                    if (temukan < 0) {
                        var temukan = kalimat.indexOf("Kesan");
                    }
                    var filter = kalimat.slice(temukan, panjang);

                    filter = filter.replace(/(<([^>]+)>)/gi, " ");
                    if ($scope.item.pemeriksaanPenunjang == "" || $scope.item.pemeriksaanPenunjang == undefined) {

                        $scope.item.pemeriksaanPenunjang = filter.replace(/&nbsp;/g, " ");
                    } else {

                        $scope.item.pemeriksaanPenunjang = $scope.item.pemeriksaanPenunjang + "\n" + filter.replace(/&nbsp;/g, " ");
                    }
                    $scope.popUpPelayananrad.close();
                })

            }

            $scope.CetakLabKlinikLangsung = function (dataItem) {
                 
                var user = medifirstService.getPegawaiLogin();
                var diagnosa = "";
                medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + dataItem.noregistrasi).then(function (data) {
                     
                    if (data.data.datas == undefined) {
                        diagnosa = "-";
                    } else {
                        if (data.data.datas[0].namadiagnosa != null) {
                            diagnosa = data.data.datas[0].namadiagnosa;
                        } else {
                            diagnosa = "-";
                        }
                    }
                });
                debugger
                if (dataItem.tglhasil == null) {
                    toast.info("Hasil Tidak Ditersedia.");
                    return;
                } else {
                    umurDay = dataItem.umur
                    tglpelayanan = dataItem.tglpelayanan
                    tglhasil = dataItem.tglhasil
                    tglcetak = dataItem.tglcetak
                    norecPP = "'" + dataItem.norec_pp + "'"
                    norecAPD = dataItem.norec_apd
                    ruangan = dataItem.ruangan
                    ruanganasal = dataItem.namaruanganasal
                    dokterpemeriksa = dataItem.dokterpemeriksa
                    dokterpengirim = dataItem.dokterpengirim
                    var norec_pp = ''
                    $scope.item.norec_pp = dataItem.norec_pp;
                    // loadClaimPp($scope.item.norec_pp)
                    norec_pp = "'" + dataItem.norec_pp + "'"

                     
                    // var a = dataItem
                    // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                    // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                    // var dokter = $scope.item.DataPegawai
                    // var ruangan = $scope.item.Ruangan.namaruangan;
                    // var dokterPeriksa =  $scope.item.DataPegawaiPemeriksa.namalengkap;
                    var catatan = "-";
                    if ($scope.item.catatan != undefined) {
                        catatan = $scope.item.catatan;
                    }

                    var x = "WHERE (pp.noregistrasifk = '" + norecAPD + "')and (pp.norec in (" + norecPP + ')) and hh.flag is not null'
                    var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + dataItem.noregistrasi
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaRS", "namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                        "paramValue": ["PUSAT KEDOKTERAN DAN KESEHATAN POLRI", "RUMAH SAKIT BHAYANGKARA TK.I R. SAID SUKANTO", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Jl. Raya Bogor, Kramat Jati, Jakarta Timur 13510, Telp. (021)8093288, Psw. 177", user.namaLengkap,
                            x, umurDay, $scope.cc.objectjeniskelaminfk, tglpelayanan, tglhasil, dokterpengirim, ruanganasal, y, diagnosa, dokterpemeriksa, catatan
                        ],
                        "paramType": ["", "", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            //this.response is what you're looking for
                            // handler(this.response);
                            console.log(this.response, typeof this.response);
                            //var res = this.response
                            //var file = new Blob( [res], {type: 'application/pdf'});
                             ;
                            var url = window.URL.createObjectURL(this.response)
                            var pdf = document.getElementById('tempatLaporan');
                            pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                            var win = window.open(url, '_blank');
                            win.focus();
                        }
                    }

                    
					
                    //ash 2023-11-30 untuk menentukan apa dia PPA atau bukan
                    var datauserkelompok = medifirstService.getKelompokUser();


                    if(datauserkelompok == "ppa") {
                        if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                            xhr.open('POST', 'http://192.168.1.7:8797/generic/report/hasillabKlinik.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:8797/generic/report/hasillabKlinik.pdf');
                        } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                            xhr.open('POST', 'http://10.10.20.167:8797/generic/report/hasillabKlinik.pdf');
                        } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                            xhr.open('POST', 'http://10.5.1.2:8797/generic/report/hasillabKlinik.pdf');
                        } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                            xhr.open('POST', 'http://202.51.105.98:8797/generic/report/hasillabKlinik.pdf');
                        } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                            xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/hasillabKlinik.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinik.pdf');
                        }
                    } else {
                        if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                            xhr.open('POST', 'http://192.168.1.7:8797/generic/report/hasillabKlinikSalinan.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:8797/generic/report/hasillabKlinikSalinan.pdf');
                        } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                            xhr.open('POST', 'http://10.10.20.167:8797/generic/report/hasillabKlinikSalinan.pdf');
                        } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                            xhr.open('POST', 'http://10.5.1.2:8797/generic/report/hasillabKlinikSalinan.pdf');
                        } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                            xhr.open('POST', 'http://202.51.105.98:8797/generic/report/hasillabKlinikSalinan.pdf');
                        } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                            xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/hasillabKlinikSalinan.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinikSalinan.pdf');
                        }
                    }
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                }
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                //     });
                //     tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                //     var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                //     var statusUpdate =1;
                //     if($scope.item.cekUpdate == true)
                //     {
                //        statusUpdate = 2
                //     }

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

            $scope.detailHasilLab = function (dataItem) {
                $scope.resultGridsHasilLab = new kendo.data.DataSource({
                    data: []
                })

                $scope.isRouteLoading = true
                var norec_pp = ''
                $scope.item.norec_pp = dataItem.norec_pp;
                norec_pp = "'" + dataItem.norec_pp + "'"
                medifirstService.get("laboratorium/get-hasil-lab-manual?norec_apd=" + dataItem.norec_apd +
                    '&objectjeniskelaminfk=' + dataItem.objectjeniskelaminfk + '&umur=' + dataItem.umur + '&norec=' + norec_pp + '&tgl=' + Date(moment($scope.now).format('YYYY-MM-DD HH:mm:ss'))).then(function (data) {
                        // var sourceGrid = []
                        $scope.isRouteLoading = false;
                        if (data.statResponse == true && data.data.data.length > 0) {
                            // if (data.status === 201) {
                            //  ;
                            // medifirstService.post('tatarekening/save-log-closing-claim', json).then(function (e) {
                            // 	})
                            loadRmPp($scope.item.norec_pp);
                            loadDaftarRmPp(noregistrasi);
                            // }
                            // loadRmPp(norec_pp);
                            // sourceGrid = data.data.data
                            $scope.item.tglpelayanan = new Date(moment(data.data.data[0].tglpelayanan).format('YYYY-MM-DD HH:mm'));
                            $scope.item.tglhasil = new Date(moment(data.data.data[0].tglhasil).format('YYYY-MM-DD HH:mm'));
                            $scope.item.DataPegawai = { namalengkap: data.data.data[0].namalengkap, id: data.data.data[0].id };
                            $scope.item.catatan = data.data.data[0].catatancetak;
                            for (let i = 0; i < data.data.data.length; i++) {
                                const element = data.data.data[i];
                                $scope.item.catatan = data.data.data[i].catatancetak;
                            }
                            $scope.resultGridsHasilLab = new kendo.data.DataSource({
                                data: data.data.data,
                                group: [
                                    { field: "detailjenisproduk" },
                                    // { field: "namaproduk" }
                                ],
                                sort: { field: "nourutdetail", dir: "asc" },
                                schema: {
                                    model: {
                                        id: "id",
                                        fields: {
                                            detailjenisproduk: { editable: false, type: "string" },
                                            detailpemeriksaan: { editable: false, type: "string" },
                                            memohasil: { editable: false, type: "string" },
                                            namaproduk: { editable: false, type: "string" },
                                            satuanstandar: { editable: false, type: "string" },
                                            // detailpemeriksaan: { editable: false, type: "string" },
                                            nilaimax: { editable: false, type: "string" },
                                            nilaimin: { editable: false, type: "string" },
                                            hasil: { editable: false, type: "string" },
                                            nourutdetail: { editable: false, type: "number" },
                                            nilaitext: { editable: false, type: "string" }
                                        }
                                    }
                                }
                            });

                            $scope.popUpDetailLab.center().open();
                        } else {
                            toastr.info('Data Hasil tidak ada', 'Info')
                        }
                    });

            }

            $scope.ColumnResultHasilLab = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "HasilLab.xlsx",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                editable: true,

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
                        }
                    ];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                columns: [{
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
                    field: "hasil_s",
                    title: "S",
                    width: "5%"
                },
                {
                    field: "hasil_i",
                    title: "I",
                    width: "5%"
                },
                {
                    field: "catatan",
                    title: "Catatan",
                    width: "5%"
                },
                {
                    hidden: true,
                    field: "detailjenisproduk",
                    title: "Jenis Pemeriksaan"
                },

                {
                    hidden: true,
                    field: "nourutdetail"

                }
                ]
            };

            $scope.TutupPopUpDetail = function () {
                $scope.popUpDetailLab.center().close();
            }

            $scope.kembali = function () {
                 
                $state.go('RekamMedis.HistoryEMR', {
                    noRec: $scope.norecAPD,
                    emr: 'LaporanOperasi',
                });
            }

            $scope.dosisObat = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="editDosisObat()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Terapi Rawat</button>'
                },],
                editable: true,
                columns: [{
                    field: "namaproduk",
                    title: "Nama Produk",
                    width: "70%"
                },
                {
                    field: "dosisobat",
                    title: "Dosis Obat",
                    width: "20%",
                    editor: dynamicEditor
                }, {
                    field: "frekuensi",
                    title: "Frekuensi",
                    width: "10%",
                    editor: dynamicEditors
                },
                {
                    command: [{ text: "Hapus", click: simpanDeleteObat }],
                    title: "&nbsp;",
                    width: "10%"
                }
                    // {
                    //     // field: "namaproduk",
                    //     title: "",
                    //     width: "10%",
                    //     template: "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(namaproduk)\" style=\"margin:0 0 5px\">#: rm #</button>",
                    // }
                    // {
                    //     // "field": "claim",
                    //     "title": "Resume Medis",
                    //     "width": "100px",
                    //     "template": "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(dataItem)\" style=\"margin:0 0 5px\">#: rm #</button>",
                    // },
                ]
            };
            $scope.dropDownReouteFarmasi = function (container, options) {
                 ;
                var editor = $('<input kendo-combo-box required k-data-text-field="\'text\'" k-data-value-field="\'text\'" k-filter="\'contains\'" k-data-source="listReouteFarmasi" data-bind="value:' + options.field + '"/>')
                    .appendTo(container);
            };
            $scope.dosisObatPulang = {
                toolbar: [{
                    name: "create",
                    text: "Tambah",
                    template: '<button ng-click="editDosisObatPulang()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Terapi Pulang</button>'
                },],
                // editable: true,
                editable: "incell",
                columns: [{
                    field: "namaproduk",
                    title: "Nama Produk",
                    width: "60%"
                },
                {
                    field: "dosisobat",
                    title: "Dosis Obat",
                    width: "10%"
                },
                {
                    field: "frekuensi",
                    title: "Frekuensi",
                    width: "10%"
                },
                {
                    field: "jumlah",
                    title: "Jumlah",
                    width: "5%"
                },
                {
                    field: "carapemberian",
                    title: "Cara Pemberian",
                    width: "10%",
                    editor: $scope.dropDownReouteFarmasi,
                    template: "#=carapemberian.text#"
                },
                // {
                //     field: "carapemberian",
                //     title: "Cara Pemberian",
                //     width: "15%"
                // },
                {
                    command: [{ text: "Hapus", click: simpanDeleteObatPulang }],
                    title: "&nbsp;",
                    width: "10%"
                },
                    // { 
                    //     field: "carapemberians", 
                    //     title: "Cara Pemberian", 
                    //     width: "15%",
                    //     editor: $scope.dropDownReouteFarmasi, 
                    //     template: "#=carapemberians.text#"
                    // },
                ]
            };



            $scope.dosisObatPulangPop = {
                // toolbar: [{
                //     name: "create", text: "Tambah",
                //     template: '<button ng-click="editDosisObatPulang()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah Terapi Rawat</button>'
                // },],
                editable: true,
                columns: [{
                    field: "namaproduk",
                    title: "Nama Produk",
                    width: "60%"
                },
                {
                    field: "dosisobat",
                    title: "Dosis Obat",
                    width: "10%"
                },
                {
                    field: "frekuensi",
                    title: "Frekuensi",
                    width: "10%"
                },
                {
                    field: "jumlah",
                    title: "Jumlah",
                    width: "5%"
                },
                {
                    field: "carapemberian",
                    title: "Cara Pemberian",
                    width: "15%"
                },
                {
                    command: [{ text: "Tambah", click: simpanDeleteObatPulang }],
                    title: "&nbsp;",
                    width: "10%"
                }
                ]
            };

            $scope.dosisObatPop = {
                editable: true,
                columns: [{
                    field: "namaproduk",
                    title: "Nama Produk",
                    width: "70%"
                },
                {
                    field: "dosisobat",
                    title: "Dosis Obat",
                    width: "10%",
                    editor: dynamicEditor
                }, {
                    field: "frekuensi",
                    title: "Frekuensi",
                    width: "10%",
                    editor: dynamicEditors
                },
                {
                    command: [{ text: "Tambah", click: simpanDeleteObat }],
                    title: "&nbsp;",
                    width: "10%"
                }
                    // {
                    //     // field: "namaproduk",
                    //     title: "",
                    //     width: "10%",
                    //     template: "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(namaproduk)\" style=\"margin:0 0 5px\">#: rm #</button>",
                    // }
                    // {
                    //     // "field": "claim",
                    //     "title": "Resume Medis",
                    //     "width": "100px",
                    //     "template": "<button class=\"k-button custom-button\" ng-click=\"loadClaimPpLuar(dataItem)\" style=\"margin:0 0 5px\">#: rm #</button>",
                    // },
                ]
            };


            function dynamicEditor(container, options) {

                // if(options.model.tipedata == 1){
                //   var input = $('<input type="number" class="k-input k-textbox" name="hasil" data-bind="value:hasil">')
                //   input.appendTo(container);
                // }else{
                var input = $('<input type="text" class="k-input k-textbox" name="dosisobat" data-bind="value:dosisobat">');
                input.appendTo(container);
                // }
            };

            function dynamicEditors(container, options) {

                // if(options.model.tipedata == 1){
                //   var input = $('<input type="number" class="k-input k-textbox" name="hasil" data-bind="value:hasil">')
                //   input.appendTo(container);
                // }else{
                var input = $('<input type="text" class="k-input k-textbox" name="frekuensi" data-bind="value:frekuensi">');
                input.appendTo(container);
                // }
            };

            $scope.simpanAddPp = function () {
                // if ($scope.item.password != "diclaim") {
                // 	toastr.error("Password Salah!")
                // 	return;
                // }
                var norec_pp = ''
                norec_pp = $scope.item.norec_pp
                var json = {
                    'norec': $scope.item.norec_pp,
                    'isrm': true
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-add-rm', json).then(function (e) {
                    if (e.status === 201) {
                        //  ;
                        // medifirstService.post('tatarekening/save-log-closing-claim', json).then(function (e) {
                        // 	})
                        loadRmPp(norec_pp);
                        loadDaftarRmPp(noregistrasi);
                        init();
                    }
                })
                // loadClaimPp(norec_ppc)
                // $scope.popUpDetailLab.close()
            }

            $scope.simpanDeletePp = function () {
                 
                var norec_pp = ''
                norec_pp = $scope.item.norec_pp
                var json = {
                    'norec': $scope.item.norec_pp,
                    'isrm': false
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-add-rm', json).then(function (e) {
                    if (e.status === 201) {
                        loadRmPp(norec_pp);
                        loadDaftarRmPp(noregistrasi);
                        init();
                    }
                })
                // $scope.popUpClaim.close()
            }


            // function simpanDeletePpRm () {
            //      
            //     $scope.item.norec_pp = dataItem.norec_pp;
            // 	var norec_pp = ''
            // 	norec_pp = $scope.item.norec_pp
            // 	var json = {
            // 	'norec': $scope.item.norec_pp,
            // 	'isrm': false
            // 	}
            // 	medifirstService.post('tatarekening/save-selesai-transaksi-add-rm', json).then(function (e) { 
            // 		if (e.status === 201) {
            // 			loadRmPp(norec_pp);
            // 		}
            // 	})
            // 	$scope.popUpClaim.close()
            // }

            function clear() {
                $scope.item = {}

            }
            $scope.hapusGrid = function () {
                var item = {
                    "norec": $scope.modelGrid.norec
                }
                medifirstService.post('emr/post-resume-medis-inap/delete', item).then(function (e) {
                    clear()
                    init();
                });
            }

            function categoryDropDownEditor(container, options) {
                $('<input required name="' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        dataTextField: "jenisJabatan",
                        dataValueField: "id",
                        dataSource: $scope.listJenisJabatan
                    });
            }
            var timeoutPromise;
            $scope.$watch('item.filterRiwayat', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    applyFilter("ringkasanriwayatpenyakit", newVal)
                }
            })
            $scope.$watch('item.filterPemeriksaanfisik', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal != oldVal) {
                        applyFilter("pemeriksaanfisik", newVal)
                    }
                }, 500)
            })
            $scope.$watch('item.filterPemeriksaanPenunjang', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal != oldVal) {
                        applyFilter("pemeriksaanpenunjang", newVal)
                    }
                }, 500)
            })

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#gridResumeHead").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }
            $scope.resetFilter = function () {
                var dataGrid = $("#gridResume").data("kendoGrid");
                dataGrid.dataSource.filter({});
                delete $scope.item.filterRiwayat
                delete $scope.item.filterPemeriksaanfisik
                delete $scope.item.filterPemeriksaanPenunjang
            }

            $scope.cetak = function () {
                if ($scope.modelGrid == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                if (confirm('View Resume? ')) {
                    var stt = 'true';
                } else {
                    var stt = 'false'
                }
                // Do nothing!
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/rekammedis?cetak-resume-ri=' + $scope.nocm +
                    '&noRec=' + $scope.modelGrid.norec +
                    '&view=' + stt,
                    function (response) { });
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
            $scope.dataICD10 = {
                names: [{ idtkh: "151", tkh: "", idtgl: "149", tgl: "", iddg: "150", dg: "", idpg: "152", pg: "", norec: "", norectgl: "", norectkh: "", norecdg: "", norecpg: "" }]
            };

            $scope.TambahD10 = function (index) {
                 ;
                var name = { kddiagnosa: { id: null, kdDiagnosa: "" }, keterangan: "", norec_diagnosapasien: "", norec_apd: $scope.norecAPD, objectjenisdiagnosafk: "", tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'), iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss') }
                if ($scope.data.namey.length <= index + 1) {
                    $scope.data.namey.splice(index + 1, 0, name);
                }
            }
            $scope.HapusD10 = function (index) {
                 ;
                var norec_diagnosapasien = $scope.data.namey[index].norec_diagnosapasien;
                if (norec_diagnosapasien != "") {
                    deleteIcd10(norec_diagnosapasien)
                }
                $scope.data.namey.splice(index, 1);

                // var name = {kddiagnosa:{id:"", kdDiagnosa:""}, keterangan:""};
                // if($scope.data.names.length <= index+1){
                //      $scope.data.names.splice(index+1,0,name);
                //  }
            }

            $scope.TambahD9 = function (index) {
                 
                var name = { kddiagnosatindakan: { id: null, kdDiagnosaTindakan: "" }, keterangan: "", norec_diagnosapasien: "", norec_apd: $scope.norecAPD, objectjenisdiagnosafk: "", tglregistrasi: moment($scope.tglregistrasi).format('YYYY-MM-DD HH:mm:ss'), iskasusbaru: 1, iskasusulama: 0, tglinputdiagnosa: moment($scope.now).format('YYYY-MM-DD HH:mm:ss') }
                if ($scope.data.namez.length <= index + 1) {
                    $scope.data.namez.splice(index + 1, 0, name);
                }
            }
            $scope.HapusD9 = function (index) {
                 
                var norec_diagnosapasien = $scope.data.namez[index].norec_diagnosapasien;
                if (norec_diagnosapasien != "") {
                    deleteIcd9(norec_diagnosapasien)
                }
                $scope.data.namez.splice(index, 1);
                // var name = {kddiagnosa:{id:"", kdDiagnosa:""}, keterangan:""};
                // if($scope.data.names.length <= index+1){
                //      $scope.data.names.splice(index+1,0,name);
                //  }
            }

            $scope.HapusUtama = function (index) {
                 ;
                $scope.data.names.splice(index, 1);
                // var name = {kddiagnosa:{id:"", kdDiagnosa:""}, keterangan:""};
                // if($scope.data.names.length <= index+1){
                //      $scope.data.names.splice(index+1,0,name);
                //  }
            }
            $scope.Tambah = function () {
                var nomor = 0
                if ($scope.sourceResume == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data.no = $scope.item.no
                            data.namaobat = $scope.item.namaobat
                            data.jumlah = $scope.item.jumlah
                            data.dosis = $scope.item.dosis
                            data.frekuensi = $scope.item.frekuensi
                            data.carapemberian = $scope.item.carapemberian

                            data2[i] = data;
                            $scope.sourceResume = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }
                } else {
                    data = {
                        no: nomor,
                        namaobat: $scope.item.namaobat,
                        jumlah: $scope.item.jumlah,
                        dosis: $scope.item.dosis,
                        frekuensi: $scope.item.frekuensi,
                        carapemberian: $scope.item.carapemberian,
                    }
                    data2.push(data)
                    $scope.sourceResume = new kendo.data.DataSource({
                        data: data2
                    });

                }
                kosongkan()
            }

            function kosongkan() {
                delete $scope.item.no
                delete $scope.item.namaobat
                delete $scope.item.jumlah
                delete $scope.item.dosis
                delete $scope.item.frekuensi
                delete $scope.item.carapemberian
            }
            $scope.$watch('item.iskontrolya', function(e) {
                if (e == true) {
                    $scope.item.iskontroltidak = false
                }
            })
            $scope.$watch('item.iskontroltidak', function(e) {
                if (e == true) {
                    $scope.item.iskontrolya = false
                    delete $scope.item.tglkontrolpoli
                    delete $scope.item.kontrolpoli
                }
            })
            $scope.$watch('item.isreaksiobatya', function(e) {
                if (e == true) {
                    $scope.item.isreaksiobattidak = false
                }
            })
            $scope.$watch('item.isreaksiobattidak', function(e) {
                if (e == true) {
                    $scope.item.isreaksiobatya = false
                }
            })
            $scope.$watch('item.israwatdirumahya', function(e) {
                if (e == true) {
                    $scope.item.israwatdirumahtidak = false
                }
            })
            $scope.$watch('item.israwatdirumahtidak', function(e) {
                if (e == true) {
                    $scope.item.israwatdirumahya = false
                    delete $scope.item.ishomecareya
                    delete $scope.item.isperawatanlanjutanya
                    delete $scope.item.ispengobatanlukaya
                    delete $scope.item.ispengobatanlanjutanya
                    delete $scope.item.isfaskesterdekatya
                    delete $scope.item.faskesterdekat
                }
            })
            // $scope.$watch('item.islaboratoriumya', function(e) {
            //     if (e == true) {
            //         $scope.item.isradiologiya = false
            //         $scope.item.ispemeriksaanpenunjanglainlainya = false
            //     }
            // })
            // $scope.$watch('item.isradiologiya', function(e) {
            //     if (e == true) {
            //         $scope.item.islaboratoriumya = false
            //         $scope.item.ispemeriksaanpenunjanglainlainya = false
            //     }
            // })
            // $scope.$watch('item.ispemeriksaanpenunjanglainlainya', function(e) {
            //     if (e == true) {
            //         $scope.item.islaboratoriumya = false
            //         $scope.item.isradiologiya = false
            //     }
            // })
            // $scope.$watch('item.ispenyakitya', function(e) {
            //     if (e == true) {
            //         $scope.item.isefeksampingobatya = false
            //         $scope.item.isdietya = false
            //         $scope.item.isaktifitasistirahatya = false
            //         $scope.item.ishygieneya = false
            //         $scope.item.isperawatanlukadirumahya = false
            //         $scope.item.isnyeriya = false
            //         $scope.item.isperawatanibubayiya = false
            //     }
            // })
            // $scope.$watch('item.isefeksampingobatya', function(e) {
            //     if (e == true) {
            //         $scope.item.ispenyakitya = false
            //         $scope.item.isdietya = false
            //         $scope.item.isaktifitasistirahatya = false
            //         $scope.item.ishygieneya = false
            //         $scope.item.isperawatanlukadirumahya = false
            //         $scope.item.isnyeriya = false
            //         $scope.item.isperawatanibubayiya = false
            //     }
            // })
            // $scope.$watch('item.isdietya', function(e) {
            //     if (e == true) {
            //         $scope.item.ispenyakitya = false
            //         $scope.item.isefeksampingobatya = false
            //         $scope.item.isaktifitasistirahatya = false
            //         $scope.item.ishygieneya = false
            //         $scope.item.isperawatanlukadirumahya = false
            //         $scope.item.isnyeriya = false
            //         $scope.item.isperawatanibubayiya = false
            //     }
            // })
            // $scope.$watch('item.isaktifitasistirahatya', function(e) {
            //     if (e == true) {
            //         $scope.item.ispenyakitya = false
            //         $scope.item.isefeksampingobatya = false
            //         $scope.item.isdietya = false
            //         $scope.item.ishygieneya = false
            //         $scope.item.isperawatanlukadirumahya = false
            //         $scope.item.isnyeriya = false
            //         $scope.item.isperawatanibubayiya = false
            //     }
            // })
            // $scope.$watch('item.ishygieneya', function(e) {
            //     if (e == true) {
            //         $scope.item.ispenyakitya = false
            //         $scope.item.isefeksampingobatya = false
            //         $scope.item.isdietya = false
            //         $scope.item.isaktifitasistirahatya = false
            //         $scope.item.isperawatanlukadirumahya = false
            //         $scope.item.isnyeriya = false
            //         $scope.item.isperawatanibubayiya = false
            //     }
            // })
            // $scope.$watch('item.isperawatanlukadirumahya', function(e) {
            //     if (e == true) {
            //         $scope.item.ispenyakitya = false
            //         $scope.item.isefeksampingobatya = false
            //         $scope.item.isdietya = false
            //         $scope.item.isaktifitasistirahatya = false
            //         $scope.item.ishygieneya = false
            //         $scope.item.isnyeriya = false
            //         $scope.item.isperawatanibubayiya = false
            //     }
            // })
            // $scope.$watch('item.isnyeriya', function(e) {
            //     if (e == true) {
            //         $scope.item.ispenyakitya = false
            //         $scope.item.isefeksampingobatya = false
            //         $scope.item.isdietya = false
            //         $scope.item.isaktifitasistirahatya = false
            //         $scope.item.ishygieneya = false
            //         $scope.item.isperawatanlukadirumahya = false
            //         $scope.item.isperawatanibubayiya = false
            //     }
            // })
            // $scope.$watch('item.isperawatanibubayiya', function(e) {
            //     if (e == true) {
            //         $scope.item.ispenyakitya = false
            //         $scope.item.isefeksampingobatya = false
            //         $scope.item.isdietya = false
            //         $scope.item.isaktifitasistirahatya = false
            //         $scope.item.ishygieneya = false
            //         $scope.item.isperawatanlukadirumahya = false
            //         $scope.item.isnyeriya = false
            //     }
            // })

            $scope.$watch('item.isizindokterya', function(e) {
                if (e == true) {
                    $scope.item.ispindahrslainya = false
                    $scope.item.ispulangsendiriya = false
                    $scope.item.ismelarikandiriya = false
                    $scope.item.ismeninggalbeforeya = false
                    $scope.item.ismeninggalafterya = false
                }
            })
            $scope.$watch('item.ispindahrslainya', function(e) {
                if (e == true) {
                    $scope.item.isizindokterya = false
                    $scope.item.ispulangsendiriya = false
                    $scope.item.ismelarikandiriya = false
                    $scope.item.ismeninggalbeforeya = false
                    $scope.item.ismeninggalafterya = false
                }
            })
            $scope.$watch('item.ispulangsendiriya', function(e) {
                if (e == true) {
                    $scope.item.isizindokterya = false
                    $scope.item.ispindahrslainya = false
                    $scope.item.ismelarikandiriya = false
                    $scope.item.ismeninggalbeforeya = false
                    $scope.item.ismeninggalafterya = false
                }
            })
            $scope.$watch('item.ismelarikandiriya', function(e) {
                if (e == true) {
                    $scope.item.isizindokterya = false
                    $scope.item.ispindahrslainya = false
                    $scope.item.ispulangsendiriya = false
                    $scope.item.ismeninggalbeforeya = false
                    $scope.item.ismeninggalafterya = false
                }
            })
            $scope.$watch('item.ismeninggalbeforeya', function(e) {
                if (e == true) {
                    $scope.item.isizindokterya = false
                    $scope.item.ispindahrslainya = false
                    $scope.item.ispulangsendiriya = false
                    $scope.item.ismelarikandiriya = false
                    $scope.item.ismeninggalafterya = false
                }
            })
            $scope.$watch('item.ismeninggalafterya', function(e) {
                if (e == true) {
                    $scope.item.isizindokterya = false
                    $scope.item.ispindahrslainya = false
                    $scope.item.ispulangsendiriya = false
                    $scope.item.ismelarikandiriya = false
                    $scope.item.ismeninggalbeforeya = false
                }
            })

            $scope.$watch('item.ismandiriya', function(e) {
                if (e == true) {
                    $scope.item.isdibantusetengahya = false
                    $scope.item.isdibantupenuhya = false
                }
            })
            $scope.$watch('item.isdibantusetengahya', function(e) {
                if (e == true) {
                    $scope.item.ismandiriya = false
                    $scope.item.isdibantupenuhya = false
                }
            })
            $scope.$watch('item.isdibantupenuhya', function(e) {
                if (e == true) {
                    $scope.item.ismandiriya = false
                    $scope.item.isdibantusetengahya = false
                }
            })

            $scope.$watch('item.iswalkerya', function(e) {
                if (e == true) {
                    $scope.item.isalatbantulainlainya = false
                }
            })
            $scope.$watch('item.isalatbantulainlainya', function(e) {
                if (e == true) {
                    $scope.item.iswalkerya = false
                }
            })

            // $scope.$watch('item.istidakadaalatkesehatanya', function(e) {
            //     if (e == true) {
            //         $scope.item.isivcateterya = false
            //         $scope.item.isdobellumenya = false
            //         $scope.item.isngtya = false
            //         $scope.item.isoksigenya = false
            //         $scope.item.iscateterurineya = false
            //         $scope.item.isalatkesehatanlainlainya = false
            //     }
            // })
            // $scope.$watch('item.isivcateterya', function(e) {
            //     if (e == true) {
            //         $scope.item.istidakadaalatkesehatanya = false
            //         $scope.item.isdobellumenya = false
            //         $scope.item.isngtya = false
            //         $scope.item.isoksigenya = false
            //         $scope.item.iscateterurineya = false
            //         $scope.item.isalatkesehatanlainlainya = false
            //     }
            // })
            // $scope.$watch('item.isdobellumenya', function(e) {
            //     if (e == true) {
            //         $scope.item.istidakadaalatkesehatanya = false
            //         $scope.item.isivcateterya = false
            //         $scope.item.isngtya = false
            //         $scope.item.isoksigenya = false
            //         $scope.item.iscateterurineya = false
            //         $scope.item.isalatkesehatanlainlainya = false
            //     }
            // })
            // $scope.$watch('item.isngtya', function(e) {
            //     if (e == true) {
            //         $scope.item.istidakadaalatkesehatanya = false
            //         $scope.item.isivcateterya = false
            //         $scope.item.isdobellumenya = false
            //         $scope.item.isoksigenya = false
            //         $scope.item.iscateterurineya = false
            //         $scope.item.isalatkesehatanlainlainya = false
            //     }
            // })
            // $scope.$watch('item.isoksigenya', function(e) {
            //     if (e == true) {
            //         $scope.item.istidakadaalatkesehatanya = false
            //         $scope.item.isivcateterya = false
            //         $scope.item.isdobellumenya = false
            //         $scope.item.isngtya = false
            //         $scope.item.iscateterurineya = false
            //         $scope.item.isalatkesehatanlainlainya = false
            //     }
            // })
            // $scope.$watch('item.iscateterurineya', function(e) {
            //     if (e == true) {
            //         $scope.item.istidakadaalatkesehatanya = false
            //         $scope.item.isivcateterya = false
            //         $scope.item.isdobellumenya = false
            //         $scope.item.isngtya = false
            //         $scope.item.isoksigenya = false
            //         $scope.item.isalatkesehatanlainlainya = false
            //     }
            // })
            // $scope.$watch('item.isalatkesehatanlainlainya', function(e) {
            //     if (e == true) {
            //         $scope.item.istidakadaalatkesehatanya = false
            //         $scope.item.isivcateterya = false
            //         $scope.item.isdobellumenya = false
            //         $scope.item.isngtya = false
            //         $scope.item.isoksigenya = false
            //         $scope.item.iscateterurineya = false
            //     }
            // })
            $scope.$watch('item.kondisikeluar', function(e) {
                if (e.id == 6 || e.id == 7) {
                    // $scope.item.statusjenazah = {id:$scope.liststatusjenazah[0].id, statusjenazah:$scope.liststatusjenazah[0].statusjenazah}
                    medifirstService.get('ambulance/get-status-kependudukan?nocm=' + $scope.header.nocm).then(function(dat) {
                    $scope.item.statuskependudukan = {statuskependudukan:dat.data.data.statuskependudukan, id:dat.data.data.id  } 
                })           
                var selisihWaktu = new Date($scope.header.tglregistrasi) - new Date($scope.header.tgllahir);
                var selisihHari = selisihWaktu / (1000 * 60 * 60 * 24);            
                if (selisihHari > 7) {
                   $scope.penyebab1 = true;
                   $scope.penyebab2 = false;
                } else {
                   $scope.penyebab1 = false;
                   $scope.penyebab2 = true;
                }
                //**Cek Kematiannya Dulu */
                medifirstService.get('ambulance/get-status-kematian?noregistrasi=' + $scope.header.noregistrasi).then(function(dat) {
                    noreckematian = dat.data.data.norec 
                    nosuratkematian = dat.data.data.nosuratkematian 
                    $scope.item.hubungankeluarga = {hubungankeluargakematian:dat.data.data.hubungankeluargakematian, hubungankeluargakematianfk:dat.data.data.hubungankeluargakematianfk  } 
                    $scope.item.tglmeninggal = dat.data.data.tglmeninggalkematian
                    $scope.item.dasardiagnosis =  {dasardiagnosis:dat.data.data.dasardiagnosis, id:dat.data.data.ddid  } 
                    $scope.item.penyebabkematian =  {penyebabkematian:dat.data.data.penyebabkematian, id:dat.data.data.pkid  } 
                    $scope.item.doktermenerangkan =  {namadokter:dat.data.data.namalengkap, id:dat.data.data.pgid  } 
                    $scope.item.penyebablangsunga = {kodeNama:dat.data.data.penyebablangsunga  } 
                    $scope.item.penyebablangsungb = {kodeNama:dat.data.data.penyebablangsungb  } 
                    $scope.item.penyebablangsungc = {kodeNama:dat.data.data.penyebablangsunga  } 
                    $scope.item.penyebablangsungd = {kodeNama:dat.data.data.penyebablangsungd  } 
                    $scope.item.kondisilain = dat.data.data.kondisilain
                    $scope.item.penyebabutamabayi = {kodeNama:dat.data.data.penyebabutamabayi  } 
                    $scope.item.penyebablainbayi = {kodeNama:dat.data.data.penyebablainbayi  } 
                    $scope.item.penyebabutamaibu = {kodeNama:dat.data.data.penyebabutamaibu  } 
                    $scope.item.penyebablainibu = dat.data.data.penyebablainibu
                })  
                    $scope.PopUpInputKematian.center().open();
                    kematian()
                }
            })

            function kematian(){               
                $scope.item.nama = $scope.header.namapasien;
                medifirstService.get("ambulance/get-data-for-combo", true).then(function (dat) {
                    $scope.liststatuskependudukan = dat.data.statuskependudukan;
                    $scope.listhubungankeluargakematian = dat.data.hubungankeluargakematian;                
                    $scope.listdasardiagnosis = dat.data.dasardiagnosis;                
                    $scope.listdokter = dat.data.dokter;                                    
                    $scope.listpenyebabkematian = dat.data.penyebabkematian;          
                })
            }
            function Kosongkankematian() {
                $scope.item.statuskependudukan = undefined;
                $scope.item.statusjenazah = undefined;
                $scope.item.namapemeriksajenazah = undefined;
                $scope.item.kualifikasipemeriksa = undefined;
                $scope.item.tgldimakamkan = undefined;
                $scope.item.waktupemeriksaan = '';
                $scope.item.dasardiagnosis = undefined;
                $scope.item.penyebablangsunga = undefined;
                $scope.item.penyebablangsungb = undefined;
                $scope.item.penyebablangsungc = undefined;
                $scope.item.penyebablangsungd = undefined;
                $scope.item.kondisilain = undefined;
                $scope.item.penyebabutamabayi = undefined;
                $scope.item.penyebablainbayi = undefined;
                $scope.item.penyebabutamaibu = undefined;
                $scope.item.penyebablainibu = undefined;
                $scope.item.doktermenerangkan = undefined;
            }
            $scope.simpankematian = function () {               
                if($scope.item.penyebabkematian == undefined){
                    toastr.error('Penyebab Kematian Wajib Diisi!')
                    return;
                }
                if($scope.item.tglmeninggal == undefined){
                    toastr.error('Tgl Meninggal Wajib Diisi!')
                    return;
                }
                if($scope.item.hubungankeluarga == undefined){
                    toastr.error('Hubungan Keluarga Wajib Diisi!')
                    return;
                }
                if($scope.item.dasardiagnosis == undefined){
                    toastr.error('Dasar Diagnosis Wajib Diisi!')
                    return;
                }
                if($scope.item.doktermenerangkan == undefined){
                    toastr.error('Dokter Yang Menerangkan Wajib Diisi!')
                    return;
                }
                if($scope.item.tglmeninggal == undefined){
                    toastr.error('Tanggal Meninggal Wajib Diisi!')
                    return;
                }
                var statuskependudukan = null;
                if ($scope.item.statuskependudukan != undefined) {
                    statuskependudukan = $scope.item.statuskependudukan.id;
                }
                var penyebablangsunga = null;
                if ($scope.item.penyebablangsunga != undefined) {
                    penyebablangsunga = $scope.item.penyebablangsunga.kodeNama;
                }
                var penyebablangsungb = null;
                if ($scope.item.penyebablangsungb != undefined) {
                    penyebablangsungb = $scope.item.penyebablangsungb.kodeNama;
                }
                var penyebablangsungc = null;
                if ($scope.item.penyebablangsungc != undefined) {
                    penyebablangsungc = $scope.item.penyebablangsungc.kodeNama;
                }
                var penyebablangsungd = null;
                if ($scope.item.penyebablangsungd != undefined) {
                    penyebablangsungd = $scope.item.penyebablangsungd.kodeNama;
                }
                var kondisilain = null;
                if ($scope.item.kondisilain != undefined) {
                    kondisilain = $scope.item.kondisilain;
                }
                var penyebabutamabayi = null;
                if ($scope.item.penyebabutamabayi != undefined) {
                    penyebabutamabayi = $scope.item.penyebabutamabayi.kodeNama;
                }
                var penyebablainbayi = null;
                if ($scope.item.penyebablainbayi != undefined) {
                    penyebablainbayi = $scope.item.penyebablainbayi.kodeNama;
                }
                var penyebabutamaibu = null;
                if ($scope.item.penyebabutamaibu != undefined) {
                    penyebabutamaibu = $scope.item.penyebabutamaibu.kodeNama;
                }
                var penyebablainibu = null;
                if ($scope.item.penyebablainibu != undefined) {
                    penyebablainibu = $scope.item.penyebablainibu;
                }
                var objSave = {
                    norec: noreckematian,
                    nosuratkematian: nosuratkematian,
                    statuskependudukan: statuskependudukan,
                    hubunganKeluarga: $scope.item.hubungankeluarga.hubungankeluargakematianfk,                
                    dasardiagnosis: $scope.item.dasardiagnosis.id,
                    penyebablangsunga: penyebablangsunga,
                    penyebablangsungb: penyebablangsungb,
                    penyebablangsungc: penyebablangsungc,
                    penyebablangsungd: penyebablangsungd,
                    kondisilain: kondisilain,
                    penyebabutamabayi: penyebabutamabayi,
                    penyebablainbayi: penyebablainbayi,
                    penyebabutamaibu: penyebabutamaibu,
                    penyebablainibu: penyebablainibu,
                    tglmeninggal: moment($scope.item.tglmeninggal).format('YYYY-MM-DD HH:mm:ss'),                
                    noregistrasi: $scope.header.noregistrasi,
                    doktermenerangkan: $scope.item.doktermenerangkan.id,
                    penyebabkematian: $scope.item.penyebabkematian.id,
                    asalinputankematian: 'Resume IGD',
                    namajenazah: $scope.header.namapasien,
                }
                // debugger
                medifirstService.post('ambulance/save-surat-kematian-resume', objSave).then(function (e) {
                    if (e.status == 201) {
                    $scope.isRouteLoading = true;
                    $scope.PopUpInputKematian.center().close();   
                    $scope.isRouteLoading = false;
                    Kosongkankematian();
                }               
                
                });
            }
            $scope.ambilPengkajianMedis = function() {
                medifirstService.get('emr/get-risk-down?namaexternal=RI').then(function(data) {   
                
                      $scope.datapengkajian = new kendo.data.DataSource({
                          data: data.data.data,
                          pageSize: 10,
                      });
                      $scope.columnDaftarPengkajian = [{
                           "field": "caption",
                           "title": "Caption",
                           "width": "20px"
                       },
                   ];
                  });   
              $scope.popuppengkajian.center().open()
            }
            $scope.klikpengkajian = function(pilihpengkajian) {
                $scope.pilihpengkajian = pilihpengkajian;
               

            }

            $scope.create = function () {
                /*if ($scope.pilihpengkajian.id == 675) {
                    getFromPengkajianMedisRanap($scope.noregistrasi);
                } else if ($scope.pilihpengkajian.id == 907) {
                    getFromPengkajianMedisRanapSaraf($scope.noregistrasi);
                } else if ($scope.pilihpengkajian.id == 908) {
                    getFromPengkajianMedisRanapAnak($scope.noregistrasi);
                }*/

                var pilihpengkajian = $scope.pilihpengkajian;
                
                var datpemeriksaanfisik=''
                $scope.item.keluhanutama =''
                $scope.item.alergi = ''                        
                $scope.item.riwayatPenyakit = ''                        
                $scope.item.kesadaran = undefined
                $scope.item.keadaanUmum = ''
                $scope.item.denyutbefore = ''
                $scope.item.suhubefore = ''
                $scope.item.pernafasanbefore = ''
                $scope.item.tekanansystolebefore = ''
                $scope.item.tekanandiastolebefore = ''
                $scope.item.pemeriksaanfisik = ''

                $scope.keadaan=''
                //ash 2023-12-10
                medifirstService.get("emr/get-emr-transaksi?noregistrasi=" + $scope.cc.noregistrasi + "&jenisEmr=" + pilihpengkajian.jenisemr, true).then(function(dat) {
                    //debugger
                    $scope.dd=dat.data.data[0];
                    medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + $scope.dd.noemr + "&emrfk=" + $scope.dd.emrfk, true).then(function (datx) {
                                                
                        for (var i = 0; i <= datx.data.data.length - 1; i++) {
                            $scope.keadaan=datx.data.data[i].value ;

                            if(pilihpengkajian.jenisemr=="asesmen") { //Pengkajian Medis Pasien
                                if (datx.data.data[i].emrdfk == 1238) { //keluhan utama
                                    $scope.item.keluhanutama =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 2586) { //alergi
                                    $scope.item.alergi =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1240) { //riwayat penyakit
                                    $scope.item.riwayatPenyakit =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1168) { //kesadaran
                                    $scope.item.kesadaran = {kesadaran: datx.data.data[i].value}
                                } else if (datx.data.data[i].emrdfk == 1258) { //keadaan umum
                                    $scope.item.keadaanUmum = datx.data.data[i].value
                                    
                                } else if (datx.data.data[i].emrdfk == 1170) { //denyut jantung
                                    $scope.item.denyutbefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1172) { //suhu
                                    $scope.item.suhubefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1173) { //pernafasan
                                    $scope.item.pernafasanbefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1169) { //tekanan darah
                                    let str = datx.data.data[i].value
                                    let res = str.split("/");
                                    $scope.item.tekanansystolebefore = res[0]
                                    $scope.item.tekanandiastolebefore = res[1]
                                } else if (datx.data.data[i].emrdfk == 4672) { //kepala
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kepala, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4673) { //kepala
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4675) { //leher
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Leher, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4676) { //leher
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4678) { //Thorax
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Thorax, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4679) { //Thorax
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4681) { //Abdomen
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Abdomen, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4682) { //ABdomen
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4684) { //Extremitas
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Extremitas, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4685) { //Extremitas
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4687) { //Genitalia
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Genitalia, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4688) { //Genitalia
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4690) { //Anus
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Anus, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4691) { //Anus
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4693) { //Pemeriksaan Neurologis
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Pemeriksaan Neurologis, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4694) { //Pemeriksaan Neurologis
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4696) { //Kulit
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kulit, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4697) { //Kulit
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                }


                            } else if(pilihpengkajian.jenisemr=="pengkajianawalkeperawatankebidananranap") { //Pengkajian Medis Kebidanan
                                if (datx.data.data[i].emrdfk == 151) { //keluhan utama
                                    $scope.item.keluhanutama =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 148) { //alergi
                                    $scope.item.alergi =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1168) { //kesadaran
                                    $scope.item.kesadaran ={kesadaran: datx.data.data[i].value}
                                } else if (datx.data.data[i].emrdfk == 1258) { //keadaan umum
                                    $scope.item.keadaanUmum = datx.data.data[i].value
                                    
                                } else if (datx.data.data[i].emrdfk == 1170) { //denyut jantung
                                    $scope.item.denyutbefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1172) { //suhu
                                    $scope.item.suhubefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1173) { //pernafasan
                                    $scope.item.pernafasanbefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1169) { //tekanan darah
                                    let str = datx.data.data[i].value
                                    let res = str.split("/");
                                    $scope.item.tekanansystolebefore = res[0]
                                    $scope.item.tekanandiastolebefore = res[1]
                                } else if (datx.data.data[i].emrdfk == 4672) { //kepala
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kepala, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4673) { //kepala
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4675) { //leher
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Leher, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4676) { //leher
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4678) { //Thorax
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Thorax, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4679) { //Thorax
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4684) { //Abdomen
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Abdomen, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4685) { //Abdomen
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4687) { //Genitalia
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Genitalia, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4688) { //Genitalia
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4690) { //Anus
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Anus, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4691) { //Anus
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4693) { //Pemeriksaan Neurologis
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Pemeriksaan Neurologis, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4694) { //Pemeriksaan Neurologis
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4696) { //Kulit
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kulit, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4697) { //Kulit
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                }

                            } else if(pilihpengkajian.jenisemr=="pengkajianawalparu") { //Pengkajian Medis Paru
                                if (datx.data.data[i].emrdfk == 2378) { //keluhan utama
                                    $scope.item.keluhanutama =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 2381) { //alergi
                                    $scope.item.alergi =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 2380) { //riwayat penyakit
                                    $scope.item.riwayatPenyakit =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1168) { //kesadaran
                                    $scope.item.kesadaran ={kesadaran: datx.data.data[i].value}
                                } else if (datx.data.data[i].emrdfk == 2398) { //keadaan umum
                                    $scope.item.keadaanUmum = datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1170) { //denyut jantung
                                    $scope.item.denyutbefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1172) { //suhu
                                    $scope.item.suhubefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1173) { //pernafasan
                                    $scope.item.pernafasanbefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1169) { //tekanan darah
                                    let str = datx.data.data[i].value
                                    let res = str.split("/");
                                    $scope.item.tekanansystolebefore = res[0]
                                    $scope.item.tekanandiastolebefore = res[1]
                                } else if (datx.data.data[i].emrdfk == 4672) { //kepala
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kepala, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4673) { //kepala
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4675) { //leher
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Leher, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4676) { //leher
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4678) { //Thorax
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Thorax, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4679) { //Thorax
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4684) { //Abdomen
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Abdomen, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4685) { //Abdomen
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4687) { //Genitalia
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Genitalia, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4688) { //Genitalia
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4690) { //Anus
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Anus, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4691) { //Anus
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4693) { //Pemeriksaan Neurologis
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Pemeriksaan Neurologis, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4694) { //Pemeriksaan Neurologis
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4696) { //Kulit
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kulit, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4697) { //Kulit
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                }

                            } else if(pilihpengkajian.jenisemr=="pengkajianawalmedisrianak") { //Pengkajian Medis Anak RI
                                if (datx.data.data[i].emrdfk == 4729) { //keluhan utama
                                    $scope.item.keluhanutama =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4733) { //alergi tidak
                                    $scope.item.alergi = 'Tidak'
                                } else if (datx.data.data[i].emrdfk == 4734) { //alergi
                                    $scope.item.alergi =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4730) { //riwayat penyakit
                                    $scope.item.riwayatPenyakit =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4767) { //kesadaran
                                    $scope.item.kesadaran ={kesadaran: datx.data.data[i].value}
                                } else if (datx.data.data[i].emrdfk == 4768) { //keadaan umum
                                    $scope.item.keadaanUmum = datx.data.data[i].value
                                    
                                } else if (datx.data.data[i].emrdfk == 4765) { //denyut jantung
                                    $scope.item.denyutbefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4764) { //suhu
                                    $scope.item.suhubefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4763) { //pernafasan
                                    $scope.item.pernafasanbefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4762) { //tekanan darah
                                    let str = datx.data.data[i].value
                                    let res = str.split("/");
                                    $scope.item.tekanansystolebefore = res[0]
                                    $scope.item.tekanandiastolebefore = res[1]
                                } else if (datx.data.data[i].emrdfk == 4775) { //kepala
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kepala, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4776) { //kepala
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4778) { //leher
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Leher, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4779) { //leher
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4781) { //Thorax
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Thorax, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4782) { //Thorax
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4784) { //Abdomen
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Abdomen, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4785) { //Abdomen
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4787) { //Extremitas
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Extremitas, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4788) { //Extremitas
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4790) { //Genitalia
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Genitalia, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4791) { //Genitalia
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4793) { //Anus
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Anus, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4794) { //Anus
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4796) { //Pemeriksaan Neurologis
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Pemeriksaan Neurologis, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4797) { //Pemeriksaan Neurologis
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4799) { //Kulit
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kulit, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4800) { //Kulit
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                }

                            } else if(pilihpengkajian.jenisemr=="pengkajianawaljiwari") { //Pengkajian Medis JIWA
                                if (datx.data.data[i].emrdfk == 5888) { //keluhan utama
                                    $scope.item.keluhanutama =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4672) { //kepala
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kepala, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4673) { //kepala
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4675) { //leher
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Leher, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4676) { //leher
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4678) { //Thorax
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Thorax, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4679) { //Thorax
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4684) { //Abdomen
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Abdomen, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4685) { //Abdomen
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4687) { //Genitalia
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Genitalia, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4688) { //Genitalia
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4690) { //Anus
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Anus, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4691) { //Anus
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4693) { //Pemeriksaan Neurologis
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Pemeriksaan Neurologis, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4694) { //Pemeriksaan Neurologis
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4696) { //Kulit
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kulit, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4697) { //Kulit
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                }
                            } else if(pilihpengkajian.jenisemr=="pengkajianawalmata") { //Pengkajian Medis Mata
                                if (datx.data.data[i].emrdfk == 1261) { //keluhan utama
                                    $scope.item.keluhanutama =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4672) { //kepala
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kepala, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4673) { //kepala
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4675) { //leher
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Leher, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4676) { //leher
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4678) { //Thorax
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Thorax, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4679) { //Thorax
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4684) { //Abdomen
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Abdomen, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4685) { //Abdomen
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4687) { //Genitalia
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Genitalia, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4688) { //Genitalia
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4690) { //Anus
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Anus, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4691) { //Anus
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4693) { //Pemeriksaan Neurologis
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Pemeriksaan Neurologis, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4694) { //Pemeriksaan Neurologis
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4696) { //Kulit
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kulit, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4697) { //Kulit
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                }
                            } else if(pilihpengkajian.jenisemr=="pengkajianawalmedisrisaraf") { //Pengkajian Medis Saraf
                                if (datx.data.data[i].emrdfk == 4644) { //keluhan utama
                                    $scope.item.keluhanutama =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4645) { //riwayat penyakit
                                    $scope.item.riwayatPenyakit =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4668) { //alergi tidak
                                    $scope.item.alergi = 'Tidak'
                                } else if (datx.data.data[i].emrdfk == 4670) { //alergi
                                    $scope.item.alergi =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4652) { //kesadaran
                                    $scope.item.kesadaran ={kesadaran: datx.data.data[i].value}
                                } else if (datx.data.data[i].emrdfk == 4653) { //keadaan umum
                                    $scope.item.keadaanUmum = datx.data.data[i].value
                                    
                                } else if (datx.data.data[i].emrdfk == 4650) { //denyut jantung
                                    $scope.item.denyutbefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4649) { //suhu
                                    $scope.item.suhubefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4648) { //pernafasan
                                    $scope.item.pernafasanbefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4647) { //tekanan darah
                                    let str = datx.data.data[i].value
                                    let res = str.split("/");
                                    $scope.item.tekanansystolebefore = res[0]
                                    $scope.item.tekanandiastolebefore = res[1]
                                } else if (datx.data.data[i].emrdfk == 4672) { //kepala
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kepala, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4673) { //kepala
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4675) { //leher
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Leher, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4676) { //leher
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4678) { //Thorax
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Thorax, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4679) { //Thorax
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4684) { //Abdomen
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Abdomen, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4685) { //Abdomen
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4687) { //Genitalia
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Genitalia, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4688) { //Genitalia
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4690) { //Anus
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Anus, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4691) { //Anus
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4693) { //Pemeriksaan Neurologis
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Pemeriksaan Neurologis, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4694) { //Pemeriksaan Neurologis
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4696) { //Kulit
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kulit, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4697) { //Kulit
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                }

                            } else if(pilihpengkajian.jenisemr=="thtranap") { //Pengkajian Medis THT                                
                                if (datx.data.data[i].emrdfk == 1238) { //keluhan utama
                                    $scope.item.keluhanutama =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 2586) { //alergi
                                    $scope.item.alergi =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1240) { //riwayat penyakit
                                    $scope.item.riwayatPenyakit =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1258) { //keadaan umum
                                    $scope.item.keadaanUmum = datx.data.data[i].value
                                    
                                } else if (datx.data.data[i].emrdfk == 1170) { //denyut jantung
                                    $scope.item.denyutbefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1172) { //suhu
                                    $scope.item.suhubefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1169) { //tekanan darah
                                    let str = datx.data.data[i].value
                                    let res = str.split("/");
                                    $scope.item.tekanansystolebefore = res[0]
                                    $scope.item.tekanandiastolebefore = res[1]

                                } else if (datx.data.data[i].emrdfk == 4672) { //kepala
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kepala, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4673) { //kepala
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4675) { //leher
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Leher, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4676) { //leher
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4678) { //Thorax
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Thorax, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4679) { //Thorax
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4684) { //Abdomen
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Abdomen, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4685) { //Abdomen
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4687) { //Genitalia
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Genitalia, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4688) { //Genitalia
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4690) { //Anus
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Anus, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4691) { //Anus
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4693) { //Pemeriksaan Neurologis
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Pemeriksaan Neurologis, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4694) { //Pemeriksaan Neurologis
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4696) { //Kulit
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kulit, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4697) { //Kulit
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                }

                            } else if(pilihpengkajian.jenisemr=="bedahranap") { //Pengkajian Medis Bedah
                                if (datx.data.data[i].emrdfk == 1238) { //keluhan utama
                                    $scope.item.keluhanutama =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 4734) { //alergi
                                    $scope.item.alergi =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 1240) { //riwayat penyakit
                                    $scope.item.riwayatPenyakit =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 2414) { //kesadaran
                                    var str = datx.data.data[i].value 
                                    if(str.includes("~")) {
                                        var res = str.split("~");
                                        $scope.item.kesadaran = {kesadaran: res[1]}
                                    } else {
                                        $scope.item.kesadaran = {kesadaran: str}
                                    }

                                    //$scope.item.kesadaran =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 2415) { //keadaan umum
                                    var str = datx.data.data[i].value 
                                    if(str.includes("~")) {
                                        var res = str.split("~");
                                        $scope.item.keadaanUmum = res[1]
                                    } else {
                                        $scope.item.keadaanUmum = str
                                    }
                                    //$scope.item.keadaanUmum = {'keadaanumum' : datx.data.data[i].value }
                                    
                                } else if (datx.data.data[i].emrdfk == 2412) { //denyut jantung
                                    $scope.item.denyutbefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 2411) { //suhu
                                    $scope.item.suhubefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 2410) { //pernafasan
                                    $scope.item.pernafasanbefore =datx.data.data[i].value
                                } else if (datx.data.data[i].emrdfk == 2409) { //tekanan darah
                                    let str = datx.data.data[i].value
                                    let res = str.split("/");
                                    $scope.item.tekanansystolebefore = res[0]
                                    $scope.item.tekanandiastolebefore = res[1]
                                } else if (datx.data.data[i].emrdfk == 4672) { //kepala
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kepala, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4673) { //kepala
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4675) { //leher
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Leher, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4676) { //leher
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4678) { //Thorax
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Thorax, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4679) { //Thorax
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4684) { //Abdomen
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Abdomen, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4685) { //Abdomen
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4687) { //Genitalia
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Genitalia, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4688) { //Genitalia
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4690) { //Anus
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Anus, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4691) { //Anus
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4693) { //Pemeriksaan Neurologis
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Pemeriksaan Neurologis, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4694) { //Pemeriksaan Neurologis
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                } else if (datx.data.data[i].emrdfk == 4696) { //Kulit
                                    if(datx.data.data[i].value == 1 ) datpemeriksaanfisik = datpemeriksaanfisik + "\n" + "Kulit, Ada Kelainan "
                                } else if (datx.data.data[i].emrdfk == 4697) { //Kulit
                                    datpemeriksaanfisik = datpemeriksaanfisik + datx.data.data[i].value 
                                }
                            }
                        }
                        if(datpemeriksaanfisik == '' ) $scope.item.pemeriksaanfisik = 'Tidak Ada Kelainan' 
                        else $scope.item.pemeriksaanfisik = datpemeriksaanfisik;
                    })
                })
                 



                






                $scope.popuppengkajian.close();
            }
            $scope.closethedoor = function() {
                $scope.PopUpInputKematian.close();
            }
            $scope.SaveResumeFinal = function () {
                if ($scope.norec == '-') {
                    toastr.error('Resume Belum Disimpan ! Tidak Bisa Simpan Final !')
                    return
                }
                let objSave = {
                    "norec": $scope.norec,
                    "jenis": 'final'
                }
                medifirstService.post('emr/update-final-resume-ri', objSave).then(function(e) {
                    $scope.isfinal = true
                    $scope.isbuttonfinal = false
                })
            }
            $scope.SaveResumeFinalBatal = function () {
                if ($scope.norec == '-') {
                    toastr.error('Resume Belum Disimpan ! Tidak Bisa Simpan Final !')
                    return
                }
                let objSave = {
                    "norec": $scope.norec,
                    "jenis": 'batalfinal'
                }
                medifirstService.post('emr/update-final-resume-ri', objSave).then(function(e) {
                    $scope.isfinal = false
                    $scope.isbuttonfinal = true
                })
            }
            function getBase64(file,jenis) {
                debugger

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    //    tes.push(reader)
                    console.log(reader.result)
                    // foto.push({ foto: (reader.result), id: 4 })
                    saveFilePapj(reader.result,jenis)
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
            function saveFilePapj(file,jenis) {
                debugger
                let objSave = {
                    'jenis': jenis,
                    'noregistrasi': $scope.cc.noregistrasi,
                    'file': file
                }
                // medifirstService.postNonMessage('registrasi/post-file-papj', objSave).then(function(e) {
// matikan dulu sementara - kholid
                // })
            }
            function saveToFilePapj() {
                medifirstService.get('emr/get-penunjang-resume-ranap?noregistrasifk=' + $scope.norec).then(function (dat) {
                    medifirstService.get('emr/get-kepentingan-resume-rj?norec=' + $scope.norec).then(function(dat2) {
                    let penunjang2 = dat2.data;
                    let penunjang = dat.data.data;
                    let obat = '';
                    let obatCounter = 0;
                    // let obatqty = '';
                    // let obataturanpakai = '';
                    let labproduk = '';
                    let labpa = '';
                    let radiologiproduk = '';
                    let diagnosisawal = '';
                    let diagnosisprimer = '';
                    let diagnosissekunder = '';
                    let diagnosis = '';
                    let obatpulang = '';
                    let obatpulangcounter = 0;
                    let tindakanmedisicd9 = '';

                    let tampung = '';
					let tampung2 = '';
					let tampung3 = '';
					let tampung4 = '';
                    let tampung5 = '';
                    let tampung6 = '';
                    let tampung7 = '';
					let nourut = 1;
					let penunjanglab = ''
					let tindakanlab = ''
					let penunjangrad = ''
					let tindakanrad = ''
					let penunjangpa = ''
					let tindakanpa = ''
					let penunjangall = ''
                    tindakan
                    for (let k = 0; k < tindakan.length; k++) {
                        tindakanmedisicd9 += tindakan[k].kddiagnosatindakan + ' - ' + tindakan[k].namadiagnosatindakan + '\n';
                    }

                    for (let i = 0; i < penunjang.length; i++) {
                        if (penunjang[i].jenispenunjang === 'OBAT') {
                            obatCounter++;
                            obat += `${obatCounter}. ${penunjang[i].namaproduk}  ${penunjang[i].frekuensi} \n`;
                            // obatqty += penunjang[i].qty + '\n';
                            // obataturanpakai += penunjang[i].frekuensi + '\n';
                        } 
                        // else if (penunjang[i].jenispenunjang === 'LAB') {
                        //     labproduk += 'Laboratorium Patalogi Klinik : ' + penunjang[i].namaproduk + '\n';
                            

                        //     if(penunjang[i].flaglab === 'Y') {
                        //         penunjanglab = 'Laboratorium Patologi Klinik : '
                        //         penunjanglab = penunjanglab + penunjang[i].namaproduk + '- Hasil : ' +  penunjang[i].hasilpenunjang + '\n';
                        //     }
                        // } 
                        else if (penunjang[i].jenispenunjang === 'LABPA') {
                            labpa += 'Laboratorium Patalogi Anatomi : ' + penunjang[i].namaproduk + '\n';

                            penunjangpa = 'Laboratorium Patologi Anatomi : '
                            
								if (penunjang[i].hasilpenunjang  != null) {
                                    penunjangpa = 'Laboratorium Patologi Anatomi : '
									tampung4 = penunjang[i].hasilpenunjang
									let kalimat = penunjang[i].hasilpenunjang;
									let panjang = kalimat.length;
									let temukan = kalimat.indexOf("KESIMPULAN");
									if (temukan < 0) {
										temukan = kalimat.indexOf("KESIMPULAN");
									}
									let filter = kalimat.slice(temukan, panjang)
									filter = filter.replace(/(<([^>]+)>)/gi, "");
									filter = filter.replace(/&nbsp;/g, "");
									tampung2 = filter
									penunjangpa = penunjangpa + tampung2
								}
                        } else if (penunjang[i].jenispenunjang === 'RAD') {
                            radiologiproduk += 'Radiologi : ' + penunjang[i].namaproduk + '\n';
                            
                            

							if (penunjang[i].hasilpenunjang  != null) {
                                    
					                penunjangrad = penunjangrad + 'Radiologi : '
									tampung4 = penunjang[i].hasilpenunjang
									let kalimat = penunjang[i].hasilpenunjang
									let panjang = kalimat.length;
									let temukan = kalimat.indexOf("kesan");
									if (temukan < 0) {
										temukan = kalimat.indexOf("Kesan");
									}
									if (temukan < 0) {
										temukan = kalimat.indexOf("KESAN");
									}
									if (temukan < 0) {
										temukan = kalimat.indexOf("Kesimpulan");
									}
									if (temukan < 0) {
										temukan = kalimat.indexOf("kesimpulan");
									}
									let filter = kalimat.slice(temukan, panjang)
									filter = filter.replace(/(<([^>]+)>)/gi, "");
									filter = filter.replace(/&nbsp;/g, " ");
									tampung2 = filter
									penunjangrad = penunjangrad + penunjang[i].namaproduk + " " + tampung2 + " \n"
							}
                        } else if (penunjang[i].jenispenunjang === 'TINDAKAN ICD 9') {
                            // tindakanmedisicd9 += penunjang[i].namadiagnosa + '\n';
                        } else if (penunjang[i].jenispenunjang === 'OBATPULANG') {
                            var num = parseInt(penunjang[i].qty)
                            var roman = {
                                M: 1000,
                                CM: 900,
                                D: 500,
                                CD: 400,
                                C: 100,
                                XC: 90,
                                L: 50,
                                XL: 40,
                                X: 10,
                                IX: 9,
                                V: 5,
                                IV: 4,
                                I: 1
                              };
                              var str = '';
                            
                              for (var k of Object.keys(roman)) {
                                var q = Math.floor(num / roman[k]);
                                num -= q * roman[k];
                                str += k.repeat(q);
                              }
                              penunjang[i].qty = str
                            obatpulangcounter++;
                            obatpulang += `${obatpulangcounter}. ${penunjang[i].namaproduk} ${penunjang[i].frekuensi}   (${penunjang[i].qty}) \n`;
                        }

                        if (penunjang[i].frekuensi === 'Primary / utama') {
                            diagnosisprimer += 'Diagnosis Primer/utama :'+ " "+penunjang[i].kddiagnosa+"-"+ penunjang[i].namadiagnosa+ '\n';
                        } else if (penunjang[i].frekuensi === 'Secondary') {
                            diagnosissekunder += 'Diagnosis Sekunder :'+ " "+penunjang[i].kddiagnosa+"-"+ penunjang[i].namadiagnosa+ '\n';
                        } else if (penunjang[i].frekuensi === 'Diagnosa Awal') {
                            diagnosisawal += 'Diagnosis Awal :'+ " "+penunjang[i].kddiagnosa+"-"+ penunjang[i].namadiagnosa+ '\n';
                        }
                    }
                    labproduk = labproduk + labpa + radiologiproduk
                    diagnosis = diagnosisprimer + '\n' + diagnosissekunder + '\n' + diagnosisawal;
                    
                    //let y = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-new?idPegawai="+ $scope.modelGrid.pegawaifk
                    let y = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-fleksibel?idPegawai=" + $scope.item.dokter.id + "&pesan=RESUME MEDIS RAWAT INAP"  + "&noregistrasi=" + $scope.cc.noregistrasi
                    let z = "http://simrs-rspusatpolri.com:9000/service/medifirst2000/report/cetak-ttd-pasien?noregistrasi=" + $scope.cc.noregistrasi
                    for (let p = 0; p < penunjang2.length; p++) {
						if (penunjang2[p].jenispenunjang == 'LAB') {
							// debugger
							tampung5 = tampung5 + nourut + ". " + penunjang2[p].namaproduk + " = " + "\n"
							labproduk = labproduk + 'Laboratorium Patalogi Klinik : ' + penunjang2[p].namaproduk + "\n"
							for (let j = 0; j < penunjang2[p].detail.length; j++) {
								if (penunjang2[p].detail[j].hasilpenunjang != null) {
									if (penunjang2[p].detail[j].flaglab == 'Y' || penunjang2[p].detail[j].flaglab == 'K') {
										tampung7 = penunjang2[p].detail[j].hasilpenunjang
										tampung6 = tampung6 + penunjang2[p].detail[j].detailpemeriksaan + ":" + penunjang2[p].detail[j].hasilpenunjang + " / "
									} else {

                                    }
								} else {
									// tampung = ''
								}
							}
							// penunjanglab = penunjanglab + tampung6
                            // tampung6 = ''
						} 
                    }
                    penunjanglab = penunjanglab + tampung6
                    penunjanglab = 'Laboratorium Patalogi Klinik : ' + penunjanglab
                    penunjangall=penunjanglab + " \n" + penunjangpa + " \n" + penunjangrad
					
				    var data = {
					"gambarLogo": "logodokkes.jpg",
					"paramKey": ["norec_apd", "obat","labproduk","radiologiproduk","diagnosis","ttd","z","obatpulang","tindakanmedisicd9","penunjanglab","penunjangpa","penunjangrad","edukasi"],
					"paramValue": [$scope.norecAPD, obat, labproduk, radiologiproduk,diagnosis,y,z,obatpulang,tindakanmedisicd9,penunjangall,penunjangpa,penunjangrad,$scope.item.edukasi],
					"paramType": ["", "", "", "", "", "", "","","", "","","",""] 
				};
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
                        console.log(this.response, typeof this.response);
                        var res = this.response
                        var file = new Blob( [res], {type: 'application/pdf'});
                        var url = window.URL.createObjectURL(this.response)
                        var jenis = 'resumemedis';
                        getBase64(file,jenis)
						console.log(this.response, typeof this.response);
						var url = window.URL.createObjectURL(this.response)
						var pdf = document.getElementById('tempatLaporan');
						pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
						// var win = window.open(url, '_blank');
						// win.focus();
					}
				}
                        if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                            xhr.open('POST', 'http://192.168.1.7:8797/generic/report/ResumeMedisRanap.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:8797/generic/report/ResumeMedisRanap.pdf');
                        } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                            xhr.open('POST', 'http://10.10.20.167:8797/generic/report/ResumeMedisRanap.pdf');
                        } else if (window.location.hostname.indexOf('10.5.1.2') > -1) {
                            xhr.open('POST', 'http://10.5.1.2:8797/generic/report/ResumeMedisRanap.pdf');
                        } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                            xhr.open('POST', 'http://202.51.105.98:8797/generic/report/ResumeMedisRanap.pdf');
                        } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                            xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/ResumeMedisRanap.pdf');
                        } else {
                            xhr.open('POST', '/jasper1/generic/report/ResumeMedisRanap.pdf');
                        }

                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                    $scope.isRouteLoading = false;
                })  
                });
            }

            $scope.kembalipapj = function () {
                window.history.back();
            }
            
        }
    ]);
});