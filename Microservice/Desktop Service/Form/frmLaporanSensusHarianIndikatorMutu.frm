VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLaporanSensusHarianIndikatorMutu 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmLaporanSensusHarianIndikatorMutu.frx":0000
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
Attribute VB_Name = "frmLaporanSensusHarianIndikatorMutu"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanSensusIndikatorMutu
'Dim Report As New crLaporanPasienDaftar
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "PasienDaftar")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Set frmLaporanSensusHarianIndikatorMutu = Nothing
End Sub

Public Sub Cetak(tanggal As String, strIdDept As String, strIdRuangan As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmLaporanSensusHarianIndikatorMutu = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, strFilterRuangan, strFilterDept As String
Dim namaUser As String
Set Report = New crLaporanSensusIndikatorMutu

'namaUser = ""
'If strUser <> "" Then
'   namaUser = strUser
'End If

If tanggal <> "" Then
   strFilter = " WHERE ir.statusenabled = 1 AND format (sm.tglnilai, 'yyyy-MM') = '" & tanggal & "' "
End If

If strIdDept <> "" Then
   strFilter = strFilter & " AND sm.departemenfk = '" & strIdDept & "' "
   strFilterRuangan = " WHERE head.objectdepartemenfk = '" & strIdDept & "' and head.statusenabled = 1 "
End If

If strIdRuangan <> "" Then
   strFilter = strFilter & " AND sm.ruanganfk = '" & strIdRuangan & "' "
End If
            
     strSQL = " SELECT x.indikator,x.keterangan,SUM(x.[1]) as '1',SUM(x.[2]) as '2', SUM(x.[3]) as '3', SUM(x.[4]) as '4', SUM(x.[5]) as '5', SUM(x.[6]) as '6',SUM(x.[7]) as '7', SUM(x.[8]) as '8', SUM(x.[9]) as '9', SUM(x.[10]) as '10', SUM(x.[11]) as '11', SUM(x.[12]) as '12', " & _
              " SUM(x.[13]) as '13', SUM(x.[14]) as '14', SUM(x.[15]) as '15', SUM(x.[16]) as '16', SUM(x.[17]) as '17', SUM(x.[18]) as '18',SUM(x.[19]) as '19', SUM(x.[20]) as '20',SUM(x.[21]) as '21',SUM(x.[22]) as '22', SUM(x.[23]) as '23', SUM(x.[24]) as '24', " & _
              " SUM(x.[25]) as '25',SUM(x.[26]) as '26', SUM(x.[27]) as '27', SUM(x.[28]) as '28', SUM(x.[29]) as '29', SUM(x.[30]) as '30', SUM(x.[31]) as '31' " & _
              " FROM(SELECT head.indikator,'DENUM' AS keterangan,0 as '1',0 as '2',0 as '3',0 as '4',0 as '5',0 as '6',0 as '7',0 as '8',0 as '9',0 as '10',0 as '11',0 as '12',0 as '13',0 as '14',0 as '15',0 as '16',0 as '17',0 as '18',0 as '19', " & _
              " 0 as '20',0 as '21',0 as '22',0 as '23',0 as '24',0 as '25',0 as '26',0 as '27',0 as '28',0 as '29',0 as '30',0 as '31' FROM indikatorrensar_m AS head " & _
              strFilterRuangan
     strSQL = strSQL & " UNION ALL SELECT head.indikator,'NUM' AS keterangan,0 as '1',0 as '2',0 as '3',0 as '4',0 as '5',0 as '6',0 as '7',0 as '8',0 as '9',0 as '10',0 as '11',0 as '12',0 as '13',0 as '14',0 as '15',0 as '16',0 as '17',0 as '18',0 as '19', " & _
              " 0 as '20',0 as '21',0 as '22',0 as '23',0 as '24',0 as '25',0 as '26',0 as '27',0 as '28',0 as '29',0 as '30',0 as '31' FROM indikatorrensar_m AS head " & _
              strFilterRuangan
     strSQL = strSQL & " UNION ALL SELECT ir.indikator,sm.keterangan,CASE WHEN day(sm.tgl) = 1 THEN sm.nilai ELSE 0 END as '1',CASE WHEN day(sm.tgl) = 2 THEN sm.nilai ELSE 0 END as '2', " & _
              " CASE WHEN day(sm.tgl) = 3 THEN sm.nilai ELSE 0 END as '3',CASE WHEN day(sm.tgl) = 4 THEN sm.nilai ELSE 0 END as '4',CASE WHEN day(sm.tgl) = 5 THEN sm.nilai ELSE 0 END as '5',CASE WHEN day(sm.tgl) = 6 THEN sm.nilai ELSE 0 END as '6', " & _
              " CASE WHEN day(sm.tgl) = 7 THEN sm.nilai ELSE 0 END as '7',CASE WHEN day(sm.tgl) = 8 THEN sm.nilai ELSE 0 END as '8',CASE WHEN day(sm.tgl) = 9 THEN sm.nilai ELSE 0 END as '9',CASE WHEN day(sm.tgl) = 10 THEN sm.nilai ELSE 0 END as '10', " & _
              " CASE WHEN day(sm.tgl) = 11 THEN sm.nilai ELSE 0 END as '11',CASE WHEN day(sm.tgl) = 12 THEN sm.nilai ELSE 0 END as '12',CASE WHEN day(sm.tgl) = 13 THEN sm.nilai ELSE 0 END as '13',CASE WHEN day(sm.tgl) = 14 THEN sm.nilai ELSE 0 END as '14', " & _
              " CASE WHEN day(sm.tgl) = 15 THEN sm.nilai ELSE 0 END as '15',CASE WHEN day(sm.tgl) = 16 THEN sm.nilai ELSE 0 END as '16',CASE WHEN day(sm.tgl) = 17 THEN sm.nilai ELSE 0 END as '17',CASE WHEN day(sm.tgl) = 18 THEN sm.nilai ELSE 0 END as '18', " & _
              " CASE WHEN day(sm.tgl) = 19 THEN sm.nilai ELSE 0 END as '19',CASE WHEN day(sm.tgl) = 20 THEN sm.nilai ELSE 0 END as '20',CASE WHEN day(sm.tgl) = 21 THEN sm.nilai ELSE 0 END as '21',CASE WHEN day(sm.tgl) = 22 THEN sm.nilai ELSE 0 END as '22', " & _
              " CASE WHEN day(sm.tgl) = 23 THEN sm.nilai ELSE 0 END as '23',CASE WHEN day(sm.tgl) = 24 THEN sm.nilai ELSE 0 END as '24',CASE WHEN day(sm.tgl) = 25 THEN sm.nilai ELSE 0 END as '25',CASE WHEN day(sm.tgl) = 26 THEN sm.nilai ELSE 0 END as '26', " & _
              " CASE WHEN day(sm.tgl) = 27 THEN sm.nilai ELSE 0 END as '27',CASE WHEN day(sm.tgl) = 28 THEN sm.nilai ELSE 0 END as '28',CASE WHEN day(sm.tgl) = 29 THEN sm.nilai ELSE 0 END as '29',CASE WHEN day(sm.tgl) = 30 THEN sm.nilai ELSE 0 END as '30', " & _
              " CASE WHEN day(sm.tgl) = 31 THEN sm.nilai ELSE 0 END as '31' FROM sasaranmutu_t AS sm " & _
              " INNER JOIN indikatorrensar_m as ir on ir.id = sm.indikatorfk " & _
              strFilter & " GROUP BY ir.indikator,sm.keterangan,sm.tgl,sm.nilai ) as x " & _
              " GROUP BY x.indikator,x.keterangan ORDER BY x.indikator ASC "

    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
'             .txtUser.SetText namaUser
             .txtTgl.SetText "BULAN " & Format(tanggal, "MMMM")
             .usInsidenKeselamatan.SetUnboundFieldSource ("{ado.indikator}")
             .usKeterangan.SetUnboundFieldSource ("{ado.keterangan}")
             .UnboundNumber2.SetUnboundFieldSource ("{ado.1}")
             .UnboundNumber3.SetUnboundFieldSource ("{ado.2}")
             .UnboundNumber4.SetUnboundFieldSource ("{ado.3}")
             .UnboundNumber5.SetUnboundFieldSource ("{ado.4}")
             .UnboundNumber6.SetUnboundFieldSource ("{ado.5}")
             .UnboundNumber7.SetUnboundFieldSource ("{ado.6}")
             .UnboundNumber8.SetUnboundFieldSource ("{ado.7}")
             .UnboundNumber9.SetUnboundFieldSource ("{ado.8}")
             .UnboundNumber10.SetUnboundFieldSource ("{ado.9}")
             .UnboundNumber11.SetUnboundFieldSource ("{ado.10}")
             .UnboundNumber12.SetUnboundFieldSource ("{ado.11}")
             .UnboundNumber13.SetUnboundFieldSource ("{ado.12}")
             .UnboundNumber14.SetUnboundFieldSource ("{ado.13}")
             .UnboundNumber15.SetUnboundFieldSource ("{ado.14}")
             .UnboundNumber16.SetUnboundFieldSource ("{ado.15}")
             .UnboundNumber17.SetUnboundFieldSource ("{ado.16}")
             .UnboundNumber18.SetUnboundFieldSource ("{ado.17}")
             .UnboundNumber19.SetUnboundFieldSource ("{ado.18}")
             .UnboundNumber20.SetUnboundFieldSource ("{ado.19}")
             .UnboundNumber21.SetUnboundFieldSource ("{ado.20}")
             .UnboundNumber22.SetUnboundFieldSource ("{ado.21}")
             .UnboundNumber23.SetUnboundFieldSource ("{ado.22}")
             .UnboundNumber24.SetUnboundFieldSource ("{ado.23}")
             .UnboundNumber25.SetUnboundFieldSource ("{ado.24}")
             .UnboundNumber26.SetUnboundFieldSource ("{ado.25}")
             .UnboundNumber27.SetUnboundFieldSource ("{ado.26}")
             .UnboundNumber28.SetUnboundFieldSource ("{ado.27}")
             .UnboundNumber29.SetUnboundFieldSource ("{ado.28}")
             .UnboundNumber30.SetUnboundFieldSource ("{ado.29}")
             .UnboundNumber31.SetUnboundFieldSource ("{ado.30}")
             .UnboundNumber32.SetUnboundFieldSource ("{ado.31}")
'             .txtPelapor.SetText strUser
'             .txtUser.SetText strUser
'             .usNo.SetUnboundFieldSource ("{ado.nourut}")
             
            If view = "false" Then
                Dim strPrinter As String
                strPrinter = GetTxt("Setting.ini", "Printer", "PasienDaftar")
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
