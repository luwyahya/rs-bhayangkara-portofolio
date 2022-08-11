VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakBuktiOrderBarang 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakBuktiOrderBarang.frx":0000
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
Attribute VB_Name = "frmCetakBuktiOrderBarang"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim ReportResep As New cr_BuktiOrderBarang

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

    Set frmCetakBuktiOrderBarang = Nothing

End Sub

Public Sub Cetak(test As String, strNoKirim As String, pegawaiMenyetujui As String, pegawaiMeminta As String, jabatanMenyetujui, jabatanMeminta As String, pegawaiM1 As String, pegawaiM2 As String, jabatanM1, jabatanM2 As String, view As String, strUser As String)
'On Error GoTo errLoad
Set frmCetakBuktiOrderBarang = Nothing
Dim strSQL As String
Dim pegawai1, pegawai2, pegawai3, pegawai4, pegawai5, nip1, nip2, nip3, nip4, nip5 As String

bolStrukResep = True
    
    
        With ReportResep
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            strSQL = "select so.tglorder, so.noorder, jp.name,ru2.namaruangan as ruangantujuan,so.keteranganorder, " & _
                    "ru.namaruangan as ruangan, 'KA. ' + dp.namadepartemen as kepalaBagian, pg.namalengkap, jp.name + ' ' + ru.namaruangan + ' Tgl ' + CONVERT(varchar, so.tglorder) AS keteranganorder, " & _
                    "pr.id as idproduk,pr.kdproduk as kdsirs,pr.namaproduk, ss.satuanstandar, op.qtyproduk, so.totalhargasatuan as hargasatuan, (so.totalhargasatuan * op.qtyproduk) as total " & _
                    "from strukorder_t as so " & _
                    "left join orderpelayanan_t as op on op.strukorderfk = so.norec " & _
                    "left join produk_m as pr on pr.id = op.objectprodukfk " & _
                    "left join satuanstandar_m as ss on ss.id = pr.objectsatuanstandarfk " & _
                    "left join jenis_permintaan_m as jp on jp.id = so.jenispermintaanfk " & _
                    "left join ruangan_m as ru on ru.id = so.objectruanganfk " & _
                    "left join ruangan_m as ru2 on ru2.id = so.objectruangantujuanfk " & _
                    "left JOIN departemen_m as dp on dp.id = ru.objectdepartemenfk " & _
                    "left join pegawai_m as pg on pg.id = so.objectpegawaiorderfk " & _
                    "where so.norec = '" & strNoKirim & "'"

             ReadRs strSQL
             If pegawaiMenyetujui <> "" Then
                 ReadRs4 "select pg.namalengkap,pg.nippns,jb.namajabatan " & _
                         "from pegawai_m as pg " & _
                         "left join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                         "where pg.id = '" & pegawaiMenyetujui & "'"
                
                If RS4.EOF = False Then
                    pegawai1 = RS4!namalengkap
                    nip1 = "NIP. " & RS4!nippns
                Else
                    pegawai1 = "-"
                    nip1 = "NIP. -"
                End If
            Else
                pegawai1 = "-"
                nip1 = "NIP. -"
            End If
            
            If pegawaiMeminta <> "" Then
                 ReadRs3 "select pg.namalengkap,pg.nippns,jb.namajabatan " & _
                         "from pegawai_m as pg " & _
                         "left join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                         "where pg.id = '" & pegawaiMeminta & "'"
            
           
            
                
                If RS3.EOF = False Then
                    pegawai2 = RS3!namalengkap
                    nip2 = "NIP. " & RS3!nippns
                Else
                    pegawai2 = "-"
                    nip2 = "NIP. -"
                End If
            Else
                pegawai2 = "-"
                nip2 = "NIP. -"
            End If
            
            If pegawaiM1 <> "" Then
                 ReadRs4 "select pg.namalengkap,pg.nippns,jb.namajabatan " & _
                         "from pegawai_m as pg " & _
                         "left join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                         "where pg.id = '" & pegawaiM1 & "'"
            
           
            
                
                If RS4.EOF = False Then
                    pegawai4 = RS4!namalengkap
                    nip4 = "NIP. " & RS4!nippns
                Else
                    pegawai4 = "-"
                    nip4 = "NIP. -"
                End If
            Else
                pegawai4 = "-"
                nip4 = "NIP. -"
            End If
            
            If pegawaiM2 <> "" Then
                 ReadRs5 "select pg.namalengkap,pg.nippns,jb.namajabatan " & _
                         "from pegawai_m as pg " & _
                         "left join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                         "where pg.id = '" & pegawaiM2 & "'"
            
           
            
                
                If RS5.EOF = False Then
                    pegawai5 = RS5!namalengkap
                    nip5 = "NIP. " & RS5!nippns
                Else
                    pegawai5 = "-"
                    nip5 = "NIP. -"
                End If
            Else
                pegawai5 = "-"
                nip5 = "NIP. -"
            End If
           
            
             
             adoReport.CommandText = strSQL
             adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport

             .txtUser.SetText strUser
           
             .udtglDok.SetUnboundFieldSource ("{Ado.tglorder}")
