VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRLabelFarmasi 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCRLabelFarmasi.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   9075
   WindowState     =   2  'Maximized
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
End
Attribute VB_Name = "frmCRLabelFarmasi"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New Cr_cetakBuktiPendaftaran
Dim ReportTracer As New Cr_cetakLabelTracer
Dim reportSep As New crCetakSJP
Dim reportBuktiLayanan As New Cr_cetakbuktilayanan
Dim reportBuktiLayananRuangan As New Cr_cetakbuktilayananruangan
Dim reportLabel As New Cr_cetakLabel
Dim reportSumList As New Cr_cetakSummaryList
Dim reportRmk As New Cr_cetakRMK
Dim reportLembarGC As New Cr_cetakLembarGC
Dim reportBuktiLayananRuanganPerTindakan As New Cr_cetakbuktilayananruanganpertindakan

'Private fso As New Scripting.FileSystemObject
Dim reportKartuPasien As New Cr_cetakKartuPasien
'Dim WithEvents sect As CRAXDRT.Section


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
Dim bolcetakSep  As Boolean
Dim bolTracer1  As Boolean
Dim bolKartuPasien  As Boolean
Dim boolLabelPasien  As Boolean
Dim boolSumList  As Boolean
Dim boolLembarRMK As Boolean
Dim boolLembarPersetujuan As Boolean


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
    ElseIf boolSumList = True Then
        reportSumList.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportSumList.PrintOut False
    ElseIf boolLembarRMK = True Then
        reportRmk.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportRmk.PrintOut False
    ElseIf boolLembarPersetujuan = True Then
        reportLembarGC.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        reportLembarGC.PrintOut False
    
    End If
End Sub

Private Sub CmdOption_Click()
    
    If bolBuktiPendaftaran = True Then
        Report.PrinterSetup Me.hwnd
    ElseIf bolBuktiLayanan = True Then
        reportBuktiLayanan.PrinterSetup Me.hwnd
    ElseIf bolBuktiLayananRuangan = True Then
        reportBuktiLayananRuangan.PrinterSetup Me.hwnd
    ElseIf bolcetakSep = True Then
        reportSep.PrinterSetup Me.hwnd
    ElseIf bolTracer1 = True Then
        ReportTracer.PrinterSetup Me.hwnd
    ElseIf bolKartuPasien = True Then
        reportKartuPasien.PrinterSetup Me.hwnd
    ElseIf boolLabelPasien = True Then
         reportLabel.PrinterSetup Me.hwnd
    ElseIf boolSumList = True Then
         reportSumList.PrinterSetup Me.hwnd
    ElseIf boolLembarRMK = True Then
         reportRmk.PrinterSetup Me.hwnd
    ElseIf boolLembarPersetujuan = True Then
         reportLembarGC.PrinterSetup Me.hwnd
         
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
    
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRLabelFarmasi = Nothing
'    fso.DeleteFile (App.Path & "\tempbitmap.bmp")
'    Set sect = Nothing

End Sub

Public Sub cetakBuktiPendaftaran(strNorec As String, view As String)
On Error GoTo errLoad
Set frmCRLabelFarmasi = Nothing
Dim strSQL As String

bolBuktiPendaftaran = True
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False

    With Report
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien, " & _
                       " pd.tglregistrasi,jk.reportdisplay as jk,ap.alamatlengkap,ap.mobilephone2, " & _
                        " ru.namaruangan as ruanganPeriksa,pp.namalengkap as namadokter,kp.kelompokpasien, " & _
                        " apdp.noantrian From  pasiendaftar_t pd " & _
                        " INNER JOIN pasien_m ps ON pd.nocmfk = ps.id " & _
                        " INNER JOIN alamat_m ap ON ap.nocmfk = ps.id " & _
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
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
            .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")
            .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
            .usNoTelpon.SetUnboundFieldSource ("{ado.mobilephone2}")

            .usPenjamin.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usruangperiksa.SetUnboundFieldSource ("{ado.ruanganPeriksa}")
            .usNamaDokter.SetUnboundFieldSource ("{ado.namadokter}")

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

End Sub


Public Sub cetakTracer(strNorec As String, view As String)
On Error GoTo errLoad
Set frmCRLabelFarmasi = Nothing
Dim strSQL As String

bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolcetakSep = False
bolTracer1 = True
bolKartuPasien = False
boolLabelPasien = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False

    With ReportTracer
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien, " & _
                       " pd.tglregistrasi,jk.reportdisplay as jk,ap.alamatlengkap,ap.mobilephone2, " & _
                        " ru.namaruangan as ruanganPeriksa,pp.namalengkap as namadokter,kp.kelompokpasien, " & _
                        " apdp.noantrian,pd.statuspasien,ps.namaayah  From  pasiendaftar_t pd " & _
                        " INNER JOIN pasien_m ps ON pd.nocmfk = ps.id " & _
                        " INNER JOIN alamat_m ap ON ap.nocmfk = ps.id " & _
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
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
            .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.jk}")
            .usStatusPasien.SetUnboundFieldSource ("{ado.statuspasien}")
            .udtTglReg.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usNamaDokter.SetUnboundFieldSource ("{ado.namadokter}")
            .usNamaKel.SetUnboundFieldSource ("{ado.namaayah}")
            .usruangperiksa.SetUnboundFieldSource ("{ado.ruanganPeriksa}")

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

End Sub


Public Sub cetakSep(strNorec As String, view As String)
On Error GoTo errLoad
Set frmCRLabelFarmasi = Nothing
Dim strSQL As String

bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolcetakSep = True
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False

    With reportSep
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "select pa.nosep,pa.tanggalsep,pa.nokepesertaan,pa.norujukan,ap.namapeserta,ap.tgllahir,jk.jeniskelamin," & _
                       " rp.namaruangan,rp.kodeexternal as namapoliBpjs,pa.ppkrujukan, " & _
                       " (CASE WHEN rp.objectdepartemenfk=16 then 'Rawat Inap' else 'Rawat Jalan' END) as jenisrawat," & _
                       " dg.kddiagnosa, (case when dg.namadiagnosa is null then '-' else dg.namadiagnosa end) as namadiagnosa , " & _
                       " pi.nocm, ap.jenispeserta,ap.kdprovider,ap.nmprovider,kls.namakelas from pemakaianasuransi_t pa " & _
                       " INNER JOIN asuransipasien_m ap on pa.objectasuransipasienfk= ap.id " & _
                       " INNER JOIN pasiendaftar_t pd on pd.norec=pa.noregistrasifk " & _
                       " INNER JOIN pasien_m pi on pi.id=pd.nocmfk " & _
                       " INNER JOIN jeniskelamin_m jk on jk.id=pi.objectjeniskelaminfk " & _
                       " INNER JOIN ruangan_m rp on rp.id=pd.objectruanganlastfk " & _
                       " LEFT JOIN diagnosa_m dg on pa.diagnosisfk=dg.id" & _
                       " LEFT JOIN kelas_m kls on kls.id=ap.objectkelasdijaminfk " & _
                       " where pd.noregistrasi ='" & strNorec & "' "
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport

             If Not rs.EOF Then
              .txtnosjp.SetText rs("nosep")
              .txtTglSep.SetText Format(rs("tanggalsep"), "dd/mm/yyyy")
              .txtNomorKartuAskes.SetText IIf(IsNull(rs("nokepesertaan")), "-", rs("nokepesertaan"))
              .txtNamaPasien.SetText rs("namapeserta")
              .txtkelamin.SetText rs("jeniskelamin")
              .txtTanggalLahir.SetText Format(rs("tgllahir"), "dd/mm/yyyy")
              .txtTujuan.SetText rs("namapoliBpjs") & " / " & rs("namaruangan")
              .txtAsalRujukan.SetText IIf(IsNull(rs("nmprovider")), "-", rs("nmprovider"))
              .txtPeserta.SetText IIf(IsNull(rs("jenispeserta")), "-", rs("jenispeserta"))
              .txtJenisrawat.SetText rs("jenisrawat")
              .txtnocm2.SetText rs("nocm")
              .txtdiagnosa.SetText rs("namadiagnosa")
              .txtKelasrawat.SetText rs("namakelas")
              .txtCatatan.SetText "-"
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

End Sub


Public Sub cetakBuktiLayanan(strNorec As String, strIdPegawai As String, view As String)
On Error GoTo errLoad
Set frmCRLabelFarmasi = Nothing
Dim strSQL As String
Dim umur As String
    
