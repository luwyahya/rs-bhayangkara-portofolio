VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRCetakRekapRincianBiaya 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCRCetakRekapRincianBiaya.frx":0000
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
Attribute VB_Name = "frmCRCetakRekapRincianBiaya"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crRekapRincianBiaya
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "RincianBiayaPelayanan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRCetakRekapRincianBiaya = Nothing
End Sub

Public Sub Cetak(strNoregistrasi As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakRekapRincianBiaya = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim kamar As String
Dim kelas As String
strFilter = ""

Set Report = New crRekapRincianBiaya

    strSQL = " SELECT '-' AS norec_pp,* FROM (SELECT x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
             " x.namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah,SUM (x.total) AS total, " & _
             " '-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan, " & _
             " x.namauser,'RAWAT INAP' AS grouping " & _
             " FROM (SELECT tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,(tb.namarekanan +   case when jks.id is null then '' else jks.namaexternal end  )as namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen,USER AS namauser " & _
             " FROM temp_billing_t AS tb " & _
             " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
             " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk  LEFT JOIN  pasiendaftar_t as pd ON tb.noregistrasi = pd.noregistrasi" & _
             " left join  jaminankhusus_m as jks ON pd.objectjaminankhusus = jks.id WHERE tb.noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
             " AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
             " AND dp.id IN (16, 25) Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen,jks.namaexternal,jks.id) AS x " & _
             " GROUP BY x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm, " & _
             " x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
             " x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar, " & _
             " x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser,x.namaproduk"
    
    strSQL = strSQL & " UNION ALL SELECT x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
             " x.namadepartemen AS namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah, " & _
             " SUM (x.total) AS total,'-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan, " & _
             " x.totalppenjamin,x.totalbiayatambahan,x.namauser,'RAWAT JALAN' AS grouping " & _
             " FROM (SELECT tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,(tb.namarekanan +   case when jks.id is null then '' else jks.namaexternal end  )as namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen,USER AS namauser " & _
             " FROM temp_billing_t AS tb " & _
             " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
             " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk LEFT JOIN  pasiendaftar_t as pd  ON tb.noregistrasi = pd.noregistrasi" & _
             " left join  jaminankhusus_m as jks ON pd.objectjaminankhusus = jks.id WHERE tb.noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
             " AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
             " AND dp.id NOT IN (16, 25) Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen,jks.namaexternal,jks.id) AS x " & _
             " GROUP BY x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm, " & _
             " x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
             " x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar, " & _
             " x.totalprekanan , x.totalppenjamin, x.totalbiayatambahan, x.namauser"
             
    strSQL = strSQL & " UNION ALL SELECT x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
             " 'Pemakaian Obat & Alkes' AS namaproduk,'-' AS penulisresep,'-' AS jenisproduk, " & _
             " 0 AS jumlah,SUM (x.total) AS total,'-' AS namakamar,x.tipepasien,x.totalharusdibayar, " & _
             " x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser,'FARMASI' AS grouping " & _
             " FROM (SELECT tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,(tb.namarekanan +   case when jks.id is null then '' else jks.namaexternal end  )as namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,'Instalasi Farmasi' AS namadepartemen,USER AS namauser " & _
             " FROM temp_billing_t AS tb LEFT JOIN  pasiendaftar_t  as pd ON tb.noregistrasi = pd.noregistrasi" & _
             " left join  jaminankhusus_m as jks ON pd.objectjaminankhusus = jks.id WHERE tb.noregistrasi = '" & strNoregistrasi & "' AND tb.tglpelayanan IS NOT NULL " & _
             " AND tb.namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
             " AND tb.jenisprodukmaster = 'Jenis Barang Farmasi' Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,jks.namaexternal,jks.id) AS x " & _
             " GROUP BY x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.tipepasien, " & _
             " x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser, " & _
             " x.namakelaspd) AS t"
              
    'strSQL = "select nobilling,nocm,noregistrasi,nocm,namapasienjk,unit,objectdepartemenfk,namakelas,dokterpj,tglregistrasi, " & _
    '         "tglpulang,namarekanan,tglpelayanan,ruangantindakan,namaproduk,penulisresep,jenisproduk,dokter,jumlah, " & _
    '         "hargajual,diskon,total,namakamar,tipepasien,totalharusdibayar,totalprekanan,totalppenjamin,totalbiayatambahan,user, " & _
    '         "namakelaspd,hargajual_kelasasal,total_kelasasal,norec,norec_pp,tglstruk,(total-diskon) as totalsetelahdiskon " & _
    '         "from temp_billing_t where noregistrasi='" & strNoregistrasi & "' " & _
    '         "and tglpelayanan is not null and namaproduk not in ('Biaya Administrasi','Biaya Materai') order by tglpelayanan, namaproduk"
        
    ReadRs "select case when pa.nosep is null then '-' else pa.nosep end as sep, pd.objectkelompokpasienlastfk as KelompokPasien " & _
            "from pemakaianasuransi_t as pa " & _
            "left join pasiendaftar_t as pd on pd.norec=pa.noregistrasifk " & _
            "where pd.noregistrasi='" & strNoregistrasi & "' "
            
    ReadRs2 "select sum(hargajual) as totalDeposit from pasiendaftar_t pd " & _
            "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
            "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
            "where pd.noregistrasi='" & strNoregistrasi & "' and pp.produkfk=402611 "
    
'    ReadRs3 "select ppd.hargadiscount,ppd.hargajual,ppd.komponenhargafk from pasiendaftar_t pd " & _
'            "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
'            "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
'            "left JOIN pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec " & _
'            "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec " & _
'            "where pd.noregistrasi='" & strNoregistrasi & "' and pp.produkfk<>402611 and ppp.objectjenispetugaspefk=4 "
      
      'ReadRs3 "select ppd.hargadiscount,ppd.hargajual,ppd.komponenhargafk from pasiendaftar_t pd " & _
            "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
            "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
            "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec " & _
            "where pd.noregistrasi='" & strNoregistrasi & "' and pp.produkfk<>402611  "
            
    ReadRs3 "select sum(ppd.hargadiscount) as hargadiscount,ppd.komponenhargafk from pasiendaftar_t pd " & _
            "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
            "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
            "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec " & _
            "where pd.noregistrasi='" & strNoregistrasi & "' and pp.produkfk<>402611 group by ppd.komponenhargafk "
    ReadRs4 "select top 1 namakamar,namakelaspd from temp_billing_t where noregistrasi = '" & strNoregistrasi & "'"
    If RS4.EOF = False Then
        kamar = RS4!namakamar
        kelas = RS4!namakelaspd
    Else
        kamar = "-"
        kelas = "-"
    End If
                
    Dim TotalDiskonMedis  As Double
    Dim TotalDiskonUmum  As Double
    Dim i As Integer
    
    
    For i = 0 To RS3.RecordCount - 1
        If RS3!komponenhargafk = 35 Then TotalDiskonMedis = TotalDiskonMedis + CDbl(IIf(IsNull(RS3!hargadiscount), 0, RS3!hargadiscount))
        If RS3!komponenhargafk <> 35 Then TotalDiskonUmum = TotalDiskonUmum + CDbl(IIf(IsNull(RS3!hargadiscount), 0, RS3!hargadiscount))
        RS3.MoveNext
    Next
    
    Dim TotalDeposit As Double
    TotalDeposit = IIf(IsNull(RS2(0)), 0, RS2(0))
    
    
'    ReadRs2 "SELECT " & _
'            "sum((pp.jumlah*(pp.hargajual-case when pp.hargadiscount is null then 0 else pp.hargadiscount end))) as total " & _
'            "from pasiendaftar_t as pd " & _
'            "inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
'            "inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
'            "inner join produk_m as pr on pr.id=pp.produkfk " & _
'            "inner join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk " & _
'            "inner join jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk " & _
'            "inner join pasien_m as ps on ps.id=pd.nocmfk " & _
'            "inner join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
'            "inner join ruangan_m  as ru on ru.id=pd.objectruanganlastfk " & _
'            "inner join ruangan_m  as ru2 on ru2.id=apd.objectruanganfk " & _
'            "LEFT join kelas_m  as kl on kl.id=pd.objectkelasfk " & _
'            "inner join pegawai_m  as pg on pg.id=pd.objectpegawaifk " & _
'            "inner join pegawai_m  as pg2 on pg2.id=apd.objectpegawaifk " & _
'            "left join rekanan_m  as rk on rk.id=pd.objectrekananfk " & _
'            "where pd.noregistrasi='" & strNoregistrasi & "' "

   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasienjk}")
