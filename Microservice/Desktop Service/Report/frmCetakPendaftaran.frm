VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Object = "{248DD890-BB45-11CF-9ABC-0080C7E7B78D}#1.0#0"; "mswinsck.ocx"
Begin VB.Form frmCetakPendaftaran 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakPendaftaran.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   9075
   WindowState     =   2  'Maximized
   Begin MSWinsockLib.Winsock Winsock1 
      Left            =   8040
      Top             =   6120
      _ExtentX        =   741
      _ExtentY        =   741
      _Version        =   393216
   End
   Begin VB.CommandButton cmdOption 
      Caption         =   "Option"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   315
      Left            =   4920
      TabIndex        =   4
      Top             =   480
      Width           =   975
   End
   Begin VB.CommandButton cmdCetak 
      Caption         =   "Cetak"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   315
      Left            =   3960
      TabIndex        =   3
      Top             =   480
      Width           =   975
   End
   Begin VB.ComboBox cboPrinter 
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   315
      Left            =   960
      TabIndex        =   2
      Top             =   480
      Width           =   3015
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   7005
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   9045
      DisplayGroupTree=   -1  'True
      DisplayToolbar  =   -1  'True
      EnableGroupTree =   0   'False
      EnableNavigationControls=   -1  'True
      EnableStopButton=   -1  'True
      EnablePrintButton=   -1  'True
      EnableZoomControl=   -1  'True
      EnableCloseButton=   -1  'True
      EnableProgressControl=   -1  'True
      EnableSearchControl=   -1  'True
      EnableRefreshButton=   -1  'True
      EnableDrillDown =   -1  'True
      EnableAnimationControl=   -1  'True
      EnableSelectExpertButton=   -1  'True
      EnableToolbar   =   -1  'True
      DisplayBorder   =   -1  'True
      DisplayTabs     =   -1  'True
      DisplayBackgroundEdge=   -1  'True
      SelectionFormula=   ""
      EnablePopupMenu =   -1  'True
      EnableExportButton=   -1  'True
      EnableSearchExpertButton=   -1  'True
      EnableHelpButton=   -1  'True
   End
   Begin VB.TextBox txtNamaFormPengirim 
      Height          =   495
      Left            =   3120
      TabIndex        =   1
      Top             =   600
      Width           =   2175
   End
   Begin VB.PictureBox Picture1 
      Height          =   1095
      Left            =   4080
      ScaleHeight     =   1035
      ScaleWidth      =   4155
      TabIndex        =   5
      Top             =   3000
      Width           =   4215
   End
End
Attribute VB_Name = "frmCetakPendaftaran"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New Cr_cetakBuktiPendaftaran
Dim ReportTracer As New Cr_cetakLabelTracer
Dim reportSep As New crCetakSJP
Dim reportSepNew As New crCetakSEP
Dim reportBlangko As New crCetakBlangkoBpjs
Dim reportBuktiLayanan As New Cr_cetakbuktilayanan
Dim reportBuktiLayananRuangan As New Cr_cetakbuktilayananruangan
Dim reportBuktiLayananKecil As New Cr_cetakbuktilayanankecil
Dim reportLabel As New Cr_cetakLabel 'LAMA
'Dim reportLabel As New Cr_cetakLabel_2
Dim reportLabelZebra As New Cr_cetakLabelZebra
Dim reportRmkPolri As New Cr_cetakRmkPolri
Dim reportSumList As New Cr_cetakSummaryList
Dim reportRmk As New Cr_cetakRmkBaru
Dim reportLembarGC As New Cr_cetakLembarGC
Dim reportBuktiLayananRuanganPerTindakan As New Cr_cetakbuktilayananruanganpertindakan
Dim reportBuktiLayananJasa As New Cr_cetakbuktilayananruanganpertindakanJasa
Dim reportBuktiLayananRuanganBedah As New Cr_cetakbuktilayananruanganbedah
Dim reportBuktiPendaftaranOnline As New Cr_cetakBuktiPendaftaranOnline
Dim LembarIdentitasPasien As crSuratLembarIdentitas
'Private fso As New Scripting.FileSystemObject
Dim reportKartuPasien As New Cr_cetakKartuPasien
Dim ReportResep As New crSuratPerintahKerja
'Dim WithEvents sect As CRAXDRT.Section
'Dim reportLabel_3 As New Cr_cetakLabel_3
Dim reportLabel_3 As New Cr_cetakLabel_3New
Dim reportlaporantracer As New crLaporanTracer
'Dim reportLabel_3 As New Cr_cetakLabelFoto
Dim reportTriage As New Cr_cetakHeaderTriage
Dim reportGelangPasien As New Cr_cetakLabel_3New
Dim reportFormKunjungan As New crCetakFormKunjungan

Dim ii As Integer
Dim tempPrint1 As String
Dim p As Printer
Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String

Dim bolBuktiPendaftaran As Boolean
Dim bolBuktiLayanan  As Boolean
Dim bolBuktiLayananRuangan  As Boolean
Dim bolBuktiLayananRuanganPerTindakan  As Boolean
Dim bolBuktiLayananJasa  As Boolean
Dim bolcetakSep  As Boolean
Dim bolTracer1  As Boolean
Dim bolKartuPasien  As Boolean
Dim boolLabelPasien  As Boolean
Dim boolLabelPasienZebra  As Boolean
Dim boolSumList  As Boolean
Dim boolLembarRMK As Boolean
Dim boolLembarPersetujuan As Boolean
Dim boolBuktiLayananJasa As Boolean
Dim bolBuktiLayananRuanganBedah  As Boolean
Dim boolBlangkoBpjs As Boolean
Dim boolBuktiLayananKecil As Boolean
Dim boolGelangPasien As Boolean
Dim boolLaporantracer As Boolean
Dim boolreportkunjungan As Boolean
Dim strPrinter As String
Dim strPrinter1 As String
Dim PrinterNama As String
Dim adoReport As New ADODB.Command

Private Sub cmdCetak_Click()
  If cboPrinter.Text = "" Then MsgBox "Printer belum dipilih", vbInformation, ".: Information": Exit Sub
    If bolBuktiPendaftaran = True Then
        Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        Report.PrintOut False
    ElseIf bolBuktiLayanan = True Then
        reportBuktiLayanan.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportBuktiLayanan.PrintOut False
    ElseIf bolBuktiLayananRuangan = True Then
        reportBuktiLayananRuangan.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportBuktiLayananRuangan.PrintOut False
    ElseIf bolBuktiLayananRuanganPerTindakan = True Then
        reportBuktiLayananRuanganPerTindakan.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportBuktiLayananRuanganPerTindakan.PrintOut False
    ElseIf bolcetakSep = True Then
        reportSep.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportSep.PrintOut False
    ElseIf bolTracer1 = True Then
        ReportTracer.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        ReportTracer.PrintOut False
    ElseIf bolKartuPasien = True Then
        reportKartuPasien.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportKartuPasien.PrintOut False
    ElseIf boolLabelPasien = True Then
        reportLabel.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportLabel.PrintOut False
    ElseIf boolLabelPasienZebra = True Then
        reportLabelZebra.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportLabelZebra.PrintOut False
    ElseIf boolSumList = True Then
        reportSumList.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportSumList.PrintOut False
    ElseIf boolLembarRMK = True Then
        reportRmk.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportRmk.PrintOut False
    ElseIf boolBuktiLayananJasa = True Then
        reportBuktiLayananJasa.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportBuktiLayananJasa.PrintOut False
    ElseIf boolLembarPersetujuan = True Then
        reportLembarGC.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportLembarGC.PrintOut False
    ElseIf bolBuktiLayananRuanganBedah = True Then
        reportBuktiLayananRuanganBedah.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportBuktiLayananRuanganBedah.PrintOut False
    ElseIf boolBlangkoBpjs = True Then
        reportBlangko.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportBlangko.PrintOut False
    ElseIf boolBuktiLayananKecil = True Then
        reportBuktiLayananKecil.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportBuktiLayananKecil.PrintOut False
    ElseIf boolGelangPasien = True Then
        reportGelangPasien.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportGelangPasien.PrintOut False
     ElseIf boolLaporantracer = True Then
        reportlaporantracer.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportlaporantracer.PrintOut False
     ElseIf boolreportkunjungan = True Then
        reportFormKunjungan.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportFormKunjungan.PrintOut False
    End If
    SaveSetting "SMART", "SettingPrinter", "cboPrinter", PrinterNama
End Sub

Private Sub CmdOption_Click()
    
    If bolBuktiPendaftaran = True Then
        Report.PrinterSetup Me.hwnd
    ElseIf bolBuktiLayanan = True Then
        reportBuktiLayanan.PrinterSetup Me.hwnd
    ElseIf bolBuktiLayananRuangan = True Then
        reportBuktiLayananRuangan.PrinterSetup Me.hwnd
    ElseIf bolBuktiLayananRuanganPerTindakan = True Then
        reportBuktiLayananRuanganPerTindakan.PrinterSetup Me.hwnd
    ElseIf bolBuktiLayananJasa = True Then
        reportBuktiLayananJasa.PrinterSetup Me.hwnd
    ElseIf bolcetakSep = True Then
        reportSep.PrinterSetup Me.hwnd
    ElseIf bolTracer1 = True Then
        ReportTracer.PrinterSetup Me.hwnd
    ElseIf bolKartuPasien = True Then
        reportKartuPasien.PrinterSetup Me.hwnd
    ElseIf boolLabelPasien = True Then
         reportLabel.PrinterSetup Me.hwnd
    ElseIf boolLabelPasienZebra = True Then
         reportLabelZebra.PrinterSetup Me.hwnd
    ElseIf boolSumList = True Then
         reportSumList.PrinterSetup Me.hwnd
    ElseIf boolLembarRMK = True Then
         reportRmk.PrinterSetup Me.hwnd
    ElseIf boolBuktiLayananJasa = True Then
         reportBuktiLayananJasa.PrinterSetup Me.hwnd
    ElseIf boolLembarPersetujuan = True Then
         reportLembarGC.PrinterSetup Me.hwnd
    ElseIf bolBuktiLayananRuanganBedah = True Then
        reportBuktiLayananRuanganBedah.PrinterSetup Me.hwnd
    ElseIf boolLaporantracer = True Then
        reportlaporantracer.PrinterSetup Me.hwnd
    ElseIf boolreportkunjungan = True Then
        reportFormKunjungan.PrinterSetup Me.hwnd
    ElseIf reportGelangPasien = True Then
        reportGelangPasien.PrinterSetup Me.hwnd
    End If
    
    CRViewer1.Refresh
End Sub

Private Sub Form_Load()
    
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    strPrinter = strPrinter1
    
    cboPrinter.Text = GetSetting("SMART", "SettingPrinter", "cboPrinter")
    
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCetakPendaftaran = Nothing
'    fso.DeleteFile (App.Path & "\tempbitmap.bmp")
'    Set sect = Nothing

End Sub

Public Sub cetakBuktiPendaftaran(strNorec As String, Petugas As String, view As String)
'On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String

bolBuktiPendaftaran = True
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolBlangkoBpjs = False
boolGelangPasien = False
Dim NamaPetugas As String
Dim alamatRs As String
Dim namaRs As String

    If Petugas <> "" Then
        NamaPetugas = Petugas
    Else
        NamaPetugas = "-"
    End If
    
    With Report
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            'strSQL = "SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien, " & _
                       " pd.tglregistrasi,jk.reportdisplay as jk,ap.alamatlengkap,ap.mobilephone2, " & _
                        " ru.namaruangan as ruanganPeriksa,pp.namalengkap as namadokter,kp.kelompokpasien, " & _
                        " apdp.noantrian, pg.namalengkap as petugas,pd.statuspasien From  pasiendaftar_t pd " & _
                        " INNER JOIN pasien_m ps ON pd.nocmfk = ps.id " & _
                        " left JOIN alamat_m ap ON ap.nocmfk = ps.id " & _
                        " INNER JOIN jeniskelamin_m jk ON ps.objectjeniskelaminfk = jk.id " & _
                        " INNER JOIN ruangan_m ru ON pd.objectruanganlastfk = ru.id " & _
                        " LEFT JOIN pegawai_m pp ON pd.objectpegawaifk = pp.id " & _
                        " INNER JOIN kelompokpasien_m kp ON pd.objectkelompokpasienlastfk = kp.id " & _
                        " INNER JOIN antrianpasiendiperiksa_t apdp ON apdp.noregistrasifk = pd.norec" & _
                        " LEFT JOIN logginguser_t as lg on lg.noreff=pd.norec LEFT JOIN loginuser_s as lu on lu.id=lg.objectloginuserfk LEFT JOIN pegawai_m as pg on pg.id=lu.objectpegawaifk " & _
                        " where pd.noregistrasi ='" & strNorec & "' and lg.jenislog='Pendaftaran Pasien' "
'            strSQL = "SELECT  pd.noregistrasi,    ps.nocm,    ps.tgllahir,    ps.namapasien,  pd.tglregistrasi,   jk.reportdisplay AS jk, " & _
'                     "ap.alamatlengkap,   ap.mobilephone2,    ru.namaruangan AS ruanganPeriksa,   pp.namalengkap AS namadokter, " & _
'                     "kp.kelompokpasien,  apdp.noantrian, pg.namalengkap as petugas,pd.statuspasien,apr.noreservasi,apr.tanggalreservasi " & _
'                     "FROM    pasiendaftar_t pd " & _
'                     "INNER JOIN pasien_m ps ON pd.nocmfk = ps.id LEFT JOIN alamat_m ap ON ap.nocmfk = ps.id " & _
'                     "INNER JOIN jeniskelamin_m jk ON ps.objectjeniskelaminfk = jk.id INNER JOIN ruangan_m ru ON pd.objectruanganlastfk = ru.id " & _
'                     "LEFT JOIN pegawai_m pp ON pd.objectpegawaifk = pp.id INNER JOIN kelompokpasien_m kp ON pd.objectkelompokpasienlastfk = kp.id " & _
'                     "INNER JOIN antrianpasiendiperiksa_t apdp ON apdp.noregistrasifk = pd.norec LEFT JOIN logginguser_t as lg on lg.noreff=pd.norec " & _
'                     "LEFT JOIN loginuser_s as lu on lu.id=lg.objectloginuserfk LEFT JOIN pegawai_m as pg on pg.id=lu.objectpegawaifk " & _
'                     "LEFT JOIN antrianpasienregistrasi_t as apr on apr.noreservasi=pd.statusschedule " & _
'                     "WHERE   pd.noregistrasi = '" & strNorec & "' "
                     'and lg.jenislog='Pendaftaran Pasien'"
'                        " where pd.noregistrasi ='" & strNorec & "' and lg.jenislog='Pendaftaran Pasien' "
            strSQL = "SELECT  pd.noregistrasi,    ps.nocm,    ps.tgllahir,    ps.namapasien,  pd.tglregistrasi,   jk.reportdisplay AS jk, " & _
                     "ap.alamatlengkap,   ap.mobilephone2,    ru.namaruangan AS ruanganPeriksa,   pp.namalengkap AS namadokter, " & _
                     "kp.kelompokpasien,  apdp.namahafis||'-'||apdp.noantrian as noantrian,pd.statuspasien,apr.noreservasi,apr.tanggalreservasi,ru.id as ruid " & _
                     "FROM    pasiendaftar_t pd " & _
                     "INNER JOIN pasien_m ps ON pd.nocmfk = ps.id LEFT JOIN alamat_m ap ON ap.nocmfk = ps.id " & _
                     "INNER JOIN jeniskelamin_m jk ON ps.objectjeniskelaminfk = jk.id INNER JOIN ruangan_m ru ON pd.objectruanganlastfk = ru.id " & _
                     "LEFT JOIN pegawai_m pp ON pd.objectpegawaifk = pp.id INNER JOIN kelompokpasien_m kp ON pd.objectkelompokpasienlastfk = kp.id " & _
                     "INNER JOIN antrianpasiendiperiksa_t apdp ON apdp.noregistrasifk = pd.norec " & _
                     "LEFT JOIN antrianpasienregistrasi_t as apr on apr.noreservasi=pd.statusschedule " & _
                     "WHERE   pd.noregistrasi = '" & strNorec & "' "
                                 
                     
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport
            
'            .txtNamaRs.SetText namaRs
'            .txtAlamatRs.SetText alamatRs
            .usnoantri.SetUnboundFieldSource ("{ado.noantrian}")
            .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usnodft.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")
            .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
            .usNoTelpon.SetUnboundFieldSource ("{ado.mobilephone2}")

            .usPenjamin.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usruangperiksa.SetUnboundFieldSource ("{ado.ruanganPeriksa}")
            .usnamadokter.SetUnboundFieldSource ("{ado.namadokter}")
            
