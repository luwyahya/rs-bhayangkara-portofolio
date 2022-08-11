VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Object = "{F9043C88-F6F2-101A-A3C9-08002B2F49FB}#1.2#0"; "comdlg32.ocx"
Begin VB.Form frmExpertiseLaboratoriumPolri 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmExpertiseLaboratoriumPolri.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   5820
   WindowState     =   2  'Maximized
   Begin MSComDlg.CommonDialog CommonDialog1 
      Left            =   3240
      Top             =   1440
      _ExtentX        =   847
      _ExtentY        =   847
      _Version        =   393216
   End
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
      Left            =   1200
      TabIndex        =   4
      Top             =   480
      Visible         =   0   'False
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
Attribute VB_Name = "frmExpertiseLaboratoriumPolri"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crHasillabHaji
Dim ReportPolri As New crHasillabPolri
'Dim Report1 As New crNarkoba
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String
Dim bolStrukResep As Boolean
Dim strPrinter As String
Dim strPrinter1 As String
Dim PrinterNama As String
Dim adoReport As New ADODB.Command


'setting printer
'Dim prn As Printer
'Dim sizepaper As CRPaperSize
'Dim duplexpaper As CRPrinterDuplexType
'Dim sPrinter As String, sDriver As String, sUkuranKertas As String
'Dim sDuplex As String, sOrientasKertas As String
'Dim tmpOrien As String

Private Sub cmdCetak_Click()
    PrinterNama = cboPrinter.Text
    ReportPolri.SelectPrinter "Winspool", PrinterNama, "Ne00:"
    ReportPolri.PrintOut False
    Screen.MousePointer = vbDefault
End Sub

Private Sub CmdOption_Click()
 crHasillabHaji.PrinterSetup Me.hwnd
End Sub

Private Sub cmdTutup_Click()
Unload Me
End Sub
Private Sub Addcbo(cbo As ComboBox, Name As String, index As Integer)
    cbo.AddItem Name                        ' Add the name of the item to the combo box
    cbo.ItemData(cbo.NewIndex) = index      ' Set the .itemdata(.listindex) for later retrieval
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
    Set frmExpertiseLaboratoriumPolri = Nothing
End Sub

Public Sub Cetak(strNorec As String, jenisKelamin As String, umur As String, User As String, view As String, norecpp As String, dokter As String, catatan As String)
'On Error GoTo errLoad
'On Error Resume Next
Set frmExpertiseLaboratoriumPolri = Nothing
Dim strSQL As String
Dim strFilter As String
Dim noOrder As String
Dim stringExp As String
Dim Expertise As String
Dim strUmur As String
Dim dok As String
If umur <> "" Then
    strUmur = umur
End If
If strNorec <> "" Then
'    noorder = " (" & Left(strNorec, Len(strNorec) - 1) & ")"
    noOrder = strNorec
End If

    With Report