bolBuktiPendaftaran = False
bolBuktiLayanan = True
bolBuktiLayananRuangan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False

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
                       " where pd.noregistrasi ='" & strNorec & "' ORDER BY tp.tglpelayanan "
                       
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            
            .database.AddADOCommand CN_String, adoReport
            If rs.BOF Then
                .txtUmur.SetText "-"
            Else
                .txtUmur.SetText hitungUmur(Format(rs!tgllahir, "dd/mm/yyyy"), Format(Now, "dd/mm/yyyy"))
            End If


            .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
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

End Sub

Public Sub cetakBuktiLayananRuangan(strNorec As String, strIdPegawai As String, strIdRuangan As String, view As String)
On Error GoTo errLoad
Set frmCRLabelFarmasi = Nothing
Dim strSQL As String
Dim umur As String
Dim strFilter As String

bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = True
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
    strSQL = ""
    strFilter = ""
    If strIdRuangan <> "" Then strFilter = " AND ru2.id = '" & strIdRuangan & "' "
    strFilter = strFilter & " ORDER BY tp.tglpelayanan "
    With reportBuktiLayananRuangan
    
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,ps.namapasien, " & _
                       " pd.tglregistrasi,jk.reportdisplay AS jk,ru2.namaruangan AS ruanganperiksa,ru.namaruangan AS ruangakhir, " & _
                       " pp.namalengkap AS namadokter,kp.kelompokpasien,tp.produkfk, " & _
                       " pro.namaproduk,tp.jumlah,CASE WHEN tp.hargasatuan is null then tp.hargajual else tp.hargasatuan END as hargasatuan," & _
                       " hargasatuan*tp.jumlah as total, ks.namakelas,ar.asalrujukan, " & _
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
                       " where pd.noregistrasi ='" & strNorec & "'" & strFilter
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            
            .database.AddADOCommand CN_String, adoReport
            If rs.BOF Then
                .txtUmur.SetText "-"
            Else
                .txtUmur.SetText hitungUmur(Format(rs!tgllahir, "dd/mm/yyyy"), Format(Now, "dd/mm/yyyy"))
            End If
            
            .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
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
            .ucTarif.SetUnboundFieldSource ("{ado.total}")

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
MsgBox "error"
End Sub

Public Sub cetakKartuPasien(strNocm As String, strNamaPasien As String, strTglLahir As String, strJk As String, view As String)
On Error GoTo errLoad
Set frmCRLabelFarmasi = Nothing
Dim strSQL As String
    
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = True
boolLabelPasien = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False

    With reportKartuPasien
'            Set adoReport = New ADODB.Command
'            adoReport.ActiveConnection = CN_String
'            adoReport.CommandText = strSQL
'            adoReport.CommandType = adCmdUnknown
'            .database.AddADOCommand CN_String, adoReport

'      Set sect = .Sections.Item("Section8")

        .txtNamaPas.SetText strNamaPasien & "(" & strJk & ")"

        .TxtTgl.SetText strTglLahir
        .TxtNocm.SetText strNocm
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
'MsgBox Err.Description
End Sub

Public Sub cetakLabelPasien(strNorec As String, view As String, qty As String)
On Error GoTo errLoad
Set frmCRLabelFarmasi = Nothing
Dim strSQL As String
Dim i As Integer
Dim str As String
Dim jml As Integer
    
    
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = True
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False

    With reportLabel
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "select pd.noregistrasi,pd.tglregistrasi,p.nocm,p.namapasien, jk.reportdisplay as jk, p.tgllahir from pasiendaftar_t pd " & _
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
            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
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
            .usjk2.SetUnboundFieldSource ("{ado.jk}")
            
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

End Sub

