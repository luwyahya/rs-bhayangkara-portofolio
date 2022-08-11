VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRCetakRincianBiayaObat 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCRCetakRincianBiayaObat.frx":0000
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
Attribute VB_Name = "frmCRCetakRincianBiayaObat"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crRincianBiayaObatall1
Dim Report1 As New crRincianBiayaObatRevisi
'Dim bolSuppresDetailSection10 As Boolean
'Dim ii As Integer
'Dim tempPrint1 As String
'Dim p As Printer
'Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String

Dim statusPrint As String

Private Sub cmdCetak_Click()
If statusPrint = "A" Then
    Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    Report.PrintOut False
Else
 Report1.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    Report1.PrintOut False
End If
End Sub

Private Sub CmdOption_Click()
   If statusPrint = "A" Then
    Report.PrinterSetup Me.hwnd
    CRViewer1.Refresh
   Else
     Report1.PrinterSetup Me.hwnd
    CRViewer1.Refresh
   
   End If
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
    Set frmCRCetakRincianBiayaObat = Nothing
End Sub

Public Sub CetakRincianBiayaObatTap(strNoregistrasi As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakRincianBiayaObat = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
strFilter = ""
    
Set Report = New crRincianBiayaObatall1
    strSQL = "SELECT   CAST(tglpelayanan AS date) AS tglpelayanan, x.norec_pp,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit,x.objectdepartemenfk,x.dokterpj, " & _
             "x.tglregistrasi,x.tglpulang,x.namarekanan,x.ruangan AS ruangantindakan,SUBSTRING(x.namaproduk, 5, 255) as namaproduk,'-' as penulisresep,'-' as jenisproduk,x.dokter, " & _
             "SUM(x.jumlah) as jumlah,x.hargajual,SUM (x.total) AS total,x.namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser,x.namakelaspd " & _
             "FROM(SELECT *,USER AS namauser,SUBSTRING (ruangantindakan, 1, 10) AS ruangan FROM temp_billing_t  WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
             "AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') AND penulisresep IS NOT NULL) AS x " & _
             "Group By  x.tglpelayanan,x.norec_pp,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit,x.objectdepartemenfk, " & _
             "x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.ruangan,x.dokter,x.namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan, " & _
             "x.totalppenjamin,x.totalbiayatambahan,x.namauser,x.hargajual,x.namaproduk,x.namakelaspd"
    strSQL = strSQL & " union all select  CAST(a.tglpelayanan AS date) AS tglpelayanan, '-' as norec_pp , NULL as tglstruk ,'-' as nobiling, '-' as nokwitansi,b.noregistrasi as noregistrasi, ps.nocm as nocm,ps.namapasien as namapasienjk,'-' as unit,'-' as objectdepartemenfk,'-' as dokterpj, b.tglregistrasi, b.tglpulang,case when b.objectrekananfk is null then 'Umum' else rk.namarekanan end as namarekanan, '-' as ruangantindakan, SUBSTRING(pr.namaproduk, 5, 255) AS namaproduk, '-' AS penulisresep, '-' AS jenisproduk, '' as dokter, SUM(a.qty) AS jumlah, a.harga, SUM(a.qty* a.harga) AS total, '-' as namakamar, '' as tipepasien, " & _
                      " 0 as totalharusdibayar,0 as  totalprekanan,0 as  totalppenjamin, 0 as  totalbiayatambahan,'' as namauser,'' as namakelaspd FROM pelayananobattap_t as a INNER JOIN produk_m as pr ON a.objectprodukfk = pr.id INNER JOIN pasiendaftar_t as b ON a.noregistrasi = b.noregistrasi INNER JOIN pasien_m as ps ON b.nocmfk = ps.id LEFT OUTER JOIN rekanan_m AS rk ON b.objectrekananfk = rk.id" & _
                      " where a.noregistrasi = '" & strNoregistrasi & "' " & _
                      " group by a.tglpelayanan,b.tglregistrasi,b.tglpulang,pr.namaproduk,a.harga,b.noregistrasi, ps.nocm, ps.namapasien, b.objectrekananfk, rk.namarekanan"

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
      
      ReadRs3 "select     sum(ppd.hargadiscount) as hargadiscount,ppd.komponenhargafk from pasiendaftar_t pd " & _
              "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
              "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
              "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec " & _
              "where pd.noregistrasi='" & strNoregistrasi & "' and pp.produkfk<>402611 group by ppd.komponenhargafk "
    
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
            .usRuangan.SetUnboundFieldSource ("{ado.unit}")
            .usKamar.SetUnboundFieldSource IIf(IsNull("{ado.namakamar}") = True, "-", ("{ado.namakamar}"))
            .usDokterPJawab.SetUnboundFieldSource ("{ado.dokterpj}")
            .udTglMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .udTglPlng.SetUnboundFieldSource IIf(IsNull("{ado.tglpulang}") = True, "-", ("{ado.tglpulang}"))
            .usPenjamin.SetUnboundFieldSource IIf(IsNull("{ado.namarekanan}") = True, ("-"), ("{ado.namarekanan}"))
            .usTipe.SetUnboundFieldSource ("{ado.tipepasien}")
            .usLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .unQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usJmlQty.SetUnboundFieldSource ("{ado.jumlah}")
            .ucHargaSatuan.SetUnboundFieldSource ("{ado.hargajual}")
            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            .usRuanganTindakan.SetUnboundFieldSource ("{ado.ruangantindakan}")
            .usNoStruk.SetUnboundFieldSource ("{ado.nobilling}")
            .ucDepartemen.SetUnboundFieldSource ("{ado.objectdepartemenfk}")
            .usNorecpp.SetUnboundFieldSource ("{ado.norec_pp}")
            .usPenulisResep.SetUnboundFieldSource ("{ado.penulisresep}")
            .untglpelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .untglpelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
            
'            .ucTarif.SetUnboundFieldSource ("{ado.hargajual}")
'            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
'            .usKelas.SetUnboundFieldSource ("{ado.namakelas}")
'            .usDokter.SetUnboundFieldSource ("{ado.dokter}")
'            .usNomor.SetUnboundFieldSource ("{ado.nomor}")
'            .usJenisProduk.SetUnboundFieldSource ("{ado.jenisproduk}")
'            .udTanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
'            .usTglPelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
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
'             LEFT OUTER JOIN pasiendaftar_t on temp_billing_t.noregistrasi =pasien leftjoin LEFT OUTER JOIN jaminankhusus_m as jamKhus on jamKhus.ID = pd.objectjaminankhusus
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
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "RincianObatAlkes")
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