'    Dim rsProfile As New ADODB.Recordset
'
'    strSQL = "select namaexternal,namapemerintahan, namalengkap, alamatlengkap, fixedphone, faksimile, website, kodepos, alamatemail, namakota from profile_m where  statusenabled='t'"
'
'    rsProfile.Open strSQL, CN, adOpenStatic, adLockReadOnly
'            strSQL = "select distinct * from ( SELECT  pp.tglpelayanan,maps.nourutjenispemeriksaan,maps.nourutdetail, pg3.namalengkap as DokterPelayanan,rj.namaruangan as ruanganperejuk,pm.nocm,pd.noregistrasi,so.noorder,pm.namapasien,alm.alamatlengkap,kp.kelompokpasien,rkn.namarekanan,pd.tglregistrasi,to_char(pd.tglregistrasi, 'DD-MM-YYYY') AS tglRegiss,pp.tglpelayanan  as tglawal, " & _
'                     " case when pg.namalengkap = '' or pg.namalengkap is null then pg2.namalengkap else pg.namalengkap end as namalengkap,pg1.namalengkap as dokterperiksa ,pm.tgllahir,to_char(pm.tgllahir, 'DD-MM-YYYY') AS tglLahirs,pp.noregistrasifk AS norec_apd,djp.detailjenisproduk,pp.produkfk,prd.namaproduk, " & _
'                     " maps.detailpemeriksaan,CASE WHEN maps.memohasil IS NULL THEN '' ELSE maps.memohasil END AS memohasil,maps.nourutdetail,maps.satuanstandarfk,ss.satuanstandar,nn.nilaitext,nn.nilaimin,nn.nilaimax,CASE WHEN nn.nilaimin <> '' and nn.nilaimax <> '' and hh.hasil <> '' then hh.hasil when hh.hasil IS NULL THEN '' WHEN nn.tipedata = '1' and nn.nilaimin <> '' and nn.nilaimax <> '' THEN(CASE WHEN (CAST (hh.hasil AS FLOAT) >= CAST (nn.nilaimin AS FLOAT) and CAST (hh.hasil AS FLOAT) <= CAST (nn.nilaimax AS FLOAT)) THEN   hh.hasil else '*' + '  ' + hh.hasil END) WHEN nn.tipedata = '2' and nn.nilaimin <> '' and nn.nilaimax <> ''   THEN(CASE WHEN (UPPER (hh.hasil) BETWEEN UPPER (nn.nilaimin) AND UPPER (nn.nilaimax)) THEN hh.hasil ELSE  '*' + '  ' + hh.hasil  END) ELSE   hh.hasil END AS hasil,maps.id AS map_id, " & _
'                     " hh.norec AS norec_hasil,jk.jeniskelamin,apd.tglmasuk AS tglverif,hh.tglhasil as tglakhir,('Tgl Selesai  :  ' + hh.tglhasil +  '          (-)         Tgl. Mulai :  '   + pp.tglpelayanan + '    (=)    Durasi :  '  + (hh.tglhasil - pp.tglpelayanan)) as tat FROM pelayananpasien_t  as pp " & _
'                     " INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk " & _
'                     " INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk " & _
'                     " LEFT JOIN strukorder_t AS so ON so.norec = apd.objectstrukorderfk  LEFT JOIN ruangan_m AS rj ON pd.objectruanganlastfk = rj.id " & _
'                     " INNER JOIN pasien_m AS pm ON pm.id = pd.nocmfk " & _
'                     " LEFT JOIN jeniskelamin_m AS jk ON jk.id = pm.objectjeniskelaminfk " & _
'                     " LEFT JOIN alamat_m AS alm ON alm.nocmfk = pm.id " & _
'                     " LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk " & _
'                     " LEFT JOIN rekanan_m AS rkn ON rkn.id = pd.objectrekananfk LEFT JOIN pegawai_m AS pg ON pg.id = so.objectpegawaiorderfk " & _
'                     " LEFT JOIN pegawai_m AS pg1 ON pg1.id = apd.objectpegawaifk LEFT JOIN pegawai_m AS pg2 ON pg2.id = apd.objectpegawaifk INNER JOIN produk_m as prd on prd.id = pp.produkfk  left join pelayananpasienpetugas_t as p3 on pp.norec = p3.pelayananpasien" & _
'                     " INNER JOIN detailjenisproduk_m as djp on djp.id = prd.objectdetailjenisprodukfk " & _
'                     " INNER JOIN maphasillab_m  as maps on maps.produkfk = prd.id " & _
'                     " INNER JOIN maphasillabdetail_m  as maps2 on maps2.maphasilfk = maps.id " & _
'                     " and maps2.jeniskelaminfk ='" & jenisKelamin & "' " & _
'                     " and maps2.kelompokumurfk in (select id from kelompokumur_m kuu where " & strUmur & " BETWEEN kuu.umurmin and kuu.umurmax) " & _
'                     " LEFT JOIN pegawai_m AS pg3 ON pg3.id = p3.objectpegawaifk and p3.objectpegawaifk ='4' INNER JOIN nilainormal_m  as nn on nn.id = maps2.nilainormalfk " & _
'                     " LEFT JOIN satuanstandar_m  as ss on ss.id = maps.satuanstandarfk " & _
'                     " LEFT JOIN hasillaboratorium_t  as hh on hh.norecpelayanan = pp.norec " & _
'                     " and pp.noregistrasifk=hh.noregistrasifk " & _
'                     " and maps.detailpemeriksaan = hh.detailpemeriksaan " & _
'                     " where pp.noregistrasifk = '" & strNorec & "' and pp.norec in (" & norecpp & ") " & _
'                     " ) as data order by  data.nourutjenispemeriksaan asc"

