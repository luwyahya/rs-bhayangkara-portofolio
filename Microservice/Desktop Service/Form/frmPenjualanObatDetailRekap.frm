VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmPenjualanObatDetailRekap 
   Caption         =   "Transmedic"
   ClientHeight    =   6885
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   5775
   Icon            =   "frmPenjualanObatDetailRekap.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   6885
   ScaleWidth      =   5775
   StartUpPosition =   3  'Windows Default
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
      Left            =   4680
      TabIndex        =   3
      Top             =   480
      Width           =   1095
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
      Width           =   2775
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   6855
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
      EnableExportButton=   -1  'True
      EnableSearchExpertButton=   0   'False
      EnableHelpButton=   0   'False
   End
End
Attribute VB_Name = "frmPenjualanObatDetailRekap"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim reportDetailPengeluaran As New crPenjualanObatDetail
Dim reportRekapPengeluaran As New crPenjualanObatRekap
Dim reportRekapPengeluarannoharga As New crPenjualanObatRekapnoharga
Dim reportpasienpulang As New crLaporanpasienpulangapotik
Dim adoReport As New ADODB.Command
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String
Dim detailpengeluaran As Boolean
Dim rekappengeluaran As Boolean
Dim rekappengeluarannoharga As Boolean
Dim laporanpasienpulang As Boolean


Private Sub cmdCetak_Click()
    If detailpengeluaran = True Then
        reportDetailPengeluaran.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        reportDetailPengeluaran.PrintOut False
    ElseIf rekappengeluaran = True Then
        reportRekapPengeluaran.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        reportRekapPengeluaran.PrintOut False
    ElseIf rekappengeluarannoharga = True Then
         reportRekapPengeluarannoharga.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        reportRekapPengeluarannoharga.PrintOut False
    ElseIf laporanpasienpulang = True Then
         reportpasienpulang.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        reportpasienpulang.PrintOut False
    End If
    
End Sub

Private Sub CmdOption_Click()
    reportDetailPengeluaran.PrinterSetup Me.hwnd
    CRViewer1.Refresh
End Sub


Private Sub Form_Load()
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LaporanPenjualan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Set frmPenjualanObatDetail = Nothing
End Sub