'            .usRuangan.SetUnboundFieldSource ("{ado.unit}")
'            .usKamar.SetUnboundFieldSource IIf(IsNull("{ado.namakamar}") = True, "-", ("{ado.namakamar}"))
            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
            .usDokterPJawab.SetUnboundFieldSource ("{ado.dokterpj}")
            .udTglMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .udTglPlng.SetUnboundFieldSource IIf(IsNull("{ado.tglpulang}") = True, "-", ("{ado.tglpulang}"))
            .usPenjamin.SetUnboundFieldSource IIf(IsNull("{ado.namarekanan}") = True, ("-"), ("{ado.namarekanan}"))
            .usTipe.SetUnboundFieldSource ("{ado.tipepasien}")
'            .usNomor.SetUnboundFieldSource ("{ado.nomor}")
            .usNorecpp.SetUnboundFieldSource ("{ado.norec_pp}")
            .usPenulisResep.SetUnboundFieldSource ("{ado.penulisresep}")
            .usLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
'            .usKelas.SetUnboundFieldSource ("{ado.namakelaspd}")
            .unQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usJmlQty.SetUnboundFieldSource ("{ado.jumlah}")
            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            .usRuanganTindakan.SetUnboundFieldSource ("{ado.grouping}")
            .usNoStruk.SetUnboundFieldSource ("{ado.nobilling}")
            .txtKamar.SetText kamar
            .txtKls.SetText kelas
