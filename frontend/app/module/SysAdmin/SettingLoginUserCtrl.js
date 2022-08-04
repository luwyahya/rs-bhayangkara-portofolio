define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('SettingLoginUserCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$timeout', 'DateHelper',
        function($q, $rootScope, $scope, medifirstService, $timeout, DateHelper) {
            $scope.item = {};
            $scope.new = {}
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item.endDateLogin = $scope.now
                //var init = function() {}
            $scope.new.idlogin = ''
            $scope.isRouteLoading = false
            init();
            $scope.columnModulAplikasi = [{
                "field": "id",
                "title": "Kode Modul Aplikasi"
            }, {
                "field": "Name",
                "title": "Parent id"
            }, {
                "field": "HasModule",
                "title": "Subsistem"
            }, {
                "title": "Action",
                "width": "200px",
                "template": "<button class='btnEdit' ng-click='enableData()'>Enable</button>" +
                    "<button class='btnHapus' ng-click='disableData()'>Disable</button>"
            }];

            function init() {
                $scope.treeSourceModulAplikasi = [];
                medifirstService.get("sysadmin/menu/svc-modul?get=modul", true).then(function(dat) {
                    var inlineDefault = new kendo.data.HierarchicalDataSource({
                        data: dat.data,
                        schema: {
                            model: {
                                children: "Module"
                            }
                        }
                    });
                    $scope.treeSourceModulAplikasi = inlineDefault
                    $scope.mainTreeViewSubsistemOption = {
                        dataTextField: ["Name"],
                        select: onSelect,
                        dragAndDrop: true,
                        checkboxes: true
                    }

                });

                $scope.treeSourceRuangan = [];
                medifirstService.get("sysadmin/menu/data-map-login-usertoruangan?jenis=departemenruangan", true).then(function(dat) {
                    $scope.listInstalasi = dat.data
                    var inlineDefault = new kendo.data.HierarchicalDataSource({
                        data: dat.data,
                        // check: onCheck,
                        schema: {
                            model: {
                                children: "child"
                            }
                        }
                    });
                    $scope.treeSourceRuangan = inlineDefault
                    $scope.mainTreeViewOptionRuangan = {
                        dataTextField: ["title"],
                        select: onSelect,
                        dragAndDrop: true,
                        checkboxes: true
                    }

                });
                medifirstService.get("sysadmin/menu/svc-modul?get=kelompokuser").then(function(datapegawai) {
                    // debugger;=
                    $scope.listKelompokuser = datapegawai.data;
                    // console.log($scope.listdatapegawai);
                });
                medifirstService.get("sysadmin/menu/svc-modul?get=pegawai&nama=" + $scope.item.namaPegawai).then(function(datapegawai) {
                    // debugger;
                    // $scope.listdatapegawai = datapegawai.data.pegawai;
                    $scope.listdataloginuser = datapegawai.data.loginuser;
                    $scope.listUserForTimeLogin = datapegawai.data.loginuser
                    $scope.lisUserArr = datapegawai.data.loginuser
                        // console.log($scope.listdatapegawai);
                });
            }

            $scope.CariPegawai = function() {
                medifirstService.get("sysadmin/menu/svc-modul?get=pegawai&nama=" + $scope.item.namaPegawai).then(function(datapegawai) {
                    // debugger;
                    // $scope.listdatapegawai = datapegawai.data.pegawai;
                    $scope.listdataloginuser = datapegawai.data.loginuser;
                    $scope.item.loginUser = { luid: $scope.listdataloginuser[0].luid, namauser: $scope.listdataloginuser[0].namauser };
                    getdadata()
                        // console.log($scope.listdatapegawai);
                });
            }

            $scope.SearchData = function() {
                medifirstService.get("sysadmin/menu/svc-modul?get=pegawai&nama=" + $scope.item.namaPegawai).then(function(datapegawai) {
                    // debugger;
                    // $scope.listdatapegawai = datapegawai.data.pegawai;
                    $scope.listdataloginuser = datapegawai.data.loginuser;

                    // console.log($scope.listdatapegawai);
                });
            }

            function onSelect(e) {

            }
            $scope.getDataRuangan = function() {
                $scope.listdataruangan = $scope.item.instalasi.child
            }



            $scope.getDataUser = function() {
                getdadata()
                getMapLoginToModulApp()
            }

            function getdadata() {
                // DataGetPegawai()
                $scope.isRouteLoading = true
                medifirstService.get("sysadmin/menu/svc-modul?get=loginuser&id=" + $scope.item.loginUser.luid).then(function(data) {
                    $scope.item.idlogin = data.data.loginuser[0].luid;
                    $scope.item.namaUser = data.data.loginuser[0].namauser;
                    // $scope.item.kataKunciPass = data.data.loginuser.katasandi;
                    // $scope.item.kataKunciConfirm = data.data.loginuser.katasandi;
                    $scope.item.kelompokUserHakAkses = { id: data.data.loginuser[0].kuid, kelompokuser: data.data.loginuser[0].kelompokuser };
                    $scope.dataGrid = data.data.loginuser[0].data;
                    $scope.isRouteLoading = false


                })
            }
            $scope.klikGrid = function() {
                $scope.item.instalasi = { id: $scope.dataSelected.dpid, title: $scope.dataSelected.namadepartemen }
                $scope.item.ruangan = { id: $scope.dataSelected.ruid, title: $scope.dataSelected.namaruangan }
            }

            $scope.tambah = function() {
                $scope.isRouteLoading = true
                medifirstService.get("sysadmin/menu/save-map-luRuangan?loginuserfk=" + $scope.item.loginUser.luid + "&ruanganfk=" + $scope.item.ruangan.id).then(function(data) {
                    medifirstService.get("sysadmin/menu/svc-modul?get=loginuser&id=" + $scope.item.loginUser.luid).then(function(data) {
                        $scope.item.idlogin = data.data.loginuser[0].luid;
                        $scope.item.namaUser = data.data.loginuser[0].namauser;
                        // $scope.item.kataKunciPass = data.data.loginuser.katasandi;
                        // $scope.item.kataKunciConfirm = data.data.loginuser.katasandi;
                        $scope.item.kelompokUserHakAkses = { id: data.data.loginuser[0].kuid, kelompokuser: data.data.loginuser[0].kelompokuser };
                        $scope.dataGrid = data.data.loginuser[0].data;
                        $scope.isRouteLoading = false


                    })
                })
            }
            $scope.klikMapLogin = function(x) {
                $scope.dataSelected2 = x;
            }
            $scope.hapus = function() {
                $scope.isRouteLoading = true
                medifirstService.get("sysadmin/menu/save-hapus-map-luRuangan?loginuserfk=" + $scope.item.loginUser.luid + "&ruanganfk=" + $scope.dataSelected.ruid).then(function(data) {
                    medifirstService.get("sysadmin/menu/svc-modul?get=loginuser&id=" + $scope.item.loginUser.luid).then(function(data) {
                        $scope.item.idlogin = data.data.loginuser[0].luid;
                        $scope.item.namaUser = data.data.loginuser[0].namauser;
                        // $scope.item.kataKunciPass = data.data.loginuser.katasandi;
                        // $scope.item.kataKunciConfirm = data.data.loginuser.katasandi;
                        $scope.item.kelompokUserHakAkses = { id: data.data.loginuser[0].kuid, kelompokuser: data.data.loginuser[0].kelompokuser };
                        $scope.dataGrid = data.data.loginuser[0].data;
                        $scope.isRouteLoading = false

                    })
                })
            }

            $scope.columnGrid = [{
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "dpid",
                    "title": "Id Instalasi",
                    "width": "30px",
                },
                {
                    "field": "namadepartemen",
                    "title": "Instalasi",
                    "width": "100px",
                },
                {
                    "field": "ruid",
                    "title": "Id Ruangan",
                    "width": "30px",
                },
                {
                    "field": "namaruangan",
                    "title": "Nama Ruangan",
                    "width": "100px",
                }
            ];



            function onSelectRuangan(e) {
                //debugger;
                //alert(this.text(e.node));
                var namaObjekSelected = this.text(e.node)
                var arrText = namaObjekSelected.split('_');
                //var idObjekmodulaplikasiHead =''
                // $scope.item.nmMenu = arrText[1];
                $scope.data4 = [];
                medifirstService.get("sysadmin/menu/data?jenis=objekmodultokelompokuser&omaid=" + arrText[0] + "&id=" + idModul, true).then(function(dat) {
                    if (dat.data.data1.length != 0) {
                        for (var i = 0; i < dat.data.data1.length; i++) {
                            dat.data.data1[i].no = i + 1;
                        }
                        $scope.data4 = dat.data.data1;
                    }
                    $scope.item.idMenu = dat.data.data2.omaid;
                    $scope.item.idHead = dat.data.data2.kdobjekmodulaplikasihead;
                    $scope.item.nmMenu = dat.data.data2.objekmodulaplikasi;
                    $scope.item.fungsi = dat.data.data2.fungsi;
                    $scope.item.keterangan = dat.data.data2.keterangan;
                    $scope.item.noUrut2 = dat.data.data2.nourut;
                    $scope.item.url = dat.data.data2.alamaturlform;

                    $scope.item.idHeadMenu = dat.data.data2.kdobjekmodulaplikasihead;
                    $scope.item.nmModulHead = dat.data.data2.objekmodulaplikasihead;
                    $scope.showIdMenu = true
                });
            }

            // getmodulpegawai();

            function checkedNodeIds(nodes, checkedNodes) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].checked) {
                        checkedNodes.push(nodes[i].moduleId);
                    }

                    if (nodes[i].hasChildren) {
                        checkedNodeIds(nodes[i].children.view(), checkedNodes);
                    }
                }
            }



            $scope.simpan = function() {
                for (var i = $scope.treeSourceRuangan._data.length - 1; i >= 0; i--) {
                    if ($scope.treeSourceRuangan._data[i].children != undefined) {

                    }
                }
                if ($scope.item.idlogin == undefined) {
                    alert('Pilih dahullu pegawai!')
                    return
                }
                if ($scope.item.kataKunciPass != $scope.item.kataKunciConfirm) {
                    alert('Kata kunci tidak sama')
                    return
                }
                // var objSave = {
                //                     id:$scope.item.idlogin,
                // 		kelompokUser:{  
                // 	      id:$scope.item.kelompokUserHakAkses.id
                // 		},
                // 		statusLogin:0,
                // 		kataSandi:$scope.item.kataKunciPass,
                // 		namaUser:$scope.item.namaUser,
                // 		pegawai:{  
                // 	      id:$scope.item.namaPegawai.pegawaiId
                // 		}
                //                 }
                var objSave = {
                    id: $scope.item.idlogin,
                    kelompokUser: {
                        id: $scope.item.kelompokUserHakAkses.id
                    },
                    statusLogin: 0,
                    kataSandi: $scope.item.kataKunciPass,
                    namaUser: $scope.item.namaUser,
                    pegawai: {
                        id: $scope.item.loginUser.objectpegawaifk
                    }
                }
                medifirstService.post('auth/ubah-password', objSave).then(function(e) {
                    // manageSarpras.saveLoginUser(objSave).then(function(e) {

                })
            }

            function onCheck() {
                var checkedNodes = [],
                    treeView = $scope.treeSourceModulAplikasi,
                    message;

                checkedNodeIds(treeView.dataSource.view(), checkedNodes);

                if (checkedNodes.length > 0) {
                    message = "IDs of checked nodes: " + checkedNodes.join(",");
                } else {
                    message = "No nodes checked.";
                }

                $("#result").html(message);
            }

            $scope.mainGridOptionsModulAplikasi = {
                pageable: true,
                columns: $scope.columnModulAplikasi,
                editable: "popup",
                selectable: "row",
                scrollable: false
            };

            $scope.showAndHide = function() {
                $('#contentHide').fadeToggle("fast", "linear");
            }
            medifirstService.get("sysadmin/menu/get-objek-modul-aplikasi", true).then(function(e) {
                $scope.listModulAplikasi = e.data.modulaplikasi
            })

            function getMapLoginToModulApp() {
                $scope.isRouteLoading = true
                medifirstService.get("sysadmin/menu/get-map-login-to-modul-aplikasi?idLogin=" + $scope.item.loginUser.luid, true).then(function(e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        e.data.data[i].no = i + 1
                    }
                    $scope.dataSourceMapLoginToModul = new kendo.data.DataSource({
                        data: e.data.data,
                        pageSize: 5,
                        total: e.data.data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                    $scope.isRouteLoading = false
                })

            }

            $scope.columnGridMapLoginToModul = [{
                    "field": "no",
                    "title": "No",
                    "width": "5px",
                },
                {
                    "field": "modulaplikasi",
                    "title": "Modul Aplikasi",
                    "width": "100px",
                },

            ];
            $scope.tambahMap = function() {
                medifirstService.get("sysadmin/menu/save-map-login-to-modul-aplikasi?objectloginuserfk=" +
                    $scope.item.loginUser.luid + "&objectmodulaplikasifk=" + $scope.item.modulAplikasi.id).then(function(data) {
                    if (data.statResponse) {
                        toastr.success('Sukses')
                        getMapLoginToModulApp()
                    }

                })
            }
            $scope.hapusMap = function() {
                medifirstService.get("sysadmin/menu/delete-map-login-to-modul-aplikasi?objectloginuserfk=" +
                    $scope.item.loginUser.luid +
                    "&objectmodulaplikasifk=" + $scope.dataSelected2.objectmodulaplikasifk +
                    "&id=" + $scope.dataSelected2.id).then(function(data) {
                    if (data.statResponse) {
                        toastr.success('Sukses')
                        getMapLoginToModulApp()
                    }

                })
            }

            $scope.columnGridWaktuLogin = {
                selectable: "row",
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "namauser",
                        "title": "Nama User",
                        "width": "100px",
                    },
                    {
                        "field": "namalengkap",
                        "title": "Pegawai",
                        "width": "120px",
                    },
                    {
                        "field": "expired",
                        "title": "Waktu Berakhir",
                        "width": "80px",
                    },
                    // {
                    //     "field": "status",
                    //     "title": "Status",
                    //     "width" : "80px",
                    // },
                    { command: [{ text: "Hapus", click: hapusWaktuLogin }], title: "&nbsp;", width: 70 }
                ],
            }

            function hapusWaktuLogin(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var obj = {
                    'id': dataItem.id
                }
                medifirstService.post(obj, 'sysadmin/menu/delete-end-waktu-login').then(function(e) {
                    $scope.arrEndLogin = []
                    loadDaftarWaktuLogin()
                    init()
                })
            }
            $scope.arrEndLogin = []
            $scope.cekAll = function(bool) {
                if (bool) {
                    $scope.listUserForTimeLogin.forEach(function(e) {
                        e.isChecked = true
                        $scope.arrEndLogin.push(e)
                    })
                } else {
                    $scope.listUserForTimeLogin.forEach(function(e) {
                        e.isChecked = false
                        $scope.arrEndLogin = []
                    })
                }

            }

            $scope.addUser = function(bool, data) {
                var index = $scope.arrEndLogin.indexOf(data);
                if (_.filter($scope.arrEndLogin, {
                        luid: data.luid
                    }).length === 0 && bool)

                    $scope.arrEndLogin.push(data);
                else
                    $scope.arrEndLogin.splice(index, 1);
                // }
            }
            $scope.simpanUserTime = function() {
                if ($scope.arrEndLogin.length == 0) {
                    toastr.error('Belum ada user yg di pilih')
                    return
                }
                var objSave = {
                    "user": $scope.arrEndLogin,
                    "waktuberakhir": moment($scope.item.endDateLogin).format('YYYY-MM-DD HH:mm')
                }
                medifirstService.post('sysadmin/menu/save-waktu-login', objSave).then(function(e) {
                    $scope.arrEndLogin = []
                    loadDaftarWaktuLogin()
                    init()
                })

            }
            loadDaftarWaktuLogin()

            function loadDaftarWaktuLogin() {
                medifirstService.get('sysadmin/menu/get-waktu-login').then(function(e) {
                    if (e.data.data.length > 0) {
                        for (let i = 0; i < e.data.data.length; i++) {
                            e.data.data[i].no = i + 1;
                        }
                    }
                    $scope.dataSourceWaktuLogin = new kendo.data.DataSource({
                        data: e.data.data,
                        pageSize: 20,
                        total: e.data.data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                })

            }
            $scope.cariUserTime = function() {
                $scope.listTempUser = []
                if ($scope.item.cariUser != undefined) {
                    var ruangan = $scope.item.cariUser.toLowerCase()
                    for (let i = 0; i < $scope.lisUserArr.length; i++) {
                        var arrRuang = $scope.lisUserArr[i].namauser.toLowerCase()
                        if (arrRuang.indexOf(ruangan) != -1) {
                            $scope.listTempUser.push($scope.lisUserArr[i])
                        }
                    }
                    $scope.listUserForTimeLogin = []
                    $scope.listUserForTimeLogin = $scope.listTempUser
                }
                if ($scope.item.cariUser == "" || $scope.item.cariUser == undefined)
                    $scope.listUserForTimeLogin = $scope.lisUserArr
            }
            var timeoutPromise;
            $scope.$watch('item.cariUserS', function(newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function() {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("namauser", newVal)
                    }
                }, 500)
            })

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#kGrid3").data("kendoGrid");
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
            $scope.resetFilter = function() {
                var dataGrid = $("#kGrid3").data("kendoGrid");
                dataGrid.dataSource.filter({});
                delete $scope.item.cariUserS
            }

            $scope.saveNewUser = function() {
                if ($scope.new.namaUser == undefined) {
                    toastr.error('Nama User Harus di isi', 'Error')
                    return
                }
                if ($scope.new.kataKunciPass == undefined) {
                    toastr.error('Kata Kunci Harus di isi', 'Error')
                    return
                }
                if ($scope.new.kataKunciPass != $scope.new.kataKunciConfirm) {
                    toastr.error('Kata kunci tidak sama', 'Error')
                    return
                }
                if ($scope.new.kelompokUser == undefined) {
                    toastr.error('Kelompok User Harus di isi', 'Error')
                    return
                }
                if ($scope.new.pegawai == undefined) {
                    toastr.error('Pegawai Harus di isi', 'Error')
                    return
                }
                if ($scope.new.statusIp != undefined) {
                    var ip = true
                }
                var objSave = {
                    'id': $scope.new.idlogin,
                    'katasandi': $scope.new.kataKunciPass,
                    'namauser': $scope.new.namaUser,
                    'objectkelompokuserfk': $scope.new.kelompokUser.id,
                    'objectpegawaifk': $scope.new.pegawai.id,
                    'waktuberakhir': $scope.new.endDateLogin != undefined ? moment($scope.new.endDateLogin).format('YYYY-MM-DD HH:mm') : '',
                    'statuspublic': ip
                }
                medifirstService.post('sysadmin/menu/save-new-user', objSave).then(function(e) {
                    $scope.new.idlogin = ''
                    delete $scope.new.namaUser
                    delete $scope.new.kataKunciPass
                    delete $scope.new.kataKunciConfirm
                    delete $scope.new.kelompokUser
                    delete $scope.new.pegawai
                    loadNewUser()
                    loadDaftarWaktuLogin()

                }, function(error) {
                    // toastr.error(JSON.stringify(error.message),'Error')
                })
            }
            medifirstService.getPart('sysadmin/menu/get-pegawai-part', true, true, 10).then(function(e) {
                $scope.listNewPegawai = e
            })
            var d = new Date();
            d.setYear(d.getFullYear() + 1);
            $scope.new.endDateLogin = d
            loadNewUser()
            $scope.addNewUser = function() {
                $scope.dialogPopup.center().open()
            }
            $scope.optionGridNewUser = {
                toolbar: [{
                    name: "create",
                    text: "Input Baru",
                    template: '<button ng-click="addNewUser()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button>'

                }],
                selectable: 'row',
                pageable: true,
                columns: [{
                        "field": "no",
                        "title": "No",
                        "width": 15,
                    },
                    {
                        "field": "namauser",
                        "title": "Nama User",
                        "width": 80,
                    },
                    {
                        "field": "namalengkap",
                        "title": "Pegawai",
                        "width": 110,
                    },
                    {
                        "field": "kelompokuser",
                        "title": "Kelompok User",
                        "width": 80,
                    },
                    {
                        command: [
                            { name: "edit", text: "Edit", click: editNewUser },
                            { text: "Hapus", click: hapusNewUser, imageClass: "k-icon k-delete" }
                        ],
                        title: "&nbsp;",
                        width: 40
                    }

                ],

            };

            function hapusNewUser(e) {
                e.preventDefault();
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                var objSave = {
                    'id': dataItem.id,
                }
                medifirstService.post('sysadmin/menu/delete-new-user', objSave).then(function(e) {
                    loadNewUser()
                    loadDaftarWaktuLogin()
                }, function(error) {
                    toastr.error(JSON.stringify(error), 'Error')
                })
            }

            function editNewUser(e) {

                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                $scope.isEdit = true
                $scope.new.endDateLogin = undefined
                $scope.new.idlogin = dataItem.id
                $scope.new.namaUser = dataItem.namauser
                $scope.new.kelompokUser = { id: dataItem.objectkelompokuserfk, kelompokuser: dataItem.kelompokuser }
                medifirstService.get('sysadmin/menu/get-pegawai-part?idPeg=' + dataItem.objectpegawaifk).then(function(r) {
                    $scope.listNewPegawai.add(r.data[0])
                    $scope.new.pegawai = { id: r.data[0].id, namalengkap: r.data[0].namalengkap }
                })
                $scope.dialogPopup.center().open()
            }

            function loadNewUser() {
                medifirstService.get('sysadmin/menu/get-daftar-user').then(function(e) {
                    for (let i = 0; i < e.data.data.length; i++) {
                        e.data.data[i].no = i + 1;
                    }
                    $scope.sourceNewUser = new kendo.data.DataSource({
                        data: e.data.data,
                        pageSize: 20,
                        total: e.data.data,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {}
                            }
                        }
                    });
                })
            }
            $scope.batalNewUser = function() {
                $scope.new.idlogin = ''
                delete $scope.new.namaUser
                delete $scope.new.kataKunciPass
                delete $scope.new.kataKunciConfirm
                delete $scope.new.kelompokUser
                delete $scope.new.pegawai

                $scope.dialogPopup.close()
            }
            $scope.$watch('new.cariPegawai', function(newVal, oldVal) {
                if (newVal && newVal.id && newVal !== oldVal) {
                    apply("namalengkap", newVal.namalengkap)
                }
            })
            $scope.$watch('new.cariKelompokUser', function(newVal, oldVal) {
                if (newVal && newVal.id && newVal !== oldVal) {
                    apply("kelompokuser", newVal.kelompokuser)
                }
            })
            $scope.$watch('new.cariUser', function(newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function() {
                    if (newVal && newVal !== oldVal) {
                        apply("namauser", newVal)
                    }
                }, 500)
            })

            function apply(filterField, filterValue) {
                var dataGrid = $("#kNewUser").data("kendoGrid");
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
            $scope.reset = function() {
                    var dataGrid = $("#kNewUser").data("kendoGrid");
                    dataGrid.dataSource.filter({});
                    delete $scope.new.cariPegawai
                    delete $scope.new.cariKelompokUser
                    delete $scope.new.cariUser
                }
                // *******END


        }
    ]);
});