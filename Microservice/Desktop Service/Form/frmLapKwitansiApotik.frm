VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLapKwitansiApotik 
   Caption         =   "Transmedic"
   ClientHeight    =   6885
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   5775
   Icon            =   "frmLapKwitansiApotik.frx":0000
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
Attribute VB_Name = "frmLapKwitansiApotik"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim reportDetailPengeluaran As New crPenjualanObatDetail
Dim reportRekapPengeluaran As New crPenjualanObatRekap
Dim adoReport As New ADODB.Command
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String

Private Sub cmdCetak_Click()
    reportDetailPengeluaran.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    reportDetailPengeluaran.PrintOut False
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
            .usNorm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usNamaDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .usNamaObat.SetUnboundFieldSource ("{ado.namaproduk}")
            .unJumlah.SetUnboundFieldSource ("{ado.jumlah}")
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
            .unJumlah.SetUnboundFieldSource ("{ado.jumlah}")
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