Public Sub cetakSummaryList(strNorec As String, view As String)
On Error GoTo errLoad
Set frmCRLabelFarmasi = Nothing
Dim strSQL As String
   
    
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolSumList = True
boolLembarRMK = False
boolLembarPersetujuan = False

    With reportSumList
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT  ps.nocm,ps.namapasien,ps.namaayah,ps.tempatlahir,ps.tgllahir, " & _
                       " jk.jeniskelamin,ps.noidentitas,ag.agama,pk.pekerjaan,kb.name as kebangsaan, " & _
                       " al.alamatlengkap , al.kotakabupaten, al.kecamatan, al.namadesakelurahan, al.mobilephone1, " & _
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
                .txtUmur.SetText "-"
            Else
                .txtUmur.SetText hitungUmur(Format(rs!tgllahir, "dd/mm/yyyy"), Format(Now, "dd/mm/yyyy"))
            End If

            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usNamaKeuarga.SetUnboundFieldSource ("{ado.namaayah}")
            .udTglLahir.SetUnboundFieldSource ("{ado.tglLahir}")
            .usJK.SetUnboundFieldSource ("{ado.jeniskelamin}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
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

'cetakLembarMasuk
Public Sub cetakLembarMasuk(strNorec As String, view As String)
On Error GoTo errLoad
Set frmCRLabelFarmasi = Nothing
Dim strSQL As String
   
    
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolSumList = False
boolLembarRMK = True
boolLembarPersetujuan = False

    With reportRmk
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
            strSQL = "SELECT pd.noregistrasi, ps.nocm, ps.namapasien, ps.namaayah as namakeluarga," & _
                       " ps.namaayah,ps.tempatlahir, ps.tgllahir,jk.jeniskelamin, ps.noidentitas, " & _
                       " ag.agama, pk.pekerjaan, kb.name AS kebangsaan,al.alamatlengkap,al.kotakabupaten, " & _
                       " al.kecamatan, al.namadesakelurahan, al.mobilephone1,sp.statusperkawinan, " & _
                       " (kmr.namakamar  +  ' - '  +  kls.namakelas ) as namakamar,(tt.reportdisplay  +  ' - '  + tt.nomorbed ) AS nomorbed, " & _
                       " pd.tglregistrasi, pd.tglpulang, ps.namaibu, '-' as ttlSuami, " & _
                       " COALESCE(ps.namasuamiistri,'-') as namasuamiistri, pg.namalengkap as namadokterpj, kp.kelompokpasien, " & _
                       " '-' as alamatPekerjaan,'-' as keldihubungi  ,'-' as Hubungan , '-' as alamatKeluarga, " & _
                       " '-' as NohpKeluarga " & _
                       " FROM pasiendaftar_t pd  " & _
                       " INNER JOIN antrianpasiendiperiksa_t apdp on pd.norec=apdp.noregistrasifk  " & _
                       " INNER JOIN pasien_m ps on pd.nocmfk=ps.id " & _
                       " INNER JOIN jeniskelamin_m jk on jk.id=ps.objectjeniskelaminfk " & _
                       " INNER JOIN alamat_m al on ps.id=al.nocmfk  INNER JOIN agama_m ag on ps.objectagamafk=ag.id " & _
                       " left JOIN pekerjaan_m pk on pk.id=ps.objectpekerjaanfk " & _
                       " LEFT JOIN kebangsaan_m kb on kb.id=ps.objectkebangsaanfk " & _
                       " left JOIN statusperkawinan_m sp on sp.id=ps.objectstatusperkawinanfk " & _
                       " INNER JOIN ruangan_m ru on apdp.objectruanganfk=ru.id " & _
                       " left JOIN kamar_m kmr on apdp.objectkamarfk=kmr.id " & _
                       " left JOIN tempattidur_m tt on apdp.nobed=tt.id " & _
                       " LEFT JOIN pegawai_m pg on pd.objectpegawaifk=pg.id " & _
                       " INNER JOIN kelompokpasien_m kp on pd.objectkelompokpasienlastfk=kp.id " & _
                       " INNER JOIN kelas_m kls on apdp.objectkelasfk=kls.id " & _
                       " where pd.noregistrasi ='" & strNorec & "' "
            
            ReadRs strSQL
                
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport

            If rs.BOF Then
                .txtUmur.SetText "Umur -"
            Else
                .txtUmur.SetText "Umur " & hitungUmur(Format(rs!tgllahir, "dd/mm/yyyy"), Format(rs!tglRegistrasi, "dd/mm/yyyy"))
                .txtTglMasuk.SetText Format(rs!tglRegistrasi, "dd/mm/yyyy")
                .txtJamMasuk.SetText Format(rs!tglRegistrasi, "HH:MM:ss")
                .txtTglPlng.SetText IIf(rs!tglpulang = "Null", "-", Format(rs!tglpulang, "dd/mm/yyyy"))
                .txtJamPlng.SetText IIf(rs!tglpulang = "Null", "-", Format(rs!tglpulang, "HH:MM:ss"))
            End If
            
            .usDokter.SetUnboundFieldSource ("{ado.namadokterpj}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
                
            .usKamar.SetUnboundFieldSource ("{ado.namakamar}")
            .usTempatTidur.SetUnboundFieldSource ("{ado.nomorbed}")
            
            .usNamaKeuarga.SetUnboundFieldSource ("{ado.namakeluarga}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            
            .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
            .usNoTlpn.SetUnboundFieldSource ("{ado.mobilephone1}")
            
            .usTL.SetUnboundFieldSource ("{ado.tempatlahir}")
'            .udTglLahir.SetUnboundFieldSource ("{ado.tglLahir}")
            .usJK.SetUnboundFieldSource ("{ado.jeniskelamin}")
            
            .usStatusPerkawinan.SetUnboundFieldSource ("{ado.statusperkawinan}")
            .usAgama.SetUnboundFieldSource ("{ado.agama}")
            .usPekerjaan.SetUnboundFieldSource ("{ado.pekerjaan}")
            
            .usNamaIbu.SetUnboundFieldSource ("{ado.namaibu}")
            .usNamaAyah.SetUnboundFieldSource ("{ado.namaayah}")
            .usNamaSuami.SetUnboundFieldSource ("{ado.namasuamiistri}")
            .usTTLSuami.SetUnboundFieldSource ("{ado.ttlSuami}")
            
            .usAlamatPekerjaanAyah.SetUnboundFieldSource ("{ado.alamatPekerjaan}")
            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            
            .usOrgDpDihubungi.SetUnboundFieldSource ("{ado.keldihubungi}")
            .usHubungan.SetUnboundFieldSource ("{ado.Hubungan}")
            .usAlamatKeluarga.SetUnboundFieldSource ("{ado.alamatKeluarga}")
            .usHp.SetUnboundFieldSource ("{ado.NohpKeluarga}")
            
'            .udTglMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
'            '.udJamMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
'            .udTglKeluar.SetUnboundFieldSource ("{ado.tglpulang}")
'            '.udJamKeluar.SetUnboundFieldSource ("{ado.tglpulang}")
            
            .usJenisPembayaran.SetUnboundFieldSource ("{ado.kelompokpasien}")
            
           
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
'    MsgBox Err.Description, vbInformation
End Sub



Public Sub cetakPersetujuan(strNorec As String, view As String)
On Error GoTo errLoad
Set frmCRLabelFarmasi = Nothing
Dim strSQL As String
   
    
bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = False
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = True

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
                .txtTglLahir.SetText Format(rs!tgllahir, "dd/mm/yyyy")
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

End Sub

Public Sub cetakBuktiLayananRuanganPerTindakan(strNorec As String, strIdPegawai As String, strIdRuangan As String, strIdTindakan As String, view As String)
On Error GoTo errLoad
Set frmCRLabelFarmasi = Nothing
Dim strSQL As String
Dim umur As String
Dim strFilter As String
Dim strFilter2 As String

bolBuktiPendaftaran = False
bolBuktiLayanan = False
bolBuktiLayananRuangan = True
bolcetakSep = False
bolTracer1 = False
bolKartuPasien = False
boolLabelPasien = False
boolSumList = False
boolLembarRMK = False
boolLembarPersetujuan = False
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
                       " hargasatuan*tp.jumlah as total,ks.namakelas,ar.asalrujukan, " & _
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
                       " where pd.noregistrasi ='" & strNorec & "'" & strFilter
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            
            .database.AddADOCommand CN_String, adoReport
            If rs.BOF Then
                .txtUmur.SetText "-"
            Else
                .txtUmur.SetText hitungUmur(Format(rs!tgllahir, "dd/mm/yyyy"), Format(Now, "dd/mm/yyyy"))
            End If
            
            .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
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
            .ucTarif.SetUnboundFieldSource ("{ado.total}")

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
MsgBox "error"
End Sub

