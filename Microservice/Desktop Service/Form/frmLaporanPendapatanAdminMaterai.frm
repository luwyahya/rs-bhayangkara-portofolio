VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRLaporanPendapatanAdminMaterai 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmLaporanPendapatanAdminMaterai.frx":0000
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
Attribute VB_Name = "frmCRLaporanPendapatanAdminMaterai"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanPendapatanAdminMaterai
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

    Set frmCRLaporanPendapatanAdminMaterai = Nothing
End Sub

Public Sub CetakLaporan(kpid As String, tglAwal As String, tglAkhir As String, PrinteDBY As String, idDokter As String, tglLibur As String, kdRuangan As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRLaporanPendapatanAdminMaterai = Nothing
Dim adocmd As New ADODB.Command

    Dim str1 As String
    Dim str2 As String



Set Report = New crLaporanPendapatanAdminMaterai
    strSQL = "select  pp.norec,pp.tglpelayanan,ps.nocm,pd.noregistrasi,ru.objectdepartemenfk,upper(ps.namapasien) as namapasien,pd.tglregistrasi , " & _
             "pr.namaproduk , pp.hargajual, CAST(pr.id as varchar(10)) as idProduk, pr.objectdetailjenisprodukfk, ru.namaruangan " & _
             "from pasiendaftar_t as pd " & _
             "INNER JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
             "INNER JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
             "INNER JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
             "INNER JOIN ruangan_m as ru ON ru.id=pd.objectruanganlastfk " & _
             "INNER JOIN ruangan_m as ru2 ON ru2.id=apd.objectruanganfk " & _
             "INNER JOIN produk_m as pr on pr.id=pp.produkfk " & _
             "Where pr.objectdetailjenisprodukfk = 1296 " & _
             "and pp.tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "='"


    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText

    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtNamaKasir.SetText PrinteDBY

            .txtPeriode.SetText "Periode : " & Format(tglAwal, "yyyy MMM dd") & " s/d " & Format(tglAkhir, "yyyy MMM dd") & "  "
            .usTgl.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .txtVer.SetText App.Comments

'            .txttglTTD.SetText "JAKARTA, " & Format(Now(), "dd MMMM yyyy")
'            .utJam.SetUnboundFieldSource ("{ado.tglregistrasi}")
'            .usLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
'            .usUnitLayanan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNoMR.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            
            .usTglMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usTglMasuk2.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .ucHarga.SetUnboundFieldSource ("{ado.hargajual}")
'            .ucMaterai.SetUnboundFieldSource ("{ado.hargajual}")
'            .ucMateraiDeposit.SetUnboundFieldSource ("{ado.hargajual}")
            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usIdProduk.SetUnboundFieldSource ("{ado.idProduk}")
            .usNorec.SetUnboundFieldSource ("{ado.norec}")
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenerimaan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
                With CRViewer1
                    .ReportSource = Report
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
'            End If
        'End If
    End With
Exit Sub
errLoad:
End Sub
