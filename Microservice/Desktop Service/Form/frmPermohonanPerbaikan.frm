VERSION 5.00
Begin VB.Form frmPermohonanPerbaikan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmPermohonanPerbaikan.frx":0000
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
   Begin VB.PictureBox CRViewer1 
      Height          =   7000
      Left            =   0
      ScaleHeight     =   6945
      ScaleWidth      =   5745
      TabIndex        =   0
      Top             =   0
      Width           =   5800
   End
   Begin VB.TextBox txtNamaFormPengirim 
      Height          =   495
      Left            =   3120
      TabIndex        =   1
      Top             =   600
      Width           =   2175
   End
End
Attribute VB_Name = "frmPermohonanPerbaikan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim ReportPermohonan As New crCetakPermohonanPerbaikan
Dim adoReport As New ADODB.Command
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
    Set frmPermohonanPerbaikan = Nothing
End Sub

Public Sub Cetak(strNorec As String, view As String, strUser As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim adocmd As New ADODB.Command
Dim namaUser As String
Set frmPermohonanPerbaikan = Nothing
If strUser <> "" Then
    namaUser = strUser
Else
    namaUser = ""
End If
    
    With ReportPermohonan
        Set adoReport = New ADODB.Command
        adoReport.ActiveConnection = CN_String
        strSQL = " SELECT stp.norec,rg.namaruangan,stp.tglplanning,pg.nama,stp.startdate,stp.duedate,stp.rincianexecuteplanning_askep, " & _
                 " stp.pelapor,stp.deskripsiplanning,stp.keteranganverifikasi,sttp.namaexternal,stp.signdate,stp.worklist,stp.keteranganverifikasi, " & _
                 " pg2.nama as namainspektor, pg3.nama as namapelapor,sttp.reportdisplay as statuspekerjaan,jpk.reportdisplay as jeniskerusakan,jpk2.reportdisplay as jenisalat " & _
                 " FROM strukplanning_t as stp " & _
                 " INNER JOIN ruangan_m as rg on rg.id = stp.objectruanganfk " & _
                 " LEFT JOIN pegawai_m as pg on pg.id = stp.objectpegawaipjawabfk " & _
                 " LEFT JOIN pegawai_m as pg2 on pg2.id = stp.objectpegawaipjawabevaluasifk " & _
                 " LEFT JOIN pegawai_m as pg3 on pg3.id = stp.narasumberfk " & _
                 " LEFT JOIN statuspekerjaan_m as sttp on sttp.id = stp.objectstatuspekerjaanfk " & _
                 " LEFT JOIN jenispekerjaan_m as jpk on jpk.id = stp.objectjenispekerjaanfk " & _
                 " LEFT JOIN jenispekerjaan_m as jpk2 on jpk2.id = stp.objectjenisalatfk " & _
                 " WHERE stp.norec = '" & strNorec & "' AND stp.statusenabled = 1 "
        
         adoReport.CommandText = strSQL
         adoReport.CommandType = adCmdUnknown
        .database.AddADOCommand CN_String, adoReport
        '.txtUser.SetText strUser
        If view = "false" Then
           Dim strPrinter As String
           strPrinter = GetTxt("Setting.ini", "Printer", "PermohonanPerbaikan")
           .SelectPrinter "winspool", strPrinter, "Ne00:"
           .PrintOut False
           Unload Me
        Else
           With CRViewer1
              .ReportSource = ReportResep
              .ViewReport
              .Zoom 1
           End With
           Me.Show
           Screen.MousePointer = vbDefault
        End If
    End With
Exit Sub
errLoad:
End Sub
