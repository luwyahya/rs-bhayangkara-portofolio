VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakLabelFarmasiRekap 
   Caption         =   "Transmedic"
   ClientHeight    =   7170
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5775
   Icon            =   "frmCetakLabelFarmasiRekap.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7170
   ScaleWidth      =   5775
   WindowState     =   2  'Maximized
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
      TabIndex        =   3
      Top             =   600
      Width           =   2775
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
      Left            =   3720
      TabIndex        =   2
      Top             =   600
      Width           =   975
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
      Left            =   4680
      TabIndex        =   1
      Top             =   600
      Width           =   1095
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   7215
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   5775
      DisplayGroupTree=   -1  'True
      DisplayToolbar  =   -1  'True
      EnableGroupTree =   -1  'True
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
      EnableSelectExpertButton=   0   'False
      EnableToolbar   =   -1  'True
      DisplayBorder   =   -1  'True
      DisplayTabs     =   -1  'True
      DisplayBackgroundEdge=   -1  'True
      SelectionFormula=   ""
      EnablePopupMenu =   -1  'True
      EnableExportButton=   0   'False
      EnableSearchExpertButton=   0   'False
      EnableHelpButton=   0   'False
   End
End
Attribute VB_Name = "frmCetakLabelFarmasiRekap"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
'Dim Report As New Cr_cetakLabelFarmasi
'Dim Report As New Cr_cetakLabelFarmasiNew
'Dim bolSuppresDetailSection10 As Boolean
'Dim Report As New Cr_cetakLabelObatBaru
Dim Report As New Cr_cetakLabelRekap
'Dim ii As Integer
'Dim tempPrint1 As String
'Dim p As Printer
'Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String

Private Sub cmdCetak_Click()
    Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    Report.PrintOut False
End Sub

Private Sub CmdOption_Click()
    Report.PrinterSetup Me.hwnd
    CRViewer1.Refresh
End Sub

Private Sub Form_Load()
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LabelFarmasi")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCetakLabelFarmasiRekap = Nothing
End Sub

Public Sub CetakLabelFarmasi(Norec As String, waktuMinum As String, view As String)
On Error GoTo errLoad
On Error Resume Next
Dim strSQL As String
Dim adocmd As New ADODB.Command
Dim str1, str2 As String
Dim strWaktuMakan As String
Dim strJamMakan As String
Dim Apoteker As String
Dim strWaktu As String
Set frmCetakLabelFarmasiRekap = Nothing

If Norec <> "" Then
    str1 = "sr.norec='" & Norec & "'"
    ReadRs2 "select pg.namalengkap from logginguser_t as lg " & _
            "INNER JOIN loginuser_s as lu on lu.id = lg.objectloginuserfk " & _
            "INNER JOIN pegawai_m as pg on pg.id = lu.objectpegawaifk " & _
            "where lg.noreff = '" & Norec & "'"
End If

If RS2.EOF = False Then
   Apoteker = "Apoteker : " & RS2!namalengkap
Else
   Apoteker = "Apoteker : -"
End If