'            .usPetugas.SetUnboundFieldSource ("{ado.petugas}")
            .tglreservasi.SetUnboundFieldSource ("{ado.tanggalreservasi}")
            .usStatusPasien.SetUnboundFieldSource ("{ado.statuspasien}")
              
            .txtPetugas.SetText NamaPetugas
            .usruid.SetUnboundFieldSource ("{ado.ruid}")

            If view = "false" Then
            '    Dim strPrinter As String

                strPrinter1 = GetTxt("Setting.ini", "Printer", "BuktiPendaftaran")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = Report
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub
Public Sub cetakBuktiPendaftaranOnlines(strNorec As String, view As String, noReservasi As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = True
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
boolGelangPasien = False
bolBuktiLayananRuanganBedah = False

    With reportBuktiPendaftaranOnline
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien, " & _
                       " pd.tglregistrasi,jk.reportdisplay as jk,ap.alamatlengkap,ap.mobilephone2, " & _
                        " ru.namaruangan as ruanganPeriksa,pp.namalengkap as namadokter,kp.kelompokpasien, " & _
                        " apdp.noantrian From  pasiendaftar_t pd " & _
                        " INNER JOIN pasien_m ps ON pd.nocmfk = ps.id " & _
                        " left JOIN alamat_m ap ON ap.nocmfk = ps.id " & _
                        " INNER JOIN jeniskelamin_m jk ON ps.objectjeniskelaminfk = jk.id " & _
                        " INNER JOIN ruangan_m ru ON pd.objectruanganlastfk = ru.id " & _
                        " LEFT JOIN pegawai_m pp ON pd.objectpegawaifk = pp.id " & _
                        " INNER JOIN kelompokpasien_m kp ON pd.objectkelompokpasienlastfk = kp.id " & _
                        " INNER JOIN antrianpasiendiperiksa_t apdp ON apdp.noregistrasifk = pd.norec" & _
                        " where pd.noregistrasi ='" & strNorec & "' "
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport
            .usnoantri.SetUnboundFieldSource ("{ado.noantrian}")
            .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usnodft.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")
            .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
            .usNoTelpon.SetUnboundFieldSource ("{ado.mobilephone2}")
            .txtNoReservasi.SetText noReservasi
            .usPenjamin.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usruangperiksa.SetUnboundFieldSource ("{ado.ruanganPeriksa}")
            .usnamadokter.SetUnboundFieldSource ("{ado.namadokter}")

            If view = "false" Then
            '    Dim strPrinter As String

                strPrinter1 = GetTxt("Setting.ini", "Printer", "BuktiPendaftaran")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = Report
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub
Public Sub cetakTracer(strNorec As String, view As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = True
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False
Dim namaKomputer As String
namaKomputer = Winsock1.LocalHostName
    With ReportTracer
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien, " & _
                       " pd.tglregistrasi,jk.reportdisplay as jk,ap.alamatlengkap,ap.mobilephone2, " & _
                        " ru.namaruangan as ruanganPeriksa,pp.namalengkap as namadokter,kp.kelompokpasien, " & _
                        " apdp.noantrian,pd.statuspasien,ps.namaayah  From  pasiendaftar_t pd " & _
                        " INNER JOIN pasien_m ps ON pd.nocmfk = ps.id " & _
                        " LEFT JOIN alamat_m ap ON ap.nocmfk = ps.id " & _
                        " INNER JOIN jeniskelamin_m jk ON ps.objectjeniskelaminfk = jk.id " & _
                        " INNER JOIN ruangan_m ru ON pd.objectruanganlastfk = ru.id " & _
                        " LEFT JOIN pegawai_m pp ON pd.objectpegawaifk = pp.id " & _
                        " INNER JOIN kelompokpasien_m kp ON pd.objectkelompokpasienlastfk = kp.id " & _
                        " INNER JOIN antrianpasiendiperiksa_t apdp ON apdp.noregistrasifk = pd.norec" & _
                        " where pd.noregistrasi ='" & strNorec & "' "
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport
            .usnoantri.SetUnboundFieldSource ("{ado.noantrian}")
'            .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usnodft.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")
            .usStatusPasien.SetUnboundFieldSource ("{ado.statuspasien}")
            .udtTglReg.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usnamadokter.SetUnboundFieldSource ("{ado.namadokter}")
            .usNamaKel.SetUnboundFieldSource ("{ado.namaayah}")
            .usruangperiksa.SetUnboundFieldSource ("{ado.ruanganPeriksa}")
            .namaPc.SetText namaKomputer
            If view = "false" Then
               

                strPrinter1 = GetTxt("Setting.ini", "Printer", "Tracer1")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = ReportTracer
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub


Public Sub cetakSep(strNorec As String, kdProfile As String, view As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim namaRs As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = True
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False
    If kdProfile <> "" Then
        ReadRs2 "select * from profile_m where id = '" & kdProfile & "'"
        If Not RS2.EOF Then
            namaRs = RS2!namalengkap
        Else
            namaRs = "-"
        End If
    End If


    With reportSep
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "select pa.nosep,pa.tanggalsep,pa.nokepesertaan , pi.nocm,pd.noregistrasi ,pa.norujukan,ap.namapeserta,pi.tgllahir,jk.jeniskelamin," & _
                       " rp.namaruangan,rp.kodeexternal as namapoliBpjs,pa.ppkrujukan, " & _
                       " (CASE WHEN rp.objectdepartemenfk=16 then 'Rawat Inap' else 'Rawat Jalan' END) as jenisrawat," & _
                       " dg.kddiagnosa, (case when dg.namadiagnosa is null then '-' else dg.namadiagnosa end) as namadiagnosa , " & _
                       " pi.nocm, ap.jenispeserta,ap.kdprovider,ap.nmprovider,kls.namakelas, pa.catatan from pemakaianasuransi_t pa " & _
                       " LEFT JOIN asuransipasien_m ap on pa.objectasuransipasienfk= ap.id " & _
                       " LEFT JOIN pasiendaftar_t pd on pd.norec=pa.noregistrasifk " & _
                       " LEFT JOIN pasien_m pi on pi.id=pd.nocmfk " & _
                       " LEFT JOIN jeniskelamin_m jk on jk.id=pi.objectjeniskelaminfk " & _
                       " LEFT JOIN ruangan_m rp on rp.id=pd.objectruanganlastfk " & _
                       " LEFT JOIN diagnosa_m dg on pa.diagnosisfk=dg.id" & _
                       " LEFT JOIN kelas_m kls on kls.id=ap.objectkelasdijaminfk " & _
                       " where pd.noregistrasi ='" & strNorec & "' "
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport

             If Not rs.EOF Then
              .txtNamaRs.SetText namaRs
              .txtnosjp.SetText IIf(IsNull(rs("nosep")), "-", rs("nosep")) 'RS("nosep")
              .txtTglSep.SetText Format(rs("tanggalsep"), "dd/MM/yyyy")
              .txtNomorKartuAskes.SetText IIf(IsNull(rs("nokepesertaan")), "-", rs("nokepesertaan"))
              .txtNamaPasien.SetText IIf(IsNull(rs("namapeserta")), "-", rs("namapeserta")) 'RS("namapeserta")
              .txtkelamin.SetText IIf(IsNull(rs("jeniskelamin")), "-", rs("jeniskelamin")) 'RS("jeniskelamin")
              .txtTanggalLahir.SetText IIf(IsNull(rs("tgllahir")), "-", Format(rs("tgllahir"), "dd/MM/yyyy")) 'Format(RS("tgllahir"), "dd/mm/yyyy")
              .txtTujuan.SetText rs("namapoliBpjs") & " / " & rs("namaruangan")
              .txtAsalRujukan.SetText IIf(IsNull(rs("nmprovider")), "-", rs("nmprovider"))
              .txtPeserta.SetText IIf(IsNull(rs("jenispeserta")), "-", rs("jenispeserta"))
              .txtJenisrawat.SetText IIf(IsNull(rs("jenisrawat")), "-", rs("jenisrawat")) 'RS("jenisrawat")
              .txtnocm2.SetText IIf(IsNull(rs("nocm")), "-", rs("nocm")) 'RS("nocm")
              .txtdiagnosa.SetText IIf(IsNull(rs("namadiagnosa")), "-", rs("namadiagnosa")) 'RS("namadiagnosa")
              .txtKelasrawat.SetText IIf(IsNull(rs("namakelas")), "-", rs("namakelas")) 'RS("namakelas")
              .txtCatatan.SetText IIf(IsNull(rs("catatan")), "-", rs("catatan"))
              .txtnocm2.SetText IIf(IsNull(rs("nocm")), "-", rs("nocm"))
              .txtNoPendaftaran2.SetText IIf(IsNull(rs("noregistrasi")), "-", rs("noregistrasi"))
             End If

            If view = "false" Then
               
                strPrinter1 = GetTxt("Setting.ini", "Printer", "CetakSep")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportSep
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub


Public Sub cetakSepNew(strNorec As String, view As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = True
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False
    With reportSepNew
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            If Len(strNorec) > 13 Then
                strSQL = "select apd.noantrian,apd.namahafis,pa.namadjpjpmelayani,pa.nosep,pa.tanggalsep,pa.nokepesertaan,pi.nocm,pd.noregistrasi, " & _
                       " pa.norujukan,ap.namapeserta,ap.tgllahir,jk.jeniskelamin, " & _
                       " CASE WHEN pa.polirujukankode IS NULL THEN rp.namaruangan ELSE pa.polirujukannama END AS namaruangan,rp.kdinternal as namapolibpjs,pa.ppkrujukan, " & _
                       " (CASE WHEN rp.objectdepartemenfk=16 then 'R. Inap' else 'R. Jalan' END) as jenisrawat, " & _
                       " dg.kddiagnosa, (case when dg.namadiagnosa is null then '-' else dg.namadiagnosa end) as namadiagnosa , " & _
                       " ap.jenispeserta,ap.kdprovider,ap.nmprovider, pa.catatan, " & _
                       " (case when rp.objectdepartemenfk=16 then kls.namakelas else '-' end) as namakelas, " & _
                       " kls.namakelas as namakelashak, " & _
                       " ap.notelpmobile,pa.penjaminlaka," & _
                       " (case when pa.penjaminlaka='1' then 'Jasa Raharja PT' " & _
                       " when pa.penjaminlaka='2' then 'BPJS Ketenagakerjaan' " & _
                       " when pa.penjaminlaka='3' then 'TASPEN PT' " & _
                       " when pa.penjaminlaka='4' then 'ASABRI PT' " & _
                       " Else '-' end) as penjaminlakalantas,pa.prolanisprb " & _
                       " from pemakaianasuransi_t pa " & _
                       " LEFT JOIN asuransipasien_m ap on pa.objectasuransipasienfk= ap.id " & _
                       " LEFT JOIN pasiendaftar_t pd on pd.norec=pa.noregistrasifk " & _
                       " LEFT JOIN pasien_m pi on pi.id=pd.nocmfk " & _
                       " LEFT JOIN jeniskelamin_m jk on jk.id=pi.objectjeniskelaminfk " & _
                       " LEFT JOIN ruangan_m rp on rp.id=pd.objectruanganlastfk " & _
                       " LEFT JOIN diagnosa_m dg on pa.diagnosisfk=dg.id" & _
                       " LEFT JOIN kelas_m kls on kls.id=ap.objectkelasdijaminfk " & _
                       " LEFT JOIN antrianpasiendiperiksa_t apd ON apd.noregistrasifk = pd.norec and apd.objectruanganfk=pd.objectruanganlastfk " & _
                       " where pa.nosep ='" & strNorec & "' " & _
                       " and pa.nosep is not null  "
            ElseIf Len(strNorec) = 8 Then
                strSQL = "select apd.noantrian,apd.namahafis,pa.namadjpjpmelayani,pa.nosep,pa.tanggalsep,pa.nokepesertaan,pi.nocm,pd.noregistrasi, " & _
                       " pa.norujukan,ap.namapeserta,ap.tgllahir,jk.jeniskelamin, " & _
                       " CASE WHEN pa.polirujukankode IS NULL THEN rp.namaruangan ELSE pa.polirujukannama END AS namaruangan,rp.kdinternal as namapolibpjs,pa.ppkrujukan, " & _
                       " (CASE WHEN rp.objectdepartemenfk=16 then 'R. Inap' else 'R. Jalan' END) as jenisrawat, " & _
                       " dg.kddiagnosa, (case when dg.namadiagnosa is null then '-' else dg.namadiagnosa end) as namadiagnosa , " & _
                       " ap.jenispeserta,ap.kdprovider,ap.nmprovider, pa.catatan, " & _
                       " (case when rp.objectdepartemenfk=16 then kls.namakelas else '-' end) as namakelas, " & _
                       " kls.namakelas as namakelashak, " & _
                       " ap.notelpmobile,pa.penjaminlaka," & _
                       " (case when pa.penjaminlaka='1' then 'Jasa Raharja PT' " & _
                       " when pa.penjaminlaka='2' then 'BPJS Ketenagakerjaan' " & _
                       " when pa.penjaminlaka='3' then 'TASPEN PT' " & _
                       " when pa.penjaminlaka='4' then 'ASABRI PT' " & _
                       " Else '-' end) as penjaminlakalantas,pa.prolanisprb " & _
                       " from pemakaianasuransi_t pa " & _
                       " LEFT JOIN asuransipasien_m ap on pa.objectasuransipasienfk= ap.id " & _
                       " LEFT JOIN pasiendaftar_t pd on pd.norec=pa.noregistrasifk " & _
                       " LEFT JOIN pasien_m pi on pi.id=pd.nocmfk " & _
                       " LEFT JOIN jeniskelamin_m jk on jk.id=pi.objectjeniskelaminfk " & _
                       " LEFT JOIN ruangan_m rp on rp.id=pd.objectruanganlastfk " & _
                       " LEFT JOIN diagnosa_m dg on pa.diagnosisfk=dg.id" & _
                       " LEFT JOIN kelas_m kls on kls.id=ap.objectkelasdijaminfk " & _
                       " LEFT JOIN antrianpasiendiperiksa_t apd ON apd.noregistrasifk = pd.norec and apd.objectruanganfk=pd.objectruanganlastfk " & _
                       " where pi.nocm ='" & strNorec & "' " & _
                       " and pa.nosep is not null ORDER BY tanggalsep desc "
            ElseIf Len(strNorec) = 13 Then
                strSQL = "select apd.noantrian,apd.namahafis,pa.namadjpjpmelayani,pa.nosep,pa.tanggalsep,pa.nokepesertaan,pi.nocm,pd.noregistrasi, " & _
                       " pa.norujukan,ap.namapeserta,ap.tgllahir,jk.jeniskelamin, " & _
                       " CASE WHEN pa.polirujukankode IS NULL THEN rp.namaruangan ELSE pa.polirujukannama END AS namaruangan,rp.kdinternal as namapolibpjs,pa.ppkrujukan, " & _
                       " (CASE WHEN rp.objectdepartemenfk=16 then 'R. Inap' else 'R. Jalan' END) as jenisrawat, " & _
                       " dg.kddiagnosa, (case when dg.namadiagnosa is null then '-' else dg.namadiagnosa end) as namadiagnosa , " & _
                       " ap.jenispeserta,ap.kdprovider,ap.nmprovider, pa.catatan, " & _
                       " (case when rp.objectdepartemenfk=16 then kls.namakelas else '-' end) as namakelas, " & _
                       " kls.namakelas as namakelashak, " & _
                       " ap.notelpmobile,pa.penjaminlaka," & _
                       " (case when pa.penjaminlaka='1' then 'Jasa Raharja PT' " & _
                       " when pa.penjaminlaka='2' then 'BPJS Ketenagakerjaan' " & _
                       " when pa.penjaminlaka='3' then 'TASPEN PT' " & _
                       " when pa.penjaminlaka='4' then 'ASABRI PT' " & _
                       " Else '-' end) as penjaminlakalantas,pa.prolanisprb " & _
                       " from pemakaianasuransi_t pa " & _
                       " LEFT JOIN asuransipasien_m ap on pa.objectasuransipasienfk= ap.id " & _
                       " LEFT JOIN pasiendaftar_t pd on pd.norec=pa.noregistrasifk " & _
                       " LEFT JOIN pasien_m pi on pi.id=pd.nocmfk " & _
                       " LEFT JOIN jeniskelamin_m jk on jk.id=pi.objectjeniskelaminfk " & _
                       " LEFT JOIN ruangan_m rp on rp.id=pd.objectruanganlastfk " & _
                       " LEFT JOIN diagnosa_m dg on pa.diagnosisfk=dg.id" & _
                       " LEFT JOIN kelas_m kls on kls.id=ap.objectkelasdijaminfk " & _
                       " LEFT JOIN antrianpasiendiperiksa_t apd ON apd.noregistrasifk = pd.norec and apd.objectruanganfk=pd.objectruanganlastfk " & _
                       " where pa.nokepesertaan ='" & strNorec & "' " & _
                       " and pa.nosep is not null ORDER BY tanggalsep desc "
            Else
                strSQL = "select apd.noantrian,apd.namahafis,pa.namadjpjpmelayani,pa.nosep,pa.tanggalsep,pa.nokepesertaan,pi.nocm,pd.noregistrasi, " & _
                       " pa.norujukan,ap.namapeserta,ap.tgllahir,jk.jeniskelamin, " & _
                       " CASE WHEN pa.polirujukankode IS NULL THEN rp.namaruangan ELSE pa.polirujukannama END AS namaruangan,rp.kdinternal as namapolibpjs,pa.ppkrujukan, " & _
                       " (CASE WHEN rp.objectdepartemenfk=16 then 'R. Inap' else 'R. Jalan' END) as jenisrawat, " & _
                       " dg.kddiagnosa, (case when dg.namadiagnosa is null then '-' else dg.namadiagnosa end) as namadiagnosa , " & _
                       " ap.jenispeserta,ap.kdprovider,ap.nmprovider, pa.catatan, " & _
                       " (case when rp.objectdepartemenfk=16 then kls.namakelas else '-' end) as namakelas, " & _
                       " kls.namakelas as namakelashak, " & _
                       " ap.notelpmobile,pa.penjaminlaka," & _
                       " (case when pa.penjaminlaka='1' then 'Jasa Raharja PT' " & _
                       " when pa.penjaminlaka='2' then 'BPJS Ketenagakerjaan' " & _
                       " when pa.penjaminlaka='3' then 'TASPEN PT' " & _
                       " when pa.penjaminlaka='4' then 'ASABRI PT' " & _
                       " Else '-' end) as penjaminlakalantas,pa.prolanisprb " & _
                       " from pemakaianasuransi_t pa " & _
                       " LEFT JOIN asuransipasien_m ap on pa.objectasuransipasienfk= ap.id " & _
                       " LEFT JOIN pasiendaftar_t pd on pd.norec=pa.noregistrasifk " & _
                       " LEFT JOIN pasien_m pi on pi.id=pd.nocmfk " & _
                       " LEFT JOIN jeniskelamin_m jk on jk.id=pi.objectjeniskelaminfk " & _
                       " LEFT JOIN ruangan_m rp on rp.id=pd.objectruanganlastfk " & _
                       " LEFT JOIN diagnosa_m dg on pa.diagnosisfk=dg.id" & _
                       " LEFT JOIN kelas_m kls on kls.id=ap.objectkelasdijaminfk " & _
                       " LEFT JOIN antrianpasiendiperiksa_t apd ON apd.noregistrasifk = pd.norec and apd.objectruanganfk=pd.objectruanganlastfk " & _
                       " where pd.noregistrasi ='" & strNorec & "' " & _
                       " and pa.nosep is not null  "
            End If
            
            
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport

             If Not rs.EOF Then
              .txtnosjp.SetText IIf(IsNull(rs("nosep")), "-", rs("nosep")) 'RS("nosep")
              .txtTglSep.SetText Format(rs("tanggalsep"), "dd/MM/yyyy")
              '.txtTglSepx.SetText Format(rs("tanggalsep"), "dd/MM/yyyy")
              .txtNomorKartuBpjs.SetText IIf(IsNull(rs("nokepesertaan")), "-", rs("nokepesertaan"))
              .txtNamaPasien.SetText IIf(IsNull(rs("namapeserta")), "-", rs("namapeserta")) 'RS("namapeserta")
              '.txtNamaPasienx.SetText IIf(IsNull(rs("namapeserta")), "-", rs("namapeserta")) 'RS("namapeserta")
              .txtkelamin.SetText IIf(IsNull(rs("jeniskelamin")), "-", rs("jeniskelamin")) 'RS("jeniskelamin")
              '.txtkelaminx.SetText IIf(IsNull(rs("jeniskelamin")), "-", rs("jeniskelamin")) 'RS("jeniskelamin")
              .txtTanggalLahir.SetText IIf(IsNull(rs("tgllahir")), "-", Format(rs("tgllahir"), "dd/MM/yyyy")) 'Format(RS("tgllahir"), "dd/mm/yyyy")
              '.txtTanggalLahirx.SetText IIf(IsNull(rs("tgllahir")), "-", Format(rs("tgllahir"), "dd/MM/yyyy")) 'Format(RS("tgllahir"), "dd/mm/yyyy")
              .txtTujuan.SetText rs("namapolibpjs") & " / " & rs("namaruangan")
              .txtAsalRujukan.SetText IIf(IsNull(rs("nmprovider")), "-", rs("nmprovider"))
              .txtPeserta.SetText IIf(IsNull(rs("jenispeserta")), "-", rs("jenispeserta"))
              .txtJenisrawat.SetText IIf(IsNull(rs("jenisrawat")), "-", rs("jenisrawat")) 'RS("jenisrawat")
              .txtnocm2.SetText IIf(IsNull(rs("nocm")), "-", rs("nocm")) 'RS("nocm")
              .txtdiagnosa.SetText IIf(IsNull(rs("namadiagnosa")), "-", rs("namadiagnosa")) 'RS("namadiagnosa")
              .txtKelasrawat.SetText IIf(IsNull(rs("namakelas")), "-", rs("namakelas")) 'RS("namakelas")
              .txtKelasrawatHak.SetText IIf(IsNull(rs("namakelashak")), "-", rs("namakelashak")) 'RS("namakelas")
              .txtCatatan.SetText IIf(IsNull(rs("catatan")), "-", rs("catatan"))
              .txtnocm2.SetText IIf(IsNull(rs("nocm")), "-", rs("nocm"))
              '.txtnocmx.SetText IIf(IsNull(rs("nocm")), "-", rs("nocm"))
              .txtNoPendaftaran2.SetText IIf(IsNull(rs("noregistrasi")), "-", rs("noregistrasi"))
              .txtNoTelpon.SetText IIf(IsNull(rs("notelpmobile")), "-", rs("notelpmobile"))
              .txtPenjamin.SetText IIf(IsNull(rs("penjaminlakalantas")), "-", rs("penjaminlakalantas"))
              .txtProlanis.SetText IIf(IsNull(rs("prolanisprb")), "-", rs("prolanisprb"))
              .txtDpjpMelayani.SetText IIf(IsNull(rs("namadjpjpmelayani")), "-", rs("namadjpjpmelayani"))
              .txtnoantrian.SetText IIf(IsNull(rs("noantrian")), "-", rs("noantrian"))
              .txtnamahafis.SetText IIf(IsNull(rs("namahafis")), "", rs("namahafis"))
             End If

            If view = "false" Then
               
                strPrinter1 = GetTxt("Setting.ini", "Printer", "CetakSep")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportSepNew
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub


Public Sub cetakBuktiLayanan(strNorec As String, strIdPegawai As String, view As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim umur As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = True
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False

    With reportBuktiLayanan
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
'            strSQL = "SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien, " & _
'                       " pd.tglregistrasi,jk.reportdisplay AS jk,ru2.namaruangan AS ruanganperiksa,ru.namaruangan AS ruangakhir, " & _
'                       " (select pg.namalengkap from pegawai_m as pg INNER JOIN pelayananpasienpetugas_t p3 on p3.objectpegawaifk=pg.id " & _
'                       "where p3.pelayananpasien=tp.norec and p3.objectjenispetugaspefk=4 limit 1) AS namadokter,kp.kelompokpasien,tp.produkfk, " & _
'                       " pro.namaproduk,tp.jumlah,CASE WHEN tp.hargasatuan is null then tp.hargajual else tp.hargasatuan END as hargasatuan,ks.namakelas,ar.asalrujukan, " & _
'                       " CASE WHEN rek.namarekanan is null then '-' else rek.namarekanan END as namapenjamin,kmr.namakamar " & _
'                       " FROM pasiendaftar_t AS pd INNER JOIN pasien_m AS ps ON pd.nocmfk = ps.id " & _
'                       " INNER JOIN jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.id " & _
'                       " INNER JOIN ruangan_m AS ru ON pd.objectruanganlastfk = ru.id " & _
'                       " LEFT JOIN pegawai_m AS pp ON pd.objectpegawaifk = pp.id " & _
'                       " INNER JOIN kelompokpasien_m AS kp ON pd.objectkelompokpasienlastfk = kp.id " & _
'                       " INNER JOIN antrianpasiendiperiksa_t AS apdp ON apdp.noregistrasifk = pd.norec " & _
'                        " LEFT JOIN pelayananpasien_t AS tp ON tp.noregistrasifk = apdp.norec " & _
'                       " LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id " & _
'                       " LEFT JOIN kelas_m AS ks ON apdp.objectkelasfk = ks.id " & _
'                       " LEFT JOIN asalrujukan_m AS ar ON apdp.objectasalrujukanfk = ar.id " & _
'                       " left JOIN rekanan_m AS rek ON rek.id= pd.objectrekananfk " & _
'                       " left JOIN kamar_m as kmr on apdp.objectkamarfk=kmr.id " & _
'                       " INNER join ruangan_m  as ru2 on ru2.id=apdp.objectruanganfk " & _
'                       " where pd.noregistrasi ='" & strNorec & "' and pro.id <> 402611  ORDER BY tp.tglpelayanan "
                       
             strSQL = "SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien, " & _
                       " pd.tglregistrasi,jk.reportdisplay AS jk,ru2.namaruangan AS ruanganperiksa,ru.namaruangan AS ruangakhir, " & _
                       " pp.namalengkap AS namadokter,kp.kelompokpasien,tp.produkfk, " & _
                       " pro.namaproduk,tp.jumlah,CASE WHEN tp.hargasatuan is null then tp.hargajual else tp.hargasatuan END as hargasatuan,ks.namakelas,ar.asalrujukan, " & _
                       " CASE WHEN rek.namarekanan is null then '-' else rek.namarekanan END as namapenjamin,kmr.namakamar " & _
                       " FROM pasiendaftar_t AS pd INNER JOIN pasien_m AS ps ON pd.nocmfk = ps.id " & _
                       " INNER JOIN jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.id " & _
                       " INNER JOIN ruangan_m AS ru ON pd.objectruanganlastfk = ru.id " & _
                       " INNER JOIN kelompokpasien_m AS kp ON pd.objectkelompokpasienlastfk = kp.id " & _
                       " INNER JOIN antrianpasiendiperiksa_t AS apdp ON apdp.noregistrasifk = pd.norec " & _
                       " LEFT JOIN pegawai_m AS pp ON apdp.objectpegawaifk = pp.id " & _
                        " LEFT JOIN pelayananpasien_t AS tp ON tp.noregistrasifk = apdp.norec " & _
                       " LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id " & _
                       " LEFT JOIN kelas_m AS ks ON apdp.objectkelasfk = ks.id " & _
                       " LEFT JOIN asalrujukan_m AS ar ON apdp.objectasalrujukanfk = ar.id " & _
                       " left JOIN rekanan_m AS rek ON rek.id= pd.objectrekananfk " & _
                       " left JOIN kamar_m as kmr on apdp.objectkamarfk=kmr.id " & _
                       " INNER join ruangan_m  as ru2 on ru2.id=apdp.objectruanganfk " & _
                       " where pd.noregistrasi ='" & strNorec & "' and pro.id <> 402611  ORDER BY tp.tglpelayanan "
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            
            .database.AddADOCommand CN_String, adoReport
            If rs.BOF Then
                .txtumur.SetText "-"
            Else
                .txtumur.SetText hitungUmurNew(Format(rs!tgllahir, "yyyy/MM/dd"), Format(Now, "yyyy/MM/dd"))
            End If


            .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")

            '.usNoregistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")

            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")
            
            .usUnitLayanan.SetUnboundFieldSource ("{ado.ruanganperiksa}")
            .usTipe.SetUnboundFieldSource ("{ado.kelompokpasien}")
            
            .usRujukan.SetUnboundFieldSource ("{ado.asalrujukan}")
            .usruangperiksa.SetUnboundFieldSource ("{ado.ruanganPeriksa}")
            '.usQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usKamar.SetUnboundFieldSource ("if isnull({ado.namakamar}) then "" - "" else {ado.namakamar} ")
            .usKelas.SetUnboundFieldSource ("{ado.namakelas}")
            .usPenjamin.SetUnboundFieldSource ("{ado.namapenjamin}")
            
            .usDokter.SetUnboundFieldSource ("{ado.namadokter}")

            .usPelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .ucTarif.SetUnboundFieldSource ("{ado.hargasatuan}")

            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
            If RS2.BOF Then
                .txtUser.SetText "-"
            Else
                .txtUser.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
            End If
            
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "BuktiLayanan")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportBuktiLayanan
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:
    MsgBox Err.Number & " " & Err.Description
    
End Sub
Public Sub cetakBuktiLayananNorec_apd(strNorec As String, strIdPegawai As String, strruangan As String, view As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim umur As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = True
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False

    Dim strarr() As String
    Dim norec_apc As String
    Dim i As Integer
    
    
    strarr = Split(strNorec, "|")
    For i = 0 To UBound(strarr)
       norec_apc = norec_apc + "'" & strarr(i) & "',"
    Next
    norec_apc = Left(norec_apc, Len(norec_apc) - 1)
    With reportBuktiLayanan
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien, " & _
                       " pd.tglregistrasi,jk.reportdisplay AS jk,ru2.namaruangan AS ruanganperiksa,ru.namaruangan AS ruangakhir, " & _
                       " pp.namalengkap AS namadokter,kp.kelompokpasien,tp.produkfk, " & _
                       " pro.namaproduk,tp.jumlah,CASE WHEN tp.hargasatuan is null then tp.hargajual else tp.hargasatuan END as hargasatuan,ks.namakelas,ar.asalrujukan, " & _
                       " CASE WHEN rek.namarekanan is null then '-' else rek.namarekanan END as namapenjamin,kmr.namakamar " & _
                       " FROM pasiendaftar_t AS pd INNER JOIN pasien_m AS ps ON pd.nocmfk = ps.id " & _
                       " INNER JOIN jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.id " & _
                       " INNER JOIN ruangan_m AS ru ON pd.objectruanganlastfk = ru.id " & _
                       " LEFT JOIN pegawai_m AS pp ON pd.objectpegawaifk = pp.id " & _
                       " INNER JOIN kelompokpasien_m AS kp ON pd.objectkelompokpasienlastfk = kp.id " & _
                       " INNER JOIN antrianpasiendiperiksa_t AS apdp ON apdp.noregistrasifk = pd.norec " & _
                        " LEFT JOIN pelayananpasien_t AS tp ON tp.noregistrasifk = apdp.norec " & _
                       " LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id " & _
                       " LEFT JOIN kelas_m AS ks ON apdp.objectkelasfk = ks.id " & _
                       " LEFT JOIN asalrujukan_m AS ar ON apdp.objectasalrujukanfk = ar.id " & _
                       " left JOIN rekanan_m AS rek ON rek.id= pd.objectrekananfk " & _
                       " left JOIN kamar_m as kmr on apdp.objectkamarfk=kmr.id " & _
                       " INNER join ruangan_m  as ru2 on ru2.id=apdp.objectruanganfk " & _
                       " where tp.norec  in (" & norec_apc & ") and pro.id <> 402611  ORDER BY tp.tglpelayanan "
                       
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            
            .database.AddADOCommand CN_String, adoReport
            If rs.BOF Then
                .txtumur.SetText "-"
            Else
                .txtumur.SetText hitungUmur(Format(rs!tgllahir, "yyyy/MM/dd"), Format(Now, "yyyy/MM/dd"))
            End If


            .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")

         '   .usNoregistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")

            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")
            
            .usUnitLayanan.SetUnboundFieldSource ("{ado.ruanganperiksa}")
            .usTipe.SetUnboundFieldSource ("{ado.kelompokpasien}")
            
            .usRujukan.SetUnboundFieldSource ("{ado.asalrujukan}")
            .usruangperiksa.SetUnboundFieldSource ("{ado.ruanganPeriksa}")
            '.usQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usKamar.SetUnboundFieldSource ("if isnull({ado.namakamar}) then "" - "" else {ado.namakamar} ")
            .usKelas.SetUnboundFieldSource ("{ado.namakelas}")
            .usPenjamin.SetUnboundFieldSource ("{ado.namapenjamin}")
            
            .usDokter.SetUnboundFieldSource ("{ado.namadokter}")

            .usPelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .ucTarif.SetUnboundFieldSource ("{ado.hargasatuan}")

            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
            If RS2.BOF Then
                .txtUser.SetText "-"
            Else
                .txtUser.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
            End If
            
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "BuktiLayanan")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportBuktiLayanan
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:
    MsgBox Err.Number & " " & Err.Description
    
End Sub

Public Sub cetakBuktiLayananRuangan(strNorec As String, strIdPegawai As String, strIdRuangan As String, view As String)
'On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim umur As String
Dim strFilter As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = True
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolBuktiLayananKecil = False
boolGelangPasien = False

    strSQL = ""
    strFilter = ""
    If Left(strIdRuangan, 14) = "ORDERRADIOLOGI" Then
        strIdRuangan = Replace(strIdRuangan, "ORDERRADIOLOGI", "")
        strFilter = " AND apdp.norec = '" & strIdRuangan & "' "
    Else
        If strIdRuangan <> "" Then strFilter = " AND ru2.id = '" & strIdRuangan & "' "
    End If
    strFilter = strFilter & " and pro.id <> 402611 ORDER BY tp.tglpelayanan "
    With reportBuktiLayananRuangan
    
'            Set adoReport = New ADODB.Command
'             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT  pd.noregistrasi,ps.nocm,ps.tgllahir,convert(varchar,ps.tgllahir,105) as tglKelahiran,ps.namapasien,apdp.tglregistrasi,jk.reportdisplay AS jk, ru2.namaruangan AS ruanganperiksa, " & _
                     "ru.namaruangan AS ruangakhir,(SELECT TOP 1 pg.namalengkap FROM pegawai_m AS pg INNER JOIN pelayananpasienpetugas_t as p3 ON p3.objectpegawaifk = pg.id WHERE p3.pelayananpasien = tp.norec " & _
                     "AND p3.objectjenispetugaspefk = 4) AS namadokter,kp.kelompokpasien,tp.produkfk,pro.namaproduk,tp.jumlah, " & _
                     "CASE WHEN tp.hargasatuan IS NULL THEN   tp.hargajual ELSE   tp.hargasatuan END AS hargasatuan, " & _
                     "(CASE WHEN tp.hargadiscount IS NULL THEN 0 ELSE tp.hargadiscount END)* tp.jumlah AS diskon, " & _
                     "tp.hargasatuan * tp.jumlah AS total, ks.namakelas, ar.asalrujukan, CASE WHEN rek.namarekanan IS NULL THEN  '-' ELSE    rek.namarekanan END AS namapenjamin, " & _
                     "kmr.namakamar,pg1.namalengkap as dktrdpjp,alm.alamatlengkap FROM pasiendaftar_t AS pd " & _
                     "INNER JOIN pasien_m AS ps ON pd.nocmfk = ps.id " & _
                     "LEFT JOIN jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.id " & _
                     "LEFT JOIN kelompokpasien_m AS kp ON pd.objectkelompokpasienlastfk = kp.id " & _
                     "LEFT JOIN antrianpasiendiperiksa_t AS apdp ON apdp.noregistrasifk = pd.norec " & _
                     "LEFT JOIN ruangan_m AS ru ON pd.objectruanganasalfk = ru.id " & _
                     "LEFT JOIN pelayananpasien_t AS tp ON tp.noregistrasifk = apdp.norec " & _
                     "LEFT JOIN pegawai_m AS pp ON apdp.objectpegawaifk = pp.id " & _
                     "LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id " & _
                     "LEFT JOIN kelas_m AS ks ON apdp.objectkelasfk = ks.id " & _
                     "LEFT JOIN asalrujukan_m AS ar ON apdp.objectasalrujukanfk = ar.id " & _
                     "LEFT JOIN rekanan_m AS rek ON rek.id = pd.objectrekananfk " & _
                     "LEFT JOIN kamar_m AS kmr ON apdp.objectkamarfk = kmr.id " & _
                     "INNER JOIN ruangan_m AS ru2 ON ru2.id = apdp.objectruanganfk " & _
                     "INNER JOIN pegawai_m as pg1 on pg1.id = pd.objectpegawaifk " & _
                     "LEFT JOIN alamat_m as alm on alm.nocmfk = ps.id " & _
                     " where pd.noregistrasi ='" & strNorec & "'" & strFilter
            
            ReadRs strSQL
'            ReadJson strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            
            .database.AddADOCommand CN_String, adoReport
'            .database.SetDataSource rs
'            .database.SetDataSource = rs
            If rs.BOF Then
                .txtumur.SetText "-"
            Else
                .txtumur.SetText rs!tglKelahiran 'hitungUmurNew(Format(rs!tgllahir, "yyyy/MM/dd"), Format(Now, "yyyy/MM/dd"))
            End If
            
            .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")

            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")

            .usUnitLayanan.SetUnboundFieldSource ("{ado.ruanganperiksa}")
            .usTipe.SetUnboundFieldSource ("{ado.kelompokpasien}")

            .usRujukan.SetUnboundFieldSource ("{ado.asalrujukan}")
            .usruangperiksa.SetUnboundFieldSource ("{ado.ruangakhir}")
            .usQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usKamar.SetUnboundFieldSource ("if isnull({ado.namakamar}) then "" - "" else {ado.namakamar} ")
            .usKelas.SetUnboundFieldSource ("if isnull({ado.namakelas}) then "" - "" else {ado.namakelas} ") '("{ado.namakelas}")
            .usPenjamin.SetUnboundFieldSource ("{ado.namapenjamin}")

            .usDokter.SetUnboundFieldSource ("{ado.namadokter}")

            .usPelayanan.SetUnboundFieldSource ("{ado.namaproduk}") '
            .ucTarif.SetUnboundFieldSource ("{ado.hargasatuan}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .usJumlah.SetUnboundFieldSource ("{ado.jumlah}")
            .unQtyN.SetUnboundFieldSource ("{ado.jumlah}")
            .usDokterDpjp.SetUnboundFieldSource ("{ado.dktrdpjp}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
'            .ucTotal.SetUnboundFieldSource ("{ado.total}")

            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
            If RS2.BOF Then
                .txtUser.SetText "-"
            Else
                .txtUser.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
            End If
            
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "BuktiLayananRuangan")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportBuktiLayananRuangan
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub

Public Sub cetakKartuPasien(strNocm As String, strNamaPasien As String, strTglLahir As String, strJk As String, view As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = True
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False

    With reportKartuPasien
'            Set adoReport = New ADODB.Command
'            adoReport.ActiveConnection = CN_String
'            adoReport.CommandText = strSQL
'            adoReport.CommandType = adCmdUnknown
'            .database.AddADOCommand CN_String, adoReport

'      Set sect = .Sections.Item("Section8")

        .txtNamaPas.SetText strNamaPasien & "(" & strJk & ")"

        .txtTgl.SetText strTglLahir
        .txtNocm.SetText strNocm
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "KartuPasien")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportKartuPasien
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub

Public Sub cetakLabelPasien(strNorec As String, view As String, qty As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim i As Integer
Dim str As String
Dim jml As Integer
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = True
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False

    With reportLabel
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "select pd.noregistrasi,pd.tglregistrasi,p.nocm,p.nocm as noCm," & _
                    "upper(p.namapasien) as namapasien, jk.reportdisplay as jk, " & _
                        "p.tgllahir from pasiendaftar_t pd " & _
                      " INNER JOIN pasien_m p on pd.nocmfk=p.id " & _
                       " INNER JOIN jeniskelamin_m jk on jk.id=p.objectjeniskelaminfk " & _
                       " where pd.noregistrasi ='" & strNorec & "' "
            
'            jml = qty - 1
            str = ""
            If Val(qty) - 1 = 0 Then
                adoReport.CommandText = strSQL
             Else
                For i = 1 To Val(qty) - 1
                    str = strSQL & " union all " & str
                Next
                
                adoReport.CommandText = str & strSQL
           
           End If
           
            adoReport.CommandType = adCmdUnknown
            
            
            .database.AddADOCommand CN_String, adoReport


            .udtgl.SetUnboundFieldSource ("{ado.tgllahir}")

            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")
    
            .udtgl1.SetUnboundFieldSource ("{ado.tgllahir}")
            .usNoreg1.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm1.SetUnboundFieldSource ("{ado.nocm}")
            .usNp1.SetUnboundFieldSource ("{ado.namapasien}")
            .usjk1.SetUnboundFieldSource ("{ado.jk}")
   
            .udtgl2.SetUnboundFieldSource ("{ado.tgllahir}")
            .usNoreg2.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm2.SetUnboundFieldSource ("{ado.nocm}")
            .usNp2.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK2.SetUnboundFieldSource ("{ado.jk}")
            
            .udtgl3.SetUnboundFieldSource ("{ado.tgllahir}")
            .usNoreg3.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm3.SetUnboundFieldSource ("{ado.nocm}")
            .usNp3.SetUnboundFieldSource ("{ado.namapasien}")
            .usJk3.SetUnboundFieldSource ("{ado.jk}")
            
            
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "LabelPasien")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportLabel
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
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

Public Sub cetakLabelPasien_3(strNorec As String, view As String, qty As String)
'On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim i As Integer
Dim str As String
Dim jml As Integer
Dim Barcode As Image
Dim filename As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = True
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False
Dim umur As String

    With reportLabel_3
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "select pd.noregistrasi,pd.tglregistrasi,p.nocm,p.nocm as noCm, " & _
                     "upper(p.namapasien) as namapasien, jk.jeniskelamin as jk, upper(alm.alamatlengkap) as alamat, " & _
                     "CONVERT(VARCHAR,p.tgllahir,105) as tgllahir, " & _
                     "case when pg.namalengkap is null then '-' ELSE " & _
                     "pg.namalengkap end as namadokter from pasiendaftar_t pd " & _
                     " INNER JOIN pasien_m p on pd.nocmfk=p.id " & _
                     " INNER JOIN jeniskelamin_m jk on jk.id=p.objectjeniskelaminfk " & _
                     " LEFT JOIN pegawai_m as pg on pg.id = pd.objectpegawaifk " & _
                     " LEFT JOIN alamat_m as alm on alm.nocmfk = p.id " & _
                     " where pd.noregistrasi ='" & strNorec & "' "
            ReadRs "SELECT        pasien_m.tgllahir, pasiendaftar_t.norec FROM pasien_m INNER JOIN " & _
                    "pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk where pasiendaftar_t.noregistrasi ='" & strNorec & "'"
            umur = hitungUmur(Format(rs("tgllahir"), "dd/mm/yyyy"), Format(Now(), "dd/mm/yyyy"))
'            jml = qty - 1
'        ReadRs2 strSQL
'        If RS2.EOF = False Then
'            Call make128(RS2!noCm)
'            fileName = "c:\barcode.jpg"
'            SavePicture Picture1.Image, fileName
'        End If
        
'        Picture1.Image.Save ("c:\barcode.jpg")
        
'        Dim mstream As ADODB.Stream
'        Set rs = New ADODB.Recordset
'        Set rsc = New ADODB.Recordset
'        rs.Open "select p.foto from pasiendaftar_t pd " & _
'                     " INNER JOIN pasien_m p on pd.nocmfk=p.id " & _
'                     " where pd.noregistrasi ='" & strNorec & "' ", CN, adOpenKeyset, adLockOptimistic
'        rsc.Open "select image  from photopasien_m where id = 1", CN, adOpenKeyset, adLockOptimistic
'        If IsNull(rs.Fields("foto").Value) = False Then
'            Set mstream = New ADODB.Stream
'            mstream.Type = adTypeBinary
'            mstream.Open
'            mstream.Write rs.Fields("foto").Value
'            mstream.SavetoFile "c:\tmp_epics.jpg", adSaveCreateOverWrite
'        Else
'            Set mstream = New ADODB.Stream
'            mstream.Type = adTypeBinary
'            mstream.Open
'            mstream.Write rsc.Fields("image").Value
'            mstream.SavetoFile "c:\tmp_epics.jpg", adSaveCreateOverWrite
'        End If
'        rs.Close
'        rsc.Close
            str = ""
            If Val(qty) - 1 = 0 Then
                adoReport.CommandText = strSQL
             Else
                For i = 1 To Val(qty) - 1
                    str = strSQL & " union all " & str
                Next
                
                adoReport.CommandText = str & strSQL
           
           End If
           
            adoReport.CommandType = adCmdUnknown
            
            
            .database.AddADOCommand CN_String, adoReport

            .usDokterDpjp.SetUnboundFieldSource ("{ado.namadokter}")
            .udtLahir.SetUnboundFieldSource ("{ado.tgllahir}")


'            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")

            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")
            .txtumur.SetText umur
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "LabelPasien")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportLabel_3
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub
Public Sub cetakLabelPasien_3b(strNorec As String, view As String, qty As String)
'On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim i As Integer
Dim str As String
Dim jml As Integer
Dim Barcode As Image
Dim filename As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = True
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False

    With reportLabel_3
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "select p.nocm,p.nocm as noCm, " & _
                     "upper(p.namapasien) as namapasien, jk.jeniskelamin as jk, " & _
                     "CONVERT(VARCHAR,p.tgllahir,105) as tgllahir " & _
                     " from pasien_m p " & _
                     " INNER JOIN jeniskelamin_m jk on jk.id=p.objectjeniskelaminfk " & _
                     " where p.nocm='" & strNorec & "' "
            
'            jml = qty - 1
'        ReadRs2 strSQL
'        If RS2.EOF = False Then
'            Call make128(RS2!noCm)
'            fileName = "c:\barcode.jpg"
'            SavePicture Picture1.Image, fileName
'        End If
        
'        Picture1.Image.Save ("c:\barcode.jpg")
        
'        Dim mstream As ADODB.Stream
'        Set rs = New ADODB.Recordset
'        Set rsc = New ADODB.Recordset
'        rs.Open "select p.foto from pasiendaftar_t pd " & _
'                     " INNER JOIN pasien_m p on pd.nocmfk=p.id " & _
'                     " where pd.noregistrasi ='" & strNorec & "' ", CN, adOpenKeyset, adLockOptimistic
'        rsc.Open "select image  from photopasien_m where id = 1", CN, adOpenKeyset, adLockOptimistic
'        If IsNull(rs.Fields("foto").Value) = False Then
'            Set mstream = New ADODB.Stream
'            mstream.Type = adTypeBinary
'            mstream.Open
'            mstream.Write rs.Fields("foto").Value
'            mstream.SavetoFile "c:\tmp_epics.jpg", adSaveCreateOverWrite
'        Else
'            Set mstream = New ADODB.Stream
'            mstream.Type = adTypeBinary
'            mstream.Open
'            mstream.Write rsc.Fields("image").Value
'            mstream.SavetoFile "c:\tmp_epics.jpg", adSaveCreateOverWrite
'        End If
'        rs.Close
'        rsc.Close
            str = ""
            If Val(qty) - 1 = 0 Then
                adoReport.CommandText = strSQL
             Else
                For i = 1 To Val(qty) - 1
                    str = strSQL & " union all " & str
                Next
                
                adoReport.CommandText = str & strSQL
           
           End If
           
            adoReport.CommandType = adCmdUnknown
            
            
            .database.AddADOCommand CN_String, adoReport

            .usDokterDpjp.Suppress = True
            .Text16.Suppress = True
            .Text17.Suppress = True
            
            .udtLahir.SetUnboundFieldSource ("{ado.tgllahir}")


'            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")

            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")
            
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "LabelPasien")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportLabel_3
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub
Public Sub cetaklaporantracer(view As String, kdRuangan As String, tglAwal As String, tglAkhir As String)
'On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim i As Integer
Dim str As String
Dim jml As Integer
Dim Barcode As Image
Dim filename As String
    boolLaporantracer = True
    With reportlaporantracer
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "select [pd].[noregistrasi], [pd].[tglregistrasi], [ps].[nocm], [ps].[namapasien], [ru1].[namaruangan] as [unitasal], [ru2].[namaruangan] as [unittujuan], " & _
                    "[kdrm].[tglkeluar], [kdrm].[objectstatuskendalidokumenfk], [skd].[name] as [status], [kdrm].[dariunit], [kdrm].[keunit], [skd].[namaexternal], case when rm.namarekanan is NULL then 'Umum' else rm.namarekanan end as rekanan from [pasiendaftar_t] as [pd] inner join [pasien_m] as [ps] on [ps].[id] = [pd].[nocmfk] inner join [kendalidokumenrekammedis_t] as [kdrm] on [kdrm].[nocmfk] = [ps].[id] inner join [antrianpasiendiperiksa_t] as [apd] on [apd].[noregistrasifk] = [pd].[norec] and [kdrm].[noregistrasifk] = [apd].[norec] inner join [ruangan_m] as [ru1] on [ru1].[id] = [kdrm].[objectruanganasalfk] inner join [ruangan_m] as [ru2] on [ru2].[id] = [kdrm].[objectruangantujuanfk] left join [statuskendalidokumen_m] as [skd] on [skd].[id] = [kdrm].[objectstatuskendalidokumenfk] left join [rekanan_m] as [rm] on [pd].[objectrekananfk] = [rm].[id] " & _
                    "where [pd].[tglregistrasi] between '" & tglAwal & " 00:00:00' and '" & tglAkhir & " 23:59:59' and ru2.id = '" & kdRuangan & "'  order by [kdrm].[tglkeluar] desc"
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            ReadRs3 "select namaruangan from ruangan_m " & _
                    "where id = '" & kdRuangan & "'"
                    
             ReadRs strSQL
            
            Dim Keterangan As String
            Keterangan = "Periode: " & tglAwal & " - " & tglAkhir & " Ruangan " & RS3!namaruangan
            
            .txtPeriode.SetText (Keterangan)
            .database.AddADOCommand CN_String, adoReport

            .untanggal.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .unsumber.SetUnboundFieldSource ("{ado.namaexternal}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnamapasien.SetUnboundFieldSource ("{ado.namapasien}")
            .unrekanan.SetUnboundFieldSource ("{ado.rekanan}")
            view = "true"
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "LabelPasien")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportlaporantracer
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub

Public Sub cetakLabelPasienZebra(strNorec As String, view As String, qty As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim i As Integer
Dim str As String
Dim jml As Integer
    
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolLabelPasienZebra = True
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
boolGelangPasien = False

    With reportLabel
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "select pd.noregistrasi,pd.tglregistrasi,p.nocm, " & _
                    "upper(p.namapasien) as namapasien, jk.reportdisplay as jk, " & _
                        "p.tgllahir from pasiendaftar_t pd " & _
                      " INNER JOIN pasien_m p on pd.nocmfk=p.id " & _
                       " INNER JOIN jeniskelamin_m jk on jk.id=p.objectjeniskelaminfk " & _
                       " where pd.noregistrasi ='" & strNorec & "' "
            
'            jml = qty - 1
            
            str = ""
            If Val(qty) - 1 = 0 Then
                adoReport.CommandText = strSQL
             Else
                For i = 1 To Val(qty) - 1
                    str = strSQL & " union all " & str
                Next
                
                adoReport.CommandText = str & strSQL
           
           End If
           
            adoReport.CommandType = adCmdUnknown
            
            
            .database.AddADOCommand CN_String, adoReport


            .udtgl.SetUnboundFieldSource ("{ado.tgllahir}")

            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")
    
            .udtgl1.SetUnboundFieldSource ("{ado.tgllahir}")
            .usNoreg1.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm1.SetUnboundFieldSource ("{ado.nocm}")
            .usNp1.SetUnboundFieldSource ("{ado.namapasien}")
            .usjk1.SetUnboundFieldSource ("{ado.jk}")
   
            
            
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "LabelPasien")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportLabel
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub
Public Sub cetakSummaryList(strNorec As String, view As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
   
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = True
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False

    With reportSumList
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT  ps.nocm,ps.namapasien,ps.namaayah, case when ps.namakeluarga is null then '-' else ps.namakeluarga end as namakeluarga,ps.tempatlahir,ps.tgllahir, " & _
                       " jk.jeniskelamin,ps.noidentitas,ag.agama,pk.pekerjaan,kb.name as kebangsaan, " & _
                       " case when al.alamatlengkap is null then '-' else al.alamatlengkap end as alamatlengkap  , " & _
                       " case when al.kotakabupaten is null then '-' else al.kotakabupaten end as kotakabupaten  , " & _
                       " case when al.kecamatan is null then '-' else al.kecamatan end as kecamatan  , " & _
                       " case when al.namadesakelurahan is null then '-' else al.namadesakelurahan end as namadesakelurahan  , " & _
                       " ps.notelepon as mobilephone1, " & _
                       " sp.statusperkawinan from pasien_m ps " & _
                       " left JOIN jeniskelamin_m jk on jk.id=ps.objectjeniskelaminfk " & _
                       " left JOIN alamat_m al on ps.id=al.nocmfk " & _
                       " left JOIN agama_m ag on ps.objectagamafk=ag.id " & _
                       " left JOIN pekerjaan_m pk on pk.id=ps.objectpekerjaanfk " & _
                       " LEFT JOIN kebangsaan_m kb on kb.id=ps.objectkebangsaanfk " & _
                       " left JOIN statusperkawinan_m sp on sp.id=ps.objectstatusperkawinanfk " & _
                       " where ps.nocm ='" & strNorec & "' "
            
            ReadRs strSQL
                
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport

            If rs.BOF Then
                .txtumur.SetText "-"
            Else
                .txtumur.SetText hitungUmurNew(Format(rs!tgllahir, "yyyy/MM/dd"), Format(Now, "yyyy/MM/dd"))
            End If
            .txtlTglLahir.SetText Format(rs!tgllahir, "yyyy/MM/dd")
             

            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usNamaKeuarga.SetUnboundFieldSource ("{ado.namakeluarga}")
            .udTglLahir.SetUnboundFieldSource ("{ado.tglLahir}")

            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
            .usKota.SetUnboundFieldSource ("{ado.kotakabupaten}")
           
           
           .usKel.SetUnboundFieldSource ("{ado.namadesakelurahan}")
           .usKec.SetUnboundFieldSource ("{ado.kecamatan}")
           .usHp.SetUnboundFieldSource ("{ado.mobilephone1}")
           .usTL.SetUnboundFieldSource ("{ado.tempatlahir}")
           .usAgama.SetUnboundFieldSource ("{ado.agama}")
           .usKebgsaan.SetUnboundFieldSource ("{ado.kebangsaan}")
           .usPekerjaan.SetUnboundFieldSource ("{ado.pekerjaan}")
           .usStatusPerkawinan.SetUnboundFieldSource ("{ado.statusperkawinan}")
           .usKatp.SetUnboundFieldSource ("{ado.noidentitas}")
'           .usKatp.SetUnboundFieldSource ("{noidentitas}")
           
           ' .usNoTlpn.SetUnboundFieldSource ("{ado.kotakabupaten}")
           ' .usRt.SetUnboundFieldSource ("{ado.Rt}")
           ' .usRw.SetUnboundFieldSource ("{ado.rw}")
           ' .usSuku.SetUnboundFieldSource ("{ado.agama}")
          
           ' .usJenisPembayaran.SetUnboundFieldSource ("{noidentitas}")
           ' .usAlergi.SetUnboundFieldSource ("{noidentitas}")
           
          
           
           
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "SummaryList")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportSumList
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:
    MsgBox Err.Number & " " & Err.Description
End Sub
Public Sub cetakTriage(strNorec As String, view As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
   
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False

    With reportTriage
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT pd.noregistrasi,ps.tgllahir, ps.namapasien,ps.nocm,format(pd.tglregistrasi,'yyyy/MM/dd') as tglregistrasi, format(pd.tglregistrasi,'HH:mm') as jamregistrasi, DATEDIFF(hour,ps.tgllahir,GETDATE())/8766 AS umur,ps.tgllahir, jk.jeniskelamin,alm.alamatlengkap,ps.nohp " & _
                       " from pasiendaftar_t as pd " & _
                       " join pasien_m as ps on pd.nocmfk= ps.id " & _
                       " left join alamat_m as alm on alm.nocmfk=ps.id " & _
                       " LEFT JOIN jeniskelamin_m as jk on jk.id= ps.objectjeniskelaminfk " & _
                       " where pd.noregistrasi='" & strNorec & "' "
            
            ReadRs strSQL
                
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport

            If rs.BOF Then
                .txtTglLahir.SetText "-"
            Else
                .txtTglLahir.SetText hitungUmurNew(Format(rs!tgllahir, "yyyy/MM/dd"), Format(Now, "yyyy/MM/dd")) 'RS!umur
            End If
            '.txtTglLahir.SetText Format(RS!umur, "yyyy/MM/dd")
            .txtumur.SetText Format(rs!tgllahir, "yyyy  MM  dd")
'            .txtTglLahir.SetText (RS!umur)
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
           ' .usNamaKeuarga.SetUnboundFieldSource ("{ado.namakeluarga}")
            .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")

            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
            .usJamRegis.SetUnboundFieldSource ("{ado.jamregistrasi}")
            .usTglRegis.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usHp.SetUnboundFieldSource ("{ado.nohp}")
         
           
          
           
           
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "CetakTriaseIGD")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportTriage
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:
    MsgBox Err.Number & " " & Err.Description
End Sub

'cetakLembarMasuk
'Public Sub cetakLembarMasuk(strNorec As String, view As String)
'On Error GoTo errLoad
'Set frmCetakPendaftaran = Nothing
'Dim strSQL As String
'
'boolBlangkoBpjs = False
'bolBuktiPendaftaran = False
'bolBuktiLayanan = False
'bolBuktiLayananRuangan = False
'bolBuktiLayananRuanganPerTindakan = False
'bolcetakSep = False
'bolTracer1 = False
'bolKartuPasien = False
'boolLabelPasien = False
'boolLabelPasienZebra = False
'boolSumList = False
'boolLembarRMK = True
'boolLembarPersetujuan = False
'bolBuktiLayananRuanganBedah = False
'
'    With reportRmk
'            Set adoReport = New ADODB.Command
'             adoReport.ActiveConnection = CN_String
'
'            strSQL = "SELECT pd.noregistrasi,ps.nocm,UPPER (ps.namapasien) AS namapasien,UPPER(CASE WHEN ps.namakeluarga IS NULL THEN '-' ELSE ps.namakeluarga END) AS namakeluarga, " & _
'                     "CONVERT(VARCHAR,ps.tgllahir, 105) AS tgllahir,UPPER(jk.jeniskelamin) as jeniskelamin,UPPER(ag.agama) as agama,UPPER(pend.pendidikan) as pendidikan, " & _
'                     "UPPER(sp.statusperkawinan) as statusperkawinan,UPPER(pk.pekerjaan) as pekerjaan,ps.penanggungjawab,ps.teleponpenanggungjawab,ps.alamatrmh, " & _
'                     "CONVERT(VARCHAR,pd.tglregistrasi, 105) AS tglregistrasi,CONVERT(VARCHAR,pd.tglregistrasi, 8) AS jamregistrasi,UPPER(kp.kelompokpasien) as kelompokpasien, " & _
'                     "UPPER(kls.namakelas) as kelas,UPPER(ru.namaruangan) as ruangan,CASE WHEN ddp.keterangan IS NULL THEN dg.kddiagnosa + ', ' + dg.namadiagnosa ELSE ddp.keterangan END AS namadiagnosa " & _
'                     "FROM pasiendaftar_t as pd " & _
'                     "INNER JOIN antrianpasiendiperiksa_t as apd ON pd.norec = apd.noregistrasifk " & _
'                     "INNER JOIN pasien_m as ps ON pd.nocmfk = ps.id " & _
'                     "INNER JOIN jeniskelamin_m as jk ON jk.id = ps.objectjeniskelaminfk " & _
'                     "INNER JOIN alamat_m as al ON ps.id = al.nocmfk " & _
'                     "INNER JOIN agama_m as ag on ag.id = ps.objectagamafk " & _
'                     "INNER JOIN pendidikan_m as pend on pend.id = ps.objectpendidikanfk " & _
'                     "INNER JOIN statusperkawinan_m as sp on sp.id = ps.objectstatusperkawinanfk " & _
'                     "INNER JOIN pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk " & _
'                     "INNER JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk " & _
'                     "INNER JOIN kelas_m as kls on kls.id = pd.objectkelasfk " & _
'                     "INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk " & _
'                     "LEFT JOIN detaildiagnosapasien_t AS ddp ON ddp.noregistrasifk = apd.norec " & _
'                     "LEFT JOIN diagnosa_m AS dg ON dg.id = ddp.objectdiagnosafk " & _
'                     "LEFT JOIN jenisdiagnosa_m AS jd ON jd.id = ddp.objectjenisdiagnosafk " & _
'                     "where apd.norec ='" & strNorec & "'"
'
'            ReadRs strSQL
'            adoReport.CommandText = strSQL
'            adoReport.CommandType = adCmdUnknown
'            .database.AddADOCommand CN_String, adoReport
'            If rs.BOF Then
'                .txtUmur.SetText "Umur -"
'            Else
'                .txtUmur.SetText "Umur " & hitungUmur(rs!tgllahir), rs!tglRegistrasi
'            End If
'                .usNorm.SetUnboundFieldSource ("{ado.nocm}")
'            If view = "false" Then
'                strPrinter1 = GetTxt("Setting.ini", "Printer", "CetakRMK")
'                .SelectPrinter "winspool", strPrinter1, "Ne00:"
'                .PrintOut False
'                Unload Me
'                Screen.MousePointer = vbDefault
'             Else
'                With CRViewer1
'                    .ReportSource = reportRmk
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'                Screen.MousePointer = vbDefault
'            End If
'
'    End With
'Exit Sub
'errLoad:
'    MsgBox Err.Number & " " & Err.Description
''    MsgBox Err.Description, vbInformation
'End Sub

Public Sub cetakLembarMasukByNorec_APD(strNorec As String, umur As String, view As String)
'On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim strUmur As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = True
boolLembarPersetujuan = False
boolGelangPasien = False

Dim ruanganAsal As String
Dim i As Integer
i = 0
If umur <> "" Then
   strUmur = umur
Else
  strUmur = "-"
End If

    With reportRmk
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
             
             strSQL = "SELECT pd.noregistrasi,ps.nocm,UPPER (ps.namapasien) AS namapasien,UPPER(CASE WHEN ps.namakeluarga IS NULL THEN '-' ELSE ps.namakeluarga END) AS namakeluarga, " & _
                      "CONVERT(VARCHAR,ps.tgllahir, 105) AS tgllahir,UPPER(jk.jeniskelamin) as jeniskelamin,UPPER(ag.agama) as agama,UPPER(pend.pendidikan) as pendidikan, " & _
                      "UPPER(sp.statusperkawinan) as statusperkawinan,UPPER(pk.pekerjaan) as pekerjaan,UPPER(ps.penanggungjawab) as penanggungjawab,ps.teleponpenanggungjawab,UPPER(ps.alamatrmh) as alamatrmh,UPPER(ps.hubungankeluargapj) as  hubungankeluargapj, " & _
                      "CONVERT(VARCHAR,pd.tglregistrasi, 105) AS tglregistrasi,CONVERT(VARCHAR,pd.tglregistrasi, 8) AS jamregistrasi,UPPER(kp.kelompokpasien) as kelompokpasien, " & _
                      "CASE WHEN pg.namalengkap IS NULL THEN '-' ELSE pg.namalengkap end as dpjp, UPPER(kls.namakelas) as kelas,UPPER(ru.namaruangan) as ruangan, " & _
                      "CASE WHEN dg.namadiagnosa IS NULL THEN '' ELSE dg.namadiagnosa END AS namadiagnosa,CONVERT(VARCHAR,apd.tglmasuk,105) AS tglmasuk,CONVERT(VARCHAR,apd.tglmasuk,8) AS jammasuk, " & _
                      "UPPER(al.alamatlengkap) as alamatlengkap,UPPER(ru.namaruangan) + ' - ' + UPPER(kls.namakelas) as bangsal,CASE WHEN dg.kddiagnosa IS NULL THEN '' ELSE dg.kddiagnosa END AS kddiagnosa, " & _
                      "case when ru1.objectdepartemenfk in (18,34,45,30,26) THEN 'Rawat Jalan' when ru1.objectdepartemenfk in (24) then 'Gawat Darurat' else '-' end as asalruangan " & _
                      "FROM pasiendaftar_t as pd " & _
                      "INNER JOIN antrianpasiendiperiksa_t as apd ON pd.norec = apd.noregistrasifk " & _
                      "INNER JOIN pasien_m as ps ON pd.nocmfk = ps.id " & _
                      "LEFT JOIN jeniskelamin_m as jk ON jk.id = ps.objectjeniskelaminfk " & _
                      "LEFT JOIN alamat_m as al ON ps.id = al.nocmfk " & _
                      "LEFT JOIN agama_m as ag on ag.id = ps.objectagamafk " & _
                      "LEFT JOIN pendidikan_m as pend on pend.id = ps.objectpendidikanfk " & _
                      "LEFT JOIN statusperkawinan_m as sp on sp.id = ps.objectstatusperkawinanfk " & _
                      "LEFT JOIN pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk " & _
                      "LEFT JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk " & _
                      "LEFT JOIN kelas_m as kls on kls.id = pd.objectkelasfk " & _
                      "LEFT JOIN ruangan_m as ru on ru.id = apd.objectruanganfk " & _
                      "LEFT JOIN detaildiagnosapasien_t AS ddp ON ddp.noregistrasifk = apd.norec " & _
                      "LEFT JOIN diagnosa_m AS dg ON dg.id = ddp.objectdiagnosafk " & _
                      "LEFT JOIN jenisdiagnosa_m AS jd ON jd.id = ddp.objectjenisdiagnosafk " & _
                      "LEFT JOIN pegawai_m as pg on pg.id = apd.objectpegawaifk LEFT JOIN ruangan_m AS ru1 ON ru1.id = pd.objectruanganasalfk " & _
                      "WHERE apd.norec ='" & strNorec & "'"
                      
            ReadRs2 "select pro.namaproduk FROM antrianpasiendiperiksa_t as apd " & _
                    "INNER JOIN strukresep_t as sr on sr.pasienfk = apd.norec " & _
                    "INNER JOIN pelayananpasien_t as pp on pp.strukresepfk = sr.norec " & _
                    "INNER JOIN produk_m as pro on pro.id = pp.produkfk " & _
                    "where apd.norec = '" & strNorec & "'"
                    
            ReadRs strSQL
            Dim noCm As String
            noCm = "-"
            If rs.EOF = False Then
                noCm = rs!noCm
                ruanganAsal = rs!asalruangan
            End If
                    
            ReadRs4 "SELECT CASE WHEN ru.objectdepartemenfk IN (16, 25, 26) THEN 1 ELSE 0 END AS statusinap " & _
                    "FROM pasien_m AS ps INNER JOIN pasiendaftar_t AS pd ON pd.nocmfk = ps.id " & _
                    "INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk " & _
                    "LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk " & _
                    "LEFT JOIN batalregistrasi_t AS br ON br.pasiendaftarfk = pd.norec " & _
                    "WHERE br.pasiendaftarfk IS NULL AND ps.nocm = '" & noCm & "' AND ps.statusenabled = 1 " & _
                    "ORDER BY pd.tglregistrasi ASC"
             
            Dim jmlahRawat As Integer
            jmlahRawat = 0
            If RS4.EOF = False Then
              For i = 0 To RS4.RecordCount - 1
                  jmlahRawat = jmlahRawat + RS4!statusinap
                  RS4.MoveNext
              Next
            End If
                    
            Dim aingmacan As String
            For i = 0 To RS2.RecordCount - 1
                aingmacan = aingmacan & " " & vbCrLf & RS2!namaproduk
                RS2.MoveNext
            Next
              
'            ReadRs strSQL
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
'            If RS2.EOF = False Then
                .txtumur.SetText strUmur
                .usAgama.SetUnboundFieldSource ("{ado.agama}")
                .usAlamatP.SetUnboundFieldSource ("{ado.alamatrmh}")
                .usAlamatPasien.SetUnboundFieldSource ("{ado.alamatlengkap}")
                .usCaraBayar.SetUnboundFieldSource ("{ado.kelompokpasien}")
                .usHubunganPasien.SetUnboundFieldSource ("{ado.hubungankeluargapj}")
                .usTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
                .usTglMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}") '("{ado.tglmasuk}")
                .usJamMasuk.SetUnboundFieldSource ("{ado.jammasuk}") '("{ado.jamregistrasi}")
                .usJenisKelamin.SetUnboundFieldSource ("{ado.jeniskelamin}")
                .usKelasBangsal.SetUnboundFieldSource ("{ado.kelas}")
                .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
                .usNamaPJawab.SetUnboundFieldSource ("{ado.penanggungjawab}")
                .usNamDokterDpjp.SetUnboundFieldSource ("{ado.dpjp}")
                .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
                .usNoRM.SetUnboundFieldSource ("{ado.nocm}")
                .usPekerjaan.SetUnboundFieldSource ("{ado.pekerjaan}")
                .usTeleponP.SetUnboundFieldSource ("{ado.teleponpenanggungjawab}")
                .usPendidikan.SetUnboundFieldSource ("{ado.pendidikan}")
                .usStatusMartial.SetUnboundFieldSource ("{ado.statusperkawinan}")
                .usKelasBangsal.SetUnboundFieldSource ("{ado.bangsal}")
                .txtNamaObat.SetText aingmacan
                .usKodeDiagnosa.SetUnboundFieldSource ("{ado.kddiagnosa}")
                .usDiagnosaMasuk.SetUnboundFieldSource ("{ado.namadiagnosa}")
                .txtCaraMasuk.SetText ruanganAsal
                .txtVersion.SetText App.Comments
                .txtLamaRawat.SetText jmlahRawat
'            End If
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "CetakRMK")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportRmk
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:
    MsgBox Err.Number & " " & Err.Description
'    MsgBox Err.Description, vbInformation
End Sub
Public Sub cetakLembarMasukByNorec_APD_Polri(strNorec As String, caraBayar As String, umur As String, Petugas As String, view As String)
'On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim strUmur As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = True
boolLembarPersetujuan = False
boolGelangPasien = False

Dim ruanganAsal As String
Dim i As Integer
i = 0
If umur <> "" Then
   strUmur = umur
Else
  strUmur = "-"
End If

    With reportRmkPolri
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
             
             strSQL = "SELECT pd.noregistrasi,ps.nocm,ddp.keterangan,ps.notelepon,rek.namarekanan,kes.kesatuanpasien,ps.nrp,UPPER (ps.namapasien) AS namapasien,UPPER(CASE WHEN ps.namakeluarga IS NULL THEN '-' ELSE ps.namakeluarga END) AS namakeluarga, " & _
                      "CONVERT(VARCHAR,ps.tgllahir, 105) AS tgllahir,UPPER(jk.jeniskelamin) as jeniskelamin,UPPER(ag.agama) as agama,UPPER(pend.pendidikan) as pendidikan, " & _
                      "UPPER(sp.statusperkawinan) as statusperkawinan,UPPER(pk.pekerjaan) as pekerjaan,UPPER(ps.penanggungjawab) as penanggungjawab,ps.teleponpenanggungjawab,UPPER(ps.alamatrmh) as alamatrmh,UPPER(ps.hubungankeluargapj) as  hubungankeluargapj, " & _
                      "CONVERT(VARCHAR,pd.tglregistrasi, 105) AS tglregistrasi,CONVERT(VARCHAR,pd.tglregistrasi, 8) AS jamregistrasi,UPPER(kp.kelompokpasien) as kelompokpasien, " & _
                      "CASE WHEN pg.namalengkap IS NULL THEN '-' ELSE pg.namalengkap end as dpjp, UPPER(kls.namakelas) as kelas,UPPER(ru.namaruangan) as ruangan, " & _
                      "CASE WHEN dg.namadiagnosa IS NULL THEN '' ELSE dg.namadiagnosa END AS namadiagnosa,CONVERT(VARCHAR,apd.tglmasuk,105) AS tglmasuk,CONVERT(VARCHAR,apd.tglmasuk,8) AS jammasuk, " & _
                      "UPPER(al.alamatlengkap) as alamatlengkap,UPPER(ru.namaruangan) + ' - ' + UPPER(kls.namakelas) as bangsal,CASE WHEN dg.kddiagnosa IS NULL THEN '' ELSE dg.kddiagnosa END AS kddiagnosa, " & _
                      "case when ru1.objectdepartemenfk in (18,34,45,30,26) THEN 'Rawat Jalan' when ru1.objectdepartemenfk in (24) then 'Gawat Darurat' else '-' end as asalruangan " & _
                      "FROM pasiendaftar_t as pd " & _
                      "INNER JOIN antrianpasiendiperiksa_t as apd ON pd.norec = apd.noregistrasifk " & _
                      "INNER JOIN pasien_m as ps ON pd.nocmfk = ps.id " & _
                      "LEFT JOIN jeniskelamin_m as jk ON jk.id = ps.objectjeniskelaminfk " & _
                      "LEFT JOIN alamat_m as al ON ps.id = al.nocmfk " & _
                      "LEFT JOIN agama_m as ag on ag.id = ps.objectagamafk " & _
                      "LEFT JOIN pendidikan_m as pend on pend.id = ps.objectpendidikanfk " & _
                      "LEFT JOIN statusperkawinan_m as sp on sp.id = ps.objectstatusperkawinanfk " & _
                      "LEFT JOIN pekerjaan_m as pk on pk.id = ps.objectpekerjaanfk " & _
                      "LEFT JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk " & _
                      "LEFT JOIN kelas_m as kls on kls.id = pd.objectkelasfk " & _
                      "LEFT JOIN ruangan_m as ru on ru.id = apd.objectruanganfk " & _
                      "LEFT JOIN detaildiagnosapasien_t AS ddp ON ddp.noregistrasifk = apd.norec " & _
                      "LEFT JOIN diagnosa_m AS dg ON dg.id = ddp.objectdiagnosafk " & _
                      "LEFT JOIN jenisdiagnosa_m AS jd ON jd.id = ddp.objectjenisdiagnosafk " & _
                      "LEFT JOIN pegawai_m as pg on pg.id = apd.objectpegawaifk LEFT JOIN ruangan_m AS ru1 ON ru1.id = pd.objectruanganasalfk " & _
                      "LEFT JOIN rekanan_m AS rek ON rek.id = pd.objectrekananfk LEFT JOIN kesatuanpasien_m AS kes ON kes.id = ps.objectkesatuanfk WHERE apd.norec ='" & strNorec & "'"
                      

                    
            ReadRs strSQL
            Dim noCm As String
            noCm = "-"
            If rs.EOF = False Then
                noCm = rs!noCm
                ruanganAsal = rs!asalruangan
            End If

            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
'            If RS2.EOF = False Then
                .txtumur.SetText strUmur
                .usAgama.SetUnboundFieldSource ("{ado.agama}")
                .usAlamatP.SetUnboundFieldSource ("{ado.alamatrmh}")
                .usAlamatPasien.SetUnboundFieldSource ("{ado.alamatlengkap}")
                .usCaraBayar.SetUnboundFieldSource ("{ado.kelompokpasien}")
                .usHubunganPasien.SetUnboundFieldSource ("{ado.hubungankeluargapj}")
                .usTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
                .usTglMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}") '("{ado.tglmasuk}")
                .usJamMasuk.SetUnboundFieldSource ("{ado.jammasuk}") '("{ado.jamregistrasi}")
                .usJenisKelamin.SetUnboundFieldSource ("{ado.jeniskelamin}")
                .usKelasBangsal.SetUnboundFieldSource ("{ado.kelas}")
                .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
                .usNamaPJawab.SetUnboundFieldSource ("{ado.penanggungjawab}")
                .usNamDokterDpjp.SetUnboundFieldSource ("{ado.dpjp}")
                .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
                .usNoRM.SetUnboundFieldSource ("{ado.nocm}")
