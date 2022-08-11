VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakLapSensusHarian 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCetakLapSensusHarian.frx":0000
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
Attribute VB_Name = "frmCetakLapSensusHarian"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crCetakLapSensusHarian

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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "EMR-SuratPernyataanPenolakan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCetakLapSensusHarian = Nothing
End Sub

Public Sub Cetak(tglAwal As String, tglAkhir As String, view As String)

Set frmCetakLapSensusHarian = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, strFilter1 As String

Set Report = New crCetakLapSensusHarian

      
    strSQL = " SELECT    COUNT (pd.norec) AS jml,    pd.objectruanganlastfk, " & _
                " ru.namaruangan,   pd.objectkelasfk,   kl.namakelas, " & _
                " CASE WHEN p.objectjeniskelaminfk = 2 THEN 'TERISI WANITA'ELSE 'TERISI PRIA'END AS keterangan " & _
                " FROM pasiendaftar_t AS pd " & _
                " INNER JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk " & _
                " INNER JOIN pasien_m AS p ON p.id = pd.nocmfk " & _
                " INNER JOIN kelas_m AS kl ON kl.id = pd.objectkelasfk " & _
                " WHERE     ru.objectdepartemenfk = 16 AND pd.tglpulang IS NULL " & _
                " GROUP BY  pd.objectruanganlastfk, ru.namaruangan, pd.objectkelasfk,   kl.namakelas, " & _
                " CASE WHEN p.objectjeniskelaminfk = 2 THEN 'TERISI WANITA' ELSE    'TERISI PRIA' END "


    strSQL2 = strSQL & " union all " & _
            " SELECT kmr.qtybed as jml, kmr.objectruanganfk,ru.namaruangan,  kmr.objectkelasfk,kls.namakelas, " & _
                " 'KAPASITAS' as keterangan  FROM kamar_m as kmr " & _
                " INNER JOIN kelas_m as kls On kls.id=kmr.objectkelasfk " & _
                " INNER JOIN ruangan_m as ru On ru.id=kmr.objectruanganfk " & _
                " where ru.objectdepartemenfk=16 "


    
    adocmd.CommandText = strSQL2
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
           

           .unQty.SetUnboundFieldSource ("{ado.jml}")
           .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
           .usKelas.SetUnboundFieldSource ("{ado.namakelas}")
           .usKeterangan.SetUnboundFieldSource ("{ado.keterangan}")
           
           If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "EMR-SuratPernyataanPenolakan")
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






