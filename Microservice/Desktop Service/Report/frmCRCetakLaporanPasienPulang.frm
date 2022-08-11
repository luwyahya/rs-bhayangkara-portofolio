VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRCetakLaporanPasienPulang 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCRCetakLaporanPasienPulang.frx":0000
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
Attribute VB_Name = "frmCRCetakLaporanPasienPulang"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanPasienPulang
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LaporanPasienPulang")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRCetakLaporanPasienPulang = Nothing
End Sub

Public Sub CetakLaporanPasienPulang(tglAwal As String, tglAkhir As String, strIdRuangan As String, _
                                        strIdKelompokPasien As String, strIdPegawai As String, strIdPerusahaan As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakLaporanPasienPulang = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, orderby As String
Set Report = New crLaporanPasienPulang

    strFilter = ""
    orderby = ""

    strFilter = " where pd.tglpulang BETWEEN '" & _
    Format(tglAwal, "yyyy-MM-dd 00:00:00") & "' AND '" & _
    Format(tglAkhir, "yyyy-MM-dd 23:59:59") & "'" ' and pp.strukfk is not null "
'    strFilter = strFilter & " and IdRuangan like '%" & strIdRuangan & "%' and IdDepartement like '%" & strIdDepartement & "%' and IdKelompokPasien like '%" & strIdKelompokPasien & "%' and IdDokter Like '%" & strIdDokter & "%'"
    
    If strIdRuangan <> "" Then strFilter = strFilter & " AND sp.objectruanganfk = '" & strIdRuangan & "' "
    If strIdKelompokPasien <> "" Then strFilter = strFilter & " AND pd.objectkelompokpasienlastfk = '" & strIdKelompokPasien & "' "
    If strIdPerusahaan <> "" Then strFilter = strFilter & " AND rk.id = '" & strIdPerusahaan & "' "
  
    orderby = strFilter & "group by pd.tglregistrasi,pd.tglpulang,sp.tglstruk,ps.nocm,pd.noregistrasi,ps.namapasien,sp.objectruanganfk,ru2.namaruangan, " & _
            "kl.namakelas,sp.nostruk,sbm.nosbm,rk.namarekanan,sp.totalharusdibayar,sp.totalprekanan,sp.totalbiayatambahan,pd.objectkelompokpasienlastfk,klp.kelompokpasien ,sbm.keteranganlainnya,ru.objectdepartemenfk " & _
            "order by ps.namapasien"
            'sp.tglstruk"

        
    strSQL = "select pd.tglregistrasi,pd.tglpulang,sp.tglstruk,(ps.nocm  +  ' / '  +  pd.noregistrasi) as nodaftar,upper(ps.namapasien) as namapasien,sp.objectruanganfk,ru2.namaruangan,kl.namakelas,pd.noregistrasi as nobilling,sbm.nosbm as nokwitansi,sum(case when djp.objectjenisprodukfk = 97 then (((pp.hargajual - (case when pp.hargadiscount is null then 0 else pp.hargadiscount end))* pp.jumlah)+case when pp.jasa is null then 0 else pp.jasa end) else 0 end) as totalresep, " & _
            "sum((pp.jumlah*(pp.hargajual-case when pp.hargadiscount is null then 0 else pp.hargadiscount end))+case when pp.jasa is null then 0 else pp.jasa end) as jumlahbiaya, sum((case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah) as diskon,case when rk.namarekanan is null then '-' else rk.namarekanan end as namarekanan, " & _
            "sp.totalharusdibayar,(case when sp.totalprekanan is null then 0 else sp.totalprekanan end) as totalppenjamin,(case when sp.totalbiayatambahan is null then 0 else sp.totalbiayatambahan end) as pendapatanlainlain,pd.objectkelompokpasienlastfk as idkelompokpasien,klp.kelompokpasien, sbm.keteranganlainnya,case when ru.objectdepartemenfk in (16,35) then 'Y' ELSE 'N' END as inap " & _
            "from strukpelayanan_t as sp " & _
            "left JOIN pelayananpasien_t as pp on pp.strukfk=sp.norec  " & _
            "LEFT JOIN strukbuktipenerimaan_t as sbm on sp.nosbmlastfk=sbm.norec   " & _
            "LEFT JOIN strukbuktipenerimaancarabayar_t as sbmc on sbm.norec=sbmc.nosbmfk  " & _
            "left JOIN carabayar_m as cb on cb.id=sbmc.objectcarabayarfk  " & _
            "left JOIN loginuser_s as lu on lu.id=sbm.objectpegawaipenerimafk  " & _
            "left JOIN pegawai_m as pg2 on pg2.id=lu.objectpegawaifk  " & _
            "left JOIN ruangan_m as ru2 on ru2.id=sp.objectruanganfk  " & _
            "inner JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk  " & _
            "inner JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk  " & _
            "left JOIN pegawai_m as pg on pg.id=apd.objectpegawaifk  " & _
            "inner JOIN ruangan_m as ru on ru.id=pd.objectruanganlastfk  " & _
            "inner JOIN produk_m as pr on pr.id=pp.produkfk  " & _
            "inner JOIN detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk  " & _
            "inner JOIN jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk  " & _
            "inner JOIN kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk  " & _
            "inner JOIN pasien_m as ps on ps.id=pd.nocmfk  " & _
            "INNER JOIN kelompokpasien_m as klp on klp.id=pd.objectkelompokpasienlastfk " & _
            "left join kelas_m  as kl on kl.id=pd.objectkelasfk  " & _
            "LEFT JOIN strukpelayananpenjamin_t as sppj on sp.norec=sppj.nostrukfk " & _
            "left join rekanan_m  as rk on rk.id=pd.objectrekananfk " & orderby
            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            
            .udTglMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .udTglPulang.SetUnboundFieldSource ("{ado.tglpulang}")
            .udTglBayar.SetUnboundFieldSource ("{ado.tglstruk}")
            .usNocm.SetUnboundFieldSource ("{ado.nodaftar}")
            .usPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usRuanganPelayanan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usJenisPasien.SetUnboundFieldSource ("{ado.namarekanan}") '("{ado.kelompokpasien}")
            .usKelas.SetUnboundFieldSource ("{ado.namakelas}")
            .usNoBilling.SetUnboundFieldSource ("{ado.nobilling}")
            .usNoKwitansi.SetUnboundFieldSource ("{ado.nokwitansi}")
            .ucTotalResep.SetUnboundFieldSource ("{ado.totalresep}")
            .ucJumlahBayar.SetUnboundFieldSource ("{ado.jumlahbiaya}")
'            .ucDeposit.SetUnboundFieldSource ("{ado.Deposit}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .ucPiutang.SetUnboundFieldSource ("{ado.totalppenjamin}")
'            .ucTanggunganPasien.SetUnboundFieldSource ("{ado.totalharusdibayar}")
'            .ucKembalian.SetUnboundFieldSource ("{ado.Kembalian}")
            .ucLainlain.SetUnboundFieldSource ("{ado.pendapatanlainlain}")
            .usPembayaran.SetUnboundFieldSource ("{ado.namarekanan}")
            .usInap.SetUnboundFieldSource ("{ado.inap}")
            
        .TxtTgl.SetText Format(tglAwal, "dd/MM/yyyy 00:00:00") & "  s/d  " & Format(tglAkhir, "dd/MM/yyyy 23:59:59")
        
        
        If strIdKelompokPasien <> "" Then
            ReadRs2 "SELECT kelompokpasien FROM kelompokpasien_m where id='" & strIdKelompokPasien & "' "
            .txtKelompokPasien.SetText "TIPE PASIEN " & UCase(IIf(IsNull(RS2!KelompokPasien), "SEMUA", RS2!KelompokPasien))
        Else
            .txtKelompokPasien.SetText "SEMUA TIPE PASIEN"
        End If
             
        ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
        If RS2.BOF Then
            .txtUser.SetText "-"
        Else
            .txtUser.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
        End If
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPasienPulang")
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
End Sub