'                .usPekerjaan.SetUnboundFieldSource ("{ado.pekerjaan}")
                .usTeleponP.SetUnboundFieldSource ("{ado.teleponpenanggungjawab}")
'                .usPendidikan.SetUnboundFieldSource ("{ado.pendidikan}")
                .usStatusMartial.SetUnboundFieldSource ("{ado.statusperkawinan}")
                .usKelasBangsal.SetUnboundFieldSource ("{ado.bangsal}")
'                .txtNamaObat.SetText aingmacan
                .usKodeDiagnosa.SetUnboundFieldSource ("{ado.kddiagnosa}")
                .usDiagnosaMasuk.SetUnboundFieldSource ("{ado.namadiagnosa}")
                .usPangkat.SetUnboundFieldSource ("{ado.nrp}")
                .UsTelepon.SetUnboundFieldSource ("{ado.notelepon}")
                .usKesatuan.SetUnboundFieldSource ("{ado.kesatuanpasien}")
                .usRekanan.SetUnboundFieldSource ("{ado.namarekanan}")
                .usKeterangan.SetUnboundFieldSource ("{ado.keterangan}")
                .txtCaraMasuk.SetText ruanganAsal
                .txtVersion.SetText App.Comments
'                .txtLamaRawat.SetText jmlahRawat
'            End If
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "CetakRMK")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportRmkPolri
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:
    MsgBox Err.Number & " " & Err.Description