'             .udTglPermintaan.SetUnboundFieldSource ("{Ado.tglorder}")
'             .udTglTerima.SetUnboundFieldSource ("{Ado.tglorder}")
             .usNoDok.SetUnboundFieldSource ("{Ado.noorder}")
'             .usNoPemesanan.SetUnboundFieldSource ("{Ado.noorder}")
             .usRuangKirim.SetUnboundFieldSource ("{Ado.ruangan}")
             .usKeterangan.SetUnboundFieldSource ("{Ado.keteranganorder}")
             .usRuangTujuan.SetUnboundFieldSource ("{Ado.ruangantujuan}")
             .usKdBarang.SetUnboundFieldSource ("{ado.idproduk}")
             .usNamaBarang.SetUnboundFieldSource ("{Ado.namaproduk}")
             .usSatuan.SetUnboundFieldSource ("{ado.satuanstandar}")
'             .ucHarga.SetUnboundFieldSource ("{Ado.hargasatuan}")
             .unDiminta.SetUnboundFieldSource ("{Ado.qtyproduk}")
'             .unDikirim.SetUnboundFieldSource ("{Ado.qtyproduk}")
             .usKdBrgSirs.SetUnboundFieldSource ("{Ado.kdsirs}")
             .ucTotalHarga.SetUnboundFieldSource ("{Ado.total}")
             .txtJabatan.SetText jabatanMeminta
             .txtKepalaBagian.SetText pegawai1
             .Text73.SetText nip1
             .txtJabPeminta.SetText jabatanMenyetujui
             .txtPeminta.SetText pegawai2
             .txtNipPeminta.SetText nip2
             .txtJabatanM1.SetText jabatanM1
             .txtJabatanM2.SetText jabatanM2
             .txtMengetahui1.SetText pegawai4
             .txtMengetahui2.SetText pegawai5
             .txtNipM1.SetText nip4
             .txtNipM2.SetText nip5
'             .txtKepalaBagian.SetText UCase(IIf(isnull(RS!kepalaBagian), "-", RS!kepalaBagian))
             '.usKepalaBagian.SetUnboundFieldSource ("{Ado.kepalaBagian}")
'             .usNamaPenyerah.SetUnboundFieldSource ("{Ado.pegawaipengirim}")
'             .usNIPPenyerah.SetUnboundFieldSource ("{Ado.nippengirim}")
'             .usPnjPenerima.SetUnboundFieldSource ("{Ado.pnjPenerima}")
'             .usNamaPenerima.SetUnboundFieldSource ("{Ado.pegawaipenerima}")
'             .usNIPPenerima.SetUnboundFieldSource ("{Ado.nippenerima}")
             
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
                    .Zoom 100
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
        End With
Exit Sub
errLoad:

End Sub