Set Report = New Cr_cetakLabelRekap
If waktuMinum <> "" Then
    If waktuMinum = "Pagi" Then
        strSQL = " SELECT DISTINCT ps.nocm, ps.namapasien, convert(varchar, ps.tgllahir, 105) as tgllahir, sr.noresep, convert(varchar, sr.tglresep, 105) as tglresep, pr.namaproduk, pp.aturanpakai,pp.rke, " & _
                " CASE WHEN alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,ss.satuanstandar,pp.jumlah, " & _
                " pp.keteranganpakai,'Pagi' AS waktuminum,'Pagi : 06:00 - 07:00' AS waktu " & _
                " FROM pelayananpasien_t as pp inner join strukresep_t as sr on sr.norec= pp.strukresepfk " & _
                "INNER JOIN produk_m as pr on pr.id = pp.produkfk " & _
                "INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec = pp.noregistrasifk " & _
                "INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
                "INNER JOIN pasien_m as ps on ps.id = pd.nocmfk " & _
                "LEFT JOIN alamat_m as alm on alm.nocmfk = ps.id " & _
                "INNER JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk " & _
                "WHERE pp.jeniskemasanfk = 2 AND pp.ispagi = 1 AND " & _
                str1 & _
                ""
        strSQL = strSQL & " UNION ALL SELECT DISTINCT ps.nocm,ps.namapasien, convert(varchar, ps.tgllahir, 105) as tgllahir, sr.noresep, convert(varchar, sr.tglresep, 105) as tglresep,'rke-'+pp.rke+' Racikan' as namaproduk, pp.aturanpakai,pp.rke, " & _
                " CASE WHEN alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,CASE when jr.jenisracikan IS NULL THEN '' ELSE jr.jenisracikan END AS satuanstandar,((pp.qtydetailresep/pp.dosis)*pro.kekuatan) as jumlah, " & _
                " pp.keteranganpakai,'Pagi' AS waktuminum,'Pagi : 06:00 - 07:00' AS waktu " & _
                " FROM strukresep_t as sr  " & _
                "INNER JOIN pelayananpasien_t as pp on sr.norec= pp.strukresepfk " & _
                "INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec = sr.pasienfk " & _
                "INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
                "INNER JOIN pasien_m as ps on ps.id = pd.nocmfk " & _
                "LEFT JOIN alamat_m as alm on alm.nocmfk = ps.id " & _
                "INNER JOIN produk_m as pro on pro.id = pp.produkfk " & _
                "INNER JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk " & _
                "INNER JOIN jenisracikan_m as jr on jr.id = pp.jenisobatfk " & _
                "WHERE pp.jeniskemasanfk = 1 AND pp.ispagi = 1 AND " & _
                str1 & _
                ""
                
        strWaktuMakan = "Pagi :"
        strJamMakan = "06:00 - 07:00"
    End If
    
    If waktuMinum = "Siang" Then
        strSQL = " SELECT DISTINCT ps.nocm, ps.namapasien, convert(varchar, ps.tgllahir, 105) as tgllahir, sr.noresep, convert(varchar, sr.tglresep, 105) as tglresep, pr.namaproduk, pp.aturanpakai,pp.rke, " & _
                " CASE WHEN alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,ss.satuanstandar,pp.jumlah, " & _
                " pp.keteranganpakai,'Siang' AS waktuminum,'Siang : 12:00 - 13:00' AS waktu " & _
                " FROM pelayananpasien_t as pp inner join strukresep_t as sr on sr.norec= pp.strukresepfk " & _
                "INNER JOIN produk_m as pr on pr.id = pp.produkfk " & _
                "INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec = pp.noregistrasifk " & _
                "INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
                "INNER JOIN pasien_m as ps on ps.id = pd.nocmfk " & _
                "LEFT JOIN alamat_m as alm on alm.nocmfk = ps.id " & _
                "INNER JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk " & _
                "WHERE pp.jeniskemasanfk = 2 AND pp.issiang = 1 AND " & _
                str1 & _
                ""
        strSQL = strSQL & " UNION ALL SELECT DISTINCT ps.nocm,ps.namapasien, convert(varchar, ps.tgllahir, 105) as tgllahir, sr.noresep, convert(varchar, sr.tglresep, 105) as tglresep,'rke-'+pp.rke+' Racikan' as namaproduk, pp.aturanpakai,pp.rke, " & _
                " CASE WHEN alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,CASE when jr.jenisracikan IS NULL THEN '' ELSE jr.jenisracikan END AS satuanstandar,((pp.qtydetailresep/pp.dosis)*pro.kekuatan) as jumlah, " & _
                " pp.keteranganpakai,'Siang' AS waktuminum,'Siang : 12:00 - 13:00' AS waktu " & _
                " FROM strukresep_t as sr  " & _
                "INNER JOIN pelayananpasien_t as pp on sr.norec= pp.strukresepfk " & _
                "INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec = sr.pasienfk " & _
                "INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
                "INNER JOIN pasien_m as ps on ps.id = pd.nocmfk " & _
                "LEFT JOIN alamat_m as alm on alm.nocmfk = ps.id " & _
                "INNER JOIN produk_m as pro on pro.id = pp.produkfk " & _
                "INNER JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk " & _
                "INNER JOIN jenisracikan_m as jr on jr.id = pp.jenisobatfk " & _
                "WHERE pp.jeniskemasanfk = 1 AND pp.issiang = 1 AND " & _
                str1 & _
                ""
                
        strWaktuMakan = "Siang :"
        strJamMakan = "12:00 - 13:00"
    End If
    
    If waktuMinum = "Sore" Then
        strSQL = " SELECT DISTINCT ps.nocm, ps.namapasien, convert(varchar, ps.tgllahir, 105) as tgllahir, sr.noresep, convert(varchar, sr.tglresep, 105) as tglresep, pr.namaproduk, pp.aturanpakai,pp.rke, " & _
                " CASE WHEN alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,ss.satuanstandar,pp.jumlah, " & _
                " pp.keteranganpakai,'Sore' AS waktuminum,'Sore : 18:00 - 19:00' AS waktu " & _
                " FROM pelayananpasien_t as pp inner join strukresep_t as sr on sr.norec= pp.strukresepfk " & _
                "INNER JOIN produk_m as pr on pr.id = pp.produkfk " & _
                "INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec = pp.noregistrasifk " & _
                "INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
                "INNER JOIN pasien_m as ps on ps.id = pd.nocmfk " & _
                "LEFT JOIN alamat_m as alm on alm.nocmfk = ps.id " & _
                "INNER JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk " & _
                "WHERE pp.jeniskemasanfk = 2 AND pp.issore = 1 AND " & _
                str1 & _
                ""
        strSQL = strSQL & " UNION ALL SELECT DISTINCT ps.nocm,ps.namapasien, convert(varchar, ps.tgllahir, 105) as tgllahir, sr.noresep, convert(varchar, sr.tglresep, 105) as tglresep,'rke-'+pp.rke+' Racikan' as namaproduk, pp.aturanpakai,pp.rke, " & _
                " CASE WHEN alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,CASE when jr.jenisracikan IS NULL THEN '' ELSE jr.jenisracikan END AS satuanstandar,((pp.qtydetailresep/pp.dosis)*pro.kekuatan) as jumlah, " & _
                " pp.keteranganpakai,'Sore' AS waktuminum,'Sore : 18:00 - 19:00' AS waktu " & _
                " FROM strukresep_t as sr  " & _
                "INNER JOIN pelayananpasien_t as pp on sr.norec= pp.strukresepfk " & _
                "INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec = sr.pasienfk " & _
                "INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
                "INNER JOIN pasien_m as ps on ps.id = pd.nocmfk " & _
                "LEFT JOIN alamat_m as alm on alm.nocmfk = ps.id " & _
                "INNER JOIN produk_m as pro on pro.id = pp.produkfk " & _
                "INNER JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk " & _
                "INNER JOIN jenisracikan_m as jr on jr.id = pp.jenisobatfk " & _
                "WHERE pp.jeniskemasanfk = 1 AND pp.issore = 1 AND " & _
                str1 & _
                ""
                
        strWaktuMakan = "Sore :"
        strJamMakan = "18:00 - 19:00"
    End If
    
    If waktuMinum = "Malam" Then
        strSQL = " SELECT DISTINCT ps.nocm, ps.namapasien, convert(varchar, ps.tgllahir, 105) as tgllahir, sr.noresep, convert(varchar, sr.tglresep, 105) as tglresep, pr.namaproduk, pp.aturanpakai,pp.rke, " & _
                " CASE WHEN alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,ss.satuanstandar,pp.jumlah, " & _
                " pp.keteranganpakai,'Malam' AS waktuminum,'Malam : 23:00 - 00:00' AS waktu " & _
                " FROM pelayananpasien_t as pp inner join strukresep_t as sr on sr.norec= pp.strukresepfk " & _
                "INNER JOIN produk_m as pr on pr.id = pp.produkfk " & _
                "INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec = pp.noregistrasifk " & _
                "INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
                "INNER JOIN pasien_m as ps on ps.id = pd.nocmfk " & _
                "LEFT JOIN alamat_m as alm on alm.nocmfk = ps.id " & _
                "INNER JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk " & _
                "WHERE pp.jeniskemasanfk = 2 AND pp.ismalam = 1 AND " & _
                str1 & _
                ""
        strSQL = strSQL & " UNION ALL SELECT DISTINCT ps.nocm,ps.namapasien, convert(varchar, ps.tgllahir, 105) as tgllahir, sr.noresep, convert(varchar, sr.tglresep, 105) as tglresep,'rke-'+pp.rke+' Racikan' as namaproduk, pp.aturanpakai,pp.rke, " & _
                " CASE WHEN alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,CASE when jr.jenisracikan IS NULL THEN '' ELSE jr.jenisracikan END AS satuanstandar,((pp.qtydetailresep/pp.dosis)*pro.kekuatan) as jumlah, " & _
                " pp.keteranganpakai,'Malam' AS waktuminum,'Malam : 23:00 - 00:00' AS waktu " & _
                " FROM strukresep_t as sr  " & _
                "INNER JOIN pelayananpasien_t as pp on sr.norec= pp.strukresepfk " & _
                "INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec = sr.pasienfk " & _
                "INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
                "INNER JOIN pasien_m as ps on ps.id = pd.nocmfk " & _
                "LEFT JOIN alamat_m as alm on alm.nocmfk = ps.id " & _
                "INNER JOIN produk_m as pro on pro.id = pp.produkfk " & _
                "INNER JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk " & _
                "INNER JOIN jenisracikan_m as jr on jr.id = pp.jenisobatfk " & _
                "WHERE pp.jeniskemasanfk = 1 AND pp.ismalam = 1 AND " & _
                str1 & _
                ""
                
        strWaktuMakan = "Malam :"
        strJamMakan = "23:00 - 00:00"
    End If
