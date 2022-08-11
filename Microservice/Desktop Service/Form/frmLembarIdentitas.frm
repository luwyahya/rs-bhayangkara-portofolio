VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLembarIdentitas 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmLembarIdentitas.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   5820
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
      Height          =   7000
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   5800
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
Attribute VB_Name = "frmLembarIdentitas"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crSuratLembarIdentitas

Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String
Dim bolStrukResep As Boolean

Private Sub cmdCetak_Click()
' If cboPrinter.Text = "" Then MsgBox "Printer belum dipilih", vbInformation, ".: Information": Exit Sub
'    If bolStrukResep = True Then
'        Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
'        Report.PrintOut False
'  Report.PrintOut False
'    End If
    Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    Report.PrintOut False
End Sub

Private Sub CmdOption_Click()
    If bolStrukResep = True Then
        Report.PrinterSetup Me.hwnd
    End If
    CRViewer1.Refresh
End Sub

Private Sub Form_Load()
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "PasienDaftar")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmLembarIdentitas = Nothing
End Sub

Public Sub Cetak(noCm As String, Noreg As String, caraBayar As String, umur As String, Petugas As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Set frmLembarIdentitas = Nothing
Dim adocmd As New ADODB.Command
Dim strNocm As String
Dim strUmur As String
Dim strcaraBayar As String
Dim strPetugas As String
Dim strPenanggungjawab As String
Dim tglRegis As String
Dim JamRegis As String

strNocm = ""
If noCm <> "" Then
    strNocm = noCm
Else
    strNocm = ""
End If

If umur <> "" Then
    strUmur = umur
Else
    strUmur = "0"
End If

If umur <> "" Then
    strPetugas = Petugas
Else
    strPetugas = "-"
End If

If caraBayar <> "" Then
    strcaraBayar = caraBayar
Else
    strcaraBayar = "-"
End If

        strSQL = "select top 1 pm.nocm,pm.namapasien,pm.tempatlahir,convert(varchar, pm.tgllahir, 105) as tgllahir, " & _
             "case when sp.statusperkawinan is null then '-' else sp.statusperkawinan end as statusperkawinan, " & _
             "case when ag.agama is null then '-' else ag.agama end as agama, " & _
             "case when pk.pekerjaan is null then '-' else pk.pekerjaan end as pekerjaan, " & _
             "alm.alamatlengkap,alm.namadesakelurahan,alm.kecamatan, " & _
             "alm.kotakabupaten,prop.namapropinsi,alm.kodepos,pm.alamatktr, " & _
             "case when pm.nohp is null then '-' else pm.nohp end as notelepon, " & _
             "case when pm.noidentitas is null then '-' else pm.noidentitas end as noidentitas, " & _
             "case when gd.golongandarah is null then '-' else gd.golongandarah end as golongandarah, " & _
             "case when pen.pendidikan is null then '-' else pen.pendidikan end as pendidikan, " & _
             "case when pm.noasuransilain is null then '-' else  pm.noasuransilain end as noasuransilain, " & _
             "case when pm.nobpjs is null then '-' else pm.nobpjs end as nobpjs,jk.jeniskelamin, " & _
             "pm.penanggungjawab,pm.hubungankeluargapj,pm.pekerjaanpenangggungjawab,pm.ktppenanggungjawab, " & _
             "pm.alamatrmh, pm.alamatrmh, pm.namaayah, pm.namaibu, pm.namasuamiistri, " & _
             "pm.teleponpenanggungjawab,pm.bahasa,pm.alamatdokterpengirim,pm.dokterpengirim,pm.jeniskelaminpenanggungjawab,pm.umurpenanggungjawab " & _
             "from pasien_m as pm LEFT JOIN statusperkawinan_m as sp on sp.id = pm.objectstatusperkawinanfk " & _
             "LEFT JOIN agama_m as ag on ag.id = pm.objectagamafk LEFT JOIN pekerjaan_m as pk on pk.id = pm.objectpekerjaanfk " & _
             "LEFT JOIN pendidikan_m as pen on pen.id = pm.objectpendidikanfk LEFT JOIN alamat_m as alm on alm.nocmfk = pm.id " & _
             "LEFT JOIN propinsi_m as prop on prop.id = alm.objectpropinsifk LEFT JOIN golongandarah_m as gd on gd.id = pm.objectgolongandarahfk " & _
             "LEFT JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk " & _
             "where pm.nocm ='" & strNocm & "' "
    
    If Noreg <> "" Then
        ReadRs3 "select top 1 *, convert(varchar, tglregistrasi, 105) as tglregis,convert(varchar, tglregistrasi, 8) as jamregistrasi " & _
                "from pasiendaftar_t where noregistrasi = '" & Noreg & "'"
        If RS3.EOF = False Then
            tglRegis = RS3!tglRegis
            JamRegis = RS3!jamregistrasi
        Else
            tglRegis = "-"
            JamRegis = "-"
        End If
    End If
    

    ReadRs2 strSQL
    Set rs = New ADODB.Recordset
    Set rsc = New ADODB.Recordset
    Dim mstream As ADODB.Stream
    rs.Open "select p.foto from pasien_m as p " & _
                 " where p.nocm ='" & strNocm & "' ", CN, adOpenKeyset, adLockOptimistic
                 
    rsc.Open "select p.image as foto from photopasien_m as p " & _
                 " where p.id =1", CN, adOpenKeyset, adLockOptimistic
                 
    If IsNull(rs.Fields("foto").Value) = False Then
        Set mstream = New ADODB.Stream
        mstream.Type = adTypeBinary
        mstream.Open
        mstream.Write rs.Fields("foto").Value
        mstream.SavetoFile "c:\tmp_epics.jpg", adSaveCreateOverWrite
    Else
        Set mstream = New ADODB.Stream
        mstream.Type = adTypeBinary
        mstream.Open
        mstream.Write rsc.Fields("foto").Value
        mstream.SavetoFile "c:\tmp_epics.jpg", adSaveCreateOverWrite
    End If
    rs.Close
    rsc.Close
  
    
    If RS2.BOF Then
        strPenanggungjawab = "-"
    Else
         If IsNull(RS2!penanggungjawab) Then
             strPenanggungjawab = "-"
         Else
             strPenanggungjawab = RS2!penanggungjawab
         End If

    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    
    
    With Report
        .database.AddADOCommand CN_String, adocmd
        If Not RS2.EOF Then
            .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJenisKelamin.SetUnboundFieldSource ("{ado.jeniskelamin}")
            .usTempatLahir.SetUnboundFieldSource ("{ado.tempatlahir}")
            .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
            .txtUmur.SetText strUmur
            .usStatusNikah.SetUnboundFieldSource ("{ado.statusperkawinan}")
            .usAgama.SetUnboundFieldSource ("{ado.agama}")
            .usPekerjaan.SetUnboundFieldSource ("{ado.pekerjaan}")
            .usAlamatPasien.SetUnboundFieldSource ("{ado.alamatlengkap}")
            .usKelurahan.SetUnboundFieldSource ("{ado.namadesakelurahan}")
            .usKecamatan.SetUnboundFieldSource ("{ado.kecamatan}")
            .usKabupaten.SetUnboundFieldSource ("{ado.kotakabupaten}")
            .usPropinsi.SetUnboundFieldSource ("{ado.namapropinsi}")
            .usKodePos.SetUnboundFieldSource ("{ado.kodepos}")
            .UsTelepon.SetUnboundFieldSource ("{ado.notelepon}")
            .usNamaPenanggungJawab.SetUnboundFieldSource ("{ado.penanggungjawab}")
            .usAlamatRumah.SetUnboundFieldSource ("{ado.alamatrmh}")
            .usNamaBapak.SetUnboundFieldSource ("{ado.namaayah}")
            .usNamaIbu.SetUnboundFieldSource ("{ado.namaibu}")
            .usNamaSuamiIstri.SetUnboundFieldSource ("{ado.namasuamiistri}")
            .txtCaraBayar.SetText strcaraBayar
            .usDokterPengirim.SetUnboundFieldSource ("{ado.dokterpengirim}")
            .usALamatDokter.SetUnboundFieldSource ("{ado.alamatdokterpengirim}")
            .usTeleponP.SetUnboundFieldSource ("{ado.teleponpenanggungjawab}")
            .usBahasa.SetUnboundFieldSource ("{ado.bahasa}")
            .txtPenanggungJawab.SetText strPenanggungjawab 'RS2!penanggungjawab
            .usPekerjaan.SetUnboundFieldSource ("{ado.pekerjaan}")
            .usPendidikan.SetUnboundFieldSource ("{ado.pendidikan}")
'            .usKtpSatu.SetUnboundFieldSource ("{ado.noidentitas}")
'            .ucGolonganDarah.SetUnboundFieldSource ("{ado.golongandarah}")
'            .usHubungan.SetUnboundFieldSource ("{ado.hubungankeluargapj}")
'            .usAlamatKantor.SetUnboundFieldSource ("{ado.alamatktr}")
'            .usPekerjaanPj.SetUnboundFieldSource ("{ado.pekerjaanpenangggungjawab}")
'            .usNoSimPj.SetUnboundFieldSource ("{ado.ktppenanggungjawab}")
'            .txtPetugas.SetText strPetugas
'            .txtPenanggungJawab.SetText strPenanggungjawab
        Report.Subreport1.Suppress = False
        Report.Subreport2.Suppress = False
        Report.Subreport3.Suppress = False
            Dim adojenis As New ADODB.Command
            Set adojenis = New ADODB.Command
            adojenis.CommandText = strSQL
            adojenis.CommandType = adCmdText
            'Report.Subreport1.OpenSubreport.database.AddADOCommand dbConn, adojenis
            Report.Subreport1.OpenSubreport.database.AddADOCommand CN_String, adojenis
            Report.Subreport2.OpenSubreport.database.AddADOCommand CN_String, adojenis
            Report.Subreport3.OpenSubreport.database.AddADOCommand CN_String, adojenis
            With Report
                .Subreport1_usNoCm.SetUnboundFieldSource ("{ado.nocm}")
                .Subreport1_usJenisKelamin.SetUnboundFieldSource ("{ado.jeniskelamin}")
                .Subreport1_usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
                .Subreport1_udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
                .Subreport1_txtPetugas.SetText strPetugas
                .Subreport1_txtPenanggungJawab.SetText strPenanggungjawab 'RS2!penanggungjawab
                .Subreport2_usNoCm.SetUnboundFieldSource ("{ado.nocm}")
                .Subreport2_usJenisKelamin.SetUnboundFieldSource ("{ado.jeniskelamin}")
                .Subreport2_usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
                .Subreport2_udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
                .Subreport2_txtTglRegis.SetText tglRegis
                .Subreport2_txtJamRegis.SetText JamRegis
                .Subreport3_usNoCm.SetUnboundFieldSource ("{ado.nocm}")
                .Subreport3_usJenisKelamin.SetUnboundFieldSource ("{ado.jeniskelamin}")
                .Subreport3_usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
                .Subreport3_udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
                .Subreport3_usPenanggungJawab.SetUnboundFieldSource ("{ado.penanggungjawab}")
                .Subreport3_usPekerjaan.SetUnboundFieldSource ("{ado.pekerjaanpenangggungjawab}")
                .Subreport3_usAlamat.SetUnboundFieldSource ("{ado.alamatrmh}")
                .Subreport3_usJk.SetUnboundFieldSource ("{ado.jeniskelaminpenanggungjawab}")
                .Subreport3_usUmur.SetUnboundFieldSource ("{ado.umurpenanggungjawab}")
                .Subreport3_txtPenanggungJawab.SetText strPenanggungjawab 'RS2!penanggungjawab
            End With
        Else
            Report.Subreport1.Suppress = True
            Report.Subreport2.Suppress = True
            Report.Subreport3.Suppress = True
        End If
        
        If view = "false" Then
            Dim strPrinter As String
            strPrinter = GetTxt("Setting.ini", "Printer", "CetakLembarIdentitas")
            .SelectPrinter "winspool", strPrinter, "Ne00:"
            .PrintOut False
            Unload Me
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
