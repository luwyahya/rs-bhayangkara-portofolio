define(["initialize"], function (initialize) {
  "use strict";

  initialize.controller("AsesmenEdukasiCtrl", [
    "$mdDialog",
    "$q",
    "$rootScope",
    "$scope",
    "ModelItem",
    "$state",
    "CacheHelper",
    "DateHelper",
    "MedifirstService",
    function ($mdDialog, $q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
      $scope.item = {};
      $scope.user = {};
      $scope.noCM = $state.params.noCM;
      $scope.tombolSimpanVis = true;
      $scope.isCetak = true;
      $scope.isKembali = true;
      $scope.noRecPap = cacheHelper.get("noRecPap");
      $scope.totalSkor = 0;
      $scope.totalSkor2 = 0;
      $scope.cc = {};
      var nomorEMR = "-";
      var nomorEMRSS = "";
      var paramSearch = "";
      $scope.isAdmin = false
      $scope.item.qrnama = ''
      $scope.isSave = true;
      $scope.isUpdate = false;
      $scope.isUpdateCetak = false;

      //inisialisasi untuk id emr pada pengkajian medis pasien ctrl
      $scope.cc.emrfk = 2107;

      $scope.now = new Date();
      var dataLoad = [];
      $scope.listData1 = [];
      $scope.listData2 = [];
      $scope.listData3 = [];
      $scope.item.objcbo = [];
      $scope.dataSource = [];
      $scope.item.obj = [];
      $scope.item.obj2 = [];
      $scope.item.image = "../app/images/svg/no-image.svg";
      $scope.InputLab = true;
      $scope.InputRadiologi = true;
      $scope.InputObat = true;

      //UNTUK KOMUNIKASI PARENT DENGAN CHILD
      $scope.tipemodul = "asesmenedukasi";

      var lanjut = false;
      LoadCacheHelper();
      function LoadCacheHelper() {
        var chacePeriode = cacheHelper.get("cacheRMelektronik");
        if (chacePeriode != undefined) {
          $scope.cc.nocm = chacePeriode[0];
          $scope.cc.namapasien = chacePeriode[1];
          $scope.cc.jeniskelamin = chacePeriode[2];
          $scope.cc.noregistrasi = chacePeriode[3];
          $scope.cc.umur = chacePeriode[4];
          $scope.cc.kelompokpasien = chacePeriode[5];
          $scope.cc.tglregistrasi = chacePeriode[6];
          $scope.cc.norec = chacePeriode[7];
          $scope.cc.norec_pd = chacePeriode[8];
          $scope.cc.objectkelasfk = chacePeriode[9];
          $scope.cc.namakelas = chacePeriode[10];
          $scope.cc.objectruanganfk = chacePeriode[11];
          $scope.cc.namaruangan = chacePeriode[12];
          $scope.cc.DataNoregis = chacePeriode[13];
          $scope.cc.tglLahir = chacePeriode[14];
          $scope.cc.namadpjp = chacePeriode[16];
          $scope.cc.pgId = chacePeriode[17];
          $scope.cc.alamat = chacePeriode[15];
          $scope.cc.nohp = chacePeriode[35];
          $scope.cc.namaibu = chacePeriode[36];
          $scope.cc.namaayah = chacePeriode[37];
          $scope.cc.ruangakakhir = chacePeriode[24];
          $scope.cc.norec_emr = "-";
          $scope.cc.jenisemr = "asesmenedukasi";
          paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;
          $scope.item.obj[1901309125] = moment($scope.now).format("YYYY-MM-DD HH:mm");
          $scope.item.obj[1901309182] = moment($scope.now).format("YYYY-MM-DD HH:mm");
          
          init();
        }
        if (medifirstService.getKelompokUser() == 'admin' || medifirstService.getKelompokUser() == 'operator') {
          $scope.isAdmin = true
        }
      }
      var chekedd = false;

      function init() {
        $scope.isLoading = true;

        medifirstService.get("emr/get-riwayat-transfer-internal?noregistrasi=" + $scope.cc.noregistrasi, true).then(function(dat) {
                $scope.isRouteLoading = false;                        
                let data = dat.data
                for(let i = 0; i < data.length; i++) {
                    data[i].no = i + 1;
                }
                $scope.dataRiwayatpengkajianawalmpp = new kendo.data.DataSource({
                    data: data,
                    schema: {
                        model: {
                        }
                    },
                    pageSize: 10,
                    total: data.length,
                    serverPaging: false,
                   
                });  
            })
        $scope.item.obj = [];
        $scope.item.obj2 = [];
        $scope.item.obj[1147] = moment($scope.cc.tglregistrasi).format("YYYY-MM-DD HH:mm");
        $scope.item.obj[1901309353] = $scope.cc.namapasien;
        $scope.item.obj[1901309354] = $scope.cc.nocm;
        $scope.item.obj[1901309355] = $scope.cc.tglLahir;
        $scope.item.obj[1901309342] = $scope.cc.alamat;
        $scope.item.obj[1901309347] = { id: $scope.cc.pgId, namalengkap: $scope.cc.namadpjp }
        $scope.item.obj[1901309361] = { id: $scope.cc.pgId, namalengkap: $scope.cc.namadpjp }
        if ($scope.cc.jeniskelamin == "LAKI-LAKI") {
          $scope.item.obj[1901309339] = true;
          $scope.item.obj[1901309340] = false;
        } else {
          $scope.item.obj[1901309339] = false;
          $scope.item.obj[1901309340] = true;
        }
        paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;
        getPenunjang('noregistrasi=' + $scope.cc.noregistrasi);

        medifirstService.get("emr/get-combo").then(function (data) {
          $scope.listPegawai = data.data.pegawai;
          $scope.listRuangan = data.data.ruangan;
        });
        medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=asesmenedukasi", true).then(function (dat) {
          $scope.isRouteLoading = false;
          nomorEMRSS = "";
          if (dat.data.data.length > 0) {
            for (let i = 0; i < dat.data.data.length; i++) {
              if (dat.data.data[i].jenisemr == "asesmenedukasi") {
                lanjut = true;
              }
            }
            if (lanjut == true) {
              $scope.isSave = false;
              $scope.isUpdate = true;
              $scope.isUpdateCetak = true;
              $scope.cc.noemr = dat.data.data[0].noemr;
              $scope.cc.norec_emr = dat.data.data[0].noemr;
              nomorEMRSS = dat.data.data[0].noemr;
              nomorEMR = nomorEMRSS;
              $scope.cc.emrfk = 2107;
              setobjectToModel(nomorEMRSS, $scope.cc.emrfk);
            }
          } else {
            $scope.item.obj[1901304997] = $scope.cc.nocm;
            $scope.item.obj[1901304998] = $scope.cc.namapasien;
            $scope.item.obj[1901304999] = $scope.cc.tglLahir;
            $scope.item.obj[1901305003] = $scope.cc.kelompokpasien;
            $scope.item.obj[1901305000] = $scope.cc.namaruangan;
            $scope.item.obj[1901305011] = $scope.cc.ruangakakhir;
            $scope.item.obj[1901305094] = { id: $scope.cc.pgId, namalengkap: $scope.cc.namadpjp };
            if ($scope.cc.jeniskelamin == "LAKI-LAKI") {
                $scope.item.obj[1901305001] = true;
                $scope.item.obj[1901305002] = false;
            } else {
                $scope.item.obj[1901305001] = false;
                $scope.item.obj[1901305002] = true;
            }

            valueOtomatis();
            getValueSPRI();
            loadOrderPenunjang();
            loadOrderFarmasi(); // Fungsi ini sekarang kosong agar tidak memanggil API
          }
        });
        $scope.isLoading = false;
      }

function setobjectToModel(nomorEMRSS, emrfk) {
  let namaPegawai2 = "";

  $scope.item.obj = {}; 
  $scope.item.obj2 = {};
  $scope.user.poto = null;

  medifirstService.get("emr/get-emr-transaksi-detail-new?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
    $scope.isLoading = false;
    var dataLoad = dat.data.data;

    for (var i = 0; i <= dataLoad.length - 1; i++) {
      var itemData = dataLoad[i];

      if (parseFloat($scope.cc.emrfk) == itemData.emrfk) {
        var emrdfkStr = itemData.emrdfk.toString();
        var val = itemData.value;

        if (val !== null && val !== undefined && val !== "") {

          // A. PETUGAS COMBOBOX (ID: 1901310748) ATAU VALUE BERFORMAT ID~NAMA
          if (emrdfkStr === "1901310748" || (typeof val === "string" && val.includes("~"))) {
            var res = val.split("~");
            $scope.item.obj[itemData.emrdfk] = { 
              id: res[0], 
              namalengkap: res[1] || res[0],
              text: res[1] || res[0]
            };
            namaPegawai2 = res[0]; // simpan ID untuk QR jika ada
          }

          // B. DATEPICKER TANGGAL (ID: 1901310747)
          else if (emrdfkStr === "1901310747" || itemData.type === "datetime" || itemData.type === "date") {
            var cleanDate = val.replace(/\"/g, ""); // Hilangkan kutip ganda jika ada
            $scope.item.obj[itemData.emrdfk] = new Date(cleanDate);
          }

          // C. CHECKBOX (Sesuai elemen checkbox di HTML)
          else if (itemData.type === "checkbox") {
            $scope.item.obj[itemData.emrdfk] = (val === "1" || val === true || val === "true");
          }

          // D. TEXTBOX BIASA (Bahasa Daerah/Lainnya, Alasan Tidak, dll)
          else {
            $scope.item.obj[itemData.emrdfk] = val;
          }

        }
      }
    }

    // Generate QR Code untuk Petugas jika dibutuhkan
    if (namaPegawai2) {
      medifirstService.get("report/create-qr?namaPegawai=" + encodeURIComponent(namaPegawai2))
        .then(function (et) { 
          $scope.item.qr2 = et.data.data; 
        })
        .catch(function (err) { 
          console.error("QR Error:", err); 
        });
    }

  });
}

      $scope.kembali = function () {
        $rootScope.showRiwayat();
      };

    //   $scope.Save = function () {
    //     var confirm = $mdDialog.confirm().title("Konfirmasi").textContent("Apakah Anda yakin akan menyimpan data?").ariaLabel("Lucky day").cancel("Tidak").ok("Ya");
    //     $mdDialog.show(confirm).then(function () {
    //       $scope.Saveok();
    //     });
    //   };

    //   $scope.Saveok = function () {
    //     $scope.isUpdateCetak = false;
    //     $scope.isLoading = true;
    //     var photo = "";
    //     kendo.drawing
    //       .drawDOM($(".surface"))
    //       .then(function (group) {
    //         return kendo.drawing.exportImage(group);
    //       })
    //       .done(function (data) {
    //         photo = data;
    //       });

    //     $scope.item.obj[1239] = moment($scope.item.obj[1239]).format("YYYY-MM-DD");
    //     var idComboDokterInt = [
    //         1901310748, 1901309347, 1901309350, 1901309359, 
    //     ];
    //     var arrobj = Object.keys($scope.item.obj);
    //     var arrSave = [];
        
    //     for (let i = arrobj.length - 1; i >= 0; i--) {
    //             if ($scope.item.obj[parseInt(arrobj[i])] != undefined && $scope.item.obj[parseInt(arrobj[i])] !== "") {
    //                 if (idComboDokterInt.indexOf(parseInt(arrobj[i])) !== -1) {
    //                     arrSave.push({ 
    //                         id: arrobj[i], 
    //                         values: $scope.item.obj[parseInt(arrobj[i])].id  + '~' + $scope.item.obj[parseInt(arrobj[i])].namalengkap 
    //                     });
    //                 } else if (arrobj[i] == 1901304995 ) {
    //                     arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].id  + '~' + $scope.item.obj[parseInt(arrobj[i])].namaruangan })
    //                 } else if (arrobj[i] == 1901309146) {
    //                   arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text });
    //                 } else if (arrobj[i] == 1901309674 || arrobj[i] == 1901309626 || arrobj[i] == 1901309627) {
    //                     arrSave.push({ id: arrobj[i], values: moment($scope.item.obj[parseInt(arrobj[i])]).format("HH:mm") })
    //                 } else {
    //                     arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
    //                 }
    //             }
    //         }
            
    //     $scope.cc.jenisemr = "asesmenedukasi";
    //     var jsonSave = {
    //       head: $scope.cc,
    //       data: arrSave,
    //       image: $scope.item.image != undefined && $scope.item.image != "../app/images/svg/no-image.svg" ? $scope.item.image : null,
    //     };
    //     medifirstService.post("emr/save-emr-dinamis", jsonSave).then(function (e) {
    //       $scope.isSave = false;
    //       $scope.isUpdate = true;
    //       $scope.isUpdateCetak = true;
    //       $scope.noemr = e.data.data.noemr;
    //       medifirstService.postLogging("EMR", "norec emrpasien_t", e.data.data.norec, "Formulir Skrinning " + " dengan No EMR - " + e.data.data.noemr + " pada No Registrasi " + $scope.cc.noregistrasi).then(function (res) {
    //         var arrStr = {
    //           0: $scope.noemr,
    //         };
    //         cacheHelper.set("cacheNomorEMR", arrStr);
    //         LoadCacheHelper();
    //         $scope.isLoading = false;
    //       });
    //     });
    //   };

    
    $scope.Save = function () {
    var confirm = $mdDialog
        .confirm()
        .title("Konfirmasi")
        .textContent("Apakah Anda yakin akan menyimpan data?")
        .ariaLabel("Lucky day")
        .cancel("Tidak")
        .ok("Ya");

    $mdDialog.show(confirm).then(function () {
        $scope.Saveok();
    });
    };

        $scope.Saveok = function () {
        $scope.isUpdateCetak = false;
        $scope.isLoading = true;

        // 1. Ekspor Canvas / Surface
        var photo = "";
        kendo.drawing
            .drawDOM($(".surface"))
            .then(function (group) {
            return kendo.drawing.exportImage(group);
            })
            .done(function (data) {
            photo = data;
            });

        var photo2 = "";
        kendo.drawing
            .drawDOM($(".surface2"))
            .then(function (group) {
            return kendo.drawing.exportImage(group);
            })
            .done(function (data2) {
            photo2 = data2;
            });

        // 2. Daftar ID Khusus
        var idComboDokterInt = [1901310748]; // Combobox Petugas
        var arrobj = Object.keys($scope.item.obj);
        var arrSave = [];

        for (let i = arrobj.length - 1; i >= 0; i--) {
            var currentId = parseInt(arrobj[i]);
            var currentValue = $scope.item.obj[currentId];

            if (currentValue !== undefined && currentValue !== null && currentValue !== "") {
            var formattedValue = "";

            // A. Jika Combobox Petugas (ID: 1901310748)
            if (idComboDokterInt.indexOf(currentId) !== -1) {
                if (typeof currentValue === "object") {
                formattedValue = (currentValue.id || "") + "~" + (currentValue.namalengkap || currentValue.text || "");
                } else {
                formattedValue = currentValue;
                }
            } 
            // B. Jika Datepicker Tanggal (ID: 1901310747)
            else if (currentId == 1901310747) {
                formattedValue = moment(currentValue).format("YYYY-MM-DD HH:mm");
            } 
            // C. Proteksi Objek Lain (Jika ada combobox tersembunyi/lainnya)
            else if (typeof currentValue === "object") {
                var valId = currentValue.id || currentValue.value || "";
                var valText = currentValue.namalengkap || currentValue.text || "";
                formattedValue = valId && valText ? valId + "~" + valText : valId || valText;
            } 
            // D. Checkbox & Textbox Biasa
            else {
                formattedValue = currentValue;
            }

            arrSave.push({
                id: arrobj[i],
                values: formattedValue,
            });
            }
        }

        // Push foto jika ada
        arrSave.push({ id: "2421", values: photo });
        arrSave.push({ id: "2422", values: photo2 });

        $scope.cc.jenisemr = "asesmenedukasi";

        var jsonSave = {
            head: $scope.cc,
            data: arrSave,
            image: $scope.item.image != undefined && $scope.item.image != "../app/images/svg/no-image.svg" ? $scope.item.image : null,
        };

        medifirstService.post("emr/save-emr-new", jsonSave).then(function (e) {
            $scope.isSave = false;
            $scope.isUpdate = true;
            $scope.isUpdateCetak = true;

            nomorEMR = e.data.data.noemr;
            $scope.noemr = e.data.data.noemr;
            $scope.cc.norec_emr = e.data.data.noemr;

            // Logging EMR
            var jsonLog = {
            jenislog: "EMR",
            referensi: "noregistrasi",
            noreff: $scope.cc.noregistrasi,
            keterangan: "Formulir Asesmen Edukasi dengan No EMR - " + e.data.data.noemr + " pada No Registrasi " + $scope.cc.noregistrasi,
            data: arrSave,
            jenisemr: $scope.cc.jenisemr,
            emrfk: $scope.cc.emrfk,
            };
            medifirstService.postLoggingEMR(jsonLog);

            // Bridging SatuSehat / IHS
            let json = { noregistrasi: $scope.cc.noregistrasi };
            medifirstService.postNonMessage("bridging/ihs/ObservationRajal", json).then(function (z) {
            if (z.data.resourceType == "OperationOutcome") {
                for (let x = 0; x < z.data.issue.length; x++) {
                toastr.error(z.data.issue[x].diagnostics + " - " + z.data.issue[x].expression[0]);
                }
            } else {
                toastr.success(z.data.resourceType);
            }
            });

            var arrStr = { 0: e.data.data.noemr };
            cacheHelper.set("cacheNomorEMR", arrStr);

            if (typeof LoadCacheHelper === "function") {
            LoadCacheHelper();
            }
            $scope.isLoading = false;
        });
        };


    $scope.cetakPdf = function () {
        $scope.popUpCetak.center().open();
      };
      $scope.tutupSurat = function () {
        $scope.popUpCetak.close();
      };

      function valueOtomatis() {
        if ($scope.cc.noregistrasi == null || $scope.cc.noregistrasi == undefined || $scope.cc.noregistrasi == "") {
          toastr.error("Ada kesalahan saat ambil isian Pengkajian Medis IGD, Mohon refresh kembali!");
        } else {
          medifirstService.get("emr/get-value-pengkajian-medis-igd?noRegistrasi=" + $scope.cc.noregistrasi).then(function (e) {
            if (e.data.messageCode == 200) {
              var value = e.data.data;
              for (let i = 0; i < value.length; i++) {
                //penyakit sekarang
                if (value[i].emrdfk == 2408) {
                  $scope.item.obj[1901305005] = value[i].value;
                }
                //keterangan pemeriksaan fisik
                if (value[i].emrdfk == 2423) {
                   $scope.item.obj[1901305006] = value[i].value;
                }
                //diagnosa kerja
                if (value[i].emrdfk == 2426) {
                 $scope.item.obj[1901305008] = value[i].value;
                }
                if (value[i].emrdfk == 1901300313) {
                 $scope.item.obj[1901305009] = value[i].value;
                }
              }
            }
          });
        }
      }

      function loadOrderPenunjang() {
          medifirstService.get('emr/get-order-penunjang-to-cppt?norec_pd=' + $scope.cc.norec_pd).then(function(dat) {
              
              if (dat.data && dat.data.length > 0) {
                  let textLab = "";
                  let textRad = "";
                  let textResep = "";
                  
                  let adaLab = false;
                  let adaRad = false;
                  let adaResep = false;

                  for (let i = 0; i < dat.data.length; i++) {
                      let item = dat.data[i];
                      
                      if (item.namaproduk != null) {
                          
                          if (item.keteranganorder == "Order Laboratorium") {
                              if (!adaLab) {
                                  textLab += "LAB :\n";
                                  adaLab = true;
                              }
                              textLab += " - " + item.namaproduk + "\n";
                          } 
                          
                          else if (item.keteranganorder == "Order Radiologi") {
                              if (!adaRad) {
                                  textRad += "RAD :\n";
                                  adaRad = true;
                              }
                              textRad += " - " + item.namaproduk + "\n";
                          } 
                          
                          else if (item.keteranganorder == "Order Farmasi") {
                              if (!adaResep) {
                                  textResep += "E-resep :\n";
                                  adaResep = true;
                              }
                              let aturan = item.aturanpakai ? " " + item.aturanpakai : "";
                              textResep += " - " + item.namaproduk + aturan + "\n";
                          }
                      }
                  }

                  let hasilAkhir = "";
                  if (adaLab) hasilAkhir += textLab + "\n";
                  if (adaRad) hasilAkhir += textRad + "\n";
                  if (adaResep) hasilAkhir += textResep;

                  if (!$scope.item) $scope.item = {};
                  if (!$scope.item.obj) $scope.item.obj = {};

                  $scope.item.obj[1901305007] = hasilAkhir.trim(); 
              }
          });
      }

      

       $scope.listGcs = [
                { text: "E", value: 1},
                { text: "M", value: 2},
                { text: "V", value: 3}
            ];
            $scope.listGcsE = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "-", value: 5}
            ];
            $scope.listGcsM = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "5", value: 5},
                { text: "6", value: 6},
                { text: "-", value: 7}
            ];
            $scope.listGcsV = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "5", value: 5},
                { text: "-", value: 6},
                { text: "Afasia", value: 7},
                { text: "Terintubasi", value: 8}
            ];

          $scope.listKondisiUmum = [
            { text: "Ringan", value: 1 },
            { text: "Sedang", value: 2 },
            { text: "Berat", value: 3 },
          ];  

      $scope.listKesadaran = [
            { text: "Compos Mentis", value: 1 },
            { text: "Apatis", value: 2 },
            { text: "Delirium", value: 3 },
            { text: "Somnolent", value: 4 },
            { text: "Sopor", value: 5 },
            { text: "Semi Coma", value: 6 },
            { text: "Coma", value: 7 },
          ];

       $scope.listRoute = [
          { text: "PO", value: 1 },
          { text: "IV", value: 2 },
          { text: "IT", value: 3 },
          { text: "SC", value: 4 },
          { text: "IM", value: 5 },
          { text: "TETES HIDUNG", value: 6 },
          { text: "TETES TELINGA", value: 7 },
          { text: "TETES MATA", value: 8 },
          { text: "SUP", value: 9 },
          { text: "OLEH DI KULIT", value: 10 },
          { text: "OLEH DI BIBIR/MULUT", value: 11 },
          { text: "NEBULISASI", value: 12 },
          { text: "HISAP", value: 13 },
          { text: "SEMPROT", value: 14 },
          { text: "KUMUR-KUMUR", value: 15 },
      ];

      //Isian Default
      $scope.item.obj[238] = 'TAK';
      $scope.item.obj[239] = 'TAK';
      $scope.item.obj[242] = 'TAK';
      $scope.item.obj[243] = 'TAK';
      $scope.item.obj[244] = 'TAK';
      $scope.item.obj[245] = 'TAK';
      $scope.item.obj[247] = 'TAK';
      $scope.item.obj[248] = 'TAK';
      $scope.item.obj[249] = 'TAK';
      $scope.item.obj[250] = 'TAK';
      $scope.item.obj[251] = 'TAK';
      $scope.item.obj[254] = 'TAK';
      $scope.item.obj[255] = 'TAK';
      $scope.item.obj[255] = 'TAK';
      $scope.item.obj[257] = 'TAK';
      $scope.item.obj[259] = 'TAK';
      $scope.item.obj[260] = 'TAK';
      //end Isian Default

      function getPenunjang(paramSearch) {
          medifirstService.get('emr/get-riwayat-order-penunjang-lab-rad?' + paramSearch).then(function (e) {

              let daftar = e.data.daftar || [];

              // Masukkan nomor urut
              for (var i = daftar.length - 1; i >= 0; i--) {
                  daftar[i].no = i + 1;
              }

              // Ambil semua details → namaproduk
              let semuaProduk = [];

              daftar.forEach(item => {
                  if (item.details && item.details.length > 0) {
                      item.details.forEach(det => {
                          semuaProduk.push(det.namaproduk);
                      });
                  }
              });

              // Gabungkan ke textarea
              // Pisahkan dengan enter (\n)
              if (semuaProduk.length > 0) {
                  $scope.item.obj[261] = semuaProduk.join('\n');
              }

              // Masukkan ke grid
              $scope.dataGridRiwayat = new kendo.data.DataSource({
                  data: daftar,
                  pageSize: 10
              });

          });
      }

      function getValueSPRI() {
            medifirstService.get('emr/get-value-spri?noRegistrasi=' + $scope.cc.noregistrasi).then(function (e) {
                let pemeriksaanfisik = '';
                if (e.data.messageCode == 200) {
                    var value = e.data.data
                    if (value.length > 0) {
                        for (let i = 0; i < value.length; i++) {
                            if (value[i].emrdfk == 358) {
                                $scope.item.obj[1901305004] = value[i].value
                            }
                        }
                    }
                } else {
                }
            })
        }