' posgri state
' strSQL = "select distinct * from ( SELECT  pp.tglpelayanan,maps.nourutjenispemeriksaan,maps.nourutdetail, pg3.namalengkap as DokterPelayanan,rj.namaruangan as ruanganperejuk,pm.nocm,pd.noregistrasi,so.noorder,pm.namapasien,alm.alamatlengkap + ' - Kel. ' + case when alm.namadesakelurahan is null then '-' else alm.namadesakelurahan end + ' - Kec.  ' + case when alm.namakecamatan is null then '-' else alm.namakecamatan end + ' -  Kota/Kab.  ' + alm.namakotakabupaten as alamatlengkap,kp.kelompokpasien,rkn.namarekanan,pd.tglregistrasi,convert(varchar,pd.tglregistrasi,105) AS tglRegiss,pp.tglpelayanan  as tglawal, " & _
'                     " case when pg.namalengkap = '' or pg.namalengkap is null then pg2.namalengkap else pg.namalengkap end as namalengkap,pg1.namalengkap as dokterperiksa ,pm.tgllahir,convert(varchar,pm.tgllahir,105) AS tglLahirs,pp.noregistrasifk AS norec_apd,djp.detailjenisproduk,pp.produkfk,prd.namaproduk, " & _
'                     " maps.detailpemeriksaan,CASE WHEN maps.memohasil IS NULL THEN '' ELSE maps.memohasil END AS memohasil,maps.nourutdetail,maps.satuanstandarfk,ss.satuanstandar,nn.nilaitext,nn.nilaimin,nn.nilaimax,CASE WHEN hh.hasil is null then '' when hh.flag ='Y' then '*   '  +  hh.hasil else hh.hasil END AS hasil,maps.id AS map_id, " & _
'                     " hh.norec AS norec_hasil,jk.jeniskelamin,apd.tglmasuk AS tglverif,hh.tglhasil as tglakhir,('Tgl Selesai  :  ' + convert(varchar,hh.tglhasil,20) +  '          (-)         Tgl. Mulai :  '   + convert(varchar,pp.tglpelayanan,20) + '    (=)    Durasi :  '  + convert(varchar,(hh.tglhasil - pp.tglpelayanan))) as tat,hh.flag FROM pelayananpasien_t  as pp " & _
'                     " INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk " & _
'                     " INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk " & _
'                     " LEFT JOIN strukorder_t AS so ON so.norec = apd.objectstrukorderfk  LEFT JOIN ruangan_m AS rj ON pd.objectruanganlastfk = rj.id " & _
'                     " INNER JOIN pasien_m AS pm ON pm.id = pd.nocmfk " & _
'                     " LEFT JOIN jeniskelamin_m AS jk ON jk.id = pm.objectjeniskelaminfk " & _
'                     " LEFT JOIN alamat_m AS alm ON alm.nocmfk = pm.id " & _
'                     " LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk " & _
'                     " LEFT JOIN rekanan_m AS rkn ON rkn.id = pd.objectrekananfk LEFT JOIN pegawai_m AS pg ON pg.id = so.objectpegawaiorderfk " & _
'                     " LEFT JOIN pegawai_m AS pg1 ON pg1.id = apd.objectpegawaifk LEFT JOIN pegawai_m AS pg2 ON pg2.id = apd.objectpegawaifk INNER JOIN produk_m as prd on prd.id = pp.produkfk  left join pelayananpasienpetugas_t as p3 on pp.norec = p3.pelayananpasien" & _
'                     " INNER JOIN detailjenisproduk_m as djp on djp.id = prd.objectdetailjenisprodukfk " & _
'                     " INNER JOIN maphasillab_m  as maps on maps.produkfk = prd.id " & _
'                     " INNER JOIN maphasillabdetail_m  as maps2 on maps2.maphasilfk = maps.id " & _
'                     " and maps2.jeniskelaminfk ='" & jenisKelamin & "' " & _
'                     " and maps2.kelompokumurfk in (select id from kelompokumur_m kuu where " & strUmur & " BETWEEN kuu.umurmin and kuu.umurmax) " & _
'                     " LEFT JOIN pegawai_m AS pg3 ON pg3.id = p3.objectpegawaifk and p3.objectpegawaifk ='4' INNER JOIN nilainormal_m  as nn on nn.id = maps2.nilainormalfk " & _
'                     " LEFT JOIN satuanstandar_m  as ss on ss.id = maps.satuanstandarfk " & _
'                     " LEFT JOIN hasillaboratorium_t  as hh on hh.norecpelayanan = pp.norec " & _
'                     " and pp.noregistrasifk=hh.noregistrasifk " & _
'                     " and maps.detailpemeriksaan = hh.detailpemeriksaan " & _
'                     " where (pp.noregistrasifk = '" & strNorec & "') and (pp.norec in (" & norecpp & ")) " & _
'                     "   ) as data order by  data.nourutjenispemeriksaan asc"
'diganti untuk menghilangkan yang tidak perlu
'    strSQL = " select distinct * from( SELECT        pp.tglpelayanan, maps.nourutjenispemeriksaan, maps.nourutdetail, pg3.namalengkap AS DokterPelayanan, rj.namaruangan AS ruanganperejuk, pm.nocm, pd.noregistrasi, so.noorder, pm.namapasien, " & _
'                "alm.alamatlengkap + ' - Kel. ' + CASE WHEN alm.namadesakelurahan IS NULL THEN '-' ELSE alm.namadesakelurahan END + ' - Kec.  ' + CASE WHEN alm.namakecamatan IS NULL " & _
'                "THEN '-' ELSE alm.namakecamatan END + ' -  Kota/Kab.  ' + alm.namakotakabupaten AS alamatlengkap, kp.kelompokpasien, rkn.namarekanan, pd.tglregistrasi, CONVERT(varchar, pd.tglregistrasi, 105) AS tglRegiss, " & _
'                "pp.tglpelayanan AS tglawal, CASE WHEN pg.namalengkap = '' OR " & _
'                "pg.namalengkap IS NULL THEN pg2.namalengkap ELSE pg.namalengkap END AS namalengkap, pg1.namalengkap AS dokterperiksa, pm.tgllahir, CONVERT(varchar, pm.tgllahir, 105) AS tglLahirs, pp.noregistrasifk AS norec_apd, " & _
'                "djp.detailjenisproduk, pp.produkfk, prd.namaproduk, maps.detailpemeriksaan, CASE WHEN maps.memohasil IS NULL THEN '' ELSE maps.memohasil END AS memohasil, maps.nourutdetail AS Expr1, maps.satuanstandarfk,  " & _
'                "ss.satuanstandar, nn.nilaitext, nn.nilaimin, nn.nilaimax, CASE WHEN hh.hasil IS NULL THEN '' WHEN hh.flag = 'Y' THEN '*   ' + hh.hasil ELSE hh.hasil END AS hasil, maps.id AS map_id, hh.norec AS norec_hasil,  " & _
'                "jk.jeniskelamin, apd.tglmasuk AS tglverif, hh.tglhasil AS tglakhir, 'Tgl Selesai  :  ' + CONVERT(varchar, hh.tglhasil, 20) + '          (-)         Tgl. Mulai :  ' + CONVERT(varchar, pp.tglpelayanan, 20)  " & _
'                "+ '    (=)    Durasi :  ' + CONVERT(VARCHAR,DATEDIFF(HOUR, pp.tglpelayanan, hh.tglhasil)) +' Jam '+CONVERT(VARCHAR,DATEDIFF(MINUTE, pp.tglpelayanan, hh.tglhasil))+' Menit' as tat, hh.flag " & _
'                " FROM            pelayananpasien_t AS pp INNER JOIN " & _
'                "antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk INNER JOIN " & _
'                "pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk LEFT OUTER JOIN " & _
'                "strukorder_t AS so ON so.norec = apd.objectstrukorderfk LEFT OUTER JOIN " & _
'                "ruangan_m AS rj ON pd.objectruanganlastfk = rj.id INNER JOIN " & _
'                "pasien_m AS pm ON pm.id = pd.nocmfk LEFT OUTER JOIN " & _
'                "jeniskelamin_m AS jk ON jk.id = pm.objectjeniskelaminfk LEFT OUTER JOIN " & _
'                "alamat_m AS alm ON alm.nocmfk = pm.id LEFT OUTER JOIN " & _
'                "kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk LEFT OUTER JOIN " & _
'                "rekanan_m AS rkn ON rkn.id = pd.objectrekananfk LEFT OUTER JOIN " & _
'                "pegawai_m AS pg ON pg.id = so.objectpegawaiorderfk LEFT OUTER JOIN "
                
