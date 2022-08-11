VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakBuktiPenerimaanBarang2 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakBuktiPenerimaanBarang2.frx":0000
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
Attribute VB_Name = "frmCetakBuktiPenerimaanBarang2"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim ReportResep As New cr_BuktiPenerimaanBarang

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

    Set frmCetakBuktiPenerimaanBarang2 = Nothing

End Sub

Public Sub Cetak(view As String, strNores As String, Penerima As String, Penyerah As String, pegawaiMengetahui As String, jabatan1 As String, jabatan2 As String, jabatanMengetahui As String, test As String, strUser As String)
'view As String, strNoKirim As String, pegawaiPenyerah As String, pegawaiMengetahui As String, pegawaiPenerima As String, JabatanPenyerah As String, jabatanMengetahui, JabatanPenerima As String, strUser As String
'On Error GoTo errLoad
Set frmCetakBuktiPenerimaanBarang2 = Nothing
Dim strSQL As String
Dim pegawai1, pegawai2, pegawai3, nip1, nip2, nip3 As String
bolStrukResep = True
    
    
        With ReportResep
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            strSQL = "select sp.nostruk,sp.nofaktur,convert(varchar, sp.tglstruk, 105) as tglstruk,sp.tglspk, " & _
                    "convert(varchar, sp.tglfaktur, 105) as tglfaktur,convert(varchar, sp.tglkontrak, 105) as tglkontrak, " & _
                    "convert(varchar, sr.tglrealisasi, 105) as tglrealisasi, case when ap.asalproduk is null then '-' else ap.asalproduk end as asalproduk, " & _
                    "case when sp.totaldiscount is null then 0 else (sp.totaldiscount * 100) / sp.totalhargasatuan end as persendiskon," & _
                    "case when sp.totalppn is null then 0 else (sp.totalppn * 100) / sp.totalhargasatuan end as persenppn," & _
                    "case when rk.namarekanan is null then '-' else rk.namarekanan end as rekanan, " & _
                    "pr.id as idproduk, pr.namaproduk, " & _
                    "ss.satuanstandar, sp.totalharusdibayar, " & _
                    "(spd.hargasatuan - spd.hargadiscount + spd.hargappn) as harga, spd.qtyproduk, " & _
                    "case when ru.namaruangan is null then '-' else ru.kdruangan  +  ' - '  +  ru.namaruangan end as gudang,sp.keteranganambil," & _
                    "case when sp.nokontrak is null then '-' else sp.nokontrak end as nokontrak,case when sp.nosppb is null then '-' else sp.nosppb end as nosppb, " & _
                    "sp.keteranganambil,spd.qtyproduk*(spd.hargasatuan - spd.hargadiscount + spd.hargappn) as subtotal " & _
                    "from strukpelayanan_t sp left join strukpelayanandetail_t spd on spd.nostrukfk=sp.norec left JOIN pegawai_m pg on pg.id=sp.objectpegawaipenanggungjawabfk " & _
                    "left JOIN ruangan_m ru on ru.id=sp.objectruanganfk left JOIN produk_m pr on pr.id=spd.objectprodukfk left join asalproduk_m as ap on ap.id=spd.objectasalprodukfk " & _
                    "left join rekanan_m rk on rk.id=sp.objectrekananfk left JOIN jeniskemasan_m jkm on jkm.id=spd.objectjeniskemasanfk left join satuanstandar_m ss on ss.id=spd.objectsatuanstandarfk " & _
                    "left join riwayatrealisasi_t as rr on rr.penerimaanfk = sp.norec  left join strukrealisasi_t as sr on sr.norec = rr.objectstrukrealisasifk " & _
                    "where sp.norec = '" & strNores & "'" & _
                    "GROUP BY sp.nostruk,sp.nofaktur,sp.tglstruk,sp.tglspk,tglfaktur,sp.tglkontrak,ap.asalproduk, " & _
                    "rk.kdrekanan,rk.namarekanan,ru.kdruangan,ru.namaruangan,sp.tglstruk,sp.keteranganambil,sp.totaldiscount,sp.totalhargasatuan,sp.totalppn,pr.id,ss.satuanstandar,sp.totalharusdibayar,spd.hargasatuan, " & _
                    "spd.hargadiscount,spd.hargappn,pr.namaproduk,spd.qtyproduk,sp.nokontrak,sp.nosppb,sr.tglrealisasi"

             ReadRs strSQL
             If Penerima <> "" Then
            
               ReadRs2 "select pg.namalengkap,pg.nippns,jb.namajabatan " & _
                     "from pegawai_m as pg " & _
                     "left join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                     "where pg.id = '" & Penerima & "'"
                If RS2.EOF = False Then
                    pegawai1 = RS2!namalengkap
                    nip1 = "NIP. " & RS2!nippns
                Else
                    pegawai1 = "-"
                    nip1 = "NIP. -"
                End If
            Else
                    pegawai1 = "-"
                    nip1 = "NIP. -"
            End If
            
            If pegawaiMengetahui <> "" Then
                ReadRs4 "select pg.namalengkap,pg.nippns,jb.namajabatan " & _
                     "from pegawai_m as pg " & _
                     "left join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                     "where pg.id = '" & pegawaiMengetahui & "'"
                                            
                If RS4.EOF = False Then
                    pegawai3 = RS4!namalengkap
                    nip3 = "NIP. " & RS4!nippns
                Else
                    pegawai3 = "-"
                    nip3 = "NIP. -"
                End If
            Else
                pegawai3 = "-"
                nip3 = "NIP. -"
            End If
            
            If Penyerah <> "" Then
                            
                 ReadRs3 "select pg.namalengkap,pg.nippns,jb.namajabatan " & _
                     "from pegawai_m as pg " & _
                     "left join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                     "where pg.id = '" & Penyerah & "'"
                
               
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
                        
            
             adoReport.CommandText = strSQL
             adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport

             .txtUser.SetText strUser
           