Public Sub Cetak(namaPrinted As String, tglAwal As String, tglAkhir As String, idRuangan As String, idKelompokPasien As String, idPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
detailpengeluaran = True
Set frmPenjualanObatDetail = Nothing
Dim adocmd As New ADODB.Command
Dim strSQL As String
Dim str1 As String
Dim str2 As String
Dim str3 As String
Dim str4 As String
Dim str5 As String
Dim namaruangan As String
    If idPegawai <> "" Then
        str1 = "AND sr.penulisresepfk=" & idPegawai & " "
        str4 = "AND sp.objectpegawaipenanggungjawabfk=" & idPegawai & " "
    End If
    If idRuangan <> "" Then
        str2 = " AND ru.id=" & idRuangan & " "
        str5 = " AND sp.objectruanganfk = " & idRuangan & " "
        ReadRs2 "SELECT id,namaruangan FROM ruangan_m where id = " & idRuangan & " "
        If Not RS2.BOF Then
            namaruangan = RS2!namaruangan
        End If
    End If
    If idKelompokPasien <> "" Then
        str3 = " AND pd.objectkelompokpasienlastfk = " & idKelompokPasien & " "
    End If
    
    If namaruangan = "" Then
       namaruangan = "SEMUA DEPO"
    End If
    
    
    With reportDetailPengeluaran
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String

    strSQL = "SELECT sr.norec,CONVERT (VARCHAR, sr.tglresep, 105) AS tglresep,sr.noresep, " & _
             "UPPER (ps.namapasien) AS namapasien,ps.nocm,ru.namaruangan AS ruangan, " & _
             "pr.namaproduk,pp.jumlah,pp.hargajual,pg.namalengkap, " & _
             "CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END AS diskon, " & _
             "CASE WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END AS jasa,0 AS ppn " & _
             "FROM strukresep_t AS sr " & _
             "INNER JOIN pelayananpasien_t AS pp ON pp.strukresepfk = sr.norec " & _
             "INNER JOIN ruangan_m AS ru ON ru.id = sr.ruanganfk " & _
             "INNER JOIN produk_m AS pr ON pr.id = pp.produkfk " & _
             "INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk " & _
             "INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk " & _
             "INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk " & _
             "LEFT JOIN pegawai_m AS pg ON pg.id = sr.penulisresepfk " & _
             "WHERE sr.tglresep BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
             "" & str1 & " " & str2 & " " & str3 & " " & _
             " and pr.objectdetailjenisprodukfk not in (1518,1519) "

    strSQL = strSQL & " UNION ALL " & _
             "SELECT sp.norec,CONVERT (VARCHAR, sp.tglstruk, 105) AS tglresep,sp.nostruk AS noresep, " & _
             "UPPER (sp.namapasien_klien) AS namapasien,'-' AS nocm,ru.namaruangan AS ruangan, " & _
             "pr.namaproduk,spd.qtyproduk AS jumlah,spd.hargasatuan AS hargajual,pg.namalengkap, " & _
             "CASE WHEN spd.hargadiscount IS NULL THEN 0 ELSE spd.hargadiscount END AS diskon, " & _
             "CASE WHEN spd.hargatambahan IS NULL THEN 0 ELSE spd.hargatambahan END AS jasa,0 AS ppn " & _
             "FROM strukpelayanan_t AS sp " & _
             "INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec " & _
             "INNER JOIN produk_m AS pr ON pr.id = spd.objectprodukfk " & _
             "INNER JOIN pegawai_m AS pg ON pg.id = sp.objectpegawaipenanggungjawabfk " & _
             "INNER JOIN ruangan_m AS ru ON ru.id = sp.objectruanganfk " & _
             "WHERE sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' AND substring(sp.nostruk,1,2)='OB' " & _
             "" & str5 & " " & str4 & " " & _
             " and pr.objectdetailjenisprodukfk not in (1518,1519) "
'            "order by tglresep"
            'ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport
            
            .txtPrinted.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .txtRuangan.SetText "Ruangan : " & namaruangan
            .udtTglResep.SetUnboundFieldSource ("{ado.tglresep}")
            .usNoResep.SetUnboundFieldSource ("{ado.noresep}")
            .usNoRM.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usNamaDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .usNamaObat.SetUnboundFieldSource ("{ado.namaproduk}")
            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
            .ucHarga.SetUnboundFieldSource ("{ado.hargajual}")
            .ucJasa.SetUnboundFieldSource ("{ado.jasa}")
            .ucPpn.SetUnboundFieldSource ("{ado.ppn}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
            
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenjualanObatPerDokter")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = reportDetailPengeluaran
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

Public Sub cetakRekap(namaPrinted As String, tglAwal As String, tglAkhir As String, idRuangan As String, idKelompokPasien As String, idPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
rekappengeluaran = True
Set frmPenjualanObatDetailRekap = Nothing
Dim adocmd As New ADODB.Command
Dim strSQL As String
Dim str1 As String
Dim str2 As String
Dim str3 As String
Dim str4 As String
Dim str5 As String
Dim namaruangan As String
    If idPegawai <> "" Then
        str1 = "AND sr.penulisresepfk=" & idPegawai & " "
        str4 = "AND sp.objectpegawaipenanggungjawabfk=" & idPegawai & " "
    End If
    If idRuangan <> "" Then
        str2 = " AND sr.ruanganfk=" & idRuangan & " "
        str5 = " AND sp.objectruanganfk = " & idRuangan & " "
        ReadRs2 "SELECT id,namaruangan FROM ruangan_m where id = " & idRuangan & " "
        If Not RS2.BOF Then
            namaruangan = RS2!namaruangan
        End If
    End If
    If idKelompokPasien <> "" Then
        str3 = " AND pd.objectkelompokpasienlastfk = " & idKelompokPasien & " "
    End If
    
    If namaruangan = "" Then
       namaruangan = "SEMUA DEPO"
    End If
    
    With reportRekapPengeluaran
    Set adoReport = New ADODB.Command
    adoReport.ActiveConnection = CN_String
            
    strSQL = "SELECT x.namaproduk,SUM(x.jumlah) as jumlah,x.hargajual,x.diskon,x.jasa,x.ppn " & _
             "FROM(SELECT ru.namaruangan AS ruangan,pr.namaproduk,sum(pp.jumlah) as jumlah,pp.hargajual, " & _
             "CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END AS diskon, " & _
             "CASE WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END AS jasa,0 AS ppn " & _
             "FROM strukresep_t AS sr " & _
             "INNER JOIN pelayananpasien_t AS pp ON pp.strukresepfk = sr.norec " & _
             "INNER JOIN ruangan_m AS ru ON ru.id = sr.ruanganfk " & _
             "INNER JOIN produk_m AS pr ON pr.id = pp.produkfk " & _
             "INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk " & _
             "INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk " & _
             "INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk " & _
             "LEFT JOIN pegawai_m AS pg ON pg.id = sr.penulisresepfk " & _
             "WHERE sr.tglresep BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
             "" & str1 & " " & str2 & " " & str3 & " " & _
             " and pr.objectdetailjenisprodukfk not in (1518,1519) " & _
             "GROUP BY ru.namaruangan,pr.namaproduk,pp.jumlah,pp.hargajual,pp.hargadiscount,pp.Jasa"
    
    strSQL = strSQL & " UNION ALL " & _
             "SELECT ru.namaruangan AS ruangan,pr.namaproduk,SUM(spd.qtyproduk) AS jumlah,spd.hargasatuan AS hargajual, " & _
             "CASE WHEN spd.hargadiscount IS NULL THEN 0 ELSE spd.hargadiscount END AS diskon, " & _
             "CASE WHEN spd.hargatambahan IS NULL THEN 0 ELSE spd.hargatambahan END AS jasa,0 AS ppn " & _
             "FROM strukpelayanan_t AS sp " & _
             "INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec " & _
             "INNER JOIN produk_m AS pr ON pr.id = spd.objectprodukfk " & _
             "INNER JOIN pegawai_m AS pg ON pg.id = sp.objectpegawaipenanggungjawabfk " & _
             "INNER JOIN ruangan_m AS ru ON ru.id = sp.objectruanganfk " & _
             "WHERE sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' AND substring(sp.nostruk,1,2)='OB'" & _
             "" & str5 & " " & str4 & " " & _
             " and pr.objectdetailjenisprodukfk not in (1518,1519) " & _
             "GROUP BY ru.namaruangan,pr.namaproduk,spd.qtyproduk,spd.hargasatuan,spd.hargadiscount,spd.hargatambahan) as x " & _
             "GROUP BY x.namaproduk,x.hargajual,x.diskon,x.jasa,x.ppn "
'             "order by tglresep"
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport
            
            .txtPrinted.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .txtRuangan.SetText "Ruangan : " & namaruangan
'            .udtTglResep.SetUnboundFieldSource ("{ado.tglresep}")
'            .usNoResep.SetUnboundFieldSource ("{ado.noresep}")
'            .usNoRm.SetUnboundFieldSource ("{ado.nocm}")
'            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
'            .usNamaDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .usNamaObat.SetUnboundFieldSource ("{ado.namaproduk}")
            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
            .ucHarga.SetUnboundFieldSource ("{ado.hargajual}")
            .ucJasa.SetUnboundFieldSource ("{ado.jasa}")
            .ucPpn.SetUnboundFieldSource ("{ado.ppn}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanRekapPenjualanObat")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = reportRekapPengeluaran
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
Public Sub cetakRekap2(namaPrinted As String, tglAwal As String, tglAkhir As String, idRuangan As String, idKelompokPasien As String, idPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
rekappengeluarannoharga = True
Set frmPenjualanObatDetailRekap = Nothing
Dim adocmd As New ADODB.Command
Dim strSQL As String
Dim str1 As String
Dim str2 As String
Dim str3 As String
Dim str4 As String
Dim str5 As String
Dim STRX As String
Dim namaruangan As String
    If idPegawai <> "" Then
        str1 = "AND sr.penulisresepfk=" & idPegawai & " "
        str4 = "AND sp.objectpegawaipenanggungjawabfk=" & idPegawai & " "
    End If
    If idRuangan <> "" Then
        str2 = " AND sr.ruanganfk=" & idRuangan & " "
        str5 = " AND sp.objectruanganfk = " & idRuangan & " "
        STRX = " and kirimproduk_t.objectruanganpengirimfk = " & idRuangan & " "
        ReadRs2 "SELECT id,namaruangan FROM ruangan_m where id = " & idRuangan & " "
        If Not RS2.BOF Then
            namaruangan = RS2!namaruangan
        End If
    End If
    If idKelompokPasien <> "" Then
        str3 = " AND pd.objectkelompokpasienlastfk = " & idKelompokPasien & " "
    End If
    
    If namaruangan = "" Then
       namaruangan = "SEMUA DEPO"
    End If
    
    With reportRekapPengeluarannoharga
    Set adoReport = New ADODB.Command
    adoReport.ActiveConnection = CN_String
            
    strSQL = "SELECT x.namaproduk,SUM(x.jumlah) as jumlah , X.detailjenisproduk,X.satuanstandar " & _
             "FROM(SELECT bentukproduk_m.namabentukproduk as detailjenisproduk,ru.namaruangan AS ruangan,pr.namaproduk,sum(pp.jumlah) as jumlah ,std.satuanstandar  " & _
             "FROM strukresep_t AS sr " & _
             "INNER JOIN pelayananpasien_t AS pp ON pp.strukresepfk = sr.norec " & _
             "INNER JOIN ruangan_m AS ru ON ru.id = sr.ruanganfk " & _
             "INNER JOIN produk_m AS pr ON pr.id = pp.produkfk " & _
             "INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk " & _
             "INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk " & _
             "RIGHT JOIN bentukproduk_m ON pr.objectbentukprodukfk = bentukproduk_m.id " & _
             "INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk " & _
             "INNER JOIN detailjenisproduk_m ON pr.objectdetailjenisprodukfk = detailjenisproduk_m.id " & _
             "LEFT JOIN pegawai_m AS pg ON pg.id = sr.penulisresepfk left join satuanstandar_m as std on std.id = pr.objectsatuanstandarfk  " & _
             "WHERE sr.tglresep BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
             "" & str1 & " " & str2 & " " & str3 & " " & _
             " and pr.objectdetailjenisprodukfk not in (1518,1519) " & _
             "GROUP BY ru.namaruangan,pr.namaproduk,bentukproduk_m.namabentukproduk ,std.satuanstandar"
            
            strSQL = strSQL & " UNION ALL " & _
             "SELECT bentukproduk_m.namabentukproduk as detailjenisproduk,ru.namaruangan AS ruangan,pr.namaproduk,sum(pp.jumlah) as jumlah ,std.satuanstandar  " & _
             "FROM strukresep_t AS sr " & _
             "INNER JOIN pelayananpasienobatkronis_t AS pp ON pp.strukresepfk = sr.norec " & _
             "INNER JOIN ruangan_m AS ru ON ru.id = sr.ruanganfk " & _
             "INNER JOIN produk_m AS pr ON pr.id = pp.produkfk " & _
             "INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk " & _
             "LEFT JOIN bentukproduk_m ON pr.objectbentukprodukfk = bentukproduk_m.id " & _
             "INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk " & _
             "INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk " & _
             "INNER JOIN detailjenisproduk_m ON pr.objectdetailjenisprodukfk = detailjenisproduk_m.id " & _
             "LEFT JOIN pegawai_m AS pg ON pg.id = sr.penulisresepfk left join satuanstandar_m as std on std.id = pr.objectsatuanstandarfk  " & _
             "WHERE sr.tglresep BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
             "" & str1 & " " & str2 & " " & str3 & " " & _
             " and pr.objectdetailjenisprodukfk not in (1518,1519) " & _
             "GROUP BY ru.namaruangan,pr.namaproduk,bentukproduk_m.namabentukproduk,std.satuanstandar"
             strSQL = strSQL & " UNION ALL " & _
                        " SELECT       bentukproduk_m.namabentukproduk as detailjenisproduk, ruangan_m.namaruangan AS ruangan, produk_m.namaproduk, kirimproduk_t.qtyproduk, satuanstandar_m.satuanstandar FROM            kirimproduk_t INNER JOIN" & _
                         " ruangan_m ON kirimproduk_t.objectruanganfk = ruangan_m.id INNER JOIN produk_m ON kirimproduk_t.objectprodukfk = produk_m.id AND kirimproduk_t.objectprodukkirimfk = produk_m.id INNER JOIN" & _
                         " detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT JOIN bentukproduk_m ON produk_m.objectbentukprodukfk = bentukproduk_m.id INNER JOIN satuanstandar_m ON produk_m.objectsatuanstandarfk = satuanstandar_m.id" & _
                         " where tglpelayanan  BETWEEN '" & tglAwal & "' and '" & tglAkhir & "'  " & STRX & " "
'DITUTUP KARENA SEMUA OBAT MASUK KE PELAYANANPASIEN_T KALO GK DI TUTUP JADI DOUBLE
'    strSQL = strSQL & " UNION ALL " & _
'             " SELECT ru.namaruangan AS ruangan,pr.namaproduk,sum(pp.jumlah) as jumlah ,detailjenisproduk_m.detailjenisproduk,std.satuanstandar  " & _
'             "FROM strukresep_t AS sr " & _
'             "INNER JOIN pelayananpasienobatkronis_t AS pp ON pp.strukresepfk = sr.norec " & _
'             "INNER JOIN ruangan_m AS ru ON ru.id = sr.ruanganfk " & _
'             "INNER JOIN produk_m AS pr ON pr.id = pp.produkfk " & _
'             "INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk " & _
'             "INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk " & _
'             "INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk " & _
'             "INNER JOIN detailjenisproduk_m ON pr.objectdetailjenisprodukfk = detailjenisproduk_m.id " & _
'             "LEFT JOIN pegawai_m AS pg ON pg.id = sr.penulisresepfk left join satuanstandar_m as std on std.id = pr.objectsatuanstandarfk  " & _
'             "WHERE sr.tglresep BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
'             "" & str1 & " " & str2 & " " & str3 & " " & _
'             " and pr.objectdetailjenisprodukfk not in (1518,1519) " & _
'             "GROUP BY ru.namaruangan,pr.namaproduk,detailjenisproduk_m.detailjenisproduk,std.satuanstandar"

        
     strSQL = strSQL & " UNION ALL " & _
             "SELECT bentukproduk_m.namabentukproduk as detailjenisproduk, ru.namaruangan AS ruangan,pr.namaproduk,SUM(spd.qtyproduk) AS jumlah,std.satuanstandar   " & _
             "FROM strukpelayanan_t AS sp " & _
             "INNER JOIN strukpelayanandetail_t AS spd ON spd.nostrukfk = sp.norec " & _
             "INNER JOIN produk_m AS pr ON pr.id = spd.objectprodukfk " & _
             "INNER JOIN detailjenisproduk_m ON pr.objectdetailjenisprodukfk = detailjenisproduk_m.id " & _
             "LEFT JOIN bentukproduk_m ON pr.objectbentukprodukfk = bentukproduk_m.id " & _
             "INNER JOIN pegawai_m AS pg ON pg.id = sp.objectpegawaipenanggungjawabfk " & _
             "INNER JOIN ruangan_m AS ru ON ru.id = sp.objectruanganfk left join satuanstandar_m as std on std.id = pr.objectsatuanstandarfk  " & _
             "WHERE sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' AND substring(sp.nostruk,1,2)='OB'" & _
             "" & str5 & " " & str4 & " " & _
             " and pr.objectdetailjenisprodukfk not in (1518,1519) " & _
             "GROUP BY ru.namaruangan,pr.namaproduk,bentukproduk_m.namabentukproduk,std.satuanstandar) as x " & _
             "GROUP BY x.namaproduk ,x.detailjenisproduk,x.satuanstandar ORDER BY x.namaproduk"
'             "order by tglresep"
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport
            
            .txtPrinted.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .txtRuangan.SetText "Ruangan : " & namaruangan
'            .udtTglResep.SetUnboundFieldSource ("{ado.tglresep}")
'            .usNoResep.SetUnboundFieldSource ("{ado.noresep}")
'            .usNoRm.SetUnboundFieldSource ("{ado.nocm}")
'            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .undetail.SetUnboundFieldSource ("{ado.detailjenisproduk}")
            .usNamaObat.SetUnboundFieldSource ("{ado.namaproduk}")
            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
            .usSatuan.SetUnboundFieldSource ("{ado.satuanstandar}")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanRekapPenjualanObat")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = reportRekapPengeluarannoharga
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

Public Sub cetakRekap3(namaPrinted As String, tglAwal As String, tglAkhir As String, idRuangan As String, idKelompokPasien As String, idPegawai As String, idRekanan As String, view As String, depart As String)
'On Error GoTo errLoad
'On Error Resume Next
laporanpasienpulang = True
Set frmPenjualanObatDetailRekap = Nothing
Dim adocmd As New ADODB.Command
Dim strSQL As String
Dim str1 As String
Dim str2 As String
Dim str3 As String
Dim str4 As String
Dim str5 As String
Dim namaruangan As String
Dim fRekanan As String
Dim fKelompok As String
Dim fDepart As String
    
    With reportpasienpulang
    Set adoReport = New ADODB.Command
    adoReport.ActiveConnection = CN_String
    If (idKelompokPasien <> "") Then
        fKelompok = "AND idKelompok=" & idKelompokPasien & " "
    Else
        fKelompok = ""
    End If
    If (idRekanan <> "") Then
       fRekanan = "AND objectrekananfk=" & idRekanan & " "
       
    Else
       fRekanan = ""
    
    End If
    If depart <> "" Then
        fDepart = depart
    Else
       fDepart = ""
    End If
            
'    strSQL = "SELECT DISTINCT ruangan_m_1.qruangan, pasiendaftar_t.noregistrasi,ruangan_m.namaruangan, ruangan_m_1.namaruangan AS asalruangan, pasiendaftar_t.tglpulang, pasien_m.namapasien, " & _
'            "pasien_m.nocm, pasiendaftar_t.tglregistrasi,sum(pelayananpasien_t.hargajual*pelayananpasien_t.jumlah + pelayananpasien_t.jasa) as total,COUNT(pelayananpasien_t.norec) as rke " & _
'            "FROM  pelayananpasien_t INNER JOIN strukresep_t ON pelayananpasien_t.strukresepfk = strukresep_t.norec INNER JOIN " & _
'            "antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN " & _
'            "pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec INNER JOIN " & _
'            "pasien_m ON pasiendaftar_t.nocmfk = pasien_m.id INNER JOIN " & _
'            "ruangan_m AS ruangan_m_1 ON pasiendaftar_t.objectruanganlastfk = ruangan_m_1.id INNER JOIN " & _
'            "ruangan_m ON ruangan_m_1.qruangan = ruangan_m.id " & _
'            "WHERE ruangan_m_1.qruangan like '%" & idRuangan & "%' and ruangan_m_1.objectdepartemenfk = 16 and pasiendaftar_t.tglpulang BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
'            "" & _
'            "GROUP BY    pasiendaftar_t.noregistrasi,ruangan_m.namaruangan, ruangan_m_1.namaruangan , pasiendaftar_t.tglpulang, pasien_m.namapasien, " & _
'            "pasien_m.noCm , pasiendaftar_t.tglRegistrasi, pelayananpasien_t.Jasa, ruangan_m_1.qruangan ORDER BY ruangan_m_1.namaruangan "
        
'      strSQL = "SELECT DISTINCT          ruangan_m_1.qruangan, pasiendaftar_t.noregistrasi, ruangan_m.namaruangan, ruangan_m_1.namaruangan AS asalruangan, pasiendaftar_t.tglpulang, pasien_m.namapasien, pasien_m.nocm, pasiendaftar_t.tglregistrasi,   " & _
'                "                         SUM(pelayananpasien_t.hargajual * pelayananpasien_t.jumlah + pelayananpasien_t.jasa) AS total, COUNT(pelayananpasien_t.norec) AS rke, kelompokpasien_m.id AS idKelompokPasien, kelompokpasien_m.kelompokpasien,   " & _
'                "                         rekanan_m.id AS idRekanann, rekanan_m.namarekanan, ruangan_m_1.objectdepartemenfk, departemen_m.namadepartemen  " & _
'                "FROM            pelayananpasien_t INNER JOIN  " & _
'                "                         strukresep_t ON pelayananpasien_t.strukresepfk = strukresep_t.norec INNER JOIN  " & _
'                "                         antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN  " & _
'                "                         pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec INNER JOIN  " & _
'                "                         pasien_m ON pasiendaftar_t.nocmfk = pasien_m.id INNER JOIN  " & _
'                "                         ruangan_m AS ruangan_m_1 ON pasiendaftar_t.objectruanganlastfk = ruangan_m_1.id INNER JOIN  " & _
'                "                         ruangan_m ON ruangan_m_1.qruangan = ruangan_m.id INNER JOIN  " & _
'                "                         departemen_m ON ruangan_m_1.objectdepartemenfk = departemen_m.id LEFT OUTER JOIN  " & _
'                "                         kelompokpasien_m ON pasiendaftar_t.objectkelompokpasienlastfk = kelompokpasien_m.id LEFT OUTER JOIN  " & _
'                "                         rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
'                "WHERE ruangan_m_1.qruangan like '%" & idRuangan & "%' and ruangan_m_1.objectdepartemenfk = 16 and pasiendaftar_t.tglpulang BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
'                        fKelompok & _
'                        fRekanan & _
'                 "       GROUP BY pasiendaftar_t.noregistrasi, ruangan_m.namaruangan, ruangan_m_1.namaruangan, pasiendaftar_t.tglpulang, pasien_m.namapasien, pasien_m.nocm, pasiendaftar_t.tglregistrasi, pelayananpasien_t.jasa,  " & _
'                "                                 ruangan_m_1.qruangan , kelompokpasien_m.ID, kelompokpasien_m.kelompokpasien, rekanan_m.ID, rekanan_m.namarekanan, ruangan_m_1.objectdepartemenfk , departemen_m.namadepartemen  " & _
'               "         ORDER BY asalruangan "
'
'
'        strSQL = " SELECT DISTINCT   count(departemen_m.namadepartemen) as jmlR ," & _
'                "        ruangan_m_1.qruangan, pasiendaftar_t.noregistrasi, ruangan_m.namaruangan, ruangan_m_1.namaruangan AS asalruangan, pasiendaftar_t.tglpulang, pasien_m.namapasien, pasien_m.nocm, pasiendaftar_t.tglregistrasi, " & _
'                "        sum(pelayananpasien_t.hargajual * pelayananpasien_t.jumlah + pelayananpasien_t.jasa) AS total, kelompokpasien_m.id AS idKelompokPasien, kelompokpasien_m.kelompokpasien, rekanan_m.id AS idRekanann, " & _
'                "        rekanan_m.namarekanan , ruangan_m_1.objectdepartemenfk, departemen_m.namadepartemen " & _
'                "   FROM            pelayananpasien_t INNER JOIN " & _
'                "        strukresep_t ON pelayananpasien_t.strukresepfk = strukresep_t.norec INNER JOIN  " & _
'                "        antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN  " & _
'                "        pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec INNER JOIN  " & _
'                "        pasien_m ON pasiendaftar_t.nocmfk = pasien_m.id INNER JOIN  " & _
'                "        ruangan_m AS ruangan_m_1 ON pasiendaftar_t.objectruanganlastfk = ruangan_m_1.id INNER JOIN  " & _
'                "        ruangan_m ON ruangan_m_1.qruangan = ruangan_m.id INNER JOIN  " & _
'                "        departemen_m ON ruangan_m_1.objectdepartemenfk = departemen_m.id LEFT OUTER JOIN  " & _
'                "         kelompokpasien_m ON pasiendaftar_t.objectkelompokpasienlastfk = kelompokpasien_m.id LEFT OUTER JOIN  " & _
'                "         rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id  " & _
'                " WHERE ruangan_m_1.qruangan like '%" & idRuangan & "%' and ruangan_m_1.objectdepartemenfk = 16 and pasiendaftar_t.tglpulang BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
'                        fKelompok & _
'                        fRekanan & _
'                " GROUP BY ruangan_m_1.qruangan, pasiendaftar_t.noregistrasi, ruangan_m.namaruangan, ruangan_m_1.namaruangan, pasiendaftar_t.tglpulang, pasien_m.namapasien, pasien_m.nocm, pasiendaftar_t.tglregistrasi,  " & _
'                "         kelompokpasien_m.id, kelompokpasien_m.kelompokpasien, rekanan_m.id, rekanan_m.namarekanan, ruangan_m_1.objectdepartemenfk,  " & _
'                "         departemen_m.namadepartemen  " & _
'                " ORDER BY asalruangan,namapasien "
        If fDepart = "24" Then
            strSQL = "SELECT        SUM(jmlR) AS jmlR, nocm, namapasien, tglregistrasi, noregistrasi,namadepartemen, tglpulang, kelompokpasien, SUM(jumlah) AS jumlah, SUM(hargasatuan) AS hargasatuan, RuanganAsal as asalruangan, objectdepartemenfk, SUM(total) AS total, ruanganfk " & _
                " From v_pasienPulangApotikIgd  " & _
                " WHERE ruanganfk like '%" & idRuangan & "%' and objectdepartemenfk like '%" & fDepart & "%' and tglpulang BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
                        fKelompok & _
                        fRekanan & _
                " GROUP BY nocm, namapasien, tglregistrasi, noregistrasi, tglpulang, kelompokpasien, RuanganAsal, objectdepartemenfk, ruanganfk,namadepartemen " & _
                "order  BY nocm, namapasien, tglregistrasi, RuanganAsal"
        Else
        
        strSQL = "SELECT        SUM(jmlR) AS jmlR, nocm, namapasien, tglregistrasi, noregistrasi,namadepartemen, tglpulang, kelompokpasien, SUM(jumlah) AS jumlah, SUM(hargasatuan) AS hargasatuan, RuanganAsal as asalruangan, objectdepartemenfk, SUM(total) AS total, ruanganfk " & _
                " From v_pasienPulangApotik  " & _
                " WHERE ruanganfk like '%" & idRuangan & "%' and objectdepartemenfk like '%" & fDepart & "%' and tglpulang BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
                        fKelompok & _
                        fRekanan & _
                " GROUP BY nocm, namapasien, tglregistrasi, noregistrasi, tglpulang, kelompokpasien, RuanganAsal, objectdepartemenfk, ruanganfk,namadepartemen " & _
                "order  BY nocm, namapasien, tglregistrasi, RuanganAsal"
'                " HAVING        (ruanganfk = '315') AND (tglpulang BETWEEN CONVERT(DATETIME, '2021-03-03 00:00:00', 102) AND CONVERT(DATETIME, '2021-03-03 23:59:00', 102)) "
       End If
        ReadRs2 "SELECT id,namaruangan FROM ruangan_m where id like '%" & idRuangan & "%' "
        If Not RS2.BOF Then
            namaruangan = RS2!namaruangan
        End If
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport
            
            .txtPrinted.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .txtRuangan.SetText "Ruangan : " & namaruangan
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnamapasien.SetUnboundFieldSource ("{ado.namapasien}")
            .unruangan.SetUnboundFieldSource ("{ado.asalruangan}")
            .unnoregistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .untglmasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .untglpulang.SetUnboundFieldSource ("{ado.tglpulang}")
            .unTotal.SetUnboundFieldSource ("{ado.total}")
            .untotalr.SetUnboundFieldSource ("{ado.jmlR}")
            .usNamaPenjamin.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usDep.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanRekapPenjualanObat")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = reportpasienpulang
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
Public Sub cetakRekap4(namaPrinted As String, tglAwal As String, tglAkhir As String, idRuangan As String, idKelompokPasien As String, idPegawai As String, idRekanan As String, view As String, depart As String)
'On Error GoTo errLoad
'On Error Resume Next
laporanpasienpulang = True
Set frmPenjualanObatDetailRekap = Nothing
Dim adocmd As New ADODB.Command
Dim strSQL As String
Dim str1 As String
Dim str2 As String
Dim str3 As String
Dim str4 As String
Dim str5 As String
Dim namaruangan As String
Dim fRekanan As String
Dim fKelompok As String
Dim fDepart As String
    
    With reportpasienpulang
    Set adoReport = New ADODB.Command
    adoReport.ActiveConnection = CN_String
    If (idKelompokPasien <> "") Then
        fKelompok = "AND idKelompok=" & idKelompokPasien & " "
    Else
        fKelompok = ""
    End If
    If (idRekanan <> "") Then
       fRekanan = "AND objectrekananfk=" & idRekanan & " "
       
    Else
       fRekanan = ""
    
    End If
    If depart <> "" Then
        fDepart = depart
    Else
       fDepart = ""
    End If
            
        
        strSQL = "SELECT        SUM(jmlR) AS jmlR, nocm, namapasien, tglregistrasi, noregistrasi,namadepartemen, tglpulang, kelompokpasien, SUM(jumlah) AS jumlah, SUM(hargasatuan) AS hargasatuan, RuanganAsal as asalruangan, objectdepartemenfk, SUM(total) AS total,blokdepo " & _
                " From v_pasienPulangApotikBlok  " & _
                " WHERE blokdepo like '%" & idRuangan & "%' and objectdepartemenfk like '%" & fDepart & "%' and tglpulang BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
                        fKelompok & _
                        fRekanan & _
                " GROUP BY nocm, namapasien, tglregistrasi, noregistrasi, tglpulang, kelompokpasien, RuanganAsal, objectdepartemenfk,namadepartemen,blokdepo " & _
                "order  BY nocm, namapasien, tglregistrasi, RuanganAsal"

        ReadRs2 "SELECT id,namaruangan FROM ruangan_m where id like '%" & idRuangan & "%' "
        If Not RS2.BOF Then
            namaruangan = RS2!namaruangan
        End If
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport
            
            .txtPrinted.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .txtRuangan.SetText "Ruangan : " & namaruangan
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnamapasien.SetUnboundFieldSource ("{ado.namapasien}")
            .unruangan.SetUnboundFieldSource ("{ado.asalruangan}")
            .unnoregistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .untglmasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .untglpulang.SetUnboundFieldSource ("{ado.tglpulang}")
            .unTotal.SetUnboundFieldSource ("{ado.total}")
            .untotalr.SetUnboundFieldSource ("{ado.jmlR}")
            .usNamaPenjamin.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usDep.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanRekapPenjualanObat")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = reportpasienpulang
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