'               CONVERT(varchar, hh.tglhasil - pp.tglpelayanan) AS tat
'strSQL = " select distinct * from( SELECT        pp.tglpelayanan,  maps.nourutdetail, rj.namaruangan AS ruanganperejuk, pm.nocm, pd.noregistrasi, so.noorder, pm.namapasien, " & _
'                "alm.alamatlengkap + ' - Kel. ' + CASE WHEN alm.namadesakelurahan IS NULL THEN '-' ELSE alm.namadesakelurahan END + ' - Kec.  ' + CASE WHEN alm.namakecamatan IS NULL " & _
'                "THEN '-' ELSE alm.namakecamatan END + ' -  Kota/Kab.  ' + alm.namakotakabupaten AS alamatlengkap, kp.kelompokpasien, rkn.namarekanan, pd.tglregistrasi, CONVERT(varchar, pd.tglregistrasi, 105) AS tglRegiss, " & _
'                "pp.tglpelayanan AS tglawal, " & _
'                "pg1.namalengkap AS dokterperiksa, pm.tgllahir, CONVERT(varchar, pm.tgllahir, 105) AS tglLahirs, " & _
'                "djp.detailjenisproduk, prd.namaproduk, maps.detailpemeriksaan, CASE WHEN maps.memohasil IS NULL THEN '' ELSE maps.memohasil END AS memohasil, " & _
'                "ss.satuanstandar, nn.nilaitext, nn.nilaimin, nn.nilaimax, CASE WHEN hh.hasil IS NULL THEN '' WHEN hh.flag = 'Y' THEN '*   ' + hh.hasil ELSE hh.hasil END AS hasil,  " & _
'                "jk.jeniskelamin, apd.tglmasuk AS tglverif, hh.tglhasil AS tglakhir, 'Tgl Selesai  :  ' + CONVERT(varchar, hh.tglhasil, 20) + '          (-)         Tgl. Mulai :  ' + CONVERT(varchar, pp.tglpelayanan, 20)  " & _
'                "+ '    (=)    Durasi :  ' + CONVERT(VARCHAR,DATEDIFF(HOUR, pp.tglpelayanan, hh.tglhasil)) +' Jam '+CONVERT(VARCHAR,DATEDIFF(MINUTE, pp.tglpelayanan, hh.tglhasil))+' Menit' as tat, hh.flag " & _
'                " FROM            pelayananpasien_t AS pp INNER JOIN " & _
'                "antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk INNER JOIN " & _
'                "pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk LEFT OUTER JOIN " & _
'                "strukorder_t AS so ON so.norec = apd.objectstrukorderfk LEFT OUTER JOIN " & _
'                "ruangan_m AS rj ON pd.objectruanganlastfk = rj.id INNER JOIN " & _
'                "pasien_m AS pm ON pm.id = pd.nocmfk LEFT OUTER JOIN " & _
'                "jeniskelamin_m AS jk ON jk.id = pm.objectjeniskelaminfk LEFT OUTER JOIN " & _
'                "alamat_m AS alm ON alm.nocmfk = pm.id LEFT OUTER JOIN " & _
'                "kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk LEFT OUTER JOIN " & _
'                "rekanan_m AS rkn ON rkn.id = pd.objectrekananfk LEFT OUTER JOIN " & _
'                "pegawai_m AS pg ON pg.id = so.objectpegawaiorderfk LEFT OUTER JOIN "
'
'
'    strSQL2 = "pegawai_m AS pg1 ON pg1.id = apd.objectpegawaifk LEFT OUTER JOIN " & _
'                "pegawai_m AS pg2 ON pg2.id = apd.objectpegawaifk INNER JOIN " & _
'                "produk_m AS prd ON prd.id = pp.produkfk LEFT OUTER JOIN " & _
'                "pelayananpasienpetugas_t AS p3 ON pp.norec = p3.pelayananpasien INNER JOIN " & _
'                "detailjenisproduk_m AS djp ON djp.id = prd.objectdetailjenisprodukfk INNER JOIN " & _
'                "maphasillab_m AS maps ON maps.produkfk = prd.id INNER JOIN " & _
'                "maphasillabdetail_m AS maps2 ON maps2.maphasilfk = maps.id AND maps2.jeniskelaminfk = '" & jenisKelamin & "' AND maps2.kelompokumurfk IN " & _
'                "(SELECT        id " & _
'                "FROM            kelompokumur_m AS kuu " & _
'                "WHERE        ( " & strUmur & "  BETWEEN umurmin AND umurmax)) LEFT OUTER JOIN " & _
'                "pegawai_m AS pg3 ON pg3.id = p3.objectpegawaifk AND p3.objectpegawaifk = '4' INNER JOIN " & _
'                "nilainormal_m AS nn ON nn.id = maps2.nilainormalfk LEFT OUTER JOIN " & _
'                "satuanstandar_m AS ss ON ss.id = maps.satuanstandarfk LEFT OUTER JOIN " & _
'                "hasillaboratorium_t AS hh ON hh.norecpelayanan = pp.norec AND pp.noregistrasifk = hh.noregistrasifk AND maps.detailpemeriksaan = hh.detailpemeriksaan and maps.id =hh.maphasilfk " & _
'                "   WHERE      (pp.noregistrasifk = '" & strNorec & "') and (pp.norec in (" & norecpp & ")) and  hh.flag is not null) as data order by  data.nourutdetail asc "
''                "   WHERE      (pp.noregistrasifk = '" & strNorec & "') and (pp.norec in (" & norecpp & "))) as data order by  data.nourutjenispemeriksaan asc "
' strSQL = strSQL + strSQL2
              
                    
                    strSQL = " select distinct * from( SELECT        pp.tglpelayanan,  maps.nourutdetail, rj.namaruangan AS ruanganperejuk, pm.nocm, pd.noregistrasi, so.noorder, pm.namapasien, " & _
                                    "alm.alamatlengkap + ' - Kel. ' + CASE WHEN alm.namadesakelurahan IS NULL THEN '-' ELSE alm.namadesakelurahan END + ' - Kec.  ' + CASE WHEN alm.namakecamatan IS NULL " & _
                                    "THEN '-' ELSE alm.namakecamatan END + ' -  Kota/Kab.  ' + alm.namakotakabupaten AS alamatlengkap , kp.kelompokpasien, rkn.namarekanan, pd.tglregistrasi, CONVERT(varchar, pd.tglregistrasi, 105) AS tglRegiss, " & _
                                    "pp.tglpelayanan AS tglawal, " & _
                                    "pg1.namalengkap AS dokterperiksa,pg2.namalengkap AS dokterperiksaedi, pm.tgllahir, CONVERT(varchar, pm.tgllahir, 105) AS tglLahirs, " & _
                                    "djp.detailjenisproduk, prd.namaproduk, maps.detailpemeriksaan, CASE WHEN maps.memohasil IS NULL THEN '' ELSE maps.memohasil END AS memohasil, " & _
                                    "ss.satuanstandar, nn.nilaitext, nn.nilaimin, nn.nilaimax, CASE WHEN hh.hasil IS NULL THEN '' WHEN hh.flag = 'Y' THEN '*   ' + hh.hasil ELSE hh.hasil END AS hasil,  " & _
                                    "jk.jeniskelamin, apd.tglmasuk AS tglverif, hh.tglhasil AS tglakhir, 'Tgl Selesai  :  ' + CONVERT(varchar, hh.tglhasil, 20) + '          (-)         Tgl. Mulai :  ' + CONVERT(varchar, pp.tglpelayanan, 20)  " & _
                                    "+ '    (=)    Durasi :  ' + CONVERT(VARCHAR,DATEDIFF(HOUR, pp.tglpelayanan, hh.tglhasil)) +' Jam '+CONVERT(VARCHAR,DATEDIFF(MINUTE, pp.tglpelayanan, hh.tglhasil))+' Menit' as tat, hh.flag " & _
                                    " FROM            pelayananpasien_t AS pp INNER JOIN " & _
                                    "antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk INNER JOIN " & _
                                    "pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk LEFT OUTER JOIN " & _
                                    "strukorder_t AS so ON so.norec = apd.objectstrukorderfk LEFT OUTER JOIN " & _
                                    "ruangan_m AS rj ON pd.objectruanganlastfk = rj.id INNER JOIN " & _
                                    "pasien_m AS pm ON pm.id = pd.nocmfk LEFT OUTER JOIN " & _
                                    "jeniskelamin_m AS jk ON jk.id = pm.objectjeniskelaminfk LEFT OUTER JOIN " & _
                                    "alamat_m AS alm ON alm.nocmfk = pm.id LEFT OUTER JOIN " & _
                                    "kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk LEFT OUTER JOIN " & _
                                    "rekanan_m AS rkn ON rkn.id = pd.objectrekananfk LEFT OUTER JOIN " & _
                                    "pegawai_m AS pg ON pg.id = so.objectpegawaiorderfk LEFT OUTER JOIN "
                                    
                                    
                        strSQL2 = "pegawai_m AS pg1 ON pg1.id = apd.objectpegawaifk LEFT OUTER JOIN " & _
                                    "produk_m AS prd ON prd.id = pp.produkfk LEFT OUTER JOIN " & _
                                    "pelayananpasienpetugas_t AS p3 ON pp.norec = p3.pelayananpasien INNER JOIN " & _
                                    "pegawai_m AS pg2 ON pg2.id = p3.objectpegawaifk INNER JOIN " & _
                                    "detailjenisproduk_m AS djp ON djp.id = prd.objectdetailjenisprodukfk INNER JOIN " & _
                                    "maphasillab_m AS maps ON maps.produkfk = prd.id INNER JOIN " & _
                                    "maphasillabdetail_m AS maps2 ON maps2.maphasilfk = maps.id AND maps2.jeniskelaminfk = '" & jenisKelamin & "' AND maps2.kelompokumurfk IN " & _
                                    "(SELECT        id " & _
                                    "FROM            kelompokumur_m AS kuu " & _
                                    "WHERE        ( " & strUmur & "  BETWEEN umurmin AND umurmax)) LEFT OUTER JOIN " & _
                                    "pegawai_m AS pg3 ON pg3.id = p3.objectpegawaifk AND p3.objectpegawaifk = '4' INNER JOIN " & _
                                    "nilainormal_m AS nn ON nn.id = maps2.nilainormalfk LEFT OUTER JOIN " & _
                                    "satuanstandar_m AS ss ON ss.id = maps.satuanstandarfk LEFT OUTER JOIN " & _
                                    "hasillaboratorium_t AS hh ON hh.norecpelayanan = pp.norec AND pp.noregistrasifk = hh.noregistrasifk AND maps.detailpemeriksaan = hh.detailpemeriksaan and maps.id =hh.maphasilfk" & _
                                    "   WHERE      (pp.noregistrasifk = '" & strNorec & "') and (pp.norec in (" & norecpp & ")) and  hh.flag is not null) as data order by  data.nourutdetail asc "
                    '                "   WHERE      (pp.noregistrasifk = '" & strNorec & "') and (pp.norec in (" & norecpp & "))) as data order by  data.nourutjenispemeriksaan asc "
                     strSQL = strSQL + strSQL2
                    
            
            ReadRs strSQL
            Dim Umurs As String
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
            If rs.EOF = False Then
                If rs("tglverif").Value = Null Then
                
                     MsgBox "Data Belum Di Verif"
                     Exit Sub
                End If
                Umurs = IIf(IsNull(rs("tgllahir")), "", rs("tgllahir"))
