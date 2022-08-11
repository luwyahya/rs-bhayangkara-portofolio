VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakSPPB 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakSPPB.frx":0000
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
Attribute VB_Name = "frmCetakSPPB"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim ReportResep As New crLaporanSuratPermintaanPengirimanBarang

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

    Set frmCetakSPPB = Nothing

End Sub

Public Sub Cetak(strNorec As String, view As String)
'On Error GoTo errLoad
Set frmCetakSPPB = Nothing
Dim strSQL As String
Dim str1, str2, str3, str4 As String

bolStrukResep = True
    
    
        With ReportResep
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
'            strSQL = "select so.keteranganlainnya,so.tglvalidasi,so.nourutlogin,so.keterangankeperluan,so.noorder,so.noorderintern, so.tglorder, so.keteranganorder, so.nokontrakspk, " & _
'                    "so.noorderrfq, so.namarekanansales, so.alamat, so.alamattempattujuan, so.keteranganorder  +  ' RSAB HK THN ' +  so.noorderrfq as judul,  " & _
'                    "pr.namaproduk, ss.satuanstandar, op.hargasatuan, op.qtyproduk, op.hargadiscount, op.hargappn, " & _
'                    "case when op.hargadiscount <> 0 then (op.hargasatuan * op.qtyproduk) / op.hargadiscount else 0 end as persenDisc, " & _
'                    "case when op.hargappn <> 0 then (op.hargasatuan * op.qtyproduk) / op.hargappn else 0 end as persenPpn, " & _
'                    "(op.hargasatuan * op.qtyproduk)-(hargadiscount+hargappn)as total,pg.namalengkap,pg.nippns,jb.namajabatan " & _
'                    "from strukorder_t so " & _
'                    "left join orderpelayanan_t op on op.strukorderfk=so.norec " & _
'                    "left join produk_m pr on pr.id=op.objectprodukfk " & _
'                    "left join satuanstandar_m ss on ss.id=op.objectsatuanstandarfk " & _
'                    "left join pegawai_m as pg on pg.id = so.objectpegawaiorderfk " & _
'                    "left join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
'                    "where so.norec = '" & strNorec & "'"
             
             strSQL = "select so.keteranganlainnya,so.tglvalidasi,so.nourutlogin,so.keterangankeperluan,so.noorder, " & _
                      "so.noorderintern,so.tglorder,so.keteranganorder,so.nokontrakspk,so.noorderrfq,so.namarekanansales, " & _
                      "so.alamat,so.alamattempattujuan,so.keteranganorder  +  ' rsab hk thn ' +  so.noorderrfq as judul,pr.namaproduk, " & _
                      "ss.satuanstandar,op.hargasatuan,op.qtyproduk,op.hargadiscount,op.hargappn, " & _
                      "case when op.hargadiscount <> 0 then (op.hargasatuan * op.hargadiscount) / 100 else 0 end as persendisc, " & _
                      "case when op.hargappn <> 0 then (op.hargasatuan * op.hargappn) / 100 else 0 end as persenppn, " & _
                      "((op.hargasatuan-((op.hargadiscount * op.hargappn) / 100)+((op.hargasatuan * op.hargappn) / 100)) * op.qtyproduk)as total, " & _
                      "pg.namalengkap , CASE WHEN pg.nippns is null then '-' ELSE pg.nippns END AS nippns, " & _
                      "CASE WHEN jb.namajabatan is null then '-' ELSE jb.namajabatan END AS namajabatan from strukorder_t so left join orderpelayanan_t op on op.strukorderfk=so.norec " & _
                      "left join produk_m pr on pr.id=op.objectprodukfk left join satuanstandar_m ss on ss.id=op.objectsatuanstandarfk " & _
                      "left join pegawai_m as pg on pg.id = so.objectpegawaiorderfk " & _
                      "left join mapjabatanppktopegawai_m as mjp on mjp.objectpegawaifk = pg.id " & _
                      "left join jabatanppk_m as jb on jb.id = mjp.objectjabatanppkfk " & _
                      "Where so.norec = '" & strNorec & "'"
                
             ReadRs strSQL
             If rs.EOF = False Then
                str1 = rs!namalengkap
                str2 = rs!nippns
                str3 = rs!namajabatan
                If rs!nourutlogin = 0 Then
                    str4 = ""
                Else
                    str4 = rs!nourutlogin
                End If
             Else
                str1 = "-"
                str2 = "-"
                str3 = "-"
             End If
             
             adoReport.CommandText = strSQL
             adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
           
             .usNoSPPB.SetUnboundFieldSource ("{Ado.noorder}")
             .usPengadaan.SetUnboundFieldSource ("{Ado.keterangankeperluan}")
             .usKebutuhan.SetUnboundFieldSource ("{Ado.keteranganlainnya}")
             .usNo.SetUnboundFieldSource ("{Ado.noorderintern}")
             .udTanggal.SetUnboundFieldSource ("{Ado.tglvalidasi}")
             .usNoKontrak.SetUnboundFieldSource ("{Ado.nokontrakspk}")
             .usTahun.SetUnboundFieldSource ("{Ado.noorderrfq}")
             .usNamaPerusahaan.SetUnboundFieldSource ("{Ado.namarekanansales}")
             .usAlamatPerusahaan.SetUnboundFieldSource ("{Ado.alamat}")
             .usAlamats.SetUnboundFieldSource ("{ado.alamattempattujuan}")
'             .usJudul.SetUnboundFieldSource ("{Ado.judul}")
             .usJudul.SetUnboundFieldSource ("{Ado.keteranganorder}")
             .usNamaBarang.SetUnboundFieldSource ("{ado.namaproduk}")
             .unQty.SetUnboundFieldSource ("{Ado.qtyproduk}")
             .usSatuan.SetUnboundFieldSource ("{Ado.satuanstandar}")
             .ucHargaSatuan.SetUnboundFieldSource ("{Ado.hargasatuan}")
             .unDisc.SetUnboundFieldSource ("{Ado.persenDisc}")
             .unPPN.SetUnboundFieldSource ("{Ado.persenPpn}")
             .ucTotal.SetUnboundFieldSource ("{Ado.total}")
             .udTglppb.SetUnboundFieldSource ("{Ado.tglorder}")
             .txtJmlHari.SetText str4
'             .usQtyHari.SetUnboundFieldSource ("{Ado.nourutlogin}")
             .Text47.SetText str1
             .Text3.SetText str2
             .Text46.SetText str3
             
             
'             Dim X As Double
'             X = Round("{Ado.total}")
'            .usTerbilang.SetUnboundFieldSource "# " & TERBILANG(X) & " #"
             
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

