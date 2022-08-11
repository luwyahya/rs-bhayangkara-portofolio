VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRLaporanTagihanPenjaminAll 
   Caption         =   "Medifirst2000"
   ClientHeight    =   6705
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   6330
   LinkTopic       =   "Form1"
   ScaleHeight     =   6705
   ScaleWidth      =   6330
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
      TabIndex        =   3
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
      TabIndex        =   2
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
      TabIndex        =   1
      Top             =   480
      Width           =   3015
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   6735
      Left            =   0
      TabIndex        =   4
      Top             =   0
      Width           =   6255
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
      EnableExportButton=   -1  'True
      EnableSearchExpertButton=   0   'False
      EnableHelpButton=   0   'False
   End
   Begin VB.TextBox txtNamaFormPengirim 
      Height          =   495
      Left            =   3120
      TabIndex        =   0
      Top             =   600
      Width           =   2175
   End
End
Attribute VB_Name = "frmCRLaporanTagihanPenjaminAll"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
    Option Explicit
Dim Report As New crLaporanTagihanPenjamin
'Dim bolSuppresDetailSection10 As Boolean
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LaporanPenerimaan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRLaporanTagihanPenjamin = Nothing
End Sub

Public Sub CetakLaporanTagihanPenjaminAll(tglAwal As String, tglAkhir As String, strIdDepartemen As String, strIdRuangan As String, _
                                          strIdKelompokPasien As String, strIdPegawai As String, strIdPerusahaan As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRLaporanTagihanPenjamin = Nothing
Dim adocmd As New ADODB.Command

    Dim strFilter As String
    Dim orderby As String
    Dim orderby2 As String
    strFilter = ""
    orderby = ""
    orderby2 = ""
     
    strFilter = " where spp.noverifikasi is not null and stp.tglposting BETWEEN '" & _
    Format(tglAwal, "yyyy-MM-dd HH:mm") & "' AND '" & _
    Format(tglAkhir, "yyyy-MM-dd HH:mm") & "'"
    If strIdDepartemen <> "" Then
        If strIdDepartemen = 18 Then
            strFilter = strFilter & " AND ru.objectdepartemenfk in (18,3,24,27,28)"
        Else
            If strIdDepartemen <> "" Then
                strFilter = strFilter & " AND ru.objectdepartemenfk = '" & strIdDepartemen & "' "
            End If
        End If
    End If
    If strIdRuangan <> "" Then strFilter = strFilter & " AND ru.id = '" & strIdRuangan & "' "
    If strIdKelompokPasien <> "" Then strFilter = strFilter & " AND pd.objectkelompokpasienlastfk = '" & strIdKelompokPasien & "' "
    If strIdPerusahaan <> "" Then strFilter = strFilter & " AND r.id = '" & strIdPerusahaan & "' "
  
    orderby = strFilter & " group by sp.totalharusdibayar, sp.totalprekanan, kp.kelompokpasien, spp.norec, stp.tglposting, pd.noregistrasi, pd.tglregistrasi, " & _
                "p.nocm , p.namapasien, ru.namaruangan, pr.ID, pp.hargajual, pp.jumlah, pp.hargadiscount, kpr.ID, " & _
                "pr.objectdetailjenisprodukfk, spp.totalppenjamin , spp.totalharusdibayar, spp.totalsudahdibayar, " & _
                "r.namarekanan , spp.totalbiaya, spp.noverifikasi, php.noposting, stp.kdhistorylogins " & _
                "order by pd.tglregistrasi"
                
    orderby2 = strFilter & " group by sp.totalharusdibayar, sp.totalprekanan, kp.kelompokpasien, spp.norec, stp.tglposting, pd.noregistrasi, pd.tglregistrasi, " & _
                "p.nocm , p.namapasien, ru.namaruangan, pp.hargajual, pp.jumlah, pp.hargadiscount, " & _
                "spp.totalppenjamin , spp.totalharusdibayar, spp.totalsudahdibayar, " & _
                "r.namarekanan , spp.totalbiaya, spp.noverifikasi, php.noposting, stp.kdhistorylogins " & _
                "order by pd.tglregistrasi"
                
    Set Report = New crLaporanTagihanPenjamin
    
    strSQL = "select kp.kelompokpasien, spp.norec, stp.tglposting, pd.noregistrasi, pd.tglregistrasi, " & _
            "p.nocm, p.namapasien, ru.namaruangan, " & _
            "case when pr.id =395 then pp.hargajual* pp.jumlah else 0 end as karcis, " & _
            "case when pr.id =10013116  then pp.hargajual* pp.jumlah else 0 end as embos, " & _
            "case when kpr.id = 26 then pp.hargajual* pp.jumlah else 0 end as konsul, " & _
            "case when kpr.id in (1,2,3,4,8,9,10,11,13,14) then pp.hargajual* pp.jumlah else 0 end as tindakan, " & _
            "(case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah as diskon, " & _
            "(case when pr.objectdetailjenisprodukfk=474 then pp.hargajual* pp.jumlah else 0 end) as totalresep, " & _
            "sp.totalharusdibayar as aa, sp.totalprekanan as bb, spp.totalppenjamin, spp.totalharusdibayar, spp.totalsudahdibayar, r.namarekanan, " & _
            "spp.totalbiaya , spp.noverifikasi, php.noposting, stp.kdhistorylogins " & _
            "from strukpelayananpenjamin_t as spp inner join strukpelayanan_t as sp on sp.norec = spp.nostrukfk " & _
            "inner join pelayananpasien_t as pp on pp.strukfk = sp.norec " & _
            "LEFT JOIN produk_m as pr on pr.id=pp.produkfk " & _
            "inner join antrianpasiendiperiksa_t as ap on ap.norec = pp.noregistrasifk " & _
            "inner join pasiendaftar_t as pd on pd.norec = ap.noregistrasifk " & _
            "left JOIN ruangan_m as ru on ru.id=ap.objectruanganfk " & _
            "inner join pasien_m as p on p.id = pd.nocmfk " & _
            "inner join postinghutangpiutang_t as php on php.nostrukfk = spp.norec " & _
            "inner join strukposting_t as stp on stp.noposting = php.noposting " & _
            "left join rekanan_m as r on r.id = pd.objectrekananfk  " & _
            "left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk " & _
            "left JOIN detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk " & _
            "left JOIN jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk " & _
            "left JOIN kelompokproduk_m as kpr on kpr.id=jp.objectkelompokprodukfk " & _
            orderby

    ReadRs2 "select kp.kelompokpasien, spp.norec, stp.tglposting, pd.noregistrasi, pd.tglregistrasi, " & _
            "p.nocm, p.namapasien, spp.totalppenjamin, spp.totalharusdibayar, spp.totalsudahdibayar, r.namarekanan, " & _
            "spp.totalbiaya , spp.noverifikasi, php.noposting, stp.kdhistorylogins " & _
            "from strukpelayananpenjamin_t as spp inner join strukpelayanan_t as sp on sp.norec = spp.nostrukfk " & _
            "inner join pelayananpasien_t as pp on pp.strukfk = sp.norec " & _
            "inner join antrianpasiendiperiksa_t as ap on ap.norec = pp.noregistrasifk " & _
            "left JOIN ruangan_m as ru on ru.id=ap.objectruanganfk " & _
            "inner join pasiendaftar_t as pd on pd.norec = ap.noregistrasifk " & _
            "inner join pasien_m as p on p.id = pd.nocmfk " & _
            "inner join postinghutangpiutang_t as php on php.nostrukfk = spp.norec " & _
            "inner join strukposting_t as stp on stp.noposting = php.noposting " & _
            "left join rekanan_m as r on r.id = pd.objectrekananfk " & _
            "left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk " & _
            orderby2
            
    Dim tCash, tmaterai, tPiutang As Double
    Dim i As Integer
    Dim X As Double
    
    For i = 0 To RS2.RecordCount - 1
        tPiutang = tPiutang + CDbl(IIf(IsNull(RS2!totalppenjamin), 0, RS2!totalppenjamin))
        
        RS2.MoveNext
    Next i
    
    If tPiutang >= 1000000 Then
        tmaterai = 6000
    ElseIf tPiutang >= 250000 And tPiutang <= 999999 Then
        tmaterai = 3000
    ElseIf 0 >= tPiutang <= 249999 Then
        tmaterai = 0
    End If
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
'            .txtNamaKasir.SetText namaPrinted
            '.txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
'            .usNamaKasir.SetUnboundFieldSource ("{ado.kasir}")
            .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            '.usNamaDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
            .udTglRegistrasi.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .unKarcis.SetUnboundFieldSource ("{ado.karcis}")
            .unEmbos.SetUnboundFieldSource ("{ado.embos}")
            .unKonsul.SetUnboundFieldSource ("{ado.konsul}")
            .unTindakan.SetUnboundFieldSource ("{ado.tindakan}")
            '.unDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .unResep.SetUnboundFieldSource ("{ado.totalresep}")
            .unCash.SetUnboundFieldSource ("{ado.aa}")
            .unTagihan.SetUnboundFieldSource ("{ado.bb}")
            '.usKelompokPasien.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usNamaPenjamin.SetUnboundFieldSource ("{ado.namarekanan}")
            .unMaterai.SetUnboundFieldSource tmaterai
            
            '.ucCash2.SetUnboundFieldSource (tCash)
            .unTagihan2.SetUnboundFieldSource (tPiutang)
            '.ucCash2.SetUnboundFieldSource (RS2!cash)
            '.ucTagihan2.SetUnboundFieldSource (RS2!totalpiutangpenjamin)
            '.txtA1.SetText Format(RS2!cash, "##,##0.00")
            '.txtA2.SetText Format(RS2!totalpiutangpenjamin, "##,##0.00")
            
            X = Round(tPiutang + tmaterai)
            .unPembulatan.SetUnboundFieldSource X
            '.txtPembulatan.SetText Format(X, "##.##0")
            .txtTerbilang.SetText "# " & TERBILANG(X) & " #"
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanTagihanPenjamin")
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
        'End If
    End With
Exit Sub
errLoad:
    MsgBox Err.Number & " " & Err.Description
End Sub