'               'header
'                .Text2.SetText stralmtLengkapRs & " , " & strNamaKota & ","
'                .Text1.SetText strNamaLengkapRs
'                .Text3.SetText strWebSite & ", " & strEmail
                .txtNocm.SetText IIf(IsNull(rs("nocm")), "", rs("nocm"))
                .txtNoregis.SetText IIf(IsNull(rs("noregistrasi")), "", rs("noregistrasi"))
                .txtNamaPasien.SetText IIf(IsNull(rs("namapasien")), "", rs("namapasien"))
                .txtAlamat.SetText IIf(IsNull(rs("alamatlengkap")), "", rs("alamatlengkap"))
                .txtJenisKelamin.SetText IIf(IsNull(rs("jeniskelamin")), "", rs("jeniskelamin"))
                .txtNoOrder.SetText IIf(IsNull(rs("noorder")), "", rs("noorder"))
                .txtUmur.SetText Umurs
                If catatan = "undefined" Then
                     catatan = ""
                End If
                .txtCatatan.SetText catatan
                dok = IIf(IsNull(rs("dokterperiksa")), "", rs("dokterperiksa"))
                 .txtDokterPenanggungjawab.SetText IIf(IsNull(rs("dokterperiksa")), "", rs("dokterperiksa"))
                .txtTglregis.SetText IIf(IsNull(rs("tglpelayanan")), Now, rs("tglpelayanan"))
                .txtLahir.SetText IIf(IsNull(rs("tglLahirs")), "-", rs("tglLahirs"))
                .txtDokterOrder.SetText dokter
                .txtNamaPenjamin.SetText IIf(IsNull(rs("kelompokpasien")), "", rs("kelompokpasien"))
                .txtRekanan.SetText IIf(IsNull(rs("namarekanan")), "", IIf(IsNull(rs("kelompokpasien")), "", rs("kelompokpasien")))
               'header
                  .usFlag.SetUnboundFieldSource ("{ado.flag}")
                  .usTatt.SetUnboundFieldSource ("{ado.tat}")
                  .txtUser.SetText User
                  .txtDokterPenanggungjawab.SetText dok
                  .Tat.SetText "Tanggal Mulai  : " & IIf(IsNull(rs("tglawal")), "", rs("tglawal")) & " - " & "Tanggal Selesai  : " & IIf(IsNull(rs("tglakhir")), Now, rs("tglakhir")) & "  -  " & " Durasi :  " & IIf(IsNull(rs("tat")), "", rs("tat"))
                 .ruper.SetText IIf(IsNull(rs("ruanganperejuk")), "-", rs("ruanganperejuk"))
                .udTglHasil.SetUnboundFieldSource ("{ado.tglakhir}")
                .usKeteranganHasil.SetUnboundFieldSource ("{ado.memohasil}")
                .Hasil.SetUnboundFieldSource ("{ado.hasil}")
                .NilaiNormal.SetUnboundFieldSource ("{ado.nilaitext}")
                .NamaPemeriksaan.SetUnboundFieldSource ("{ado.detailpemeriksaan}")
                .SatuanHasil.SetUnboundFieldSource ("{ado.satuanstandar}")
                .jenisspesimen.SetUnboundFieldSource ("{ado.detailjenisproduk}")
                .usDetailPemeriksaan.SetUnboundFieldSource ("{ado.namaproduk}")
                    
        If view = "false" Then
            strPrinter1 = GetTxt("Setting.ini", "Printer", "ExpertiseRadiologi")
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
            End If
        
    End With