'            .usJenisProduk.SetUnboundFieldSource ("{ado.jenisproduk}")
'            .udTanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
'            .usTglPelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}"
'            .usDokter.SetUnboundFieldSource ("{ado.dokter}")
'            .ucTarif.SetUnboundFieldSource ("{ado.hargajual}")
'            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
'            .ucDepartemen.SetUnboundFieldSource ("{ado.objectdepartemenfk}")
'            .ucAdministrasi.SetUnboundFieldSource ("0") '("{ado.administrasi}")
'            .ucMaterai.SetUnboundFieldSource ("0") '("{ado.materai}")

            If strNoStruk = "TOTALTOTALTOTAL" Then
                TotalDeposit = 0
                .Section11.Suppress = True
            Else
                .Section11.Suppress = False
            End If
            
            If rs.EOF = False Then
                If rs!kelompokpasien = 2 Or rs!kelompokpasien = 4 Then
                    .txtNoSep.SetText rs!sep
                Else
                    .txtNoSep.Suppress = True
                    .txtLblSep.Suppress = True
                    .txtLblSep2.Suppress = True
                End If
            Else
                .txtNoSep.Suppress = True
                .txtLblSep.Suppress = True
                .txtLblSep2.Suppress = True
            End If
            
            .ucDeposit.SetUnboundFieldSource (TotalDeposit) '("{ado.deposit}")
            '.ucDeposit.SetUnboundFieldSource 0 '(TotalDeposit) '("{ado.deposit}")
            .ucDiskonJasaMedis.SetUnboundFieldSource (TotalDiskonMedis)
            .ucDiskonUmum.SetUnboundFieldSource (TotalDiskonUmum) '("{ado.diskonumum}")
'            .ucSisaDeposit.SetUnboundFieldSource ("0")
            .ucDitanggungPerusahaan.SetUnboundFieldSource ("{ado.totalprekanan}")
            .ucDitanggungRS.SetUnboundFieldSource ("0") '("{ado.totalharusdibayarrs}")
            .ucDitanggungSendiri.SetUnboundFieldSource ("{ado.totalharusdibayar}")
'            .ucDitanggungSendiri.SetUnboundFieldSource ("{ado.totalharusdibayar}")
            .ucSurplusMinusRS.SetUnboundFieldSource ("0") '("{ado.SurplusMinusRS}")
            .usUser.SetUnboundFieldSource ("{ado.namauser}")
            
            .txtVersi.SetText App.Comments
            
            
            