End If
    strWaktu = strWaktuMakan & " " & strJamMakan
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    With Report
        .database.AddADOCommand CN_String, adocmd
        .udtTglResep.SetUnboundFieldSource ("{ado.tglresep}")
        .usNoResep.SetUnboundFieldSource ("{ado.noresep}")
        .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
        .udtTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
        .usnamaProduk.SetUnboundFieldSource ("{ado.namaproduk}")
        .Usaturanpakai.SetUnboundFieldSource ("{ado.aturanpakai}")
        .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
        .usTelp.SetUnboundFieldSource ("{ado.notelepon}")
        .usAlamat.SetUnboundFieldSource ("{ado.alamat}")
        .usStandar.SetUnboundFieldSource ("{ado.satuanstandar}")
        .usAturaPakai.SetUnboundFieldSource ("{ado.aturanpakai}")
        .usWaktuMakan.SetUnboundFieldSource ("{ado.waktuminum}")
        .usKeteranganPakai.SetUnboundFieldSource ("{ado.keteranganpakai}")
        .usWaktu.SetUnboundFieldSource ("{ado.waktu}")
'        .txtWaktuMinum.SetText strWaktu
        .txtApoteker.SetText Apoteker
       If view = "false" Then
            Dim strPrinter As String
            strPrinter = GetTxt("Setting.ini", "Printer", "RekapLabelFarmasi")
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
       End If
    End With
