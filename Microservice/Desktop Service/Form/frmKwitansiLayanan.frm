VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmKwitansiLayanan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmKwitansiLayanan.frx":0000
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
Attribute VB_Name = "frmKwitansiLayanan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New Cr_cetakkwitansiayanan
'Dim bolSuppresDetailSection10 As Boolean
'Dim ii As Integer
'Dim tempPrint1 As String
'Dim p As Printer
'Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String
Dim adoReport As New ADODB.Command

Dim strPrinter As String
Dim strPrinter1 As String
Dim PrinterNama As String

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

    Set frmKwitansiLayanan = Nothing
End Sub

Public Sub Cetak(strNorec As String, strKeterangan As String, strIdPegawai As String, strIdRuangan As String, view As String)
'On Error GoTo errLoad
Dim strSQL As String
Dim strFilter As String
Dim strFilter2 As String
Set frmKwitansiLayanan = Nothing
Dim adocmd As New ADODB.Command
Set Report = New Cr_cetakkwitansiayanan
Dim strarr() As String
Dim norec_apc As String
Dim i As Integer
Dim tglSbm, NamaKasir, totalBayar, NoKwitansi As String
Dim tgllahir As String
Dim Keterangan As String
Dim a As String
Dim KeteranganKasus As String
strSQL = ""
strFilter = ""
strFilter2 = ""
strFilter = strFilter & strFilter2 & " ORDER BY tp.tglpelayanan "

If strKeterangan <> "" Then
    Keterangan = strKeterangan
Else
    Keterangan = ""