'            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
'            If RS2.BOF Then
'                .txtUser.SetText "-"
'            Else
'                .txtUser.SetText UCase(IIf(isnull(RS2("namalengkap")), "-", RS2("namalengkap")))
'            End If
            .txtUser.SetText UCase(strIdPegawai)
            
        ReadRs2 "select 'Piutang' as jenis, sp.nostruk ,rk.namarekanan,sp.tglstruk,sppd.totalppenjamin " & _
                               "from pasiendaftar_t as pd " & _
                               "INNER JOIN strukpelayanan_t as sp on sp.noregistrasifk=pd.norec and sp.statusenabled is NULL " & _
                               "INNER JOIN strukpelayananpenjamindetail_t as sppd on sppd.nostrukfk=sp.norec " & _
                               "INNER JOIN rekanan_m as rk on rk.id=sppd.kdrekananpenjamin " & _
                               "where pd.noregistrasi='" & strNoregistrasi & "';"
        If RS2.RecordCount <> 0 Then
            Report.Subreport1.Suppress = False
            Dim adojenis As New ADODB.Command
            Set adojenis = New ADODB.Command
            adojenis.CommandText = "select 'Piutang' as jenis, sp.nostruk ,rk.namarekanan,sp.tglstruk,sppd.totalppenjamin " & _
                                   "from pasiendaftar_t as pd " & _
                                   "INNER JOIN strukpelayanan_t as sp on sp.noregistrasifk=pd.norec and sp.statusenabled is NULL " & _
                                   "INNER JOIN strukpelayananpenjamindetail_t as sppd on sppd.nostrukfk=sp.norec " & _
                                   "INNER JOIN rekanan_m as rk on rk.id=sppd.kdrekananpenjamin " & _
                                   "where pd.noregistrasi='" & strNoregistrasi & "';"
    
            adojenis.CommandType = adCmdText
            'Report.Subreport1.OpenSubreport.database.AddADOCommand dbConn, adojenis
            Report.Subreport1.OpenSubreport.database.AddADOCommand CN_String, adojenis
            
    
            With Report
                .Subreport1_usJenis.SetUnboundFieldSource ("{ado.jenis}")
                .Subreport1_usNoStruk.SetUnboundFieldSource ("{ado.nostruk}")
                .Subreport1_usDesk.SetUnboundFieldSource ("{ado.namarekanan}")
                .Subreport1_udTgl.SetUnboundFieldSource ("{ado.tglstruk}")
                .Subreport1_ucJumlah.SetUnboundFieldSource ("{ado.totalppenjamin}")
            End With
        Else
            Report.Subreport1.Suppress = True
        End If
        CRViewer1.ReportSource = Report
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "RincianBiayaRekap")
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
End Sub
Public Sub Cetakv2(strNoregistrasi As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, tipe As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakRekapRincianBiaya = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim kamar As String
Dim kelas As String
strFilter = ""

Set Report = New crRekapRincianBiaya
    If tipe = "semua" Then
        
        strSQL = " SELECT '-' AS norec_pp,* FROM (SELECT x.dokter, x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
                 " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
                 " x.namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah,SUM (x.total) AS total, " & _
                 " '-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan, " & _
                 " x.namauser,'RAWAT INAP' AS grouping " & _
                 " FROM (SELECT tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
                 " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
                 " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
                 " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,case when tb.totalharusdibayar is null then 0 else tb.totalharusdibayar end as totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
                 " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
                 " tb.total_kelasasal,dp.namadepartemen,USER AS namauser ,tb.dokter " & _
                 " FROM temp_billing_t AS tb " & _
                 " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
                 " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk " & _
                 " WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
                 " AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
                 " AND dp.id IN (16) ) AS x " & _
                 " GROUP BY x.dokter, x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm, " & _
                 " x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
                 " x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar, " & _
                 " x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser,x.namaproduk"
        
        strSQL = strSQL & " UNION ALL SELECT x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
                 " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
                 " x.namadepartemen AS namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah, " & _
                 " SUM (x.total) AS total,'-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan, " & _
                 " x.totalppenjamin,x.totalbiayatambahan,x.namauser,'RAWAT JALAN' AS grouping " & _
                 " FROM (SELECT tb.dokter, tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
                 " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
                 " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
                 " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,case when tb.totalharusdibayar is null then 0 else tb.totalharusdibayar end as totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
                 " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
                 " tb.total_kelasasal,dp.namadepartemen,USER AS namauser " & _
                 " FROM temp_billing_t AS tb " & _
                 " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
                 " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk " & _
                 " WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
                 " AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
                 " AND dp.id NOT IN (16, 25 ,27,3) Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
                 " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
                 " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
                 " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
                 " tb.total_kelasasal,dp.namadepartemen,tb.dokter,norec_pp) AS x " & _
                 " GROUP BY x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm, " & _
                 " x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
                 " x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar, " & _
                 " x.totalprekanan , x.totalppenjamin, x.totalbiayatambahan, x.namauser"
        
        strSQL = strSQL & " UNION ALL SELECT x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
                 " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
                 " x.namadepartemen AS namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah, " & _
                 " SUM(x.total)   AS total,'-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan, " & _
                 " x.totalppenjamin,x.totalbiayatambahan,x.namauser,'PENUNJANG' AS grouping " & _
                 " FROM (SELECT tb.dokter, tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
                 " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
                 " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
                 " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,case when tb.totalharusdibayar is null then 0 else tb.totalharusdibayar end as totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
                 " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
                 " tb.total_kelasasal,dp.namadepartemen,USER AS namauser " & _
                 " FROM temp_billing_t AS tb " & _
                 " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
                 " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk " & _
                 " WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
                 " AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
                 " AND dp.id in (27,3,25) Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
                 " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
                 " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
                 " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
                 " tb.total_kelasasal,dp.namadepartemen,tb.dokter) AS x " & _
                 " GROUP BY x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm, " & _
                 " x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
                 " x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar, " & _
                 " x.totalprekanan , x.totalppenjamin, x.totalbiayatambahan, x.namauser"
                                 
        strSQL = strSQL & " UNION ALL SELECT x.dokter, x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
                 " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
                 " 'Pemakaian Obat & Alkes' AS namaproduk,'-' AS penulisresep,'-' AS jenisproduk, " & _
                 " SUM (round(x.jumlah,0)) as jumlah,SUM (x.total) AS total,'-' AS namakamar,x.tipepasien,x.totalharusdibayar, " & _
                 " x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser,'FARMASI' AS grouping " & _
                 " FROM (SELECT tb.dokter,tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
                 " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
                 " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
                 " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,case when tb.totalharusdibayar is null then 0 else tb.totalharusdibayar end as totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
                 " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
                 " tb.total_kelasasal,'Instalasi Farmasi' AS namadepartemen,USER AS namauser " & _
                 " FROM temp_billing_t AS tb " & _
                 " WHERE tb.noregistrasi = '" & strNoregistrasi & "' AND tb.tglpelayanan IS NOT NULL " & _
                 " AND tb.namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
                 " AND tb.jenisprodukmaster = 'Jenis Barang Farmasi' Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
                 " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
                 " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
                 " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
                 " tb.total_kelasasal,tb.dokter) AS x " & _
                 " GROUP BY x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
                 " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.tipepasien, " & _
                 " x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser, " & _
                 " x.namakelaspd) AS t"
ElseIf tipe = "belum" Then
    strSQL = " SELECT '-' AS norec_pp,* FROM (SELECT x.dokter, x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
             " x.namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah,SUM (x.total) AS total, " & _
             " '-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan, " & _
             " x.namauser,'RAWAT INAP' AS grouping " & _
             " FROM (SELECT tb.dokter,tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,case when tb.totalharusdibayar is null then 0 else tb.totalharusdibayar end as totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen,USER AS namauser " & _
             " FROM temp_billing_t AS tb " & _
             " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
             " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk " & _
             " WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
             " AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
             " AND dp.id IN (16) Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen,tb.dokter) AS x " & _
             " where x.nokwitansi is null GROUP BY x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm, " & _
             " x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
             " x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar, " & _
             " x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser,x.namaproduk"
    
    strSQL = strSQL & " UNION ALL SELECT x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
             " x.namadepartemen AS namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah, " & _
             " SUM (x.total) AS total,'-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan, " & _
             " x.totalppenjamin,x.totalbiayatambahan,x.namauser,'RAWAT JALAN' AS grouping " & _
             " FROM (SELECT tb.dokter,tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,case when tb.totalharusdibayar is null then 0 else tb.totalharusdibayar end as totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen,USER AS namauser " & _
             " FROM temp_billing_t AS tb " & _
             " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
             " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk " & _
             " WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
             " AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
             " AND dp.id NOT IN (16, 25,27,3) Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen ,tb.dokter,norec_pp) AS x " & _
             " where x.nokwitansi is null GROUP BY x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm, " & _
             " x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
             " x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar, " & _
             " x.totalprekanan , x.totalppenjamin, x.totalbiayatambahan, x.namauser"
             
    strSQL = strSQL & " UNION ALL SELECT x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
             " x.namadepartemen AS namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah, " & _
             " SUM (x.total) AS total,'-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan, " & _
             " x.totalppenjamin,x.totalbiayatambahan,x.namauser,'PENUNJANG' AS grouping " & _
             " FROM (SELECT tb.dokter,tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,case when tb.totalharusdibayar is null then 0 else tb.totalharusdibayar end as totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen,USER AS namauser " & _
             " FROM temp_billing_t AS tb " & _
             " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
             " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk " & _
             " WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
             " AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
             " AND dp.id in (27,3,25) Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen ,tb.dokter) AS x " & _
             " where x.nokwitansi is null GROUP BY x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm, " & _
             " x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
             " x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar, " & _
             " x.totalprekanan , x.totalppenjamin, x.totalbiayatambahan, x.namauser"
             
    strSQL = strSQL & " UNION ALL SELECT x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
             " 'Pemakaian Obat & Alkes' AS namaproduk,'-' AS penulisresep,'-' AS jenisproduk, " & _
             " SUM (round(x.jumlah,0)),SUM (x.total) AS total,'-' AS namakamar,x.tipepasien,x.totalharusdibayar, " & _
             " x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser,'FARMASI' AS grouping " & _
             " FROM (SELECT tb.dokter,tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,case when tb.totalharusdibayar is null then 0 else tb.totalharusdibayar end as totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,'Instalasi Farmasi' AS namadepartemen,USER AS namauser " & _
             " FROM temp_billing_t AS tb " & _
             " WHERE tb.noregistrasi = '" & strNoregistrasi & "' AND tb.tglpelayanan IS NOT NULL " & _
             " AND tb.namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
             " AND tb.jenisprodukmaster = 'Jenis Barang Farmasi' Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,tb.dokter) AS x " & _
             " where x.nokwitansi is null  GROUP BY x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.tipepasien, " & _
             " x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser, " & _
             " x.namakelaspd) AS t"
ElseIf tipe = "sudah" Then
strSQL = " SELECT '-' AS norec_pp,* FROM (SELECT x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
             " x.namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah,SUM (x.total) AS total, " & _
             " '-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan, " & _
             " x.namauser,'RAWAT INAP' AS grouping " & _
             " FROM (SELECT tb.dokter,tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,case when tb.totalharusdibayar is null then 0 else tb.totalharusdibayar end as totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen,USER AS namauser " & _
             " FROM temp_billing_t AS tb " & _
             " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
             " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk " & _
             " WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
             " AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
             " AND dp.id IN (16) Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen,tb.dokter) AS x " & _
             " where x.tglstruk is not null GROUP BY x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm, " & _
             " x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
             " x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar, " & _
             " x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser,x.namaproduk"
    
    strSQL = strSQL & " UNION ALL SELECT x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
             " x.namadepartemen AS namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah, " & _
             " SUM (x.total) AS total,'-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan, " & _
             " x.totalppenjamin,x.totalbiayatambahan,x.namauser,'RAWAT JALAN' AS grouping " & _
             " FROM (SELECT tb.dokter,tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,case when tb.totalharusdibayar is null then 0 else tb.totalharusdibayar end as totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen,USER AS namauser " & _
             " FROM temp_billing_t AS tb " & _
             " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
             " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk " & _
             " WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
             " AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
             " AND dp.id NOT IN (16, 25,27,3) Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen,tb.dokter,norec_pp) AS x " & _
             " where x.tglstruk is not null GROUP BY x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm, " & _
             " x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
             " x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar, " & _
             " x.totalprekanan , x.totalppenjamin, x.totalbiayatambahan, x.namauser"
    strSQL = strSQL & " UNION ALL SELECT x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
             " x.namadepartemen AS namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah, " & _
             " SUM (x.total) AS total,'-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan, " & _
             " x.totalppenjamin,x.totalbiayatambahan,x.namauser,'PENUNJANG' AS grouping " & _
             " FROM (SELECT tb.dokter,tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,case when tb.totalharusdibayar is null then 0 else tb.totalharusdibayar end as totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen,USER AS namauser " & _
             " FROM temp_billing_t AS tb " & _
             " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
             " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk " & _
             " WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
             " AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
             " AND dp.id in (27,3,25) Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,dp.namadepartemen,tb.dokter) AS x " & _
             " where x.tglstruk is not null GROUP BY x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm, " & _
             " x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
             " x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar, " & _
             " x.totalprekanan , x.totalppenjamin, x.totalbiayatambahan, x.namauser"
             
    strSQL = strSQL & " UNION ALL SELECT x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
             " 'Pemakaian Obat & Alkes' AS namaproduk,'-' AS penulisresep,'-' AS jenisproduk, " & _
             " SUM (round(x.jumlah,0)) as jumlah,SUM (x.total) AS total,'-' AS namakamar,x.tipepasien,x.totalharusdibayar, " & _
             " x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser,'FARMASI' AS grouping " & _
             " FROM (SELECT tb.dokter,tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,case when tb.totalharusdibayar is null then 0 else tb.totalharusdibayar end as totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,'Instalasi Farmasi' AS namadepartemen,USER AS namauser " & _
             " FROM temp_billing_t AS tb " & _
             " WHERE tb.noregistrasi = '" & strNoregistrasi & "' AND tb.tglpelayanan IS NOT NULL " & _
             " AND tb.namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
             " AND tb.jenisprodukmaster = 'Jenis Barang Farmasi' Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
             " tb.totalbiayatambahan,tb.[user],tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
             " tb.total_kelasasal,tb.dokter) AS x " & _
             " where x.tglstruk is not null GROUP BY x.dokter,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.tipepasien, " & _
             " x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser, " & _
             " x.namakelaspd) AS t"
End If

        
    ReadRs "select case when pa.nosep is null then '-' else pa.nosep end as sep, pd.objectkelompokpasienlastfk as KelompokPasien " & _
            "from pemakaianasuransi_t as pa " & _
            "left join pasiendaftar_t as pd on pd.norec=pa.noregistrasifk " & _
            "where pd.noregistrasi='" & strNoregistrasi & "' "
    
    ReadRs2 "select sum(hargajual) as totalDeposit from pasiendaftar_t pd " & _
            "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
            "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
            "where pd.noregistrasi='" & strNoregistrasi & "' and pp.produkfk=402611 "
    
    ReadRs3 "select sum(ppd.hargadiscount) as hargadiscount,ppd.komponenhargafk from pasiendaftar_t pd " & _
            "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
            "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
            "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec " & _
            "where pd.noregistrasi='" & strNoregistrasi & "' and pp.produkfk<>402611 group by ppd.komponenhargafk "
    
    ReadRs4 "select top 1 namakamar,namakelaspd,nama_kelasasal,tipepasien from temp_billing_t where noregistrasi = '" & strNoregistrasi & "'"
    
    ReadRs5 "SELECT sum(strukpelayanan_t.totalharusdibayar) FROM strukpelayanan_t INNER JOIN strukbuktipenerimaan_t ON strukpelayanan_t.nosbmlastfk = strukbuktipenerimaan_t.norec INNER JOIN pasiendaftar_t ON strukpelayanan_t.noregistrasifk = pasiendaftar_t.norec " & _
    " where noregistrasi= '" & strNoregistrasi & "' "
    If RS4.EOF = False Then
        If RS4!tipepasien = "BPJS" Or RS4!tipepasien = "KEMENKES RI" Then
            kamar = RS4!namakamar
            kelas = IIf(IsNull(RS4!nama_kelasasal) = True, "-", RS4!nama_kelasasal)
        Else
            kamar = RS4!namakamar
            kelas = RS4!namakelaspd
        End If
    Else
        kamar = "-"
        kelas = "-"
    End If
    Dim namaruangan As String
    ReadRs6 "SELECT pd.noregistrasi, kmr.namakamar,ru.namaruangan " & _
            "FROM pasiendaftar_t AS pd INNER JOIN " & _
            "antrianpasiendiperiksa_t AS apd ON pd.norec = apd.noregistrasifk AND pd.objectruanganlastfk = apd.objectruanganfk INNER JOIN " & _
            "ruangan_m AS ru ON ru.id = pd.objectruanganlastfk LEFT OUTER JOIN " & _
            "kamar_m AS kmr ON kmr.id = apd.objectkamarfk where noregistrasi = '" & strNoregistrasi & "'"
    If RS6.EOF = False Then
        kamar = IIf(IsNull(RS6!namakamar) = True, "-", RS6!namakamar)
        namaruangan = IIf(IsNull(RS6!namaruangan) = True, "-", RS6!namaruangan)
    Else
        kamar = "-"
        namaruangan = "-"
    End If
                
    Dim TotalDiskonMedis  As Double
    Dim TotalDiskonUmum  As Double
    Dim i As Integer
    
    
    For i = 0 To RS3.RecordCount - 1
        If RS3!komponenhargafk = 35 Then TotalDiskonMedis = TotalDiskonMedis + CDbl(IIf(IsNull(RS3!hargadiscount), 0, RS3!hargadiscount))
        If RS3!komponenhargafk <> 35 Then TotalDiskonUmum = TotalDiskonUmum + CDbl(IIf(IsNull(RS3!hargadiscount), 0, RS3!hargadiscount))
        RS3.MoveNext
    Next
    
    Dim TotalDeposit As Double
    TotalDeposit = IIf(IsNull(RS2(0)), 0, RS2(0))
   
    
'    ReadRs2 "SELECT " & _
'            "sum((pp.jumlah*(pp.hargajual-case when pp.hargadiscount is null then 0 else pp.hargadiscount end))) as total " & _
'            "from pasiendaftar_t as pd " & _
'            "inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
'            "inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
'            "inner join produk_m as pr on pr.id=pp.produkfk " & _
'            "inner join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk " & _
'            "inner join jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk " & _
'            "inner join pasien_m as ps on ps.id=pd.nocmfk " & _
'            "inner join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
'            "inner join ruangan_m  as ru on ru.id=pd.objectruanganlastfk " & _
'            "inner join ruangan_m  as ru2 on ru2.id=apd.objectruanganfk " & _
'            "LEFT join kelas_m  as kl on kl.id=pd.objectkelasfk " & _
'            "inner join pegawai_m  as pg on pg.id=pd.objectpegawaifk " & _
'            "inner join pegawai_m  as pg2 on pg2.id=apd.objectpegawaifk " & _
'            "left join rekanan_m  as rk on rk.id=pd.objectrekananfk " & _
'            "where pd.noregistrasi='" & strNoregistrasi & "' "

   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
         ReadRs7 "SELECT        ruangan_m.namaruangan, antrianpasiendiperiksa_t.tglmasuk, antrianpasiendiperiksa_t.tglkeluar, pasiendaftar_t.noregistrasi " & _
                " FROM            antrianpasiendiperiksa_t INNER JOIN  " & _
                "                         pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec INNER JOIN  " & _
                "                         ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id where ruangan_m.objectdepartemenfk in (16) and  pasiendaftar_t.noregistrasi= '" & strNoregistrasi & "' and antrianpasiendiperiksa_t.statusenabled=1 order by antrianpasiendiperiksa_t.tglmasuk "
        If RS7.EOF = False Then
            Dim m As Integer
            Dim isi As String
            isi = ""
            For m = 0 To RS7.RecordCount - 1
                 
                 isi = isi + "Ruangan  : " & RS7("namaruangan").Value & "    Tgl.masuk  :" & RS7("tglmasuk").Value & " \  Tgl.keluar  :" & RS7("tglkeluar").Value & vbCrLf & vbCrLf
            RS7.MoveNext
            Next m
            
            
            
             .tInfoRegis.SetText isi
        End If
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasienjk}")
'            .usRuangan.SetUnboundFieldSource ("{ado.unit}")
'            .usKamar.SetUnboundFieldSource IIf(IsNull("{ado.namakamar}") = True, "-", ("{ado.namakamar}"))
            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
            .usDokterPJawab.SetUnboundFieldSource ("{ado.dokterpj}")
            .udTglMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .udTglPlng.SetUnboundFieldSource IIf(IsNull("{ado.tglpulang}") = True, "-", ("{ado.tglpulang}"))
            .usPenjamin.SetUnboundFieldSource IIf(IsNull("{ado.namarekanan}") = True, ("-"), ("{ado.namarekanan}"))
            .usTipe.SetUnboundFieldSource ("{ado.tipepasien}")
