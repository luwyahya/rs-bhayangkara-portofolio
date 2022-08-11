VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRKIP 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCRKIP.frx":0000
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
      EnableExportButton=   0   'False
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
Attribute VB_Name = "frmCRKIP"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crCetakKIP
Dim bolSuppresDetailSection10 As Boolean
Dim ii As Integer
Dim tempPrint1 As String
Dim p As Printer
Dim p2 As Printer
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "Kwitansi")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRKIP = Nothing
End Sub

Public Sub CetakKIP(strNoregistrasi As String, jumlahCetak As Integer, strIdPegawai As String, view As String)
On Error GoTo errLoad
Dim strKet As Boolean

    strKet = True
    
    Set frmCRKIP = Nothing
    Set Report = New crCetakKIP
    
    ReadRs "select pd.noregistrasi,pd.tglregistrasi,pd.tglpulang,ps.nocm,ps.namapasien,ps.objectjeniskelaminfk," & _
            "ru.namaruangan,kp.kelompokpasien, pg.namalengkap " & _
            "from pasiendaftar_t pd " & _
            "INNER JOIN pasien_m ps on ps.id=pd.nocmfk " & _
            "INNER JOIN ruangan_m ru on ru.id=pd.objectruanganlastfk " & _
            "INNER JOIN kelompokpasien_m kp on kp.id=pd.objectkelompokpasienlastfk " & _
            "INNER JOIN pegawai_m as pg on pg.id=pd.objectpegawaifk " & _
            "where noregistrasi='" & strNoregistrasi & "'"
    
    With Report
        If Not rs.EOF Then
            .txtNoreg.SetText rs!Noregistrasi
            .txtNoMR.SetText rs!noCm
            .TxtNama.SetText rs!namapasien
            .txtRuangRawat.SetText rs!namaruangan
            .txtPegawai.SetText rs!namalengkap
            .txtTglMasuk.SetText Format(rs!tglRegistrasi, "dd/MM/yyyy HH:mm")
            .txtTglPulang.SetText Format(rs!tglpulang, "dd/MM/yyyy HH:mm")
            '.txtKp.SetText RS!kelompokpasien
            .txtPrintTglBKM.SetText "Jakarta, " & Format(Now(), "dd MMM yyyy")
            .txtPetugasCetak.SetText strIdPegawai
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "Kwitansi")
                Report.SelectPrinter "winspool", strPrinter, "Ne00:"
                Report.PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Report
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        End If
    End With
Exit Sub
errLoad:
End Sub

