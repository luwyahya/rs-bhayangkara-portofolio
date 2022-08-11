VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakLabelFarmasiTPN 
   Caption         =   "Transmedic"
   ClientHeight    =   7965
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5895
   Icon            =   "frmCetakLabelFarmasiTPN.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7965
   ScaleWidth      =   5895
   WindowState     =   2  'Maximized
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
      Width           =   2775
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
      TabIndex        =   1
      Top             =   480
      Width           =   975
   End
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
      TabIndex        =   0
      Top             =   480
      Width           =   1095
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   7935
      Left            =   0
      TabIndex        =   3
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
      EnableExportButton=   0   'False
      EnableSearchExpertButton=   0   'False
      EnableHelpButton=   0   'False
   End
End
Attribute VB_Name = "frmCetakLabelFarmasiTPN"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New Cr_cetakLabelFarmasiTPN
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

    Set frmCetakLabelFarmasiTPN = Nothing
End Sub

Public Sub CetakLabelFarmasi(norec As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
    Dim str1 As String
    
    If norec <> "" Then
        str1 = "sr.norec='" & norec & " '"
    End If
Set frmCetakLabelFarmasiTPN = Nothing
Dim adocmd As New ADODB.Command
    
Set Report = New Cr_cetakLabelFarmasiTPN
    strSQL = "select ps.namapasien, ps.nocm, ps.tgllahir, ru.namaruangan, sr.tglresep, pr.namaproduk " & _
            "from pelayananpasien_t as pp " & _
            "inner join strukresep_t as sr on sr.norec= pp.strukresepfk " & _
            "inner join produk_m as pr on pr.id = pp.produkfk " & _
            "inner join antrianpasiendiperiksa_t as apd on apd.norec = pp.noregistrasifk " & _
            "inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
            "inner join pasien_m as ps on ps.id = pd.nocmfk " & _
            "inner join ruangan_m as ru on ru.id = apd.objectruanganfk " & _
            "where " & _
            str1 & _
            "order by sr.noresep"
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            '.udKadaluarsa.SetUnboundFieldSource ("{ado.tglresep}")
            .usCM.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
            .usObat.SetUnboundFieldSource ("{ado.namaproduk}")
            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LabelFarmasi")
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