'    MsgBox Err.Description, vbInformation
End Sub
Public Sub cetakFormKunjunganPasien(strNorec As String, view As String)
'On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim strUmur As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
boolGelangPasien = False
boolreportkunjungan = True
Dim ruanganAsal As String
Dim i As Integer
i = 0


    With reportFormKunjungan
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
             
             strSQL = "SELECT pd.norec, pasien_m.nocm, pasien_m.namapasien, pasien_m.tgllahir, jeniskelamin_m.jeniskelamin, " & _
                      " statusperkawinan_m.statusperkawinan, agama_m.agama,alamat_m.alamatlengkap, " & _
                      " pasien_m.notelepon,pekerjaan_m.pekerjaan,kesatuanpasien_m.kesatuanpasien,pangkat_m.namapangkat as namapangkatpolisi, " & _
                      " pasien_m.nrp, pasien_m.nip,kecamatan_m.namakecamatan,kotakabupaten_m.namakotakabupaten,pendidikan_m.pendidikan,kelompokpasien_m.kelompokpasien,rekanan_m.namaexternal " & _
                       " from pasiendaftar_t as pd LEFT JOIN pasien_m ON pd.nocmfk = pasien_m.id " & _
                       " LEFT JOIN jeniskelamin_m ON pasien_m.objectjeniskelaminfk = jeniskelamin_m.id " & _
                       " LEFT JOIN statusperkawinan_m ON pasien_m.objectstatusperkawinanfk = statusperkawinan_m.id " & _
                       " LEFT JOIN agama_m ON pasien_m.objectagamafk = agama_m.id " & _
                       " LEFT JOIN alamat_m ON pasien_m.id = alamat_m.nocmfk " & _
                       " LEFT JOIN pekerjaan_m ON pasien_m.objectpekerjaanfk = pekerjaan_m.id " & _
                       " LEFT JOIN kesatuanpasien_m ON pasien_m.objectkesatuanfk = kesatuanpasien_m.id " & _
                       " LEFT JOIN pangkat_m ON pasien_m.pangkatpolisi = pangkat_m.id " & _
                       " LEFT JOIN desakelurahan_m ON alamat_m.objectdesakelurahanfk = desakelurahan_m.id " & _
                       " LEFT JOIN kecamatan_m ON desakelurahan_m.objectkecamatanfk = kecamatan_m.id " & _
                       " LEFT JOIN kotakabupaten_m ON kecamatan_m.objectkotakabupatenfk = kotakabupaten_m.id " & _
                       " LEFT JOIN pendidikan_m ON pasien_m.objectpendidikanfk = pendidikan_m.id " & _
                       " LEFT JOIN kelompokpasien_m ON pd.objectkelompokpasienlastfk = kelompokpasien_m.id " & _
                       " LEFT JOIN rekanan_m ON pd.objectrekananfk = rekanan_m.id " & _
                       " where pd.norec ='" & strNorec & "' "
              
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport

             If Not rs.EOF Then
             .txtnocm2.SetText IIf(IsNull(rs("nocm")), "-", rs("nocm")) 'RS("nocm")
             .txtNamaPasien.SetText IIf(IsNull(rs("namapasien")), "-", rs("namapasien")) 'RS("namapasien")
             .txtTglLahir.SetText IIf(IsNull(Format(rs("tgllahir"), "dd/MM/yyyy")), "-", Format(rs("tgllahir"), "dd/MM/yyyy"))
             .txtJK.SetText IIf(IsNull(rs("jeniskelamin")), "-", rs("jeniskelamin"))
             .txtStatus.SetText IIf(IsNull(rs("statusperkawinan")), "-", rs("statusperkawinan"))
             .txtAgama.SetText IIf(IsNull(rs("agama")), "-", rs("agama"))
             .txtAlamat.SetText IIf(IsNull(rs("alamatlengkap")), "-", rs("alamatlengkap"))
             
             .txtHp.SetText IIf(IsNull(rs("notelepon")), "-", rs("notelepon"))
             .txtPekerjaan.SetText IIf(IsNull(rs("pekerjaan")), "-", rs("pekerjaan"))
             .txtKesatuan.SetText IIf(IsNull(rs("kesatuanpasien")), "-", rs("kesatuanpasien"))
             .txtPangkat.SetText IIf(IsNull(rs("namapangkatpolisi")), "-", rs("namapangkatpolisi"))
             .txtNrp.SetText IIf(IsNull(rs("nrp")), "-", rs("nrp")) & " / " & IIf(IsNull(rs("nip")), "-", rs("nip"))
             .txtKecamatan.SetText IIf(IsNull(rs("namakecamatan")), "-", rs("namakecamatan"))
             .txtKabupaten.SetText IIf(IsNull(rs("namakotakabupaten")), "-", rs("namakotakabupaten"))
             .txtPendidikan.SetText IIf(IsNull(rs("pendidikan")), "-", rs("pendidikan"))
             .txtCaraBayar.SetText IIf(IsNull(rs("kelompokpasien")), "-", rs("kelompokpasien"))
             .txtTagihan.SetText IIf(IsNull(rs("namaexternal")), "-", rs("namaexternal"))

              
             End If
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "CetakRMK")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportFormKunjungan
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:
    MsgBox Err.Number & " " & Err.Description
