VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakRekapPenerimaanBarang 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakRekapPenerimaanBarang.frx":0000
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
Attribute VB_Name = "frmCetakRekapPenerimaanBarang"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim ReportResep As New cr_RekapPenerimaanBarang2

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

    Set frmCetakRekapPenerimaanBarang = Nothing

End Sub

Public Sub Cetak(tglAwal As String, tglAkhir As String, view As String, strUser As String)
On Error GoTo errLoad
Set frmCetakRekapPenerimaanBarang = Nothing
Dim strSQL As String

bolStrukResep = True
    
    
        With ReportResep
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            strSQL = "select sp.nostruk, sp.nofaktur, sp.tglstruk, sp.tglspk, " & _
                    "case when ap.asalproduk is null then '-' else ap.asalproduk end as asalproduk," & _
                    "case when rk.namarekanan is null then '-' else rk.namarekanan end as rekanan, " & _
                    "pr.kdproduk, pr.namaproduk, pr.kdproduk  +  ' - '  +  pr.namaproduk as produk, " & _
                    "ss.satuanstandar, sp.totalharusdibayar," & _
                    "(spd.hargasatuan - spd.hargadiscount + spd.hargappn) as harga, spd.qtyproduk, " & _
                    "case when ru.namaruangan is null then '-' else ru.kdruangan  +  ' - '  +  ru.namaruangan end as gudang " & _
                    "from strukpelayanan_t sp " & _
                    "left join strukpelayanandetail_t spd on spd.nostrukfk=sp.norec " & _
                    "left JOIN pegawai_m pg on pg.id=sp.objectpegawaipenanggungjawabfk " & _
                    "left JOIN ruangan_m ru on ru.id=sp.objectruanganfk " & _
                    "left JOIN produk_m pr on pr.id=spd.objectprodukfk " & _
                    "left join asalproduk_m as ap on ap.id=spd.objectasalprodukfk " & _
                    "left join rekanan_m rk on rk.id=sp.objectrekananfk " & _
                    "left JOIN jeniskemasan_m jkm on jkm.id=spd.objectjeniskemasanfk " & _
                    "left join satuanstandar_m ss on ss.id=spd.objectsatuanstandarfk " & _
                    "where sp.tglstruk between '" & tglAwal & "' and '" & tglAkhir & "' and sp.nostruk ilike '%RS%'"

             ReadRs strSQL
             
             adoReport.CommandText = strSQL
             adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport

             .txtUser.SetText strUser
           
             .udtglDok.SetUnboundFieldSource ("{Ado.tglstruk}")
             .usNoDok.SetUnboundFieldSource ("{Ado.nofaktur}")
             .usNoPemesanan.SetUnboundFieldSource ("{Ado.nostruk}")
             .usSupplier.SetUnboundFieldSource ("{Ado.rekanan}")
             .usNamaRuangan.SetUnboundFieldSource ("{Ado.gudang}")
             .usSumberDana.SetUnboundFieldSource ("{Ado.asalproduk}")
             '.usKdBarang.SetUnboundFieldSource ("{ado.kdproduk}")
             .usNamaBarang.SetUnboundFieldSource ("{Ado.namaproduk}")
             .usProduk.SetUnboundFieldSource ("{Ado.produk}")
             .usSatuan.SetUnboundFieldSource ("{ado.satuanstandar}")
             .ucHarga.SetUnboundFieldSource ("{Ado.harga}")
             .unQty.SetUnboundFieldSource ("{Ado.qtyproduk}")
             .ucTotalBayar.SetUnboundFieldSource ("{Ado.totalharusdibayar}")
             
             
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

