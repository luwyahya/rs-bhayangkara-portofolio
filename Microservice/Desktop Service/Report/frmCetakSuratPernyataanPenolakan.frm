VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakSuratPernyataanPenolakan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCetakSuratPernyataanPenolakan.frx":0000
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
Attribute VB_Name = "frmCetakSuratPernyataanPenolakan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crSuratPernyataanPenolakan

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

    Set frmCetakSuratPernyataanPenolakan = Nothing
End Sub

Public Sub Cetak(noCm As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCetakSuratPernyataanPenolakan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, strFilter1 As String
'Set Report = New crLaporanPasienDaftar
Set Report = New crSuratPernyataanPenolakan

      
    strSQL = "select top 1 ps.nocm,ps.namapasien,format(ps.tgllahir,'dd - MM - yyyy') as tgllahir,CASE WHEN ps.objectjeniskelaminfk=1 then 'L' else 'P' END as jk, " & _
            " al.alamatlengkap, al.kecamatan,al.kotakabupaten " & _
            " from pasien_m as ps  " & _
            " inner JOIN alamat_m as al on al.nocmfk=ps.id  " & _
            "where ps.statusenabled = 1 and ps.nocm = '" & noCm & "' "

    ReadRs strSQL
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
           
        .usNoCm.SetUnboundFieldSource ("{Ado.nocm}")
        .usNamaPasien.SetUnboundFieldSource ("{Ado.namapasien}")
        .usJenisKelamin.SetUnboundFieldSource ("{Ado.jk}")
        .udTglLahir.SetUnboundFieldSource ("{Ado.tgllahir}")
        
        .txtNamaPasienNoCM.SetText rs!namapasien & " No. RM " & rs!noCm
        .txtTglLahirUmur.SetText rs!tgllahir & "   /  " & hitungUmurNew(Format(rs!tgllahir, "yyyy/MM/dd"), Format(Now, "yyyy/MM/dd"))
        .txtAlamatPasien.SetText rs!alamatlengkap & "  ,Kec. " & rs!kecamatan & "  , " & rs!kotakabupaten
        
        .txtTglPrintJam.SetText Format(Now, "dd MMMM yyyy") & " Jam : " & Format(Now, "HH:mm")
        
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