Exit Sub
errLoad:
End Sub


Public Sub CetakPolri(strNorec As String, jenisKelamin As String, umur As String, User As String, view As String, norecpp As String, dokter As String, catatan As String, tglpelayanan As String, tglhasil As String, ruangan As String)
'On Error GoTo errLoad
'On Error Resume Next
Set frmExpertiseLaboratoriumPolri = Nothing
Dim strSQL As String
Dim strFilter As String
Dim noOrder As String
Dim stringExp As String
Dim Expertise As String
Dim strUmur As Integer
Dim dok As String
If umur <> "" Then
    strUmur = umur
End If
If strNorec <> "" Then
'    noorder = " (" & Left(strNorec, Len(strNorec) - 1) & ")"
    noOrder = strNorec
End If

    With ReportPolri

                     strSQL = " select distinct * from( SELECT        pp.tglpelayanan,  maps.nourutdetail, rj.namaruangan AS ruanganperejuk, pm.nocm, pd.noregistrasi, so.noorder, pm.namapasien, " & _
                                    "alm.alamatlengkap + ' - Kel. ' + CASE WHEN alm.namadesakelurahan IS NULL THEN '-' ELSE alm.namadesakelurahan END + ' - Kec.  ' + CASE WHEN alm.namakecamatan IS NULL " & _
                                    "THEN '-' ELSE alm.namakecamatan END + ' -  Kota/Kab.  ' + alm.namakotakabupaten AS alamatlengkap , kp.kelompokpasien, rkn.namarekanan, pd.tglregistrasi, CONVERT(varchar, pd.tglregistrasi, 105) AS tglRegiss, " & _
                                    "pp.tglpelayanan AS tglawal, " & _
                                    "pg1.namalengkap AS dokterperiksa,pg2.namalengkap AS dokterperiksaedi, pm.tgllahir, CONVERT(varchar, pm.tgllahir, 105) AS tglLahirs, " & _
                                    "djp.detailjenisproduk, prd.namaproduk, maps.detailpemeriksaan, CASE WHEN maps.memohasil IS NULL THEN '' ELSE maps.memohasil END AS memohasil, " & _
                                    "ss.satuanstandar, nn.nilaitext, nn.nilaimin, nn.nilaimax, CASE WHEN hh.hasil IS NULL THEN '' WHEN hh.flag = 'Y' THEN '*   ' + hh.hasil ELSE hh.hasil END AS hasil,  " & _
                                    "jk.jeniskelamin, apd.tglmasuk AS tglverif, hh.tglhasil AS tglakhir, 'Tgl Selesai  :  ' + CONVERT(varchar, hh.tglhasil, 20) + '          (-)         Tgl. Mulai :  ' + CONVERT(varchar, pp.tglpelayanan, 20)  " & _
                                    "+ '    (=)    Durasi :  ' + CONVERT(VARCHAR,DATEDIFF(HOUR, pp.tglpelayanan, hh.tglhasil)) +' Jam '+CONVERT(VARCHAR,DATEDIFF(MINUTE, pp.tglpelayanan, hh.tglhasil))+' Menit' as tat, hh.flag " & _
                                    " FROM            pelayananpasien_t AS pp INNER JOIN " & _
                                    "antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk INNER JOIN " & _
                                    "pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk LEFT OUTER JOIN " & _
                                    "strukorder_t AS so ON so.norec = apd.objectstrukorderfk LEFT OUTER JOIN " & _
                                    "ruangan_m AS rj ON pd.objectruanganlastfk = rj.id INNER JOIN " & _
                                    "pasien_m AS pm ON pm.id = pd.nocmfk LEFT OUTER JOIN " & _
                                    "jeniskelamin_m AS jk ON jk.id = pm.objectjeniskelaminfk LEFT OUTER JOIN " & _
                                    "alamat_m AS alm ON alm.nocmfk = pm.id LEFT OUTER JOIN " & _
                                    "kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk LEFT OUTER JOIN " & _
                                    "rekanan_m AS rkn ON rkn.id = pd.objectrekananfk LEFT OUTER JOIN " & _
                                    "pegawai_m AS pg ON pg.id = so.objectpegawaiorderfk LEFT OUTER JOIN "
                                    
                                    
                        strSQL2 = "pegawai_m AS pg1 ON pg1.id = apd.objectpegawaifk LEFT OUTER JOIN " & _
                                    "produk_m AS prd ON prd.id = pp.produkfk LEFT OUTER JOIN " & _
                                    "pelayananpasienpetugas_t AS p3 ON pp.norec = p3.pelayananpasien INNER JOIN " & _
                                    "pegawai_m AS pg2 ON pg2.id = p3.objectpegawaifk INNER JOIN " & _
                                    "detailjenisproduk_m AS djp ON djp.id = prd.objectdetailjenisprodukfk INNER JOIN " & _
                                    "maphasillab_m AS maps ON maps.produkfk = prd.id INNER JOIN " & _
                                    "maphasillabdetail_m AS maps2 ON maps2.maphasilfk = maps.id AND maps2.jeniskelaminfk = '" & jenisKelamin & "' AND maps2.kelompokumurfk IN " & _
                                    "(SELECT        id " & _
                                    "FROM            kelompokumur_m AS kuu " & _
                                    "WHERE        ( " & strUmur & "  BETWEEN umurmin AND umurmax)) LEFT OUTER JOIN " & _
                                    "pegawai_m AS pg3 ON pg3.id = p3.objectpegawaifk AND p3.objectpegawaifk = '4' INNER JOIN " & _
                                    "nilainormal_m AS nn ON nn.id = maps2.nilainormalfk LEFT OUTER JOIN " & _
                                    "satuanstandar_m AS ss ON ss.id = maps.satuanstandarfk LEFT OUTER JOIN " & _
                                    "hasillaboratorium_t AS hh ON hh.norecpelayanan = pp.norec AND pp.noregistrasifk = hh.noregistrasifk AND maps.detailpemeriksaan = hh.detailpemeriksaan and maps.id =hh.maphasilfk" & _
                                    "   WHERE      (pp.noregistrasifk = '" & strNorec & "') and (pp.norec in (" & norecpp & ")) and  hh.flag is not null) as data order by  data.nourutdetail asc "
                    '                "   WHERE      (pp.noregistrasifk = '" & strNorec & "') and (pp.norec in (" & norecpp & "))) as data order by  data.nourutjenispemeriksaan asc "
                     strSQL = strSQL + strSQL2
            ReadRs strSQL
            Dim Umurs As String
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
            If rs.EOF = False Then
                If rs("tglverif").Value = Null Then
                
                     MsgBox "Data Belum Di Verif"
                     Exit Sub
                End If
                
