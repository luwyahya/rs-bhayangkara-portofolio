VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRLaporanPenerimaanKasirLama 
   Caption         =   "Medifirst2000"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   6990
   Icon            =   "frmLaporanPenerimaanKasirLama.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   6990
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
      TabIndex        =   2
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
      TabIndex        =   1
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
      TabIndex        =   0
      Top             =   480
      Width           =   3015
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   7005
      Left            =   0
      TabIndex        =   3
      Top             =   0
      Width           =   7005
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
End
Attribute VB_Name = "frmCRLaporanPenerimaanKasirLama"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim ReportBaru As New crPenerimaanKasir2
'Dim bolSuppresDetailSection10 As Boolean
'Dim ii As Integer
'Dim tempPrint1 As String
'Dim p As Printer
'Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String

Private Sub cmdCetak_Click()
    ReportBaru.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    ReportBaru.PrintOut False
End Sub

Private Sub CmdOption_Click()
    ReportBaru.PrinterSetup Me.hwnd
    CRViewer1.Refresh
End Sub


Private Sub Form_Load()
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LaporanPenerimaan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRLaporanPenerimaanKasir = Nothing
End Sub

Public Sub CetakLaporanPenerimaanKasirLama(idKasir As String, tglAwal As String, tglAkhir As String, idPegawai As String, idDept As String, idRuangan As String, idDokter As String, view As String)
On Error GoTo errLoad
On Error Resume Next
Set frmCRLaporanPenerimaanKasir = Nothing
Dim adocmd As New ADODB.Command
    Dim str1 As String
    Dim str2 As String
    Dim str3 As String
    Dim str4 As String
    If idPegawai <> "" Then
        str1 = "and pg2.id in (" & idPegawai & ") "
    End If
    If idDept <> "" Then
        str4 = " and ru.objectdepartemenfk=" & idDept & " "
    End If
    If idRuangan <> "" Then
        str2 = " and pd.objectruanganlastfk=" & idRuangan & " "
    End If
'    If idDokter <> "" Then
'        str3 = " and pg2.id=" & idDokter & " "
'    End If
    
Set ReportBaru = New crPenerimaanKasir2
    strSQL = "select  " & _
            "case when cb.id = 1 then sbm.totaldibayar else 0 end as tunai, " & _
            "case when cb.id > 1 then sbm.totaldibayar else 0 end as nontunai,case when pd.noregistrasi is null then sp.nostruk else pd.noregistrasi end as noregistrasi, sbm.tglsbm, ps.nocm, " & _
            "case when ps.namapasien is null then sp.namapasien_klien else ps.namapasien end as namapasien, " & _
            "case when kp.kelompokpasien is null then 'Non Layanan' else kp.kelompokpasien end as kelompokpasien, ru.namaruangan, pg.namalengkap, " & _
            "pg2.namaexternal as kasir, sbm.totaldibayar, " & _
            "CASE WHEN sp.totalprekanan is null then 0 else sp.totalprekanan end as hutangPenjamin, " & _
            "sp.totalharusdibayar, lu.namaexternal as namaLogin " & _
            "from strukbuktipenerimaan_t as sbm " & _
            "left JOIN strukbuktipenerimaancarabayar_t as sbmc on sbmc.nosbmfk=sbm.norec " & _
            "LEFT JOIN carabayar_m as cb on cb.id=sbmc.objectcarabayarfk " & _
            "INNER JOIN strukpelayanan_t as sp on sp.norec=sbm.nostrukfk  " & _
            "LEFT JOIN loginuser_s as lu on lu.id=sbm.objectpegawaipenerimafk " & _
            "LEFT JOIN pegawai_m as pg2 on pg2.id=lu.objectpegawaifk " & _
            "LEFT JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk " & _
            "LEFT JOIN pasien_m as ps on ps.id=sp.nocmfk " & _
            "LEFT join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
            "Left JOIN pegawai_m as pg on pg.id=pd.objectpegawaifk " & _
            "LEFT JOIN ruangan_m as ru on ru.id=pd.objectruanganlastfk " & _
            "LEFT JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk " & _
            "where sbm.tglsbm BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
            str1 & _
            str4 & _
            str2 & _
            "order by pd.noregistrasi"
