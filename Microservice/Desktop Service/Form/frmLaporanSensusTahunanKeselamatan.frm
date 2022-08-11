VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLaporanSensusTahunanKeselamatan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmLaporanSensusTahunanKeselamatan.frx":0000
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
Attribute VB_Name = "frmLaporanSensusTahunanKeselamatan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanSensusTahunanKeselamatan
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
    Set frmLaporanSensusTahunanKeselamatan = Nothing
End Sub

Public Sub Cetak(tglAwal As String, tglAkhir As String, strIdRuangan As String, strUser As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmLaporanSensusTahunanKeselamatan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, strFilter1 As String
Dim namaUser As String
Set Report = New crLaporanSensusTahunanKeselamatan

namaUser = ""
If strUser <> "" Then
   namaUser = strUser
End If

If tglAwal <> "" And tglAkhir <> "" Then
   strFilter = Format(tglAwal, "yyyy")
End If

If strIdRuangan <> "" Then
   strFilter = strFilter & " AND ru1.id = '" & strIdRuangan & "' "
End If
            
     strSQL = " SELECT x.jenis,x.jeniskesalamatanfk,x.jeniskeselamatan,x.insidenkeselamatanfk,x.namakeselamatan, " & _
              " SUM(x.jan) as jan,SUM(x.feb) as feb,SUM(x.mar) as mar,SUM(x.apr) as apr,SUM(x.mei) as mei, " & _
              " SUM(x.jun) as jun,SUM(x.jul) as jul,SUM(x.ags) as ags,SUM(x.sep) as sep,SUM(x.okt) as okt, " & _
              " SUM(x.nov) as nov,SUM(x.des) as des,x.nourut " & _
              " FROM (SELECT jk.nourut + '. ' + jk.jeniskeselamatan as jenis,ik.jeniskesalamatanfk, " & _
              " jk.jeniskeselamatan,ik.id as insidenkeselamatanfk,ik.namakeselamatan, " & _
              " 0 as jan,0 as feb,0 as mar,0 as apr,0 as mei,0 as jun,0 as jul,0 as ags, " & _
              " 0 as sep,0 as okt,0 as nov,0 as des,ik.nourut " & _
              " FROM jeniskeselamatan_m as jk " & _
              " INNER JOIN insidenkeselamatan_m as ik on ik.jeniskesalamatanfk = jk.id "
     strSQL = strSQL & " UNION ALL SELECT jk.nourut + '. ' + jk.jeniskeselamatan as jenis,ikn.jeniskesalamatanfk, " & _
              " jk.jeniskeselamatan,ii.insidenkeselamatanfk,ikn.namakeselamatan,CASE WHEN MONTH(ii.tglinsiden) = 1 THEN COUNT(ikn.namakeselamatan) ELSE 0 END as jan, " & _
              " CASE WHEN MONTH(ii.tglinsiden) = 2 THEN COUNT(ikn.namakeselamatan) ELSE 0 END as feb, " & _
              " CASE WHEN MONTH(ii.tglinsiden) = 3 THEN COUNT(ikn.namakeselamatan) ELSE 0 END as mar, " & _
              " CASE WHEN MONTH(ii.tglinsiden) = 4 THEN COUNT(ikn.namakeselamatan) ELSE 0 END as apr, " & _
              " CASE WHEN MONTH(ii.tglinsiden) = 5 THEN COUNT(ikn.namakeselamatan) ELSE 0 END as mei, " & _
              " CASE WHEN MONTH(ii.tglinsiden) = 6 THEN COUNT(ikn.namakeselamatan) ELSE 0 END as jun, " & _
              " CASE WHEN MONTH(ii.tglinsiden) = 7 THEN COUNT(ikn.namakeselamatan) ELSE 0 END as jul, " & _
              " CASE WHEN MONTH(ii.tglinsiden) = 8 THEN COUNT(ikn.namakeselamatan) ELSE 0 END as ags, " & _
              " CASE WHEN MONTH(ii.tglinsiden) = 9 THEN COUNT(ikn.namakeselamatan) ELSE 0 END as sep, " & _
              " CASE WHEN MONTH(ii.tglinsiden) = 10 THEN COUNT(ikn.namakeselamatan) ELSE 0 END as okt, " & _
              " CASE WHEN MONTH(ii.tglinsiden) = 11 THEN COUNT(ikn.namakeselamatan) ELSE 0 END as nov, " & _
              " CASE WHEN MONTH(ii.tglinsiden) = 12 THEN COUNT(ikn.namakeselamatan) ELSE 0 END as des,ikn.nourut " & _
              " FROM laporaninsideninternal_t as ii " & _
              " INNER JOIN pasiendaftar_t as pd on pd.norec = ii.noregistrasifk " & _
              " INNER JOIN lembarkerjainvestigasi_t as lk on lk.laporaninsidenfk = ii.norec " & _
              " INNER JOIN insidenkeselamatan_m as ikn on ikn.id = ii.insidenkeselamatanfk " & _
              " INNER JOIN jeniskeselamatan_m as jk on jk.id = ikn.jeniskesalamatanfk " & _
              " INNER JOIN pasien_m as pm on pm.id = pd.nocmfk " & _
              " LEFT JOIN ruangan_m as ru on ru.id = pd.objectruanganlastfk " & _
              " WHERE YEAR(ii.tglinsiden) = '" & strFilter & "' " & _
              " GROUP BY jk.nourut,jk.jeniskeselamatan,ikn.jeniskesalamatanfk, " & _
              " jk.jeniskeselamatan,ii.insidenkeselamatanfk,ikn.namakeselamatan,ii.tglinsiden,ikn.nourut) as x " & _
              " GROUP BY x.jenis,jeniskesalamatanfk,x.jeniskeselamatan,x.insidenkeselamatanfk,x.namakeselamatan,x.nourut ORDER BY x.jenis ASC "

    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
             .txtUser.SetText namaUser
             .txtTgl.SetText "TAHUN " & Format(tglAwal, "yyyy")
             .usJenisKeselamatan.SetUnboundFieldSource ("{ado.jenis}")
             .usInsidenKeselamatan.SetUnboundFieldSource ("{ado.namakeselamatan}")
             .usKdInsiden.SetUnboundFieldSource ("{ado.insidenkeselamatanfk}")
             .unJan.SetUnboundFieldSource ("{ado.jan}")
             .unFeb.SetUnboundFieldSource ("{ado.feb}")
             .unMar.SetUnboundFieldSource ("{ado.mar}")
             .unApr.SetUnboundFieldSource ("{ado.apr}")
             .unMei.SetUnboundFieldSource ("{ado.mei}")
             .unJun.SetUnboundFieldSource ("{ado.jun}")
             .unJul.SetUnboundFieldSource ("{ado.jul}")
             .unAgs.SetUnboundFieldSource ("{ado.ags}")
             .unSept.SetUnboundFieldSource ("{ado.sep}")
             .unOkt.SetUnboundFieldSource ("{ado.okt}")
             .unNov.SetUnboundFieldSource ("{ado.nov}")
             .unDes.SetUnboundFieldSource ("{ado.des}")
             .txtPelaporan.SetText strUser
             .txtUser.SetText strUser
             .unNomor.SetUnboundFieldSource ("{ado.nourut}")
            
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
