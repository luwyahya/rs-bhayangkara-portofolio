VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakFormasiDelegasiPemberianObat 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCetakFormasiDelegasiPemberianObat.frx":0000
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
Attribute VB_Name = "frmCetakFormasiDelegasiPemberianObat"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crFormulirPendelegasianPemberianObat

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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "FRM-DelegasiPemberianObat")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCetakFormasiDelegasiPemberianObat = Nothing
End Sub

Public Sub Cetak(Noregistrasi As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCetakFormasiDelegasiPemberianObat = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, strFilter1 As String
Dim Noreg As String

If Noregistrasi <> "" Then
    Noreg = Noregistrasi
End If


Set Report = New crFormulirPendelegasianPemberianObat

      
    strSQL = "select pm.nocm,pm.namapasien,jk.jeniskelamin,CONVERT(VARCHAR, pm.tgllahir,105) as tgllahir,pg2.namalengkap AS dpjp, " & _
             "frd.produkfk,pro.namaproduk,frd.dosis,rf.name AS rute,CONVERT(VARCHAR, frd.tglpelayanan,105) AS tgl, " & _
             "CONVERT(varchar, frd.tglpelayanan, 8) AS jam,pg.namalengkap AS pegawaifarmasi, pg1.namalengkap AS perawat,fr.alergi, " & _
             "CASE WHEN frd.ispagi = 1 THEN 'P' ELSE '' END AS pagi,CASE WHEN frd.issiang = 1 THEN 'S' ELSE '' END AS siang, " & _
             "CASE WHEN frd.issore = 1 THEN 'SR' ELSE '' END AS sore,CASE WHEN frd.ismalam = 1 THEN 'M' ELSE '' END AS malam " & _
             "FROM formulirobat_t AS fr " & _
             "INNER JOIN formulirobatdetail_t AS frd ON frd.formulirobatfk = fr.norec " & _
             "INNER JOIN pasiendaftar_t AS pd ON pd.norec = fr.norec_pd " & _
             "INNER JOIN produk_m AS pro ON pro.id = frd.produkfk " & _
             "LEFT JOIN pegawai_m AS pg ON pg.id = frd.pegawaifarmasifk " & _
             "LEFT JOIN pegawai_m AS pg1 ON pg1.id = frd.perawatfk " & _
             "LEFT JOIN pegawai_m AS pg2 ON pg2.id = pd.objectpegawaifk " & _
             "INNER JOIN pasien_m AS pm ON pm.id = pd.nocmfk " & _
             "LEFT JOIN jeniskelamin_m AS jk ON jk.id = pm.objectjeniskelaminfk " & _
             "LEFT JOIN routefarmasi AS rf ON rf.id = frd.routefk WHERE pd.noregistrasi = '" & Noreg & "' "

    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        .usNoCm.SetUnboundFieldSource ("{Ado.nocm}")
        .usNamaPasien.SetUnboundFieldSource ("{Ado.namapasien}")
        .usJenisKelamin.SetUnboundFieldSource ("{Ado.jeniskelamin}")
        .usTglLahir.SetUnboundFieldSource ("{Ado.tgllahir}")
        .usDpjp.SetUnboundFieldSource ("{Ado.dpjp}")
        .usTglPelayanan.SetUnboundFieldSource ("{Ado.tgl}")
        .usnamaProduk.SetUnboundFieldSource ("{Ado.namaproduk}")
        .usRute.SetUnboundFieldSource ("{Ado.rute}")
        .usDosis.SetUnboundFieldSource ("{Ado.dosis}")
        .usPgwFarmaisi.SetUnboundFieldSource ("{Ado.pegawaifarmasi}")
        .usPgwPerawat.SetUnboundFieldSource ("{Ado.perawat}")
'        .usJam.SetUnboundFieldSource ("{Ado.jam}")
        .usAlergi.SetUnboundFieldSource ("{Ado.alergi}")
        .usWkt.SetUnboundFieldSource ("{Ado.pagi}")
        .usWkt1.SetUnboundFieldSource ("{Ado.siang}")
        .usWkt2.SetUnboundFieldSource ("{Ado.sore}")
        .usWkt3.SetUnboundFieldSource ("{Ado.malam}")
        
        
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "FRM-DelegasiPemberianObat")
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






