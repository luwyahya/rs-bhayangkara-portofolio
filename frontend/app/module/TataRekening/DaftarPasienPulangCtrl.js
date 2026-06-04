define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPasienPulangCtrl', ['CacheHelper', '$mdDialog', '$state', 'ModelItem', '$scope', 'MedifirstService',
        function (cacheHelper, $mdDialog, $state, ModelItem, $scope, medifirstService) {
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.showBtnBayar = false
            $scope.dataPasienSelected = undefined;
            $scope.norecSpLast = ''
            $scope.isSelesaiPeriksa = false
            var dataLogin = {};
            $scope.item.jmlRows = 100

            
			let tampungData = {}
			let pdf = []
			let namaFile = '';
			let typeFIle = '';
            $scope.itemD = {}

            var datauserkelompok = ''
            var datauserruangan = []

            LoadCombo();
            showButton();
            $scope.selectedData2 = [];

            $scope.noRegDipilih = null;

            
            //ash 2023-12-19
            var datapapj=[]
            LoadDataForPapj();


            $scope.istempatLaporan = true;

            function showButton() {
                $scope.showBtnDetail = true;
                $scope.showBtnCetak = false;
                $scope.showBtnVerifikasi = true;
                $scope.showBtnUbahJenis = true;
                $scope.showBtnUnVerifikasi = true;
                $scope.showBtnBatalPulang = true;
                $scope.showBtnPreview = true;
                $scope.showBtnRekap = true
                $scope.showBtnDetailRegistrasi = true
                $scope.showBtnPilihDokter = true

            }
            medifirstService.get("tatarekening/get-ruangan-bed", false).then(function (dat) {
                for (let i = 0; i < dat.data.length; i++) {
                    debugger;
                    $scope.listRuangann = dat.data.ruanganbed[i].namaruangan;
                }
                // $scope.listKelas = dat.data.kelas
            });

            $scope.$watch('item.kamar', function (e) {
                debugger;
                if (e === undefined) return;
                var kamarId = $scope.item.kamar.id;
                medifirstService.get("rawatinap/get-nobedbykamar?idKamar=" + kamarId)
                    .then(function (a) {
                        $scope.listNoBed = _.filter(a.data.bed, function (v) {
                            if ($scope.item.rawatGabung == true) {
                                return v.statusbed === "ISI";
                            } else {
                                return v.statusbed === "KOSONG";
                            }
                        })
                    })
            });

            LoadCache();
            

            
            //ash 2023-12-19 KIRIM PAPJ
            $scope.pegawaiLogin = JSON.parse(localStorage.getItem('pegawai'))

            $scope.KirimPapj = function(dataItem) {
                datapapj=dataItem

                var ruangpegawai = $scope.pegawaiLogin.ruangan.id
                var ruangpasien = datapapj.ruid
                
                if(datapapj.nosep == undefined || datapapj.nosep == null || datapapj.nosep == '') {
                    alert('NO SEP untuk data tersebut masih kosong. Silakan lengkapi NO SEP!')
                    return
                }
                medifirstService.get("bridging/bpjs2/cek-sep?nosep=" + datapapj.nosep).then(function (response) {
                    if (!response.data || response.data.metaData.code !== "200") {
                        toastr.warning("Nosep Tidak Ditemukan di Vclaim, SILAHKAN TERBITKAN ULANG SEP!");
                        return
                    }
                })
                if (datapapj.deptid == 16) {
                    if (datapapj.jenisAsuransi == "BPJS") {
                        if(datapapj.nobpjs == undefined || datapapj.nobpjs == null || datapapj.nobpjs == '') {
                            alert('Nomer BPJS belum ada. Silakan diisi dahulu!')
                            return
                        }
                    }
                    if (datapapj.ruid != 941 && datapapj.dpjp != "dr. GIYATI RETNOWATI, Sp.A.,M.Psi.T" && datapapj.dpjp != "dr. ACHMAD HEADRIAWAN TURNIADI, Sp.A") {
                        if(datapapj.spri == undefined || datapapj.spri == null || datapapj.spri == '') {
                            alert('SPRI belum "Simpan Finish". Silakan disimpan Finish dahulu!')
                            return
                        }
                        if (!datapapj.tglemr) {
                            if (datapapj.ruid != 924 && datapapj.ruid != 65 && datapapj.ruid != 77) {
                                alert('Pengkajian Awal Medis RI belum diisi. Silakan diisi dahulu!');
                                return;
                            }
                        }
                    }
                    // if (datapapj.dpjp == "dr. GIYATI RETNOWATI, Sp.A.,M.Psi.T" || datapapj.dpjp == "dr. ACHMAD HEADRIAWAN TURNIADI, Sp.A") {
                    //     if(datapapj.tglemranak == undefined || datapapj.tglemranak == null || datapapj.tglemranak == '') {
                    //         alert('Pengkajian Awal Medis RI ANAK belum diisi. Silakan diisi dahulu!')
                    //         return
                    //     }
                    // }
                    if (datapapj.ruasal == 569 && datapapj.ruid != 923 && datapapj.ruid != 924) {
                        if(datapapj.tglemrtriage == undefined || datapapj.tglemrtriage == null || datapapj.tglemrtriage == '') {
                            alert('Triage IGD belum diisi. Silakan diisi dahulu!')
                            return
                        }

                        if(datapapj.tglemrmedisigd == undefined || datapapj.tglemrmedisigd == null || datapapj.tglemrmedisigd == '') {
                            alert('Pengkajian Awal Medis IGD belum diisi. Silakan diisi dahulu!')
                            return
                        }
                        if(datapapj.tglemrkeperawatanigd == undefined || datapapj.tglemrkeperawatanigd == null || datapapj.tglemrkeperawatanigd == '') {
                            alert('Pengkajian Awal Keperawatan IGD belum diisi. Silakan diisi dahulu!')
                            return
                        }
                    }
                    if(datapapj.tglemrresikobunuhdiri == undefined || datapapj.tglemrresikobunuhdiri == null || datapapj.tglemrresikobunuhdiri == '') {
                        alert('Skrining Resiko Bunuh Diri belum diisi. Silakan diisi dahulu!')
                        return
                    }
                    if(datapapj.tglemrpemulanganpasien == undefined || datapapj.tglemrpemulanganpasien == null || datapapj.tglemrpemulanganpasien == '') {
                        alert('Perencanaan Pemulangan Pasien belum diisi. Silakan diisi dahulu!')
                        return
                    }
                }

                if (datapapj.ruid != 941) {
                    if(datapapj.tglresume == undefined || datapapj.tglresume == null || datapapj.tglresume == '') {
                        alert('Resume Medis belum diisi. Silakan diisi dahulu!')
                        return
                    }

                    if(datapapj.dpjp != datapapj.dokterresume) {
                        alert('Dokter tidak sesuai dengan Dokter yang mengisi resume. Silahkan ubah terlebih dahulu agar sesuai!')
                        return
                    }
                }

                if (datapapj.ruid == 569) {
                    if(datapapj.tglemrtriage == undefined || datapapj.tglemrtriage == null || datapapj.tglemrtriage == '') {
                        alert('Triage IGD belum diisi. Silakan diisi dahulu!')
                        return
                    }

                    if(datapapj.tglemrmedisigd == undefined || datapapj.tglemrmedisigd == null || datapapj.tglemrmedisigd == '') {
                        alert('Pengkajian Awal Medis IGD belum diisi. Silakan diisi dahulu!')
                        return
                    }
                }

                if(datapapj.statuspulang == "Rawat") {
                    alert('Pasien Rencana Rawat Inap Tidak Perlu Kirim Berkas')
                    return
                }

                if (datapapj.tanggalPulang) {
                    let tglPulang = new Date(datapapj.tanggalPulang)
                    let now = new Date()

                    let batasMulai = new Date('2025-11-01T00:00:00')

                    // kalo tanggal pulang sebelum 1 November 2025, lewati
                    if (tglPulang < batasMulai) {
                    } else {
                        let selisih = now - tglPulang
                        let selisihJam = selisih / (1000 * 60 * 60)

                        if (selisihJam >= 72) {
                            alert("Berkas sudah kadaluarsa dan tidak bisa dikirim.")

                            var json = {
                                'norec_pd': datapapj.norec,
                                'pegawai_kadaluarsa': $scope.pegawaiLogin.id,
                                'status': '10',
                                'iskadaluarsa': true
                            }

                            medifirstService.post('tatarekening/save-papj-kadaluarsa', json)
                                .then(function (e) {
                                    LoadData()
                                })
                                .catch(function (err) {
                                    console.error("Gagal simpan kadaluarsa:", err)
                                })

                            return
                        }
                    }
                }

                // if(datauserkelompok != 'admin' || datauserkelompok != 'suster') { //if admin
                //     if(ruangpegawai != ruangpasien) {
                //         alert('Ruangan Pasien yang Anda pilih tidak sesuai!')
                //         return
                //     }
                // }

                $scope.item.ruanganrjpapj=""
                $scope.item.ruanganripapj=""
                LoadDataForPapj();
                $scope.popupKirimPapj.center().open()
            }
            $scope.ClosePapj = function() {
                $scope.item.ruanganrjpapj=""
                $scope.item.ruanganripapj=""
                
                $scope.popupKirimPapj.close()
            }

            $scope.SavePapj  = function(dataItem) {
                var ruangan=''
                var type=''
                if(datauserkelompok != 'admin') {
                    if( $scope.isRawatInap== true) {
                        if($scope.item.ruanganripapj == undefined || $scope.item.ruanganripapj == null || $scope.item.ruanganripapj == '') {
                            alert('Silakan pilih ruangan terlebih dahulu!')
                            return
                        }
                        type=1 //if rawat inap
                        ruangan=$scope.item.ruanganripapj.id
                    } else if( $scope.isRawatJalan== true) {
                        if($scope.item.ruanganrjpapj == undefined || $scope.item.ruanganrjpapj == null || $scope.item.ruanganrjpapj == '' ) {
                            alert('Silakan pilih ruangan terlebih dahulu!')
                            return
                        }
                        type=2 //if rawat jalan
                        ruangan=$scope.item.ruanganrjpapj.id
                    } else if( $scope.isIGD== true) {
                        if($scope.item.ruanganrjpapj == undefined || $scope.item.ruanganrjpapj == null || $scope.item.ruanganrjpapj == '' ) {
                            alert('Silakan pilih ruangan terlebih dahulu!')
                            return
                        }
                        type=3 //if igd
                        ruangan=$scope.item.ruanganrjpapj.id
                    } else if( $scope.isRehab== true) {
                        if($scope.item.ruanganrjpapj == undefined || $scope.item.ruanganrjpapj == null || $scope.item.ruanganrjpapj == '' ) {
                            alert('Silakan pilih ruangan terlebih dahulu!')
                            return
                        }
                        type=4 //if rehab
                        ruangan=$scope.item.ruanganrjpapj.id
                    }
                } else {
                    if( $scope.isRawatInap== true) {
                        if($scope.item.ruanganripapj != '') {
                            type=1 //if rawat inap
                            ruangan=$scope.item.ruanganripapj.id
                        }
                        
                        if($scope.item.ruanganrjpapj != '') {
                            type=2 //if rawat inap
                            ruangan=$scope.item.ruanganrjpapj.id
                        }
                    }

                    
                    if($scope.item.ruanganrjpapj == undefined || $scope.item.ruanganrjpapj == null || $scope.item.ruanganrjpapj == '' ) {
                        alert('Silakan pilih ruangan terlebih dahulu!')
                        return
                    }

                }

                var json = {
                'norec_pd': datapapj.norec,
                'pegawaifk_kirim': $scope.pegawaiLogin.id,
                'ruangan': ruangan,
                'type': type,
                'status' : '1' //dalam table nilai nya kirim = 1
                }

                //send papj
                medifirstService.post('tatarekening/save-papj-kirim', json).then(function (e) {
                //ok
                 $scope.saveLogging("Kirim Berkas", "No registrasi pasien", datapapj.noRegistrasi, "pasien noreg " + datapapj.noRegistrasi + " Oleh " + $scope.pegawaiLogin.id);
                })

                LoadData()
                $scope.popupKirimPapj.close()
            }
            
            $scope.LihatCatatan = function(dataItem) {
                
                var ruangpegawai = $scope.pegawaiLogin.ruangan.id
                var ruangpasien = dataItem.ruid
                
                
                // if(datauserkelompok != 'admin' || datauserkelompok != 'suster') {
                //     if(ruangpegawai != ruangpasien) {
                //         alert('Ruangan Pasien yang Anda pilih tidak sesuai!')
                //         return
                //     }
                // }

                $scope.item.catatan=dataItem.keterangan
                $scope.popupCatatanPapj.center().open()
            }

            $scope.CloseCatatan = function(dataItem) {
                $scope.popupCatatanPapj.close()
            }

            $scope.ProsesGagal = function(dataItem) {
                alert('Anda tidak dapat melanjutkan proses.')
                return
            }

            
            $scope.KirimUlangPapj  = function(dataItem) {

                datapapj=dataItem

                var ruangpegawai = $scope.pegawaiLogin.ruangan.id
                var ruangpasien = datapapj.ruid
                
                if(datapapj.nosep == undefined || datapapj.nosep == null || datapapj.nosep == '') {
                    alert('NO SEP untuk data tersebut masih kosong. Silakan lengkapi NO SEP!')
                    return
                }
                if(datapapj.tglresume == undefined || datapapj.tglresume == null || datapapj.tglresume == '') {
                    alert('Resume Medis belum diisi. Silakan diisi dahulu!')
                    return
                }
                if (datapapj.deptid == 16) {
                    if (datapapj.jenisAsuransi == "BPJS") {
                        if(datapapj.nobpjs == undefined || datapapj.nobpjs == null || datapapj.nobpjs == '') {
                            alert('Nomer BPJS belum ada. Silakan diisi dahulu!')
                            return
                        }
                    }
                    if(datapapj.spri == undefined || datapapj.spri == null || datapapj.spri == '') {
                        alert('SPRI belum diisi. Silakan diisi dahulu!')
                        return
                    }
                }
                if(datapapj.jenisAsuransi == 'Umum/Pribadi') {
                    alert('Pasien Umum/Pribadi tidak dapat mengirim ulang berkas.')
                    return
                }

                // if(datauserkelompok != 'admin' || datauserkelompok != 'suster') {
                //     if(ruangpegawai != ruangpasien) {
                //         alert('Ruangan Pasien yang Anda pilih tidak sesuai!')
                //         return
                //     }
                // }
 
                var json = {
                'norec_pd': datapapj.norec,
                'pegawaifk_kirim': $scope.pegawaiLogin.id,
                'statusbag': datapapj.statusbag,
                'status' : '1' //dalam table nilai nya kirim = 1
                }

                //send papj
                medifirstService.post('tatarekening/save-papj-kirim-ulang', json).then(function (e) {
                    medifirstService.post('microservice/delete-notif?noregistrasi=' + datapapj.noRegistrasi + '&flag=kirimulangberkas').then(function (e) {
                        if (e.data.status == 201) {
                            toastr.info('Notif Terhapus!')
                        } else {
                            toastr.info('Notif Gagal Terhapus!')
                        }
                    })
                })
                
                LoadData()  
                $scope.popupKirimPapj.close()
            }
            function LoadDataForPapj() {
                //ash 2023-11-30 untuk menentukan apa dia PPA atau bukan
                datauserkelompok = medifirstService.getKelompokUser();
                datauserruangan = medifirstService.getMapLoginUserToRuangan();
                
                // if(datauserruangan[0].objectdepartemenfk == 16) { //if rawatinap
                //     $scope.isRawatInap = true;
                //     $scope.isRawatJalan = false;
                //     $scope.isRehab = false;
                //     $scope.isIGD = false;
                // } else if(datauserruangan[0].objectdepartemenfk == 18) {
                //     $scope.isRawatInap = false;
                //     $scope.isRawatJalan = true;
                //     $scope.isRehab = false;
                //     $scope.isIGD = false;
                // } else if(datauserruangan[0].objectdepartemenfk == 28) {
                //     $scope.isRawatInap = false;
                //     $scope.isRawatJalan = false;
                //     $scope.isRehab = true;
                //     $scope.isIGD = false;
                // } else {
                //     $scope.isRawatInap = false;
                //     $scope.isRawatJalan = false;
                //     $scope.isRehab = false;
                //     $scope.isIGD = true;
                // }

                
                // if(datauserkelompok == 'admin') {
                //     $scope.isRawatInap = true;
                //     $scope.isRawatJalan = true;
                //     $scope.isRawatIGD = true;
                // }

               // reset dulu semua flag
                $scope.isRawatInap = false;
                $scope.isRawatJalan = false;
                $scope.isRehab = false;
                $scope.isIGD = false;

                // cek berdasarkan seluruh datauserruangan
                if (datauserruangan.some(r => r.objectdepartemenfk == 16)) {
                    $scope.isRawatInap = true;
                }
                if (datauserruangan.some(r => r.objectdepartemenfk == 18)) {
                    $scope.isRawatJalan = true;
                }
                if (datauserruangan.some(r => r.objectdepartemenfk == 28)) {
                    $scope.isRehab = true;
                }

                // kalau tidak ada yg cocok -> default IGD
                if (!$scope.isRawatInap && !$scope.isRawatJalan && !$scope.isRehab) {
                    $scope.isIGD = true;
                }

                // kalau admin -> buka semua
                if (datauserkelompok == 'admin') {
                    $scope.isRawatInap = true;
                    $scope.isRawatJalan = true;
                    $scope.isIGD = true;
                }


                if (datauserkelompok == 'suster' || datauserkelompok == 'admin' || datauserkelompok == 'operator' || datauserkelompok == 'dokter') {
                $scope.columnPasienPulang = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarPasienPulang.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    var dataList = e.data;
                    var dataIndex = 0;

                    // ----- FUNCTION PEMBERSIH DATA UNTUK EXCEL -----
                    function removeIllegalXMLCharacters(input) {
                        if (typeof input !== 'string') return input;
                        // Regex untuk menghapus control characters yang bikin error XML
                        return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
                    }
                    // -------------------------------------

                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:L1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Pasien Pulang",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });

                    sheet.rows.forEach(function (row) {
                        if (row.type === "data") {
                            var dataItem = dataList[dataIndex];
                            dataIndex++;

                            if (!dataItem) return;

                            row.cells.forEach(function (cell, cellIndex) {
                                
                                if (cell && cell.value && typeof cell.value === 'string') {
                                    cell.value = removeIllegalXMLCharacters(cell.value);
                                }

                                if (e.sender.columns[cellIndex].field === "statuspapj") {
                                    
                                    if (
                                        dataItem.iskadaluarsa === true &&
                                        (cell.value === 1 || cell.value === 2 || cell.value === 3) // cell.value numeric aman
                                    ) {
                                        cell.value = "BERKAS KADALUARSA";
                                        return;
                                    }

                                    switch (cell.value) {
                                        case 1:
                                        case 2:
                                        case 3:
                                            cell.value = "BERKAS SUDAH DIKIRIM KE PAPJ";
                                            break;
                                        case 4:
                                            cell.value = "BERKAS BELUM SESUAI, KIRIM ULANG";
                                            break;
                                        case 7:
                                            cell.value = "BERKAS TIDAK LAYAK";
                                            break;
                                        case 8:
                                            cell.value = "BERKAS DIRAJALKAN";
                                            break;
                                        case 9:
                                            cell.value = "BERKAS PENDING";
                                            break;
                                        case 10:
                                            cell.value = "BERKAS KADALUARSA";
                                            break;
                                        case 11:
                                            cell.value = "PASIEN DI KONSUL";
                                            break;
                                        default:
                                            cell.value = "KIRIM BERKAS KE PAPJ";
                                            break;
                                    }
                                }
                            });
                        }
                    });
                },

                dataBound: onDataBound,
                selectable: 'row',
                pageable: true,
                columns:
                    [{
                        "field": "tanggalMasuk",
                        "title": "Tanggal Masuk",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggalJam('#: tanggalMasuk #')}}</span>"
                    },
                    // {
                    //     "field": "statuspapj",
                    //     "title": "Status Berkas",
                    //     "width": "150px",
                    //    "template": "<button class=\"k-button #: statuspapj == '1' ? 'white3' : statuspapj == '2' ? 'white3' : statuspapj == '3' ? 'white3' : statuspapj == '4' ? 'white2' : statuspapj == '7' ? 'white4' : statuspapj == '8' ? 'white5' : statuspapj == '9' ? 'white2' : statuspapj == '10' ? 'white6' : statuspapj == '11' ? 'white7' : 'white1' #\" \
                    //     ng-click=\" #: statuspapj == '1' ? '' : statuspapj == '2' ? '' : statuspapj == '3' ? '' : statuspapj == '7' ? '' : statuspapj == '4' ? 'KirimUlangPapj(dataItem)' : statuspapj == '8' ? '' : statuspapj == '9' ? '' : statuspapj == '10' ? '' : statuspapj == '11' ? '' : 'KirimPapj(dataItem)' #\" \
                    //     style=\"margin:0 0 5px\">\
                    //     #: statuspapj == '1' ? 'BERKAS SUDAH DIKIRIM KE PAPJ' : statuspapj == '2' ? 'BERKAS SUDAH DIKIRIM KE PAPJ' : statuspapj == '3' ? 'BERKAS SUDAH DIKIRIM KE PAPJ' : statuspapj == '4' ? 'BERKAS BELUM SESUAI, KIRIM ULANG' : statuspapj == '7' ? 'BERKAS TIDAK LAYAK' : statuspapj == '8' ? 'BERKAS DIRAJALKAN' : statuspapj == '9' ? 'BERKAS PENDING' : statuspapj == '10' ? 'BERKAS KADALUARSA' : statuspapj == '11' ? 'PASIEN DI KONSUL' : 'KIRIM BERKAS KE PAPJ' #\
                    //     </button>"

                    // },
                    {
                        "field": "statuspapj",
                        "title": "Status Berkas",
                        "width": "150px",
                        "template": `
                            <button
                                class="k-button #:
                                    statuspulang == 'Rawat' ? 'white8' :
                                    (iskadaluarsa === true && (statuspapj == '1' || statuspapj == '2' || statuspapj == '3')) ? 'white6' :
                                    statuspapj == '1' ? 'white3' :
                                    statuspapj == '2' ? 'white3' :
                                    statuspapj == '3' ? 'white3' :
                                    statuspapj == '4' ? 'white2' :
                                    statuspapj == '7' ? 'white4' :
                                    statuspapj == '8' ? 'white5' :
                                    statuspapj == '9' ? 'white2' :
                                    statuspapj == '10' ? 'white6' :
                                    statuspapj == '11' ? 'white7' :
                                    'white1'
                                #"
                                ng-click=" #:
                                    (iskadaluarsa === true && statuspapj != null) ? '' :
                                    statuspulang == 'Rawat' ? 'KirimPapj(dataItem)' :
                                    statuspapj == '1' ? '' :
                                    statuspapj == '2' ? '' :
                                    statuspapj == '3' ? '' :
                                    statuspapj == '7' ? '' :
                                    statuspapj == '4' ? 'KirimUlangPapj(dataItem)' :
                                    statuspapj == '8' ? '' :
                                    statuspapj == '9' ? '' :
                                    statuspapj == '10' ? '' :
                                    statuspapj == '11' ? '' :
                                    'KirimPapj(dataItem)'
                                #"
                                style="margin:0 0 5px"
                            >
                                #:
                                    statuspulang == 'Rawat' ? 'RENCANA RAWAT' :
                                    (iskadaluarsa === true && (statuspapj == '1' || statuspapj == '2' || statuspapj == '3')) ? 'BERKAS KADALUARSA' :
                                    statuspapj == '1' ? 'BERKAS SUDAH DIKIRIM KE PAPJ' :
                                    statuspapj == '2' ? 'BERKAS SUDAH DIKIRIM KE PAPJ' :
                                    statuspapj == '3' ? 'BERKAS SUDAH DIKIRIM KE PAPJ' :
                                    statuspapj == '4' ? 'BERKAS BELUM SESUAI, KIRIM ULANG' :
                                    statuspapj == '7' ? 'BERKAS TIDAK LAYAK' :
                                    statuspapj == '8' ? 'BERKAS DIRAJALKAN' :
                                    statuspapj == '9' ? 'BERKAS PENDING' :
                                    statuspapj == '10' ? 'BERKAS KADALUARSA' :
                                    statuspapj == '11' ? 'PASIEN DI KONSUL' :
                                    'KIRIM BERKAS KE PAPJ'
                                #
                            </button>
                        `
                    },
                    {
                        "field": "keterangan",
                        "title": "Catatan Perbaikan",
                        "width": "150px",
                        "template": "<button class=\"k-button white1\" ng-click=\"LihatCatatan(dataItem)\" style=\"margin:0 0 5px\">LIHAT CATATAN</button>",
                    },
            

                    {
                        "field": "noCm",
                        "title": "No.RM",
                        "width": "50px",
                        "template": "<span class='style-center'>#: noCm #</span>"
                    },
                    {
                        "field": "noRegistrasi",
                        "title": "No. Registrasi",
                        "width": "60px",
                        "template": "<span class='style-center'>#: noRegistrasi #</span>"
                    },
                    {
                        "field": "Dokumen",
                        "title": "Upload Dokumen",
                        "width": "5.5%",
                        "template": "<button class=\"k-button pink\" ng-click=\"uploadDokumen(dataItem)\" style=\"margin:0 0 5px\">Dokumen</button>",
                    },
                    {
                        "field": "namaPasien",
                        "title": "Nama",
                        "width": "120px"
                    },
                    {
                        "field": "jenisAsuransi",
                        "title": "Jenis Pasien",
                        "width": "100px",
                        "template": "<span class='style-center'>#: jenisAsuransi #</span>"
                    },
                    {
                        "field": "namarekanan",
                        "title": "Nama Rekanan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: namarekanan #</span>"
                    },
                    {
                        "field": "nosep",
                        "title": "No SEP",
                        "width": "100px",
                        "template": "<span class='style-center'>#: nosep #</span>"
                    },
                    {
                        "field": "namaRuangan",
                        "title": "Ruangan",
                        "width": "120px"
                    },
                    {
                        "field": "dpjp",
                        "title": "Dokter",
                        "width": "120px"
                    },
                    {
                        "field": "tanggalPulang",
                        "title": "Tanggal Pulang",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggalJam('#: tanggalPulang #')}}</span>",

                        // "template": "<button class=\"k-button custom-button #=flaglab != 'N' ? 'dark-red' : 'dark-green' # \" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",

                        // template: "<button class=\"k-button custom-button\" ng-click=\"KlikCuyy(dataItem)\" style=\"margin:0 0 5px\">#: isjanjidisiapkan #</button>",
                        attributes: {
                            class: "#=tglresume != null ? 'blue' : 'yellow' #"
                            // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                        },
                    },
                    {
                        "field": "status",
                        "title": "Status",
                        "width": "70px",
                        "template": "<span class='style-center'>#: status #</span>"
                    },
                    {
                        "field": "statuspulang",
                        "title": "Status Pulang",
                        "width": "120px",
                        "template": "<span class='style-center'>#: statuspulang #</span>",

                    },
                    {
                        "field": "tglclosing",
                        "title": "Tanggal Closing",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggalJam('#: tglclosing #')}}</span>"
                    },
                    {
                        "field": "statuskelas",
                        "title": "Status Kelas",
                        "width": "70px",
                        "template": "<span class='style-center'>#: statuskelas #</span>",

                    },
                    {
                        "field": "nobpjs",
                        "title": "No BPJS",
                        "width": "100px",
                        "template": "<span class='style-center'>#: nobpjs #</span>"
                    },
                    {
                        "field": "claim",
                        "title": "Status Klaim",
                        "width": "150px",
                        "template": "<span class='style-center'>#: statusclaim #</span>",

                    },
                    {
                        "field": "totalBiaya",
                        "title": "Biaya Tarif RS",
                        "width": "150px",
                        "template": "<span class='style-right' style='font-weight:bold'>{{formatRupiah('#: totalBiaya #', 'Rp. ')}}</span>",

                    },
                    {
                        "field": "byPengajuan",
                        "title": "Biaya Pengajuan",
                        "width": "150px",
                        "template": "<span class='style-center'>#: byPengajuan #</span>",

                    },
                    {
                        "field": "bySetujui",
                        "title": "Biaya Disetujui",
                        "width": "150px",
                        "template": "<span class='style-center'>#: bySetujui #</span>",

                    },
                    {
                        "field": "kelasditanggung",
                        "title": "Kelas Ditanggung",
                        "width": "150px",
                        "template": "<span class='style-center'>#: kelasditanggung #</span>",

                    },
                    {
                        "field": "prolanisprb",
                        "title": "Prolanis PRB",
                        "width": "150px",
                        "template": "<span class='style-center'>#: prolanisprb #</span>",

                    },
                        // {
                        //   "field": "namauser",
                        //   "title": "Yang Memulangkan",
                        //   "width": "100px",
                        // },
                        // {
                        //   "field": "noverif",
                        //   "title": "Verif Piutang",
                        //   "width":"70px",
                        //   "template": "<span class='style-center'>#: noverif #</span>"
                        // }
                    ]
                };

            } else {
                $scope.columnPasienPulang = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarPasienPulang.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:L1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Pasien Pulang",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                dataBound: onDataBound,
                selectable: 'row',
                pageable: true,
                columns:
                    // {
                    //   "template": "<input type='checkbox' class='checkbox' ng-click='onClickSatu($event)' />",
                    //   "width": 40
                    // },
                    // {
                    //     "field": "status2",
                    //     "title": "Verifikasi",
                    //     "width": "90px",

                    //     "template": "<button class=\"k-button custom-button\" ng-click=\"closingTagihangrid(dataItem)\"  style=\"margin:0 0 5px\" >#:  status2 #</button> ",
                    // },
                    [{
                        "field": "tanggalMasuk",
                        "title": "Tanggal Masuk",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggalJam('#: tanggalMasuk #')}}</span>"
                    },
                    {
                        "field": "noCm",
                        "title": "No.RM",
                        "width": "50px",
                        "template": "<span class='style-center'>#: noCm #</span>"
                    },
                    {
                        "field": "noRegistrasi",
                        "title": "No. Registrasi",
                        "width": "60px",
                        "template": "<span class='style-center'>#: noRegistrasi #</span>"
                    },
                    {
                        "field": "namaPasien",
                        "title": "Nama",
                        "width": "120px"
                    },
                    {
                        "field": "jenisAsuransi",
                        "title": "Jenis Pasien",
                        "width": "100px",
                        "template": "<span class='style-center'>#: jenisAsuransi #</span>"
                    },
                    {
                        "field": "namarekanan",
                        "title": "Nama Rekanan",
                        "width": "100px",
                        "template": "<span class='style-center'>#: namarekanan #</span>"
                    },
                    {
                        "field": "nosep",
                        "title": "No SEP",
                        "width": "100px",
                        "template": "<span class='style-center'>#: nosep #</span>"
                    },
                    {
                        "field": "namaRuangan",
                        "title": "Ruangan",
                        "width": "120px"
                    },
                    {
                        "field": "dpjp",
                        "title": "Dokter",
                        "width": "120px"
                    },
                    {
                        "field": "tanggalPulang",
                        "title": "Tanggal Pulang",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggalJam('#: tanggalPulang #')}}</span>",

                        // "template": "<button class=\"k-button custom-button #=flaglab != 'N' ? 'dark-red' : 'dark-green' # \" ng-click=\"CetakLabKlinikLangsung(dataItem)\" style=\"margin:0 0 5px\">#: namaproduk #</button>",

                        // template: "<button class=\"k-button custom-button\" ng-click=\"KlikCuyy(dataItem)\" style=\"margin:0 0 5px\">#: isjanjidisiapkan #</button>",
                        attributes: {
                            class: "#=tglresume != null ? 'blue' : 'yellow' #"
                            // class: "#=statusperiksa != '✔' ? 'red' : 'hejo' #"
                        },
                    },
                    {
                        "field": "status",
                        "title": "Status",
                        "width": "70px",
                        "template": "<span class='style-center'>#: status #</span>"
                    },
                    {
                        "field": "statuspulang",
                        "title": "Status Pulang",
                        "width": "120px",
                        "template": "<span class='style-center'>#: statuspulang #</span>",

                    },
                    {
                        "field": "tglclosing",
                        "title": "Tanggal Closing",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggalJam('#: tglclosing #')}}</span>"
                    },
                    {
                        "field": "statuskelas",
                        "title": "Status Kelas",
                        "width": "70px",
                        "template": "<span class='style-center'>#: statuskelas #</span>",

                    },
                    {
                        "field": "nobpjs",
                        "title": "No BPJS",
                        "width": "100px",
                        "template": "<span class='style-center'>#: nobpjs #</span>"
                    },
                    {
                        "field": "statusclaim",
                        "title": "Status Klaim",
                        "width": "150px",
                        "template": "<span class='style-center'>#: statusclaim #</span>",

                    },
                    {
                        "field": "totalBiaya",
                        "title": "Biaya Tarif RS",
                        "width": "150px",
                        "template": "<span class='style-center'>#: totalBiaya #</span>",

                    },
                    {
                        "field": "byPengajuan",
                        "title": "Biaya Pengajuan",
                        "width": "150px",
                        "template": "<span class='style-center'>#: byPengajuan #</span>",

                    },
                    {
                        "field": "bySetujui",
                        "title": "Biaya Disetujui",
                        "width": "150px",
                        "template": "<span class='style-center'>#: bySetujui #</span>",

                    },
                    {
                        "field": "kelasditanggung",
                        "title": "Kelas Ditanggung",
                        "width": "150px",
                        "template": "<span class='style-center'>#: kelasditanggung #</span>",
                    },
                    {
                        "field": "prolanisprb",
                        "title": "Prolanis PRB",
                        "width": "150px",
                        "template": "<span class='style-center'>#: prolanisprb #</span>",
                    },
                        // {
                        //   "field": "namauser",
                        //   "title": "Yang Memulangkan",
                        //   "width": "100px",
                        // },
                        // {
                        //   "field": "noverif",
                        //   "title": "Verif Piutang",
                        //   "width":"70px",
                        //   "template": "<span class='style-center'>#: noverif #</span>"
                        // }
                    ]
                };
            }

                
                //console.log('papj')
            }


            $scope.uploadDokumen = function (dataItem) {
                medifirstService.get('registrasi/get-data-combo').then(function(dat) {
                  $scope.listJenisDokumen = dat.data.jenisdokumen
              })
              LoadDataDokumen(dataItem)
        $scope.popUpUploadDokumen.center().open()
        }
        function LoadDataDokumen(dataItem) {
          tampungData = dataItem
          medifirstService.get('registrasi/get-dokumen-penunjang?noRegistrasi=' + dataItem.noregistrasi + '&isInaCbg=true').then(function(dat) {
              for (let i = 0; i < dat.data.length; i ++) {
                  dat.data[i].no = i + 1;
              }
              $scope.sourceDokumen = new kendo.data.DataSource({
                  data: dat.data,
                  length: dat.data.length,
                  pageSize: 20
              });
          })
        }
                    $scope.gridDokumen = {
                        pageable: true,
                        scrollable: true,
                        columns: [
                            { field: "no", title: "No", width: 40 },
                            { field: "nocm", title: "No RM", width: 120 },
                            { field: "noregistrasi", title: "No Registrasi", width: 120 },
                            { field: "namapasien", title: "Nama Pasien", width: 150 },
                            { field: "namaruangan", title: "Ruangan", width: 120 },
                            { field: "namalengkap", title: "User Upload", width: 120 },
                            { field: "tglupload", title: "Tgl Upload", width: 150 },
                            { field: "jenisdokumen", title: "Jenis Dokumen", width: 150 },
                            { "title": "Hasil","width": "100px","template": "<button class=\"k-button custom-button\" ng-click=\"lihatHasil(dataItem)\" style=\"margin:0 0 5px\">Lihat Hasil</button>", },
                            { "title": "Kirim PAPJ","width": "100px","template": "# if (ispapj == null) { #<button class=\"k-button custom-button green\" ng-click=\"kirimPapj(dataItem)\"  style=\"margin:0 0 5px\">#:  'Kirim ke PAPJ' #</button> #} else {#<button class=\"k-button custom-button red\" ng-click=\"batalPapj(dataItem)\"  style=\"margin:0 0 5px\">#:  'Batal ke PAPJ' #</button> #}#", },
                        ],
                    };
              var handleFileSelect = function (file) {
                  var files = document.getElementById('filePicker').files;
                  
                  for (var i = 0; i < files.length; i++) {
                      //cek filenya
                      
                    //   if (files[i].size > 1048576) {
                    // 	  alert('Ukuran foto tidak boleh lebih dari 1 MB !')
                    // 	  return
                    //   }
                  }
                  if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                    getBase64(files[i]);
                    }
                  }
              };
              
              if (window.File && window.FileReader && window.FileList && window.Blob) {
                  document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
              } else {
                  alert('The File APIs are not fully supported in this browser.');
              }
                function getBase64(file) {
                   var reader = new FileReader();
                   reader.readAsDataURL(file);
                   reader.onload = function () {
                  //    tes.push(reader)
                  if(pdf.length > 0) {
                      pdf.splice(pdf, 1)
                  }
                     console.log(reader.result);
                     pdf.push(reader.result);
                     namaFile = file.name
                     typeFIle = file.type
                   };
                   reader.onerror = function (error) {
                     console.log('Error: ', error);
                   };
                }
                $scope.simpanDokumen = function () {
                    // debugger
                      let objSave = {
                          objectruanganfk: tampungData.ruid,
                          norec_pd: tampungData.norec,
                          dokumen: pdf[0],
                          nocmfk: tampungData.nocmfk,
                          namafile: namaFile,
                          namapemeriksaan: 'NULL',
                          keterangan: 'NULL',
                          jenisdokumenfk: $scope.item.jenisDokumen.id,
                          type: typeFIle,
                          jenis: $scope.item.jenisDokumen.jenisdokumen
                      }
                      console.log(objSave)
                      console.log(tampungData)
                      medifirstService.post('registrasi/save-dokumen-penunjang', objSave).then(function(e) {
                          pdf = [];
                          namaFile = '';
                          typeFIle = '';
                          delete $scope.item.jenisDokumen
                          LoadDataDokumen(tampungData)
                          saveFilePapj(objSave.dokumen, objSave.jenis, tampungData.noRegistrasi)
                      })
                  }
                  function saveFilePapj(file, jenis, noreg) {
                    // debugger
                      let objSave = {
                          'jenis': jenis,
                          'noregistrasi': noreg,
                          'file': file
                      }
                      medifirstService.postNonMessage('registrasi/post-file-papj', objSave).then(function (e) {
        
                      });
                  }
                $scope.lihatHasil = function (dataItem) {
                    // debugger
                  medifirstService.get('registrasi/ambil-dokumen?norec=' + dataItem.norec).then(function(dat) {
                      let dokumen = dat.data[0].dokumen;
                      let type = dat.data[0].type
                      const win = window.open("","_blank");
                      let html = '';
        
                      html += '<html>';
                      html += '<body style="margin:0!important">';
                      html += '<embed width="100%" height="100%" src="'+dokumen+'" type="'+type+'" />';
                      html += '</body>';
                      html += '</html>';
        
                      setTimeout(() => {
                      win.document.write(html);
                      }, 0);
                  })
                }
                $scope.kirimPapj = function(dataItem) {

                    if(dataItem.jenisAsuransi == 'Umum/Pribadi') {
                        alert('Pasien Umum/Pribadi tidak dapat mengirim berkas.')
                        return
                    }

                    let json = {
                        norec: dataItem.norec,
                        jenis: "kirimpapj"
                    }
                    medifirstService.post('registrasi/update-kirim-papj-dokumen', json).then(function(e) {
                        LoadDataDokumen(dataItem)
                    })
                }
                $scope.batalPapj = function(dataItem) {
                    let json = {
                        norec: dataItem.norec,
                        jenis: "batalpapj"
                    }
                    medifirstService.post('registrasi/update-kirim-papj-dokumen', json).then(function(e) {
                      LoadDataDokumen(dataItem)
                      $scope.popUpUploadDokumen.center().open()
                    })
                }

                $scope.HapusDokumen = function() {         
                    if ($scope.dataSelectedTambah == undefined) {
                        alert("Pilih Satu Data Yang Mau di Hapus !!!")
                        return;
                    };
          
                    var objSave = {
                        "norec": $scope.dataSelectedTambah.norec_doc,
                        "status": 0
                    }
                    
                    medifirstService.post('registrasi/hapus-dokumen-papj', objSave).then(function (e) {
                        if (e.data.status === 201) {
                          LoadDataDokumen($scope.dataSelectedTambah);
                        }
                    })
                  }

                
                //-----------------------------------------------------------------------------------




            $scope.Preview = function () {
                debugger;
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dahulu', 'Peringatan !');
                    return;
                }
                LoadDataClosingFaktur()
                medifirstService.get("tatarekening/get-rekap-billing?noReg=" + $scope.dataPasienSelected.noRegistrasi).then(function (data) {
                    debugger;
                    var datas = data.data
                    // $scope.isRouteLoading = true;
                    $scope.gridRekapBilling = new kendo.data.DataSource({
                        data: datas,
                        group: $scope.group,
                        pageSize: 20,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        },
                        aggregate: [
                            { field: 'total', aggregate: 'sum' }
                        ]
                    });
                    $scope.popUpRekapBilling.center().open();
                });

            }
            // $scope.group = {
            //   field: "kelompokprodukbpjs",
            //   aggregates: [
            //     {
            //       field: "kelompokprodukbpjs",
            //       aggregates: "count"
            //     }]
            // };
            // $scope.aggregate = [
            //   {
            //     field: "kelompokprodukbpjs",
            //     aggregate: "count"

            //   }]

            $scope.columnRekapBilling = {
                selectable: 'row',
                pageable: true,
                columns: [{
                    "field": "kelompokprodukbpjs",
                    "title": "Kelompok Produk",
                    "width": "60px",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"setBilling(dataItem)\"  style=\"margin:0 0 5px\">#:  kelompokprodukbpjs #</button> ",
                },
                {
                    "field": "namadokterppp",
                    "title": "Nama Dokter",
                    "width": "60px",
                    footerTemplate: " Total "
                },
                {
                    "field": "total",
                    "title": "Sub Total",
                    "width": "60px",
                    "template": "<span class='center'>{{formatRupiah2('#:total #', '')}}</span>",
                    aggregates: ["sum"],
                    footerTemplate: " {{formatRupiah2('#:data.total.sum #','')}} "
                },
                    // {
                    //   hidden: true,
                    //   field: "kelompokprodukbpjs",
                    //   title: "Kelompok Produk",
                    //   aggregates: ["count"],
                    //   groupHeaderTemplate: "Kelompok #= value # (Jumlah: #= count#)"
                    // }
                ]
            };

            //   $scope.Page = {
            //     refresh: true,
            //     pageSizes: true,
            //     buttonCount: 5
            // }
            $scope.setBilling = function (dataSelected) {
                debugger;
                var id_kpb = "id_kpb=" + dataSelected.id_kpb;
                var noreg = "&noreg=" + dataSelected.noregistrasi;
                var link = "tatarekening/get-billing?"
                // $scope.isRouteLoading = false;
                medifirstService.get(link + id_kpb + noreg).then(function (data) {
                    debugger;
                    $scope.popUpBilling.center().open();
                    // $scope.isRouteLoading = true;
                    // details = data.data.data;
                    $scope.gridBilling = {
                        data: data.data.data,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {

                                }
                            }
                        },
                        // aggregate: [ { field: 'total', aggregate: 'sum' }

                        // ],
                        refresh: true,
                        selectable: true,
                        refresh: true,
                        groupable: true,
                        allowCopy: true,
                    }
                })
            }
            $scope.columnBilling = {
                selectable: 'row',
                pageable: true,
                columns: [{
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "50px"
                },
                {
                    "field": "kelompokprodukbpjs",
                    "title": "Kelompok Produk",
                    "width": "50px"
                },
                {
                    "field": "namaproduk",
                    "title": "Deskripsi",
                    "width": "50px"
                },
                {
                    "field": "namadokterppp",
                    "title": "Dokter",
                    "width": "50px"
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "50px"
                },
                {
                    "field": "hargajual",
                    "title": "Tarif",
                    "width": "50px",
                    "template": "<span class='center'>{{formatRupiah2('#:hargajual #', '')}}</span>",
                },
                {
                    "field": "hargadiscount",
                    "title": "Diskon",
                    "width": "50px",
                    "template": "<span class='center'>{{formatRupiah2('#:hargadiscount #', '')}}</span>",
                },
                {
                    "field": "total",
                    "title": "Sub Total",
                    "width": "50px",
                    // "template": "<span class='center'>#:total #</span>",
                    "template": "<span class='center'>{{formatRupiah2('#:total #', '')}}</span>",
                    // aggregates: ["sum"],
                    // footerTemplate: " {{formatRupiah('#:data.total.sum #', '')}}"
                }
                ]
            };

            $scope.closeRekapBilling = function () {
                $scope.popUpRekapBilling.close();
            }
            $scope.closeBilling = function () {
                $scope.popUpBilling.close();
            }

            // $scope.CetakRekap = function () {
            // 	var struk = "";
            // 	var kwitansi = "";
            // 	var stt = 'false'
            // 	if (confirm('View Rekap Biaya? ')) {
            // 		// Save it!
            // 		stt = 'true';
            // 	} else {
            // 		// Do nothing!
            // 		stt = 'false'
            // 	}

            // 	var client = new HttpClient();
            // 	client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiayaPelayanan=1&strNoregistrasi='
            // 		+ $scope.dataPasienSelected.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&view=' + stt, function (response) {
            // 			// do something with response
            // 		});

            // }
            $scope.CetakRekap = function () {
                // $mdDialog.show(confirm).then(function() {
                debugger
                var NoStruk = $scope.dataRincianTagihan;
                var struk = "";
                var kwitansi = "";
                var stt = 'false'
                if (confirm('View Rekap Biaya? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.dataPasienSelected.noRegistrasi + '?jenisdata=bill').then(function (dat) {
                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiayaPelayanan=1&strNoregistrasi=' + $scope.dataPasienSelected.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&view=' + stt, function (response) {
                            // do something with response
                        });
                    })
                })

            }
            $scope.Cetakv2 = function () {
                $scope.popupCetak2.center().open();
            }

            // $scope.Cetak2 = function () {
            //   debugger;
            // 	// $mdDialog.show(confirm).then(function() {
            // 	// debugger
            // 	$scope.isRouteLoading = true;
            // 	medifirstService.get("tatarekening/detail-tagihan/" + $scope.dataPasienSelected.noRegistrasi + '?jenisdata=bill').then(function (dat) {
            // 		$scope.isRouteLoading = false;
            // 		var NoStruk = $scope.dataRincianTagihan;
            // 		var struk = "";
            // 		var kwitansi = "";
            // 		var stt = 'false'
            // 		if (confirm('View Rincian Biaya? ')) {
            // 			// Save it!
            // 			stt = 'true';
            // 		} else {
            // 			// Do nothing!
            // 			stt = 'false'
            // 		}
            // 		// if ($scope.item.jenisPasien != "BPJS") {
            // 		medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
            // 			var client = new HttpClient();
            // 			debugger;
            // 			client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=' + $scope.dataPasienSelected.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&view=' + stt, function (response) {
            // 				// do something with response
            // 			});
            // 		})
            // 		// }else{
            // 		// 	medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
            // 		//              	var client = new HttpClient(); 
            // 		//               client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
            // 		//                   // do something with response
            // 		//               });
            // 		//           	})
            // 		// }
            // 	});
            // }
            $scope.Cetak2 = function () {
                // $mdDialog.show(confirm).then(function() {
                // debugger
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.dataPasienSelected.noRegistrasi + '?jenisdata=bill').then(function (dat) {
                    $scope.isRouteLoading = false;
                    var NoStruk = $scope.dataRincianTagihan;
                    var struk = "";
                    var kwitansi = "";
                    var stt = 'false'
                    if (confirm('View Rincian Biaya? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    // if ($scope.item.jenisPasien != "BPJS") {
                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var client = new HttpClient();
                        debugger;
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=' + $scope.dataPasienSelected.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&cetakan=' + $scope.item.cetakx + '&view=' + stt, function (response) {
                            // do something with response
                        });
                    })
                    // }else{
                    // 	medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                    //              	var client = new HttpClient(); 
                    //               client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
                    //                   // do something with response
                    //               });
                    //           	})
                    // }
                });
            }
            $scope.Close2 = function () {
                $scope.popupCetak2.close();
            }

            $scope.cetakJasper = function () {
                debugger
                medifirstService.get("tatarekening/detail-tagihanv2/" + $scope.dataPasienSelected.noRegistrasi + '?jenisdata=bill').then(function (dat) {
                    debugger;
                    var billing = "Rp " + parseFloat(dat.data.billing).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    var deposit = "Rp " + parseFloat(dat.data.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    $scope.isRouteLoading = true;


                    for (var i = 0; i < dat.data.details.length; i++) {
                        if (dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
                            if (dat.data.details[i].norec != null) {
                                alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' + dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' + dat.data.details[i].tglPelayanan)
                                return
                            }
                        }
                    }

                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var kelas = dat.data.kelasRawat;
                        var sisa = "Rp 0,00";
                        var bayar = "Rp " + parseFloat(dat.data.dibayar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        if (bayar == "Rp NaN") {
                            bayar = "Rp 0,00";
                        }
                        if (dat.data.jenisPasien != "Umum/Pribadi") {
                            kelas = dat.data.kelasPenjamin
                            // bayar = "0"
                        }

                        if (dat.data.deposit > 0) {
                            sisa = dat.data.deposit - parseFloat(dat.data.bayar)
                            if (sisa > 0) {
                                sisa = "Rp " + parseFloat(sisa).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            } else {
                                sisa = "RP 0,00";
                            }
                        }
                        var nosep = "-";
                        if (dat.data.nosep != "" && dat.data.nosep != null) {
                            nosep = dat.data.nosep
                        }
                        debugger;

                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "nocm", "namapasien", "lastruangan", "namakamar", "kelas", "jmlbiaya", "deposit", "sisa", "isi", "terbilang", "bayar", "nosep"],
                            "paramValue": ["RSUD Sumedang", "1980-12-25 00:00:00", "Jl. Palasari No.80, Kotakulon, Kec. Sumedang Sel., Kabupaten Sumedang, Jawa Barat 45311", e.data[0].namalengkap, dat.data.noRegistrasi,
                                dat.data.noCm, dat.data.namaPasien, dat.data.lastRuangan, dat.data.namakamar, kelas, billing, deposit, sisa, dat.data.isi, dat.data.terbilang, bayar, nosep
                            ],
                            "paramType": ["", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
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
                                // pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                                var win = window.open(url, '_blank');
                                win.focus();
                            }
                        }
                        if ($scope.item.jenisPasien == "BPJS") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            }
                        } else if ($scope.item.jenisPasien == "Umum/Pribadi") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            }
                        } else if ($scope.item.jenisPasien == "KEMENKES RI") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            }
                        } else if ($scope.item.namaPenjamin == "JASA RAHARJA, PT (BPJS KESEHATAN)") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            }
                        } else if ($scope.item.namaPenjamin == "JASA RAHARJA, PT (UMUM)") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            }
                        } else {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSIv2.pdf');
                            }
                        }
                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    })
                })
            }
            $scope.suratketerangan = function () {

                debugger

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "nocm", "noregistrasi", "tglpulang", "penjamin"],
                    "paramValue": ["RSB Sartika Asih", "1980-12-25 00:00:00", "Jl. Moh. Toha No.369, Ciseureuh, Kec. Regol, Kota Bandung, Jawa Barat 40256",
                        $scope.dataPasienSelected.noCm, $scope.dataPasienSelected.noRegistrasi, $scope.dataPasienSelected.tanggalPulang, $scope.dataPasienSelected.namarekanan
                    ], //"paramValue": ["RSUD Cibinong", "1980-12-25 00:00:00"],
                    "paramType": ["", "", "", "", "", "", "", "", "", ""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                    xhr.open('POST', '/jasper1/generic/report/suratketerangan.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/suratketerangan.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
            }

            function LoadDataClosingFaktur() {
                medifirstService.get("tatarekening/get-status-close-pemeriksaan?noregistrasi=" +
                    $scope.dataPasienSelected.noRegistrasi, true).then(function (dat) {
                        debugger;
                        $scope.statusSelesaiPeriksa = dat.data.data
                        debugger;
                    });
            }
            // $scope.tagihanClosing = function () {
            //     $scope.popUpclosing.center().open()
            // }

            $scope.closingTagihan = function () {
                debugger;
                if ($scope.item.password != "ditutup") {
                    toastr.error("Password Salah!")
                    return;
                }
                var json = {
                    'noregistrasi': $scope.dataPasienSelected.noRegistrasi,
                    'close': true
                }
                debugger;
                medifirstService.post('tatarekening/save-selesai-transaksi-faktur', json).then(function (e) {
                    if (e.status === 201) {
                        debugger;
                        medifirstService.post('tatarekening/save-log-closing-faktur', json).then(function (e) {
                            LoadDataClosingFaktur();
                        })
                    }
                })
                $scope.popUpclosing.close()
            }
            $scope.batalClosing = function () {
                $scope.popUpUnclosing.center().open()
            }
            $scope.saveUnclosing = function () {
                debugger;
                if ($scope.item.password != "dibuka") {
                    toastr.error("Password Salah!")
                    return;
                }
                if ($scope.item.batalClosing == undefined || $scope.item.batalClosing == " ") {
                    toastr.error("Alasan Batal Closing Harus Diisi !")
                    return;
                }
                debugger;
                var json = {
                    'alasanbatalclosing': $scope.item.batalClosing,
                    'noregistrasi': $scope.dataPasienSelected.noRegistrasi,
                    'close': false
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-faktur', json).then(function (e) {
                    if (e.status === 201) {
                        debugger;
                        medifirstService.post('tatarekening/save-log-unclosing-faktur', json).then(function (e) {
                            debugger;
                            LoadDataClosingFaktur();

                        })
                    }
                })
                $scope.popUpUnclosing.close()
            }

            $scope.BtalPulang = function () {
                // $scope.popupPassword.center().open();
                medifirstService.get("tatarekening/get-status-verif-piutang?noReg=" + $scope.dataPasienSelected.noRegistrasi, false).then(function (res) {
                    debugger;
                    // if ($scope.dataPasienSelected.deptid != '16') {
                    //     window.messageContainer.error("Pasien Sudah Di Closing, Tidak Dapat Di Batal Pulang !!!");
                    //     return;
                    // }
                    if ($scope.dataPasienSelected.tglclosing != null) {
                        window.messageContainer.error("Pasien Sudah di Closing, Tidak Dapat di Batal Pulang !!!");
                        return;
                    }
                    if ($scope.dataPasienSelected.status == "Verifikasi" || $scope.dataPasienSelected.status == "-") {
                        window.messageContainer.error("Pasien Sudah di Verifikasi, Tidak Dapat di Batal Pulang !!!");
                        return;
                    }
                    medifirstService.get("tatarekening/get-kamar-bed?noReg=" + $scope.dataPasienSelected.noRegistrasi).then(function (dat) {
                        debugger;
                        var cekKamarBed = dat.data
                        var bed = dat.data[0].nobed
                        $scope.$watch('item.kelas', function (e) {
                            if (e === undefined) return;
                            var kelasId = "idKelas=" + cekKamarBed[0].id_kelas;
                            var ruanganIdd = "&idRuangan=" + cekKamarBed[0].id_ruangan;
                            medifirstService.get("rawatinap/get-kamarbyruangankelas?" + kelasId + ruanganIdd)
                                .then(function (b) {
                                    $scope.listKamar = _.filter(b.data.kamar, function (v) {
                                        return parseFloat(v.qtybed) > parseFloat(v.jumlakamarisi);
                                    })
                                });
                        });
                        if (bed == null) {
                            toastr.info('Pasien ini tidak memiliki bed sebelumnya, silahkan pilih bed terlebih dahulu')
                            $scope.popUpBatalPulang.center().open();
                            $scope.item.ruangann = { namaruangan: $scope.dataPasienSelected.namaRuangan }
                            $scope.item.kelas = { namakelas: cekKamarBed[0].kelasruangan }
                            return;
                        }

                        medifirstService.get("tatarekening/get-bed-sama?bed=" + bed).then(function (data) {
                            debugger;
                            var statusbed = data.data[0]
                            $scope.item.ruangann = { namaruangan: $scope.dataPasienSelected.namaRuangan }
                            $scope.item.kelas = { namakelas: cekKamarBed[0].kelasruangan }
                            if (statusbed.objectstatusbedfk == 1 && $scope.dataPasienSelected.deptid == 16) {
                                toastr.info('Bed sebelumnya sudah terisi, silahkan pilih bed lain')
                                $scope.popUpBatalPulang.center().open();

                                return
                            } else {
                                var objsave = {
                                    noregistrasi: $scope.dataPasienSelected.noRegistrasi,
                                    nobed: dat.data[0].nobed,
                                    tglpulang: null
                                }
                                medifirstService.post('kasir/save-batal-pulang', objsave).then(function (data) {
                                    LoadData();
                                })
                                medifirstService.get("sysadmin/logging/save-log-batal-pulang-pasien?norec_pd=" +
                                    $scope.dataPasienSelected.noCm
                                ).then(function (data) {
                                    // window.history.back();
                                    console.log(data.data);
                                })
                            }

                            // debugger;
                            // $scope.popUpBatalPulang = function () {

                            // }
                            // if ($scope.dataPasienSelected.status == 'Verifikasi'
                            //   || res.data.noverif != undefined
                            //   || $scope.dataPasienSelected.status == '-') {
                            //   window.messageContainer.error("Data Pasien Sudah di Verifikasi!!!");
                            //   return;
                            // }
                            // var objsave = {
                            //   noregistrasi: $scope.dataPasienSelected.noRegistrasi,
                            //   tglpulang: null
                            // }
                            // medifirstService.post('kasir/save-batal-pulang', objsave).then(function (data) {
                            //   LoadData();
                            // })
                        })
                    });

                });
            }
            $scope.DaftarRuangan = function () {
                debugger;

                if ($scope.dataPasienSelected.noRegistrasi != undefined) {
                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noRegistrasi
                    }


                    cacheHelper.set('AntrianPasienDiperiksaNOREG', $scope.dataPasienSelected.noRegistrasi);
                    // cacheHelper.set('AntrianPasienDiperiksaNOREG', '');
                    $state.go('DetailRegistrasi', {
                        dataPasien: JSON.stringify(obj)
                    });
                }
            }
            //   $scope.savepopupPassword = function () {
            //     if ($scope.item.password != "tahubulat") {
            // 			toastr.error("Password Salah !")
            // 			return;
            // 		}
            //     $scope.popupPassword.close();
            //     medifirstService.get("tatarekening/get-status-verif-piutang?noReg=" + $scope.dataPasienSelected.noRegistrasi, false).then(function (res) {
            //       debugger;
            //       if ($scope.dataPasienSelected.deptid != '16') {
            //         window.messageContainer.error("Pasien Sudah Di Closing, Tidak Dapat Di Batal Pulang !!!");
            //         return;
            //       }
            //       if ($scope.dataPasienSelected.tglclosing != null) {
            //         window.messageContainer.error("Pasien Sudah di Closing, Tidak Dapat di Batal Pulang !!!");
            //         return;
            //       }
            //       if ($scope.dataPasienSelected.status == "Verifikasi" || $scope.dataPasienSelected.status == "-") {
            //         window.messageContainer.error("Pasien Sudah di Verifikasi, Tidak Dapat di Batal Pulang !!!");
            //         return;
            //       }
            //       medifirstService.get("tatarekening/get-kamar-bed?noReg=" + $scope.dataPasienSelected.noRegistrasi).then(function (dat) {
            //         debugger;
            //         var cekKamarBed = dat.data
            //         var bed = dat.data[0].nobed
            //         $scope.$watch('item.kelas', function(e) {
            //           if (e === undefined) return;
            //           var kelasId = "idKelas=" + cekKamarBed[0].id_kelas;
            //           var ruanganIdd ="&idRuangan=" + cekKamarBed[0].id_ruangan;
            //           medifirstService.get("rawatinap/get-kamarbyruangankelas?"+kelasId+ruanganIdd)         
            //           .then(function (b) {
            //               $scope.listKamar = _.filter(b.data.kamar, function(v) {
            //                   return parseFloat(v.qtybed) > parseFloat(v.jumlakamarisi);
            //               })
            //           });
            //       });
            //       if(bed == null){
            //         toastr.info('Pasien ini tidak memiliki bed sebelumnya, silahkan pilih bed terlebih dahulu')
            //         $scope.popUpBatalPulang.center().open();
            //         $scope.item.ruangann = { namaruangan : $scope.dataPasienSelected.namaRuangan }
            //           $scope.item.kelas = { namakelas : cekKamarBed[0].kelasruangan }
            //         return;
            //       }

            //         medifirstService.get("tatarekening/get-bed-sama?bed=" + bed).then(function (data) {
            //           debugger;
            //           var statusbed = data.data[0]
            //           $scope.item.ruangann = { namaruangan : $scope.dataPasienSelected.namaRuangan }
            //           $scope.item.kelas = { namakelas : cekKamarBed[0].kelasruangan }
            //           if(statusbed.objectstatusbedfk == 1 && $scope.dataPasienSelected.deptid == 16) {
            //             toastr.info('Bed sebelumnya sudah terisi, silahkan pilih bed lain')
            //             $scope.popUpBatalPulang.center().open();

            //             return
            //           }
            //           else {
            //             var objsave = {
            //               noregistrasi: $scope.dataPasienSelected.noRegistrasi,
            //               nobed: dat.data[0].nobed,
            //               tglpulang: null
            //             }
            //             medifirstService.post('kasir/save-batal-pulang', objsave).then(function (data) {
            //               LoadData();
            //             })
            //           }

            //           // debugger;
            //   // $scope.popUpBatalPulang = function () {

            //   // }
            //       // if ($scope.dataPasienSelected.status == 'Verifikasi'
            //       //   || res.data.noverif != undefined
            //       //   || $scope.dataPasienSelected.status == '-') {
            //       //   window.messageContainer.error("Data Pasien Sudah di Verifikasi!!!");
            //       //   return;
            //       // }
            //       // var objsave = {
            //       //   noregistrasi: $scope.dataPasienSelected.noRegistrasi,
            //       //   tglpulang: null
            //       // }
            //       // medifirstService.post('kasir/save-batal-pulang', objsave).then(function (data) {
            //       //   LoadData();
            //       // })
            //     })
            //   });

            // });
            //   }
            $scope.UbahDokter = function () {
                debugger;
                if ($scope.dataPasienSelected.noRegistrasi == undefined) {
                    toastr.error('Pilih Data Dulu !')
                    return;
                }
                medifirstService.get("rawatinap/get-dokters-combos").then(function (data) {
                    $scope.listDokter = data.data.dokter;

                    $scope.winDialogss.center().open();

                    // $scope.item = $scope.dataPasienSelected;
                    // medifirstService.get("rawatinap/get-dokters-combos", false).then(function (data) {
                    //     $scope.listDokter = data.data.dokter;
                    // })
                    // // show popup untuk pilih dokter
                    // $scope.winDialogss.center().open();
                })
            }

            $scope.simpanDokter = function (item, data) {
                console.log($scope.dataPasienSelected)
                // medifirstService.get("tatarekening/get-kamar-bed?noReg=" + $scope.dataPasienSelected.noRegistrasi).then(function (dat) {

                //     debugger;
                //     var statusbed = dat.data[0]


                //     // var listRawRequired = [
                //     //     "items.pilihDokter|k-ng-model|Dokter"
                //     // ];
                //     // var isValid = ModelItem.setValidation($scope, listRawRequired);

                //     // if (isValid.status) {
                //     // munculkan nama dokter di grid
                //     // items.pilihDokter = data.data.dokter.namalengkap;

                //     // save dokter yang dipilih
                //     var tmpData = {
                //         norec_pd: statusbed.norec_pd,
                //         norec_apd: statusbed.norec_apd,
                //         iddokter: $scope.items.pilihDokter.id
                //     }
                    medifirstService.post('tatarekening/update-dokter-by-noreg?noregistrasi=' + $scope.dataPasienSelected.noRegistrasi + '&objectpegawaifk=' + $scope.items.pilihDokter.id).then(function (e) {
                        // update status antrian
                        $scope.winDialogss.close();
                        LoadData()
                        // $scope.findData(); 

                    });
                // })
            }
            $scope.closeBatalPulang = function () {
                $scope.popUpBatalPulang.close();
            }
            $scope.saveBatalPulang = function () {
                debugger;
                var objsave = {
                    noregistrasi: $scope.dataPasienSelected.noRegistrasi,
                    objectkamarfk: $scope.item.kamar.id,
                    nobed: $scope.item.nomorTempatTidur.id,
                    tglpulang: null
                }
                medifirstService.post('kasir/save-batal-pulang-bed', objsave).then(function (data) {
                    LoadData();
                })
                $scope.popUpBatalPulang.close();
            }

            // $scope.BtalPulang = function () {
            //   medifirstService.get("tatarekening/get-status-verif-piutang?noReg=" + $scope.dataPasienSelected.noRegistrasi, false).then(function (res) {
            //     debugger;
            //     if ($scope.dataPasienSelected.deptid != '16') {
            //       window.messageContainer.error("Pasien Sudah Di Closing, Tidak Dapat Di Batal Pulang !!!");
            //       return;
            //     }
            //     if ($scope.dataPasienSelected.tglclosing != null) {
            //       window.messageContainer.error("Pasien Sudah di Closing, Tidak Dapat di Batal Pulang !!!");
            //       return;
            //     }
            //     if ($scope.dataPasienSelected.status == "Verifikasi" || $scope.dataPasienSelected.status == "-") {
            //       window.messageContainer.error("Pasien Sudah di Verifikasi, Tidak Dapat di Batal Pulang !!!");
            //       return;
            //     }

            //     // if ($scope.dataPasienSelected.status == 'Verifikasi'
            //     //   || res.data.noverif != undefined
            //     //   || $scope.dataPasienSelected.status == '-') {
            //     //   window.messageContainer.error("Data Pasien Sudah di Verifikasi!!!");
            //     //   return;
            //     // }
            //     var objsave = {
            //       noregistrasi: $scope.dataPasienSelected.noRegistrasi,
            //       tglpulang: null
            //     }
            //     medifirstService.post('kasir/save-batal-pulang', objsave).then(function (data) {
            //       LoadData();
            //     })
            //   })
            // }
            // var chacePeriode = tglAwal + ":" + tglAkhir + ":" + tempStatus + ":" + tempNamaOrReg 
            //               + ":" + tempNoReg + ":" + tempRuanganId  + ":" + tempInstalasiId;
            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarPasienPulangCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tanggalRegistrasiAwal = new Date(chacePeriode[0]);
                    $scope.item.tanggalRegistrasiAkhir = new Date(chacePeriode[1]);
                    $scope.item.status = chacePeriode[2]
                    $scope.item.namaOrReg = chacePeriode[3]

                    if (chacePeriode[6] != undefined) {
                        // LoadData()
                        $scope.listDepartemen = [chacePeriode[6]]
                        $scope.item.instalasi = chacePeriode[6]
                    }
                    if (chacePeriode[5] != undefined) {
                        $scope.listRuangan = [chacePeriode[5]]
                        $scope.item.ruangan = chacePeriode[5]
                    }
                    if (chacePeriode[9] != undefined) {
                        $scope.listKelompokPasien = [chacePeriode[9]]
                        $scope.item.kelompokpasien = chacePeriode[9]
                    }
                    if (chacePeriode[10] != undefined) {
                        $scope.listRekanan = [chacePeriode[10]]
                        $scope.item.rekanan = chacePeriode[10]
                    }



                    if (chacePeriode[4] != undefined) {
                        // LoadData()
                        $scope.item.noReg = chacePeriode[4]
                    }
                    if (chacePeriode[7] != undefined) {
                        // LoadData()
                        $scope.item.noRm = chacePeriode[7]
                    }
                    if (chacePeriode[8] != undefined) {
                        // LoadData()
                        $scope.item.jmlRows = chacePeriode[8]
                    }

                    // LoadData()
                } else {
                    $scope.item.tanggalRegistrasiAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'))
                    $scope.item.tanggalRegistrasiAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
                    LoadData()
                }
            }

            $scope.getIsiComboRuangan = function () {
                debugger;
                $scope.listRuangan = $scope.item.instalasi.ruangan
            }

            $scope.getIsiComboRekanan = function () {
                debugger;
                $scope.listRekanan = $scope.item.kelompokpasien.rekanan
            }

            function LoadCombo() {
                debugger
                medifirstService.get("tatarekening/get-combo-detail-regis", false).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.rekanana;
                    $scope.listStatusKeluar = dat.data.statusKeluar;
                    dataLogin = medifirstService.getUserLogin();
                })
                $scope.listStatus = [{ "id": "1", "namaExternal": "Semua" }, { "id": "2", "namaExternal": "Belum Verifikasi" }, { "id": "3", "namaExternal": "Verifikasi" }, { "id": "4", "namaExternal": "Lunas" }]
                
                medifirstService.get("tatarekening/get-combo-baru").then(function(dat) {
                    $scope.listRuanganRJPapj = dat.data.ruanganRajal;
                    $scope.listRuanganIGDPapj = dat.data.ruanganIgd;
                    $scope.listRuanganRehabPapj = dat.data.ruanganRm;
                    $scope.listRuanganRIPapj = dat.data.ruanganRanap;
                })
            };

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatTanggalJam = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.click = function (dataPasienSelected) {
                var data = dataPasienSelected;
                if (dataPasienSelected != undefined) {
                    $scope.dataPasienSelected = dataPasienSelected
                    medifirstService.get("tatarekening/get-struk-pelayanan/" + dataPasienSelected.noRegistrasi, false).then(function (res) {
                        if (res.data.data.length > 0) {
                            $scope.showBtnBayar = true
                            $scope.listBelumBayar = res.data.data
                            $scope.norecSpLast = res.data.data[0].norec_sp
                        } else {
                            $scope.showBtnBayar = false
                            $scope.listBelumBayar = undefined
                            $scope.norecSpLast = ''
                        }
                    })
                    if (dataPasienSelected.tglclosing == null)
                        $scope.isSelesaiPeriksa = false
                    else
                        $scope.isSelesaiPeriksa = true
                }
            };
            $scope.onClickSatu = function (e) {
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);
                debugger
                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData2, function (e) {
                        return e.norec == dataItem.norec;
                    });
                    if (result.length == 0) {
                        $scope.selectedData2.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedData2.length; i++)
                            if ($scope.selectedData2[i].norec === dataItem.norec) {
                                $scope.selectedData2.splice(i, 1);
                                break;
                            }
                        $scope.selectedData2.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedData2.length; i++)
                        if ($scope.selectedData2[i].norec === dataItem.norec) {
                            $scope.selectedData2.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }
            var onDataBound = function () {
                $('td').each(function () {
                    if ($(this).text() == 'Naik Kelas') { $(this).addClass('red') }
                    // if ($(this).text() == 'sesuai') { $(this).addClass('green') }
                    if ($(this).text() == 'Titipan') { $(this).addClass('blue') }

                })
            }



            
            


            $scope.Cetak = function () {
                //if(!$scope.dataPasienSelected.isPaid){
                if ($scope.dataPasienSelected.status == 'Belum Verifikasi') {
                    var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
                        "Pasien belum melakukan pembayaran", "Ok");

                    $mdDialog.show(alertDialog).then(function () { });
                } else {
                    ////debugger;
                    if ($scope.dataPasienSelected.noRegistrasi != undefined) {
                        var stt = 'false'
                        if (confirm('View ? ')) {
                            // Save it!
                            stt = 'true';
                        } else {
                            // Do nothing!
                            stt = 'false'
                        }
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kip=1&noregistrasi=' + $scope.dataPasienSelected.noRegistrasi + '&strIdPegawai=' + dataLogin.namauser + '&STD=&view=' + stt, function (response) {
                            // aadc=response;
                        });
                        // var obj = {
                        //   noRegistrasi : $scope.dataPasienSelected.noRegistrasi
                        // }

                        // $state.go("CetakDokumenTataRekening", {
                        //   dataPasien: JSON.stringify(obj)
                        // });
                    } else {
                        alert("Silahkan pilih data pasien terlebih dahulu");
                    }
                }
            }

            $scope.Verifikasi = function () {
                medifirstService.get("tatarekening/get-status-verif-piutang?noReg=" + $scope.dataPasienSelected.noRegistrasi, false).then(function (res) {

                    if (res.data.noverif != undefined) {
                        alert("Sudah dalam penagihan piutang, tidak bisa di Verifikasi!")
                        return;
                    }
                    //POSTING JURNAL
                    var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format('YYYY-MM-DD HH:mm');
                    var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format('YYYY-MM-DD HH:mm');;
                    $scope.changePage("VerifikasiTagihan");
                })
            }

            $scope.KelengkapanDokumen = function () {
                $scope.changePage("KelengkapanDokumenTataRekening");
            }

            $scope.UbahJenisPasien = function () {
                if ($scope.dataPasienSelected.status == "Verifikasi" || $scope.dataPasienSelected.status == "-") {
                    $scope.changePage("FormUbahJenisPasien");
                } else {
                    var alertDialog = medifirstService.showAlertDialog("Status Harus Verfikasi", "", "Ok", "");
                    $mdDialog.show(alertDialog).then(function () { });
                }
            }

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            $scope.Detail = function () {

                var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format('YYYY-MM-DD HH:mm');;
                //POSTING JURNAL
                var objSave = {
                    tglAwal: tglAwal,
                    tglAkhir: tglAkhir
                }
                // medifirstService.post('sysadmin/general/save-jurnal-verifikasi_tarek', objSave).then(function (e) { })
                var objSave = {
                    noregistrasi: $scope.dataPasienSelected.noRegistrasi
                }
                // medifirstService.post('sysadmin/general/save-jurnal-pelayananpasien_t', objSave).then(function (e) { })
                $scope.changePage("RincianTagihan");
            }

            $scope.changePage = function (stateName) {

                if ($scope.dataPasienSelected.noRegistrasi != undefined) {

                    var obj = {
                        noRegistrasi: $scope.dataPasienSelected.noRegistrasi
                    }

                    $state.go(stateName, {
                        dataPasien: JSON.stringify(obj)
                    });
                } else {
                    alert("Silahkan pilih data pasien terlebih dahulu");
                }
            }

            function checkValue(obj, param) {
                var res = "";
                var data = undefined;

                if (param.length > 1) {
                    if (obj[param[0]] != undefined)
                        data = obj[param[0]][param[1]];
                } else {
                    data = obj[param[0]];
                }

                if (data != undefined)
                    var res = data;

                return res;
            }

            function isInt(value) {
                var er = /^-?[0-9]+$/;

                return er.test(value);
            }

            LoadData()
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.ruangan = {};
                $scope.item.rekanan = {};
                $scope.item.tanggalRegistrasiAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                $scope.item.tanggalRegistrasiAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
                $scope.SearchData();
            }

            $scope.SearchData = function () {
                LoadData()
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

            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format('YYYY-MM-DD HH:mm');;
                debugger;

                var tempNamaOrReg = "";
                if ($scope.item.namaOrReg != undefined) {
                    tempNamaOrReg = $scope.item.namaOrReg;
                }

                var tempNoReg = "";
                if ($scope.item.noReg != undefined) {
                    tempNoReg = $scope.item.noReg;
                }

                var tempRuanganId = "";
                var tempRuanganIdArr = {};
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = $scope.item.ruangan.id;
                    tempRuanganIdArr = { id: $scope.item.ruangan.id, ruangan: $scope.item.ruangan.ruangan }
                }

                var tempStatus = "";
                var tempStatusArr = {};
                if ($scope.item.status != undefined) {
                    tempStatus = $scope.item.status.namaExternal;
                    tempStatusArr = { id: $scope.item.status.id, namaExternal: $scope.item.status.namaExternal }
                }

                var tempStatusKeluar = "";
                var tempStatusKeluarArr = {};
                if ($scope.item.statuskeluar != undefined) {
                    tempStatusKeluar = $scope.item.statuskeluar.id;
                    tempStatusKeluarArr = { id: $scope.item.statuskeluar.id, namaexternal: $scope.item.statuskeluar.namaexternal }
                }

                var tempInstalasiId = "";
                var tempInstalasiIdArr = {};
                if ($scope.item.instalasi != undefined) {
                    tempInstalasiId = $scope.item.instalasi.id;
                    tempInstalasiIdArr = { id: $scope.item.instalasi.id, departemen: $scope.item.instalasi.departemen }
                }
                debugger
                var tempKelompokPasienId = "";
                var tempKelompokPasienIdArr = {};
                if ($scope.item.kelompokpasien != undefined) {
                    tempKelompokPasienId = $scope.item.kelompokpasien.id;
                    tempKelompokPasienIdArr = { id: $scope.item.kelompokpasien.id, kelompokpasien: $scope.item.kelompokpasien.kelompok }
                }
                var tempRekananId = "";
                var tempRekananIdArr = {};
                if ($scope.item.rekanan != undefined) {
                    tempRekananId = $scope.item.rekanan.id;
                    tempRekananIdArr = { id: $scope.item.rekanan.id, rekanan: $scope.item.rekanan.rekanan }
                }
                var tempNoRm = "";
                if ($scope.item.noRm != undefined) {
                    tempNoRm = $scope.item.noRm;
                }
                var jmlRow = ""
                if ($scope.item.jmlRows != undefined) {
                    jmlRow = $scope.item.jmlRows
                }
                // var kelompokPasienId = ""
                // if ($scope.item.kelompokpasien != undefined) {
                //   kelompokPasienId = $scope.item.kelompokpasien.id
                // }

                // var chacePeriode = tglAwal + ":" + tglAkhir + ":" + tempStatus + ":" + tempNamaOrReg 
                //                    + ":" + tempNoReg + ":" + tempRuanganId  + ":" + tempInstalasiId;
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: tempStatusArr,
                    3: tempNamaOrReg,
                    4: tempNoReg,
                    5: tempRuanganIdArr,
                    6: tempInstalasiIdArr,
                    7: tempNoRm,
                    8: jmlRow,
                    9: tempKelompokPasienIdArr,
                    10: tempRekananIdArr,
                    11: tempStatusKeluarArr
                }
                cacheHelper.set('DaftarPasienPulangCtrl', chacePeriode);


                medifirstService.get("tatarekening/daftar-pasien-pulang-papj-new?" +
                    "namaPasien=" + tempNamaOrReg +
                    "&ruanganId=" + tempRuanganId +
                    "&status=" + tempStatus +
                    "&tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&noReg=" + tempNoReg +
                    "&instalasiId=" + tempInstalasiId +
                    "&noRm=" + tempNoRm +
                    "&jmlRows=" + jmlRow +
                    "&kelompokPasienId=" + tempKelompokPasienId +
                    "&statusKeluar=" + tempStatusKeluar +
                    "&rekananPasienId=" + tempRekananId)
                    .then(function (data) {
                        $scope.showBtnBayar = false
                        $scope.isRouteLoading = false;
                        var data = data.data
                        debugger;
                        for (let i = 0; i < data.length; i++) {
                            // const element = data[i];
                            if (data[i].tglclosing == null) {
                                data[i].status2 = "CLOSING"
                            } else {
                                data[i].status2 = "BATAL"
                            }
                            data[i].statusclaim = data[i].statusclaim || '-';
                            // data[i].byTarifRS = data[i].byTarifRS || '-';
                            data[i].byPengajuan = data[i].byPengajuan || '-';
                            data[i].bySetujui = data[i].bySetujui || '-';
                        }
                        $scope.dataPasienPulang = new kendo.data.DataSource({
                            data: data,
                            pageSize: 200,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                    });

                //POSTING JURNAL
                var tglAwal = moment($scope.item.tanggalRegistrasiAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tanggalRegistrasiAkhir).format('YYYY-MM-DD HH:mm');;
                // var objSave ={
                //   tglAwal:tglAwal,
                //   tglAkhir:tglAkhir
                // }
                // manageTataRekening.postJurnalAkuntansi(objSave).then(function(data){
                // })


                let tglAwalKemarin = moment().subtract(30, 'days').startOf('day').format('YYYY-MM-DD 00:00');
                let tglAkhirKemarin = moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD 23:59');

                let mapRuangan = medifirstService.getMapLoginUserToRuangan();

                medifirstService.get(
                    "tatarekening/daftar-pasien-pulang-papj-new?" +
                    "tglAwal=" + tglAwalKemarin +
                    "&tglAkhir=" + tglAkhirKemarin +
                    "&kelompokPasienId=2" + "&statusPAPJId=Belum" + "&mapRuangan=" + mapRuangan[0].id + "&statusGet=Notif"
                ).then(function (e) {
                    if (e.data.length > 0) {
                        let grouped = {};
                        e.data.forEach(item => {
                            let tgl = moment(item.tanggalPulang).format('YYYY-MM-DD');
                            if (!grouped[tgl]) {
                                grouped[tgl] = 0;
                            }
                            grouped[tgl]++;
                        });

                        let dataTable = Object.keys(grouped).map((tgl, index) => {
                            return {
                                no: index + 1,
                                tanggalBelum: tgl,
                                jumlahBelum: grouped[tgl]
                            };
                        });

                        $scope.sourceBerkasBelum = new kendo.data.DataSource({
                            data: dataTable,
                            pageSize: 200,
                            total: dataTable.length,
                            serverPaging: false
                        });

                        $scope.winBerkas.center().open();
                    }
                });
            };

            $scope.closeWinBerkas = function () {
                $scope.winBerkas.close()
            }

            $scope.BayarTagihan = function () {

                var obj = {
                    noRegistrasi: $scope.norecSpLast
                }

                $state.go("PembayaranTagihanLayananKasir", {
                    dataPasien: JSON.stringify(obj)
                });
            }
            // $scope.closingTagihan = function () {
            //     if ($scope.dataPasienSelected == undefined) {
            //         toastr.error('Pilih data dulu')
            //         return
            //     }
            //     if ($scope.dataPasienSelected.status == 'Belum Verifikasi') {
            //         toastr.error('Pasien belum diverifikasi')
            //         return
            //     }
            //     if ($scope.listBelumBayar != undefined) {
            //         toastr.error('Pasien harus melunasi tagihan terlebih dahulu ')
            //         return
            //     }


            //     var confirm = $mdDialog.confirm()
            //         .title('Informasi')
            //         .textContent('Selesai Periksa akan menutup / closing Pemeriksaan pasien, Lanjut simpan ?')
            //         .cancel('Tidak')
            //         .ok('Ya')
            //     $mdDialog.show(confirm).then(function () {
            //         var json = {
            //             'noregistrasi': $scope.dataPasienSelected.noRegistrasi,
            //             'close': true
            //         }
            //         medifirstService.post('tatarekening/save-selesai-transaksi', json).then(function (e) {
            //             if (e.status === 201) {
            //                 medifirstService.post('tatarekening/save-log-closing', json).then(function (e) {

            //                 })
            //             }
            //         })
            //     })
            // }

            $scope.closingTagihangrid = function (x) {
                // debugger;
                if (x.status2 == "BATAL") {
                    toastr.error('BATAL CLOSING PILIH TOMBOL BATAL CLOSING DIBAWAH')
                    return
                }

                if (x == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                if (x == 'Belum Verifikasi') {
                    toastr.error('Pasien belum diverifikasi')
                    return
                }
                if ($scope.listBelumBayar != undefined) {
                    toastr.error('Pasien harus melunasi tagihan terlebih dahulu ')
                    return
                }


                var confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .textContent('Selesai Periksa akan menutup / closing Pemeriksaan pasien, Lanjut simpan ?')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    var json = {
                        'noregistrasi': x.noRegistrasi,
                        'close': true
                    }
                    medifirstService.post('tatarekening/save-selesai-transaksi', json).then(function (e) {
                        var tglclosing = new Date();
                        tglclosing = moment(tglclosing).format('YYYY-MM-DD HH:mm:ss');
                        var objverif = {
                            "tglclosing": tglclosing,
                            // "tglnk": tglnk, 
                            "pegawaiverif": dataLogin.id,
                            "noregistrasi": x.noRegistrasi
                        };
                        // medifirstService.post('remunerasi/save-jasapelayanandokter',objverif).then(function(e){     

                        // })   
                        if (e.status === 201) {
                            medifirstService.post('tatarekening/save-log-closing', json).then(function (e) {
                                LoadData();
                            })
                        }
                    })
                })
            }
            $scope.batalClosing = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.popUpUnclosing.center().open()
                // var json = {
                //   'noregistrasi': $scope.dataPasienSelected.noRegistrasi,
                //   'close': false
                // }
                // medifirstService.post('tatarekening/save-selesai-transaksi', json).then(function (e) { })
            }
            $scope.saveUnclosing = function () {
                debugger;
                if ($scope.item.password != "donatelo") {
                    toastr.error("Password Salah!")
                    return;
                }
                if ($scope.item.batalClosing == undefined || $scope.item.batalClosing == " ") {
                    toastr.error("Alasan Batal Closing Harus Diisi !")
                    return;
                }
                var json = {
                    'alasanbatalclosing': $scope.item.batalClosing,
                    'noregistrasi': $scope.dataPasienSelected.noRegistrasi,
                    'close': false
                }
                medifirstService.post('tatarekening/save-selesai-transaksi', json).then(function (e) {
                    var objverif = {
                        "noregistrasi": $scope.dataPasienSelected.noRegistrasi,
                        "pegawaiverif": dataLogin.id,
                    };
                    // medifirstService.post('remunerasi/delete-jasapelayanandokter',objverif).then(function(e){ 

                    // })
                    if (e.status === 201) {
                        medifirstService.post('tatarekening/save-log-unclosing', json).then(function (e) {

                        })
                    }
                })
                $scope.popUpUnclosing.close()
            }

            $scope.rekapTagihan = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                var obj = {
                    noRegistrasi: $scope.dataPasienSelected.noRegistrasi
                }

                $state.go('RekapTagihan', {
                    dataPasien: JSON.stringify(obj)
                });
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatRupiah2 = function (value, currency) {
                return currency + "Rp. " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.columnGrid = [{
                "field": "no",
                "title": "No",
                "width": "45px",
            },
            {
                "field": "tglstruk",
                "title": "Tgl Struk",
                "width": "80px",
                "template": "<span class='style-right'>{{formatTanggal('#: tglstruk #', '')}}</span>"
            },
            {
                "field": "nostruk",
                "title": "No Verifikasi",
                "width": "80px"
            },
            {
                "field": "petugasverif",
                "title": "Petugas Verifikasi",
                "width": "120px"
            },
            {
                "field": "totalharusdibayar",
                "title": "Total Harus Bayar",
                "width": "110px",
                "template": "<span class='style-right'>{{formatRupiah('#: totalharusdibayar #', 'Rp.')}}</span>",
            },
            {
                "field": "status",
                "title": "Status Bayar",
                "width": "100px",
            }
            ];

            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1
                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "45px",
                    },
                    {
                        "field": "tglsbm",
                        "title": "Tgl Bayar",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatTanggal('#: tglsbm #', '')}}</span>"
                    },
                    {
                        "field": "nosbm",
                        "title": "No Bukti Pembayaran",
                        "width": "120px",
                    },
                    {
                        "field": "carabayar",
                        "title": "Cara Bayar",
                        "width": "100px",
                    },
                    {
                        "field": "totaldibayar",
                        "title": "Total Bayar",
                        "width": "100px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totaldibayar #', 'Rp.')}}</span>",
                    },
                    {
                        "field": "kasir",
                        "title": "Petugas Kasir",
                        "width": "120px"
                    }
                    ]
                }
            };

            function LoadDataDetailVerif() {
                var NoReg = ''
                if ($scope.NoregDetail != undefined) {
                    NoReg = $scope.NoregDetail
                }
                medifirstService.get("tatarekening/get-data-detail-verifikasi?noRegistrasi=" + NoReg).then(function (data) {
                    $scope.isRouteLoading = false;
                    var data = data.data.data
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        element.no = i + 1;
                    }
                    $scope.dataGrid = new kendo.data.DataSource({
                        data: data,
                        pageSize: 200,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });

                });
            }

            $scope.DetailVerif = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.NoregDetail = $scope.dataPasienSelected.noRegistrasi;
                $scope.dataGrid = new kendo.data.DataSource({
                    data: [],
                });
                LoadDataDetailVerif();
                $scope.detailVerifikasi.center().open();
            }

            $scope.klikGrid = function (dataSelected) {
                if (dataSelected != undefined) {
                    $scope.dataSelected = dataSelected
                }
            }

            $scope.Batal = function () {
                $scope.dataGrid = new kendo.data.DataSource({
                    data: [],
                });
                $scope.detailVerifikasi.close();
            }
            $scope.BayarDeposit = function () {
                $scope.changePage("PenyetoranDepositKasir");
            }

            $scope.verifikasiBerkas = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                var massageConfirm = 'Nomor Registrasi Ini Akan Di VERIFIKASI Berkas Untuk Keperluan Jasa Pelayanan,'
                let close = true
                if($scope.dataPasienSelected.tglverifikasiberkas!=null){
                    massageConfirm = 'Nomor Registrasi Ini Akan Di UNVERIFIKASI Berkas Untuk Keperluan Jasa Pelayanan,'
                    close = false
                }
                    
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Peringatan, '+ massageConfirm + '\n' + 'Apakah anda tetap akan menlanjutkan ?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    debugger;
                    var json = {
                        'noregistrasi': $scope.dataPasienSelected.noRegistrasi,
                        'close': close,
                    }
                    debugger;
                    medifirstService.post('tatarekening/save-verifikasi-berkas', json).then(function (e) {
                        if (e.status === 201) {
                           
                        }
                    })
                })
            }

            $scope.unVerifikasi = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                if ($scope.dataSelected.noverifikasi != undefined) {
                    toastr.error('Sudah dalam penagihan piutang, tidak bisa di Unverifikasi!')
                    return
                }

                if ($scope.dataSelected.nosbmlastfk != undefined) {
                    toastr.error('Data Sudah Dibayar, tidak bisa di Unverifikasi!')
                    return
                }

                var objSave = {
                    'noregistrasi': $scope.dataSelected.noregistrasi,
                    'norec_sp': $scope.dataSelected.norec
                }

                medifirstService.post('tatarekening/batal-verifikasi-tagihan', objSave).then(function (data) {
                    var objverif = {
                        "pegawaiverif": dataLogin.id,
                        "noregistrasi": $scope.dataSelected.noregistrasi
                    };
                    // medifirstService.post('remunerasi/delete-jasapelayanandokter',objverif).then(function(e){
                    //          // LoadData();          
                    //    })
                    var datas = data.data.data[0];
                    $scope.NoregDetail = datas.noregistrasi;
                    medifirstService.postLogging('Unverifikasi TataRekening', 'norec strukpelayanan_t', datas.norec,
                        'Unverifikasi TataRekening Pada Pasien Dengan Noregistrasi : ' + datas.noregistrasi + ' dengan No Verifikasi : ' + datas.nostruk).then(function (res) {
                            LoadDataDetailVerif();
                        })
                })
            }

            $scope.saveLogUnverif = function () {
                var objSave = {
                    "noregistrasi": $scope.dataPasienSelected.noRegistrasi
                }
                medifirstService.post('tatarekening/save-log-unverifikasi-tarek', objSave).then(function (e) { })
            }
            $scope.sidopak = function () {
                debugger
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Data Belum Dipilih !')
                    return
                }
                medifirstService.get('rawatinap/get-data-for-sidopak?noregistrasi=' + $scope.dataPasienSelected.noRegistrasi).then(function (dat) {
                    if (dat.data.length > 0) {
                        var arrStr = {
                            0: dat.data[0].nocm,
                            1: dat.data[0].namapasien,
                            2: dat.data[0].jeniskelamin,
                            3: dat.data[0].noregistrasi,
                            5: dat.data[0].kelompokpasien,
                            6: dat.data[0].tglregistrasi,
                            7: dat.data[0].norec_apd,
                            8: dat.data[0].norec,
                            11: dat.data[0].idruangan,
                            12: dat.data[0].namaruangan
                        }
                        cacheHelper.set('cacheRekamMedis', arrStr);
                        if (dat.data[0].objectdepartemenfk == 16 || dat.data[0].objectdepartemenfk == 25) {
                            $state.go('RekamMedis.ResumeRI', {
                                noRec: dat.data[0].norec_apd
                            })
                        } else {
                            $state.go('RekamMedis.ResumeRJ', {
                                noRec: dat.data[0].norec_apd
                            })
                        }
                    } else {
                        toastr.error('Gagal Mendapatkan Data ! Coba Lagi !')
                        return;
                    }
                })
            }
            $scope.CetakRincianBilling = function () {
                medifirstService.get("tatarekening/get-data-login?noRegistrasi=" + $scope.dataPasienSelected.noRegistras).then(function (e) {

                    dataLogin = e.data.datalogin;

                    // var billing = "Rp " + parseFloat($scope.item.billing).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    var deposit = "Rp " + parseFloat(e.data.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    $scope.isRouteLoading = true;
                    var y = ''


                    medifirstService.get("tatarekening/detail-tagihan/" + $scope.dataPasienSelected.noRegistrasi + '?jenisdata=bill' + y + '&norecverifikasi=' + $scope.dataSelected.norec).then(function (dat) {
                        for (var i = 0; i < dat.data.details.length; i++) {
                            if (dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
                                if (dat.data.details[i].norec != null) {
                                    alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' + dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' + dat.data.details[i].tglPelayanan)
                                    return
                                }
                            }
                        }
                        var billing = "Rp " + parseFloat($scope.dataSelected.totalharusdibayar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        var deposit = "Rp " + parseFloat(dat.data.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        var totalDiskon = "Rp " + parseFloat(0).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        var terbilang = dat.data.terbilangtotalBillingNonDiskon
                        medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                            var kelas = dat.data.kelasRawat;
                            var sisa = "Rp 0,00";
                            var bayar = "Rp " + parseFloat(dat.data.dibayar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            if (bayar == "Rp NaN") {
                                bayar = "Rp 0,00";
                            }
                            if ($scope.item.jenisPasien == "BPJS") {
                                kelas = $scope.item.kelasPenjamin
                                bayar = "Rp " + parseFloat($scope.item.sudahbayar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                                // bayar = "0"
                            }
                            if (dat.data.deposit > 0) {
                                billing = parseFloat(billing) - parseFloat(dat.data.deposit);
                                var sisa = parseFloat($scope.item.bayar) + dat.data.deposit;

                                sisa = sisa - parseFloat($scope.item.billing);
                                // sisa = dat.data.deposit - parseFloat($scope.item.bayar)
                                if (sisa < 0) {
                                    sisa = "Rp " + parseFloat(sisa).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                                } else {
                                    sisa = "RP 0,00";
                                }
                            }
                            var nosep = "-";
                            if ($scope.item.nosep != "" && $scope.item.nosep != null) {
                                nosep = $scope.item.nosep
                            }
                            var x = "";

                            x = " noregistrasi='" + $scope.dataPasienSelected.noRegistrasi + "'and '" + $scope.dataSelected.norec + " and tglpelayanan is not null and namaproduk not in ('Biaya Administrasi','Biaya Materai') order by jenisproduk,ruangantindakan,tglpelayanan,namaproduk"


                            var data = {
                                "gambarLogo": "logodokkes.jpg",
                                "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "nocm", "namapasien", "lastruangan", "namakamar", "kelas", "jmlbiaya", "deposit", "sisa", "isi", "terbilang", "bayar", "nosep", "where", "totalDiskon"],
                                "paramValue": ["RSUD Sumedang", "1980-12-25 00:00:00", "Jl. Palasari No.80, Kotakulon, Kec. Sumedang Selatan, Kabupaten Sumedang, Jawa Barat 45311", dataLogin.userData.namauser.toString(), $scope.dataPasienSelected.noRegistrasi,
                                    $scope.dataPasienSelected.noCm, $scope.dataPasienSelected.namaPasien, $scope.dataPasienSelected.namaRuangan, $scope.item.namakamar, kelas, billing, deposit, sisa, $scope.item.isi, terbilang, bayar, nosep, x, totalDiskon
                                ],
                                "paramType": ["", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                            };

                            var xhr = new XMLHttpRequest();
                            xhr.onreadystatechange = function () {
                                if (this.readyState == 4 && this.status == 200) {
                                    //this.response is what you're looking for
                                    // handler(this.response);
                                    console.log(this.response, typeof this.response);
                                    //var res = this.response
                                    //var file = new Blob( [res], {type: 'application/pdf'});
                                    var url = window.URL.createObjectURL(this.response)
                                    var pdf = document.getElementById('tempatLaporan');
                                    pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                                    var win = window.open(url, '_blank');
                                    win.focus();
                                }
                            }
                            if ($scope.item.jenisPasien == "BPJS") {

                                if (window.location.hostname.indexOf('localhost') > -1) {
                                    xhr.open('POST', '/jasper1/generic/report/rincianbillingpernoverif.pdf');
                                } else {
                                    xhr.open('POST', '/jasper1/generic/report/rincianbillingpernoverif.pdf');
                                }
                            } else if ($scope.item.jenisPasien == "Umum/Pribadi") {

                                if (window.location.hostname.indexOf('localhost') > -1) {
                                    xhr.open('POST', '/jasper1/generic/report/rincianbillingpernoverif.pdf');
                                } else {
                                    xhr.open('POST', '/jasper1/generic/report/rincianbillingpernoverif.pdf');
                                }
                            } else {

                                if (window.location.hostname.indexOf('localhost') > -1) {
                                    xhr.open('POST', '/jasper1/generic/report/rincianbillingpernoverif.pdf');
                                } else {
                                    xhr.open('POST', '/jasper1/generic/report/rincianbillingpernoverif.pdf');
                                }
                            }
                            // set `Content-Type` header
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                            xhr.responseType = 'blob';
                            // send rquest with JSON payload
                            xhr.send(JSON.stringify(data));
                            $scope.isRouteLoading = false;
                        })
                    })
                });
            }

            $scope.spPembiayaan = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error('Pilih data dulu dong sayang')
                    return
                } else {
                    medifirstService.get("tatarekening/before-sp-pembiayaan-print/" + $scope.dataPasienSelected.noRegistrasi)
                    .then((data) => {
                        console.log(data.data);
                        $scope.item.penanggungjawab = data.data.penanggungjawab;
                        $scope.item.noteleponpj = data.data.noteleponpj;
                        $scope.item.hubungankeluargapj = data.data.hubunganpj;
                        $scope.item.alamatpj = data.data.alamatpj;
                        $scope.item.umurpj = data.data.umurpj;
                        $scope.item.namapasien = data.data.namaPasien;
                        $scope.item.noCm = data.data.noCm;
                        $scope.item.alamatpasien = data.data.alamat;
                        $scope.item.totaltagihan = parseInt(data.data.billing);
                        $scope.item.sudahdibayar = parseInt(data.data.sudahbayar);
                        $scope.item.sisatagihan = parseInt(data.data.billing) - parseInt(data.data.sudahbayar);
                        $scope.spPembayaran.center().open();
                    });
                }
            }

            $scope.BatalCetakSpPenyelesaian = function () {
                $scope.dataGrid = new kendo.data.DataSource({
                    data: [],
                });
                $scope.spPembayaran.close();
            }

            $scope.updatePj = () => {
                const requestData = {
                    noCm: $scope.item.noCm,
                    penanggungjawab: $scope.item.penanggungjawab,
                    umurpj: $scope.item.umurpj,
                    noteleponpj: $scope.item.noteleponpj,
                    hubungankeluargapj: $scope.item.hubungankeluargapj,
                    alamatpj: $scope.item.alamatpj
                };
                console.log(requestData);
                medifirstService.post('tatarekening/update-penanggung-jawab', requestData)
                .then((data) => {
                    console.log(data.data);
                    alert(data.data.message);
                });
            }

            $scope.cetakSpPembayaran = () => {
                if ($scope.item.tanggalJatuhTempo == null) {
                    toastr.error('Pilih tanggal jatuh temponya dulu dong sayang')
                    return
                }

                const data = [
                        $scope.item.penanggungjawab,
                        $scope.item.umurpj,
                        $scope.item.noteleponpj,
                        $scope.item.hubungankeluargapj,
                        $scope.item.alamatpj,
                        $scope.item.namapasien,
                        $scope.item.noCm,
                        $scope.item.alamatpasien,
                        $scope.item.totaltagihan.toString(),
                        $scope.item.sudahdibayar.toString(),
                        $scope.item.sisatagihan.toString(),
                        $scope.item.tanggalJatuhTempo.toLocaleDateString()
                    ];

                    for (let i = 0; i < data.length; i++) {
                        if(data[i] == null || data[i] == "NaN") {
                            data[i] = "-";
                        }
                    }

                    console.log(data);

                const parameter = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey" : [
                        'namaRs',
                        'alamatRs',
                        'penanggungjawab',
                        'umurpj',
                        'teleponpenanggungjawab',
                        'hubungankeluargapj',
                        'alamatpj',
                        'namapasien',
                        'nocm',
                        'alamatlengkap',
                        'tagihan',
                        'dibayar',
                        'sisa',
                        'jtTempo'
                    ],
                    'paramValue': [
                        'RUMAH SAKIT UMUM DAERAH SUMEDANG',
                        'Jl. Palasari No.80, Kotakulon, Kec. Sumedang Sel, Kabupaten Sumedang, Jawa Barat 45311',
                        data[0],
                        data[1],
                        data[2],
                        data[3],
                        data[4],
                        data[5],
                        data[6],
                        data[7],
                        data[8],
                        data[9],
                        data[10],
                        data[11],
                    ],
                    'paramType' : ["", "", "","", "", "","", "", "","", "", "","",""]                 
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
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/sppembayaran.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1000/generic/report/sppembayaran.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/sppembayaran.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1000/generic/report/sppembayaran.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/sppembayaran.pdf');
                } else {
                    xhr.open('POST', '/jasper1/generic/report/sppembayaran.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(parameter));

                console.log(parameter);
            }

            $scope.berkasBelum = {
                pageable: true,
                scrollable: true,
                columns: [
                    {
                        field: "no",
                        title: "No",
                        width: 40
                    },
                    {
                        field: "tanggalBelum",
                        title: "Tanggal",
                        width: 100
                    },
                    {
                        field: "jumlahBelum",
                        title: "Jumlah",
                        width: 100
                    }
                ],
            };

            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis + "&referensi=" + referensi + "&noreff=" + noreff + "&keterangan=" + ket).then(function (data) {});
            };
            $scope.tagihanClosing = function (data) {
                if (data == undefined) {
                alert("Pilih Satu Data Yang Mau di tutup faktur nya !!!");
                return;
                }
                $scope.noRegDipilih = data.noRegistrasi;
                var y = "";
                if ($scope.item.cetakx == undefined) {
                y = "";
                } else if ($scope.item.cetakx == "sudah") {
                y = "&cetakx=sudah";
                } else if ($scope.item.cetakx == "belum") {
                y = "&cetakx=belum";
                }
                medifirstService.get("tatarekening/detail-tagihan/" + data.noRegistrasi + "?jenisdata=bill" + y).then(function (dat) {
                for (var i = 0; i < dat.data.details.length; i++) {
                    if (dat.data.details[i].dokter == "" || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
                    if (dat.data.details[i].norec != null) {
                        alert(
                        "data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!" +
                            "pelayanan :" +
                            dat.data.details[i].namaPelayanan +
                            "ruangan :" +
                            dat.data.details[i].ruanganTindakan +
                            "tgl.peelayanan :" +
                            dat.data.details[i].tglPelayanan
                        );
                        return;
                    }
                    }
                }
                if (data.deptid == 16) {
                    $scope.popUpclosing.center().open();
                    $scope.closingTagihan(data.noRegDipilih);
                    
                } else {
                    var stt = "false";
                    if (confirm("Pasien yang sudah ditutup Faktur tidak bisa mendapat tindakan lagi. \nApakah Anda Yakin Ingin Menutup Faktur? ")) {
                    // Save it!
                    stt = "true";
                    } else {
                    // Do nothing!
                    stt = "false";
                    }

                    if (stt == "true") {
                    $scope.closingTagihan(data.noRegDipilih);
                    }
                }
                });
            };

            $scope.closingTagihan = function (noRegistrasi) {
                if ($scope.item.password != " ") {
                    toastr.error("Password Salah!");
                    return;
                }
                noRegistrasi = noRegistrasi || $scope.noRegDipilih;
                var json = {
                    noregistrasi: noRegistrasi,
                    close: true,
                };
                var pegawai = medifirstService.getPegawaiLogin().namaLengkap
                medifirstService.post("tatarekening/save-selesai-transaksi-faktur", json).then(function (e) {
                    if (e.status === 201) {
                    medifirstService.post("tatarekening/save-log-closing-faktur", json).then(function (e) {
                        $scope.saveLogging("Tutup Faktur", "No registrasi pasien tutup faktur", noRegistrasi, "Tutup Faktur pasien noreg " + noRegistrasi + " Oleh " + pegawai);
                        LoadCache();
                    });
                    }
                });
            };

            $scope.popUpKlaimBPJS = function () {
                $scope.popUpDateKlaimBPJS.center().open()
            }

            $scope.batalTarikKlaimBPJS = function () {
                $scope.popUpDateKlaimBPJS.close()
            }

            $scope.tarikInformasiKlaimBPJS = function () {

                $scope.popUpDateKlaimBPJS.close();

                const tglFrom = new Date($scope.item.tglsepfrom);
                const tglUntil = new Date($scope.item.tglsepuntil);

                const totalDays =
                    Math.ceil((tglUntil - tglFrom) / 86400000) + 1;

                // RJ (3 status) + RI (3 status)
                const totalCalls = totalDays * 6;
                let completedCalls = 0;

                $scope.statusPenarikanData =
                    'Proses Penarikan Data Klaim RJ & RI';

                const elem = document.getElementById('myBar');
                if (elem) {
                    elem.style.width = '0%';
                    elem.innerHTML = '0%';
                }

                function updateProgress() {
                    if (!elem) return;
                    const width = (completedCalls / totalCalls) * 100;
                    elem.style.width = width + '%';
                    elem.innerHTML = Math.round(width) + '%';
                }

                // =============================
                // EKSEKUSI UTAMA
                // =============================
                tarikPerJenis(2)   // RJ
                    .then(() => tarikPerJenis(1)); // RI

                // =============================
                // FUNGSI GENERIK
                // =============================
                function tarikPerJenis(jenisPelayanan) {

                    // status: 3 → 2 → 1
                    return tarikPerStatus(jenisPelayanan, 3)
                        .then(() => tarikPerStatus(jenisPelayanan, 2))
                        .then(() => tarikPerStatus(jenisPelayanan, 1));
                }

                function tarikPerStatus(jenisPelayanan, status) {
                    return new Promise((resolve, reject) => {

                        let current = new Date(tglFrom);

                        function nextDay() {
                            if (current > tglUntil) {
                                resolve();
                                return;
                            }

                            const tgl =
                                current.getFullYear() + '-' +
                                String(current.getMonth() + 1).padStart(2, '0') + '-' +
                                String(current.getDate()).padStart(2, '0');

                            medifirstService.get(
                                'bridging/bpjs2/get-monitoring-klaim-per-bulan' +
                                '?tglsep=' + tgl +
                                '&jenispelayanan=' + jenisPelayanan +
                                '&status=' + status
                            ).then(function (data) {
                               if (data.data.metaData.code == 200) {
                                    var ds = $scope.dataPasienPulang;
                                    var items = ds.data();

                                    for (var b = 0; b < data.data.response.klaim.length; b++) {
                                        var klaim = data.data.response.klaim[b];

                                        var row = items.find(x => x.nosep === klaim.noSEP);
                                        if (row) {
                                            row.set("statusclaim", klaim.status);
                                            // row.set("byTarifRS", klaim.biaya.byTarifRS);
                                            row.set("byPengajuan", klaim.biaya.byPengajuan);
                                            row.set("bySetujui", klaim.biaya.bySetujui);
                                        }

                                        console.log(
                                            'BPJS:', klaim.noSEP,
                                            'GRID:', items.map(x => x.nosep)
                                        );                                      
                                    }

                                    $scope.$applyAsync();
                                }

                                completedCalls++;
                                updateProgress();

                                current.setDate(current.getDate() + 1);
                                nextDay();

                            }, reject);
                        }

                        nextDay();
                    });
                }
            };



            //** BATAS SUCI */
        }
    ]);
});