Exit Sub
errLoad:
End Sub

Public Sub CetakLabelFarmasiRekapCeklis(Norec As String, ProdukFk As String, view As String, user As String)
On Error GoTo errLoad
On Error Resume Next
    Dim str1, str2 As String
    Dim strWaktuMakan As String
    Dim strJamMakan As String
    If Norec <> "" Then
        str1 = "sr.norec='" & Norec & " '"
    End If
    If ProdukFk <> "" Then
        str2 = " and pp.produkfk in (" & Right(ProdukFk, Len(ProdukFk) - 1) & ")"
    End If
Set frmCetakLabelFarmasi = Nothing
Dim adocmd As New ADODB.Command
    
Set Report = New Cr_cetakLabelRekap
    strSQL = "select distinct ps.nocm, ps.namapasien, ps.tgllahir, sr.noresep, sr.tglresep, pr.namaproduk, pp.aturanpakai,pp.rke, " & _
             "case when alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,ss.satuanstandar,pp.jumlah, " & _
            "CASE WHEN issiang = 1 THEN 'Siang' WHEN issore = 1 THEN 'Sore' WHEN ispagi = 1 THEN ' Pagi ' WHEN ismalam = 1 THEN ' Malam ' ELSE ' - ' END as waktuminum,pp.keteranganpakai " & _
            "from pelayananpasien_t as pp inner join strukresep_t as sr on sr.norec= pp.strukresepfk " & _
            "inner join produk_m as pr on pr.id = pp.produkfk " & _
            "inner join antrianpasiendiperiksa_t as apd on apd.norec = pp.noregistrasifk " & _
            "inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
            "inner join pasien_m as ps on ps.id = pd.nocmfk " & _
            "left join alamat_m as alm on alm.nocmfk = ps.id " & _
            "INNER JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk " & _
            "where pp.jeniskemasanfk = 2 and " & _
            str1 & _
            str2 & _
            ""
    strSQL = strSQL & " union all select distinct ps.nocm,ps.namapasien, ps.tgllahir, sr.noresep, sr.tglresep,'rke-'+pp.rke+' Racikan' as namaproduk, pp.aturanpakai,pp.rke, " & _
            "case when alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,CASE when jr.jenisracikan IS NULL THEN '' ELSE jr.jenisracikan END AS satuanstandar,((pp.qtydetailresep/pp.dosis)*pro.kekuatan) as jumlah, " & _
            "CASE WHEN issiang = 1 THEN 'Siang' WHEN issore = 1 THEN 'Sore' WHEN ispagi = 1 THEN 'Pagi' WHEN ismalam = 1 THEN ' Malam ' ELSE ' - ' END as waktuminum,pp.keteranganpakai " & _
            "from strukresep_t as sr  " & _
            "inner join pelayananpasien_t as pp on sr.norec= pp.strukresepfk " & _
            "inner join antrianpasiendiperiksa_t as apd on apd.norec = sr.pasienfk " & _
            "inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
            "inner join pasien_m as ps on ps.id = pd.nocmfk " & _
            "left join alamat_m as alm on alm.nocmfk = ps.id " & _
            "INNER JOIN produk_m as pro on pro.id = pp.produkfk " & _
            "INNER JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk " & _
            "INNER JOIN jenisracikan_m as jr on jr.id = pp.jenisobatfk " & _
            "where pp.jeniskemasanfk =1 and " & _
            str1 & _
            str2 & _
            ""
    ReadRs2 strSQL
    If RS2.EOF = False Then
        If RS2!waktuMinum = "Siang" Then
            strWaktuMakan = "Siang :"
            strJamMakan = "12:00 - 13:00"
        ElseIf RS2!waktuMinum = "Malam" Then
            strWaktuMakan = "Malam :"
            strJamMakan = "23:00 - 00:00"
        ElseIf RS2!waktuMinum = "Pagi" Then
            strWaktuMakan = "Pagi :"
            strJamMakan = "06:00 - 07:00"
        ElseIf RS2!waktuMinum = "Pagi" Then
            strWaktuMakan = "Sore"
            strJamMakan = "18:00 - 19:00"
        End If
    Else
        strWaktuMakan = " "
        strJamMakan = " "
    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .udtTglResep.SetUnboundFieldSource ("{ado.tglresep}")
            .usNoResep.SetUnboundFieldSource ("{ado.noresep}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .udtTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
            .usnamaProduk.SetUnboundFieldSource ("{ado.namaproduk}")
            .usAturaPakai.SetUnboundFieldSource ("{ado.aturanpakai}")
            .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
            .usTelp.SetUnboundFieldSource ("{ado.notelepon}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamat}")
            .usStandar.SetUnboundFieldSource ("{ado.satuanstandar}")
            .usWaktuMakan.SetUnboundFieldSource ("{ado.waktuminum}")
'            .unjml.SetUnboundFieldSource ("{ado.jumlah}")
            .txtWaktuMinum.SetText strWaktuMakan & " " & strJamMakan
            .usKeteranganPakai.SetUnboundFieldSource ("{ado.keteranganpakai}")
            
'            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "RekapLabelFarmasi")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Report
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
        'End If
    End With
Exit Sub
errLoad:
End Sub
