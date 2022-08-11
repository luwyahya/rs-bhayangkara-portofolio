VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakSPK 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakSPK.frx":0000
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
Attribute VB_Name = "frmCetakSPK"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim ReportResep As New crSuratPerintahKerja

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

    Set frmCetakSPK = Nothing

End Sub

Public Sub Cetak(strNorec As String, view As String)
'On Error GoTo errLoad
Set frmCetakSPK = Nothing
Dim strSQL As String
Dim str1, str2, str3, tglKontrak, supplier, catatan, noOrder, tglorder, keteranganorder As String

bolStrukResep = True
    
    
        With ReportResep
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            strSQL = "select op.jumlah,op.hargasatuan*op.hasilkonversi as hargasatuan ,so.tglorder,so.nokontrakspk,cast(so.tglkontrak as date) as tglkontrak,so.keteranganlainnya,so.noorderhps,so.tglvalidasi,so.nourutlogin,so.keterangankeperluan,so.noorder, so.keterangankeperluan,so.noorderintern, cast(so.tglorder as date) as tglorder, so.keteranganorder, " & _
                    "so.nokontrakspk,so.noorderrfq,so.namarekanansales,so.alamat,so.alamattempattujuan,so.keteranganorder  +  ' RSAB HK THN ' +  so.noorderrfq as judul, " & _
                    "pr.namaproduk,so.totalbiayakirim,ssx.satuanstandar, op.qtyproduk, op.hargadiscount,op.hargappn, " & _
                    "case when op.hargadiscount <> 0 then (op.hargasatuan * op.qtyproduk) / op.hargadiscount else 0 end as persenDisc, " & _
                    "case when op.hargappn <> 0 then (op.hargasatuan * op.qtyproduk) / op.hargappn else 0 end as persenPpn, " & _
                    "(op.hargasatuan * op.qtyproduk)-(hargadiscount+hargappn)as total,pg.namalengkap,pg1.namalengkap as pegawaispk, " & _
                    "case when pg.nippns is null then '-' ELSE pg.nippns end as nippns, " & _
                    "case when pg1.nippns is null then '-' ELSE pg1.nippns end AS nippns_spk, " & _
                    "rk.namarekanan,rk.alamatlengkap,op.deskripsiprodukquo, " & _
                    "mp.objectjabatanppkfk, " & _
                    "case when jb.namajabatan is null then '-' ELSE jb.namajabatan end AS jabatanppk, " & _
                    "case when jb1.namajabatan is null then '-' ELSE jb1.namajabatan end AS namajabatan , so.keteranganorder    " & _
                    "from strukorder_t so " & _
                    "left join orderpelayanan_t op on op.strukorderfk=so.norec " & _
                    "left join produk_m pr on pr.id=op.objectprodukfk " & _
                    "left join satuanstandar_m ss on ss.id=op.objectsatuanstandarfk " & _
                    "left join satuanstandar_m ssx on ssx.id=op.satuanviewfk " & _
                    "left join pegawai_m as pg on pg.id = so.objectpegawaiorderfk " & _
                    "left join pegawai_m as pg1 on pg1.id = so.objectpegawaispkfk " & _
                    "left join mapjabatanppktopegawai_m as mp on mp.objectpegawaifk=pg1.id " & _
                    "left join jabatanppk_m as jb on jb.id = mp.objectjabatanppkfk " & _
                    "left join jabatan_m as jb1 on jb1.id = pg1.objectjabatanstrukturalfk " & _
                    "left join rekanan_m as rk on rk.id = so.objectrekananfk " & _
                    "where so.norec = '" & strNorec & "'"
             ReadRs strSQL
             If rs.EOF = False Then
                str1 = rs!pegawaispk
                str2 = "NIP : " + rs!nippns_spk
                str3 = rs!nokontrakspk
                tglKontrak = rs!tglKontrak
                supplier = rs!namarekanan
                noOrder = rs!nokontrakspk + "          Tanggal " + rs!tglorder
                tglorder = rs!tglorder
                keteranganorder = rs!keteranganorder
             Else
                str1 = "-"
                str2 = "NIP : -"
                str3 = "-"
             End If
             
             adoReport.CommandText = strSQL
             adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
                
             .txtNoKontrak.SetText str3
             .unbataspengiriman.SetText tglKontrak
             
             .unsupplier.SetText supplier
             .unnopesanan.SetText noOrder
             .usNoUsulan.SetUnboundFieldSource ("{Ado.noorderintern}")
             .udTglSpk.SetUnboundFieldSource ("{Ado.tglorder}")
             .udTglStruk.SetUnboundFieldSource ("{Ado.tglorder}")
'             .usNamaRekanan.SetUnboundFieldSource ("{Ado.namarekanan}")
             .usAlamat.SetUnboundFieldSource ("{Ado.alamatlengkap}")
             .usJenisUsulan.SetUnboundFieldSource ("{Ado.keteranganorder}")
             .usNamaBarang.SetUnboundFieldSource ("{ado.namaproduk}")
             .usSpesifikasi.SetUnboundFieldSource ("{ado.deskripsiprodukquo}")
             .unQty.SetUnboundFieldSource ("{Ado.jumlah}")
             .usSatuan.SetUnboundFieldSource ("{Ado.satuanstandar}")
             .ucHargaSatuan.SetUnboundFieldSource ("{Ado.hargasatuan}")
             .ucBiayaKirim.SetUnboundFieldSource ("{Ado.totalbiayakirim}")
             .usKoordinator.SetUnboundFieldSource ("{Ado.keteranganlainnya}")
             .usNoSpph.SetUnboundFieldSource ("{Ado.noorderhps}")
'             .unDisc.SetUnboundFieldSource ("{Ado.persenDisc}")
             .ucPajak.SetUnboundFieldSource ("{Ado.hargappn}")
             .uncatatan.SetText keteranganorder
'             .udPrintDate.SetUnboundFieldSource ("{Ado.tglkontrak}")
             
'             .ucTotal.SetUnboundFieldSource ("{Ado.total}")
'             .usQtyHari.SetUnboundFieldSource ("{Ado.nourutlogin}")
'             .Text47.SetText str1
'             .Text3.SetText str2
'             .txtpenangungjawab1.SetText str1
'             .Text18.SetText str2
'             .Text60.SetText rs!namajabatan
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

