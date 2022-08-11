VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRLaporanPenerimaanKasir 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   6990
   Icon            =   "frmLaporanPenerimaanKasir.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   6990
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
      TabIndex        =   2
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
      TabIndex        =   1
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
      TabIndex        =   0
      Top             =   480
      Width           =   3015
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   7005
      Left            =   0
      TabIndex        =   3
      Top             =   0
      Width           =   7005
      DisplayGroupTree=   -1  'True
      DisplayToolbar  =   -1  'True
      EnableGroupTree =   -1  'True
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
End
Attribute VB_Name = "frmCRLaporanPenerimaanKasir"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crPenerimaanKasir1
Dim Report2 As New crPenerimaanKasir1rj
Dim Report3 As New crRekonpendaftaran
Dim Report4 As New crRekontindakan
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LaporanPenerimaan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRLaporanPenerimaanKasir = Nothing
End Sub

Public Sub CetakLaporanPenerimaanKasir(idKasir As String, tglAwal As String, tglAkhir As String, idPegawai As String, idDept As String, idRuangan As String, idDokter As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRLaporanPenerimaanKasir = Nothing
Dim adocmd As New ADODB.Command
    Dim str1 As String
    Dim str2 As String
    Dim str3 As String
    Dim str4 As String
    If idPegawai <> "" Then
        str1 = "and pg2.id=" & idPegawai & " "
    End If
    If idDept <> "" Then
        str4 = " and ru.objectdepartemenfk=" & idDept & " "
    End If
    If idRuangan <> "" Then
        str2 = " and pd.objectruanganlastfk=" & idRuangan & " "
    End If
'    If idDokter <> "" Then
'        str3 = " and pg2.id=" & idDokter & " "
'    End If
    
Set Report = New crPenerimaanKasir1
    strSQL = "select " & _
            "case when cb.id = 1 then sbm.totaldibayar else 0 end as tunai, " & _
            "case when cb.id > 1 then sbm.totaldibayar else 0 end as nontunai,case when pd.noregistrasi is null then sp.nostruk else pd.noregistrasi end as noregistrasi, sbm.tglsbm, ps.nocm, " & _
            "case when ps.namapasien is null then sp.namapasien_klien else ps.namapasien end as namapasien, " & _
            "case when kp.kelompokpasien is null then 'Non Layanan' else kp.kelompokpasien end as kelompokpasien, ru.namaruangan, pg.namalengkap, " & _
            "pg2.namaexternal as kasir, sbm.totaldibayar, " & _
            "CASE WHEN sp.totalprekanan is null then 0 else sp.totalprekanan end as hutangPenjamin, " & _
            "sp.totalharusdibayar, lu.namaexternal as namaLogin " & _
            "from strukbuktipenerimaan_t as sbm " & _
            "left JOIN strukbuktipenerimaancarabayar_t as sbmc on sbmc.nosbmfk=sbm.norec " & _
            "LEFT JOIN carabayar_m as cb on cb.id=sbmc.objectcarabayarfk " & _
            "INNER JOIN strukpelayanan_t as sp on sp.norec=sbm.nostrukfk  " & _
            "LEFT JOIN loginuser_s as lu on lu.id=sbm.objectpegawaipenerimafk " & _
            "LEFT JOIN pegawai_m as pg2 on pg2.id=lu.objectpegawaifk " & _
            "LEFT JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk " & _
            "LEFT JOIN pasien_m as ps on ps.id=sp.nocmfk " & _
            "LEFT join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
            "Left JOIN pegawai_m as pg on pg.id=pd.objectpegawaifk " & _
            "LEFT JOIN ruangan_m as ru on ru.id=pd.objectruanganlastfk " & _
            "LEFT JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk " & _
            "where sbm.tglsbm BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
            str1 & _
            str4 & _
            str2 & _
            "order by pd.noregistrasi"
            '            str3 &
            

   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .usNamaKasir.SetText idKasir
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .usNamaLogin.SetUnboundFieldSource ("{ado.kasir}")
            .udtTglSBM.SetUnboundFieldSource ("{ado.tglsbm}")
            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .ucTotalbiaya.SetUnboundFieldSource ("{ado.totaldibayar}")
            .ucHutangPenjamin.SetUnboundFieldSource ("{ado.hutangPenjamin}")
            .ucJmlBayar.SetUnboundFieldSource ("{ado.totalharusdibayar}")
            .ucTunai.SetUnboundFieldSource ("{ado.tunai}")
            .ucCard.SetUnboundFieldSource ("{ado.nontunai}")
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenerimaan")
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
Public Sub CetakLaporanPenerimaanKasirRJ(idKasir As String, tglAwal As String, tglAkhir As String, idPegawai As String, idDept As String, idRuangan As String, idDokter As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRLaporanPenerimaanKasir = Nothing
Dim adocmd As New ADODB.Command
    Dim str1 As String
    Dim str2 As String
    Dim str3 As String
    Dim str4 As String
    If idPegawai <> "" Then
        str1 = "and pg2.id=" & idPegawai & " "
    End If
'    If idDept <> "" Then
'        str4 = " and ru.objectdepartemenfk=" & idDept & " "
'    End If
        str4 = "and ru.objectdepartmenfk in ('3','28','18')"
    If idRuangan <> "" Then
        str2 = " and pd.objectruanganlastfk=" & idRuangan & " "
    End If
'    If idDokter <> "" Then
'        str3 = " and pg2.id=" & idDokter & " "
'    End If
    
Set Report2 = New crPenerimaanKasir1rj
    strSQL2 = "select 'a' as urutan,namaproduk,namaruangan,sum(baru) as baru,sum(lama) as lama,sum(konsul) as konsul,sum(jasamedis) as jasamedis ,sum(jasars) as jasars from v_setoranpembayaranpasienumum where tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "' and objectruanganfk::VARCHAR ilike '%" & idRuangan & "%'" & _
    "group by namaproduk,namaruangan "
    
    strSQL = strSQL2 & " union all select 'b' as urutan,'Tindakan' as namaproduk,namaruangan,sum(baru) as baru,sum(lama) as lama,sum(konsul) as konsul,sum(jasamedis) as jasamedis ,sum(jasars) as jasars from v_setoranpembayaranpasienumumtindakan where tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "' and objectruanganfk::VARCHAR ilike '%" & idRuangan & "%'" & _
    "group by namaruangan "
    
            '            str3 &
'
'    strSQL = "select namaproduk,namaruangan,statuskunjungan,objectruanganasalfk,sum(jasamedis) as jasamedis,sum(jasaRS)as jasars, CASE WHEN x.statuskunjungan = 'BARU' AND x.objectruanganasalfk IS NULL THEN 1 ELSE 0 END AS Baru, CASE WHEN x.statuskunjungan = 'LAMA' AND x.objectruanganasalfk IS NULL THEN 1 ELSE 0 END AS Lama, CASE WHEN x.objectruanganasalfk IS NOT NULL THEN 1 ELSE 0 END AS Konsul  from (" & _
'                " SELECT TOP (100) PERCENT produk_m.namaproduk, ruangan_m.namaruangan, antrianpasiendiperiksa_t.statuskunjungan, antrianpasiendiperiksa_t.objectruanganasalfk,CASE WHEN pelayananpasiendetail_t.komponenhargafk = 94 THEN pelayananpasiendetail_t.hargajual ELSE 0 END AS Jasamedis,CASE WHEN pelayananpasiendetail_t.komponenhargafk <> 94 THEN pelayananpasiendetail_t.hargajual ELSE 0 END AS JasaRS,  pelayananpasiendetail_t.tglpelayanan, antrianpasiendiperiksa_t.objectruanganfk" & _
'                " FROM antrianpasiendiperiksa_t INNER JOIN pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec INNER JOIN pelayananpasiendetail_t ON antrianpasiendiperiksa_t.norec = pelayananpasiendetail_t.noregistrasifk INNER JOIN produk_m ON pelayananpasiendetail_t.produkfk = produk_m.id INNER JOIN" & _
'                " komponenharga_m ON pelayananpasiendetail_t.komponenhargafk = komponenharga_m.id INNER JOIN ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id WHERE (pelayananpasiendetail_t.strukfk IS NOT NULL) AND (produk_m.objectdetailjenisprodukfk = '2016') and  tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "' and antrianpasiendiperiksa_t.objectruanganfk like '%" & idRuangan & "%') as x group by namaproduk,namaruangan,statuskunjungan,objectruanganasalfk"
'
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report2
        .database.AddADOCommand CN_String, adocmd
            .usNamaKasir.SetText idKasir
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .unpelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .unbaru.SetUnboundFieldSource ("{ado.baru}")
            .unlama.SetUnboundFieldSource ("{ado.lama}")
            .unkonsul.SetUnboundFieldSource ("{ado.konsul}")
            .unurutan.SetUnboundFieldSource ("{ado.urutan}")
            
            .unjasamedis.SetUnboundFieldSource ("{ado.jasamedis}")
            .unjasars.SetUnboundFieldSource ("{ado.jasars}")
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenerimaan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Report2
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
Public Sub CetakLaporanRekontindakan(idKasir As String, tglAwal As String, tglAkhir As String, kelompokpasien As String, idDept As String, idRuangan As String, idDokter As String, view As String, kasir As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRLaporanPenerimaanKasir = Nothing
Dim adocmd As New ADODB.Command
    Dim str1 As String
    Dim str2 As String
    Dim str3 As String
    Dim str4 As String
    Dim kasir1 As String
    Dim kelompok As String
    
    If kelompokpasien = "0" Then
        kelompok = "and (pasiendaftar_t.objectrekananfk = 0 or pasiendaftar_t.objectrekananfk IS NULL)"
    ElseIf kelompokpasien = "" Then
        kelompok = ""
    Else
        kelompok = "and pasiendaftar_t.objectrekananfk like '%" & kelompokpasien & "%'"
    End If
'    If idPegawai <> "" Then
'        str1 = "and pg2.id=" & idPegawai & " "
'    End If
    If idDept <> "" Then
        str4 = " and ru.objectdepartemenfk=" & idDept & " "
    End If
    If idRuangan <> "" Then
        str2 = " and pd.objectruanganlastfk=" & idRuangan & " "
    End If
    If idKasir <> "" Then
       kasir1 = "and "
    
    End If
'    If idDokter <> "" Then
'        str3 = " and pg2.id=" & idDokter & " "
'    End If
'ketuker pas bikin report daripada lieur ubah nama
Set Report3 = New crRekonpendaftaran
'    strSQL = "SELECT pelayananpasien_t.hargasatuan, pasien_m.nocm, pasien_m.namapasien, pasiendaftar_t.noregistrasi, ruangan_m.namaruangan, produk_m.namaproduk, pegawai_m.namalengkap, strukpelayanan_t.nostruk, rekanan_m.namarekanan FROM pelayananpasienpetugas_t INNER JOIN" & _
'             " pegawai_m ON pelayananpasienpetugas_t.objectpegawaifk = pegawai_m.id RIGHT OUTER JOIN pelayananpasien_t INNER JOIN strukpelayanan_t ON pelayananpasien_t.strukfk = strukpelayanan_t.norec INNER JOIN antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN" & _
'             " pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec INNER JOIN pasien_m ON pasiendaftar_t.nocmfk = pasien_m.id INNER JOIN ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id INNER JOIN produk_m ON pelayananpasien_t.produkfk = produk_m.id ON pelayananpasienpetugas_t.pelayananpasien = pelayananpasien_t.norec LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id" & _
'             " WHERE (pelayananpasien_t.strukfk IS NOT NULL) AND (pelayananpasien_t.isobat IS NULL) AND (produk_m.objectdetailjenisprodukfk = '2016')" & _
'             " and ruangan_m.id like '" & idRuangan & "' and ruangan_m.objectdepartmenfk like '" & idDept & "' "

    strSQL = " SELECT       SUM(pelayananpasien_t.hargasatuan * pelayananpasien_t.jumlah ) as total, pasien_m.nocm, pasien_m.namapasien, pasiendaftar_t.noregistrasi, ruangan_m.namaruangan,strukpelayanan_t.nostruk, case when rekanan_m.namarekanan is null then 'Umum / Diri Sendiri' else rekanan_m.namarekanan end as namarekanan FROM pelayananpasien_t INNER JOIN strukpelayanan_t ON pelayananpasien_t.strukfk = strukpelayanan_t.norec INNER JOIN" & _
                        " antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN " & _
                        " pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec INNER JOIN " & _
                        " pasien_m ON pasiendaftar_t.nocmfk = pasien_m.id INNER JOIN " & _
                        " ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id INNER JOIN " & _
                        " produk_m ON pelayananpasien_t.produkfk = produk_m.id LEFT OUTER JOIN " & _
                        " strukbuktipenerimaan_t ON strukpelayanan_t.norec = strukbuktipenerimaan_t.nostrukfk LEFT OUTER JOIN " & _
                        " rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
                        " WHERE (ruangan_m.id not in('12','4','447'))and (strukbuktipenerimaan_t.tglsbm between '" & tglAwal & "' and '" & tglAkhir & "')and(pelayananpasien_t.strukfk IS NOT NULL) AND (pelayananpasien_t.isobat IS NULL) AND (produk_m.objectdetailjenisprodukfk <> '2016') " & _
                        " and ruangan_m.id like '%" & idRuangan & "%' and ruangan_m.objectdepartemenfk like '%" & idDept & "%' " & kelompok & "" & _
                        " GROUP BY  pasien_m.nocm, pasien_m.namapasien, pasiendaftar_t.noregistrasi, ruangan_m.namaruangan,  strukpelayanan_t.nostruk, rekanan_m.namarekanan"
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report3
        .database.AddADOCommand CN_String, adocmd
            .usNamaKasir.SetText idKasir
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .Text4.SetText "REKONSILIASI PELAYANAN"
            .unnamalengkap.SetUnboundFieldSource ("{ado.namapasien}")
            .unnorm.SetUnboundFieldSource ("{ado.nocm}")
            .unpembayaran.SetUnboundFieldSource ("{ado.namarekanan}")
            .unTotal.SetUnboundFieldSource ("{ado.total}")
            
            .unnamaruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenerimaan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Report3
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

Public Sub CetakLaporanRekonPendaftaran(idKasir As String, tglAwal As String, tglAkhir As String, kelompokpasien As String, idDept As String, idRuangan As String, idDokter As String, view As String, kelompokpasienz As String, idKasirFilter As String, idRekanan As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRLaporanPenerimaanKasir = Nothing
Dim adocmd As New ADODB.Command
    Dim str1 As String
    Dim str2 As String
    Dim str3 As String
    Dim str4 As String
    Dim str5 As String
    Dim str6 As String
    Dim str7 As String
    Dim kelompok As String
    Dim namarekanan As String
    
    
   
    If idDept <> "" Then
        str1 = " and depUse =" & idDept & " "
    End If
    If idRuangan <> "" Then
        str2 = " and  idRuanganUse =" & idRuangan & " "
    End If
    If idDokter <> "" Then
        str3 = " and idDokter =" & idDokter & " "
    End If
    If kelompokpasien <> "" Then
        str4 = " and objectkelompokpasienlastfk =" & kelompokpasien & " "
    End If
    If idKasirFilter <> "" Then
        str5 = " and idkasir  in (" & idKasirFilter & ") "
    End If
    If idRekanan <> "" Then
        str5 = " and objectrekananfk  = " & idKasirFilter & " "
    End If
Set Report4 = New crRekontindakan
'    strSQL = "SELECT pelayananpasien_t.hargasatuan, pasien_m.nocm, pasien_m.namapasien, pasiendaftar_t.noregistrasi, ruangan_m.namaruangan, produk_m.namaproduk, pegawai_m.namalengkap, strukpelayanan_t.nostruk, rekanan_m.namarekanan FROM pelayananpasienpetugas_t INNER JOIN" & _
'             " pegawai_m ON pelayananpasienpetugas_t.objectpegawaifk = pegawai_m.id RIGHT OUTER JOIN pelayananpasien_t INNER JOIN strukpelayanan_t ON pelayananpasien_t.strukfk = strukpelayanan_t.norec INNER JOIN antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN" & _
'             " pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec INNER JOIN pasien_m ON pasiendaftar_t.nocmfk = pasien_m.id INNER JOIN ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id INNER JOIN produk_m ON pelayananpasien_t.produkfk = produk_m.id ON pelayananpasienpetugas_t.pelayananpasien = pelayananpasien_t.norec LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id" & _
'             " WHERE(pelayananpasien_t.tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "')and  (pelayananpasien_t.strukfk IS NOT NULL) AND (pelayananpasien_t.isobat IS NULL) AND (produk_m.objectdetailjenisprodukfk = '2016')" & _
'             " and ruangan_m.id like '%" & idRuangan & "%' and ruangan_m.objectdepartemenfk like '%" & idDept & "%' " & kelompok & " "
'
' idkasir,namakasir,
'idRuanganUse , depUse, objectrekananfk, objectkelompokpasienlastfk, kelompokpasien
'
    strSQL = "SELECT        namaproduk, namaruangan, namapasien, SUM(jasaMedis) AS jasaMedis, SUM(jasaLain) AS jasaLain, nocm, tglpelayanan, namalengkap AS dokterPeriksa,namakasir " & _
             "   From V_RekapPendapatanPelayananPerkomponen " & _
             " WHERE(tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "')   " & _
                str1 & _
                str2 & _
                str3 & _
                str4 & _
                str5 & _
                str6 & _
             "   GROUP BY namaproduk, namaruangan, namapasien, nocm, tglpelayanan, namalengkap,namakasir "
'    strSQL = " SELECT       SUM(pelayananpasien_t.hargasatuan) as total, pasien_m.nocm, pasien_m.namapasien, pasiendaftar_t.noregistrasi, ruangan_m.namaruangan,strukpelayanan_t.nostruk, case when rekanan_m.namarekanan is null then 'Umum / Diri Sendiri' else rekanan_m.namarekanan end as namarekanan FROM pelayananpasien_t INNER JOIN strukpelayanan_t ON pelayananpasien_t.strukfk = strukpelayanan_t.norec INNER JOIN" & _
'                        " antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN " & _
'                        " pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec INNER JOIN " & _
'                        " pasien_m ON pasiendaftar_t.nocmfk = pasien_m.id INNER JOIN " & _
'                        " ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id INNER JOIN " & _
'                        " produk_m ON pelayananpasien_t.produkfk = produk_m.id LEFT OUTER JOIN " & _
'                        " rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
'                        " WHERE        (pelayananpasien_t.strukfk IS NOT NULL) AND (pelayananpasien_t.isobat IS NULL) AND (produk_m.objectdetailjenisprodukfk <> '2016') " & _
'                        " and ruangan_m.id like '%" & idRuangan & "%' and ruangan_m.objectdepartemenfk like '%" & idDept & "%' " & kelompok & "" & _
'                        " GROUP BY  pasien_m.nocm, pasien_m.namapasien, pasiendaftar_t.noregistrasi, ruangan_m.namaruangan,  strukpelayanan_t.nostruk, rekanan_m.namarekanan"
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report4
        .database.AddADOCommand CN_String, adocmd
            .usNamaKasir.SetText idKasir
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .Text4.SetText "REKONSILIASI PELAYANAN "
            .unnamalengkap.SetUnboundFieldSource ("{ado.namapasien}")
            .unnorm.SetUnboundFieldSource ("{ado.nocm}")
            .undokter.SetUnboundFieldSource ("{ado.dokterPeriksa}")
            .unTotal.SetUnboundFieldSource ("{ado.jasaLain}")
            .unTotalDokter.SetUnboundFieldSource ("{ado.jasaMedis}")
            .unnamaruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .unpelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .usKasir.SetUnboundFieldSource ("{ado.namakasir}")
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenerimaan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Report4
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



