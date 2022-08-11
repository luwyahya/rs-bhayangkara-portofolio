VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRCetakLaporanPendapatanRuangan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCRCetakLaporanPendapatanRuangan.frx":0000
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
Attribute VB_Name = "frmCRCetakLaporanPendapatanRuangan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanPendapatanRuangan
'Dim Report2 As New crLaporanPendapatanRuanganDetail
'Dim Report3 As New crLaporanPendapatanPoli
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LaporanPendapatanRuangan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRCetakLaporanPendapatanRuangan = Nothing
End Sub

Public Sub CetakLaporanPendapatanRuangan(tglAwal As String, tglAkhir As String, strIdRuangan As String, _
                                        strIdKelompokPasien As String, strIdPegawai As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakLaporanPendapatanRuangan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, orderby As String
Set Report = New crLaporanPendapatanRuangan

    strFilter = ""
    orderby = ""
    
    strFilter = " where pp.tglpelayanan BETWEEN '" & _
    Format(tglAwal, "yyyy-MM-dd 00:00:00") & "' AND '" & _
    Format(tglAkhir, "yyyy-MM-dd 23:59:59") & "'"
'    strFilter = strFilter & " and IdRuangan like '%" & strIdRuangan & "%' and IdDepartement like '%" & strIdDepartement & "%' and IdKelompokPasien like '%" & strIdKelompokPasien & "%' and IdDokter Like '%" & strIdDokter & "%'"
    
    If strIdRuangan <> "" Then strFilter = strFilter & " AND apd.objectruanganfk = '" & strIdRuangan & "' "
    If strIdKelompokPasien <> "" Then strFilter = strFilter & " AND pd.objectkelompokpasienlastfk = '" & strIdKelompokPasien & "' "
    
    orderby = strFilter & "group by apd.objectruanganfk,ru.namaruangan, pd.objectkelompokpasienlastfk,klp.kelompokpasien " & _
            "order by ru.namaruangan"
        
    strSQL = "select apd.objectruanganfk,ru.namaruangan, sum(case when pr.id =395 then pp.jumlah else 0 end) as jmlkarcis, " & _
            "sum(case when pr.id =395 then pp.hargajual* pp.jumlah else 0 end) as karcis, sum(case when pr.id =10013116  then pp.jumlah else 0 end) as jmlembos,  " & _
            "sum(case when pr.id =10013116  then pp.hargajual* pp.jumlah else 0 end) as embos, sum(case when kp.id = 26 then pp.jumlah else 0 end) as jmlkonsul, " & _
            "sum(case when kp.id = 26 then pp.hargajual* pp.jumlah else 0 end) as konsul, " & _
            "sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.jumlah else 0 end) as jmltindakan,  " & _
            "sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.hargajual* pp.jumlah else 0 end) as tindakan,  " & _
            "sum((case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah) as diskon,  " & _
            "pd.objectkelompokpasienlastfk  as idkelompokpasien, klp.kelompokpasien   " & _
            "from strukpelayanan_t as sp  " & _
            "RIGHT JOIN pelayananpasien_t as pp on pp.strukfk=sp.norec  " & _
            "LEFT JOIN strukbuktipenerimaan_t as sbm on sp.nosbmlastfk=sbm.norec   " & _
            "LEFT JOIN strukpelayananpenjamin_t as sppj on sp.norec=sppj.nostrukfk " & _
            "inner JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk  " & _
            "inner JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk  " & _
            "LEFT JOIN pegawai_m as pg on pg.id=apd.objectpegawaifk  " & _
            "inner JOIN ruangan_m as ru on ru.id=apd.objectruanganfk  " & _
            "inner JOIN produk_m as pr on pr.id=pp.produkfk  " & _
            "inner JOIN detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk  " & _
            "inner JOIN jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk  " & _
            "inner JOIN kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk  " & _
            "inner JOIN pasien_m as ps on ps.id=pd.nocmfk  " & _
            "INNER JOIN kelompokpasien_m as klp on klp.id=pd.objectkelompokpasienlastfk " & orderby

    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usPenjamin.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .unJmlKarcis.SetUnboundFieldSource ("{ado.jmlkarcis}")
            .ucKarcis.SetUnboundFieldSource ("{ado.karcis}")
            .unJmlEmbos.SetUnboundFieldSource ("{ado.jmlembos}")
            .ucEmbos.SetUnboundFieldSource ("{ado.embos}")
            .unJmlKonsultasi.SetUnboundFieldSource ("{ado.jmlkonsul}")
            .ucKonsultasi.SetUnboundFieldSource ("{ado.konsul}")
            .unJmlTindakan.SetUnboundFieldSource ("{ado.jmltindakan}")
            .ucTindakan.SetUnboundFieldSource ("{ado.tindakan}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
        
        .TxtTgl.SetText Format(tglAwal, "dd/MM/yyyy 00:00:00") & "  s/d  " & Format(tglAkhir, "dd/MM/yyyy 23:59:59")
        
            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
            If RS2.BOF Then
                .txtUser.SetText "-"
            Else
                .txtUser.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
            End If
            

        If strIdKelompokPasien <> "" Then
            ReadRs2 "SELECT kelompokpasien FROM kelompokpasien_m where id='" & strIdKelompokPasien & "' "
            .txtKelompokPasien.SetText "TIPE PASIEN " & UCase(IIf(IsNull(RS2!KelompokPasien), "SEMUA", RS2!KelompokPasien))
        Else
            .txtKelompokPasien.SetText "SEMUA TIPE PASIEN"
        End If
        
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPendapatanRuangan")
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

'Public Sub CetakLaporanPendapatanRuanganDetail(tglAwal As String, tglAkhir As String, strIdRuangan As String, _
'                                        strIdKelompokPasien As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
''On Error Resume Next
'
'Set frmCRCetakLaporanPendapatanRuangan = Nothing
'Dim adocmd As New ADODB.Command
'Dim strFilter, orderby As String
'Set Report2 = New crLaporanPendapatanRuanganDetail
'
'    strFilter = ""
'    orderby = ""
'
'    strFilter = " where sp.tglstruk BETWEEN '" & _
'    Format(tglAwal, "yyyy-MM-dd 00:00:00") & "' AND '" & _
'    Format(tglAkhir, "yyyy-MM-dd 23:59:59") & "'"
''    strFilter = strFilter & " and IdRuangan like '%" & strIdRuangan & "%' and IdDepartement like '%" & strIdDepartement & "%' and IdKelompokPasien like '%" & strIdKelompokPasien & "%' and IdDokter Like '%" & strIdDokter & "%'"
'
'    If strIdRuangan <> "" Then strFilter = strFilter & " AND apd.objectruanganfk = '" & strIdRuangan & "' "
'    If strIdKelompokPasien <> "" Then strFilter = strFilter & " AND pd.objectkelompokpasienlastfk = '" & strIdKelompokPasien & "' "
'
'    orderby = strFilter & "group by apd.objectruanganfk,ru.namaruangan, pd.objectkelompokpasienlastfk,klp.kelompokpasien,pd.noregistrasi,ps.nocm,ps.namapasien,pp.strukfk,sp.nosbmlastfk " & _
'            "order by pd.noregistrasi"
'
'    strSQL = "select apd.objectruanganfk,ru.namaruangan, sum(case when pr.id =395 then pp.jumlah else 0 end) as jmlkarcis, " & _
'            "sum(case when pr.id =395 then pp.hargajual* pp.jumlah else 0 end) as karcis, sum(case when pr.id =10013116  then pp.jumlah else 0 end) as jmlembos,  " & _
'            "sum(case when pr.id =10013116  then pp.hargajual* pp.jumlah else 0 end) as embos, sum(case when kp.id = 26 then pp.jumlah else 0 end) as jmlkonsul, " & _
'            "sum(case when kp.id = 26 then pp.hargajual* pp.jumlah else 0 end) as konsul, " & _
'            "sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.jumlah else 0 end) as jmltindakan,  " & _
'            "sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.hargajual* pp.jumlah else 0 end) as tindakan,  " & _
'            "sum((case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah) as diskon,  " & _
'            "pd.objectkelompokpasienlastfk  as idkelompokpasien, klp.kelompokpasien,pd.noregistrasi,ps.nocm,ps.namapasien,CASE WHEN pp.strukfk is null then 'Belum' WHEN sp.nosbmlastfk is null then 'Belum' else 'Sudah' END as statusbayar   " & _
'            "from pelayananpasien_t as pp  " & _
'            "LEFT JOIN strukpelayanan_t as sp on pp.strukfk=sp.norec  " & _
'            "LEFT JOIN strukbuktipenerimaan_t as sbm on sp.nosbmlastfk=sbm.norec   " & _
'            "LEFT JOIN strukbuktipenerimaancarabayar_t as sbmc on sbm.norec=sbmc.nosbmfk  " & _
'            "inner JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk  " & _
'            "inner JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk  " & _
'            "LEFT JOIN pegawai_m as pg on pg.id=apd.objectpegawaifk  " & _
'            "inner JOIN ruangan_m as ru on ru.id=apd.objectruanganfk  " & _
'            "inner JOIN produk_m as pr on pr.id=pp.produkfk  " & _
'            "inner JOIN detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk  " & _
'            "inner JOIN jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk  " & _
'            "inner JOIN kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk  " & _
'            "inner JOIN pasien_m as ps on ps.id=sp.nocmfk  " & _
'            "INNER JOIN kelompokpasien_m as klp on klp.id=pd.objectkelompokpasienlastfk " & orderby
'
'
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Report2
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
'            .UsPenjamin.SetUnboundFieldSource ("{ado.kelompokpasien}")
'            .unJmlKarcis.SetUnboundFieldSource ("{ado.jmlkarcis}")
'            .ucKarcis.SetUnboundFieldSource ("{ado.karcis}")
'            .unJmlEmbos.SetUnboundFieldSource ("{ado.jmlembos}")
'            .ucEmbos.SetUnboundFieldSource ("{ado.embos}")
'            .unJmlKonsultasi.SetUnboundFieldSource ("{ado.jmlkonsul}")
'            .ucKonsultasi.SetUnboundFieldSource ("{ado.konsul}")
'            .unJmlTindakan.SetUnboundFieldSource ("{ado.jmltindakan}")
'            .ucTindakan.SetUnboundFieldSource ("{ado.tindakan}")
'            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
'            .usNoPendaftaran.SetUnboundFieldSource ("{ado.noregistrasi}")
'            .usNoCM.SetUnboundFieldSource ("{ado.nocm}")
'            .usPasien.SetUnboundFieldSource ("{ado.namapasien}")
'            .usStatusBayar.SetUnboundFieldSource ("{ado.statusbayar}")
'
'        .txtTgl.SetText Format(tglAwal, "dd/MM/yyyy 00:00:00") & "  s/d  " & Format(tglAkhir, "dd/MM/yyyy 23:59:59")
'
'            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
'            If RS2.BOF Then
'                .txtUser.SetText "-"
'            Else
'                .txtUser.SetText UCase(IIf(isnull(RS2("namalengkap")), "-", RS2("namalengkap")))
'            End If
'
'
'        If strIdKelompokPasien <> "" Then
'            ReadRs2 "SELECT kelompokpasien FROM kelompokpasien_m where id='" & strIdKelompokPasien & "' "
'            .txtKelompokPasien.SetText "TIPE PASIEN " & UCase(IIf(isnull(RS2!kelompokpasien), "SEMUA", RS2!kelompokpasien))
'        Else
'            .txtKelompokPasien.SetText "SEMUA TIPE PASIEN"
'        End If
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPendapatanRuangan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Report2
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
'Exit Sub
'errLoad:
'End Sub
'
'Public Sub CetakLaporanPendapatanPoli(tglAwal As String, tglAkhir As String, strIdRuangan As String, _
'                                        strIdKelompokPasien As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
''On Error Resume Next
'
'Set frmCRCetakLaporanPendapatanRuangan = Nothing
'Dim adocmd As New ADODB.Command
'Dim strFilter, orderby As String
'Set Report3 = New crLaporanPendapatanPoli
'
'    strFilter = ""
'    orderby = ""
'
'    strFilter = " where sp.tglstruk BETWEEN '" & _
'    Format(tglAwal, "yyyy-MM-dd 00:00:00") & "' AND '" & _
'    Format(tglAkhir, "yyyy-MM-dd 23:59:59") & "'"
''    strFilter = strFilter & " and IdRuangan like '%" & strIdRuangan & "%' and IdDepartement like '%" & strIdDepartement & "%' and IdKelompokPasien like '%" & strIdKelompokPasien & "%' and IdDokter Like '%" & strIdDokter & "%'"
'
'    If strIdRuangan <> "" Then strFilter = strFilter & " AND apd.objectruanganfk = '" & strIdRuangan & "' "
'    If strIdKelompokPasien <> "" Then strFilter = strFilter & " AND pd.objectkelompokpasienlastfk = '" & strIdKelompokPasien & "' "
'
'    orderby = strFilter & "group by apd.objectruanganfk,ru.namaruangan, pd.objectkelompokpasienlastfk,klp.kelompokpasien,pd.noregistrasi,ps.nocm,ps.namapasien,pp.strukfk,sp.nosbmlastfk " & _
'            "order by pd.noregistrasi"
'
'    strSQL = "select apd.objectruanganfk,ru.namaruangan, sum(case when pr.id =395 then pp.jumlah else 0 end) as jmlkarcis, " & _
'            "sum(case when pr.id =395 then pp.hargajual* pp.jumlah else 0 end) as karcis, sum(case when pr.id =10013116  then pp.jumlah else 0 end) as jmlembos,  " & _
'            "sum(case when pr.id =10013116  then pp.hargajual* pp.jumlah else 0 end) as embos, sum(case when kp.id = 26 then pp.jumlah else 0 end) as jmlkonsul, " & _
'            "sum(case when kp.id = 26 then pp.hargajual* pp.jumlah else 0 end) as konsul, " & _
'            "sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.jumlah else 0 end) as jmltindakan,  " & _
'            "sum(case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.hargajual* pp.jumlah else 0 end) as tindakan,  " & _
'            "sum((case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah) as diskon,  " & _
'            "pd.objectkelompokpasienlastfk  as idkelompokpasien, klp.kelompokpasien,pd.noregistrasi,ps.nocm,ps.namapasien,CASE WHEN pp.strukfk is null then 'Belum' WHEN sp.nosbmlastfk is null then 'Belum' else 'Sudah' END as statusbayar   " & _
'            "from pelayananpasien_t as pp  " & _
'            "LEFT JOIN strukpelayanan_t as sp on pp.strukfk=sp.norec  " & _
'            "LEFT JOIN strukbuktipenerimaan_t as sbm on sp.nosbmlastfk=sbm.norec   " & _
'            "LEFT JOIN strukbuktipenerimaancarabayar_t as sbmc on sbm.norec=sbmc.nosbmfk  " & _
'            "inner JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk  " & _
'            "inner JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk  " & _
'            "LEFT JOIN pegawai_m as pg on pg.id=apd.objectpegawaifk  " & _
'            "inner JOIN ruangan_m as ru on ru.id=apd.objectruanganfk  " & _
'            "inner JOIN produk_m as pr on pr.id=pp.produkfk  " & _
'            "inner JOIN detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk  " & _
'            "inner JOIN jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk  " & _
'            "inner JOIN kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk  " & _
'            "inner JOIN pasien_m as ps on ps.id=sp.nocmfk  " & _
'            "INNER JOIN kelompokpasien_m as klp on klp.id=pd.objectkelompokpasienlastfk " & orderby
'
'
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Report3
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
'            .UsPenjamin.SetUnboundFieldSource ("{ado.kelompokpasien}")
'            .unJmlKarcis.SetUnboundFieldSource ("{ado.jmlkarcis}")
'            .ucKarcis.SetUnboundFieldSource ("{ado.karcis}")
'            .unJmlEmbos.SetUnboundFieldSource ("{ado.jmlembos}")
'            .ucEmbos.SetUnboundFieldSource ("{ado.embos}")
'            .unJmlKonsultasi.SetUnboundFieldSource ("{ado.jmlkonsul}")
'            .ucKonsultasi.SetUnboundFieldSource ("{ado.konsul}")
'            .unJmlTindakan.SetUnboundFieldSource ("{ado.jmltindakan}")
'            .ucTindakan.SetUnboundFieldSource ("{ado.tindakan}")
'            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
'            .usNoPendaftaran.SetUnboundFieldSource ("{ado.noregistrasi}")
'            .usNoCM.SetUnboundFieldSource ("{ado.nocm}")
'            .usPasien.SetUnboundFieldSource ("{ado.namapasien}")
'            .usStatusBayar.SetUnboundFieldSource ("{ado.statusbayar}")
'
'        .txtTgl.SetText Format(tglAwal, "dd/MM/yyyy 00:00:00") & "  s/d  " & Format(tglAkhir, "dd/MM/yyyy 23:59:59")
'
'            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
'            If RS2.BOF Then
'                .txtUser.SetText "-"
'            Else
'                .txtUser.SetText UCase(IIf(isnull(RS2("namalengkap")), "-", RS2("namalengkap")))
'            End If
'
'
'        If strIdKelompokPasien <> "" Then
'            ReadRs2 "SELECT kelompokpasien FROM kelompokpasien_m where id='" & strIdKelompokPasien & "' "
'            .txtKelompokPasien.SetText "TIPE PASIEN " & UCase(IIf(isnull(RS2!kelompokpasien), "SEMUA", RS2!kelompokpasien))
'        Else
'            .txtKelompokPasien.SetText "SEMUA TIPE PASIEN"
'        End If
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPendapatanPoli")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Report3
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
'Exit Sub
'errLoad:
'End Sub
