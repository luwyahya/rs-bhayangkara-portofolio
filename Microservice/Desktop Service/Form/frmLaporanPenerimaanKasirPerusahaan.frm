VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLaporanPenerimaanKasirPerusahaan 
   Caption         =   "Transmedic"
   ClientHeight    =   6480
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   6225
   Icon            =   "frmLaporanPenerimaanKasirPerusahaan.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   6480
   ScaleWidth      =   6225
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
      TabIndex        =   2
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
      TabIndex        =   1
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
      TabIndex        =   0
      Top             =   480
      Width           =   3015
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   6615
      Left            =   0
      TabIndex        =   3
      Top             =   0
      Width           =   6255
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
Attribute VB_Name = "frmLaporanPenerimaanKasirPerusahaan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crPenerimaanKasirPerusahaan
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

    Set frmLaporanPenerimaanKasirPerusahaan = Nothing
End Sub

Public Sub CetakLaporanPenerimaanKasirPerusahaan(idKasir As String, tglAwal As String, tglAkhir As String, idPegawai As String, idRuangan As String, idDokter As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmLaporanPenerimaanKasirPerusahaan = Nothing
Dim adocmd As New ADODB.Command
    Dim str1 As String
    Dim str2 As String
    
    If idRuangan <> "" Then
        str1 = " and ru.id=" & idRuangan & " "
    End If
    If idPegawai <> "" Then
        str2 = " and pg.id=" & idPegawai & " "
    End If
    
Set Report = New crPenerimaanKasirPerusahaan
    strSQL = "select distinct kp.kelompokpasien, spp.norec,sp.tglstruk, pd.noregistrasi,pd.tglregistrasi,p.nocm, " & _
            "p.namapasien, ru.namaruangan, pg.namalengkap, spp.totalppenjamin,spp.totalharusdibayar, " & _
            "spp.totalsudahdibayar, spp.totalharusdibayar - spp.totalppenjamin as sisaBayar, spp.totalbiaya, spp.noverifikasi " & _
            "from strukpelayananpenjamin_t as spp " & _
            "inner join strukpelayanan_t as sp on sp.norec=spp.nostrukfk " & _
            "inner join pelayananpasien_t as pp on pp.strukfk=sp.norec " & _
            "inner join antrianpasiendiperiksa_t as ap on ap.norec=pp.noregistrasifk " & _
            "inner join pasiendaftar_t as pd on pd.norec=ap.noregistrasifk " & _
            "inner join pasien_m as p on p.id =pd.nocmfk " & _
            "Left JOIN pegawai_m as pg on pg.id=pd.objectpegawaifk " & _
            "left Join ruangan_m as ru on ru.id=pd.objectruanganlastfk " & _
            "left Join departemen_m as dept on dept.id=ru.objectdepartemenfk " & _
            "left Join rekanan_m as r on r.id=spp.kdrekananpenjamin " & _
            "left Join kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk " & _
            "where sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' AND kp.id=5 " & _
            str1 & _
            str2 & _
            "order by pd.noregistrasi"

    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .usNamaKasir.SetText idKasir
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .udtTglStruk.SetUnboundFieldSource ("{ado.tglstruk}")
            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .ucTotalHarusDibayar.SetUnboundFieldSource ("{ado.totalharusdibayar}")
            .ucTotalPiutangPenjamin.SetUnboundFieldSource ("{ado.totalppenjamin}")
            .ucSisaBayar.SetUnboundFieldSource ("{ado.sisaBayar}")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenerimaan")
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