'             .udtanggal.SetUnboundFieldSource ("{Ado.tglstruk}")
'             .udtanggal.SetUnboundFieldSource ("{Ado.tglstruk}")
'             .udTglSPK.SetUnboundFieldSource ("{Ado.tglrealisasi}")
             .usTglSPk.SetUnboundFieldSource ("{Ado.tglrealisasi}")
             .usResep.SetUnboundFieldSource ("{Ado.nofaktur}")
             .usPemesanan.SetUnboundFieldSource ("{Ado.nostruk}")
             .usPersenDiskon.SetUnboundFieldSource ("{Ado.persendiskon}")
             .usPersenPpn.SetUnboundFieldSource ("{Ado.persenppn}")
             .usRekanan.SetUnboundFieldSource ("{Ado.rekanan}")
             .usNamaRuangan.SetUnboundFieldSource ("{Ado.gudang}")
             .usSumberDana.SetUnboundFieldSource ("{Ado.asalproduk}")
             .usKdBarang.SetUnboundFieldSource ("{ado.idproduk}")
             .usNamaBarang.SetUnboundFieldSource ("{Ado.namaproduk}")
             .usSatuan.SetUnboundFieldSource ("{ado.satuanstandar}")
             .ucHarga.SetUnboundFieldSource ("{Ado.harga}")
             .unQty.SetUnboundFieldSource ("{Ado.qtyproduk}")
'             .ucTotalHarga.SetUnboundFieldSource ("{Ado.subtotal)")
'             .ucTotalBayar.SetUnboundFieldSource ("{Ado.totalharusdibayar}")
             .usNoSPK.SetUnboundFieldSource ("{Ado.nosppb}")
             .usNoKontrak.SetUnboundFieldSource ("{Ado.nokontrak}")
'             .udTglDokumen.SetUnboundFieldSource ("{Ado.tglfaktur}")
             .usTglDokumen.SetUnboundFieldSource ("{Ado.tglfaktur}")
             .udTglOrder.SetUnboundFieldSource ("{Ado.tglrealisasi}")
'             .tglKontrak.SetUnboundFieldSource ("{Ado.tglkontrak}")
             .usTglKontrak.SetUnboundFieldSource ("{Ado.tglkontrak}")
             .usKeteranganAmbil.SetUnboundFieldSource ("{Ado.keteranganambil}")
             .UnboundCurrency2.SetUnboundFieldSource ("{Ado.subtotal}")
             .txtJabatan1.SetText jabatan1
             .txtJabatan2.SetText jabatan2
             .txtJabatan.SetText jabatanMengetahui
             
             .txtMengetahui.SetText pegawai3
             .txtPenyerahan.SetText pegawai1
             .txtPenerima.SetText pegawai2
             
             .txtNipMengetahui.SetText nip3
             .txtNipPenyerahan.SetText nip1
             .txtNipPenerima.SetText nip2
             
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

