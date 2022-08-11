VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakStokRuangan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakStokRuangan.frx":0000
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
Attribute VB_Name = "frmCetakStokRuangan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New cr_LaporanStokRuangan
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

    Set frmCetakStokRuangan = Nothing
End Sub

Public Sub Cetak(strIdRuangan As String, view As String, strUser As String)
'tglAwal As String, tglAkhir As String,
On Error GoTo errLoad
'On Error Resume Next

Set frmCetakStokRuangan = Nothing
Dim adocmd As New ADODB.Command

    Dim str1, str2 As String
    If strIdRuangan <> "" Then
        str1 = " where ru.id=" & strIdRuangan & " )as x GROUP BY x.kdproduk,x.kdinternal,x.kodebmn,x.namaproduk,x.satuanstandar,x.harganetto1,x.objectruanganfk,x.namaruangan"
    End If
    
Set Report = New cr_LaporanStokRuangan
'            strSQL = "select sp.nostruk as noterima,spd.objectprodukfk as kdproduk,pr.kodebmn,pr.namaproduk,ap.asalproduk, " & _
'                     "ss.satuanstandar,spd.tglkadaluarsa,spd.nobatch,spd.qtyproduk,spd.harganetto1,(spd.qtyproduk*spd.harganetto1) as total," & _
'                     "spd.norec as norec_spd,spd.nostrukterimafk,spd.tglpelayanan,spd.objectruanganfk,ru.namaruangan " & _
'                     "from stokprodukdetail_t as spd " & _
'                     "inner join strukpelayanan_t as sp on sp.norec = spd.nostrukterimafk " & _
'                     "inner join produk_m as pr on pr.id = spd.objectprodukfk " & _
'                     "inner join detailjenisproduk_m as djp on djp.id = pr.objectdetailjenisprodukfk " & _
'                     "inner join jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk " & _
'                     "inner join asalproduk_m as ap on ap.id = spd.objectasalprodukfk " & _
'                     "inner join satuanstandar_m as ss on ss.id = pr.objectsatuanstandarfk " & _
'                     "inner join ruangan_m as ru on ru.id = spd.objectruanganfk " & _
'                     str1
            strSQL = "select x.kdproduk,x.kdinternal,x.kodebmn,x.namaproduk,x.satuanstandar,sum(x.qtyproduk) as qtyproduk,x.harganetto1,x.objectruanganfk,x.namaruangan from " & _
                     "(select spd.objectprodukfk as kdproduk,pr.kdproduk as kdinternal,pr.kodebmn,pr.namaproduk,ss.satuanstandar,spd.qtyproduk,spd.harganetto1,spd.objectruanganfk,ru.namaruangan " & _
                     "from stokprodukdetail_t as spd inner join strukpelayanan_t as sp on sp.norec = spd.nostrukterimafk inner join produk_m as pr on pr.id = spd.objectprodukfk inner join detailjenisproduk_m as djp on djp.id = pr.objectdetailjenisprodukfk " & _
                     "inner join jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk inner join asalproduk_m as ap on ap.id = spd.objectasalprodukfk inner join satuanstandar_m as ss on ss.id = pr.objectsatuanstandarfk inner join ruangan_m as ru on ru.id = spd.objectruanganfk " & _
                     str1
            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText

    With Report
        .database.AddADOCommand CN_String, adocmd
             .txtUser.SetText strUser
'             .txtPeriode.SetText Format(tglAwal, "MMMM yyyy")
'             .txtPeriode.SetText Format(tglAkhir, "MMMM yyyy")
'             .udTglTerima.SetUnboundFieldSource ("{Ado.tglstruk}")
'             .udTglED.SetUnboundFieldSource ("{Ado.tglkadaluarsa}")
             .usRuangan.SetUnboundFieldSource ("{Ado.namaruangan}")
             .unKdBarang.SetUnboundFieldSource ("{Ado.kdproduk}")
             .usNamaBarang.SetUnboundFieldSource ("{Ado.namaproduk}")
             .usSatuan.SetUnboundFieldSource ("{Ado.satuanstandar}")
             .unBanyak.SetUnboundFieldSource ("{Ado.qtyproduk}")
             .ucHarga.SetUnboundFieldSource ("{Ado.harganetto1}")
             .ucTotal.SetUnboundFieldSource ("{Ado.total}")
             .UsKdeBmn.SetUnboundFieldSource ("{Ado.kodebmn}")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPedapatan")
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
    MsgBox Err.Number & " " & Err.Description
End Sub