Public Sub CetakRincianBiayaObat(strNoregistrasi As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, kdRuangan As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakRincianBiayaObat = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
strFilter = ""
    statusPrint = "A"
Set Report = New crRincianBiayaObatall1
'    strSQL = "SELECT  convert(varchar,cast(x.tglpelayanan as date),105) ,x.noresep,  convert(varchar,x.tglpelayanan,105 ) as tglpelayanan, x.norec_pp,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit,x.objectdepartemenfk,x.dokterpj, " & _
'             "x.tglregistrasi,x.tglpulang,x.namarekanan,x.ruangan AS ruangantindakan,x.namaproduk,'-' as penulisresep,x.jenisproduk,x.dokter, " & _
'             "SUM(x.jumlah) as jumlah,x.hargajual,SUM (x.total) AS total,x.namakamar,case when x.namaexternal is null then x.tipepasien  else x.tipepasien + ' /  Jaminan Khusus' +  x.namaexternal end  ,x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser,x.namakelaspd  " & _
'             "FROM(SELECT jamKhus.namaexternal,temp_billing_t.*,USER AS namauser,temp_billing_t.ruangantindakan AS ruangan , right(temp_billing_t.ruangantindakan,5) as noresep FROM temp_billing_t LEFT OUTER JOIN pasiendaftar_t on temp_billing_t.noregistrasi = pasiendaftar_t.noregistrasi leftjoin LEFT OUTER JOIN jaminankhusus_m as jamKhus on jamKhus.ID = pd.objectjaminankhusus WHERE ruangantindakan like'%" & kdRuangan & "%' and noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
'             "AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') AND penulisresep IS NOT NULL) AS x " & _
'             "Group By  x.tglpelayanan,x.norec_pp,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit,x.objectdepartemenfk, " & _
'             "x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.ruangan,x.dokter,x.namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan, " & _
'             "x.totalppenjamin,x.totalbiayatambahan,x.namauser,x.hargajual,x.namaproduk,x.namakelaspd,x.jenisproduk,x.noresep order by x.tglpelayanan"
'
        strSQL = "SELECT        x.tglpelayanan  , CAST(x.tglpelayanan AS date) AS tglpelayananus, x.noresep, x.norec_pp, x.tglstruk, x.nobilling, x.nokwitansi, x.noregistrasi, x.nocm, x.namapasienjk, x.unit,  " & _
                 "            x.objectdepartemenfk, x.dokterpj, x.tglregistrasi, x.tglpulang, x.namarekanan, x.ruangan AS ruangantindakan, x.namaproduk, '-' AS penulisresep, x.jenisproduk, x.dokter, SUM(x.jumlah) AS jumlah, x.hargajual, SUM(x.total) AS total, x.namakamar,  " & _
                "                         CASE WHEN x.namaexternal IS NULL THEN x.tipepasien ELSE x.tipepasien + ' /  Jaminan Khusus' + x.namaexternal END AS tipepasien, x.totalharusdibayar, x.totalprekanan, x.totalppenjamin, x.totalbiayatambahan, x.namauser,  " & _
                "                         namakelaspd  " & _
                "    FROM            (SELECT        jamKhus.namaexternal, temp_billing_t.norec_pp, temp_billing_t.tglstruk, temp_billing_t.nobilling, temp_billing_t.nokwitansi, temp_billing_t.noregistrasi, temp_billing_t.nocm, temp_billing_t.namapasienjk,  " & _
                "                                                    temp_billing_t.unit, temp_billing_t.objectdepartemenfk, temp_billing_t.namakelas, temp_billing_t.dokterpj, temp_billing_t.tglregistrasi, temp_billing_t.tglpulang, temp_billing_t.namarekanan,  " & _
                "                                                    temp_billing_t.tglpelayanan, temp_billing_t.ruangantindakan, temp_billing_t.namaproduk, temp_billing_t.penulisresep, temp_billing_t.jenisproduk, temp_billing_t.dokter, temp_billing_t.jumlah,  " & _
                "                                                    temp_billing_t.hargajual, temp_billing_t.diskon, temp_billing_t.total, temp_billing_t.namakamar, temp_billing_t.tipepasien, temp_billing_t.totalharusdibayar, temp_billing_t.totalprekanan,  " & _
                "                                                    temp_billing_t.totalppenjamin, temp_billing_t.totalbiayatambahan, temp_billing_t.[user], temp_billing_t.norec, temp_billing_t.namakelaspd, temp_billing_t.nama_kelasasal, temp_billing_t.hargajual_kelasasal,  " & _
                "                                                    temp_billing_t.total_kelasasal, temp_billing_t.jenisprodukmaster, temp_billing_t.totaldibayar, USER AS namauser, temp_billing_t.ruangantindakan AS ruangan, RIGHT(temp_billing_t.ruangantindakan, 5)  " & _
                "                                                    AS noresep  " & _
                "                          FROM            temp_billing_t LEFT OUTER JOIN  " & _
                "                                                    pasiendaftar_t ON temp_billing_t.noregistrasi = pasiendaftar_t.noregistrasi LEFT OUTER JOIN  " & _
                "                                                    jaminankhusus_m AS jamKhus ON jamKhus.id = pasiendaftar_t.objectjaminankhusus  " & _
                "                          WHERE        (temp_billing_t.ruangantindakan like'%" & kdRuangan & "%') AND (temp_billing_t.noregistrasi = '" & strNoregistrasi & "') AND (temp_billing_t.tglpelayanan IS NOT NULL) AND  " & _
                "                                                    (temp_billing_t.namaproduk NOT IN ('Biaya Administrasi', 'Biaya Materai')) AND (temp_billing_t.penulisresep IS NOT NULL) ) AS x  " & _
                " GROUP BY tglpelayanan, norec_pp, tglstruk, nobilling, nokwitansi, noregistrasi, nocm, namapasienjk, unit, objectdepartemenfk, dokterpj, tglregistrasi, tglpulang, namarekanan, ruangan, dokter, namakamar, tipepasien, totalharusdibayar,  " & _
                "                         totalprekanan , totalppenjamin, totalbiayatambahan, namaUser, hargajual, namaproduk, namakelaspd, jenisproduk, noresep, namaexternal  " & _
                " ORDER BY   x.tglpelayanan,x.RUANGAN"
    
    
    
    
    
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
      
      ReadRs3 "select     sum(ppd.hargadiscount) as hargadiscount,ppd.komponenhargafk from pasiendaftar_t pd " & _
              "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
              "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
              "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec " & _
              "where pd.noregistrasi='" & strNoregistrasi & "' and pp.produkfk<>402611 group by ppd.komponenhargafk "
    
    Dim TotalDiskonMedis  As Double
    Dim TotalDiskonUmum  As Double
    Dim i As Integer
    
    
    For i = 0 To RS3.RecordCount - 1
        If RS3!komponenhargafk = 35 Then TotalDiskonMedis = TotalDiskonMedis + CDbl(IIf(IsNull(RS3!hargadiscount), 0, RS3!hargadiscount))
        If RS3!komponenhargafk <> 35 Then TotalDiskonUmum = TotalDiskonUmum + CDbl(IIf(IsNull(RS3!hargadiscount), 0, RS3!hargadiscount))
        RS3.MoveNext
    Next
    
    Dim TotalDeposit As Double