' strSQL = "SELECT SUM(x.tunai) as tunai,SUM(x.nontunai) as nontunai,x.noregistrasi,x.tglsbm,x.nocm,x.namapasien, " & _
'             "x.kelompokpasien,x.namaruangan,x.namalengkap,x.kasir,SUM(x.totaldibayar) as totaldibayar,x.hutangPenjamin, " & _
'             "SUM(x.totalharusdibayar) as totalharusdibayar,x.namaLogin From (SELECT CASE WHEN cb.id = 1 THEN ((pp.hargajual - pp.hargadiscount) * pp.jumlah)  + CASE WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END ELSE 0 END AS tunai, " & _
'             "CASE WHEN cb.id > 1 THEN ((pp.hargajual - pp.hargadiscount) * pp.jumlah)  + CASE WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END ELSE 0 END AS nontunai, " & _
'             "pd.noregistrasi,sbm.tglsbm,ps.nocm,ps.namapasien,kp.kelompokpasien,case when rude.namaruangan is null then ru.namaruangan else rude.namaruangan end as namaruangan,pg.namalengkap,pg2.namaexternal AS kasir, " & _
'             "((pp.hargajual - pp.hargadiscount) * pp.jumlah)  + CASE WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END AS totaldibayar, " & _
'             "CASE WHEN sp.totalprekanan IS NULL THEN 0 ELSE sp.totalprekanan END AS hutangPenjamin, " & _
'             "((pp.hargajual - pp.hargadiscount) * pp.jumlah)  + CASE WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END AS totalharusdibayar,lu.namaexternal AS namaLogin " & _
'             "From pasiendaftar_t As pd INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec AND pp.strukfk is not null " & _
'             "INNER JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk INNER JOIN strukbuktipenerimaan_t AS sbm ON sbm.norec = sp.nosbmlastfk LEFT JOIN strukbuktipenerimaancarabayar_t AS sbmc ON sbmc.nosbmfk = sbm.norec " & _
'             "LEFT JOIN carabayar_m AS cb ON cb.id = sbmc.objectcarabayarfk LEFT JOIN loginuser_s AS lu ON lu.id = sbm.objectpegawaipenerimafk " & _
'             "LEFT JOIN pegawai_m AS pg2 ON pg2.id = lu.objectpegawaifk LEFT JOIN pasien_m AS ps ON ps.id = sp.nocmfk LEFT JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk " & _
'             "LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk LEFT JOIN strukresep_t as str on str.norec = pp.strukresepfk " & _
'             "LEFT JOIN ruangan_m as rude on str.ruanganfk = rude.id " & _
'             "where sbm.tglsbm BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
'             str1 & _
'             str4 & _
'             str2 & ") as x " & _
'             "GROUP BY x.noregistrasi,x.tglsbm,x.nocm,x.namapasien,x.kelompokpasien,x.namaruangan,x.namalengkap,x.kasir, " & _
'             "x.hutangPenjamin,x.namaLogin "
'
'      strSQL = strSQL & " UNION ALL " & _
'               "SELECT CASE WHEN cb.id = 1 THEN sbm.totaldibayar ELSE 0 END AS tunai,CASE WHEN cb.id > 1 THEN sbm.totaldibayar ELSE 0 END AS nontunai, " & _
'               "sp.nostruk AS noregistrasi,sbm.tglsbm,'-' as nocm,sp.namapasien_klien AS namapasien,'Non Layanan' AS kelompokpasien,'-' as namaruangan,'-' as namalengkap, " & _
'               "pg2.namaexternal AS kasir,sbm.totaldibayar,CASE WHEN sp.totalprekanan IS NULL THEN 0 ELSE sp.totalprekanan END AS hutangPenjamin, " & _
'               "sp.totalharusdibayar,lu.namaexternal AS namaLogin From strukpelayanan_t As sp " & _
'               "INNER JOIN strukbuktipenerimaan_t AS sbm ON sbm.norec = sp.nosbmlastfk LEFT JOIN strukbuktipenerimaancarabayar_t AS sbmc ON sbmc.nosbmfk = sbm.norec " & _
'               "LEFT JOIN carabayar_m AS cb ON cb.id = sbmc.objectcarabayarfk LEFT JOIN loginuser_s AS lu ON lu.id = sbm.objectpegawaipenerimafk " & _
'               "LEFT JOIN pegawai_m AS pg2 ON pg2.id = lu.objectpegawaifk " & _
'               "Where sp.noregistrasifk Is Null and sbm.tglsbm BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
'               str1 & _
'               "order by tglsbm,namapasien"


    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With ReportBaru
        .database.AddADOCommand CN_String, adocmd
            .usNamaKasir.SetText idKasir
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .usNamaLogin.SetUnboundFieldSource ("{ado.kasir}")
            .udtTglSBM.SetUnboundFieldSource ("{ado.tglsbm}")
            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
'            .usDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .ucTotalbiaya.SetUnboundFieldSource ("{ado.totaldibayar}")
            .ucHutangPenjamin.SetUnboundFieldSource ("{ado.hutangPenjamin}")
            .ucJmlBayar.SetUnboundFieldSource ("{ado.totalharusdibayar}")
            .ucTunai.SetUnboundFieldSource ("{ado.tunai}")
            .ucCard.SetUnboundFieldSource ("{ado.nontunai}")
            
'            .tKasubagKeuangan.SetText nikKasubag
'            .tNamaKasubag.SetText kasubag
'            .tNikKalak.SetText nikKalak
'            .tNamaKalak.SetText kalak
'            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            If view = "false" Then
                Dim strPrinter As String
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenerimaanKasir")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = ReportBaru
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        'End If
    End With
Exit Sub
errLoad:
End Sub