'    MsgBox Err.Description, vbInformation
End Sub



Public Sub cetakPersetujuan(strNorec As String, view As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
boolGelangPasien = False
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = True
bolBuktiLayananRuanganBedah = False

    With reportLembarGC
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT pd.noregistrasi,pd.tglregistrasi, " & _
                       " ps.nocm, ps.namapasien, " & _
                       " ps.tgllahir,jk.reportdisplay AS jk, " & _
                       " ps.namaayah , ru.namaruangan, kls.namakelas " & _
                       " from pasiendaftar_t pd " & _
                       " INNER JOIN pasien_m ps on pd.nocmfk=ps.id " & _
                       " INNER JOIN jeniskelamin_m jk on jk.id=ps.objectjeniskelaminfk " & _
                       " INNER JOIN antrianpasiendiperiksa_t apdp on pd.norec=apdp.noregistrasifk " & _
                       " INNER JOIN ruangan_m ru on apdp.objectruanganfk=ru.id " & _
                       " INNER JOIN kelas_m kls on  apdp.objectkelasfk=kls.id " & _
                       " where ru.objectdepartemenfk in (16,35) and pd.noregistrasi ='" & strNorec & "' "
            ReadRs strSQL
                
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
            
            If rs.EOF = False Then
                If Len(rs("nocm")) <= 8 Then
                   .txtn1.SetText Mid(rs("nocm"), 1, 1)
                   .txtn2.SetText Mid(rs("nocm"), 2, 1)
                   .txtn3.SetText Mid(rs("nocm"), 3, 1)
                   .txtn4.SetText Mid(rs("nocm"), 4, 1)
                   .txtn5.SetText Mid(rs("nocm"), 5, 1)
                   .txtn6.SetText Mid(rs("nocm"), 6, 1)
                   .txtn7.SetText Mid(rs("nocm"), 7, 1)
                   .txtn8.SetText Mid(rs("nocm"), 8, 1)
                Else
                   .txtn1.SetText Mid(rs("nocm"), 1, 2)
                   .txtn2.SetText Mid(rs("nocm"), 3, 2)
                   .txtn3.SetText Mid(rs("nocm"), 5, 2)
                   .txtn4.SetText Mid(rs("nocm"), 7, 2)
                   .txtn5.SetText Mid(rs("nocm"), 9, 2)
                   .txtn6.SetText Mid(rs("nocm"), 11, 2)
                   .txtn7.SetText Mid(rs("nocm"), 13, 2)
                   .txtn8.SetText Mid(rs("nocm"), 15, 2)
                
                End If
                
                .txtNamaKeluarga.SetText rs("namaayah")
                .txtNamaPasien.SetText rs("namapasien")
                .txtRuangan.SetText rs("namaruangan")
                .txtKelas.SetText rs("namakelas")
                If rs("Jk") = "P" Then .txtL.SetText "-" Else .txtP.SetText "-"
                .txtTglLahir.SetText Format(rs!tgllahir, "yyyy/MM/dd")
            End If
            
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "CetakGeneral")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportLembarGC
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:
    MsgBox Err.Number & " " & Err.Description

