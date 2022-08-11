VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmKwitansiApotik 
   Caption         =   "Transmedic"
   ClientHeight    =   6885
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   5775
   Icon            =   "frmKwitansiApotik.frx":0000
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
Attribute VB_Name = "frmKwitansiApotik"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim reportDetailPengeluaran As New crLapKwitansiApotik
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
    Set frmKwitansiApotik = Nothing
End Sub

Public Sub Cetak(namaPrinted As String, tglAwal As String, tglAkhir As String, idRuangan As String, idKelompokPasien As String, idPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Set frmKwitansiApotik = Nothing
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

    strSQL = " SELECT x.tglresep,x.noresep,x.noregistrasi,x.nocm,x.namapasien,x.jeniskelamin,x.kelompokpasien,x.namalengkap, " & _
             " x.ruanganapotik,SUM(x.tunai) AS tunai,SUM(x.penjamin) AS penjamin FROM(SELECT CONVERT(VARCHAR, sr.tglresep, 105) AS tglresep,sr.noresep,pd.noregistrasi,ps.nocm,UPPER(ps.namapasien) AS namapasien, " & _
             " UPPER(jk.reportdisplay) AS jeniskelamin,kp.kelompokpasien,CASE WHEN pg.namalengkap IS NULL THEN '-' ELSE pg.namalengkap END AS namalengkap,ru.namaruangan AS ruanganapotik, " & _
             " CASE WHEN kp.kelompokpasien = 'Umum/Pribadi' THEN sp.totalharusdibayar ELSE 0 END AS tunai,CASE WHEN kp.kelompokpasien <> 'Umum/Pribadi' THEN sp.totalprekanan ELSE 0 END AS penjamin " & _
             " FROM strukresep_t as sr " & _
             " INNER JOIN pelayananpasien_t AS pp ON pp.strukresepfk = sr.norec " & _
             " INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec=sr.pasienfk " & _
             " INNER JOIN pasiendaftar_t AS pd ON pd.norec=apd.noregistrasifk " & _
             " INNER JOIN pasien_m AS ps ON ps.id=pd.nocmfk " & _
             " LEFT JOIN jeniskelamin_m AS jk ON jk.id=ps.objectjeniskelaminfk " & _
             " LEFT JOIN pegawai_m AS pg ON pg.id=sr.penulisresepfk " & _
             " LEFT JOIN ruangan_m AS ru ON ru.id=sr.ruanganfk " & _
             " LEFT JOIN kelompokpasien_m kp ON kp.id=pd.objectkelompokpasienlastfk " & _
             " INNER JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk " & _
             " WHERE sr.tglresep BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
             "" & str1 & " " & str2 & " " & str3 & " "

    strSQL = strSQL & " UNION ALL " & _
             " SELECT CONVERT(VARCHAR, sp.tglstruk, 105) AS tglresep,sp.nostruk AS noresep,'-' AS noregistrasi,'-' AS nocm, " & _
             " UPPER(sp.namapasien_klien) AS namapasien,'-' AS jeniskelamin,'Umum/Pribadi' as kelompokpasien, " & _
             " CASE WHEN pg.namalengkap IS NULL THEN '-' ELSE pg.namalengkap END AS namalengkap,ru.namaruangan AS ruanganapotik, " & _
             " sp.totalharusdibayar AS tunai, 0 AS penjamin " & _
             " FROM strukpelayanan_t as sp " & _
             " LEFT JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec " & _
             " LEFT JOIN pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk " & _
             " INNER JOIN strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk " & _
             " LEFT JOIN pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk " & _
             " LEFT JOIN loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk " & _
             " LEFT JOIN pegawai_m as pg3 on pg3.id = lu.objectpegawaifk " & _
             " LEFT JOIN ruangan_m as ru on ru.id=sp.objectruanganfk " & _
             " WHERE sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
             " AND sp.nostruk_intern='-' AND substring(sp.nostruk,1,2)='OB' " & _
             "" & str5 & " " & str4 & " "
             
    strSQL = strSQL & " UNION ALL " & _
             " SELECT  CONVERT(VARCHAR, sp.tglstruk, 105) AS tglresep,sp.nostruk AS noresep,'-' AS noregistrasi,ps.nocm, " & _
             " UPPER(sp.namapasien_klien) AS namapasien,UPPER(jk.reportdisplay) AS jeniskelamin, " & _
             " 'Umum/Pribadi' as kelompokpasien,CASE WHEN pg.namalengkap IS NULL THEN '-' ELSE pg.namalengkap END AS namalengkap, " & _
             " ru.namaruangan AS ruanganapotik,sp.totalharusdibayar AS tunai, 0 AS penjamin " & _
             " FROM strukpelayanan_t as sp " & _
             " INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec " & _
             " INNER JOIN strukbuktipenerimaan_t as sbm on sbm.norec = sp.nosbmlastfk " & _
             " LEFT JOIN pegawai_m as pg2 on pg2.id = sbm.objectpegawaipenerimafk " & _
             " LEFT JOIN loginuser_s as lu on lu.objectpegawaifk = sbm.objectpegawaipenerimafk " & _
             " LEFT JOIN pasien_m as ps on ps.nocm=sp.nostruk_intern " & _
             " LEFT JOIN jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
             " LEFT JOIN pegawai_m as pg on pg.id=sp.objectpegawaipenanggungjawabfk " & _
             " LEFT JOIN ruangan_m as ru on ru.id=sp.objectruanganfk " & _
             " WHERE sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
             " AND sp.nostruk_intern not in ('-') AND substring(sp.nostruk,1,2)='OB' " & _
             "" & str5 & " " & str4 & "" & _
             " ) AS x GROUP BY x.tglresep,x.noresep,x.noregistrasi,x.nocm,x.namapasien, " & _
             " x.jeniskelamin,x.kelompokpasien,x.namalengkap,x.ruanganapotik"


            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            
            .database.AddADOCommand CN_String, adoReport
            
            .txtPrinted.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .txtRuangan.SetText "Ruangan : " & namaruangan
            .usKelompokPasien.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usTglResep.SetUnboundFieldSource ("{ado.tglresep}")
            .usNoResep.SetUnboundFieldSource ("{ado.noresep}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usNorm.SetUnboundFieldSource ("{ado.nocm}")
            .ucTunai.SetUnboundFieldSource ("{ado.tunai}")
            .ucPenjamin.SetUnboundFieldSource ("{ado.penjamin}")
            
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