'    TotalDeposit = IIf(IsNull(RS2(0)), 0, RS2(0))
    TotalDeposit = 0
    
    
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
    Dim kelas As String
    ReadRs4 "select top 1 namakamar,namakelaspd,nama_kelasasal,tipepasien from temp_billing_t where noregistrasi = '" & strNoregistrasi & "'"
    If RS4.EOF = False Then
        If RS4!tipepasien = "BPJS" Or RS4!tipepasien = "KEMENKES RI" Then
            kelas = IIf(IsNull(RS4!nama_kelasasal) = True, "-", RS4!nama_kelasasal)
        Else
            kelas = RS4!namakelaspd
        End If
    Else
        kelas = "-"
    End If
    
    Dim namaruangan As String
    Dim kamar As String
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
            .usDokterPJawab.SetUnboundFieldSource ("{ado.dokterpj}")
            .udTglMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .udTglPlng.SetUnboundFieldSource IIf(IsNull("{ado.tglpulang}") = True, "-", ("{ado.tglpulang}"))
            .usPenjamin.SetUnboundFieldSource IIf(IsNull("{ado.namarekanan}") = True, ("-"), ("{ado.namarekanan}"))
            .usTipe.SetUnboundFieldSource ("{ado.tipepasien}")
            .usLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .unQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usJmlQty.SetUnboundFieldSource ("{ado.jumlah}")
            .ucHargaSatuan.SetUnboundFieldSource ("{ado.hargajual}")
            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            .usRuanganTindakan.SetUnboundFieldSource ("{ado.ruangantindakan}")
            .usNoStruk.SetUnboundFieldSource ("{ado.nobilling}")
            .ucDepartemen.SetUnboundFieldSource ("{ado.objectdepartemenfk}")
            .usNorecpp.SetUnboundFieldSource ("{ado.norec_pp}")
            .usPenulisResep.SetUnboundFieldSource ("{ado.penulisresep}")
            .untglpelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .usTP.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unnoresep.SetUnboundFieldSource ("{ado.noresep}")
            .txtKamar.SetText kamar
            .txtKls.SetText kelas
            .txtNamaRuangan.SetText namaruangan
            .unTglPlayananuse.SetUnboundFieldSource ("{ado.tglpelayananus}")