'                Umurs = hitungUmurNew(IIf(IsNull(rs("tgllahir")), "", rs("tgllahir")), rs("tglregistrasi").Value)
                Umurs = IIf(IsNull(rs("tgllahir")), "", rs("tgllahir"))
                
                
'               'header
'                .Text2.SetText stralmtLengkapRs & " , " & strNamaKota & ","
'                .Text1.SetText strNamaLengkapRs
'                .Text3.SetText strWebSite & ", " & strEmail
                .txtNocm.SetText IIf(IsNull(rs("nocm")), "", rs("nocm"))
                .txtNoregis.SetText IIf(IsNull(rs("noregistrasi")), "", rs("noregistrasi"))
                .txtNamaPasien.SetText IIf(IsNull(rs("namapasien")), "", rs("namapasien"))
                .txtAlamat.SetText IIf(IsNull(rs("alamatlengkap")), "", rs("alamatlengkap"))
                .txtJenisKelamin.SetText IIf(IsNull(rs("jeniskelamin")), "", rs("jeniskelamin"))
                .txtUmur.SetText Umurs
                If catatan = "undefined" Then
                     catatan = ""
                End If
                .txtCatatan.SetText catatan
                dok = IIf(IsNull(rs("dokterperiksa")), "", rs("dokterperiksa"))
                 .txtDokterPenanggungjawab.SetText IIf(IsNull(rs("dokterperiksa")), "", rs("dokterperiksa"))
                .txtTglregis.SetText tglpelayanan 'IIf(IsNull(rs("tglpelayanan")), Now, rs("tglpelayanan"))
                .txtTglHasil.SetText tglhasil 'IIf(IsNull(rs("tglpelayanan")), Now, rs("tglpelayanan"))
                .txtLahir.SetText IIf(IsNull(rs("tglLahirs")), "-", rs("tglLahirs"))
                .txtDokterOrder.SetText dokter
                .txtNamaPenjamin.SetText IIf(IsNull(rs("kelompokpasien")), "", rs("kelompokpasien"))
                .txtRekanan.SetText IIf(IsNull(rs("namarekanan")), "", IIf(IsNull(rs("kelompokpasien")), "", rs("kelompokpasien")))
               'header
                  .usFlag.SetUnboundFieldSource ("{ado.flag}")
                  .usTatt.SetUnboundFieldSource ("{ado.tat}")
                  .txtUser.SetText User
                  .txtDokterPenanggungjawab.SetText dok
                  .Tat.SetText "Tanggal Mulai  : " & IIf(IsNull(rs("tglawal")), "", rs("tglawal")) & " - " & "Tanggal Selesai  : " & IIf(IsNull(rs("tglakhir")), Now, rs("tglakhir")) & "  -  " & " Durasi :  " & IIf(IsNull(rs("tat")), "", rs("tat"))
                 .ruper.SetText ruangan 'IIf(IsNull(rs("ruanganperejuk")), "-", rs("ruanganperejuk"))
                .udTglHasil.SetUnboundFieldSource ("{ado.tglakhir}")
                .usKeteranganHasil.SetUnboundFieldSource ("{ado.memohasil}")
                .Hasil.SetUnboundFieldSource ("{ado.hasil}")
                .NilaiNormal.SetUnboundFieldSource ("{ado.nilaitext}")
                .NamaPemeriksaan.SetUnboundFieldSource ("{ado.detailpemeriksaan}")
                .SatuanHasil.SetUnboundFieldSource ("{ado.satuanstandar}")
                .jenisspesimen.SetUnboundFieldSource ("{ado.detailjenisproduk}")
                .usDetailPemeriksaan.SetUnboundFieldSource ("{ado.namaproduk}")
                    
        If view = "false" Then
            strPrinter1 = GetTxt("Setting.ini", "Printer", "ExpertiseRadiologi")
            .SelectPrinter "winspool", strPrinter1, "Ne00:"
            .PrintOut False
            Unload Me
            Screen.MousePointer = vbDefault
         Else
            With CRViewer1
                .ReportSource = ReportPolri
                .ViewReport
                .Zoom 1
            End With
            Me.Show
            Screen.MousePointer = vbDefault
            
        End If
            End If
        
    End With
Exit Sub
errLoad:
End Sub


'Public Property Get OrienKertas() As String
'    OrienKertas = tmpOrien
'End Property
'
'Public Property Let OrienKertas(ByVal vNewValue As String)
'    tmpOrien = vNewValue
'End Property
'setting printer
