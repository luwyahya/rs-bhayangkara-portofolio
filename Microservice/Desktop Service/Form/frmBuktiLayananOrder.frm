VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmBuktiLayananOrder 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmBuktiLayananOrder.frx":0000
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
Attribute VB_Name = "frmBuktiLayananOrder"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New Cr_cetakbuktilayananruangan
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String
Dim bolStrukResep As Boolean
Dim strPrinter As String
Dim strPrinter1 As String
Dim PrinterNama As String
Dim adoReport As New ADODB.Command

Private Sub cmdCetak_Click()
    Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    Report.PrintOut False
End Sub

Private Sub CmdOption_Click()
    If bolStrukResep = True Then
        Report.PrinterSetup Me.hwnd
    End If
    CRViewer1.Refresh
End Sub

Private Sub Form_Load()
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "PasienDaftar")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmBuktiLayananOrder = Nothing
End Sub

Public Sub Cetak(strNorec As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Set frmBuktiLayananOrder = Nothing
Dim strSQL As String
Dim umur As String
Dim strFilter As String
Dim noOrder As String
If strNorec <> "" Then
    noOrder = strNorec
End If


    strSQL = ""
    With Cr_cetakbuktilayananruangan
    
            strSQL = " SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,convert(varchar,ps.tgllahir,105) as tglKelahiran,ps.namapasien, " & _
                     " pd.tglregistrasi,so.tglorder,jk.reportdisplay AS jk, ru1.namaruangan AS ruanganperiksa,ru.namaruangan AS ruangakhir, " & _
                     " kp.kelompokpasien,op.objectprodukfk, " & _
                     " pro.namaproduk,op.qtyproduk as jumlah,CASE WHEN op.hargasatuan IS NULL THEN 0 ELSE op.hargasatuan END AS hargasatuan, " & _
                     " (CASE WHEN op.hargadiscount IS NULL THEN 0 ELSE op.hargadiscount END)* op.qtyproduk AS diskon, " & _
                     " CASE WHEN op.hargasatuan IS NULL THEN 0 ELSE op.hargasatuan * op.qtyproduk END AS total,ks.namakelas,op.tglpelayanan, " & _
                     " CASE WHEN rek.namarekanan IS NULL THEN  '-' ELSE rek.namarekanan END AS namapenjamin, " & _
                     " pg1.namalengkap as dktrdpjp,alm.alamatlengkap,'-' AS asalrujukan,'-' AS namakamar,pp.namalengkap as namadokter " & _
                     " FROM strukorder_t AS so " & _
                     " INNER JOIN orderpelayanan_t as op on op.noorderfk = so.norec " & _
                     " INNER JOIN pasiendaftar_t as pd on pd.norec = so.noregistrasifk " & _
                     " INNER JOIN pasien_m AS ps ON pd.nocmfk = ps.id " & _
                     " LEFT JOIN jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.id " & _
                     " LEFT JOIN kelompokpasien_m AS kp ON pd.objectkelompokpasienlastfk = kp.id " & _
                     " LEFT JOIN ruangan_m AS ru ON so.objectruanganfk = ru.id " & _
                     " LEFT JOIN ruangan_m AS ru1 ON so.objectruangantujuanfk = ru1.id " & _
                     " LEFT JOIN pegawai_m AS pp ON so.objectpegawaiorderfk = pp.id " & _
                     " LEFT JOIN produk_m AS pro ON op.objectprodukfk = pro.id " & _
                     " LEFT JOIN kelas_m AS ks ON pd.objectkelasfk = ks.id " & _
                     " LEFT JOIN rekanan_m AS rek ON rek.id = pd.objectrekananfk " & _
                     " INNER JOIN pegawai_m as pg1 on pg1.id = pd.objectpegawaifk " & _
                     " LEFT JOIN alamat_m as alm on alm.nocmfk = ps.id " & _
                     " where so.noorder = '" & noOrder & "' and pro.id <> 402611 ORDER BY op.tglpelayanan"
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
            If rs.BOF Then
                .txtUmur.SetText "-"
            Else
                .txtUmur.SetText rs!tglKelahiran 'hitungUmurNew(Format(rs!tgllahir, "yyyy/MM/dd"), Format(Now, "yyyy/MM/dd"))
            End If
            .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usNoregistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
            .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJk.SetUnboundFieldSource ("{ado.jk}")
            .usDokterDpjp.SetUnboundFieldSource ("{ado.dktrdpjp}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
            .usUnitLayanan.SetUnboundFieldSource ("{ado.ruanganperiksa}")
            .usTipe.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usRujukan.SetUnboundFieldSource ("{ado.asalrujukan}")
            .usruangperiksa.SetUnboundFieldSource ("{ado.ruangakhir}")
            .usDokter.SetUnboundFieldSource ("{ado.namadokter}")
            .usQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usKamar.SetUnboundFieldSource ("if isnull({ado.namakamar}) then "" - "" else {ado.namakamar} ")
            .usKelas.SetUnboundFieldSource ("if isnull({ado.namakelas}) then "" - "" else {ado.namakelas} ") '("{ado.namakelas}")
            .usPenjamin.SetUnboundFieldSource ("{ado.namapenjamin}")
            .usPelayanan.SetUnboundFieldSource ("{ado.namaproduk}") '
            .ucTarif.SetUnboundFieldSource ("{ado.hargasatuan}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .usJumlah.SetUnboundFieldSource ("{ado.jumlah}")
            .unQtyN.SetUnboundFieldSource ("{ado.jumlah}")
            .ucTotal.SetUnboundFieldSource ("{ado.total}")

            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
            If RS2.BOF Then
                .txtUser.SetText "-"
            Else
                .txtUser.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
            End If
        
        If view = "false" Then
            strPrinter1 = GetTxt("Setting.ini", "Printer", "BuktiLayananRuangan")
            .SelectPrinter "winspool", strPrinter1, "Ne00:"
            .PrintOut False
            Unload Me
            Screen.MousePointer = vbDefault
         Else
            With CRViewer1
                .ReportSource = Cr_cetakbuktilayananruangan
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