'            .ucTarif.SetUnboundFieldSource ("{ado.hargajual}")
'            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
'            .usKelas.SetUnboundFieldSource ("{ado.namakelas}")
'            .usDokter.SetUnboundFieldSource ("{ado.dokter}")
'            .usNomor.SetUnboundFieldSource ("{ado.nomor}")
            .usJenisProduk.SetUnboundFieldSource ("")
'            .udTanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
'            .usTglPelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'            .ucAdministrasi.SetUnboundFieldSource ("0") '("{ado.administrasi}")
'            .ucMaterai.SetUnboundFieldSource ("0") '("{ado.materai}")

            If strNoStruk = "TOTALTOTALTOTAL" Then
                TotalDeposit = 0
                .Section11.Suppress = True
            Else
                .Section11.Suppress = False
            End If
            
            If rs.EOF = False Then
'                If rs!kelompokpasien = 2 Or rs!kelompokpasien = 4 Then
'                    .txtNoSep.SetText rs!sep
'                Else
                    .txtNoSep.Suppress = True
                    .txtLblSep.Suppress = True
                    .txtLblSep2.Suppress = True
'                End If
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
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "RincianObatAlkes")
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


Public Sub CetakRincianBiayaObatApt(strNoregistrasi As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, kdRuangan As String, view As String, s As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakRincianBiayaObat = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
strFilter = ""
    statusPrint = "B"
Set Report1 = New crRincianBiayaObatRevisi
    strSQL = "SELECT    x.tglpelayanan, CAST(x.tglpelayanan AS date) as tglpelayananUse , x.noresep,x.norec_pp,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit,x.objectdepartemenfk,x.dokterpj, " & _
             "x.tglregistrasi,x.tglpulang,x.namarekanan,x.namaruangan AS ruangantindakan,x.namaproduk,'-' as penulisresep,x.jenisproduk,x.dokter, " & _
             "SUM(x.jumlah) as jumlah,x.hargajual,SUM (x.total) AS total,x.namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser,x.namakelaspd,noresep  " & _
             "FROM(SELECT temp_billing_t.*,USER AS namauser,case when penulisresep is not null then '' else ruangantindakan end  AS ruangan , right(ruangantindakan,5) as noresep,pp.noregistrasifk,ru.namaruangan+' '+RIGHT (temp_billing_t.ruangantindakan, 12) AS namaruangan FROM temp_billing_t inner join pelayananpasien_t as pp on temp_billing_t.norec_pp=pp.norec " & _
             "inner join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk inner join ruangan_m as ru on ru.id=apd.objectruanganfk WHERE temp_billing_t.ruangantindakan like'%" & kdRuangan & "%' and temp_billing_t.noregistrasi = '" & strNoregistrasi & "' AND temp_billing_t.tglpelayanan IS NOT NULL " & _
             "AND temp_billing_t.namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') AND penulisresep IS NOT NULL) AS x " & _
             "Group By  x.tglpelayanan,x.norec_pp,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit,x.objectdepartemenfk, " & _
             "x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namaruangan,x.dokter,x.namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan, " & _
             "x.totalppenjamin,x.totalbiayatambahan,x.namauser,x.hargajual,x.namaproduk,x.namakelaspd,x.jenisproduk,x.noresep order by x.tglpelayanan"


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
      
      ReadRs3 "select     sum(ppd.hargadiscount) as hargadiscount,ppd.komponenhargafk from pasiendaftar_t pd " & _
              "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
              "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
              "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec " & _
              "where pd.noregistrasi='" & strNoregistrasi & "' and pp.produkfk<>402611 group by ppd.komponenhargafk "
    
    Dim TotalDiskonMedis  As Double
    Dim TotalDiskonUmum  As Double
    Dim i As Integer
    
    
    For i = 0 To RS3.RecordCount - 1
        If RS3!komponenhargafk = 35 Then TotalDiskonMedis = TotalDiskonMedis + CDbl(IIf(IsNull(RS3!hargadiscount), 0, RS3!hargadiscount))
        If RS3!komponenhargafk <> 35 Then TotalDiskonUmum = TotalDiskonUmum + CDbl(IIf(IsNull(RS3!hargadiscount), 0, RS3!hargadiscount))
        RS3.MoveNext
    Next
    
    Dim TotalDeposit As Double
'    TotalDeposit = IIf(IsNull(RS2(0)), 0, RS2(0))
    TotalDeposit = 0
    
    
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
    Dim kelas As String
    ReadRs4 "select top 1 namakamar,namakelaspd,nama_kelasasal,tipepasien from temp_billing_t where noregistrasi = '" & strNoregistrasi & "'"
    If RS4.EOF = False Then
        If RS4!tipepasien = "BPJS" Or RS4!tipepasien = "KEMENKES RI" Then
            kelas = IIf(IsNull(RS4!nama_kelasasal) = True, "-", RS4!nama_kelasasal)
        Else
            kelas = RS4!namakelaspd
        End If
    Else
        kelas = "-"
    End If
    
    Dim namaruangan As String
    Dim kamar As String
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
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report1
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasienjk}")
'            .usRuangan.SetUnboundFieldSource ("{ado.unit}")
'            .usKamar.SetUnboundFieldSource IIf(IsNull("{ado.namakamar}") = True, "-", ("{ado.namakamar}"))
            .usDokterPJawab.SetUnboundFieldSource ("{ado.dokterpj}")
            .udTglMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .udTglPlng.SetUnboundFieldSource IIf(IsNull("{ado.tglpulang}") = True, "-", ("{ado.tglpulang}"))
            .usPenjamin.SetUnboundFieldSource IIf(IsNull("{ado.namarekanan}") = True, ("-"), ("{ado.namarekanan}"))
            .usTipe.SetUnboundFieldSource ("{ado.tipepasien}")
            .usLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .unQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usJmlQty.SetUnboundFieldSource ("{ado.jumlah}")
            .ucHargaSatuan.SetUnboundFieldSource ("{ado.hargajual}")
            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            .usRuanganTindakan.SetUnboundFieldSource ("{ado.ruangantindakan}")
            .usNoStruk.SetUnboundFieldSource ("{ado.nobilling}")
            .ucDepartemen.SetUnboundFieldSource ("{ado.objectdepartemenfk}")
            .usNorecpp.SetUnboundFieldSource ("{ado.norec_pp}")
            .usPenulisResep.SetUnboundFieldSource ("{ado.penulisresep}")
            .untglpelayanan.SetUnboundFieldSource ("{ado.tglpelayananuse}")
            .unnoresep.SetUnboundFieldSource ("{ado.noresep}")
            .usTP.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .txtKamar.SetText kamar
            .txtKls.SetText kelas
            .txtNamaRuangan.SetText namaruangan