End Sub

Public Sub cetakBuktiLayananRuanganPerTindakan(strNorec As String, strIdPegawai As String, strIdRuangan As String, strIdTindakan As String, view As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim umur As String
Dim strFilter As String
Dim strFilter2 As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = True
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False

    strSQL = ""
    strFilter = ""
    strFilter2 = ""
    If strIdRuangan <> "" Then strFilter = " AND ru2.id = '" & strIdRuangan & "' "
    If strIdTindakan <> "" Then strFilter2 = " AND tp.produkfk = '" & strIdTindakan & "' "
    strFilter = strFilter & strFilter2 & " ORDER BY tp.tglpelayanan "
    With reportBuktiLayananRuanganPerTindakan
    
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien, " & _
                       " pd.tglregistrasi,jk.reportdisplay AS jk,ru2.namaruangan AS ruanganperiksa,ru.namaruangan AS ruangakhir, " & _
                       " pp.namalengkap AS namadokter,kp.kelompokpasien,tp.produkfk, " & _
                       " pro.namaproduk,tp.jumlah,CASE WHEN tp.hargasatuan is null then tp.hargajual else tp.hargasatuan END as hargasatuan," & _
                       " (case when tp.hargadiscount is null then 0 else tp.hargadiscount end)* tp.jumlah as diskon, " & _
                       " hargasatuan*tp.jumlah as total,ks.namakelas,ar.asalrujukan, " & _
                       " CASE WHEN rek.namarekanan is null then '-' else rek.namarekanan END as namapenjamin,kmr.namakamar " & _
                       " FROM pasiendaftar_t AS pd INNER JOIN pasien_m AS ps ON pd.nocmfk = ps.id " & _
                       " INNER JOIN jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.id " & _
                       " LEFT JOIN pegawai_m AS pp ON pd.objectpegawaifk = pp.id " & _
                       " INNER JOIN kelompokpasien_m AS kp ON pd.objectkelompokpasienlastfk = kp.id " & _
                       " INNER JOIN antrianpasiendiperiksa_t AS apdp ON apdp.noregistrasifk = pd.norec " & _
                       " INNER JOIN ruangan_m AS ru ON apdp.objectruanganfk = ru.id " & _
                       " LEFT JOIN pelayananpasien_t AS tp ON tp.noregistrasifk = apdp.norec " & _
                       " LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id " & _
                       " LEFT JOIN kelas_m AS ks ON apdp.objectkelasfk = ks.id " & _
                       " LEFT JOIN asalrujukan_m AS ar ON apdp.objectasalrujukanfk = ar.id " & _
                       " left JOIN rekanan_m AS rek ON rek.id= pd.objectrekananfk " & _
                       " left JOIN kamar_m as kmr on apdp.objectkamarfk=kmr.id " & _
                       " INNER join ruangan_m  as ru2 on ru2.id=apdp.objectruanganfk " & _
                       " where pd.noregistrasi ='" & strNorec & "' and pro.id <> 402611 " & strFilter
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            
            .database.AddADOCommand CN_String, adoReport
            If rs.BOF Then
                .txtumur.SetText "-"
            Else
                .txtumur.SetText hitungUmur(Format(rs!tgllahir, "yyyy/MM/dd"), Format(Now, "yyyy/MM/dd"))
            End If
            
            .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")

            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")

            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")

            .usUnitLayanan.SetUnboundFieldSource ("{ado.ruanganperiksa}")
            .usTipe.SetUnboundFieldSource ("{ado.kelompokpasien}")

            .usRujukan.SetUnboundFieldSource ("{ado.asalrujukan}")
            .usruangperiksa.SetUnboundFieldSource ("{ado.ruangakhir}")
            .usQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usKamar.SetUnboundFieldSource ("if isnull({ado.namakamar}) then "" - "" else {ado.namakamar} ")
            .usKelas.SetUnboundFieldSource ("if isnull({ado.namakelas}) then "" - "" else {ado.namakelas} ") '("{ado.namakelas}")
            .usPenjamin.SetUnboundFieldSource ("{ado.namapenjamin}")

            .usDokter.SetUnboundFieldSource ("{ado.namadokter}")

            .usPelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .ucTarif.SetUnboundFieldSource ("{ado.hargasatuan}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .usJumlah.SetUnboundFieldSource ("{ado.jumlah}")
            .udTglPelayanan.Suppress = True
            
'            .ucTotal.SetUnboundFieldSource ("{ado.total}")

            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
            If RS2.BOF Then
                .txtUser.SetText "-"
            Else
                .txtUser.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
            End If
            
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "BuktiLayananRuanganPerTindakan")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportBuktiLayananRuanganPerTindakan
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:
    MsgBox Err.Number & " " & Err.Description
End Sub

Public Sub cetakBuktiLayananRuanganPerTindakanByNorec(strNorec As String, strIdPegawai As String, strIdRuangan As String, view As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim umur As String
Dim strFilter As String
Dim strFilter2 As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = True
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False

    Dim strarr() As String
    Dim norec_apc As String
    Dim i As Integer
    
    
    strarr = Split(strNorec, "|")
    For i = 0 To UBound(strarr)
       norec_apc = norec_apc + "'" & strarr(i) & "',"
    Next
    norec_apc = Left(norec_apc, Len(norec_apc) - 1)
    
    strSQL = ""
    strFilter = ""
    strFilter2 = ""
'    If strIdRuangan <> "" Then strFilter = " AND ru2.id = '" & strIdRuangan & "' "
'    If strIdTindakan <> "" Then strFilter2 = " AND tp.produkfk = '" & strIdTindakan & "' "
    strFilter = strFilter & strFilter2 & " ORDER BY tp.tglpelayanan "
    With reportBuktiLayananRuanganPerTindakan
    
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,convert(varchar,ps.tgllahir,105) as tglKelahiran,ps.namapasien, " & _
                       " apdp.tglregistrasi,jk.reportdisplay AS jk,ru2.namaruangan AS ruanganperiksa,ru.namaruangan AS ruangakhir, " & _
                       " (select top 1 pg.namalengkap from pegawai_m as pg INNER JOIN pelayananpasienpetugas_t p3 on p3.objectpegawaifk=pg.id " & _
                       "where p3.pelayananpasien=tp.norec and p3.objectjenispetugaspefk=4 ) AS namadokter,kp.kelompokpasien,tp.produkfk, " & _
                       " pro.namaproduk,tp.jumlah,CASE WHEN tp.hargasatuan is null then tp.hargajual else tp.hargasatuan + tp.jasa END as hargasatuan," & _
                       " (case when tp.hargadiscount is null then 0 else tp.hargadiscount end) as diskon, " & _
                       " hargasatuan*tp.jumlah + tp.jasa as total,ks.namakelas,ar.asalrujukan,tp.tglpelayanan, " & _
                       " CASE WHEN rek.namarekanan is null then '-' else rek.namarekanan END as namapenjamin,kmr.namakamar, " & _
                       " pg1.namalengkap as dktrdpjp,ks1.namakelas as namakelas_pd,alm.alamatlengkap FROM pasiendaftar_t AS pd INNER JOIN pasien_m AS ps ON pd.nocmfk = ps.id " & _
                       " INNER JOIN jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.id " & _
                       " INNER JOIN kelompokpasien_m AS kp ON pd.objectkelompokpasienlastfk = kp.id " & _
                       " INNER JOIN antrianpasiendiperiksa_t AS apdp ON apdp.noregistrasifk = pd.norec " & _
                       " INNER JOIN ruangan_m AS ru ON pd.objectruanganlastfk= ru.id " & _
                       " LEFT JOIN pelayananpasien_t AS tp ON tp.noregistrasifk = apdp.norec " & _
                       " LEFT JOIN pegawai_m AS pp ON apdp.objectpegawaifk = pp.id " & _
                       " LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id " & _
                       " LEFT JOIN kelas_m AS ks ON apdp.objectkelasfk = ks.id " & _
                       " LEFT JOIN kelas_m AS ks1 ON pd.objectkelasfk = ks1.id " & _
                       " LEFT JOIN asalrujukan_m AS ar ON apdp.objectasalrujukanfk = ar.id " & _
                       " left JOIN rekanan_m AS rek ON rek.id= pd.objectrekananfk " & _
                       " left JOIN kamar_m as kmr on apdp.objectkamarfk=kmr.id " & _
                       " INNER join ruangan_m  as ru2 on ru2.id=apdp.objectruanganfk " & _
                       " LEFT JOIN pegawai_m as pg1 on pg1.id = pd.objectpegawaifk " & _
                       " LEFT JOIN alamat_m as alm on alm.nocmfk = ps.id " & _
                       " where tp.norec  in (" & norec_apc & ") and pro.id <> 402611  " & strFilter
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            
            .database.AddADOCommand CN_String, adoReport
            If rs.BOF Then
                .txtumur.SetText "-"
            Else
                .txtumur.SetText rs!tglKelahiran 'hitungUmurNew(Format(rs!tgllahir, "yyyy/MM/dd"), Format(Now, "yyyy/MM/dd"))
            End If
            
            .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")

            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")

            .usUnitLayanan.SetUnboundFieldSource ("{ado.ruanganperiksa}")
            .usTipe.SetUnboundFieldSource ("{ado.kelompokpasien}")

            .usRujukan.SetUnboundFieldSource ("{ado.asalrujukan}")
            .usruangperiksa.SetUnboundFieldSource ("{ado.ruangakhir}")
            .usQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usKamar.SetUnboundFieldSource ("if isnull({ado.namakamar}) then "" - "" else {ado.namakamar} ")
            .usKelas.SetUnboundFieldSource ("if isnull({ado.namakelas_pd}) then "" - "" else {ado.namakelas_pd} ") '("{ado.namakelas_pd}")
            .usPenjamin.SetUnboundFieldSource ("{ado.namapenjamin}")

            .usDokter.SetUnboundFieldSource ("{ado.namadokter}")
            .udTglPelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .usPelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .ucTarif.SetUnboundFieldSource ("{ado.hargasatuan}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .usJumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            .usDokterDpjp.SetUnboundFieldSource ("{ado.dktrdpjp}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")

            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
            If RS2.BOF Then
                .txtUser.SetText "-"
            Else
                .txtUser.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
            End If
            
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "BuktiLayananRuanganPerTindakan")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportBuktiLayananRuanganPerTindakan
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:
    MsgBox Err.Number & " " & Err.Description
End Sub

Public Sub cetakBuktiLayananJasa(strNorec As String, strIdPegawai As String, strIdRuangan As String, view As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim umur As String
Dim strFilter As String
Dim strFilter2 As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolBuktiLayananJasa = True
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False

    Dim strarr() As String
    Dim norec_apc As String
    Dim i As Integer
    
    
    strarr = Split(strNorec, "|")
    For i = 0 To UBound(strarr)
       norec_apc = norec_apc + "'" & strarr(i) & "',"
    Next
    norec_apc = Left(norec_apc, Len(norec_apc) - 1)
    
    strSQL = ""
    strFilter = ""
    strFilter2 = ""
'    If strIdRuangan <> "" Then strFilter = " AND ru2.id = '" & strIdRuangan & "' "
'    If strIdTindakan <> "" Then strFilter2 = " AND tp.produkfk = '" & strIdTindakan & "' "
    strFilter = strFilter & strFilter2 & " ORDER BY tp.tglpelayanan "
    With reportBuktiLayananJasa
    
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,convert(varchar, ps.tgllahir, 105) as tglKelahiran,ps.namapasien, " & _
                       " apdp.tglregistrasi,jk.reportdisplay AS jk,ru2.namaruangan AS ruanganperiksa,ru.namaruangan AS ruangakhir, " & _
                       " case when ru.objectdepartemenfk =16 then (select top 1 pg.namalengkap from pegawai_m as pg INNER JOIN pelayananpasienpetugas_t p3 on p3.objectpegawaifk=pg.id " & _
                       "where p3.pelayananpasien=tp.norec and p3.objectjenispetugaspefk=4 ) else pp.namalengkap end AS namadokter,kp.kelompokpasien,tp.produkfk, " & _
                       " pro.namaproduk,tp.jumlah," & _
                       " (select top 1 case when hargajual is null then 0 else hargajual end as hargajual from pelayananpasiendetail_t where pelayananpasien=tp.norec and komponenhargafk=94 ) as hargasatuan,(select top 1 case when hargadiscount is null then 0 else hargadiscount end as hargadiscount from pelayananpasiendetail_t where pelayananpasien=tp.norec and komponenhargafk=94 ) as diskon, " & _
                       " ks.namakelas,ar.asalrujukan,tp.tglpelayanan, " & _
                       " CASE WHEN rek.namarekanan is null then '-' else rek.namarekanan END as namapenjamin, " & _
                       " CASE WHEN kmr.namakamar is null then '-' else kmr.namakamar END as namakamar,alm.alamatlengkap " & _
                       " FROM pasiendaftar_t AS pd INNER JOIN pasien_m AS ps ON pd.nocmfk = ps.id " & _
                       " INNER JOIN jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.id " & _
                       " INNER JOIN kelompokpasien_m AS kp ON pd.objectkelompokpasienlastfk = kp.id " & _
                       " INNER JOIN antrianpasiendiperiksa_t AS apdp ON apdp.noregistrasifk = pd.norec " & _
                       " INNER JOIN ruangan_m AS ru ON apdp.objectruanganfk = ru.id " & _
                       " LEFT JOIN pelayananpasien_t AS tp ON tp.noregistrasifk = apdp.norec " & _
                       " LEFT JOIN pegawai_m AS pp ON apdp.objectpegawaifk = pp.id " & _
                       " LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id " & _
                       " LEFT JOIN kelas_m AS ks ON apdp.objectkelasfk = ks.id " & _
                       " LEFT JOIN asalrujukan_m AS ar ON apdp.objectasalrujukanfk = ar.id " & _
                       " left JOIN rekanan_m AS rek ON rek.id= pd.objectrekananfk " & _
                       " left JOIN kamar_m as kmr on apdp.objectkamarfk=kmr.id " & _
                       " INNER join ruangan_m  as ru2 on ru2.id=apdp.objectruanganfk " & _
                       " LEFT JOIN alamat_m as alm on alm.nocmfk = ps.id " & _
                       " where tp.norec  in (" & norec_apc & ") and pro.id <> 402611  " & strFilter
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            
            .database.AddADOCommand CN_String, adoReport
            If rs.BOF Then
                .txtumur.SetText "-"
            Else
                .txtumur.SetText rs!tglKelahiran 'hitungUmurNew(Format(rs!tgllahir, "yyyy/MM/dd"), Format(Now, "yyyy/MM/dd"))
            End If
            
            .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")

            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")

            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")

            .usUnitLayanan.SetUnboundFieldSource ("{ado.ruanganperiksa}")
            .usTipe.SetUnboundFieldSource ("{ado.kelompokpasien}")

            .usRujukan.SetUnboundFieldSource ("{ado.asalrujukan}")
            .usruangperiksa.SetUnboundFieldSource ("{ado.ruangakhir}")
            .usQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usKamar.SetUnboundFieldSource ("if isnull({ado.namakamar}) then "" - "" else {ado.namakamar} ")
            .usKelas.SetUnboundFieldSource ("if isnull({ado.namakelas}) then "" - "" else {ado.namakelas} ") '("{ado.namakelas}")
            .usPenjamin.SetUnboundFieldSource ("{ado.namapenjamin}")

            .usDokter.SetUnboundFieldSource ("if isnull({ado.namadokter}) then "" - "" else {ado.namadokter} ") '("{ado.namadokter}")
            .udTglPelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .usPelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .ucTarif.SetUnboundFieldSource ("if isnull({ado.hargasatuan}) then 0 else {ado.hargasatuan} ") '("{ado.hargasatuan}")
            .ucDiskon.SetUnboundFieldSource ("if isnull({ado.diskon}) then 0 else {ado.diskon} ") '("{ado.diskon}")
            .usJumlah.SetUnboundFieldSource ("if isnull({ado.jumlah}) then 0 else {ado.jumlah} ") '("{ado.jumlah}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
'            .ucTotal.SetUnboundFieldSource ("{ado.total}")

            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
            If RS2.BOF Then
                .txtUser.SetText "-"
            Else
                .txtUser.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
            End If
            
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "BuktiLayananRuanganPerTindakan")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportBuktiLayananJasa
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:
    MsgBox Err.Number & " " & Err.Description
End Sub
Public Sub cetakBuktiLayananRuanganBedah(strNorec As String, strIdPegawai As String, strIdRuangan As String, view As String)
On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim umur As String
Dim strFilter As String
Dim strFilter2 As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = True
boolGelangPasien = False

    Dim strarr() As String
    Dim norec_apc As String
    Dim i As Integer
    
    
    strarr = Split(strNorec, "|")
    For i = 0 To UBound(strarr)
       norec_apc = norec_apc + "'" & strarr(i) & "',"
    Next
    norec_apc = Left(norec_apc, Len(norec_apc) - 1)
    
    strSQL = ""
    strFilter = ""
    strFilter2 = ""
'    If strIdRuangan <> "" Then strFilter = " AND ru2.id = '" & strIdRuangan & "' "
'    If strIdTindakan <> "" Then strFilter2 = " AND tp.produkfk = '" & strIdTindakan & "' "
    strFilter = strFilter & strFilter2 & " ORDER BY tp.tglpelayanan "
    With reportBuktiLayananRuanganBedah
    
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien, " & _
                       " apdp.tglregistrasi,jk.reportdisplay AS jk,ru2.namaruangan AS ruanganperiksa,ru.namaruangan AS ruangakhir, " & _
                       " case when ru.objectdepartemenfk =16 then (select top 1 pg.namalengkap from pegawai_m as pg INNER JOIN pelayananpasienpetugas_t p3 on p3.objectpegawaifk=pg.id " & _
                       "where p3.pelayananpasien=tp.norec and p3.objectjenispetugaspefk=4 ) else pp.namalengkap end AS namadokter,kp.kelompokpasien,tp.produkfk, " & _
                       " pro.namaproduk,tp.jumlah,CASE WHEN tp.hargasatuan is null then tp.hargajual else tp.hargasatuan END as hargasatuan," & _
                       " (case when tp.hargadiscount is null then 0 else tp.hargadiscount end) as diskon, " & _
                       " hargasatuan*tp.jumlah as total,ks.namakelas,ar.asalrujukan,tp.tglpelayanan, " & _
                       " CASE WHEN rek.namarekanan is null then '-' else rek.namarekanan END as namapenjamin,kmr.namakamar " & _
                       " FROM pasiendaftar_t AS pd INNER JOIN pasien_m AS ps ON pd.nocmfk = ps.id " & _
                       " INNER JOIN jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.id " & _
                       " INNER JOIN kelompokpasien_m AS kp ON pd.objectkelompokpasienlastfk = kp.id " & _
                       " INNER JOIN antrianpasiendiperiksa_t AS apdp ON apdp.noregistrasifk = pd.norec " & _
                       " INNER JOIN ruangan_m AS ru ON apdp.objectruanganfk = ru.id " & _
                       " LEFT JOIN pelayananpasien_t AS tp ON tp.noregistrasifk = apdp.norec " & _
                       " LEFT JOIN pegawai_m AS pp ON apdp.objectpegawaifk = pp.id " & _
                       " LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id " & _
                       " LEFT JOIN kelas_m AS ks ON apdp.objectkelasfk = ks.id " & _
                       " LEFT JOIN asalrujukan_m AS ar ON apdp.objectasalrujukanfk = ar.id " & _
                       " left JOIN rekanan_m AS rek ON rek.id= pd.objectrekananfk " & _
                       " left JOIN kamar_m as kmr on apdp.objectkamarfk=kmr.id " & _
                       " INNER join ruangan_m  as ru2 on ru2.id=apdp.objectruanganfk " & _
                       " where tp.norec  in (" & norec_apc & ") and pro.id <> 402611  " & strFilter
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            
            .database.AddADOCommand CN_String, adoReport
            If rs.BOF Then
                .txtumur.SetText "-"
            Else
                .txtumur.SetText hitungUmur(Format(rs!tgllahir, "yyyy/MM/dd"), Format(Now, "yyyy/MM/dd"))
            End If
            
            .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")

            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")

            .usnocm.SetUnboundFieldSource ("{ado.nocm}")
            .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")

            .usUnitLayanan.SetUnboundFieldSource ("{ado.ruanganperiksa}")
            .usTipe.SetUnboundFieldSource ("{ado.kelompokpasien}")

            .usRujukan.SetUnboundFieldSource ("{ado.asalrujukan}")
            .usruangperiksa.SetUnboundFieldSource ("{ado.ruangakhir}")
            .usQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usKamar.SetUnboundFieldSource ("if isnull({ado.namakamar}) then "" - "" else {ado.namakamar} ")
            .usKelas.SetUnboundFieldSource ("if isnull({ado.namakelas}) then "" - "" else {ado.namakelas} ") '("{ado.namakelas}")
            .usPenjamin.SetUnboundFieldSource ("{ado.namapenjamin}")

            .usDokter.SetUnboundFieldSource ("{ado.namadokter}")
            .udTglPelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .usPelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .ucTarif.SetUnboundFieldSource ("{ado.hargasatuan}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .usJumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .ucTotal.SetUnboundFieldSource ("{ado.total}")

            ReadRs3 "select " & _
                    "sum(case when ppd.komponenhargafk=38 then ppd.hargajual*ppd.jumlah end) as jasasarana, " & _
                    "sum(case when ppd.komponenhargafk=35 then ppd.hargajual*ppd.jumlah end) as jasamedis, " & _
                    "sum(case when ppd.komponenhargafk=25 then ppd.hargajual*ppd.jumlah end) as jasaparamedis, " & _
                    "sum(case when ppd.komponenhargafk=30 then ppd.hargajual*ppd.jumlah end) as jasaumum, " & _
                    "sum(case when ppd.komponenhargafk=21 then ppd.hargajual*ppd.jumlah end) as anestesidr, " & _
                    "sum(case when ppd.komponenhargafk=22 then ppd.hargajual*ppd.jumlah end) as jasaspesialis, " & _
                    "sum(case when ppd.komponenhargafk=26 then ppd.hargajual*ppd.jumlah end) as jasaperawatanastesi, " & _
                    "sum(case when ppd.komponenhargafk=27 then ppd.hargajual*ppd.jumlah end) as jasaperawatinstr " & _
                    "from pasiendaftar_t as pd " & _
                    "inner join antrianpasiendiperiksa_t as apdp on apdp.noregistrasifk = pd.norec " & _
                    "left join pelayananpasien_t as tp on tp.noregistrasifk = apdp.norec " & _
                    "left join pelayananpasiendetail_t as ppd on ppd.pelayananpasien=tp.norec " & _
                    "left join produk_m as pro on tp.produkfk = pro.id " & _
                    " where tp.norec  in (" & norec_apc & ") and pro.id <> 402611 "
            
            If RS3.BOF = False Then
                .ucJasaSarana.SetUnboundFieldSource UCase(IIf(IsNull(RS3("jasasarana")), "0.00", RS3("jasasarana")))
                .ucJasaMedis.SetUnboundFieldSource UCase(IIf(IsNull(RS3("jasamedis")), "0.00", RS3("jasamedis")))
                .ucJasaParamedis.SetUnboundFieldSource UCase(IIf(IsNull(RS3("jasaparamedis")), "0.00", RS3("jasaparamedis")))
                .ucJasaUmum.SetUnboundFieldSource UCase(IIf(IsNull(RS3("jasaumum")), "0.00", RS3("jasaumum")))
                .ucAnestesiDr.SetUnboundFieldSource UCase(IIf(IsNull(RS3("anestesidr")), "0.00", RS3("anestesidr")))
                .ucJasaSpesialis.SetUnboundFieldSource UCase(IIf(IsNull(RS3("jasaspesialis")), "0.00", RS3("jasaspesialis")))
                .ucJasaPerawatAnastesi.SetUnboundFieldSource UCase(IIf(IsNull(RS3("jasaperawatanastesi")), "0.00", RS3("jasaperawatanastesi")))
                .ucJasaPerawatInstr.SetUnboundFieldSource UCase(IIf(IsNull(RS3("jasaperawatinstr")), "0.00", RS3("jasaperawatinstr")))
            End If

            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
            If RS2.BOF Then
                .txtUser.SetText "-"
            Else
                .txtUser.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
            End If
            
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "BuktiLayananRuanganPerTindakan")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportBuktiLayananRuanganBedah
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:
    MsgBox Err.Number & " " & Err.Description
End Sub

Public Sub cetakLBRIDENTITAS()
'On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim str1, str2, str3 As String
Dim view As String
view = "false"
    
    
        With LembarIdentitasPasien
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String

'            strSQL = "select top 1 pm.nocm,pm.namapasien,pm.tempatlahir,pm.tgllahir, " & _
'                     "case when sp.statusperkawinan is null then '-' else sp.statusperkawinan end as statusperkawinan, " & _
'                     "case when ag.agama is null then '-' else ag.agama end as agama, " & _
'                     "case when pk.pekerjaan is null then '-' else pk.pekerjaan end as pekerjaan, " & _
'                     "alm.alamatlengkap,alm.namadesakelurahan,alm.kecamatan, " & _
'                     "alm.kotakabupaten,prop.namapropinsi,alm.kodepos,pm.alamatktr, " & _
'                     "case when pm.notelepon is null then '-' else pm.notelepon end as notelepon, " & _
'                     "case when pm.noidentitas is null then '-' else pm.noidentitas end as noidentitas, " & _
'                     "case when gd.golongandarah is null then '-' else gd.golongandarah end as golongandarah, " & _
'                     "case when pen.pendidikan is null then '-' else pen.pendidikan end as pendidikan, " & _
'                     "case when pm.noasuransilain is null then '-' else  pm.noasuransilain end as noasuransilain, " & _
'                     "case when pm.nobpjs is null then '-' else pm.nobpjs end as nobpjs,jk.jeniskelamin, " & _
'                     "pm.penanggungjawab,pm.hubungankeluargapj,pm.pekerjaanpenangggungjawab,pm.ktppenanggungjawab, " & _
'                     "pm.alamatrmh " & _
'                     "from pasien_m as pm LEFT JOIN statusperkawinan_m as sp on sp.id = pm.objectstatusperkawinanfk " & _
'                     "LEFT JOIN agama_m as ag on ag.id = pm.objectagamafk LEFT JOIN pekerjaan_m as pk on pk.id = pm.objectpekerjaanfk " & _
'                     "LEFT JOIN pendidikan_m as pen on pen.id = pm.objectpendidikanfk LEFT JOIN alamat_m as alm on alm.nocmfk = pm.id " & _
'                     "LEFT JOIN propinsi_m as prop on prop.id = alm.objectpropinsifk LEFT JOIN golongandarah_m as gd on gd.id = pm.objectgolongandarahfk " & _
'                     "LEFT JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk " & _
'                     "where pm.nocm ='00899148' "
'
'
             adoReport.CommandText = strSQL
             adoReport.CommandType = adCmdUnknown
'            .database.AddADOCommand CN_String, adoReport
                         
'            .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
'            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
'            .usJk.SetUnboundFieldSource ("{ado.jeniskelamin}")
'            .usTTL.SetUnboundFieldSource ("{ado.tempatlahir}")
'            .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
'            .usUmur.SetUnboundFieldSource (strUmur)
'            .usStatusNikah.SetUnboundFieldSource ("{ado.statusperkawinan}")
'            .usAgama.SetUnboundFieldSource ("{ado.agama}")
'            .usPekerjaan.SetUnboundFieldSource ("{ado.pekerjaan}")
'            .usAlamat.SetUnboundFieldSource ("{ado.alamat}")
'            .usKelurahan.SetUnboundFieldSource ("{ado.namadesakelurahan}")
'            .usKecamatan.SetUnboundFieldSource ("{ado.kecamatan}")
'            .usKabupaten.SetUnboundFieldSource ("{ado.kotakabupaten}")
'            .usPropinsi.SetUnboundFieldSource ("{ado.namapropinsi}")
'            .usKodePos.SetUnboundFieldSource ("{ado.kodepos}")
'            .usTelepon.SetUnboundFieldSource ("{ado.notelepon}")
'            .usKtpSatu.SetUnboundFieldSource ("{ado.noidentitas}")
'            .ucGolonganDarah.SetUnboundFieldSource ("{ado.golongandarah}")
'            .usTinggiBadan.SetUnboundFieldSource ("{ado.notelepon}")
''            .usBeratBadan.SetUnboundFieldSource ("{ado.notelepon}")
            
'           .usNamaPenanggungJawab.SetUnboundFieldSource ("{ado.penanggungjawab}")
'           .usHubungan.SetUnboundFieldSource ("{ado.hubungankeluargapj}")
'           .usAlamatRumah.SetUnboundFieldSource ("{ado.alamatrmh}")
'           .usAlamatKantor.SetUnboundFieldSource ("{ado.alamatktr}")
'           .usPekerjaanPj.SetUnboundFieldSource ("{ado.pekerjaanpenangggungjawab}")
'           .usNoSimPj.SetUnboundFieldSource ("{ado.ktppenanggungjawab}")
'           .txtPetugas.SetText strPetugas
'           .txtPenanggungJawab.SetText strPenanggungjawab
             
'           If view = "false" Then
'                strPrinter1 = GetTxt("Setting.ini", "Printer", "PasienDaftar")
'                .SelectPrinter "winspool", strPrinter1, "Ne00:"
'                .PrintOut False
'                Unload Me
'                Screen.MousePointer = vbDefault
'             Else
                With CRViewer1
                    .ReportSource = LembarIdentitasPasien
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
'            End If
     
        End With
Exit Sub
errLoad:

End Sub

Public Sub cetakBlangkoBpjs(strNorec As String, Petugas As String, view As String)
'On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim str As String
Dim i As Integer
Dim StrNamaPetugas As String
Dim StrNip As String
boolBlangkoBpjs = True
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = False

Dim qty As String
qty = 2
If Petugas <> "" Then
    ReadRs2 "select top 1 namalengkap, nippns from pegawai_m where id = '" & Petugas & "'"
    If RS2.EOF = False Then
       StrNamaPetugas = RS2!namalengkap
       If IsNull(RS2!nippns) = True Then
         StrNip = "-"
       Else
         StrNip = RS2!nippns
      End If
    Else
       StrNamaPetugas = "-"
       StrNip = "-"
    End If
Else
   StrNamaPetugas = "-"
   StrNip = "-"
End If

    With reportBlangko
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT pi.namapasien,(CASE WHEN alm.alamatlengkap IS NULL THEN '-' ELSE alm.alamatlengkap END) AS alamatlengkap,pa.nosep,pa.tanggalsep,pa.nokepesertaan,convert(varchar, pd.tglregistrasi, 105) as tglregistrasi, " & _
                     "pi.nocm,pd.noregistrasi,pa.norujukan,ap.namapeserta,convert(varchar, pi.tgllahir, 105) as tgllahir,jk.jeniskelamin,rp.namaruangan, " & _
                     "rp.kdinternal AS namapolibpjs,pa.ppkrujukan,(CASE WHEN rp.objectdepartemenfk = 16 THEN 'R. Inap' ELSE'R. Jalan' END) AS jenisrawat,dg.kddiagnosa, " & _
                     "(CASE WHEN dg.namadiagnosa IS NULL THEN '' ELSE dg.namadiagnosa END) AS namadiagnosa,ap.jenispeserta, " & _
                     "ap.kdprovider,ap.nmprovider,pa.catatan,(CASE WHEN rp.objectdepartemenfk = 16 THEN kls.namakelas ELSE '-' END) AS namakelas, " & _
                     "ap.notelpmobile,pa.penjaminlaka,(CASE   WHEN pa.penjaminlaka = '1' THEN 'Jasa Raharja PT' WHEN pa.penjaminlaka = '2' THEN " & _
                     "'BPJS Ketenagakerjaan' WHEN pa.penjaminlaka = '3' THEN 'TASPEN PT' WHEN pa.penjaminlaka = '4' THEN 'ASABRI PT' ELSE " & _
                     "'-' END) AS penjaminlakalantas,pa.prolanisprb,CASE when pi.noasuransilain is null then '-' else pi.noasuransilain end as noasuransilain,pi.hubungankeluargapj " & _
                     "FROM pasiendaftar_t as pd " & _
                     "LEFT JOIN pemakaianasuransi_t as pa on pa.noregistrasifk = pd.norec " & _
                     "LEFT JOIN asuransipasien_m ap ON pa.objectasuransipasienfk = ap.id " & _
                     "LEFT JOIN pasien_m pi ON pi.id = pd.nocmfk " & _
                     "LEFT JOIN jeniskelamin_m jk ON jk.id = pi.objectjeniskelaminfk " & _
                     "LEFT JOIN ruangan_m rp ON rp.id = pd.objectruanganlastfk " & _
                     "LEFT JOIN diagnosa_m dg ON pa.diagnosisfk = dg.id " & _
                     "LEFT JOIN kelas_m kls ON kls.id = ap.objectkelasdijaminfk " & _
                     "LEFT JOIN alamat_m as alm on alm.nocmfk = pi.id " & _
                     "where pd.noregistrasi ='" & strNorec & "' "
                     
             ReadRs strSQL
             adoReport.CommandText = strSQL
             adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
             If Not rs.EOF Then
               .txtNamaPasien.SetText rs!namapasien
               .txtNamaPeserta.SetText rs!namapasien
               .txtTglLahir.SetText rs!tgllahir
               .txtTanggalLahir.SetText rs!tgllahir
               .txtJenisKelamin1.SetText rs!jenisKelamin
               .txtkelamin.SetText rs!jenisKelamin
               .txtnocm2.SetText rs!noCm
               .tglRegistrasi.SetText rs!tglRegistrasi
               .txtNomorKartuBpjs.SetText rs!noasuransilain
               .txtdiagnosa.SetText "..................................." 'rs!namadiagnosa
               .txtAlamatRumah.SetText rs!alamatlengkap
               'rs!alamatlengkap
               '.txtHubunganKeluarga.SetText IIf(IsNull(rs("jenispeserta")), "-", rs("jenispeserta"))
               .txtHubunganKeluarga.SetText IIf(IsNull(rs("hubungankeluargapj")), "-", rs("hubungankeluargapj"))
               .txtPtgasJamkes.SetText StrNamaPetugas
               .txtnip.SetText "Nip. " & StrNip
'              .txtnosjp.SetText IIf(IsNull(rs("nosep")), "-", rs("nosep")) 'RS("nosep")
'              .txtTglSep.SetText Format(rs("tanggalsep"), "dd/MM/yyyy")
'              .txtNomorKartuBpjs.SetText IIf(IsNull(rs("nokepesertaan")), "-", rs("nokepesertaan"))
'              .txtNamaPasien.SetText IIf(IsNull(rs("namapeserta")), "-", rs("namapeserta")) 'RS("namapeserta")
'              .txtkelamin.SetText IIf(IsNull(rs("jeniskelamin")), "-", rs("jeniskelamin")) 'RS("jeniskelamin")
'              .txtTanggalLahir.SetText IIf(IsNull(rs("tgllahir")), "-", Format(rs("tgllahir"), "dd/MM/yyyy")) 'Format(RS("tgllahir"), "dd/mm/yyyy")
'              .txtTujuan.SetText rs("namapolibpjs") & " / " & rs("namaruangan")
'              .txtAsalRujukan.SetText IIf(IsNull(rs("nmprovider")), "-", rs("nmprovider"))
'              .txtPeserta.SetText IIf(IsNull(rs("jenispeserta")), "-", rs("jenispeserta"))
'              .txtJenisrawat.SetText IIf(IsNull(rs("jenisrawat")), "-", rs("jenisrawat")) 'RS("jenisrawat")
'              .txtnocm2.SetText IIf(IsNull(rs("nocm")), "-", rs("nocm")) 'RS("nocm")
'              .txtdiagnosa.SetText IIf(IsNull(rs("namadiagnosa")), "-", rs("namadiagnosa")) 'RS("namadiagnosa")
'              .txtKelasrawat.SetText IIf(IsNull(rs("namakelas")), "-", rs("namakelas")) 'RS("namakelas")
'              .txtCatatan.SetText IIf(IsNull(rs("catatan")), "-", rs("catatan"))
'              .txtnocm2.SetText IIf(IsNull(rs("nocm")), "-", rs("nocm"))
'              .txtNoPendaftaran2.SetText IIf(IsNull(rs("noregistrasi")), "-", rs("noregistrasi"))
'              .txtNoTelpon.SetText IIf(IsNull(rs("notelpmobile")), "-", rs("notelpmobile"))
'              .txtPenjamin.SetText IIf(IsNull(rs("penjaminlakalantas")), "-", rs("penjaminlakalantas"))
'              .txtProlanis.SetText IIf(IsNull(rs("prolanisprb")), "-", rs("prolanisprb"))
              
             End If

            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "BlangkoBpjs")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False, 2, , 1, 1
'                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportBlangko
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub

Public Sub cetakGelangPasien(strNorec As String, view As String, qty As String)
'On Error GoTo errLoad
Set frmCetakPendaftaran = Nothing
Dim strSQL As String
Dim i As Integer
Dim str As String
Dim jml As Integer
Dim Barcode As Image
Dim filename As String
boolBlangkoBpjs = False
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolBuktiLayananRuanganPerTindakan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolLabelPasienZebra = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
bolBuktiLayananRuanganBedah = False
boolGelangPasien = True
Dim umur As String
Dim jk As String


    With reportGelangPasien
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            ' SQLSERVER
            strSQL = "select pd.noregistrasi,pd.tglregistrasi,p.nocm,p.nocm as noCm, " & _
                     "upper(p.namapasien) as namapasien, jk.jeniskelamin as jk, upper(alm.alamatlengkap) as alamat, " & _
                     "CONVERT(VARCHAR,p.tgllahir,105) as tgllahir, " & _
                     "case when pg.namalengkap is null then '-' ELSE " & _
                     "pg.namalengkap end as namadokter from pasiendaftar_t pd " & _
                     " INNER JOIN pasien_m p on pd.nocmfk=p.id " & _
                     " INNER JOIN jeniskelamin_m jk on jk.id=p.objectjeniskelaminfk " & _
                     " LEFT JOIN pegawai_m as pg on pg.id = pd.objectpegawaifk " & _
                     " LEFT JOIN alamat_m as alm on alm.nocmfk = p.id " & _
                     " where pd.noregistrasi ='" & strNorec & "' "

'             POSTGRESSQL
'            strSQL = " select pd.noregistrasi,pd.tglregistrasi,p.nocm,p.nocm as noCm,jk.reportdisplay, " & _
'                     " upper(p.namapasien) + '' + CASE WHEN jk.id = 1 THEN '(L)' WHEN jk.id = 2 THEN '(P)' ELSE '' END as namapasiens,CASE WHEN jk.id = 1 THEN 'L' WHEN jk.id = 2 THEN 'P' ELSE '-' END as jk, " & _
'                     " upper(alm.alamatlengkap) as alamat, " & _
'                     " convert(varchar,p.tgllahir, 105) as tgllahirs,p.tgllahir, " & _
'                     " case when pg.namalengkap is null then '-' ELSE " & _
'                     " pg.namalengkap end as namadokter, '*' + p.nocm + '*' as barcode," & _
'                     " from pasiendaftar_t pd " & _
'                     " INNER JOIN pasien_m p on pd.nocmfk=p.id " & _
'                     " INNER JOIN jeniskelamin_m jk on jk.id=p.objectjeniskelaminfk " & _
'                     " LEFT JOIN pegawai_m as pg on pg.id = pd.objectpegawaifk " & _
'                     " LEFT JOIN alamat_m as alm on alm.nocmfk = p.id " & _
'                     " where pd.noregistrasi ='" & strNorec & "' "

            
            jml = qty - 1
            ReadRs2 strSQL
            If RS2.BOF Then
                jk = ""
                umur = ""
            Else
                jk = RS2!reportdisplay
                umur = hitungUmurNew(Format(RS2!tgllahir, "yyyy/MM/dd"), Format(RS2!tglRegistrasi, "yyyy/MM/dd"))
            End If
            str = ""
            If Val(qty) - 1 = 0 Then
                adoReport.CommandText = strSQL
             Else
                For i = 1 To Val(qty) - 1
                    str = strSQL & " union all " & str
                Next
                
                adoReport.CommandText = str & strSQL
           
           End If
                adoReport.CommandType = adCmdUnknown
                .database.AddADOCommand CN_String, adoReport
                .usNamaPasien.SetUnboundFieldSource ("{ado.namapasiens}")
                '.usTglLahir.SetUnboundFieldSource ("{ado.tgllahirs}")
                '.usBarcode.SetUnboundFieldSource ("{ado.barcode}")
                '.txtUmur.SetText txtUmur
'                .usUmur.SetUnboundFieldSource ("{ado.umur}")
                .usnocm.SetUnboundFieldSource ("{ado.nocm}")
'            view = "true"
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "GelangPasien")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportGelangPasien
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub

