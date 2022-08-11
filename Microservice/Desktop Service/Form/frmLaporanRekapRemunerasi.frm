VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLaporanRekapRemunerasi 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmLaporanRekapRemunerasi.frx":0000
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
Attribute VB_Name = "frmLaporanRekapRemunerasi"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanRekapRemunerasi
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "Billing")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmLaporanRekapRemunerasi = Nothing
End Sub

Public Sub CetakLaporan(namaPrinted As String, tglAwal As String, tglAkhir As String, strDokter As String, strStatus As String, view As String)
On Error GoTo errLoad
On Error Resume Next

Set frmLaporanRekapRemunerasi = Nothing
Dim idRuangan As String
Dim idDept As String
Dim noClosing As String
Dim idDokter As String
Dim str As String
Dim adocmd As New ADODB.Command

If strDokter <> "" Then
    str = " and pg.id =  '" & strDokter & "' "
End If

If strStatus <> "" Then
   If strStatus = "true" Then
    str = str & " and ru.iseksekutif = 1 "
   Else
    str = str & " and ru.iseksekutif = 0 "
   End If
End If

Set Report = New crLaporanRekapRemunerasi

    strSQL = "select x.namalengkap, sum(x.JasaDr) as JasaDr,sum(x.Paramedis) as Paramedis,sum(x.PostRemun) as PostRemun, " & _
             "sum(x.Direksi) as Direksi,sum(x.StaffDireksi) as StaffDireksi,sum(x.Manajemen) as Manajemen from " & _
             "(select pg.namalengkap, " & _
             "case when sdp.jenispagufk= 7 then sum(sdp.jenispagunilai) else 0 end as 'JasaDr', " & _
             "case when sdp.jenispagufk = 8 then sum(sdp.jenispagunilai) else 0 end as 'Paramedis', " & _
             "case when sdp.jenispagufk = 9 then sum(sdp.jenispagunilai) else 0 end as 'PostRemun', " & _
             "case when sdp.jenispagufk = 10 then sum(sdp.jenispagunilai) else 0 end as 'Direksi', " & _
             "case when sdp.jenispagufk= 11 then sum(sdp.jenispagunilai) else 0 end as 'StaffDireksi', " & _
             "case when sdp.jenispagufk = 12 then sum(sdp.jenispagunilai) else 0 end as 'Manajemen' " & _
             "from strukdetailpagu_t as sdp " & _
             "INNER JOIN ruangan_m as ru on ru.id=sdp.ruanganfk " & _
             "inner join strukpagu_t as sp on sp.norec =sdp.strukpagufk " & _
             "INNER JOIN pegawai_m as pg on pg.id=sdp.dokterid " & _
             "Where sp.periodeawal BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
             "and sdp.tglpelayanan  > '2019-05-31 23:59' " & _
             str & "  group by pg.namalengkap,sdp.jenispagufk)as x " & _
             "group by x.namalengkap"
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .txtUser.SetText namaPrinted
            .txtKelompokPasien.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .usNamaRuangan.SetUnboundFieldSource ("{ado.namalengkap}")
            .ucJasaDr.SetUnboundFieldSource ("{ado.JasaDr}")
            .ucParamedis.SetUnboundFieldSource ("{ado.Paramedis}")
            
            If view = "false" Then
                Dim strPrinter As String
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanRekapRemun")
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