'            .Text39.Suppress = True
'            .unTglPlayananuse.SetUnboundFieldSource ("{ado.tglpelayananUse}")
            
'            .ucTarif.SetUnboundFieldSource ("{ado.hargajual}")
'            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
'            .usKelas.SetUnboundFieldSource ("{ado.namakelas}")
'            .usDokter.SetUnboundFieldSource ("{ado.dokter}")
'            .usNomor.SetUnboundFieldSource ("{ado.nomor}")
            .usJenisProduk.SetUnboundFieldSource ("")
'            .udTanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
'            .usTglPelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'            .ucAdministrasi.SetUnboundFieldSource ("0") '("{ado.administrasi}")
'            .ucMaterai.SetUnboundFieldSource ("0") '("{ado.materai}")

            If strNoStruk = "TOTALTOTALTOTAL" Then
                TotalDeposit = 0
                .Section11.Suppress = True
            Else
                .Section11.Suppress = False
            End If
            
            If rs.EOF = False Then
'                If rs!kelompokpasien = 2 Or rs!kelompokpasien = 4 Then
'                    .txtNoSep.SetText rs!sep
'                Else
                    .txtNoSep.Suppress = True
                    .txtLblSep.Suppress = True
                    .txtLblSep2.Suppress = True
'                End If
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
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "RincianObatAlkes")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Report1
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
