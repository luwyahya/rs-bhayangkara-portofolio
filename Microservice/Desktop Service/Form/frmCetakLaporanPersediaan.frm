VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakLaporanPersediaan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakLaporanPersediaan.frx":0000
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
Attribute VB_Name = "frmCetakLaporanPersediaan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New cr_LaporanPersediaan
Dim Report2 As New cr_LaporanJasaResep
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

    Set frmCetakLaporanPersediaan = Nothing
End Sub

Public Sub Cetak(tglAwal As String, tglAkhir As String, strIdRuangan As String, view As String, strUser As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCetakLaporanPersediaan = Nothing
Dim adocmd As New ADODB.Command

 Dim str1, str2, namaruangan As String

 str2 = getBulan(Format(tglAwal, "yyyy/MM/dd"))
    If strIdRuangan <> "" Then
        str1 = " and rp.objectruanganfk=" & strIdRuangan & " "
        
    End If
    
Set Report = New cr_LaporanPersediaan

    '///**DATA BARANG'
    strSQL = "select pr.kdproduk,pr.kodebmn,rp.produkfk, pr.namaproduk, sas.satuanstandar, rp.bawal, rp.hargaawal, rp.jumlahawal, " & _
             "rp.bpenerimaan, rp.hargapenerimaan, rp.jumlahpenerimaan, rp.bpengeluaran, rp.hargapengeluaran, " & _
             "rp.jumlahpengeluaran , rp.bakhir, rp.hargaakhir, rp.jumlahakhir, rp.hargaakhir, rp.sumberdana, " & _
             "rp.tglmasuk, rp.tglkeluar, sc.tglclosing, rp.objectruanganfk, ru.namaruangan " & _
             "from rekappersediaan_t as rp " & _
             "inner join produk_m as pr on pr.id = rp.produkfk " & _
             "left join satuanstandar_m as sas on sas.id = pr.objectsatuanstandarfk " & _
             "left join strukclosing_t as sc on sc.norec = rp.strukclosingfk " & _
             "left join ruangan_m as ru on ru.id = rp.objectruanganfk " & _
             "where sc.tglclosing BETWEEN '" & tglAwal & "' and '" & tglAkhir & "'" & _
              str1
              
       ReadRs strSQL
             If rs.EOF = False Then
                namaruangan = rs!namaruangan
             Else
                namaruangan = "ALL"
             End If
             
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    With Report
        .database.AddADOCommand CN_String, adocmd
             .txtUser.SetText strUser
             .txtPeriode.SetText str2 & Format(tglAwal, " yyyy")
             .txtNamaRuangan.SetText namaruangan
'            .txtPeriode.SetText Format(tglAkhir, "MMMM yyyy")
'            .usNo.SetUnboundFieldSource ("{Ado.nomor}")
             .unKdBarang.SetUnboundFieldSource ("{Ado.produkfk}")
             .usBarangSirs.SetUnboundFieldSource ("{Ado.kdproduk}")
             .usNamaBarang.SetUnboundFieldSource ("{Ado.namaproduk}")
             .usSatuan.SetUnboundFieldSource ("{Ado.satuanstandar}")
'             .UsSumberDana.SetUnboundFieldSource ("{Ado.sumberdana}")
'             .udTglMasuk.SetUnboundFieldSource ("{Ado.tglmasuk}")
             .UnBanyaknya1.SetUnboundFieldSource ("{Ado.bawal}")
             .UnBanyaknya2.SetUnboundFieldSource ("{Ado.bpenerimaan}")
             .UnBanyaknya3.SetUnboundFieldSource ("{Ado.bpengeluaran}")
             .UnBanyak4.SetUnboundFieldSource ("{Ado.bakhir}")
             .UcHargaSatuan1.SetUnboundFieldSource ("{Ado.hargaawal}")
             .UcHargasatuan2.SetUnboundFieldSource ("{Ado.hargapenerimaan}")
             .UcHargasatuan3.SetUnboundFieldSource ("{Ado.hargapengeluaran}")
             .UcHargaSatuan4.SetUnboundFieldSource ("{Ado.hargaakhir}")
             .UcJumlah1.SetUnboundFieldSource ("{Ado.jumlahawal}")
             .UcJumlah2.SetUnboundFieldSource ("{Ado.jumlahpenerimaan}")
             .UcJumlah3.SetUnboundFieldSource ("{Ado.jumlahpengeluaran}")
             .UcJumlah4.SetUnboundFieldSource ("{Ado.jumlahakhir}")
             
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPedapatan")
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

Public Sub rekapjasaresep(tglAwal As String, tglAkhir As String, strIdRuangan As String, view As String, strUser As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCetakLaporanPersediaan = Nothing
Dim adocmd As New ADODB.Command

 Dim str1, str2, namaruangan As String

 str2 = getBulan(Format(tglAwal, "yyyy/MM/dd"))
    If strIdRuangan <> "" Then
        str1 = " and strukresep_t.ruanganfk=" & strIdRuangan & " "
        
    End If
    
    Set Report2 = New cr_LaporanJasaResep

    '///**DATA BARANG'
    strSQL = " select pasien_m.namapasien,  strukresep_t.ruanganfk,  SUM(pelayananpasien_t.jasa) AS jmlharga, COUNT(pelayananpasien_t.produkfk) AS jmlobat, ruangan_m.namaruangan, cast(strukresep_t.tglresep as date) as tglresep , case when strukpelayanan_t.totalprekanan is null then strukpelayanan_t.totalharusdibayar else strukpelayanan_t.totalharusdibayar + strukpelayanan_t.totalprekanan end as totalresep FROM pelayananpasien_t INNER JOIN" & _
            " antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN" & _
            " pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec INNER JOIN" & _
            " pasien_m ON pasiendaftar_t.nocmfk = pasien_m.id INNER JOIN" & _
            " strukresep_t ON pelayananpasien_t.strukresepfk = strukresep_t.norec AND antrianpasiendiperiksa_t.norec = strukresep_t.pasienfk INNER JOIN" & _
            " ruangan_m ON strukresep_t.ruanganfk = ruangan_m.id  INNER JOIN strukpelayanan_t ON pelayananpasien_t.strukfk = strukpelayanan_t.norec Where (pelayananpasien_t.isobat = 1) and strukresep_t.tglresep BETWEEN '" & tglAwal & "' and '" & tglAkhir & "'" & _
            str1 & _
             " GROUP BY pasien_m.namapasien,strukresep_t.ruanganfk,ruangan_m.namaruangan,cast(strukresep_t.tglresep as date), strukpelayanan_t.totalharusdibayar, strukpelayanan_t.totalprekanan"
              
              
       ReadRs strSQL
             If rs.EOF = False Then
                namaruangan = rs!namaruangan
             Else
                namaruangan = "ALL"
             End If
             
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    With Report2
        .database.AddADOCommand CN_String, adocmd
             .txtUser.SetText strUser
             .txtPeriode.SetText str2 & Format(tglAwal, " yyyy")
             .txtNamaRuangan.SetText namaruangan
'            .txtPeriode.SetText Format(tglAkhir, "MMMM yyyy")
'            .usNo.SetUnboundFieldSource ("{Ado.nomor}")
             .unnamapasien.SetUnboundFieldSource ("{Ado.namapasien}")
             .untanggal.SetUnboundFieldSource ("{Ado.tglresep}")
             .unJumlahHarga.SetUnboundFieldSource ("{Ado.jmlharga}")
             .unJumlahObat.SetUnboundFieldSource ("{Ado.jmlobat}")
             .UnUangResep.SetUnboundFieldSource ("{Ado.totalresep}")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPedapatan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Report2
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



'Option Explicit
'Dim ReportStokOpname As New cr_LaporanStokOpname
'
'Dim ii As Integer
'Dim tempPrint1 As String
'Dim p As Printer
'Dim p2 As Printer
'Dim strDeviceName As String
'Dim strDriverName As String
'Dim strPort As String
'
'Dim bolStokOpname As Boolean
'
'
'Dim strPrinter As String
'Dim strPrinter1 As String
'Dim PrinterNama As String
'
'Dim adoReport As New ADODB.Command
'
'Private Sub cmdCetak_Click()
'  If cboPrinter.Text = "" Then MsgBox "Printer belum dipilih", vbInformation, ".: Information": Exit Sub
'    If bolStokOpname = True Then
'        ReportStokOpname.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
'        ReportStokOpname.PrintOut False
'
'    End If
'End Sub
'
'Private Sub CmdOption_Click()
'
'    If bolStokOpname = True Then
'        ReportStokOpname.PrinterSetup Me.hWnd
'    End If
'
'    CRViewer1.Refresh
'End Sub
'
'Private Sub Form_Load()
'
'    Dim p As Printer
'    cboPrinter.Clear
'    For Each p In Printers
'        cboPrinter.AddItem p.DeviceName
'    Next
'    strPrinter = strPrinter1
'
'End Sub
'
'Private Sub Form_Resize()
'    CRViewer1.Top = 0
'    CRViewer1.Left = 0
'    CRViewer1.Height = ScaleHeight
'    CRViewer1.Width = ScaleWidth
'End Sub
'
'Private Sub Form_Unload(Cancel As Integer)
'
'    Set frmCetakStokOpname = Nothing
'
'End Sub
'
'Public Sub cetak(strTanggal As String, strIdRuangan As String, view As String, strUser As String)
'On Error GoTo errLoad
'Set frmCetakStokOpname = Nothing
'Dim strSQL, str1 As String
'    If strIdRuangan <> "" Then
'        str1 = "and ru.id = '" & strIdRuangan & "' "
'    End If
'
'bolStokOpname = True
'
'
'        With ReportStokOpname
'            Set adoReport = New ADODB.Command
'            adoReport.ActiveConnection = CN_String
'
'            strSQL = "select sc.noclosing,sc.tglclosing,pr.kdproduk,pr.namaproduk,ss.satuanstandar, " & _
'                    "spd.qtyproduksystem,spd.harganetto1,sp.tglstruk " & _
'                    "from strukclosing_t sc " & _
'                    "left join stokprodukdetailopname_t spd on spd.noclosingfk=sc.norec " & _
'                    "left join strukpelayanan_t sp on sp.norec=spd.nostrukterimafk " & _
'                    "left join produk_m pr on pr.id=spd.objectprodukfk " & _
'                    "left join satuanstandar_m ss on ss.id=pr.objectsatuanstandarfk " & _
'                    "left join ruangan_m ru on ru.id=spd.objectruanganfk " & _
'                    "where sc.tglclosing = '" & strTanggal & "' " & _
'                    str1
'
'             ReadRs strSQL
'
'             adoReport.CommandText = strSQL
'             adoReport.CommandType = adCmdUnknown
'            .database.AddADOCommand CN_String, adoReport
'
'             .txtuser.SetText strUser
'             .txtPeriode.SetText Format(strTanggal, "MMM/yyyy")
'
'             .udTglTerima.SetUnboundFieldSource ("{Ado.tglterima}")
'             .udTglED.SetUnboundFieldSource ("{Ado.tglkadaluarsa}")
'             .usGudang.SetUnboundFieldSource ("{Ado.ruangan}")
'             .usKdBarang.SetUnboundFieldSource ("{Ado.kdproduk}")
'             .usNamaBarang.SetUnboundFieldSource ("{Ado.namaproduk}")
'             .usSatuan.SetUnboundFieldSource ("{Ado.satuanstandar}")
'             .unBanyak.SetUnboundFieldSource ("{Ado.jumlah}")
'             .ucHarga.SetUnboundFieldSource ("{Ado.harga}")
'             .ucTotal.SetUnboundFieldSource ("{Ado.total}")
'
'            If view = "false" Then
'                strPrinter1 = GetTxt("Setting.ini", "Printer", "Logistik_A4")
'                .SelectPrinter "winspool", strPrinter1, "Ne00:"
'                .PrintOut False
'                Unload Me
'                Screen.MousePointer = vbDefault
'             Else
'                With CRViewer1
'                    .ReportSource = ReportStokOpname
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'                Screen.MousePointer = vbDefault
'            End If
'
'        End With
'Exit Sub
'errLoad:
'
'End Sub
'