'Option Explicit
'Dim ReportStokOpname As New cr_LaporanStokOpname
'
'Dim ii As Integer
'Dim tempPrint1 As String
'Dim p As Printer
'Dim p2 As Printer
'Dim strDeviceName As String
'Dim strDriverName As String
'Dim strPort As String
'
'Dim bolStokOpname As Boolean
'
'
'Dim strPrinter As String
'Dim strPrinter1 As String
'Dim PrinterNama As String
'
'Dim adoReport As New ADODB.Command
'
'Private Sub cmdCetak_Click()
'  If cboPrinter.Text = "" Then MsgBox "Printer belum dipilih", vbInformation, ".: Information": Exit Sub
'    If bolStokOpname = True Then
'        ReportStokOpname.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
'        ReportStokOpname.PrintOut False
'
'    End If
'End Sub
'
'Private Sub CmdOption_Click()
'
'    If bolStokOpname = True Then
'        ReportStokOpname.PrinterSetup Me.hWnd
'    End If
'
'    CRViewer1.Refresh
'End Sub
'
'Private Sub Form_Load()
'
'    Dim p As Printer
'    cboPrinter.Clear
'    For Each p In Printers
'        cboPrinter.AddItem p.DeviceName
'    Next
'    strPrinter = strPrinter1
'
'End Sub
'
'Private Sub Form_Resize()
'    CRViewer1.Top = 0
'    CRViewer1.Left = 0
'    CRViewer1.Height = ScaleHeight
'    CRViewer1.Width = ScaleWidth
'End Sub
'
'Private Sub Form_Unload(Cancel As Integer)
'
'    Set frmCetakStokOpname = Nothing
'
'End Sub
'
'Public Sub cetak(strTanggal As String, strIdRuangan As String, view As String, strUser As String)
'On Error GoTo errLoad
'Set frmCetakStokOpname = Nothing
'Dim strSQL, str1 As String
'    If strIdRuangan <> "" Then
'        str1 = "and ru.id = '" & strIdRuangan & "' "
'    End If
'
'bolStokOpname = True
'
'
'        With ReportStokOpname
'            Set adoReport = New ADODB.Command
'            adoReport.ActiveConnection = CN_String
'
'            strSQL = "select sc.noclosing,sc.tglclosing,pr.kdproduk,pr.namaproduk,ss.satuanstandar, " & _
'                    "spd.qtyproduksystem,spd.harganetto1,sp.tglstruk " & _
'                    "from strukclosing_t sc " & _
'                    "left join stokprodukdetailopname_t spd on spd.noclosingfk=sc.norec " & _
'                    "left join strukpelayanan_t sp on sp.norec=spd.nostrukterimafk " & _
'                    "left join produk_m pr on pr.id=spd.objectprodukfk " & _
'                    "left join satuanstandar_m ss on ss.id=pr.objectsatuanstandarfk " & _
'                    "left join ruangan_m ru on ru.id=spd.objectruanganfk " & _
'                    "where sc.tglclosing = '" & strTanggal & "' " & _
'                    str1
'
'             ReadRs strSQL
'
'             adoReport.CommandText = strSQL
'             adoReport.CommandType = adCmdUnknown
'            .database.AddADOCommand CN_String, adoReport
'
'             .txtuser.SetText strUser
'             .txtPeriode.SetText Format(strTanggal, "MMM/yyyy")
'
'             .udTglTerima.SetUnboundFieldSource ("{Ado.tglterima}")
'             .udTglED.SetUnboundFieldSource ("{Ado.tglkadaluarsa}")
'             .usGudang.SetUnboundFieldSource ("{Ado.ruangan}")
'             .usKdBarang.SetUnboundFieldSource ("{Ado.kdproduk}")
'             .usNamaBarang.SetUnboundFieldSource ("{Ado.namaproduk}")
'             .usSatuan.SetUnboundFieldSource ("{Ado.satuanstandar}")
'             .unBanyak.SetUnboundFieldSource ("{Ado.jumlah}")
'             .ucHarga.SetUnboundFieldSource ("{Ado.harga}")
'             .ucTotal.SetUnboundFieldSource ("{Ado.total}")
'
'            If view = "false" Then
'                strPrinter1 = GetTxt("Setting.ini", "Printer", "Logistik_A4")
'                .SelectPrinter "winspool", strPrinter1, "Ne00:"
'                .PrintOut False
'                Unload Me
'                Screen.MousePointer = vbDefault
'             Else
'                With CRViewer1
'                    .ReportSource = ReportStokOpname
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'                Screen.MousePointer = vbDefault
'            End If
'
'        End With
'Exit Sub
'errLoad:
'
'End Sub
'
