VERSION 5.00
Begin VB.Form frmPendaftaran 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Pendaftaran"
   ClientHeight    =   1140
   ClientLeft      =   45
   ClientTop       =   375
   ClientWidth     =   5565
   Icon            =   "frmPendaftaran.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   1140
   ScaleWidth      =   5565
   StartUpPosition =   3  'Windows Default
   Begin VB.PictureBox Picture1 
      AutoRedraw      =   -1  'True
      BackColor       =   &H00FFFFFF&
      Height          =   525
      Left            =   0
      ScaleHeight     =   31
      ScaleMode       =   3  'Pixel
      ScaleWidth      =   421
      TabIndex        =   1
      TabStop         =   0   'False
      Top             =   1680
      Width           =   6375
   End
   Begin VB.Label lblStatus 
      Caption         =   "Cetak Antrian"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   9.75
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   240
      TabIndex        =   0
      Top             =   360
      Width           =   2055
   End
End
Attribute VB_Name = "frmPendaftaran"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False

Public Function Pendaftaran(ByVal QueryText As String) As Byte()
    On Error Resume Next
    Dim Root As JNode
    Dim Param1() As String
    Dim Param2() As String
    Dim Param3() As String
    Dim Param4() As String
    Dim Param5() As String
    Dim Param6() As String
    Dim Param7() As String
    Dim Param8() As String
    Dim Param9() As String
    Dim Param10() As String
    Dim Param11() As String
    Dim Param12() As String
    Dim arrItem() As String
    
   
    If CN.State = adStateClosed Then Call openConnection
        
    
    If Len(QueryText) > 0 Then
        arrItem = Split(QueryText, "&")
        Param1 = Split(arrItem(0), "=")
        Param2 = Split(arrItem(1), "=")
        Param3 = Split(arrItem(2), "=")
        Param4 = Split(arrItem(3), "=")
        Param5 = Split(arrItem(4), "=")
        Param6 = Split(arrItem(5), "=")
        Select Case Param1(0)
            Case "cek-konek"
                lblStatus.Caption = "Cek"
                Set Root = New JNode
                Root("Status") = "Ok!!"
            
            Case "cetak-kartupasien"
                lblStatus.Caption = "Cetak Kartu Pasien"
