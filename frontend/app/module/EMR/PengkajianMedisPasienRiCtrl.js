define(["initialize"], function (initialize) {
  "use strict";

  initialize.controller("PengkajianMedisPasienRiCtrl", [
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
      var isNotClick = true;
      $scope.item = {};
      $scope.user = {};
      loadData();
      $scope.noCM = $state.params.noCM;
      $scope.tombolSimpanVis = true;
      $scope.isCetak = true;
      $scope.isKembali = true;
      $scope.noRecPap = cacheHelper.get("noRecPap");
      $scope.totalSkor = 0;
      $scope.totalSkor2 = 0;
      $scope.cc = {};
      var nomorEMRSS = "";
      var nomorEMR = "-";
      var paramSearch = "";
      var datauserkelompok = ''
      $scope.isAdmin = false
      $scope.item.qrnama = ''

      $scope.isSave = true;
      $scope.isUpdate = false;
      $scope.isUpdateCetak = false;

      //inisialisasi untuk id emr pada pengkajian medis pasien ctrl
      $scope.cc.emrfk = 2032;

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
      //ash 2023-09-19
      $scope.InputLab = true;
      $scope.InputRadiologi = true;
      $scope.InputObat = true;
      var produkDef = [];
      var jenisPelayananId = "";
      var temphasil = [];

      //ash 2023-09-20
      //UNTUK KOMUNIKASI PARENT DENGAN CHILD
      $scope.tipemodul = "pengkajianmedispasienranap";

      var temp = [];
      var lanjut = false;
      LoadCacheHelper();

      function loadData() {
        // $scope.listKesadaran = [
        //     { text: "Compos Mentis", value: 1 },
        //     { text: "Apatis", value: 2 },
        //     { text: "Delirium", value: 3 },
        //     { text: "Somnolent", value: 4 },
        //     { text: "Sopor", value: 5 },
        //     { text: "Semi Coma", value: 6 },
        //     { text: "Coma", value: 7 }
        // ];

        $scope.listKesadaran = [
          { text: "Compos Mentis", value: 1 },
          { text: "Apatis", value: 2 },
          { text: "Sopor", value: 3 },
          { text: "Coma", value: 4 },
        ];

        $scope.listKeadaanUmum = [
          { text: "Baik", value: 1 },
          { text: "Sedang", value: 2 },
          { text: "Buruk", value: 3 },
        ];
        $scope.listGcs = [
          { text: "E", value: 1 },
          { text: "M", value: 2 },
          { text: "V", value: 3 },
        ];
        $scope.listGcsE = [
          { text: "1", value: 1 },
          { text: "2", value: 2 },
          { text: "3", value: 3 },
          { text: "4", value: 4 },
        ];
        $scope.listGcsM = [
          { text: "1", value: 1 },
          { text: "2", value: 2 },
          { text: "3", value: 3 },
          { text: "4", value: 4 },
          { text: "5", value: 5 },
          { text: "6", value: 6 },
        ];
        $scope.listGcsV = [
          { text: "1", value: 1 },
          { text: "2", value: 2 },
          { text: "3", value: 3 },
          { text: "4", value: 4 },
          { text: "5", value: 5 },
          { text: "6", value: 6 },
        ];

        $scope.listPrognosis = [
          { text: "Adbonam", value: "1" },
          { text: "Dubia Adbonam", value: "2" },
          { text: "Dubia Admalam", value: "3" },
          { text: "Admalam", value: "4" },
        ];
      }

      $scope.showPopUp = function () {
        $scope.popUpUpload.center().open();
      };
      // $(document).ready(function(){
      //     $('.profile_img').hover(function() {
      //         $(this).addClass('transisi');
      //     }, function() {
      //         $(this).removeClass('transisi');
      //     });
      // });

      $scope.$watch("item.obj[1152]", function (e) {
        if (e == true) {
          $scope.lainnya = true;
          $scope.item.obj[1151] = false;
          $scope.item.obj[1150] = false;
          //$scope.item.obj[1153] = ""
        } else {
          $scope.lainnya = false;
          $scope.item.obj[1153] = "";
        }
      });
      $scope.$watch("item.obj[1151]", function (e) {
        if (e == true) {
          $scope.item.obj[1152] = false;
          $scope.item.obj[1150] = false;
          $scope.item.obj[1153] = "";
        }
      });

      $scope.$watch("item.obj[1150]", function (e) {
        if (e == true) {
          $scope.item.obj[1152] = false;
          $scope.item.obj[1151] = false;
          $scope.item.obj[1153] = "";
        }
      });

      $scope.$watch("item.obj[18]", function (e) {
        if (e == true) {
          $scope.item.namap = $scope.cc.namapasien
        } else {
          $scope.item.namap = ''
        }
      });

      $scope.onChangeKesadaran = function(e) {
          var combo = e.sender;
          var value = combo.value();
          var dataItem = combo.dataItem();

          if (!dataItem) {
              $scope.item.obj[1168] = value;
          } else {
              $scope.item.obj[1168] = dataItem.id;
          }
      };

      $scope.listNyeriAnak = [
        {
          id: 6335,
          nama: "Hurts",
          detail: [
            { id: 6336, nama: "No Hurt", descNilai: "0 - 1" },
            { id: 6337, nama: "Hurts Little Bit", descNilai: "2 - 3" },
            { id: 6338, nama: "Hurts Little More", descNilai: "4 - 5" },
            { id: 6339, nama: "Hurts Even More", descNilai: "6 - 7" },
            { id: 6340, nama: "Hurts Whole Lot", descNilai: "8 - 9" },
            { id: 6341, nama: "Hurts whorts", descNilai: "10" },
          ],
        },
      ];
      $scope.listSkorWong = [
        {
          id: 6342,
          nama: "Score ",
          detail: [
            { id: 6343, nama: "0 - 1", type: "checkbox", ket: "= Tidak Ada Nyeri" },
            { id: 6344, nama: "2 - 3", type: "checkbox", ket: "= Sedikit Nyeri" },
            { id: 6345, nama: "4 - 5", type: "checkbox", ket: "= Cukup Nyeri" },
            { id: 6346, nama: "6 - 7", type: "checkbox", ket: "= Lumayan Nyeri" },
            { id: 6347, nama: "8 - 9", type: "checkbox", ket: "= Sangat Nyeri" },
            { id: 6348, nama: "10", type: "checkbox", ket: "= Amat Sangat Nyeri" },
          ],
        },
      ];

      $scope.getSkalaNyeri = function (data, stat) {
        $scope.item.obj[6166] = undefined;
        $scope.activeStatus = stat.descNilai;
        var nilai = stat.descNilai;
        if (nilai >= 0 && nilai <= 1) {
          $scope.item.obj[6342] = true;
          $scope.item.obj[6166] = "0 - 1";
          $scope.item.obj[6343] = false;
          $scope.item.obj[6344] = false;
          $scope.item.obj[6345] = false;
          $scope.item.obj[6346] = false;
          $scope.item.obj[6347] = false;
        }

        if (nilai >= 2 && nilai <= 3) {
          $scope.item.obj[6342] = false;
          $scope.item.obj[6343] = true;
          $scope.item.obj[6166] = "2 - 3";
          $scope.item.obj[6344] = false;
          $scope.item.obj[6345] = false;
          $scope.item.obj[6346] = false;
          $scope.item.obj[6347] = false;
        }
        if (nilai >= 4 && nilai <= 5) {
          $scope.item.obj[6342] = false;
          $scope.item.obj[6343] = false;
          $scope.item.obj[6344] = true;
          $scope.item.obj[6166] = "4 - 5";
          $scope.item.obj[6345] = false;
          $scope.item.obj[6346] = false;
          $scope.item.obj[6347] = false;
        }
        if (nilai >= 6 && nilai <= 7) {
          $scope.item.obj[6342] = false;
          $scope.item.obj[6343] = false;
          $scope.item.obj[6344] = false;
          $scope.item.obj[6345] = true;
          $scope.item.obj[6166] = "6 - 7";
          $scope.item.obj[6346] = false;
          $scope.item.obj[6347] = false;
        }
        if (nilai >= 8 && nilai <= 9) {
          $scope.item.obj[6342] = false;
          $scope.item.obj[6343] = false;
          $scope.item.obj[6344] = false;
          $scope.item.obj[6345] = false;
          $scope.item.obj[6346] = true;
          $scope.item.obj[6166] = "8 - 9";
          $scope.item.obj[6347] = false;
        }

        if (nilai == 10) {
          $scope.item.obj[6342] = false;
          $scope.item.obj[6343] = false;
          $scope.item.obj[6344] = false;
          $scope.item.obj[6345] = false;
          $scope.item.obj[6346] = false;
          $scope.item.obj[6347] = true;
          $scope.item.obj[6166] = "10";
        }
      };
      //TINGGI BADAN BERAT BADAN
      /*
            KURUS BERAT <17
            KURUS RINGAN 17 - 18,4
            NORMAL 18,5 - 25
            GEMUK RINGAN 25,1 - 27
            GEMUK BERAT > 27
            */
      $scope.$watch("item.obj[1174]", function (e) {
        let beratbadan = 0;
        let tinggibadan = 0;
        let imt = 0;
        let imtstr = "";
        $scope.item.obj[1176] = "";

        if (e > 0) {
          if ($scope.item.obj[1175] > 0) {
            let tinggibadan = e / 100;
            let beratbadan = $scope.item.obj[1175];

            imt = beratbadan / (tinggibadan * tinggibadan);

            if (imt < 17) imtstr = "KURUS - BERAT";
            else if ((imt >= 17) & (imt < 18.4)) imtstr = "KURUS - RINGAN";
            else if ((imt >= 18.4) & (imt < 25)) imtstr = "NORMAL";
            else if ((imt >= 25) & (imt < 27)) imtstr = "GEMUK -RINGAN";
            else if (imt > 27) imtstr = "GEMUK -BERAT";

            $scope.item.obj[1176] = imt.toFixed(2) + " / " + imtstr;
          }
        }
      });

      $scope.$watch("item.obj[1175]", function (e) {
        let beratbadan = 0;
        let tinggibadan = 0;
        let imt = 0;
        let imtstr = "";
        $scope.item.obj[1176] = "";

        if (e > 0) {
          if ($scope.item.obj[1174] > 0) {
            let beratbadan = e;
            let tinggibadan = $scope.item.obj[1174] / 100;

            imt = beratbadan / (tinggibadan * tinggibadan);

            if (imt < 17) imtstr = "KURUS - BERAT";
            else if ((imt >= 17) & (imt < 18.4)) imtstr = "KURUS - RINGAN";
            else if ((imt >= 18.4) & (imt < 25)) imtstr = "NORMAL";
            else if ((imt >= 25) & (imt < 27)) imtstr = "GEMUK -RINGAN";
            else if (imt > 27) imtstr = "GEMUK -BERAT";

            $scope.item.obj[1176] = imtstr;
            $scope.item.obj[1176] = imt.toFixed(2) + " / " + imtstr;
          }
        }
      });

      $scope.showHasilLaboratorium = (sourceGrid) => {
        console.log(sourceGrid);

        $scope.resultLab = new kendo.data.DataSource({
          data: sourceGrid,
          schema: {
            model: {
              fields: {
                nama_pemeriksaan: { editable: false, type: "string" },
              },
            },
          },
          selectable: true,
          refresh: true,
          group: {
            field: "unit",
          },
        });

        $scope.ColumnResultLab = {
          toolbar: ["excel"],
          excel: {
            fileName: "HasilLab.xlsx",
            allPages: true,
          },
          excelExport: function (e) {
            var sheet = e.workbook.sheets[0];
            sheet.frozenRows = 2;
            sheet.mergedCells = ["A1:G1"];
            sheet.name = "Hasil";
            var myHeaders = [
              {
                value: "Hasil Laboratorium",
                fontSize: 15,
                textAlign: "center",
                background: "#c1d2d2",
              },
            ];

            sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
          },
          columns: [
            {
              field: "nama_pemeriksaan",
              title: "Nama Pemeriksaan",
              width: "20%",
            },
            {
              field: "hasil",
              title: "Hasil Pemeriksaan",
              width: "15%",
              attributes: {
                class: "#=flag != 'N' ? 'red' : 'green' #",
              },
            },
            {
              field: "nilainormal",
              title: "Nilai Normal",
              width: "15%",
            },
            {
              field: "satuan",
              title: "Satuan",
              width: "8%",
            },
            {
              field: "analis",
              title: "Analis",
              width: "20%",
            },
            {
              field: "tanggal_validasi",
              title: "Tgl Hasil",
              width: "20%",
            },
            {
              field: "resourceType",
              title: "Metode",
              width: "15%",
            },
            // {
            //     'title' : 'Action',
            //     'template': "<button class=\"k-button\" ng-click=\"selectHasilLab(dataItem)\">Tambah</button>",
            //     'width': '20%'
            // },
            {
              hidden: true,
              field: "unit",
              title: "Jenis",
            },
          ],
          sortable: {
            mode: "single",
            allowUnsort: false,
          },
          pageable: {
            messages: {
              display: "Menampilkan {2} data",
            },
          },
        };
        $scope.popUpHasilLab.open().center();
      };

      $scope.selectHasilLab = (dataItem) => {
        if ($scope.item.obj[1254] == undefined || $scope.item.obj[1254] == null || $scope.item.obj[1254] == "") {
          $scope.item.obj[1254] = "Hasil Laboratorium:\n" + dataItem.nama_pemeriksaan + ", hasil: " + dataItem.hasil + "\n";
        } else {
          $scope.item.obj[1254] += "\nHasil Laboratorium:\n" + dataItem.nama_pemeriksaan + ", hasil: " + dataItem.hasil + "\n";
        }
      };
      //-------------------

      $scope.UploadPhoto = function () {
        if ($scope.urlImage != undefined) {
          // saveImageToDirsaveImageToDir($scope.urlImage,'0182781')
          $scope.item.image = $scope.urlImage;
          $scope.popUpUpload.close();
        } else {
          toastr.info("Gambar belum di pilih");
          return;
        }
      };

      $scope.TutupPopUp = function () {
        if ($scope.urlImage != undefined) $scope.item.image = "../app/images/svg/no-image.svg";
        $scope.urlImage = undefined;
        $scope.popUpUpload.close();
      };

      $("#photo").kendoUpload({
        localization: {
          select: "Pilih Photo...",
        },
        async: {
          saveUrl: "save",
          removeUrl: "remove",
          autoUpload: false,
        },
        multiple: false,
        select: function (e) {
          var ALLOWED_EXTENSIONS = [".jpeg", ".jpg", ".png"];
          var extension = e.files[0].extension.toLowerCase();
          if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
            toastr.error("Mohon Pilih File Gambar (.jpg, .jpeg, .png)");
            e.preventDefault();
            // return
          }
          var fileInfo = e.files[0];
          var wrapper = this.wrapper;
          // debugger
          $scope.ImageUrlData = wrapper.context.value;
          setTimeout(function () {
            addPreview(fileInfo, wrapper);
            compress(e);
          });
        },
      });

      function addPreview(file, wrapper) {
        var raw = file.rawFile;
        var reader = new FileReader();
        if (raw) {
          reader.onloadend = function () {
            var preview = $("<img class='img-responsive'>").attr("src", this.result);
            wrapper.find(".k-file[data-uid='" + file.uid + "'] .k-file-extension-wrapper").replaceWith(preview);
          };
          reader.readAsDataURL(raw);
        }
      }

      function compress(e) {
        var fileName = e.files[0].name;
        // var width = 1280;
        // var height = 960;
        var reader = new FileReader();
        var raw = e.files[0].rawFile;
        reader.readAsDataURL(raw);
        reader.onload = (event) => {
          var img = new Image();
          img.src = event.target.result;
          (img.onload = () => {
            var elem = document.createElement("canvas");
            elem.width = img.width; //width;
            elem.height = img.height; //height;
            var ctx = elem.getContext("2d");
            // ctx.drawImage(img, 0, 0, width, height);
            ctx.drawImage(img, 0, 0, img.width, img.height);
            $scope.urlImage = ctx.canvas.toDataURL("image/jpeg", 1);
          }),
            (reader.onerror = (error) => console.log(error));
        };
      }

      $scope.add = function () {
        $scope.item = {};
        $scope.item.image = "../app/images/svg/no-image.svg";
        // $scope.myVar = 1
      };

      // loadValue();
      function LoadCacheHelper() {
        var chacePeriode = cacheHelper.get("cacheRMelektronik");
        if (chacePeriode != undefined) {
          //var arrPeriode = chacePeriode.split(':');
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
          $scope.cc.pgId = chacePeriode[17];
          $scope.cc.norec_emr = "-";
          $scope.cc.jenisemr = "pengkajianmedispasienranap"; //init emr
          paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;
          debugger;
          init();
          // cekVitalSign()
          // loadValue();
        }
        if (medifirstService.getKelompokUser() == 'admin' || medifirstService.getKelompokUser() == 'operator') {
          $scope.isAdmin = true
        }
      }
      var chekedd = false;

      //ash 2023-09-22
      //UNTUK INISIALISASI DATA
      function init() {
        $scope.isLoading = true;
        let isPengkajianKosong = 0;
        $scope.item.obj = [];
        $scope.item.obj2 = [];

        //jika awal melakukan pengkajian
        $scope.item.obj[1147] = moment($scope.cc.tglregistrasi).format("YYYY-MM-DD HH:mm");
        //$scope.isRouteLoading = true

        paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;
        getPenunjang('noregistrasi=' + $scope.cc.noregistrasi)

        /*medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                    $scope.listDiagnosa = data
                })  */

        medifirstService.getPart("emr/get-datacombo-part-dokter", true, true, 20).then(function (data) {
          $scope.listPegawai = data;
        });

        // medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
        //     $scope.listPegawai = data
        // })

        // $scope.item.obj[1257] = { value: medifirstService.getPegawaiLogin().id, text: medifirstService.getPegawaiLogin().namaLengkap };

        //CEK EMR APAKAH ADA
        medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=pengkajianmedispasienranap", true).then(function (dat) {
          $scope.isRouteLoading = false;
          debugger;
          nomorEMRSS = "";
          if (dat.data.data.length > 0) {
            //JIKA ADA
            for (let i = 0; i < dat.data.data.length; i++) {
              if (dat.data.data[i].jenisemr == "pengkajianmedispasienranap") {
                lanjut = true;
              }
            }
            if (lanjut == true) {
              $scope.isSave = false;
              $scope.isUpdate = true;
              $scope.isUpdateCetak = true;
              isPengkajianKosong = 1;
              $scope.cc.noemr = dat.data.data[0].noemr;
              $scope.cc.norec_emr = dat.data.data[0].norec;

              nomorEMRSS = dat.data.data[0].noemr;
              nomorEMR = nomorEMRSS;

              //ambil pengkajian awal medis pasien jika memang sudah ada
              $scope.cc.emrfk = 2032;
              setobjectToModel(nomorEMRSS, $scope.cc.emrfk);
            }
          } else {
            $scope.item.obj[1148] = moment($scope.now).format("HH:mm");
            $scope.item.obj[1239] = moment($scope.now).format("YYYY-MM-DD");
            $scope.item.obj[43] = moment($scope.now).format("YYYY-MM-DD HH:mm");
            cekVitalSign();
            valueOtomatis();
            getValueSPRI();
            $scope.item.obj[1150] = true
            $scope.item.obj[1334] = true
            $scope.item.obj[1] = true
            $scope.item.obj[3] = true
            $scope.item.obj[10] = true
            $scope.item.obj[18] = true
            // $scope.item.obj[1255] = 'Observasi TTV'
            $scope.item.obj[1257] = { value: medifirstService.getPegawaiLogin().id, text: medifirstService.getPegawaiLogin().namaLengkap };
          }
        });

        // if(!isPengkajianKosong) {
        //     var str=''
        //     var res=''
        //     //ash 2023-09-22
        //     //-----------------------------------------------------------
        //     //ambil data dari pengkajian awal untuk keluhan utama dan pemeriksaan fisik
        //     medifirstService.get('emr/get-value-from-pengkajian-awal-2?noRegistrasi=' + $scope.cc.noregistrasi).then(function(dat) {
        //         for(let i = 0; i < dat.data.length; i++) {
        //             if (dat.data[i].emrdfk == 1154) { //keluhan utama
        //                 $scope.item.obj[1154] = dat.data[i].value
        //             } else if (dat.data[i].emrdfk == 1168) { //kesadaran
        //                 str = dat.data[i].value
        //                 res = str.split("~");
        //                 $scope.item.obj[1168] = {text:res[1],value:res[0]}
        //             } else if (dat.data[i].emrdfk == 1169) { //tekanan darah
        //                 $scope.item.obj[1169] = dat.data[i].value
        //             } else if (dat.data[i].emrdfk == 1170) { //nadi
        //                 $scope.item.obj[1170] = dat.data[i].value
        //             } else if (dat.data[i].emrdfk == 1172) { //suhu tubuh
        //                 $scope.item.obj[1172] = dat.data[i].value
        //             } else if (dat.data[i].emrdfk == 1173) { //pernafasan
        //                 $scope.item.obj[1173] = dat.data[i].value
        //             } else if (dat.data[i].emrdfk == 1175) { //berat badan
        //                 $scope.item.obj[1175] = dat.data[i].value
        //             } else if (dat.data[i].emrdfk == 1174) { //tinggi badan
        //                 $scope.item.obj[1174] = dat.data[i].value
        //             } else if (dat.data[i].emrdfk == 1178) { //alergi
        //                 $scope.item.obj[1244] = dat.data[i].value
        //             } else if (dat.data[i].emrdfk == 1259) { //E
        //                 str = dat.data[i].value
        //                 res = str.split("~");

        //                 $scope.item.obj[2241] = {text:res[1],value:res[0]}
        //             } else if (dat.data[i].emrdfk == 1502) { //M
        //                 str = dat.data[i].value
        //                 res = str.split("~");

        //                 $scope.item.obj[2242] = {text:res[1],value:res[0]}
        //             } else if (dat.data[i].emrdfk == 1503) { //V
        //                 str = dat.data[i].value
        //                 res = str.split("~");

        //                 $scope.item.obj[2243] = {text:res[1],value:res[0]}
        //             }

        //             let beratbadan=$scope.item.obj[1175]
        //             let tinggibadan=$scope.item.obj[1174]/100;
        //             let imt=0;
        //             let imtstr=''

        //             if(beratbadan>0 && tinggibadan>0) {
        //                 imt=beratbadan/(tinggibadan*tinggibadan);

        //                 if(imt<17) imtstr="KURUS - BERAT"
        //                 else if((imt>=17) & (imt<18.4)) imtstr="KURUS - RINGAN"
        //                 else if((imt>=18.4) & (imt<25)) imtstr="NORMAL"
        //                 else if((imt>=25) & (imt<27)) imtstr="GEMUK -RINGAN"
        //                 else if(imt>27) imtstr="GEMUK -BERAT"

        //                 $scope.item.obj[1176] = imt.toFixed(2) + " / " + imtstr
        //             }
        //         }

        //     })
        //     //-----------------------------------------------------------
        // }

        $scope.isLoading = false;
      }

      function cekVitalSign() {
        // medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=triaseigd", true).then((res) => {
        //   var noEmrTriase = res.data.data[0].noemr;
        //   medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + noEmrTriase + "&emrfk=" + "697", true).then((result) => {
        //     for (let i = 0; i < result.data.data.length; i++) {
        //       if (result.data.data[i].emrdfk == 1901300082) {
        //         $scope.item.obj[1154] = result.data.data[i].value;
        //       }
        //     }
        //   });
        // });
        medifirstService.get("emr/get-vital-sign-pengkajian?noRegistrasi=" + $scope.cc.noregistrasi).then(function (dat) {
          debugger;
          if (dat.data.length > 0) {
            for (let i = 0; i < dat.data.length; i++) {
              if (dat.data[i].caption == "Tinggi badan") {
                $scope.item.obj[1174] = dat.data[i].value;
              } else if (dat.data[i].caption == "Berat Badan") {
                $scope.item.obj[1175] = dat.data[i].value;
              } else if (dat.data[i].caption == "kesadaran") {
                var str = dat.data[i].value;
                var res = str.split("~");
                $scope.item.obj[1168] = { value: res[0], text: res[1] };
              } else if (dat.data[i].caption == "emv yang E") {
                var str = dat.data[i].value;
                var res = str.split("~");
                $scope.item.obj[2241] = { value: res[0], text: res[1] };
              } else if (dat.data[i].caption == "emv yang M") {
                var str = dat.data[i].value;
                var res = str.split("~");
                $scope.item.obj[2242] = { value: res[0], text: res[1] };
              } else if (dat.data[i].caption == "emv yang V") {
                var str = dat.data[i].value;
                var res = str.split("~");
                $scope.item.obj[2243] = { value: res[0], text: res[1] };
              }
            }
          }
        });
        //get Resep
        // medifirstService.get(`emr/get-resep?noregistrasi=${$scope.cc.noregistrasi}`)
        // .then((res) => {
        //     console.log(res.data.data);
        //     var strResep = '';
        //     var dataResep = res.data.data;
        //     if(dataResep.length > 0) {
        //         for (let rsp = 0; rsp < dataResep.length; rsp++) {
        //             strResep = strResep + `- ${dataResep[rsp].namaproduk} ${dataResep[rsp].aturanpakai} ${dataResep[rsp].keteranganpakai} ${dataResep[rsp].pagi} ${dataResep[rsp].siang} ${dataResep[rsp].sore} ${dataResep[rsp].malam} \n` ;
        //         }
        //     }

        //     $scope.item.obj[1254] = strResep;
        //     // console.log(res.data.data);
        // });
      }

      function setobjectToModel(nomorEMRSS, emrfk) {
        let tm = "";
        let namaPegawai = "";
        medifirstService.get("emr/get-emr-transaksi-detail-new?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
          // debugger;
          $scope.isLoading = false;
          var chekedd = false;
          // $scope.item.obj[68] = $scope.now
          dataLoad = dat.data.data;
          for (var i = 0; i <= dataLoad.length - 1; i++) {
            if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
              if (dataLoad[i].type == "textbox") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
              } else if (dataLoad[i].type == "checkbox") {
                chekedd = false;
                if (dataLoad[i].value == "1") {
                  chekedd = true;
                }
                $scope.item.obj[dataLoad[i].emrdfk] = chekedd;
                if (dataLoad[i].emrdfk >= 74 && dataLoad[i].emrdfk <= 78 && chekedd) {
                  $scope.getSkalaNyeri(1, { descNilai: dataLoad[i].reportdisplay });
                }
                if (dataLoad[i].emrdfk >= 5053 && dataLoad[i].emrdfk <= 5084 && dataLoad[i].reportdisplay != null) {
                  var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay };
                  $scope.getSkor2(datass);
                }
                if (dataLoad[i].emrdfk >= 5085 && dataLoad[i].emrdfk <= 5093 && dataLoad[i].reportdisplay != null) {
                  var datass = { id: dataLoad[i].emrdfk, descNilai: dataLoad[i].reportdisplay };
                  $scope.getSkorNutrisi(datass);
                }
              } else if (dataLoad[i].type == "datetime") {
                //$scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD')
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
              } else if (dataLoad[i].type == "text") {
                //$scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD')
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
              } else if (dataLoad[i].type == "time") {
                // if(dataLoad[i].emrdfk == "1148") {
                //     var isoDate = dataLoad[i].value;

                //     var date = new Date(isoDate);

                //     var hours = date.getUTCHours();
                //     var minutes = date.getUTCMinutes();

                //     var formattedTime = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

                //     $scope.item.obj[dataLoad[i].emrdfk] = formattedTime;
                // } else {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                // }
              } else if (dataLoad[i].type == "date") {
                $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value);
              } else if (dataLoad[i].type == "checkboxtextbox") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                $scope.item.obj2[dataLoad[i].emrdfk] = true;
              } else if (dataLoad[i].type == "textarea") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
              } else if (dataLoad[i].type == "combobox") {
                if (dataLoad[i].emrdfk == "1149") {
                  var str = dataLoad[i].value;
                  var res = str.split("~");
                  // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                  $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namadiagnosa: str };
                } else 
                // if (dataLoad[i].emrdfk == "1168") {
                //   var str = dataLoad[i].value;
                //   var res = str.split("~");
                //   // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                //   $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str };
                // }
                if (dataLoad[i].emrdfk == "1168") {
                  var str = dataLoad[i].value;
                  var res = str.split("~");
                  $scope.item.obj[dataLoad[i].emrdfk] = {
                      value: res[0],
                      text: res[1] || res[0]
                  };
                } else if (dataLoad[i].emrdfk == "890") {
                  var str = dataLoad[i].value;
                  var res = str.split("~");
                  // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                  $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str };
                } else if (dataLoad[i].emrdfk == "891") {
                  var str = dataLoad[i].value;
                  var res = str.split("~");
                  // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                  $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: str };
                } else if (dataLoad[i].emrdfk == "1259") {
                  var str = dataLoad[i].value;
                  var res = str.split("~");
                  // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str };
                } else if (dataLoad[i].emrdfk == "2241") {
                  var str = dataLoad[i].value;
                  var res = str.split("~");
                  // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str };
                } else if (dataLoad[i].emrdfk == "2242") {
                  var str = dataLoad[i].value;
                  var res = str.split("~");
                  // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str };
                } else if (dataLoad[i].emrdfk == "2243") {
                  var str = dataLoad[i].value;
                  var res = str.split("~");
                  // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str };
                } else if (dataLoad[i].emrdfk == "3124") {
                  var str = dataLoad[i].value;
                  var res = str.split("~");
                  // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] };
                } else if (dataLoad[i].emrdfk == "1582") {
                  var str = dataLoad[i].value;
                  var res = str.split("~");
                  // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: str };
                }
              } else if (dataLoad[i].type == "photo") {
                $scope.user.poto = dataLoad[i].value;
              } else if (dataLoad[i].type == "image") {
                $scope.user.poto = dataLoad[i].value;
              }

              if (dataLoad[i].emrdfk == "1188") {
                // totalNilai = dataLoad[i].value
                // $scope.item.obj[1188] = parseInt(dataLoad[i].value)
                totalcost[0].value = dataLoad[i].value;
              } else if (dataLoad[i].emrdfk == "1257") {
                var str = dataLoad[i].value;
                var res = str.split("~");
                console.log("res", res);
                if (res.length >= 2) {
                  namaPegawai = res[1];
                  $scope.item.obj[dataLoad[i].emrdfk] = {
                    value: res[0],
                    text: res[1]
                  };
                }
              }

              let beratbadan = $scope.item.obj[1175];
              let tinggibadan = $scope.item.obj[1174] / 100;
              let imt = 0;
              let imtstr = "";

              if (beratbadan > 0 && tinggibadan > 0) {
                imt = beratbadan / (tinggibadan * tinggibadan);

                if (imt < 17) imtstr = "KURUS - BERAT";
                else if ((imt >= 17) & (imt < 18.4)) imtstr = "KURUS - RINGAN";
                else if ((imt >= 18.4) & (imt < 25)) imtstr = "NORMAL";
                else if ((imt >= 25) & (imt < 27)) imtstr = "GEMUK -RINGAN";
                else if (imt > 27) imtstr = "GEMUK -BERAT";

                $scope.item.obj[1176] = imt.toFixed(2) + " / " + imtstr;
              }
            }
          }

          if (namaPegawai) {
            medifirstService.get("report/create-qr?namaPegawai=" + encodeURIComponent(namaPegawai))
              .then(function (et) {
                $scope.item.qr = et.data.data;
              })
              .catch(function (error) {
                console.error("QR Error:", error);
              });
          }

          if ($scope.item.obj[18] == true) {
            medifirstService.get("report/create-qr?nama=" + $scope.cc.namapasien)
              .then(function (e) {
                $scope.item.qrnama = e.data.data;
              })
              .catch(function (error) {
                console.error("QR Error:", error);
              });
          } else {
            medifirstService.get("report/create-qr?nama=" + $scope.item.obj[1256])
              .then(function (e) {
                $scope.item.qrnama = e.data.data;
              })
              .catch(function (error) {
                console.error("QR Error:", error);
              });
          }
        });

        // medifirstService.get("emr/get-pengkajianpasienriallperawat/" + $scope.cc.nocm).then((res) => {
        //   if (res.data.data.length >= 1) {
        //     var codePap = res.data.data[0].norec;
        //     var object = "";
        //     var objectFk = "";
        //     switch (res.data.data[0].idemr) {
        //       case 736:
        //         object = "AKRI";
        //         objectFk = "AKRI0002187";
        //         break;
        //       case 747:
        //         object = "AAKADK";
        //         objectFk = "AAKADK00012";
        //         break;
        //       case 100008:
        //         object = "PKM";
        //         objectFk = "PKM0001154";
        //         break;

        //       default:
        //         break;
        //     }
        //     if (object != "") {
        //       medifirstService.get("emr/get-data-rekam-medis?noregistrasifk=" + $scope.cc.norec_pd + "&objectfk=" + object + "&riwayatfk=" + codePap).then((result) => {
        //         if (result.data.data.length > 0) {
        //           for (let i = 0; i < result.data.data.length; i++) {
        //             if (result.data.data[i].objectfk == objectFk) {
        //               $scope.item.obj[1154] = result.data.data[i].nilai;
        //             }
        //           }
        //         }
        //       });
        //     }
        //   }
        // });
      }

      $scope.kembali = function () {
        $rootScope.showRiwayat();
      };

      $scope.Save = function () {
        var confirm = $mdDialog.confirm().title("Konfirmasi").textContent("Apakah Anda yakin akan menyimpan data?").ariaLabel("Lucky day").cancel("Tidak").ok("Ya");
        $mdDialog.show(confirm).then(function () {
          $scope.Saveok();
        });
      };

      $scope.Saveok = function () {
        if ($scope.item.obj[1257].value != $scope.cc.pgId) {
          toastr.warning("DPJP tidak sesuai, harap disesuaikan!")
          return
        }
        if ($scope.item.obj[1239] == undefined || $scope.item.obj[1239] == "" || $scope.item.obj[1239] == null) {
          toastr.warning("Tanggal Pengkajian belum diisi!");
          return;
        }
        if ($scope.item.obj[1148] == undefined || $scope.item.obj[1148] == "" || $scope.item.obj[1148] == null) {
          toastr.warning("Jam Pengkajian belum diisi!");
          return;
        }
        if ($scope.item.obj[1151] == true) {
          if ($scope.item.obj[20] == undefined || $scope.item.obj[20] == "" || $scope.item.obj[20] == null) {
            toastr.warning("Nama Keluarga belum diisi!");
            return;
          }
          if ($scope.item.obj[21] == undefined || $scope.item.obj[21] == "" || $scope.item.obj[21] == null) {
            toastr.warning("Hubungannya belum diisi!");
            return;
          }
          if ($scope.item.obj[22] == undefined || $scope.item.obj[22] == "" || $scope.item.obj[22] == null) {
            toastr.warning("Anamnesis Tambahan belum diisi!");
            return;
          }
        }
        if ($scope.item.obj[1154] == undefined || $scope.item.obj[1154] == "" || $scope.item.obj[1154] == null) {
          toastr.warning("Keluhan Utama belum diisi!");
          return;
        }
        if ($scope.item.obj[1240] == undefined || $scope.item.obj[1240] == "" || $scope.item.obj[1240] == null) {
          toastr.warning("Riwayat Penyakit Sekarang belum diisi!");
          return;
        }
        if ($scope.item.obj[1245] == undefined || $scope.item.obj[1245] == "" || $scope.item.obj[1245] == null) {
          toastr.warning("Kulit belum diisi!");
          return;
        }
        if ($scope.item.obj[1246] == undefined || $scope.item.obj[1246] == "" || $scope.item.obj[1246] == null) {
          toastr.warning("Kepala belum diisi!");
          return;
        }
        if ($scope.item.obj[1247] == undefined || $scope.item.obj[1247] == "" || $scope.item.obj[1247] == null) {
          toastr.warning("Mata belum diisi!");
          return;
        }
        if ($scope.item.obj[1248] == undefined || $scope.item.obj[1248] == "" || $scope.item.obj[1248] == null) {
          toastr.warning("THT belum diisi!");
          return;
        }
        if ($scope.item.obj[1249] == undefined || $scope.item.obj[1249] == "" || $scope.item.obj[1249] == null) {
          toastr.warning("Gigi belum diisi!");
          return;
        }
        if ($scope.item.obj[1250] == undefined || $scope.item.obj[1250] == "" || $scope.item.obj[1250] == null) {
          toastr.warning("Mulut belum diisi!");
          return;
        }
        if ($scope.item.obj[1251] == undefined || $scope.item.obj[1251] == "" || $scope.item.obj[1251] == null) {
          toastr.warning("Leher belum diisi!");
          return;
        }
        if ($scope.item.obj[1252] == undefined || $scope.item.obj[1252] == "" || $scope.item.obj[1252] == null) {
          toastr.warning("Dada/Mammae belum diisi!");
          return;
        }
        if ($scope.item.obj[1253] == undefined || $scope.item.obj[1253] == "" || $scope.item.obj[1253] == null) {
          toastr.warning("Jantung belum diisi!");
          return;
        }
        if ($scope.item.obj[69] == undefined || $scope.item.obj[69] == "" || $scope.item.obj[69] == null) {
          toastr.warning("Paru-paru belum diisi!");
          return;
        }
        if ($scope.item.obj[84] == undefined || $scope.item.obj[84] == "" || $scope.item.obj[84] == null) {
          toastr.warning("Abdomen belum diisi!");
          return;
        }
        if ($scope.item.obj[85] == undefined || $scope.item.obj[85] == "" || $scope.item.obj[85] == null) {
          toastr.warning("Genitalia belum diisi!");
          return;
        }
        if ($scope.item.obj[95] == undefined || $scope.item.obj[95] == "" || $scope.item.obj[95] == null) {
          toastr.warning("Ekstremitas belum diisi!");
          return;
        }
        if ($scope.item.obj[108] == undefined || $scope.item.obj[108] == "" || $scope.item.obj[108] == null) {
          toastr.warning("Hasil Pemeriksaan Penunjang belum diisi!");
          return;
        }
        if ($scope.item.obj[113] == undefined || $scope.item.obj[113] == "" || $scope.item.obj[113] == null) {
          toastr.warning("Masalah Medis belum diisi!");
          return;
        }
        if ($scope.item.obj[120] == undefined || $scope.item.obj[120] == "" || $scope.item.obj[120] == null) {
          toastr.warning("Masalah Keperawatan belum diisi!");
          return;
        }
        if ($scope.item.obj[122] == undefined || $scope.item.obj[122] == "" || $scope.item.obj[122] == null) {
          toastr.warning("Diagnosis Kerja belum diisi!");
          return;
        }
        if ($scope.item.obj[1254] == undefined || $scope.item.obj[1254] == "" || $scope.item.obj[1254] == null) {
          toastr.warning("Rencana Penatalaksanaan dan Target Terukur belum diisi!");
          return;
        }
        if ($scope.item.obj[1255] == undefined || $scope.item.obj[1255] == "" || $scope.item.obj[1255] == null) {
          toastr.warning("Instruksi Medis belum diisi!");
          return;
        }
        if ($scope.item.obj[43] == undefined || $scope.item.obj[43] == "" || $scope.item.obj[43] == null) {
          toastr.warning("Tanggal belum diisi!");
          return;
        }
        if ($scope.item.obj[18] == true && $scope.item.obj[1256] == "") {
          $scope.item.obj[1256] = $scope.cc.namapasien
        } else if ($scope.item.obj[1256] == undefined || $scope.item.obj[1256] == "" || $scope.item.obj[1256] == null) {
          toastr.warning("Penerima penjelasan belum diisi!");
          return;
        }

        $scope.isUpdateCetak = false;
        $scope.isLoading = true;
        var photo = "";
        kendo.drawing
          .drawDOM($(".surface"))
          .then(function (group) {
            debugger;
            // Render the result as a SVG document
            return kendo.drawing.exportImage(group);
          })
          .done(function (data) {
            photo = data;
            debugger;
          });

        $scope.item.obj[1148] = moment($scope.item.obj[1148], "HH:mm").format("HH:mm");
        $scope.item.obj[1239] = moment($scope.item.obj[1239]).format("YYYY-MM-DD");

        var arrobj = Object.keys($scope.item.obj);
        var arrSave = [];
        debugger;
        for (var i = arrobj.length - 1; i >= 0; i--) {
          if (arrobj[i] == 3124 || arrobj[i] == 1257 || arrobj[i] == 1582) {
            arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].value + "~" + $scope.item.obj[parseInt(arrobj[i])].text });
          } else if (arrobj[i] == 2241 || arrobj[i] == 2242 || arrobj[i] == 2243) {
            arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text });
          } else if (arrobj[i] == 1168) {
            if (typeof $scope.item.obj[parseInt(arrobj[i])] === 'object') {
                arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
            } else {
                arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
            }
          } else {
            arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] });
          }
        }
        arrSave.push({ id: "2320", values: photo });
        $scope.cc.jenisemr = "pengkajianmedispasienranap";
        var jsonSave = {
          head: $scope.cc,
          data: arrSave,
          image: $scope.item.image != undefined && $scope.item.image != "../app/images/svg/no-image.svg" ? $scope.item.image : null,
        };
        medifirstService.post("emr/save-emr-new", jsonSave).then(function (e) {
          $scope.isSave = false;
          $scope.isUpdate = true;
          $scope.isUpdateCetak = true;
          $scope.noemr = e.data.data.noemr;

          if (e.data.data && e.data.data.norec) {
            $scope.cc.norec_emr = e.data.data.norec;
          }
          if (e.data.data && e.data.data.noemr) {
            $scope.cc.noemr = e.data.data.noemr;
          }

          medifirstService.postLogging("EMR", "norec emrpasien_t", e.data.data.norec, "Pengkajian Medis Pasien Rawat Inap " + " dengan No EMR - " + e.data.data.noemr + " pada No Registrasi " + $scope.cc.noregistrasi).then(function (res) {
            var arrStr = {
              0: $scope.noemr,
            };
            cacheHelper.set("cacheNomorEMR", arrStr);
            LoadCacheHelper();
          });

          medifirstService.postLogging("EMR", "norec emrpasien_t", e.data.data.norec, "Pengkajian Medis Pasien Rawat Inap" + " dengan No EMR - " + e.data.data.noemr + " pada No Registrasi " + $scope.cc.noregistrasi).then(function (res) {
          });

          let json = {
              "noregistrasi": $scope.cc.noregistrasi
          }
          medifirstService.postNonMessage('bridging/ihs/ObservationRanap', json).then(function (z) {
              if(z.data.resourceType == 'OperationOutcome' ){
                  for (let x = 0; x < z.data.issue.length; x++) {
                      const element = z.data.issue[x];
                      toastr.error(element.diagnostics + ' - ' + element.expression[0])
                  }
              }else{
                  toastr.success(z.data.resourceType)
              }
          }).catch(function(err) {
              console.error("Bridging error:", err);
          }).finally(function() {
              $scope.isLoading = false;
          });
        });
      };

      //ash 2023-10-10

      $scope.cetakPdf = function () {
        $scope.popUpCetak.center().open();
      };
      $scope.tutupSurat = function () {
        $scope.popUpCetak.close();
      };

      function getAlergi() {
        medifirstService.get("emr/get-combo-alergi").then(function (e) {
          $scope.listAlergi = e.data.alergi;
          $scope.listDokter = e.data.dokter;
          $scope.item.dokter = { id: $scope.userLogin.id, namalengkap: $scope.userLogin.namaLengkap };
          $scope.item.tglKonsul = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        });

        medifirstService.get("emr/get-alergi?noregistrasi=" + $scope.cc.noregistrasi).then((res) => {
          if (res.data.data.length > 0) {
            var result = res.data.data;
            var alergi = "";
            for (let x = 0; x < result.length; x++) {
              if (alergi == "") {
                alergi = result[x].keterangandata;
              } else {
                alergi = alergi + "\n " + result[x].keterangandata;
              }
            }
            $scope.item.obj[1244] = alergi;
          }
          $scope.isRouteLoading = false;
        });
      }

      function valueOtomatis() {
        if ($scope.cc.noregistrasi == null || $scope.cc.noregistrasi == undefined || $scope.cc.noregistrasi == "") {
          toastr.error("Ada kesalahan saat ambil isian Pengkajian Medis IGD, Mohon refresh kembali!");
        } else {
          medifirstService.get("emr/get-value-pengkajian-medis-igd?noRegistrasi=" + $scope.cc.noregistrasi).then(function (e) {
            if (e.data.messageCode == 200) {
              var value = e.data.data;
              for (let i = 0; i < value.length; i++) {
                if (value[i].emrdfk == 2408) {
                  $scope.item.obj[1240] = value[i].value;
                }
                if (value[i].emrdfk == 2409) {
                  $scope.item.obj[1169] = value[i].value;
                }
                if (value[i].emrdfk == 2412) {
                  $scope.item.obj[1170] = value[i].value;
                }
                if (value[i].emrdfk == 2411) {
                  $scope.item.obj[1172] = value[i].value;
                }
                if (value[i].emrdfk == 2410) {
                  $scope.item.obj[1173] = value[i].value;
                }
                if (value[i].emrdfk == 2638) {
                    $scope.item.obj[1255] = value[i].value;
                }
                if (value[i].emrdfk == 2639) {
                    if ($scope.item.obj[1255]) {
                        $scope.item.obj[1255] += "\n" + value[i].value;
                    } else {
                        $scope.item.obj[1255] = value[i].value;
                    }
                }
                if (value[i].emrdfk == 1901300297) {
                  $scope.item.obj[1154] = value[i].value
                }
                if (value[i].emrdfk == 1901303154) {
                    var rawValue = value[i].value;

                    var splitValue = rawValue.split('~'); 
                    
                    var kodeSakit = splitValue[0];

                    $scope.item.obj[8] = false;
                    $scope.item.obj[10] = false;
                    $scope.item.obj[11] = false;

                    if (kodeSakit === "1") {
                        $scope.item.obj[8] = true;
                    } else if (kodeSakit === "2") {
                        $scope.item.obj[10] = true;
                    } else if (kodeSakit === "3") {
                        $scope.item.obj[11] = true;
                    }
                }
              }
            }
          });
        }
      }

      function getValueSPRI() {
            medifirstService.get('emr/get-value-spri?noRegistrasi=' + $scope.cc.noregistrasi).then(function (e) {
                let pemeriksaanfisik = '';
                if (e.data.messageCode == 200) {
                    var value = e.data.data
                    if (value.length > 0) {
                        for (let i = 0; i < value.length; i++) {
                            if (value[i].emrdfk == 358) {
                                $scope.item.obj[113] = value[i].value
                            }
                        }
                    }
                } else {
                }
            })
        }

      //ISIAN DEFAULT 
      $scope.item.obj[1245] = 'T.A.K';
      $scope.item.obj[1246] = 'T.A.K';
      $scope.item.obj[1247] = 'T.A.K';
      $scope.item.obj[1248] = 'T.A.K';
      $scope.item.obj[1249] = 'T.A.K';
      $scope.item.obj[1250] = 'T.A.K';
      $scope.item.obj[1251] = 'T.A.K';
      $scope.item.obj[1252] = 'T.A.K';
      $scope.item.obj[1253] = 'T.A.K';
      $scope.item.obj[69] = 'T.A.K';
      $scope.item.obj[84] = 'T.A.K';
      $scope.item.obj[85] = 'T.A.K';
      $scope.item.obj[95] = 'T.A.K';
      //END ISIAN DEFAULT

      $scope.$watchGroup(
        ['item.obj[18]', 'item.namap', 'item.obj[24]', 'item.obj[124]'],
        function(newVal) {
          let hasil = "";

          if ($scope.item.obj[18]) {
            if ($scope.item.namap) {
              hasil += $scope.item.namap + "\n";
            } else {
              hasil += "\n";
            }
          }

          if ($scope.item.obj[24]) {
            if ($scope.item.obj[124]) {
              hasil += $scope.item.obj[124] + "\n";
            } else {
              hasil += "\n";
            }
          }

          $scope.item.obj[1256] = hasil.trim();
        }
      );

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
                  $scope.item.obj[108] = semuaProduk.join('\n');
              }

              // Masukkan ke grid
              $scope.dataGridRiwayat = new kendo.data.DataSource({
                  data: daftar,
                  pageSize: 10
              });

          }).catch(function(err) {
              console.warn("Error fetching riwayat order penunjang:", err);
              // Fallback: grid kosong jika error
              $scope.dataGridRiwayat = new kendo.data.DataSource({
                  data: [],
                  pageSize: 10
              });
              // Jika perlu menampilkan warning ke user
              // toastr.warning("Gagal memuat riwayat order penunjang");
          });
      }



      // $scope.addAlergi = () => {
      //     $scope.popUpAddAlergi.open().center();
      // }

      // $scope.saveAlergi = function () {
      //     if ($scope.item.keterangan == undefined) {
      //     toastr.error("Keterangan harus di isi  terlebih dahulu!");
      //     return;
      //     }
      //     if ($scope.item.dokter == undefined) {
      //     toastr.error("Dokter harus di isi  terlebih dahulu!");
      //     return;
      //     }
      //     if ($scope.item.kategori == undefined) {
      //     toastr.error("Kategori harus di isi  terlebih dahulu!");
      //     return;
      //     }

      //     var tglKonsul = new moment($scope.item.tglKonsul).format(
      //     "YYYY-MM-DD HH:mm:ss"
      //     );

      //     var objSave = {
      //     norec: $scope.item.norec != undefined ? $scope.item.norec : "",
      //     norec_pd: $scope.cc.norec_pd,
      //     pegawaifk: $scope.item.dokter.id,
      //     keterangan:
      //         $scope.item.keterangan != undefined ? $scope.item.keterangan : "",
      //     kategori:
      //         $scope.item.kategori != undefined ? $scope.item.kategori : "",
      //     tglinput: tglKonsul,
      //     };
      //     medifirstService.post("emr/post-alergi", objSave).then(function (e) {
      //         getAlergi();
      //     });
      // };
      //--------------
    },
  ]);
});
