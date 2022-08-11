VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmEvaluasiPenyelenggara 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   ClipControls    =   0   'False
   Icon            =   "frmEvaluasiPenyelenggara.frx":0000
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
Attribute VB_Name = "frmEvaluasiPenyelenggara"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crEvaluasiPenyelenggara
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

    Set frmEvaluasiPenyelenggara = Nothing
End Sub

Public Sub Cetak(view As String, noPlanning As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmEvaluasiPenyelenggara = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim strFilter1, hari, bulan, strDate, bulan1, tanggal, materi, narasumber, saran, totalnilai As String
strDate = Format(Now, "dd/MMM/yyyy")
bulan = getBulan(Format(strDate, "yyyy/MM/dd"))

Set Report = New crEvaluasiPenyelenggara

    strSQL = "select sp.norec,convert(varchar,evn.tglevaluasi,105) as tglevaluasi,evn.materi,evn.narasumberfk,na.namalengkap,evn.saran,evn.totalnilai, " & _
             "cast(evnd.efektivitaspenyelenggaraan as integer) as efektivitaspenyelenggaraan, " & _
             "cast(evnd.persiapan as integer) as persiapan, " & _
             "cast(evnd.dapatditerapkanklinik as integer) as dapatditerapkanklinik, " & _
             "cast(evnd.hubunganpeserta as integer) as hubunganpeserta, " & _
             "cast(evnd.hubunganantarpeserta as integer) as hubunganantarpeserta, " & _
             "cast(evnd.kebersihan as integer) as kebersihan, " & _
             "cast(evnd.kebersihantoilet as integer) as kebersihantoilet " & _
             "from strukplanning_t as sp " & _
             "inner join narasumber_m as na on na.id = sp.narasumberfk " & _
             "inner join evaluasipenyelenggara_t as evn on evn.noplanningfk = sp.norec " & _
             "inner join evaluasipenyelenggaradetail_t as evnd on evnd.evaluasipenyelenggarafk = evn.norec " & _
             "where sp.statusenabled = 1 and sp.noplanning = '" & noPlanning & "' "
'    strSQL = "select kode, uraian from aspekpenilaiannarasumber_m where statusenabled = 't'"
    ReadRs2 strSQL
    
    If Not RS2.EOF Then
        hari = getHari(Format(RS2!tglevaluasi, "yyyy/MM/dd"))
        bulan = getBulan(Format(RS2!tglevaluasi, "yyyy/MM/dd"))
        tanggal = hari & ", " & Format(RS2!tglevaluasi, "dd ") & bulan & Format(RS2!tglevaluasi, " yyyy")
        materi = RS2!materi
        saran = RS2!saran
        totalnilai = RS2!totalnilai
        narasumber = RS2!namalengkap
    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    With Report
        .database.AddADOCommand CN_String, adocmd
'        If Not RS.EOF Then
'        If Not RS2.EOF Then
                     
                     .txtTanggal.SetText tanggal
                     .TxtNilai.SetText totalnilai
'                     .TxtSaran.SetText saran
                     .TxtNarasumber.SetText materi
'                     .TxtMateri.SetText materi
                     .unAngka1.SetUnboundFieldSource ("{ado.efektivitaspenyelenggaraan}")
                     .unAngka2.SetUnboundFieldSource ("{ado.persiapan}")
                     .unAngka3.SetUnboundFieldSource ("{ado.dapatditerapkanklinik}")
                     .unAngka4.SetUnboundFieldSource ("{ado.hubunganpeserta}")
                     .unAngka5.SetUnboundFieldSource ("{ado.hubunganantarpeserta}")
                     .unAngka6.SetUnboundFieldSource ("{ado.kebersihan}")
                     .unAngka7.SetUnboundFieldSource ("{ado.kebersihantoilet}")
                     
                     
            
          
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
'           End If
'        End If
    End With
Exit Sub
errLoad:
End Sub