'               Call cetak_KartuPasien(Param2(1))
'                Call cetak_KartuPasienNew(Param2(1))
                Call frmKartuPasienNew.Cetakkartu(Param2(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-kartupasien=1&id=1231=false
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                
            Case "cetak-buktipendaftaran"
                Param3 = Split(arrItem(2), "=")
                Param4 = Split(arrItem(3), "=")
                lblStatus.Caption = "Cetak Bukti Pendaftaran"
                Call frmCetakPendaftaran.cetakBuktiPendaftaran(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec=2c9090ce5af40be8015af40eb1f80006&view=false
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
             Case "cetak-tracer"
                lblStatus.Caption = "Cetak Tracer"
                Call frmCetakPendaftaran.cetakTracer(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-tracer=1&norec=2c9090ce5af40be8015af40eb1f80006&view=false
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-sep"
                lblStatus.Caption = "Cetak SEP"
                Call frmCetakPendaftaran.cetakSep(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep=1&norec=40288c835ba4c322015ba816f5d0002c&view=false
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            
            Case "cetak-sep-new"
                lblStatus.Caption = "Cetak SEP"
                Call frmCetakPendaftaran.cetakSepNew(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=40288c835ba4c322015ba816f5d0002c&view=false
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
                
            Case "cetak-buktilayanan"
                Param4 = Split(arrItem(3), "=")
                lblStatus.Caption = "Cetak Bukti Layanan"
                Call frmCetakPendaftaran.cetakBuktiLayanan(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan=1&norec=1707000166&strIdPegawai=1&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
             
             Case "cetak-buktilayanan-ruangan"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                lblStatus.Caption = "Cetak Bukti Layanan Ruangan"
                Call frmCetakPendaftaran.cetakBuktiLayananRuangan(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=1707000166&strIdPegawai=1&strIdRuangan=&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                                        
            Case "cetak-labelpasien"
                Param4 = Split(arrItem(3), "=")
                lblStatus.Caption = "Cetak Label Pasien"
                If InStr(1, UCase(GetTxt("Setting.ini", "Printer", "LabelPasien")), "ZT410") > 1 Then
                    Call frmCetakPendaftaran.cetakLabelPasienZebra(Param2(1), Param3(1), Param4(1))
                Else
                    Call frmCetakPendaftaran.cetakLabelPasien(Param2(1), Param3(1), Param4(1))
                End If
                
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien=1&norec=2c9090ce5af40be8015af40eb1f80006&view=false&qty=2
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                'lab manual
            Case "cetak-hasil-lab"
                Param2 = Split(arrItem(1), "=")
                Param3 = Split(arrItem(2), "=")
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(6), "=")
                Param1 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(7), "=")
                Param8 = Split(arrItem(8), "=")
                Param9 = Split(arrItem(9), "=")
                Param10 = Split(arrItem(10), "=")
                Param11 = Split(arrItem(11), "=")
                Param12 = Split(arrItem(12), "=")
                Call frmExpertiseLaboratorium.Cetak(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param1(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1))
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "@epic"
            Case "cetak-summarylist"
                lblStatus.Caption = "Cetak Summary list Pasien Rawat Jalan"
                Call frmCetakPendaftaran.cetakSummaryList(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-summarylist=1&norec=2c9090ce5af40be8015af40eb1f80006&view=false
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            '
'            Case "cetak-lembarmasukkeluar"
'                lblStatus.Caption = "Cetak Lembar Masuk Keluar Pasien Rawat Inap"
'                Call frmCetakPendaftaran.cetakLembarMasuk(Param2(1), Param3(1))
'                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar=1&norec=2c9090ce5af40be8015af40eb1f80006&view=false
'                Set Root = New JNode
'                Root("Status") = "Sedang Dicetak!!"
'                Root("by") = "grh@epic"
                
            
            Case "cetak-lembarmasukkeluar-byNorec"
                Param4 = Split(arrItem(3), "=")
                lblStatus.Caption = "Cetak Lembar Masuk Keluar Pasien Rawat Inap"
                Call frmCetakPendaftaran.cetakLembarMasukByNorec_APD_Polri(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar=1&norec=2c9090ce5af40be8015af40eb1f80006&view=false
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
             
             Case "cetak-form-kunjungan-pasien-byNorecPd"
                Param3 = Split(arrItem(2), "=")
                lblStatus.Caption = "Cetak Form Kunjungan Pasien"
                Call frmCetakPendaftaran.cetakFormKunjunganPasien(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-lembarmasukkeluar=1&norec=2c9090ce5af40be8015af40eb1f80006&view=false
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-lembarpersetujuan"
                lblStatus.Caption = "Cetak Lembar Persetjuan Rawat Inap"
                Call frmCetakPendaftaran.cetakPersetujuan(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-summarylist=1&norec=2c9090ce5af40be8015af40eb1f80006&view=false
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
        
            Case "cetak-pasiendaftar"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                
                lblStatus.Caption = "Cetak Pasien Daftar"
                Call frmCRCetakDaftarPasien.CetakPasienDaftar(Param2(1), Param3(1), Param4(1), Param5(1), (Param6(1)), Param7(1), Param8(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-pasiendaftar=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-02%2023:59:59&strIdRuangan=6&strIdDepartement=18&strIdKelompokPasien=1&strIdPegawai=1&view=true
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-pasiendaftar=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-02%2023:59:59&strIdRuangan=&strIdDepartement=&strIdKelompokPasien=&strIdPegawai=1&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            
            Case "cetak-sensus"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                
                lblStatus.Caption = "Cetak Sensus"
                Call frmCRCetakSensus.CetakSensus(Param2(1), Param3(1), Param4(1), Param5(1), (Param6(1)), Param7(1), Param8(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-pasiendaftar=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-02%2023:59:59&strIdRuangan=6&strIdDepartement=18&strIdKelompokPasien=1&strIdPegawai=1&view=true
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-pasiendaftar=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-02%2023:59:59&strIdRuangan=&strIdDepartement=&strIdKelompokPasien=&strIdPegawai=1&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-sensusbpjs"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                
                lblStatus.Caption = "Cetak Sensus BPJS"
                Call frmCRCetakSensusBPJS.CetakSensusBPJS(Param2(1), Param3(1), Param4(1), Param5(1), (Param6(1)), Param7(1), Param8(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sensusbpjs=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-02%2023:59:59&strIdRuangan=6&strIdDepartement=18&strIdKelompokPasien=2&strIdPegawai=1&view=true
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sensusbpjs=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-02%2023:59:59&strIdRuangan=&strIdDepartement=&strIdKelompokPasien=2&strIdPegawai=1&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-buktilayanan-ruangan-pertindakan"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                lblStatus.Caption = "Cetak Bukti Layanan Ruangan"
                Call frmCetakPendaftaran.cetakBuktiLayananRuanganPerTindakan(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=1707000166&strIdPegawai=1&strIdRuangan=&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                '
                
            Case "cetak-buktilayanan-norec_apd"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                lblStatus.Caption = "Cetak Bukti Layanan norec apd"
                Call frmCetakPendaftaran.cetakBuktiLayananRuanganPerTindakanByNorec(Param2(1), Param3(1), Param4(1), Param5(1))
                
'                Call frmCetakPendaftaran.cetakBuktiLayananNorec_apd               (Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-norec_apd=1&norec=norec|norec|norec&strIdPegawai=320263&strIdRuangan=-&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "as@epic"
                
               
            Case "cetak-buktilayanan-jasa-norec_apd"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                lblStatus.Caption = "Cetak Bukti Layanan Jasa norec apd"
                Call frmCetakPendaftaran.cetakBuktiLayananJasa(Param2(1), Param3(1), Param4(1), Param5(1))
                
'                Call frmCetakPendaftaran.cetakBuktiLayananNorec_apd               (Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-norec_apd=1&norec=norec|norec|norec&strIdPegawai=320263&strIdRuangan=-&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "s@epic"
                'cetakBuktiLayananNorec_apd
                
            Case "cetak-suratPerjanjian"
                Param2 = Split(arrItem(1), "=")
                Param3 = Split(arrItem(2), "=")
                Param4 = Split(arrItem(3), "=")
                lblStatus.Caption = "Cetak Surat Perjanjian"
                Call frmCRCetakPasienPerjanjian.CetakPerjanjian(Param2(1), Param3(1), Param4(1))
                
'                Call frmCetakPendaftaran.cetakBuktiLayananNorec_apd               (Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-norec_apd=1&norec=norec|norec|norec&strIdPegawai=320263&strIdRuangan=-&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "s@epic"
            
            Case "cetak-suratPerjanjian-bypasienID"
                Param2 = Split(arrItem(1), "=")
                Param3 = Split(arrItem(2), "=")
                Param4 = Split(arrItem(3), "=")
                lblStatus.Caption = "Cetak Surat Perjanjian"
                Call frmCRCetakPasienPerjanjian.CetakPerjanjianbypasienID(Param2(1), Param3(1), Param4(1))
                
'                Call frmCetakPendaftaran.cetakBuktiLayananNorec_apd               (Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-norec_apd=1&norec=norec|norec|norec&strIdPegawai=320263&strIdRuangan=-&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "s@epic"
                
            Case "cetak-buktilayananBedah-norec_apd"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                lblStatus.Caption = "Cetak Bukti Layanan norec apd"
                Call frmCetakPendaftaran.cetakBuktiLayananRuanganBedah(Param2(1), Param3(1), Param4(1), Param5(1))
                
'                Call frmCetakPendaftaran.cetakBuktiLayananNorec_apd               (Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-norec_apd=1&norec=norec|norec|norec&strIdPegawai=320263&strIdRuangan=-&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "as@epic"
            
            Case "RIS"
                Dim lngReturnCode As Long
                Dim strShellCommand As String
                strShellCommand = "c:\Program Files\Mozilla Firefox\firefox.exe zetta://URL=http://192.168.12.11&LID=dok&LPW=dok&LICD=003&PID=" & Param2(1) & "&VTYPE=" & Param3(1) & ""
                 lngReturnCode = Shell(strShellCommand, vbNormalFocus)
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "as@epic"
                
             Case "cetak-buktipendaftaran-online"
                lblStatus.Caption = "Cetak Bukti Pendaftaran Online"
                Call frmCetakPendaftaran.cetakBuktiPendaftaranOnlines(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec=2c9090ce5af40be8015af40eb1f80006&view=false
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-lembar-identitas"
                'Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                lblStatus.Caption = "Cetak Identitas Pasien"
                Call frmLembarIdentitas.Cetak(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec=2c9090ce5af40be8015af40eb1f80006&view=false
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-labelpasien-satu"
                Param4 = Split(arrItem(3), "=")
                lblStatus.Caption = "Cetak Label Pasien"
                
                'If InStr(1, UCase(GetTxt("Setting.ini", "Printer", "LabelPasien")), "ZT410") > 1 Then
                '   Call frmCetakPendaftaran.cetakLabelPasienZebra(Param2(1), Param3(1), Param4(1))
                'Else
                    Call frmCetakPendaftaran.cetakLabelPasien_3(Param2(1), Param3(1), Param4(1))
                'End If
                
             Case "cetak-triage"
                lblStatus.Caption = "Cetak Summary list Pasien Rawat Jalan"
                Call frmCetakPendaftaran.cetakTriage(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-summarylist=1&norec=2c9090ce5af40be8015af40eb1f80006&view=false
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "simpan-foto-pasien"
                Param4 = Split(arrItem(3), "=")
'                Param5 = Split(arrItem(4), "=")
'                Param6 = Split(arrItem(5), "=")
                lblStatus.Caption = "Simpan Foto"
                If frmFoto.LoadForm(Param2(1), Param3(1), Param4(1)) = "DONE" Then
                    'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-summarylist=1&norec=2c9090ce5af40be8015af40eb1f80006&view=false
                    
                End If
                Set Root = New JNode
                    Root("Status") = "nampil atuh!!"
                    Root("by") = "as@epic & efan"
                    
            Case "cetak-blangko-bpjs"
                Param4 = Split(arrItem(3), "=")
                lblStatus.Caption = "Cetak Blangko BPJS"
                Call frmCetakPendaftaran.cetakBlangkoBpjs(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=40288c835ba4c322015ba816f5d0002c&view=false
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "ea@epic"
            
            Case "cetak-lembar-ranap"
                'Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                lblStatus.Caption = "Cetak lembar ranap"
                Call frmLembarRanap.Cetak(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
'                Call frmCetakPendaftaran.cetakLembarIdentitas(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktipendaftaran=1&norec=2c9090ce5af40be8015af40eb1f80006&view=false
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            
            Case "cetak-buktilayanan-order-penunjang"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                lblStatus.Caption = "Cetak Bukti Layanan Order Penunjang"
                Call frmBuktiLayananOrder.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-order-penunjang=1&norec=1707000166&strIdPegawai=1&strIdRuangan=&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "ea@epic"
                
            Case "cetak-gelangpasien"
                Param4 = Split(arrItem(3), "=")
                lblStatus.Caption = "Cetak Gelang Pasien"
                Call frmCetakPendaftaran.cetakGelangPasien(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien=1&norec=2c9090ce5af40be8015af40eb1f80006&view=false&qty=2
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
           Case "cetak-gelang"
                Param2 = Split(arrItem(1), "=")
                Param3 = Split(arrItem(2), "=")

            
                lblStatus.Caption = "Cetak Gelang Dewasa"
                Call frmGelangPasienNewPolri.CetakGelangPasienAll(Param2(1), Param3(1))
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "s@epic"
            Case Else
                Set Root = New JNode
                Root("Status") = "Error"
        End Select
        
    End If
    
    
    With GossRESTMain.STM
        .Open
        .Type = adTypeText
        .CharSet = "utf-8"
        .WriteText Root.JSON, adWriteChar
        .Position = 0
        .Type = adTypeBinary
        Pendaftaran = .Read(adReadAll)
        .Close
    End With
    If CN.State = adStateOpen Then CN.Close
    Unload Me
    Exit Function
Cetak:
' MsgBox Err.Description
End Function

Private Sub CETAK_Billing(strNoregistrasi As String, jumlahCetak As Integer)
On Error GoTo errLoad
    Dim prn As Printer
    Dim strPrinter As String
  
    ReadRs "select pp.norec,pp.tglpelayanan,pr.id as prid, pr.namaproduk, pp.jumlah,kl.id as klid, kl.namakelas, " & _
           "ru.id as ruid,ru.namaruangan,pp.produkfk,pp.hargajual,pg.id as pgid,pg.namalengkap,sp.nostruk, " & _
           "jpp.id as jppid,jpp.jenispetugaspe from " & _
           "pasiendaftar_t As pd " & _
           "inner  join antrianpasiendiperiksa_t as apd on apd.noregistrasifk= pd.norec " & _
           "inner join pelayananpasien_t as pp on pp.noregistrasifk= apd.norec " & _
           "inner join produk_m as pr ON pr.id= pp.produkfk " & _
           "inner JOIN  kelas_m as kl ON kl.id= apd.objectkelasfk " & _
           "inner join ruangan_m as ru ON ru.id= apd.objectruanganfk " & _
           "inner join pelayananpasienpetugas_t as ptu ON ptu.pelayananpasien= pp.norec " & _
           "inner join jenispetugaspelaksana_m as jpp ON jpp.id= ptu.objectjenispetugaspefk " & _
           "inner join pegawai_m as pg ON pg.id= ptu.objectpegawaifk " & _
           "left join strukpelayanan_t as sp ON sp.norec= pp.strukfk " & _
           "Where pd.tglpulang Is Not Null " & _
           "and pd.noregistrasi='" & strNoregistrasi & "'"
    
    
    strPrinter = GetTxt("Setting.ini", "Printer", "BuktiPendaftaran")
    If Printers.Count > 0 Then
        For Each prn In Printers
            If prn.DeviceName = strPrinter Then
                Set Printer = prn
                Exit For
            End If
        Next prn
    End If
    
    For i = 0 To rs.RecordCount - 1
        'MsgBox "CETAK"
        Printer.fontSize = 10
        Printer.Print "     RUMAH SAKIT ANAK DAN BUNDA"
        Printer.fontSize = 18
        Printer.FontBold = True
        Printer.Print "      HARAPAN KITA"
        Printer.FontBold = False
        Printer.fontSize = 10
        Printer.Print "   Jl. S. Parman Kav.87, Slipi, Jakarta Barat"
        Printer.Print "      Telp. 021-5668286, 021-5668284"
        Printer.Print "      Fax.  021-5601816, 021-5673832"
        Printer.Print "___________________________________"
        Printer.Print ""
        Printer.Print "Tanggal :" & Format(Now(), "yyyy MM dd hh:mm")
        Printer.Print ""
        Printer.fontSize = 12
          '1,3,,4,6,8,10,12,13,15
        Printer.Print rs(1) & " " & rs(1) & " " & rs(3) & " " & rs(4) & " " & rs(6) & " " & rs(8) & " " & rs(10) & " " & rs(12) & " "
        
        Printer.EndDoc
    Next
    
    Exit Sub
errLoad:
End Sub


Private Sub cetak_KartuPasien(strNocm As String)
    On Error GoTo errLoad
    Dim prn As Printer
    Dim strPrinter As String
    
    strSQL = "SELECT ps.namapasien  +  ' ( '  +   jk.reportdisplay  +  ' ) ' as namapasien ,ps.nocm, ps.tgllahir," & _
            "ps.namaayah, case when ps.namakeluarga is null then '-' else ps.namakeluarga end as namakeluarga,ps.namasuamiistri ,ps.objectjeniskelaminfk,ps.objectstatusperkawinanfk " & _
            " from pasien_m ps INNER JOIN jeniskelamin_m jk on jk.id=ps.objectjeniskelaminfk " & _
            " where ps.id=" & strNocm & " "
      
     ReadRs strSQL
      
    strPrinter = GetTxt("Setting.ini", "Printer", "KartuPasien")
    If Printers.Count > 0 Then
        For Each prn In Printers
            If prn.DeviceName = strPrinter Then
                Set Printer = prn
                Exit For
            End If
        Next prn
    End If
    
'    Call DrawBarcode(Text1, Picture2)
    
    Dim msg As String
    Dim ayah As String
    Dim ayah2 As String
    Dim splt() As String
    
    If IsNull(rs!objectjeniskelaminfk) <> 1 Then
        If rs!objectstatusperkawinanfk = 2 Then 'kawin
            ayah = IIf(IsNull(rs!namakeluarga) = True, "", rs!namakeluarga)
        Else
            ayah = IIf(IsNull(rs!namakeluarga) = True, "", rs!namakeluarga)
        End If
    Else
        If rs!objectstatusperkawinanfk = 2 Then 'kawin
            ayah = ""
        Else
            ayah = IIf(IsNull(rs!namakeluarga) = True, "", rs!namakeluarga)
        End If
    End If
    If ayah <> "" Then
        splt = Split(ayah, " ")
        ayah = splt(0)
    End If
    ayah2 = IIf(IsNull(rs!tgllahir) = True, "", Format(rs!tgllahir, "dd-MMM-yyyy"))
    Printer.FontName = "Tahoma"
    Printer.fontSize = 10
    Printer.Print ""
    Printer.Print ""
    Printer.Print ""
    Printer.Print ""
    Printer.FontBold = True
'    Printer.fontSize = 8
'    Printer.Print "                                                    " & Left(ayah, 17)
    Printer.fontSize = 10
    Printer.Print "                                        " & Left(rs!namapasien, 17)
    Printer.fontSize = 8
'    Printer.Print "                                                    " & ayah2
'    Printer.Print ""
    
    Printer.FontBold = False
'    Printer.FontName = "Free 3 of 9 Extended" '"Bar-Code 39"
'    Printer.fontSize = 27 '20
'    Printer.CurrentX = 2900
'    Printer.CurrentY = 2250
    Call make128(rs!noCm)
    Printer.PaintPicture Picture1.Image, 2500, 2250
    
    Printer.FontBold = True
    Printer.FontName = "Tahoma"
    Printer.fontSize = 17
    Printer.CurrentX = 300
    Printer.CurrentY = 2550
    Printer.Print rs!noCm
    Printer.EndDoc
    
    
    
'     PrintFrontSideOnly strPrinter, "", "", msg, RS!nocm, RS!namapasien, ayah, ayah2
    
   Exit Sub
   
errLoad:
    MsgBox Err.Number & " " & Err.Description
End Sub



Private Sub make128(angka As Double)
Dim x As Long, Y As Long, pos As Long
Dim Bardata As String
Dim Cur As String
Dim CurVal As Long
Dim chksum As Long
Dim temp As String
Dim bc(106) As String
    'code 128 is basically the ASCII chr set.
    '4 element sizes : 1=narrowest, 4=widest
    bc(0) = "212222" '<SPC>
    bc(1) = "222122" '!
    bc(2) = "222221" '"
    bc(3) = "121223" '#
    bc(4) = "121322" '$
    bc(5) = "131222" '%
    bc(6) = "122213" '&
    bc(7) = "122312" ''
    bc(8) = "132212" '(
    bc(9) = "221213" ')
    bc(10) = "221312" '*
    bc(11) = "231212" '+
    bc(12) = "112232" ',
    bc(13) = "122132" '-
    bc(14) = "122231" '.
    bc(15) = "113222" '/
    bc(16) = "123122" '0
    bc(17) = "123221" '1
    bc(18) = "223211" '2
    bc(19) = "221132" '3
    bc(20) = "221231" '4
    bc(21) = "213212" '5
    bc(22) = "223112" '6
    bc(23) = "312131" '7
    bc(24) = "311222" '8
    bc(25) = "321122" '9
    bc(26) = "321221" ':
    bc(27) = "312212" ';
    bc(28) = "322112" '<
    bc(29) = "322211" '=
    bc(30) = "212123" '>
    bc(31) = "212321" '?
    bc(32) = "232121" '@
    bc(33) = "111323" 'A
    bc(34) = "131123" 'B
    bc(35) = "131321" 'C
    bc(36) = "112313" 'D
    bc(37) = "132113" 'E
    bc(38) = "132311" 'F
    bc(39) = "211313" 'G
    bc(40) = "231113" 'H
    bc(41) = "231311" 'I
    bc(42) = "112133" 'J
    bc(43) = "112331" 'K
    bc(44) = "132131" 'L
    bc(45) = "113123" 'M
    bc(46) = "113321" 'N
    bc(47) = "133121" 'O
    bc(48) = "313121" 'P
    bc(49) = "211331" 'Q
    bc(50) = "231131" 'R
    bc(51) = "213113" 'S
    bc(52) = "213311" 'T
    bc(53) = "213131" 'U
    bc(54) = "311123" 'V
    bc(55) = "311321" 'W
    bc(56) = "331121" 'X
    bc(57) = "312113" 'Y
    bc(58) = "312311" 'Z
    bc(59) = "332111" '[
    bc(60) = "314111" '\
    bc(61) = "221411" ']
    bc(62) = "431111" '^
    bc(63) = "111224" '_
    bc(64) = "111422" '`
    bc(65) = "121124" 'a
    bc(66) = "121421" 'b
    bc(67) = "141122" 'c
    bc(68) = "141221" 'd
    bc(69) = "112214" 'e
    bc(70) = "112412" 'f
    bc(71) = "122114" 'g
    bc(72) = "122411" 'h
    bc(73) = "142112" 'i
    bc(74) = "142211" 'j
    bc(75) = "241211" 'k
    bc(76) = "221114" 'l
    bc(77) = "413111" 'm
    bc(78) = "241112" 'n
    bc(79) = "134111" 'o
    bc(80) = "111242" 'p
    bc(81) = "121142" 'q
    bc(82) = "121241" 'r
    bc(83) = "114212" 's
    bc(84) = "124112" 't
    bc(85) = "124211" 'u
    bc(86) = "411212" 'v
    bc(87) = "421112" 'w
    bc(88) = "421211" 'x
    bc(89) = "212141" 'y
    bc(90) = "214121" 'z
    bc(91) = "412121" '{
    bc(92) = "111143" '|
    bc(93) = "111341" '}
    bc(94) = "131141" '~
    bc(95) = "114113" '<DEL>        *not used in this sub
    bc(96) = "114311" 'FNC 3        *not used in this sub
    bc(97) = "411113" 'FNC 2        *not used in this sub
    bc(98) = "411311" 'SHIFT        *not used in this sub
    bc(99) = "113141" 'CODE C       *not used in this sub
    bc(100) = "114131" 'FNC 4       *not used in this sub
    bc(101) = "311141" 'CODE A      *not used in this sub
    bc(102) = "411131" 'FNC 1       *not used in this sub
    bc(103) = "211412" 'START A     *not used in this sub
    bc(104) = "211214" 'START B
    bc(105) = "211232" 'START C     *not used in this sub
    bc(106) = "2331112" 'STOP

    Picture1.Cls
'    If Text1.Text = "" Then Exit Sub
    pos = 20
    Bardata = angka 'Text1.Text

    'Check for invalid characters, calculate check sum & build temp string
    For x = 1 To Len(Bardata)
        Cur = Mid$(Bardata, x, 1)
        If Cur < " " Or Cur > "~" Then
            Picture1.Print "Invalid Character(s)"
            Exit Sub
        End If
        CurVal = Asc(Cur) - 32
        temp = temp + bc(CurVal)
        chksum = chksum + CurVal * x
    Next
    
    'Add start, stop & check characters
    chksum = (chksum + 104) Mod 103
    temp = bc(104) & temp & bc(chksum) & bc(106)

    'Generate Barcode
    For x = 1 To Len(temp)
        If x Mod 2 = 0 Then
                'SPACE
                pos = pos + (Val(Mid$(temp, x, 1))) + 1
        Else
                'BAR
                For Y = 1 To (Val(Mid$(temp, x, 1)))
                    Picture1.Line (pos, 1)-(pos, 58 - 0 * 8)
                    pos = pos + 1
                Next
        End If
    Next

    'Add Label?
'    If Check1(1).Value Then
'        Picture1.CurrentX = 30 + Len(Bardata) * (3 + 1 * 2) 'kinda center
'        Picture1.CurrentY = 50
'        Picture1.Print Bardata;
'    End If
End Sub

Private Sub cetak_KartuPasienNew(strNocm As String)
'    On Error GoTo errLoad
    Dim prn As Printer
    Dim strPrinter As String
    
    strSQL = "SELECT ps.namapasien  +  ' ( '  +   jk.reportdisplay  +  ' ) ' as namapasien ,ps.nocm, ps.tgllahir," & _
            "ps.namaayah, case when ps.namakeluarga is null then '-' else ps.namakeluarga end as namakeluarga,ps.namasuamiistri ,ps.objectjeniskelaminfk,ps.objectstatusperkawinanfk " & _
            " from pasien_m ps INNER JOIN jeniskelamin_m jk on jk.id=ps.objectjeniskelaminfk " & _
            " where ps.id=" & strNocm & " "
      
     ReadRs strSQL
      
    strPrinter = GetTxt("Setting.ini", "Printer", "KartuPasien")
    If Printers.Count > 0 Then
        For Each prn In Printers
            If prn.DeviceName = strPrinter Then
                Set Printer = prn
                Exit For
            End If
        Next prn
    End If
    
'    Call DrawBarcode(Text1, Picture2)
    
'    Dim msg As String
    Dim ayah As String
    Dim ayah2 As String
    Dim splt() As String
    Dim Inisial, underline, tgllahir As String
    Inisial = "" '"KARTU PASIEN"
    If IsNull(rs!objectjeniskelaminfk) <> 1 Then
        If rs!objectstatusperkawinanfk = 2 Then 'kawin
            ayah = IIf(IsNull(rs!namakeluarga) = True, "", rs!namakeluarga)
        Else
            ayah = IIf(IsNull(rs!namakeluarga) = True, "", rs!namakeluarga)
        End If
    Else
        If rs!objectstatusperkawinanfk = 2 Then 'kawin
            ayah = ""
        Else
            ayah = IIf(IsNull(rs!namakeluarga) = True, "", rs!namakeluarga)
        End If
    End If
    
    If ayah <> "" Then
        splt = Split(ayah, " ")
        ayah = splt(0)
    End If
    ayah2 = IIf(IsNull(rs!tgllahir) = True, "", Format(rs!tgllahir, "dd-MMM-yyyy"))
    Printer.FontName = "Tahoma"
    Printer.fontSize = 10
    Printer.Print ""
    Printer.Print ""
    Printer.Print ""
    Printer.Print ""
    Printer.FontBold = True
'    Printer.fontSize = 8
'    Printer.Print "                                                    " & Left(ayah, 17)
    Printer.fontSize = 10
'    Printer.FontUnderline = True
    Printer.Print "                          " & Inisial
'    Printer.FontUnderline = False
    Printer.Print ""
    Printer.fontSize = 14
    Printer.Print "  " & rs!noCm
    Printer.FontBold = False
  '  Printer.Print ""
    Printer.fontSize = 10
    Printer.Print "   " & rs!namapasien
'    Printer.Print "   " & Format(rs!tgllahir, "dd/MM/yyyy")
    Printer.fontSize = 8
'    Printer.Print "                                                    " & ayah2
'    Printer.Print ""
'    Printer.FontName = "Free 3 of 9 Extended" '"Bar-Code 39"
'    Printer.fontSize = 27 '20
'    Printer.CurrentX = 2900
'    Printer.CurrentY = 2250
    Call make128(rs!noCm)
    Printer.PaintPicture Picture1.Image, -80, 2100
    Printer.FontBold = True
    Printer.FontName = "Tahoma"
    Printer.fontSize = 17
    Printer.CurrentX = 350
    Printer.CurrentY = 2200
'    Printer.Print RS!noCm
    Printer.EndDoc
    
    
    
'     PrintFrontSideOnly strPrinter, "", "", msg, RS!nocm, RS!namapasien, ayah, ayah2
    
   Exit Sub
   
'errLoad:
'    MsgBox Err.Number & " " & Err.Description
End Sub

