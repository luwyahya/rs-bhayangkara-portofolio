VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakBuktiPenerimaanBarang 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakBuktiPenerimaanBarang.frx":0000
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
Attribute VB_Name = "frmCetakBuktiPenerimaanBarang"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim ReportResep As New cr_RincianPenerimaanBarang

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

    Set frmCetakBuktiPenerimaanBarang = Nothing

End Sub

Public Sub Cetak(strNores As String, view As String, strUser As String)
On Error GoTo errLoad
Set frmCetakBuktiPenerimaanBarang = Nothing
Dim strSQL As String

bolStrukResep = True
    
    
        With ReportResep
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            strSQL = "select top 1 sp.nostruk as noresep, '-' as noregistrasi,sp.nostruk_intern as nocm,tglfaktur as tglregistrasi," & _
                    "sp.namapasien_klien as namapasienjk,pg.namalengkap,sp.noteleponfaks,sp.namatempattujuan, " & _
                    "ru.namaruangan,ru.namaruangan as ruanganpasien,sp.namarekanan as penjamin,'' as Umur,sp.tglfaktur as tgllahir,((spd.hargasatuan-spd.hargadiscount)*spd.qtyproduk)+spd.hargatambahan as totalharga, " & _
                    "((spd.hargasatuan-spd.hargadiscount)*spd.qtyproduk)+spd.hargatambahan as totalbiaya, " & _
                    "pr.namaproduk as namaprodukstandar, spd.qtyproduk as qtyhrg,spd.qtyproduk as jumlah, " & _
                    "CASE when spd.hargadiscount is null then 0 ELSE  spd.hargadiscount * spd.qtyproduk end as totaldiscound, " & _
                    "spd.resepke as rke,jkm.jeniskemasan " & _
                     "from strukpelayanan_t sp " & _
                    "INNER JOIN strukpelayanandetail_t spd on spd.nostrukfk=sp.norec " & _
                    "left JOIN pegawai_m pg on pg.id=sp.objectpegawaipenanggungjawabfk " & _
                    "left JOIN ruangan_m ru on ru.id=sp.objectruanganfk " & _
                    "left JOIN produk_m pr on pr.id=spd.objectprodukfk " & _
                    "left JOIN jeniskemasan_m jkm on jkm.id=spd.objectjeniskemasanfk " & _
                    "where sp.norec = '" & strNores & "'"

             ReadRs strSQL '& " limit 1 "
             
             adoReport.CommandText = strSQL
             adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
            
           
'             .txtnopendaftaran.SetText IIf(isnull(RS("noregistrasi")), "-", RS("noregistrasi")) 'RS("noregistrasi")
'             .txtnocm.SetText IIf(isnull(RS("nocm")), "-", RS("nocm"))
'             .txtnmpasien.SetText IIf(isnull(RS("namapasienjk")), "-", RS("namapasienjk")) 'RS("namapasienjk")
             .txtNamaRuangan.SetText IIf(IsNull(rs("ruanganpasien")), "-", rs("ruanganpasien")) 'RS("ruanganpasien")
             .txtNamaRuanganFarmasi.SetText IIf(IsNull(rs("namaruangan")), "-", rs("namaruangan")) 'RS("namaruangan")
            If IsNull(rs("penjamin")) = True Then
                .txtPenjamin.SetText "-"
            Else
                .txtPenjamin.SetText rs("penjamin")
            End If
'             If RS("umur") = "-" Then
'                .txtUmur.SetText "-"
'             Else
'                .txtUmur.SetText hitungUmur(Format(RS("tgllahir"), "dd/mm/yyyy"), Format(RS("tglregistrasi"), "dd/mm/yyyy"))
'             End If
'             .txtNamaDokter.SetText IIf(isnull(RS("namalengkap")), "-", RS("namalengkap")) 'RS("namalengkap")
             .txtUser.SetText strUser
'            If Left(RS("noresep"), 2) = "OB" Then
'                .txtTelp0.Suppress = False
'                .txtTelp1.Suppress = False
'                .txtTelp2.Suppress = False
'                .txtTelp2.SetText IIf(isnull(RS("noteleponfaks")), "-", RS("noteleponfaks")) 'RS!noteleponfaks
'
'                .txtAl0.Suppress = False
'                .txtAl1.Suppress = False
'                .txtAl2.Suppress = False
'                .txtAl2.SetText IIf(isnull(RS("namatempattujuan")), "-", RS("namatempattujuan")) 'RS!namatempattujuan
'            Else
                
                .txtTelp0.Suppress = True
                .txtTelp1.Suppress = True
                .txtTelp2.Suppress = True
                
                .txtAl0.Suppress = True
                .txtAl1.Suppress = True
                .txtAl2.Suppress = True
'            End If
             
             
           '  .usSatuan.SetUnboundFieldSource ("{ado.SatuanJmlK}")
          '   .udtanggal.SetUnboundFieldSource ("{Ado.tglpelayanan}")
             .usNoResep.SetUnboundFieldSource ("{Ado.noresep}")
             .ucbiayasatuan.SetUnboundFieldSource ("{Ado.totalharga}")
    '2         .ucHrgSatuan.SetUnboundFieldSource ("{Ado.hargasatuan}")
             .ustindakan.SetUnboundFieldSource ("{Ado.namaprodukstandar}")
             .usQtyHrg.SetUnboundFieldSource ("{Ado.qtyhrg}")
             .unQtyTotal.SetUnboundFieldSource ("{Ado.jumlah}")
             .ucGrandTotal.SetUnboundFieldSource ("{Ado.totalharga}")
             .undis.SetUnboundFieldSource ("{Ado.totaldiscound}")
             .unTotal.SetUnboundFieldSource ("{Ado.totalbiaya}")
             
'             .unRacikanKe.SetUnboundFieldSource ("{ado.rke}")
'             .usJenisObat.SetUnboundFieldSource ("{ado.jeniskemasan}")
             
             
             
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

