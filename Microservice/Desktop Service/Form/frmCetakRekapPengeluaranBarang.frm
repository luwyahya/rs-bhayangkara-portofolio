VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakRekapPengeluaranBarang 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakRekapPengeluaranBarang.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   9075
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
      Height          =   7005
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   9045
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
Attribute VB_Name = "frmCetakRekapPengeluaranBarang"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim ReportResep As New cr_RekapPengeluaranBarang2

Dim ii As Integer
Dim tempPrint1 As String
Dim p As Printer
Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String

Dim bolStrukResep As Boolean


Dim strPrinter As String
Dim strPrinter1 As String
Dim PrinterNama As String

Dim adoReport As New ADODB.Command

Private Sub cmdCetak_Click()
  If cboPrinter.Text = "" Then MsgBox "Printer belum dipilih", vbInformation, ".: Information": Exit Sub
    If bolStrukResep = True Then
        ReportResep.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        ReportResep.PrintOut False
    
    End If
End Sub

Private Sub CmdOption_Click()
    
    If bolStrukResep = True Then
        ReportResep.PrinterSetup Me.hwnd
    End If
    
    CRViewer1.Refresh
End Sub

Private Sub Form_Load()
    
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    strPrinter = strPrinter1
    
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCetakRekapPengeluaranBarang = Nothing

End Sub

Public Sub Cetak(tglAwal As String, tglAkhir As String, view As String, strUser As String)
On Error GoTo errLoad
Set frmCetakRekapPengeluaranBarang = Nothing
Dim strSQL As String

bolStrukResep = True
    
    
        With ReportResep
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            strSQL = "select sk.tglkirim, so.tglorder, sk.nokirim, so.noorder, jp.name, ru.namaruangan, " & _
                    "ru.kdruangan  +  ' - '  +  ru.namaruangan as ruangankirim, " & _
                    "ru2.namaruangan, ru2.kdruangan  +  ' - '  +  ru2.namaruangan as ruangantujuan, pg.namalengkap, " & _
                    "pr.kdproduk, pr.namaproduk, pr.kdproduk  +  ' - '  +  pr.namaproduk as produk, ss.satuanstandar, kp.qtyproduk, kp.qtyorder, kp.hargasatuan, kp.hargasatuan * kp.qtyproduk as total, sk.keteranganlainnyakirim, " & _
                    "'Ka. '  +  dp.namadepartemen as pnjPengirim, pg.namalengkap as pegawaipengirim, 'NIP. '  +  pg.nippns as nippengirim, " & _
                    "'Ka. '  +  dp2.namadepartemen as pnjPenerima, pg2.namalengkap as pegawaipenerima, 'NIP. '  +  pg2.nippns as nippenerima " & _
                    "from strukkirim_t as sk " & _
                    "left join kirimproduk_t as kp on kp.nokirimfk = sk.norec " & _
                    "left join strukorder_t as so on so.norec = sk.noorderfk " & _
                    "left join produk_m as pr on pr.id = kp.objectprodukfk " & _
                    "left join satuanstandar_m as ss on ss.id = pr.objectsatuanstandarfk " & _
                    "left join jenis_permintaan_m as jp on jp.id = sk.jenispermintaanfk " & _
                    "left join ruangan_m as ru on ru.id = sk.objectruanganasalfk " & _
                    "left JOIN departemen_m as dp on dp.id = ru.objectdepartemenfk " & _
                    "left join ruangan_m as ru2 on ru2.id = sk.objectruangantujuanfk " & _
                    "left JOIN departemen_m as dp2 on dp2.id = ru2.objectdepartemenfk " & _
                    "left join pegawai_m as pg on pg.id = sk.objectpegawaipengirimfk " & _
                    "left join pegawai_m as pg2 on pg2.id = sk.objectpegawaipenerimafk  " & _
                    "where sk.tglkirim BETWEEN '" & _
                    Format(tglAwal, "yyyy-MM-dd HH:mm") & "' AND '" & _
                    Format(tglAkhir, "yyyy-MM-dd HH:mm") & "' AND ru.id=50"

             ReadRs strSQL
             
             adoReport.CommandText = strSQL
             adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport

             .txtUser.SetText strUser
             .txtPeriode.SetText Format(tglAwal, "dd-MM-yyyy") & "  s.d  " & Format(tglAkhir, "dd-MM-yyyy")
           
             .udtglDok.SetUnboundFieldSource ("{Ado.tglkirim}")
             .usNoDok.SetUnboundFieldSource ("{Ado.nokirim}")
             .usRuangKirim.SetUnboundFieldSource ("{Ado.ruangankirim}")
             '.usKdBarang.SetUnboundFieldSource ("{ado.kdproduk}")
             .usNamaBarang.SetUnboundFieldSource ("{Ado.namaproduk}")
             .usProduk.SetUnboundFieldSource ("{Ado.produk}")
             .usSatuan.SetUnboundFieldSource ("{ado.satuanstandar}")
             .ucHarga.SetUnboundFieldSource ("{Ado.hargasatuan}")
             .unDikirim.SetUnboundFieldSource ("{Ado.qtyproduk}")
             .ucTotals.SetUnboundFieldSource ("{Ado.total}")
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "Logistik_A4")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
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

