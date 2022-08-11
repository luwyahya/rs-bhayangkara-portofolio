VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLaporanSimakBMN 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmLaporanSimakBMN.frx":0000
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
   Begin VB.TextBox txtNamaFormPengirim 
      Height          =   495
      Left            =   3120
      TabIndex        =   1
      Top             =   600
      Width           =   2175
   End
End
Attribute VB_Name = "frmLaporanSimakBMN"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
'Option Explicit
'Dim Report As New frmLaporanSimakBMN
'Dim bolSuppresDetailSection10 As Boolean
'Dim ii As Integer
'Dim tempPrint1 As String
'Dim p As Printer
'Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String
    Public LogFile As Integer

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

    Set frmLaporanSimakBMN = Nothing
End Sub

Public Sub CetakLaporan(tglAwal As String, tglAkhir As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

     Dim KodeSequence As String
     Dim KodeSequence1 As String
     Dim KodeSequence2 As String
     Dim KodeSequence3 As String
     Dim tanggal As Date
     Dim Tanggal1 As Date
     Dim Tanggal2 As Date
     Dim Tanggal3 As Date
     Dim op As String
     
     Dim fso As FileSystemObject
     
     tglAwal = tglAwal + " 00:00"
     tglAkhir = tglAkhir + " 23:59"
     
    LogFile = FreeFile(0)
'    Open "C:/psedia10/txtPersediaan/SimakBMN" & Format(Now(), "yyyyMMdd_HHmm") & ".txt" For Append As #LogFile
     Open "C:/SimakBMN" & Format(Now(), "yyyyMMdd_HHmm") & ".txt" For Append As #LogFile
     
    
        'M01
'        ReadRs4 "select sc.noclosing,sc.tglclosing,pr.id as kdproduk,pr.namaproduk,pr.kodebmn,ss.satuanstandar,spd.qtyproduksystem, " & _
'                 "spd.harganetto1,spd.qtyproduksystem * spd.harganetto1 as total,sp.tglstruk,ru.namaruangan " & _
'                 "from strukclosing_t  sc " & _
'                 "left join stokprodukdetailopname_t  spd on spd.noclosingfk=sc.norec " & _
'                 "left join strukpelayanan_t  sp on sp.norec=spd.nostrukterimafk " & _
'                 "left join strukpelayanandetail_t spdt on spdt.noclosingfk=sc.norec " & _
'                 "left join produk_m pr on pr.id=spd.objectprodukfk " & _
'                 "left join satuanstandar_m ss on ss.id=pr.objectsatuanstandarfk " & _
'                 "left join ruangan_m ru on ru.id=spd.objectruanganfk  " & _
'                 "where pr.statusenabled = 't' " & _
'                 "and sc.tglclosing BETWEEN '" & tglAwal & "' and '" & tglAkhir & "'"
'        RS4.MoveFirst
'
'        For i = 0 To RS4.RecordCount - 1
'                KodeSequence3 = Strings.Right(RS4!noclosing, 5)
'                Tanggal3 = RS4!tglclosing
'                Print #LogFile, "|" & "024040100520611000KD" & "|,|" & RS4!namaproduk & "|,|" & "2018" & "|,|" & _
'                                    "024040100520611000KD" & "2018" & KodeSequence3 & "M" & "|,|" & Format(Tanggal3, "dd-MM-yyyy HH:mm:ss"); "," & _
'                                    Format(Tanggal3, "dd-MM-yyyy HH:mm:ss") & "|,|" & RS4!kodebmn & "|,|" & RS4!kdproduk & "|," & RS4!qtyproduksystem; ",|" & _
'                                    RS4!satuanstandar & "|,|" & "RSABHK" & "|,|" & "RSABHK" & "|,|" & "M01" & "|," & _
'                                    RS4!harganetto1; ","; RS4!total & ",|" & "1|"
'
'        RS4.MoveNext
'
'
'        Next

        'M02
        strSQL = "select sp.norec,pr.id,pr.namaproduk,kp.kelompokproduk,kt.kelompoktransaksi,sp.tglstruk, " & _
                 "pr.kodebmn,spd.qtyproduk,std.satuanstandar,ru.namaruangan,sp.nostruk, " & _
                 "(spd.hargasatuan-spd.hargadiscount)+spd.hargappn as harga, rek.namarekanan " & _
                 "from  strukpelayanan_t as sp " & _
                 "INNER JOIN kelompoktransaksi_m as kt on kt.id = sp.objectkelompoktransaksifk " & _
                 "INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec " & _
                 "INNER JOIN produk_m as pr on pr.id = spd.objectprodukfk " & _
                 "INNER JOIN detailjenisproduk_m as djp on djp.id = pr.objectdetailjenisprodukfk " & _
                 "INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk  " & _
                 "INNER JOIN kelompokproduk_m as kp on kp.id = jp.objectkelompokprodukfk " & _
                 "INNER JOIN satuanstandar_m as std on std.id = spd.objectsatuanstandarfk " & _
                 "INNER JOIN ruangan_m as ru on ru.id = sp.objectruanganfk " & _
                 "LEFT JOIN rekanan_m as rek on rek.id = sp.objectrekananfk " & _
                 "where sp.objectkelompoktransaksifk=35 and pr.statusenabled = 't' " & _
                 "and sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "'"
                 
    ReadRs strSQL
        'format txt
        '"|" & "KodeLokasi(024040400415582003KD)" & "|,|" & NamaProduk & "|,|" & "TahunAnggaran" & "|,|" & _
         "20DigitKodeLokasi(024040400415582003KD)" & "4DigitTahunAnggaran(2018)" & "KDSEQ" & "M" & "|,|" & _
         "& TglDokumenPerolehanBarang & "|,|" TglPencatatanApp & "|,|" &  KdBMN & "|,|" & KdBarangRS & "|,|" & _
         & QtyProduk & "|,|" Satuan & "|,|" & RuanganPerolehan & "|,|" & NoStrukKeluar/Terima & "|,|" & KodeTransaksiBMN & "|,|" & _
         harga & "|,|" & NilaiHargaTotal & "|,|" & "Flag_kirim(1)|" '
         

    rs.MoveFirst

    
    For i = 0 To rs.RecordCount - 1
         KodeSequence = Strings.Right(rs!nostruk, 5)
         tanggal = rs!tglstruk
         Print #LogFile, "|" & "024040100520611000KD" & "|,|" & rs!namaproduk & "|,|" & "2018" & "|,|" & _
                             "024040100520611000KD" & "2018" & KodeSequence & "M" & "|," & Format(tanggal, "dd-MM-yyyy HH:mm:ss"); "," & _
                             Format(tanggal, "dd-MM-yyyy HH:mm:ss") & ",|" & Strings.Left(rs!kodebmn, 10) & "|,|" & rs!ID & "|," & rs!QtyProduk; ",|" & _
                             rs!satuanstandar & "|,|" & rs!namarekanan & "|,|" & rs!nostruk & "|,|" & "M02" & "|," & _
                             rs!harga; ","; rs!harga * rs!QtyProduk & ",|" & "1|"
   
    rs.MoveNext
     
     
     Next

        'Print #LogFile, "|PENERIMAAN|"
        'K01
    
        strSQL2 = "select sp.norec,pr.id,pr.namaproduk,kp.kelompokproduk,kt.kelompoktransaksi,sp.tglstruk, " & _
                 "pr.kodebmn,spd.qtyproduk,std.satuanstandar,ru.namaruangan,sp.nostruk,(spd.hargasatuan-spd.hargadiscount)+spd.hargappn as harga " & _
                 "from  strukpelayanan_t as sp " & _
                 "INNER JOIN kelompoktransaksi_m as kt on kt.id = sp.objectkelompoktransaksifk " & _
                 "INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec " & _
                 "INNER JOIN produk_m as pr on pr.id = spd.objectprodukfk " & _
                 "INNER JOIN detailjenisproduk_m as djp on djp.id = pr.objectdetailjenisprodukfk " & _
                 "INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk  " & _
                 "INNER JOIN kelompokproduk_m as kp on kp.id = jp.objectkelompokprodukfk " & _
                 "INNER JOIN satuanstandar_m as std on std.id = spd.objectsatuanstandarfk " & _
                 "INNER JOIN ruangan_m as ru on ru.id = sp.objectruanganfk " & _
                 "where sp.objectkelompoktransaksifk=2 and pr.statusenabled = 't' and " & _
                 "sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "'"
                 
    'Print #LogFile, "|PENGELUARAN OBAT BEBAS|"
    ReadRs2 strSQL2
    
    RS2.MoveFirst
    
         For i = 0 To RS2.RecordCount - 1
         KodeSequence1 = Strings.Right(RS2!nostruk, 5)
         Tanggal1 = RS2!tglstruk
            Print #LogFile, "|" & "024040100520611000KD" & "|,|" & RS2!namaproduk & "|,|" & "2018" & "|,|" & _
                                "024040100520611000KD" & "2018" & KodeSequence2 & "K" & "|," & Format(Tanggal1, "dd-MM-yyyy HH:mm:ss"); "," & _
                                Format(Tanggal1, "dd-MM-yyyy HH:mm:ss") & ",|" & Strings.Left(RS2!kodebmn, 10) & "|,|" & RS2!ID & "|," & RS2!QtyProduk; ",|" & _
                                RS2!satuanstandar & "|,|" & "RSABHK" & "|,|" & "RSABHK" & "|,|" & "K01" & "|,|" & _
                                RS2!harga; "," & RS2!harga * RS2!QtyProduk & ",|" & "1|"
        
    RS2.MoveNext
    Next

    
    'K01
    ReadRs3 "select pp.norec, pp.produkfk,pr.kodebmn,pr.namaproduk,pp.jumlah,kp.kelompokproduk, " & _
             "kt.kelompoktransaksi,pp.tglpelayanan, sp.nostruk, sp.tglstruk, ru.namaruangan, " & _
             "std.satuanstandar, sr.noresep, (pp.hargasatuan-pp.hargadiscount) as harga " & _
             "from  pelayananpasien_t as pp " & _
             "INNER JOIN strukresep_t as sr on sr.norec = pp.strukresepfk " & _
             "LEFT JOIN strukpelayanan_t as sp on sp.norec = pp.strukterimafk " & _
             "INNER JOIN kelompoktransaksi_m as kt on kt.id = pp.kdkelompoktransaksi " & _
             "INNER JOIN produk_m as pr on pr.id = pp.produkfk " & _
             "INNER JOIN detailjenisproduk_m as djp on djp.id = pr.objectdetailjenisprodukfk " & _
             "INNER JOIN jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk " & _
             "INNER JOIN kelompokproduk_m as kp on kp.id = jp.objectkelompokprodukfk " & _
             "INNER JOIN satuanstandar_m as std on std.id = pp.satuanviewfk " & _
             "LEFT JOIN ruangan_m as ru on ru.id = sr.ruanganfk " & _
             "where djp.id = 474 and pr.statusenabled = 't' " & _
             "and sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "'"
    'Print #LogFile, "|PENGELUARAN APOTEK|"
    RS3.MoveFirst
    
        For i = 0 To RS3.RecordCount - 1
        KodeSequence2 = Strings.Right(RS3!noresep, 5)
        Tanggal2 = RS3!tglpelayanan
        Print #LogFile, "|" & "024040100520611000KD" & "|,|" & RS3!namaproduk & "|,|" & "2018" & "|,|" & _
                            "024040100520611000KD" & "2018" & KodeSequence2 & "K" & "|," & Format(Tanggal2, "dd-MM-yyyy HH:mm:ss"); "," & _
                            Format(Tanggal2, "dd-MM-yyyy HH:mm:ss") & ",|" & Strings.Left(RS2!kodebmn, 10) & "|," & RS3!ProdukFk & "|," & RS3!jumlah; ",|" & _
                            RS3!satuanstandar & "|,|" & "RSABHK" & "|,|" & "RSABHK" & "|,|" & "K01" & "|,|" & _
                            RS3!harga; "," & RS3!harga * RS3!jumlah & ",|" & "1|"

    RS3.MoveNext
    Next
    'Print #LogFile, "|PENGELUARAN|"
    
'sql
Close #LogFile
Exit Sub
errLoad:
End Sub
