VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRLaporanPenerimaanKasirLamaMondok 
   Caption         =   "Medifirst2000"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   6990
   Icon            =   "frmLaporanPenerimaanKasirLamaMondok.frx":0000
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
Attribute VB_Name = "frmCRLaporanPenerimaanKasirLamaMondok"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim ReportBaru As New crJasapelayananrawatmondok
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

    Set frmCRLaporanPenerimaanKasirLamaMondok = Nothing
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
    strSQL = "select " & _
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
            "where sbm.tglsbm BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' AND sbm.noclosingfk is not null " & _
            str1 & _
            str4 & _
            str2 & _
            "order by pd.noregistrasi"

    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    Dim judul As String
    Dim waktu As String
     judul = "HASIL PENERIMAAN KASIR RAWAT MONDOK "
    waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
     
    With ReportBaru
        .database.AddADOCommand CN_String, adocmd
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .unjumlah.SetUnboundFieldSource ("{ado.totaldibayar}")
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)

            
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