End If

    With Report
    
        Set adoReport = New ADODB.Command
        adoReport.ActiveConnection = CN_String
        
        If Keterangan <> "Pembayaran Tagihan Non Layanan" Then
            a = "Jasa"
            strSQL = "SELECT pd.noregistrasi,ps.nocm,ps.tgllahir,convert(varchar,ps.tgllahir,105) as tglKelahiran,ps.namapasien, " & _
                     " apdp.tglregistrasi,jk.reportdisplay AS jk,ru2.namaruangan AS ruanganperiksa,ru.namaruangan AS ruangakhir, " & _
                     " (select top 1 pg.namalengkap from pegawai_m as pg INNER JOIN pelayananpasienpetugas_t p3 on p3.objectpegawaifk=pg.id " & _
                     " where p3.pelayananpasien=tp.norec and p3.objectjenispetugaspefk=4 ) AS namadokter,kp.kelompokpasien,tp.produkfk, " & _
                     " pro.namaproduk,tp.jumlah,CASE WHEN tp.hargasatuan is null then tp.hargajual else tp.hargasatuan END as hargasatuan," & _
                     " (case when tp.hargadiscount is null then 0 else tp.hargadiscount end) as diskon, (case when tp.jasa is null then 0 else tp.jasa end) as jasa, " & _
                     " (hargasatuan-(case when tp.hargadiscount is null then 0 else tp.hargadiscount end) )*tp.jumlah+ (case when tp.jasa is null then 0 else tp.jasa end)   as total,ks.namakelas,ar.asalrujukan,tp.tglpelayanan, " & _
                     " CASE WHEN rek.namarekanan is null then '-' else rek.namarekanan END as namapenjamin,kmr.namakamar,alm.alamatlengkap,pg1.namalengkap as dpjp,'' as keteranganlainnya,'Pembayaran Tagihan Layanan' as keteranganLayanan, 0 as qtyoranglast, " & _
                     " CASE WHEN tp.iscorona = 1 THEN 'True' Else 'False' END AS iscorona " & _
                     " FROM pasiendaftar_t AS pd INNER JOIN pasien_m AS ps ON pd.nocmfk = ps.id " & _
                     " INNER JOIN jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.id " & _
                     " INNER JOIN kelompokpasien_m AS kp ON pd.objectkelompokpasienlastfk = kp.id " & _
                     " INNER JOIN antrianpasiendiperiksa_t AS apdp ON apdp.noregistrasifk = pd.norec " & _
                     " INNER JOIN ruangan_m AS ru ON pd.objectruanganlastfk= ru.id " & _
                     " LEFT JOIN pelayananpasien_t AS tp ON tp.noregistrasifk = apdp.norec " & _
                     " LEFT JOIN pegawai_m AS pp ON apdp.objectpegawaifk = pp.id " & _
                     " LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id " & _
                     " LEFT JOIN kelas_m AS ks ON apdp.objectkelasfk = ks.id " & _
                     " LEFT JOIN asalrujukan_m AS ar ON apdp.objectasalrujukanfk = ar.id " & _
                     " left JOIN rekanan_m AS rek ON rek.id= pd.objectrekananfk " & _
                     " left JOIN kamar_m as kmr on apdp.objectkamarfk=kmr.id " & _
                     " INNER join ruangan_m  as ru2 on ru2.id=apdp.objectruanganfk " & _
                     " LEFT JOIN alamat_m as alm on alm.nocmfk = ps.id " & _
                     " LEFT JOIN pegawai_m as pg1 on pg1.id = pd.objectpegawaifk " & _
                     " where tp.strukfk = '" & strNorec & "' and pro.id <> 402611  " & strFilter
        Else
            a = "Qty Per Org/Per Km"
            strSQL = " SELECT  '-' as noregistrasi,CASE WHEN sp.nostruk_intern IS NULL OR sp.nostruk_intern = '' OR sp.nostruk_intern = '-' THEN '-' ELSE pm.nocm END AS nocm, " & _
                     " sp.namapasien_klien as namapasien,sp.tglstruk as tglregistrasi,CASE WHEN sp.nostruk_intern IS NULL OR sp.nostruk_intern = '' OR sp.nostruk_intern = '-' THEN '-' ELSE jk.reportdisplay END AS jk, " & _
                     " CASE WHEN sp.nostruk_intern IS NULL OR sp.nostruk_intern = '' OR sp.nostruk_intern = '-' THEN sp.tglfaktur ELSE pm.tgllahir END AS tgllahir, " & _
                     " CASE WHEN sp.nostruk_intern IS NULL OR sp.nostruk_intern = '' OR sp.nostruk_intern = '-' THEN convert(varchar,sp.tglfaktur,105) ELSE convert(varchar,pm.tgllahir,105) END AS tglKelahiran, " & _
                     " ru.namaruangan AS ruanganperiksa,ru.namaruangan AS ruangakhir,pg.namalengkap AS namadokter,sp.namarekanan as kelompokpasien, " & _
                     " spd.objectprodukfk,spd.qtyproduk as jumlah, " & _
                     " CASE WHEN pro.id = 1002121435 Then pro.namaproduk + ' - ' + sp.keteranganlainnya ELSE pro.namaproduk END AS namaproduk, " & _
                     " CASE WHEN spd.hargasatuan IS NULL THEN spd.hargasatuan ELSE spd.hargasatuan END AS hargasatuan, " & _
                     " (CASE WHEN spd.hargadiscount IS NULL THEN 0 ELSE spd.hargadiscount END) AS diskon, " & _
                     " (CASE WHEN spd.hargatambahan IS NULL THEN 0 ELSE spd.hargatambahan END) AS jasa, " & _
                     " (spd.hargasatuan - (CASE WHEN spd.hargadiscount IS NULL THEN 0 ELSE spd.hargadiscount END))*spd.qtyproduk+(CASE WHEN spd.hargatambahan IS NULL THEN 0 ELSE spd.hargatambahan END) AS total, " & _
                     " '-' as namakelas,  '-' as asalrujukan,sp.tglstruk,CASE WHEN sp.namarekanan IS NULL THEN '-' ELSE sp.namarekanan END AS namapenjamin,'-' as namakamar,spd.tglpelayanan, " & _
                     " CASE WHEN sp.nostruk_intern IS NULL OR sp.nostruk_intern = '' OR sp.nostruk_intern = '-' THEN sp.namatempattujuan ELSE alm.alamatlengkap END AS alamatlengkap,'-' as dpjp,sp.keteranganlainnya,'Pembayaran Tagihan Non Layanan' as keteranganLayanan, " & _
                     " CASE WHEN spd.qtyoranglast IS NOT NULL THEN spd.qtyoranglast ELSE 1 END AS qtyoranglast, " & _
                     " CASE WHEN sp.iscorona = 1 THEN 'True' Else 'False' END as iscorona " & _
                     " FROM strukpelayanan_t as sp " & _
                     " INNER JOIN strukpelayanandetail_t as spd on spd.nostrukfk = sp.norec " & _
                     " LEFT JOIN produk_m as pro on pro.id = spd.objectprodukfk " & _
                     " LEFT JOIN pasien_m as pm on pm.id = sp.nostruk_intern " & _
                     " LEFT JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk " & _
                     " LEFT JOIN ruangan_m as ru on ru.id = sp.objectruanganfk " & _
                     " LEFT JOIN pegawai_m as pg on pg.id = sp.objectpegawaipenanggungjawabfk " & _
                     " LEFT JOIN alamat_m as alm on alm.nocmfk = pm.id " & _
                     " WHERE sp.norec = '" & strNorec & "' and pro.id <> 402611 ORDER BY sp.tglstruk "
                     
        End If
                        
        ReadRs strSQL
        
        ReadRs2 "select convert(varchar, sbm.tglsbm, 105) as tglsbm, sum( sbm.totaldibayar) as totaldibayar, pg2.namalengkap AS namakasir, sbm.nosbm " & _
                "from strukbuktipenerimaan_t as sbm " & _
                "LEFT JOIN loginuser_s AS lu ON lu.id = sbm.objectpegawaipenerimafk " & _
                "LEFT JOIN pegawai_m AS pg2 ON pg2.id = lu.objectpegawaifk " & _
                "where sbm.nostrukfk = '" & strNorec & "'" & _
                "group by sbm.tglsbm,pg2.namalengkap,sbm.nosbm "
        
        adoReport.CommandText = strSQL
        adoReport.CommandType = adCmdUnknown
        .database.AddADOCommand CN_String, adoReport
        If Not rs.EOF Then
            Keterangan = rs!iscorona
            If IsNull(rs!tgllahir) Then
               tgllahir = "-"
            Else
               tgllahir = rs!tglKelahiran 'hitungUmurNew(Format(rs!tgllahir, "yyyy/MM/dd"), Format(Now, "yyyy/MM/dd"))
            End If
           ' tglSbm = Format(RS!tglSbm, "dd-MM-yyyy")
        Else
            tgllahir = "-"
            'tglSbm = "-"
        End If
        
        If RS2.EOF = False Then
            NamaKasir = RS2!NamaKasir
            tglSbm = RS2!tglSbm
            totalBayar = RS2!totaldibayar
            NoKwitansi = RS2!nosbm
        Else
            NamaKasir = "-"
            tglSbm = "-"
            totalBayar = "-"
             NoKwitansi = "-"
        End If
        
        .usKeteranganLayanan.SetUnboundFieldSource ("{ado.keteranganLayanan}")
        .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")
        .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
        .usnocm.SetUnboundFieldSource ("if isnull({ado.nocm}) then "" - "" else {ado.nocm} ")
        .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
        .usJK.SetUnboundFieldSource ("if isnull({ado.jk}) then "" - "" else {ado.jk} ")

        .usUnitLayanan.SetUnboundFieldSource ("{ado.ruanganperiksa}")
        .usTipe.SetUnboundFieldSource ("{ado.kelompokpasien}")
        .usKasus.SetUnboundFieldSource ("{ado.iscorona}")
        .usRujukan.SetUnboundFieldSource ("{ado.asalrujukan}")
        .usruangperiksa.SetUnboundFieldSource ("{ado.ruangakhir}")
        .usQty.SetUnboundFieldSource ("{ado.jumlah}")
        .usKamar.SetUnboundFieldSource ("if isnull({ado.namakamar}) then "" - "" else {ado.namakamar} ")
        .usKelas.SetUnboundFieldSource ("if isnull({ado.namakelas}) then "" - "" else {ado.namakelas} ") '("{ado.namakelas}")
        .usPenjamin.SetUnboundFieldSource ("{ado.namapenjamin}")
        .usKeterangan.SetUnboundFieldSource ("{ado.keteranganlainnya}")
        .usDokter.SetUnboundFieldSource ("{ado.ruanganperiksa}")
        .udTglPelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
        .usPelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
        .ucTarif.SetUnboundFieldSource ("{ado.hargasatuan}")
        .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
        .unJumlah.SetUnboundFieldSource ("{ado.jumlah}")
        .unQtyR.SetUnboundFieldSource ("{ado.jumlah}")