$scope.getLinkQr = function(namaPegawai){
    if (!namaPegawai || namaPegawai === '-') return ''; 
    return 'report/create-qr?namaPegawai=' + encodeURIComponent(namaPegawai);
}


    // 
        $scope.listNyeriAnak = [
            {
                "id": 3392, "nama": "Hurts", "detail": [
                { "id": 3393, "nama": "No Hurt", "descNilai": 0 },
                { "id": 3394, "nama": "Hurts Little Bit", "descNilai": 2 }, 
                { "id": 3395, "nama": "Hurts Little More", "descNilai": 4 },
                { "id": 3396, "nama": "Hurts Even More", "descNilai": 6 }, 
                { "id": 3397, "nama": "Hurts Whole Lot", "descNilai": 8 },
                { "id": 3398, "nama": "Hurts whorts", "descNilai": 10 }]
            }
        ]
        $scope.listSkorWong = [{
            "id": 3399, "nama": "Score ",
            "detail": [
                { "id": 3275, "nama": "0 - 1", "type": "checkbox", "ket": "= Tidak Ada Nyeri" },
                { "id": 3276, "nama": "2 - 3", "type": "checkbox", "ket": "= Sedikit Nyeri" },
                { "id": 3277, "nama": "4 - 5", "type": "checkbox", "ket": "= Cukup Nyeri" },
                { "id": 3278, "nama": "6 - 7", "type": "checkbox", "ket": "= Lumayan Nyeri" },
                { "id": 3279, "nama": "8 - 9", "type": "checkbox", "ket": "= Sangat Nyeri" },
                { "id": 3280, "nama": "10", "type": "checkbox", "ket": "= Amat Sangat Nyeri" },
            ]
        }]

        $scope.getSkalaNyeri = function (data, stat) {
            
            $scope.item.obj[3283] = undefined
            $scope.activeStatus = stat.descNilai
            var nilai = stat.descNilai
            if (nilai >= 0 && nilai <= 1) {
                $scope.item.obj[3275] = true
                $scope.item.obj[3283] = '0 - 1' 
                $scope.item.obj[3276] = false
                $scope.item.obj[3277] = false
                $scope.item.obj[3278] = false
                $scope.item.obj[3279] = false
                $scope.item.obj[3280] = false
            }
            
            if (nilai >= 2 && nilai <= 3) {
                $scope.item.obj[3275] = false
                $scope.item.obj[3276] = true
                $scope.item.obj[3283] = '2 - 3' 
                $scope.item.obj[3277] = false
                $scope.item.obj[3278] = false
                $scope.item.obj[3279] = false
                $scope.item.obj[3280] = false
            }
            if (nilai >= 4 && nilai <= 5) {
                $scope.item.obj[3275] = false
                $scope.item.obj[3276] = false
                $scope.item.obj[3277] = true
                $scope.item.obj[3283] = '4 - 5' 
                $scope.item.obj[3278] = false
                $scope.item.obj[3279] = false
                $scope.item.obj[3280] = false
            }
            if (nilai >= 6 && nilai <= 7) {
                $scope.item.obj[3275] = false
                $scope.item.obj[3276] = false
                $scope.item.obj[3277] = false
                $scope.item.obj[3278] = true
                $scope.item.obj[3283] = '6 - 7' 
                $scope.item.obj[3279] = false
                $scope.item.obj[3280] = false
            }
            if (nilai >= 8 && nilai <= 9) {
                $scope.item.obj[3275] = false
                $scope.item.obj[3276] = false
                $scope.item.obj[3277] = false
                $scope.item.obj[3278] = false
                $scope.item.obj[3279] = true
                $scope.item.obj[3283] = '8 - 9' 
                $scope.item.obj[3280] = false
            }

            if (nilai == 10) {
                $scope.item.obj[3275] = false
                $scope.item.obj[3276] = false
                $scope.item.obj[3277] = false
                $scope.item.obj[3278] = false
                $scope.item.obj[3279] = false
                $scope.item.obj[3280] = true
                $scope.item.obj[3283] = '10' 
            }

        }


       $scope.onChangeSkorGizi = function(id0, id1, clickedId) {
          // Logika Mutually Exclusive
          if (clickedId === id0 && $scope.item.obj[id0]) {
              $scope.item.obj[id1] = false; // Jika Skor 0 diklik, matikan Skor 1
          } else if (clickedId === id1 && $scope.item.obj[id1]) {
              $scope.item.obj[id0] = false; // Jika Skor 1 diklik, matikan Skor 0
          }

          // Hitung Total Skor
          var total = 0;
          if ($scope.item.obj[1901309337]) total += 1; // Baris 1 Skor 1
          if ($scope.item.obj[1901309340]) total += 1; // Baris 2 Skor 1
          if ($scope.item.obj[1901309342]) total += 1; // Baris 3 Skor 1
          if ($scope.item.obj[1901309344]) total += 1; // Baris 4 Skor 1

          $scope.item.obj[1901309345] = total;
      }; 
    },
    
  ]);
});