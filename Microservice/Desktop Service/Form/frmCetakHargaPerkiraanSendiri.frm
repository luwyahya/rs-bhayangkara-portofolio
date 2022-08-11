VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakHargaPerkiraanSendiri 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakHargaPerkiraanSendiri.frx":0000
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
Attribute VB_Name = "frmCetakHargaPerkiraanSendiri"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim ReportResep As New crHargaPerkiraanSendiri

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

    Set frmCetakHargaPerkiraanSendiri = Nothing

End Sub

Public Sub Cetak(strNorec As String, view As String)
'On Error GoTo errLoad
Set frmCetakHargaPerkiraanSendiri = Nothing
Dim strSQL As String
Dim namalengkap, nip As String
bolStrukResep = True


        With ReportResep
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            strSQL = "select " & _
                    "sp.norec,sp.tglorder,sp.noorder,pg.namalengkap as penanggungjawab,sp.noorderhps,sp.tglhps,sp.objectpegawaihpsfk, " & _
                    "sp.tglvalidasi as tglkebutuhan,sp.alamattempattujuan,sp.keteranganlainnya,sp.tglvalidasi,sp.noorderintern, " & _
                    "sp.keterangankeperluan,sp.keteranganorder,ru.namaruangan as ruangan,ru.id as ruid, " & _
                    "ru2.namaruangan as ruangantujuan,ru2.id as ruidtujuan, " & _
                    "sp.totalhargasatuan , sp.Status,pr.kdproduk,pr.namaproduk,ss.satuanstandar,op.qtyproduk,op.hargasatuan,op.hargadiscount, " & _
                    "case when op.hargappn is null then 0 else op.hargappn end as hargappn,(op.qtyproduk*(op.hargasatuan)) as total,op.tglpelayananakhir as tglkebutuhan, " & _
                    "op.deskripsiprodukquo as spesifikasi,pr.id as prid,sv.noverifikasi as noconfirm,sv.tglverifikasi as tglconfirm,sv.objectpegawaipjawabfk as pegawaiupkid,pg1.namalengkap as pegawaihps,pg1.nippns " & _
                    "from strukorder_t sp " & _
                    "LEFT JOIN orderpelayanan_t op on op.strukorderfk=sp.norec " & _
                    "LEFT JOIN produk_m pr on pr.id=op.objectprodukfk " & _
                    "LEFT JOIN satuanstandar_m ss on ss.id=op.objectsatuanstandarfk " & _
                    "LEFT JOIN pegawai_m as pg on pg.id=sp.objectpegawaiorderfk " & _
                    "LEFT JOIN ruangan_m as ru on ru.id=sp.objectruanganfk " & _
                    "LEFT JOIN ruangan_m as ru2 on ru2.id=sp.objectruangantujuanfk " & _
                    "LEFT JOIN strukverifikasi_t as sv on sv.norec = sp.objectsrukverifikasifk " & _
                    "LEFT JOIN pegawai_m as pg1 on pg1.id=sp.objectpegawaihpsfk " & _
                    "where sp.norec = '" & strNorec & "'"
            ReadRs strSQL
             If rs.EOF = False Then
                If IsNull(rs!nippns) Then
                    namalengkap = rs!pegawaihps
                    nip = "-"
                Else
                    namalengkap = rs!pegawaihps
                    nip = rs!nippns
                End If
             Else
                namalengkap = "-"
                nip = "-"
             End If
                    
'             ReadRs2 "select pg.id,pg.namalengkap,pg.nippns,jb.namajabatan " & _
'                     "from pegawai_m as pg " & _
'                     "left join jabatan_m as jb on jb.id = pg.objectjabatanfungsionalfk " & _
'                     "where objectjabatanfungsionalfk in (733,140) and pg.id=41"
             
             adoReport.CommandText = strSQL
             adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
           
             .usNoUsulan.SetUnboundFieldSource ("{Ado.noorderintern}")
             .usJenisUsulan.SetUnboundFieldSource ("{Ado.keteranganorder}")
'             .usUnitTujuan.SetUnboundFieldSource ("{Ado.ruangantujuan}")
'             .usUnitPengusul.SetUnboundFieldSource ("{Ado.ruangan}")
'             .udTglUsulan.SetUnboundFieldSource ("{Ado.tglorder}")
'             .udTglDibutuhkan.SetUnboundFieldSource ("{Ado.tglkebutuhan}")
'             .udTglKebutuhan.SetUnboundFieldSource ("{Ado.tglkebutuhan}")
             .usKdBarang.SetUnboundFieldSource ("{Ado.prid}")
             .usNamaBarang.SetUnboundFieldSource ("{ado.namaproduk}")
             .usSpesifikasi.SetUnboundFieldSource ("{ado.spesifikasi}")
             .unQty.SetUnboundFieldSource ("{Ado.qtyproduk}")
             .usSatuan.SetUnboundFieldSource ("{Ado.satuanstandar}")
             .ucHargaSatuan.SetUnboundFieldSource ("{Ado.hargasatuan}")
             .ucPpn.SetUnboundFieldSource ("{Ado.hargappn}")
             .ucTotal.SetUnboundFieldSource ("{Ado.total}")
             .usNoConfirm.SetUnboundFieldSource ("{Ado.noorderhps}")
             .udTglConfirm.SetUnboundFieldSource ("{Ado.tglhps}")
             .txtpenangungjawab1.SetText namalengkap
'             .txtJabatan.SetText RS2!namajabatan
             .txtnip.SetText nip
'             .txtpenangungjawab.SetText namalengkap
             
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

