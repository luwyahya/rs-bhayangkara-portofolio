VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLembarRanap 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmLembarRanap.frx":0000
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
Attribute VB_Name = "frmLembarRanap"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crSubSuratPernyataanRanap
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

    Set frmLembarRanap = Nothing
End Sub

Public Sub Cetak(noCm As String, caraBayar As String, umur As String, Petugas As String, strNoregis As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Set frmLembarRanap = Nothing
Dim adocmd As New ADODB.Command
Dim strNocm As String
Dim strUmur As String
Dim strcaraBayar As String
Dim strPetugas As String
Dim strPenanggungjawab As String
Dim Noregistrasi As String
Dim LamaRawat As String
Dim CaraMasuk As String
Dim asalruangan As String
Dim i As Integer
i = 0
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

If strNoregis <> "" Then
    Noregistrasi = strNoregis
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
             
     strSQL2 = "SELECT pd.noregistrasi,convert(varchar, pd.tglregistrasi, 105) as tglregis, " & _
              "convert(varchar, pd.tglregistrasi, 8) as jamregis,ru.namaruangan, " & _
              "case when kls.namakelas is null then ' - ' else kls.namakelas end as namakelas, " & _
              "(case when kmr.namakamar is null then ru.namaruangan else kmr.namakamar end   +  ' , '  +  case when kls.namakelas is null then ' - ' else kls.namakelas end) as namakamar, " & _
              "case when ddp.keterangan is null then ' - ' else ddp.keterangan end as namadiagnosa, " & _
              "case when pg.namalengkap is null then ' - ' else pg.namalengkap end as dpjp, " & _
              "case when ru1.objectdepartemenfk in (18,34,45,30,26) THEN 'Rawat Jalan' when ru1.objectdepartemenfk in (24) then 'Gawat Darurat' else '-' end as asalruangan, " & _
              "convert(varchar, apd.tglmasuk, 105) as tglmasuk, convert(varchar, apd.tglmasuk, 8) as jamasuk " & _
              "FROM pasiendaftar_t pd " & _
              "INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec " & _
              "INNER JOIN ruangan_m as ru on ru.id = apd.objectruanganfk " & _
              "left join kelas_m as kls on kls.id = pd.objectkelasfk " & _
              "left JOIN kamar_m as kmr on kmr.id = apd.objectkamarfk " & _
              "left JOIN tempattidur_m as tt on tt.id = apd.nobed " & _
              "left JOIN pegawai_m as pg on pg.id = pd.objectpegawaifk " & _
              "left JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk=apd.noregistrasifk " & _
              "left join diagnosa_m as dg on dg.id=ddp.objectdiagnosafk " & _
              "left JOIN jenisdiagnosa_m as jd on jd.id=ddp.objectjenisdiagnosafk " & _
              "LEFT JOIN ruangan_m as ru1 on ru1.id = pd.objectruanganasalfk " & _
              "Where pd.Noregistrasi = '" & Noregistrasi & "' and ru.objectdepartemenfk in (16,25) "
                  
      ReadRs4 "SELECT CASE WHEN ru.objectdepartemenfk IN (16, 25, 26) THEN 1 ELSE 0 END AS statusinap " & _
              "FROM pasien_m AS ps INNER JOIN pasiendaftar_t AS pd ON pd.nocmfk = ps.id " & _
              "INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk " & _
              "LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk " & _
              "LEFT JOIN batalregistrasi_t AS br ON br.pasiendaftarfk = pd.norec " & _
              "WHERE br.pasiendaftarfk IS NULL AND ps.nocm = '" & strNocm & "' AND ps.statusenabled = 1 " & _
              "ORDER BY pd.tglregistrasi ASC"
              
      Dim jmlahRawat As Integer
      jmlahRawat = 0
      If RS4.EOF = False Then
        For i = 0 To RS4.RecordCount - 1
            jmlahRawat = jmlahRawat + RS4!statusinap
            RS4.MoveNext
        Next
      End If
                  
    ReadRs2 strSQL
    ReadRs3 strSQL2
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
            If Not RS3.EOF Then
                 asalruangan = RS3!asalruangan
                 .usPenanggungJawab.SetUnboundFieldSource ("{ado.penanggungjawab}")
                 .usAlamatP.SetUnboundFieldSource ("{ado.alamatrmh}")
                 .usPasien.SetUnboundFieldSource ("{ado.namapasien}")
                 .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
                 .usKelurahan.SetUnboundFieldSource ("{ado.namadesakelurahan}")
                 .usKecamatan.SetUnboundFieldSource ("{ado.kecamatan}")
                 .usKabupaten.SetUnboundFieldSource ("{ado.kotakabupaten}")
                 .usNoRM.SetUnboundFieldSource ("{ado.nocm}")
                 .txtKelompokPasien.SetText strcaraBayar
                 .txtPetugas.SetText strPetugas
                 .txtPenanggungJawab.SetText strPenanggungjawab
                 .txtKelas.SetText RS3!namakelas
                 .txtRuanganRawat.SetText RS3!namaruangan & " " & RS3!namakelas
                 .usTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
                 .usJenisKelamin.SetUnboundFieldSource ("{ado.jeniskelamin}")
                 Report.Subreport1.Suppress = False
                 Report.Subreport2.Suppress = False
                Report.Subreport3.Suppress = False
                Dim adojenis As New ADODB.Command
                Set adojenis = New ADODB.Command
                adojenis.CommandText = strSQL
                adojenis.CommandType = adCmdText
                Report.Subreport1.OpenSubreport.database.AddADOCommand CN_String, adojenis
                Report.Subreport2.OpenSubreport.database.AddADOCommand CN_String, adojenis
                Report.Subreport3.OpenSubreport.database.AddADOCommand CN_String, adojenis
                With Report
                    .Subreport1_usNoCm.SetUnboundFieldSource ("{ado.nocm}")
                    .Subreport1_usPasien.SetUnboundFieldSource ("{ado.namapasien}")
                    .Subreport1_usJk.SetUnboundFieldSource ("{ado.jeniskelamin}")
                    .Subreport1_usTempatLahir.SetUnboundFieldSource ("{ado.tempatlahir}")
                    .Subreport1_usTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
                    .Subreport1_txtUmur.SetText strUmur
                    .Subreport1_usAgama.SetUnboundFieldSource ("{ado.agama}")
                    .Subreport1_usStatusPerkawinan.SetUnboundFieldSource ("{ado.statusperkawinan}")
                    .Subreport1_usPendidikan.SetUnboundFieldSource ("{ado.pendidikan}")
                    .Subreport1_usPekerjaan.SetUnboundFieldSource ("{ado.pekerjaan}")
                    .Subreport1_usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
                    .Subreport1_usKelurahan.SetUnboundFieldSource ("{ado.namadesakelurahan}")
                    .Subreport1_usKecamatan.SetUnboundFieldSource ("{ado.kecamatan}")
                    .Subreport1_usKabKota.SetUnboundFieldSource ("{ado.kotakabupaten}")
                    .Subreport1_UsTelepon.SetUnboundFieldSource ("{ado.notelepon}")
                    .Subreport1_usPropinsi.SetUnboundFieldSource ("{ado.namapropinsi}")
                    .Subreport1_usNoIdentitas.SetUnboundFieldSource ("{ado.noidentitas}")
                    .Subreport1_usPenanggungJawab.SetUnboundFieldSource ("{ado.penanggungjawab}")
                    .Subreport1_usAlamatPenanggungJawab.SetUnboundFieldSource ("{ado.alamatrmh}")
                    .Subreport1_usTeleponP.SetUnboundFieldSource ("{ado.teleponpenanggungjawab}")
                    .Subreport1_usHubungan.SetUnboundFieldSource ("{ado.hubungankeluargapj}")
                    .Subreport1_txtPetugasAdmisi.SetText strPetugas
                    .Subreport1_txtPenanggungJawab.SetText strPenanggungjawab
                    .Subreport1_txRuangan.SetText RS3!namaruangan
                    .Subreport1_txtKelasRawat.SetText RS3!namakelas
                    .Subreport1_txtJumlahRawat.SetText jmlahRawat
                    
                    .Subreport2_usNoCm.SetUnboundFieldSource ("{ado.nocm}")
                    .Subreport2_usJk.SetUnboundFieldSource ("{ado.jeniskelamin}")
                    .Subreport2_usAgama.SetUnboundFieldSource ("{ado.agama}")
                    .Subreport2_usPasien.SetUnboundFieldSource ("{ado.namapasien}")
                    .Subreport2_usTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
                    .Subreport2_usTempatLahir.SetUnboundFieldSource ("{ado.tempatlahir}")
                    .Subreport2_usJk.SetUnboundFieldSource ("{ado.jeniskelamin}")
                    .Subreport2_usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
                    .Subreport2_usKelurahan.SetUnboundFieldSource ("{ado.namadesakelurahan}")
                    .Subreport2_usKecamatan.SetUnboundFieldSource ("{ado.kecamatan}")
                    .Subreport2_usKabKota.SetUnboundFieldSource ("{ado.kotakabupaten}")
                    .Subreport2_UsTelepon.SetUnboundFieldSource ("{ado.notelepon}")
                    .Subreport2_usPropinsi.SetUnboundFieldSource ("{ado.namapropinsi}")
                    .Subreport2_usPendidikan.SetUnboundFieldSource ("{ado.pendidikan}")
                    .Subreport2_usPenanggungJawab.SetUnboundFieldSource ("{ado.penanggungjawab}")
                    .Subreport2_usAlamatPenanggungJawab.SetUnboundFieldSource ("{ado.alamatrmh}")
                    .Subreport2_usTeleponP.SetUnboundFieldSource ("{ado.teleponpenanggungjawab}")
                    .Subreport2_usHubungan.SetUnboundFieldSource ("{ado.hubungankeluargapj}")
                    .Subreport2_txtPetugasAdmisi.SetText strPetugas
                    .Subreport2_txtPenanggungJawab.SetText strPenanggungjawab
                    .Subreport2_usDokterPengirim.SetUnboundFieldSource ("{ado.dokterpengirim}")
                    .Subreport2_txtRuangRawat.SetText RS3!namaruangan
                    .Subreport2_txtTglMasuk.SetText RS3!tglRegis
                    .Subreport2_txtDpjp.SetText RS3!dpjp
                    .Subreport2_txtCaraBayar.SetText strcaraBayar
                    .Subreport2_txtBangsal.SetText RS3!namakamar
                    .Subreport2_txtJam.SetText RS3!JamRegis
                    .Subreport2_txtJmlHariRawat.SetText jmlahRawat
                    .Subreport2_txtCaraMasuk.SetText asalruangan
                    
                    .Subreport3_txtPenanggungJawab.SetText strPenanggungjawab
                    .Subreport3_txtPetugas.SetText strPetugas
                    .Subreport3_usNoCm.SetUnboundFieldSource ("{ado.nocm}")
                End With
            Else
                Report.Subreport1.Suppress = True
                Report.Subreport2.Suppress = True
                Report.Subreport3.Suppress = True
            End If
        End If
        If view = "false" Then
            Dim strPrinter As String
            strPrinter = GetTxt("Setting.ini", "Printer", "LembarRawatInap")
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
