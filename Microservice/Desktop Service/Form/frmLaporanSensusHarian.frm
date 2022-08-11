VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLaporanSensusHarian 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmLaporanSensusHarian.frx":0000
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
      Height          =   6975
      Left            =   0
      TabIndex        =   4
      Top             =   0
      Width           =   5895
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
Attribute VB_Name = "frmLaporanSensusHarian"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crCetakSensusHarianRawatInap
'Dim bolSuppresDetailSection10 As Boolean
'Dim ii As Integer
'Dim tempPrint1 As String
'Dim p As Printer
'Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String
Dim Tgl As Date

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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LaporanPasienPulang")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmLaporanSensusHarian = Nothing
End Sub
Public Sub Cetak(ID As String, tglAwal As String, tglAkhir As String, strUserLogin As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Set frmLaporanSensusHarian = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, orderby As String
Set Report = New crCetakSensusHarianRawatInap
Dim setTgl As Date
setTgl = tglAwal
        
    strSQL = " SELECT x.namaruangan,SUM(x.kelasDua) AS kelasDua,SUM(x.kelasSatu) AS kelasSatu,SUM(x.kelasVip) AS kelasVip,SUM (x.kelasVvip) AS kelasVvip,SUM(x.byr) AS byr,SUM(x.pbi) AS pbi,SUM(x.jkd) AS jkd, " & _
             "SUM(x.npbi) AS npbi,SUM(x.kelasDuaC) AS kelasDuaC,SUM(x.kelasSatuC) AS kelasSatuC,SUM(x.kelasVipC) AS kelasVipC,SUM(x.kelasVvipC) AS kelasVvipC,SUM (x.byrC) AS byrC,SUM(x.pbiC) AS pbiC, " & _
             "SUM(x.jkdC) AS jkdC,SUM(x.npbiC) AS npbiC,SUM(x.kelasTigaK) AS kelasTigaK,SUM(x.kelasDuaK) AS kelasDuaK,SUM(x.kelasSatuK) AS kelasSatuK,SUM(x.kelasVipK) AS kelasVipK, " & _
             "SUM(x.kelasVvipK) As kelasVvipK FROM (SELECT ru.namaruangan,CASE WHEN rpp.objectkelasfk = 2 THEN 1 ELSE 0 END AS kelasDua,CASE WHEN rpp.objectkelasfk = 3 THEN 1 ELSE 0 END AS kelasSatu, " & _
             "CASE WHEN rpp.objectkelasfk = 4 THEN 1 ELSE 0 END AS kelasVip,CASE WHEN rpp.objectkelasfk = 7 THEN 1 ELSE 0 END AS kelasVvip,CASE WHEN rpp.objectkelasfk = 1 AND pd.objectkelompokpasienlastfk = 1 THEN 1 ELSE 0 END AS byr, " & _
             "CASE WHEN rpp.objectkelasfk = 1 AND pd.objectkelompokpasienlastfk = 10 THEN 1 ELSE 0 END AS pbi,CASE WHEN rpp.objectkelasfk = 1 AND pd.objectkelompokpasienlastfk = 8 THEN 1 ELSE 0 END AS jkd, " & _
             "CASE WHEN pd.objectkelompokpasienlastfk = 4 THEN 1 ELSE 0 END AS npbi,0 AS kelasDuaC,0 AS kelasSatuC,0 AS kelasVipC,0 AS kelasVvipC,0 AS byrC,0 AS pbiC,0 AS jkdC,0 AS npbiC,0 AS kelasTigaK,0 AS kelasDuaK,0 AS kelasSatuK, " & _
             "0 AS kelasVipK,0 AS kelasVvipK FROM registrasipelayananpasien_t AS rpp " & _
             "INNER JOIN ruangan_m AS ru ON ru.id = rpp.objectruanganfk " & _
             "INNER JOIN tempattidur_m AS tt ON tt.id = rpp.objecttempattidurfk " & _
             "INNER JOIN kamar_m AS km ON km.id = rpp.objectkamarfk " & _
             "INNER JOIN kelas_m AS kls ON kls.id = rpp.objectkelasfk " & _
             "INNER JOIN pasiendaftar_t AS pd ON pd.norec = rpp.noregistrasifk  " & _
             "INNER JOIN pasien_m AS pm ON pm.id = pd.nocmfk  " & _
             "WHERE pd.tglregistrasi < '" & tglAkhir & "' " & _
             "AND pm.objectjeniskelaminfk = 1 AND pd.tglpulang IS NULL "
             
    strSQL = strSQL & " UNION ALL SELECT ru.namaruangan,0 AS kelasDua,0 AS kelasSatu,0 AS kelasVip,0 AS kelasVvip,0 AS byr,0 AS pbi,0 AS jkd,0 AS npbi,CASE WHEN rpp.objectkelasfk = 2 THEN 1 ELSE 0 END AS kelasDuaC, " & _
             "CASE WHEN rpp.objectkelasfk = 3 THEN 1 ELSE 0 END AS kelasSatuC,CASE WHEN rpp.objectkelasfk = 4 THEN 1 ELSE 0 END AS kelasVipC,CASE WHEN rpp.objectkelasfk = 7 THEN 1 ELSE 0 END AS kelasVvipC, " & _
             "CASE WHEN rpp.objectkelasfk = 1 AND pd.objectkelompokpasienlastfk = 1 THEN 1 ELSE 0 END AS byrC,CASE WHEN rpp.objectkelasfk = 1 AND pd.objectkelompokpasienlastfk = 10 THEN 1 ELSE 0 END AS pbiC, " & _
             "CASE WHEN rpp.objectkelasfk = 1 AND pd.objectkelompokpasienlastfk = 8 THEN 1 ELSE 0 END AS jkdC,CASE WHEN pd.objectkelompokpasienlastfk = 4 THEN 1 ELSE 0 END AS npbiC,0 AS kelasTigaK,0 AS kelasDuaK, " & _
             "0 AS kelasSatuK,0 AS kelasVipK,0 AS kelasVvipK FROM registrasipelayananpasien_t AS rpp " & _
             "INNER JOIN ruangan_m AS ru ON ru.id = rpp.objectruanganfk " & _
             "INNER JOIN tempattidur_m AS tt ON tt.id = rpp.objecttempattidurfk " & _
             "INNER JOIN kamar_m AS km ON km.id = rpp.objectkamarfk " & _
             "INNER JOIN kelas_m AS kls ON kls.id = rpp.objectkelasfk " & _
             "INNER JOIN pasiendaftar_t AS pd ON pd.norec = rpp.noregistrasifk " & _
             "INNER JOIN pasien_m AS pm ON pm.id = pd.nocmfk " & _
             "WHERE pd.tglregistrasi < '" & tglAkhir & "' " & _
             "AND pm.objectjeniskelaminfk = 2 AND pd.tglpulang IS NULL "
             
    strSQL = strSQL & " UNION ALL SELECT ru.namaruangan,0 AS kelasDua,0 AS kelasSatu,0 AS kelasVip,0 AS kelasVvip,0 AS byr,0 AS pbi,0 AS jkd,0 AS npbi, " & _
             "0 AS kelasDuaC,0 AS kelasSatuC,0 AS kelasVipC,0 AS kelasVvipC,0 AS byrC,0 AS pbiC,0 AS jkdC,0 AS npbiC,CASE WHEN km.objectkelasfk = 1 THEN 1 ELSE 0 END AS kelasTigaK, " & _
             "CASE WHEN km.objectkelasfk = 2 THEN 1 ELSE 0 END AS kelasDuaK,CASE WHEN km.objectkelasfk = 3 THEN 1 ELSE 0 END AS kelasSatuK,CASE WHEN km.objectkelasfk = 4 THEN 1 ELSE 0 END AS kelasVipK, " & _
             "CASE WHEN km.objectkelasfk = 7 THEN 1 ELSE 0 END AS kelasVvipK FROM tempattidur_m as tt " & _
             "INNER JOIN kamar_m as km on km.id = tt.objectkamarfk " & _
             "INNER JOIN ruangan_m as ru on ru.id = km.objectruanganfk " & _
             "LEFT JOIN statusbed_m as sb on sb.id = tt.objectstatusbedfk " & _
             "LEFT JOIN kelas_m as kls on kls.id = km.objectkelasfk ) AS x " & _
             "GROUP BY x.namaruangan ORDER BY x.namaruangan"
    
    strSQL2 = "SELECT x.rujukan,SUM(x.laki) AS laki,SUM(x.perempuan) AS perempuan " & _
              "FROM(SELECT CASE WHEN ar.id NOT IN (1,2,3,6) THEN 'Pasien Masuk' " & _
              "WHEN ar.id IN (1,2,3) THEN 'Kembali Rujuk' " & _
              "When ar.id IN (6) THEN 'Kembali Rawat' END AS rujukan, " & _
              "CASE WHEN pm.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END AS laki, " & _
              "CASE WHEN pm.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END AS perempuan " & _
              "FROM pasiendaftar_t AS pd " & _
              "INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec " & _
              "INNER JOIN asalrujukan_m AS ar ON ar.id = apd.objectasalrujukanfk " & _
              "INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk " & _
              "INNER JOIN pasien_m AS pm ON pm.id = pd.nocmfk " & _
              "WHERE pd.tglregistrasi BETWEEN '" & tglAwal & "' AND '" & tglAkhir & "' " & _
              "AND ru.objectdepartemenfk IN (16,25)) AS x " & _
              "GROUP BY x.rujukan"
              
    strSQL3 = "SELECT x.keterangan,SUM(x.laki) AS laki,SUM(x.perempuan) AS perempuan " & _
              "FROM(SELECT CASE WHEN sp.id IN (1,2,8,6) THEN 'Pasien Pulang' " & _
              "WHEN sp.id IN (10,11,7) THEN 'Rujuk' " & _
              "WHEN sp.id IN (2) THEN 'Lari' " & _
              "WHEN sp.id IN (9) THEN 'Meninggal' Else 'APK' END AS keterangan, " & _
              "CASE WHEN pm.objectjeniskelaminfk = 1 THEN 1 ELSE 0 END AS laki, " & _
              "CASE WHEN pm.objectjeniskelaminfk = 2 THEN 1 ELSE 0 END AS perempuan " & _
              "FROM pasiendaftar_t AS pd " & _
              "INNER JOIN statuspulang_m as sp on sp.id = pd.objectstatuspulangfk " & _
              "INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk " & _
              "INNER JOIN pasien_m AS pm ON pm.id = pd.nocmfk " & _
              "WHERE pd.tglpulang BETWEEN '" & tglAwal & "' AND '" & tglAkhir & "' " & _
              "AND ru.objectdepartemenfk IN (16,25)) AS x " & _
              "GROUP BY x.keterangan"
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
        .usNamaBangsal.SetUnboundFieldSource ("{ado.namaruangan}")
        .unVvipK.SetUnboundFieldSource ("{ado.kelasVvipK}")
        .unVipK.SetUnboundFieldSource ("{ado.kelasVipK}")
        .unKelasIK.SetUnboundFieldSource ("{ado.kelasSatuK}")
        .unKelasIIK.SetUnboundFieldSource ("{ado.kelasDuaK}")
        .unKelasIIIK.SetUnboundFieldSource ("{ado.kelasTigaK}")
        .unVvipP.SetUnboundFieldSource ("{ado.kelasVvip}")
        .unVipP.SetUnboundFieldSource ("{ado.kelasVip}")
        .unKelasIP.SetUnboundFieldSource ("{ado.kelasSatu}")
        .unKelasIIP.SetUnboundFieldSource ("{ado.kelasDua}")
        .unByrP.SetUnboundFieldSource ("{ado.byr}")
        .unBpbiP.SetUnboundFieldSource ("{ado.pbi}")
        .unJkdP.SetUnboundFieldSource ("{ado.jkd}")
        .unPbiP.SetUnboundFieldSource ("{ado.npbi}")
        .unKelasIC.SetUnboundFieldSource ("{ado.kelasSatuC}")
        .unKelasIIC.SetUnboundFieldSource ("{ado.kelasDuaC}")
        .unByrC.SetUnboundFieldSource ("{ado.byrC}")
        .unBpbiC.SetUnboundFieldSource ("{ado.pbiC}")
        .unJkdC.SetUnboundFieldSource ("{ado.jkdC}")
        .unPbiC.SetUnboundFieldSource ("{ado.npbiC}")
        .txtUser.SetText strUserLogin
        .txtTgl.SetText "Surakarta Hari Tgl " & getHari(tglAwal) & "," & Format(tglAwal, "dd") & " " & getBulan(setTgl) & " " & Format(tglAwal, "yyyy")
         Report.Subreport2.Suppress = False
        Dim adojenis As New ADODB.Command
        Set adojenis = New ADODB.Command
        adojenis.CommandText = strSQL2
        adojenis.CommandType = adCmdText
        Report.Subreport2.OpenSubreport.database.AddADOCommand CN_String, adojenis
        With Report
            .Subreport2_usKeterangan.SetUnboundFieldSource ("{ado.rujukan}")
            .Subreport2_unL.SetUnboundFieldSource ("{ado.laki}")
            .Subreport2_unP.SetUnboundFieldSource ("{ado.perempuan}")
        End With
        Dim adojenisDua As New ADODB.Command
        Set adojenisDua = New ADODB.Command
        adojenisDua.CommandText = strSQL3
        adojenisDua.CommandType = adCmdText
'        Report.Subreport2.OpenSubreport.database.AddADOCommand CN_String, adojenis
        If view = "false" Then
            Dim strPrinter As String
            strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPasienPulang")
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