'            .usNomor.SetUnboundFieldSource ("{ado.nomor}")
            .usNorecpp.SetUnboundFieldSource ("{ado.norec_pp}")
            .usPenulisResep.SetUnboundFieldSource ("{ado.penulisresep}")
            .usLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
'            .usKelas.SetUnboundFieldSource ("{ado.namakelaspd}")
            .unQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usJmlQty.SetUnboundFieldSource ("{ado.jumlah}")
            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            .usRuanganTindakan.SetUnboundFieldSource ("{ado.grouping}")
            .usNoStruk.SetUnboundFieldSource ("{ado.nobilling}")
            .undokter.SetUnboundFieldSource ("{ado.dokter}")
            .txtKamar.SetText kamar
            .txtKls.SetText kelas
            .txtNamaRuangan.SetText namaruangan
'            .usJenisProduk.SetUnboundFieldSource ("{ado.jenisproduk}")
'            .udTanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
'            .usTglPelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}"
'            .usDokter.SetUnboundFieldSource ("{ado.dokter}")
'            .ucTarif.SetUnboundFieldSource ("{ado.hargajual}")
'            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
'            .ucDepartemen.SetUnboundFieldSource ("{ado.objectdepartemenfk}")
'            .ucAdministrasi.SetUnboundFieldSource ("0") '("{ado.administrasi}")
'            .ucMaterai.SetUnboundFieldSource ("0") '("{ado.materai}")

            If strNoStruk = "TOTALTOTALTOTAL" Then
                TotalDeposit = 0
                .Section11.Suppress = True
            Else
                .Section11.Suppress = False
            End If

            If rs.EOF = False Then
                If rs!kelompokpasien = 2 Or rs!kelompokpasien = 4 Then
                    .txtNoSep.SetText rs!sep
                Else
                    .txtNoSep.Suppress = True
                    .txtLblSep.Suppress = True
                    .txtLblSep2.Suppress = True
                End If
            Else
                .txtNoSep.Suppress = True
                .txtLblSep.Suppress = True
                .txtLblSep2.Suppress = True
            End If
            If tipe = "sudah" Then
                .ucDeposit.SetUnboundFieldSource (0) '("{ado.deposit}")
            Else
                .ucDeposit.SetUnboundFieldSource (TotalDeposit) '("{ado.deposit}")
            End If

            '.ucDeposit.SetUnboundFieldSource 0 '(TotalDeposit) '("{ado.deposit}")
            .ucDiskonJasaMedis.SetUnboundFieldSource (TotalDiskonMedis)
            .ucDiskonUmum.SetUnboundFieldSource (TotalDiskonUmum) '("{ado.diskonumum}")