'       .ucTotal.SetUnboundFieldSource ("{ado.total}")
        .txtUser.SetText UCase(strIdPegawai)
        .txtTglSbm.SetText tglSbm
        .txtumur.SetText tgllahir
        '.usNamaKasir.SetUnboundFieldSource ("{ado.namakasir}")
        '.ucTotalBayar.SetUnboundFieldSource ("{ado.totaldibayar}")
        .txtTotalBayar.SetText Format(totalBayar, "#,##0.#0")
        .txtKasir.SetText NamaKasir
        .txtNoSbm.SetText NoKwitansi
        .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
        .usDpjp.SetUnboundFieldSource ("{ado.dpjp}")
        .unQtyOrg.SetUnboundFieldSource ("{ado.qtyoranglast}")
        .Text41.SetText a
        If a = "Jasa" Then
          .ucJasa.SetUnboundFieldSource ("{ado.jasa}")
        Else
          .ucJasa.SetUnboundFieldSource ("{ado.qtyoranglast}")
        End If

        If view = "false" Then
            strPrinter1 = GetTxt("Setting.ini", "Printer", "KwitansiLayananRajal")
            .SelectPrinter "winspool", strPrinter1, "Ne00:"
            .PrintOut False
            Unload Me
            Screen.MousePointer = vbDefault
         Else
            With CRViewer1
                .ReportSource = Report
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