'            .ucSisaDeposit.SetUnboundFieldSource ("0")
            .ucDitanggungPerusahaan.SetUnboundFieldSource ("{ado.totalprekanan}")
            .ucDitanggungRS.SetUnboundFieldSource ("0") '("{ado.totalharusdibayarrs}")
            'diubah 16-01-2021
            .ucDitanggungSendiri.SetUnboundFieldSource ("{ado.totalharusdibayar}")
            If tipe = "belum" Then
                .ucDitanggungSendiri.SetUnboundFieldSource (0)
                .UnboundCurrency1.SetUnboundFieldSource (0)
            Else
                Dim totalsudahdibayar As Double
                totalsudahdibayar = IIf(IsNull(RS5(0)), 0, RS5(0))
'                .ucDitanggungSendiri.SetUnboundFieldSource (totalsudahdibayar)
'                .UnboundCurrency1.SetUnboundFieldSource (totalsudahdibayar)
            End If


            '===========
'            .ucDitanggungSendiri.SetUnboundFieldSource ("{ado.totalharusdibayar}")
            .ucSurplusMinusRS.SetUnboundFieldSource ("0") '("{ado.SurplusMinusRS}")
            .usUser.SetUnboundFieldSource ("{ado.namauser}")

            .txtVersi.SetText App.Comments



'            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
'            If RS2.BOF Then
'                .txtUser.SetText "-"
'            Else
'                .txtUser.SetText UCase(IIf(isnull(RS2("namalengkap")), "-", RS2("namalengkap")))
'            End If
            .txtUser.SetText UCase(strIdPegawai)

        ReadRs2 "select 'Piutang' as jenis, sp.nostruk ,rk.namarekanan,sp.tglstruk,sppd.totalppenjamin " & _
                               "from pasiendaftar_t as pd " & _
                               "INNER JOIN strukpelayanan_t as sp on sp.noregistrasifk=pd.norec and sp.statusenabled is NULL " & _
                               "INNER JOIN strukpelayananpenjamindetail_t as sppd on sppd.nostrukfk=sp.norec " & _
                               "INNER JOIN rekanan_m as rk on rk.id=sppd.kdrekananpenjamin " & _
                               "where pd.noregistrasi='" & strNoregistrasi & "';"
        If RS2.RecordCount <> 0 Then
            Report.Subreport1.Suppress = False
            Dim adojenis As New ADODB.Command
            Set adojenis = New ADODB.Command
            adojenis.CommandText = "select 'Piutang' as jenis, sp.nostruk ,rk.namarekanan,sp.tglstruk,sppd.totalppenjamin " & _
                                   "from pasiendaftar_t as pd " & _
                                   "INNER JOIN strukpelayanan_t as sp on sp.noregistrasifk=pd.norec and sp.statusenabled is NULL " & _
                                   "INNER JOIN strukpelayananpenjamindetail_t as sppd on sppd.nostrukfk=sp.norec " & _
                                   "INNER JOIN rekanan_m as rk on rk.id=sppd.kdrekananpenjamin " & _
                                   "where pd.noregistrasi='" & strNoregistrasi & "';"

            adojenis.CommandType = adCmdText
            'Report.Subreport1.OpenSubreport.database.AddADOCommand dbConn, adojenis
            Report.Subreport1.OpenSubreport.database.AddADOCommand CN_String, adojenis


            With Report
                .Subreport1_usJenis.SetUnboundFieldSource ("{ado.jenis}")
                .Subreport1_usNoStruk.SetUnboundFieldSource ("{ado.nostruk}")
                .Subreport1_usDesk.SetUnboundFieldSource ("{ado.namarekanan}")
                .Subreport1_udTgl.SetUnboundFieldSource ("{ado.tglstruk}")
                .Subreport1_ucJumlah.SetUnboundFieldSource ("{ado.totalppenjamin}")
            End With
        Else
            Report.Subreport1.Suppress = True
        End If
        CRViewer1.ReportSource = Report
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "RincianBiayaRekap")
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
End Sub
