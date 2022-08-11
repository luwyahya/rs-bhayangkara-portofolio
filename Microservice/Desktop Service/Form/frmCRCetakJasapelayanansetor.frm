VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRCetakJasapelayanansetor 
   Caption         =   "Medifirst2000"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCRCetakJasapelayanansetor.frx":0000
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
Attribute VB_Name = "frmCRCetakJasapelayanansetor"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crJasapelayanan
Dim Report2 As New crJasapelayananperawat
Dim Reportrekap As New crJasapelayananrekap
Dim Reportadministrasi As New crJasapelayananadministrasi
Dim Reportakomodasi As New crJasapelayananakomodasi
Dim Report3 As New crJasapelayanandarah
Dim Reportrekap2 As New crJasapelayananrekapparamedis
Dim Reportmondok As New crJasapelayananrawatmondok
Dim Reportmondok2 As New crJasapelayananrawatmondokpenjamin
Dim Reportrekappenunjang As New crJasapelayananrekappenunjang
Dim Reportdokterluar As New crTindakanDokterLuar
Dim Reportdokterluarrekap As New crTindakanDokterLuarRekap
Dim Reporttagihan As New crPenagihanpenjamin
'Dim bolSuppresDetailSection10 As Boolean
'Dim ii As Integer
'Dim tempPrint1 As String
'Dim p As Printer
'Dim p2 As Printer
Dim Reprortbol As Boolean
Dim Reprortbol2 As Boolean

Dim Reprortbolrekap As Boolean
Dim Reportboladmin As Boolean
Dim Reportbolakomodasi As Boolean
Dim reportboldarah As Boolean
Dim strDeviceName As String
Dim strDriverName As String
Dim Reprortbolrekap2 As Boolean
Dim Reportbolmondok As Boolean
Dim Reportbolmondokpenjamin As Boolean
Dim Reportbolpenunjang As Boolean
Dim reportboltindakandokterluar As Boolean
Dim reportboltindakandokterluarrekap As Boolean
Dim reportboltagihan As Boolean
Dim strPort As String

Private Sub cmdCetak_Click()
 If Reprortbol = True Then
        Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
        Report.PrintOut False
    ElseIf Reprortbol2 = True Then
        Report2.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
        Report2.PrintOut False
    ElseIf Reprortbolrekap = True Then
        Reportrekap.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
        Reportrekap.PrintOut False
    ElseIf reportboldarah = True Then
        Report3.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
        Report3.PrintOut False
    ElseIf Reprortbolrekap2 = True Then
        Reportrekap2.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
        Reportrekap2.PrintOut False
    ElseIf Reportbolmondok = True Then
        Reportmondok.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
        Reportmondok.PrintOut False
    ElseIf Reportbolmondokpenjamin = True Then
        Reportmondok2.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
        Reportmondok2.PrintOut False
    ElseIf Reportbolpenunjang = True Then
        Reportrekappenunjang.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
        Reportrekappenunjang.PrintOut False
    ElseIf reportboltindakandokterluar = True Then
        Reportdokterluar.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
        Reportdokterluar.PrintOut False
    ElseIf reportboltindakandokterluarrekap = True Then
        Reportdokterluarrekap.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
        Reportdokterluarrekap.PrintOut False
    ElseIf Reportboladmin = True Then
        Reportadministrasi.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
        Reportadministrasi.PrintOut False
    ElseIf Reportbolakomodasi = True Then
        Reportakomodasi.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
        Reportakomodasi.PrintOut False
     ElseIf reportboltagihan = True Then
        Reporttagihan.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
        Reporttagihan.PrintOut False
 End If
'    Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'    'PrinterNama = cboPrinter.Text
'    Report.PrintOut False
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "RincianBiayaPelayanan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Set frmCRCetakRincianBiayaObat = Nothing
End Sub

Public Sub CetakJasapelayanan(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, rekanan As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = True
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If rekanan = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = rekanan
End If
judul = "Jasa Konsul / Visit dan Tindakan"
txt4 = namaDokter
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir
'Judul = "Jasa Konsul / Visit dan Tindakan " + namaDokter + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
    
Set Report = New crJasapelayanan
    If idDokter = "25009" Then
'        pasien lab dikeluarkan tindakan covid sama paket
'        strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif, jasapelayanan_t.jeniskomponen, jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
'             " FROM pasien_m INNER JOIN" & _
'            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'            " jasapelayanan_t INNER JOIN" & _
'            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
'            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id INNER JOIN pelayananpasien_t ON jasapelayanan_t.norecpp = pelayananpasien_t.norec INNER JOIN kelas_m ON pelayananpasien_t.kelasfk = kelas_m.id  where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen in (94,98) and bruto>0 and detailjenisproduk_m.id<>'2016' and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%'" & _
'            " order by pasien_m.namapasien,jasapelayanan_t.tglpelayanan"
        If idpenjamin = 1 Then
        strSQL = "SELECT * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen in (94,98) and bruto>0 and iddetailjenisproduk <>'2016' and namaproduk not like '%cov%' and namaproduk not like '%paket%'" & _
            " order by namapasien,tglpelayanan"
        Else
        strSQL = "SELECT * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen in (94,98) and bruto>0 and iddetailjenisproduk <>'2016' and namaproduk not like '%cov%' and reportdisplay like '%" & rekanan & "%' and namaproduk not like '%paket%'" & _
            " order by namapasien,tglpelayanan"
        End If
      
    Else
        '//gara2 bedah beda komponen
'        If idRuangan = 44 Then
        If idpenjamin = 1 Then
            strSQL = "SELECT * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen in (94,98) and bruto>0 and iddetailjenisproduk<>'2016'  and ruanganfk not in ('44','277') "
            
            strSQL = strSQL & " union all SELECT * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen in(96,98) and bruto>0 and iddetailjenisproduk <>'2016'  and ruanganfk  in ('44','277')" & _
            " order by namapasien,tglpelayanan"
        Else
            strSQL = "SELECT * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen in (94,98) and bruto>0 and iddetailjenisproduk<>'2016' and reportdisplay like '%" & rekanan & "%' and ruanganfk not in ('44','277') "
            
            strSQL = strSQL & " union all SELECT * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen in(96,98) and bruto>0 and iddetailjenisproduk <>'2016' and reportdisplay like '%" & rekanan & "%' and ruanganfk  in ('44','277')" & _
            " order by namapasien,tglpelayanan"
        End If
'        Else
'            strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif, jasapelayanan_t.jeniskomponen, jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
'             " FROM pasien_m INNER JOIN" & _
'            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'            " jasapelayanan_t INNER JOIN" & _
'            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
'            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id  where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 and bruto>0 and detailjenisproduk_m.id<>'2016'" & _
'            " order by pasien_m.namapasien"
'
'        End If

    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    Reprortbol = True
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
'            If idDokter = "25009" Then
'            .Field4.Value = "1"
'            End If
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayanannonlayanan(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, rekanan As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = True
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If rekanan = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = rekanan
End If
judul = "Jasa Konsul / Visit dan Tindakan"
txt4 = namaDokter
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir
'Judul = "Jasa Konsul / Visit dan Tindakan " + namaDokter + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
    
Set Report = New crJasapelayanan
    strSQL = "SELECT 'Resume medis' as namaproduk ,strukpelayanan_t.namapasien_klien as namapasien, harganetto*strukpelayanandetail_t.qtyproduk as tarif, 40000*strukpelayanandetail_t.qtyproduk as bruto , 2000*strukpelayanandetail_t.qtyproduk as pph , 38000*strukpelayanandetail_t.qtyproduk as netto ,strukpelayanandetail_t.tglpelayanan ,'-' as nocm , '-' as namaruangan,'-' as namadepartemen FROM            strukpelayanandetail_t INNER JOIN" & _
            " strukpelayanan_t ON strukpelayanandetail_t.nostrukfk = strukpelayanan_t.norec WHERE    strukpelayanan_t.tglstruk between '" & tglAwal & "' and '" & tglAkhir & "' and    (strukpelayanandetail_t.objectprodukfk IN ('4052552', '4054491', '4054492', '4056960', '4056961'))" & _
            " order by namapasien_klien"
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    Reprortbol = True
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
'            If idDokter = "25009" Then
'            .Field4.Value = "1"
'            End If
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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

Public Sub CetakJasapelayanananastesi(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "Jasa Anestesi"
txt4 = namaDokter
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "Jasa Anestesi " + namaDokter + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
    
Set Report = New crJasapelayanan
'            strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif, jasapelayanan_t.jeniskomponen, jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
'             " FROM pasien_m INNER JOIN" & _
'            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'            " jasapelayanan_t INNER JOIN" & _
'            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
'            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id  where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=98 and bruto>0 and detailjenisproduk_m.id<>'2016' and jasapelayanan_t.objectjenispetugaspefk = 6"
        If idpenjamin = 1 Then
            strSQL = "select * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=98 and bruto>0 and iddetailjenisproduk<>'2016' and objectjenispetugaspefk = 6 "
        Else
            strSQL = "select * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=98 and bruto>0 and iddetailjenisproduk<>'2016' and objectjenispetugaspefk = 6 and reportdisplay like '%" & reportdisplay & "%'"
        End If

    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    Reprortbol = True
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
            
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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

Public Sub CetakTindakanDokterLuar(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "LAPORAN DETAIL TINDAKAN DOKTER LUAR"
txt4 = namaDokter
waktu = rekananjudul
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "LAPORAN DETAIL TINDAKAN DOKTER LUAR " + namaDokter + " ( " + namapenjamin + " )"
'waktu = "PELAKSANA: " + tglAwal + " s/d " + tglAkhir
strFilter = ""
    
Set Reportdokterluar = New crTindakanDokterLuar
'        If idpenjamin = 1 Then
If Len(idpenjamin) = 1 Then
            strSQL = "SELECT      ruangan_m.namaruangan,  pasiendaftar_t.noregistrasi, pelayananpasien_t.hargajual, pelayananpasien_t.hargasatuan, pelayananpasien_t.tglpelayanan, pelayananpasien_t.harganetto, pelayananpasien_t.jumlah, produk_m.namaproduk, pasien_m.nocm, " & _
                             " pasien_m.namapasien, pegawai_m.namalengkap, pelayananpasien_t.harganetto * pelayananpasien_t.jumlah AS subtotal, departemen_m.namadepartemen,pelayananpasienpetugas_t.objectpegawaifk ,kelompokpasien_m.kelompokpasien" & _
                            " FROM pegawai_m INNER JOIN pelayananpasienpetugas_t ON pegawai_m.id = pelayananpasienpetugas_t.objectpegawaifk INNER JOIN" & _
                            " pasien_m INNER JOIN pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN kelompokpasien_m on pasiendaftar_t.objectkelompokpasienlastfk = kelompokpasien_m.id inner join antrianpasiendiperiksa_t INNER JOIN" & _
                            " pelayananpasien_t ON antrianpasiendiperiksa_t.norec = pelayananpasien_t.noregistrasifk ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN" & _
                            " ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id ON pelayananpasienpetugas_t.pelayananpasien = pelayananpasien_t.norec INNER JOIN produk_m ON pelayananpasien_t.produkfk = produk_m.id INNER JOIN" & _
                            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id WHERE  pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "'  and  pelayananpasien_t.isobat is null and   (pegawai_m.namaexternal = 'dl') and pelayananpasien_t.tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "' and pelayananpasienpetugas_t.objectpegawaifk like '%" & idDokter & "%'  and ruangan_m.objectdepartemenfk <> 25 "
            strSQL = strSQL & " union all SELECT      jasadokterbedah.namaruangan,  pasiendaftar_t.noregistrasi, jasadokterbedah.hargajual, jasadokterbedah.hargajual as hargasatuan, jasadokterbedah.tglpelayanan, jasadokterbedah.harganetto, jasadokterbedah.jumlah, jasadokterbedah.namaproduk, jasadokterbedah.nocm,  jasadokterbedah.namalengkap as namapasien, jasadokterbedah.namalengkap, jasadokterbedah.harganetto * jasadokterbedah.jumlah AS subtotal, jasadokterbedah.namadepartemen,jasadokterbedah.objectpegawaifk   ,kelompokpasien_m.kelompokpasien" & _
                            " FROM            jasadokterbedah INNER JOIN pasiendaftar_t ON jasadokterbedah.noregistrasi = pasiendaftar_t.noregistrasi LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id inner join kelompokpasien_m on pasiendaftar_t.objectkelompokpasienlastfk = kelompokpasien_m.id  WHERE pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "'  and  tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "' and jasadokterbedah.objectpegawaifk like '%" & idDokter & "%'   order by  namalengkap"
        Else
            strSQL = "SELECT      ruangan_m.namaruangan,  pasiendaftar_t.noregistrasi, pelayananpasien_t.hargajual, pelayananpasien_t.hargasatuan, pelayananpasien_t.tglpelayanan, pelayananpasien_t.harganetto, pelayananpasien_t.jumlah, produk_m.namaproduk, pasien_m.nocm, " & _
                             " pasien_m.namapasien, pegawai_m.namalengkap, pelayananpasien_t.harganetto * pelayananpasien_t.jumlah AS subtotal, departemen_m.namadepartemen,pelayananpasienpetugas_t.objectpegawaifk ,kelompokpasien_m.kelompokpasien" & _
                            " FROM pegawai_m INNER JOIN pelayananpasienpetugas_t ON pegawai_m.id = pelayananpasienpetugas_t.objectpegawaifk INNER JOIN" & _
                            " pasien_m INNER JOIN pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN kelompokpasien_m on pasiendaftar_t.objectkelompokpasienlastfk = kelompokpasien_m.id inner join antrianpasiendiperiksa_t INNER JOIN" & _
                            " pelayananpasien_t ON antrianpasiendiperiksa_t.norec = pelayananpasien_t.noregistrasifk ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN" & _
                            " ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id ON pelayananpasienpetugas_t.pelayananpasien = pelayananpasien_t.norec INNER JOIN produk_m ON pelayananpasien_t.produkfk = produk_m.id INNER JOIN" & _
                            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id WHERE   pasiendaftar_t.objectkelompokpasienlastfk like '%" & idpenjamin & "%'  and   pelayananpasien_t.isobat is null and   (pegawai_m.namaexternal = 'dl') and pelayananpasien_t.tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "' and pelayananpasienpetugas_t.objectpegawaifk like '%" & idDokter & "%' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and ruangan_m.objectdepartemenfk <> 25 "
            strSQL = strSQL & " union all SELECT      jasadokterbedah.namaruangan,  pasiendaftar_t.noregistrasi, jasadokterbedah.hargajual, jasadokterbedah.hargajual as hargasatuan, jasadokterbedah.tglpelayanan, jasadokterbedah.harganetto, jasadokterbedah.jumlah, jasadokterbedah.namaproduk, jasadokterbedah.nocm,  jasadokterbedah.namalengkap as namapasien, jasadokterbedah.namalengkap, jasadokterbedah.harganetto * jasadokterbedah.jumlah AS subtotal, jasadokterbedah.namadepartemen,jasadokterbedah.objectpegawaifk  ,kelompokpasien_m.kelompokpasien " & _
                            " FROM            jasadokterbedah INNER JOIN pasiendaftar_t ON jasadokterbedah.noregistrasi = pasiendaftar_t.noregistrasi LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id inner join kelompokpasien_m on pasiendaftar_t.objectkelompokpasienlastfk = kelompokpasien_m.id  WHERE  pasiendaftar_t.objectkelompokpasienlastfk like '%" & idpenjamin & "%'  and tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "' and jasadokterbedah.objectpegawaifk like '%" & idDokter & "%' and rekanan_m.reportdisplay like '%" & reportdisplay & "%'   order by  namalengkap"

        End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    reportboltindakandokterluar = True
    With Reportdokterluar
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
            .untarif.SetUnboundFieldSource ("{ado.hargajual}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            .unnoregistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .unkelompokpasien.SetUnboundFieldSource ("{ado.kelompokpasien}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reportdokterluar
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
Public Sub CetakTindakanDokterLuarRekap(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "LAPORAN DETAIL TINDAKAN DOKTER LUAR"
txt4 = namaDokter
waktu = rekananjudul
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "LAPORAN DETAIL TINDAKAN DOKTER LUAR " + namaDokter + " ( " + namapenjamin + " )"
'waktu = "PELAKSANA: " + tglAwal + " s/d " + tglAkhir
strFilter = ""
    
Set Reportdokterluarrekap = New crTindakanDokterLuarRekap
    If idpenjamin = 1 Then
        strSQL = "select x.namapegawai,sum(x.jmlpasien)as jmlpasien,sum(x.subtotal) as subtotal from (SELECT       pegawai_m.namalengkap as namapegawai, count(pasiendaftar_t.noregistrasi) as jmlpasien, sum( pelayananpasien_t.harganetto * pelayananpasien_t.jumlah) AS subtotal " & _
                        " FROM pegawai_m INNER JOIN pelayananpasienpetugas_t ON pegawai_m.id = pelayananpasienpetugas_t.objectpegawaifk INNER JOIN" & _
                        " pasien_m INNER JOIN pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN antrianpasiendiperiksa_t INNER JOIN" & _
                        " pelayananpasien_t ON antrianpasiendiperiksa_t.norec = pelayananpasien_t.noregistrasifk ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN" & _
                        " ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id ON pelayananpasienpetugas_t.pelayananpasien = pelayananpasien_t.norec INNER JOIN produk_m ON pelayananpasien_t.produkfk = produk_m.id INNER JOIN" & _
                        " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id WHERE     pelayananpasien_t.isobat is null and   (pegawai_m.namaexternal = 'dl') and pelayananpasien_t.tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "' and pelayananpasienpetugas_t.objectpegawaifk like '%" & idDokter & "%' and  ruangan_m.objectdepartemenfk <> 25 group by pegawai_m.namalengkap "
        strSQL = strSQL & " union all  SELECT jasadokterbedah.namapegawai, COUNT(jasadokterbedah.noregistrasi) AS jmlpasien, SUM(jasadokterbedah.harganetto * jasadokterbedah.jumlah) AS subtotal FROM            pegawai_m INNER JOIN jasadokterbedah INNER JOIN pasiendaftar_t ON jasadokterbedah.noregistrasi = pasiendaftar_t.noregistrasi ON pegawai_m.id = jasadokterbedah.objectpegawaifk LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id" & _
                        " WHERE (pegawai_m.namaexternal = 'dl') and tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "' and jasadokterbedah.objectpegawaifk like '%" & idDokter & "%'    GROUP BY jasadokterbedah.namapegawai) as x  group by x.namapegawai order by namapegawai"
    Else
        strSQL = "select x.namapegawai,sum(x.jmlpasien)as jmlpasien,sum(x.subtotal) as subtotal from (SELECT       pegawai_m.namalengkap as namapegawai, count(pasiendaftar_t.noregistrasi) as jmlpasien, sum( pelayananpasien_t.harganetto * pelayananpasien_t.jumlah) AS subtotal " & _
                        " FROM pegawai_m INNER JOIN pelayananpasienpetugas_t ON pegawai_m.id = pelayananpasienpetugas_t.objectpegawaifk INNER JOIN" & _
                        " pasien_m INNER JOIN pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN antrianpasiendiperiksa_t INNER JOIN" & _
                        " pelayananpasien_t ON antrianpasiendiperiksa_t.norec = pelayananpasien_t.noregistrasifk ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN" & _
                        " ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id ON pelayananpasienpetugas_t.pelayananpasien = pelayananpasien_t.norec INNER JOIN produk_m ON pelayananpasien_t.produkfk = produk_m.id INNER JOIN" & _
                        " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id WHERE     pelayananpasien_t.isobat is null and   (pegawai_m.namaexternal = 'dl') and pelayananpasien_t.tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "' and pelayananpasienpetugas_t.objectpegawaifk like '%" & idDokter & "%' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and ruangan_m.objectdepartemenfk <> 25 group by pegawai_m.namalengkap "
        strSQL = strSQL & " union all  SELECT jasadokterbedah.namapegawai, COUNT(jasadokterbedah.noregistrasi) AS jmlpasien, SUM(jasadokterbedah.harganetto * jasadokterbedah.jumlah) AS subtotal FROM            pegawai_m INNER JOIN jasadokterbedah INNER JOIN pasiendaftar_t ON jasadokterbedah.noregistrasi = pasiendaftar_t.noregistrasi ON pegawai_m.id = jasadokterbedah.objectpegawaifk LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id" & _
                        " WHERE (pegawai_m.namaexternal = 'dl') and tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "' and jasadokterbedah.objectpegawaifk like '%" & idDokter & "%' and rekanan_m.reportdisplay like '%" & reportdisplay & "%'   GROUP BY jasadokterbedah.namapegawai) as x  group by x.namapegawai order by namapegawai"
    
    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    reportboltindakandokterluarrekap = True
    With Reportdokterluarrekap
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .undokter.SetUnboundFieldSource ("{ado.namapegawai}")
            .unjmlpasien.SetUnboundFieldSource ("{ado.jmlpasien}")
            .unTotal.SetUnboundFieldSource ("{ado.subtotal}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reportdokterluarrekap
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

Public Sub CetakJasapelayananmedis(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String

Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "Jasa Medis/Paramedis"
txt4 = namaDokter
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "Jasa Medis/Paramedis " + namaDokter + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
'strFilter = ""
    
Set Report = New crJasapelayanan

'            strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif, jasapelayanan_t.jeniskomponen, jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
'             " FROM pasien_m INNER JOIN" & _
'            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'            " jasapelayanan_t INNER JOIN" & _
'            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
'            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id  INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 and bruto>0 and detailjenisproduk_m.id<>'2016' and pegawai_m.namaexternal='jm' and produk_m.namaproduk not like '%cov%'  and pegawai_m.namalengkap not like '%dr%' and pegawai_m.namalengkap not like '%jasa%' and pegawai_m.namalengkap not in('Sewa alat') and bruto >0  order by pasien_m.namapasien"
        If idpenjamin = 1 Then
            strSQL = "SELECT * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk like '%" & idpenjamin & "%' and jeniskomponen=94 and bruto>0 and iddetailjenisproduk<>'2016' and namaexternal='jm' and namaproduk not like '%cov%'  and namalengkap not like '%dr%' and namalengkap not like '%jasa%' and namalengkap not in('Sewa alat') and bruto >0  order by namapasien,tglpelayanan"
        Else
            strSQL = "SELECT * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk like '%" & idpenjamin & "%' and jeniskomponen=94 and bruto>0 and iddetailjenisproduk<>'2016' and namaexternal='jm' and namaproduk not like '%cov%'  and namalengkap not like '%dr%' and namalengkap not like '%jasa%' and namalengkap not in('Sewa alat') and reportdisplay like '%" & reportdisplay & "%' and bruto >0  order by namapasien,tglpelayanan"
        End If
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    Reprortbol = True
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
            
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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

Public Sub CetakJasapelayananmedisodc(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String

Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "Jasa keperawatan ODC BEDAH SENTRAL"
txt4 = namaDokter
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "Jasa Medis/Paramedis " + namaDokter + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
'strFilter = ""
    
Set Report = New crJasapelayanan


            strSQL = "SELECT v_odc.* ,harganetto AS hargadipake, harganetto * 0.05 as pph2 ,harganetto -(harganetto * 0.05) as netto2,komponenharga FROM v_odc " & _
            " where tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "' and ruanganfk='277' and idkomponen in (112,25,26,114)  order by namapasien,tglpelayanan"
            
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    Reprortbol = True
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.komponenharga}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.hargadipake}")
            .unpph21.SetUnboundFieldSource ("{ado.pph2}")
            .untarif.SetUnboundFieldSource ("{ado.hargadipake}")
            .unnetto.SetUnboundFieldSource ("{ado.netto2}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
            
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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

Public Sub CetakJasapelayananmedispenunjang(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String

Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "Jasa Medis/Paramedis Penunjang"
txt4 = namaDokter
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "Jasa Medis/Paramedis Penunjang " + namaDokter + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
    
Set Report = New crJasapelayanan

'            strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif, jasapelayanan_t.jeniskomponen, jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
'             " FROM pasien_m INNER JOIN" & _
'            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'            " jasapelayanan_t INNER JOIN" & _
'            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
'            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id  INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=25 and bruto>0 and detailjenisproduk_m.id<>'2016' and pegawai_m.namaexternal='jmp' order by pasien_m.namapasien"
    If idpenjamin = 1 Then
            strSQL = "SELECT * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=25 and bruto>0 and iddetailjenisproduk<>'2016'  and namaexternal='jmp' order by namapasien"
    Else
            strSQL = "SELECT * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=25 and bruto>0 and iddetailjenisproduk<>'2016' and reportdisplay like '%" & reportdisplay & "%' and namaexternal='jmp' order by namapasien"
    End If
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    Reprortbol = True
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayanancovid(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""

Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "Jasa Pelayanan Covid"
txt4 = namaDokter
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "Jasa Pelayanan Covid " + namaDokter + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
    
Set Report = New crJasapelayanan
'        strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif, jasapelayanan_t.jeniskomponen, jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
'             " FROM pasien_m INNER JOIN" & _
'             " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'             " jasapelayanan_t INNER JOIN" & _
'             " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'             " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
'             " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id  where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 and bruto>0 and detailjenisproduk_m.id<>'2016' and produk_m.namaproduk like '%cov%' " & _
'             " order by pasien_m.namapasien"
    If idpenjamin = 1 Then
        strSQL = "SELECT * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=94 and bruto>0 and iddetailjenisproduk<>'2016'  and namaproduk like '%cov%' " & _
             " order by namapasien"
    Else
        strSQL = "SELECT * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=94 and bruto>0 and iddetailjenisproduk<>'2016' and reportdisplay like '%" & reportdisplay & "%' and namaproduk like '%cov%' " & _
             " order by namapasien"
    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    Reprortbol = True
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
            
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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

Public Sub CetakJasapelayananpendaftaran(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, departement As String, view As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekanan As String
If reportdisplay = "" Then
    rekanan = namapenjamin
Else
    rekanan = reportdisplay
End If
judul = "DETAIL JASA MEDIS POLIKLINIK INSTALASI RAWAT JALAN"
waktu = namaDokter
txt3 = "Pasien ( " + rekanan + " ) " + " Tanggal " + tglAwal + " s/d " + tglAkhir
txt4 = "KELOMPOK TARIF PENDAFTARAN - DOKTER/TENAGA AHLI"
Reprortbol = True
Set Report = New crJasapelayanan
'      strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif, jasapelayanan_t.jeniskomponen, jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
'             " FROM pasien_m INNER JOIN" & _
'            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'            " jasapelayanan_t INNER JOIN" & _
'            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
'            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id where detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 and jasapelayanan_t.bruto>0 and departemen_m.namadepartemen like '%" & departement & "%' order by pasien_m.namapasien"
    If idpenjamin = 1 Then
        strSQL = "SELECT * from v_jasapelayanan where iddetailjenisproduk='2016' and tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=94 and bruto>0  and namadepartemen like '%" & departement & "%' and objectbahanprodukfk is null and isberkasrs is null order by namapasien"
    Else
        strSQL = "SELECT * from v_jasapelayanan where iddetailjenisproduk='2016' and tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=94 and bruto>0 and reportdisplay like '%" & reportdisplay & "%' and namadepartemen like '%" & departement & "%' and objectbahanprodukfk is null and isberkasrs is null order by namapasien"
    End If
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayananpendaftarancsr(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, departement As String, view As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekanan As String
If reportdisplay = "" Then
    rekanan = namapenjamin
Else
    rekanan = reportdisplay
End If
judul = "DETAIL JASA MEDIS POLIKLINIK INSTALASI RAWAT JALAN"
waktu = namaDokter
txt3 = "Pasien ( " + rekanan + " ) " + "Berkas Masuk RS -  Tanggal " + tglAwal + " s/d " + tglAkhir
txt4 = "KELOMPOK TARIF PENDAFTARAN - DOKTER/TENAGA AHLI"
strFilter = ""
Reprortbol = True
Set Report = New crJasapelayanan
'      strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif, jasapelayanan_t.jeniskomponen, jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
'             " FROM pasien_m INNER JOIN" & _
'            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'            " jasapelayanan_t INNER JOIN" & _
'            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
'            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id where detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 and jasapelayanan_t.bruto>0 and departemen_m.namadepartemen like '%" & departement & "%' order by pasien_m.namapasien"
    If idpenjamin = 1 Then
        strSQL = "SELECT * from v_jasapelayanan where iddetailjenisproduk='2016' and tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=94 and bruto>0  and namadepartemen like '%" & departement & "%' and objectbahanprodukfk is null and isberkasrs = 1 order by namapasien"
    Else
        strSQL = "SELECT * from v_jasapelayanan where iddetailjenisproduk='2016' and tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=94 and bruto>0 and reportdisplay like '%" & reportdisplay & "%' and namadepartemen like '%" & departement & "%' and objectbahanprodukfk is null and isberkasrs = 1 order by namapasien"
    End If
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayananpendaftaranatensi(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, departement As String, view As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekanan As String
If reportdisplay = "" Then
    rekanan = namapenjamin
Else
    rekanan = reportdisplay
End If
judul = "DETAIL JASA MEDIS POLIKLINIK INSTALASI RAWAT JALAN"
waktu = namaDokter
txt3 = "Pasien ( " + rekanan + " ) " + " Atensi -  Tanggal " + tglAwal + " s/d " + tglAkhir
txt4 = "KELOMPOK TARIF PENDAFTARAN - DOKTER/TENAGA AHLI"
strFilter = ""
Reprortbol = True
Set Report = New crJasapelayanan
'      strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif, jasapelayanan_t.jeniskomponen, jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
'             " FROM pasien_m INNER JOIN" & _
'            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'            " jasapelayanan_t INNER JOIN" & _
'            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
'            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id where detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 and jasapelayanan_t.bruto>0 and departemen_m.namadepartemen like '%" & departement & "%' order by pasien_m.namapasien"
    strSQL = "SELECT * from v_jasapelayanan where iddetailjenisproduk='2016' and tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=94 and bruto>0 and reportdisplay like '%" & reportdisplay & "%' and namadepartemen like '%" & departement & "%' and objectbahanprodukfk is null and isberkasrs = 2 order by namapasien"
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayananpendaftarankonsul(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, departement As String, view As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
'If reportdisplay = "" Then
'    reportdisplay = namapenjamin
'End If
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekanan As String
If reportdisplay = "" Then
    rekanan = namapenjamin
Else
    rekanan = reportdisplay
End If
judul = "DETAIL JASA MEDIS POLIKLINIK INSTALASI RAWAT JALAN"
waktu = namaDokter
txt3 = "Pasien ( " + rekanan + " ) " + "Berkas Masuk RS -  Tanggal " + tglAwal + " s/d " + tglAkhir
txt4 = "KELOMPOK TARIF PELAYANAN - DOKTER/TENAGA AHLI"
strFilter = ""
Reprortbol = True
Set Report = New crJasapelayanan
'      strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif, jasapelayanan_t.jeniskomponen, jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
'             " FROM pasien_m INNER JOIN" & _
'            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'            " jasapelayanan_t INNER JOIN" & _
'            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
'            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id where detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 and jasapelayanan_t.bruto>0 and departemen_m.namadepartemen like '%" & departement & "%' order by pasien_m.namapasien"
    If idpenjamin = 1 Then
        strSQL = "SELECT * from v_jasapelayanan where iddetailjenisproduk='2016' and tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=94 and bruto>0 and namadepartemen like '%" & departement & "%' and objectbahanprodukfk = 1 and isberkasrs=1 order by namapasien"
    Else
        strSQL = "SELECT * from v_jasapelayanan where iddetailjenisproduk='2016' and tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=94 and bruto>0 and reportdisplay like '%" & reportdisplay & "%' and namadepartemen like '%" & departement & "%' and objectbahanprodukfk = 1 and isberkasrs=1 order by namapasien"
    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
            
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayananpendaftarankonsulatensi(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, departement As String, view As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
'If reportdisplay = "" Then
'    reportdisplay = namapenjamin
'End If
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekanan As String
If reportdisplay = "" Then
    rekanan = namapenjamin
Else
    rekanan = reportdisplay
End If
judul = "DETAIL JASA MEDIS POLIKLINIK INSTALASI RAWAT JALAN"
waktu = namaDokter
txt3 = "Pasien ( " + rekanan + " ) " + " Atensi -  Tanggal " + tglAwal + " s/d " + tglAkhir
txt4 = "KELOMPOK TARIF PELAYANAN - DOKTER/TENAGA AHLI"
strFilter = ""
Reprortbol = True
Set Report = New crJasapelayanan
'      strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif, jasapelayanan_t.jeniskomponen, jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
'             " FROM pasien_m INNER JOIN" & _
'            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'            " jasapelayanan_t INNER JOIN" & _
'            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
'            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id where detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 and jasapelayanan_t.bruto>0 and departemen_m.namadepartemen like '%" & departement & "%' order by pasien_m.namapasien"
    
    strSQL = "SELECT * from v_jasapelayanan where iddetailjenisproduk='2016' and tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=94 and bruto>0 and reportdisplay like '%" & reportdisplay & "%' and namadepartemen like '%" & departement & "%' and objectbahanprodukfk = 1 and isberkasrs=2 order by namapasien"
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
            
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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

Public Sub CetakJasapelayananpendaftaranbilling(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, departement As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "DETAIL JASA ADMINISTRASI BILLING"
txt4 = departement
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "DETAIL JASA ADMINISTRASI BILLING DARI " + departement + " ( " + namapenjamin + " ) "
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir + "  KELOMPOK TARIF PENDAFTARAN - ADMINISTRASI"
strFilter = ""
Reprortbol = True
Set Report = New crJasapelayanan
If departement = "Instalasi Gawat Darurat" Then
    If idpenjamin = 1 Then
    strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, 1000 as tarif, jasapelayanan_t.jeniskomponen, 1000 as bruto, 0 as pph, 1000 as netto, " & _
                 "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
                 " FROM pasien_m INNER JOIN" & _
                " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
                " jasapelayanan_t INNER JOIN" & _
                " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
                " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
                " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=100 and jasapelayanan_t.bruto>0 and departemen_m.namadepartemen like '%" & departement & "%'"
    Else
    strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, 1000 as tarif, jasapelayanan_t.jeniskomponen, 1000 as bruto, 0 as pph, 1000 as netto, " & _
                 "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
                 " FROM pasien_m INNER JOIN" & _
                " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
                " jasapelayanan_t INNER JOIN" & _
                " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
                " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
                " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=100 and jasapelayanan_t.bruto>0 and departemen_m.namadepartemen like '%" & departement & "%'"
    
    End If
Else
    If idpenjamin = 1 Then
        strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, case when pasiendaftar_t.objectkelompokpasienlastfk =1 then 1000 else 1500 end as tarif, jasapelayanan_t.jeniskomponen, case when pasiendaftar_t.objectkelompokpasienlastfk =1 then 1000 else 1500 end as bruto, 0 as pph, case when pasiendaftar_t.objectkelompokpasienlastfk =1 then 1000 else 1500 end as netto, " & _
             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
             " FROM pasien_m INNER JOIN" & _
            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
            " jasapelayanan_t INNER JOIN" & _
            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where  detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=100  and jasapelayanan_t.bruto>0 and departemen_m.namadepartemen like '%" & departement & "%'"
    
    Else
        strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, case when pasiendaftar_t.objectkelompokpasienlastfk =1 then 1000 else 1500 end as tarif, jasapelayanan_t.jeniskomponen, case when pasiendaftar_t.objectkelompokpasienlastfk =1 then 1000 else 1500 end as bruto, 0 as pph, case when pasiendaftar_t.objectkelompokpasienlastfk =1 then 1000 else 1500 end as netto, " & _
             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
             " FROM pasien_m INNER JOIN" & _
            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
            " jasapelayanan_t INNER JOIN" & _
            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=100  and jasapelayanan_t.bruto>0 and departemen_m.namadepartemen like '%" & departement & "%'"
    
    End If

End If
'strSQL = "SELECT * form v_jasapelayanan where iddetailjenisproduk='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=99 and jasapelayanan_t.bruto>0 and reportdisplay like '%" & reportdisplay & "%' and namadepartemen like '%" & departement & "%'"
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayananpendaftaranperawat(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, departement As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "DETAIL JASA ADMINISTRASI PERAWAT"
txt4 = departement
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "DETAIL JASA ADMINISTRASI PERAWAT DARI " + departement + " ( " + namapenjamin + " ) "
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir + "  KELOMPOK TARIF PENDAFTARAN - ADMINISTRASI"
strFilter = ""
Reprortbol = True
Set Report = New crJasapelayanan
      If idpenjamin = 1 Then
        strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, 4000 as tarif, jasapelayanan_t.jeniskomponen, 4000 as bruto, 0 as pph, 4000 as netto, " & _
               "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
               " FROM pasien_m INNER JOIN" & _
              " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
              " jasapelayanan_t INNER JOIN" & _
              " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
              " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
              " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where  detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=100 and jasapelayanan_t.bruto>0 and departemen_m.namadepartemen like '%" & departement & "%'"
        Else
        strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, 4000 as tarif, jasapelayanan_t.jeniskomponen, 4000 as bruto, 0 as pph, 4000 as netto, " & _
             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
             " FROM pasien_m INNER JOIN" & _
            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
            " jasapelayanan_t INNER JOIN" & _
            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=100 and jasapelayanan_t.bruto>0 and departemen_m.namadepartemen like '%" & departement & "%'"

        End If
'      strSQL = "SELECT SELECT nocm,namapasien,norec, idpetugas, produkfk, tarif as tarif, jeniskomponen, tarif as bruto, 0 as pph, tarif as netto, " & _
'             "  noregistrasi, ruanganfk, tglpelayanan, tglverif, namaproduk, namaruangan,namadepartemen  from v_jasapelayanan where iddetailjenisproduk='2016' and tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=25 and bruto>0 and namadepartemen like '%" & departement & "%'"
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)

            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayananpendaftaranrm(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, departement As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "DETAIL JASA ADMINISTRASI REKAM MEDIS"
txt4 = departement
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "DETAIL JASA ADMINISTRASI REKAM MEDIS DARI " + departement + " ( " + namapenjamin + " ) "
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir + "  KELOMPOK TARIF PENDAFTARAN - ADMINISTRASI "
strFilter = ""
Reprortbol = True
Set Report = New crJasapelayanan
If departement = "Instalasi Gawat Darurat" Then
    If idpenjamin = 1 Then
    strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, 1000 as  tarif, jasapelayanan_t.jeniskomponen, 1000 as  bruto, 0 as pph, 1000 as netto, " & _
                 "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
                 " FROM pasien_m INNER JOIN" & _
                " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
                " jasapelayanan_t INNER JOIN" & _
                " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
                " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
                " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=100 and jasapelayanan_t.bruto>0  and departemen_m.namadepartemen like '" & departement & "' order by namapasien"
    Else
    strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, 1000 as  tarif, jasapelayanan_t.jeniskomponen, 1000 as  bruto, 0 as pph, 1000 as netto, " & _
                 "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
                 " FROM pasien_m INNER JOIN" & _
                " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
                " jasapelayanan_t INNER JOIN" & _
                " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
                " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
                " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=100 and jasapelayanan_t.bruto>0 and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and departemen_m.namadepartemen like '" & departement & "' order by namapasien"
    
    End If
Else
    If idpenjamin = 1 Then
    strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, case when pasiendaftar_t.objectkelompokpasienlastfk =1 then 1000 else 1500 end as  tarif, jasapelayanan_t.jeniskomponen, case when pasiendaftar_t.objectkelompokpasienlastfk =1 then 1000 else 1500 end as  bruto, 0 as pph, case when pasiendaftar_t.objectkelompokpasienlastfk =1 then 1000 else 1500 end as netto, " & _
                 "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
                 " FROM pasien_m INNER JOIN" & _
                " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
                " jasapelayanan_t INNER JOIN" & _
                " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
                " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
                " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "'  and jasapelayanan_t.jeniskomponen=100 and jasapelayanan_t.bruto>0 and  departemen_m.namadepartemen like '" & departement & "' order by namapasien"
    
    Else
    strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, case when pasiendaftar_t.objectkelompokpasienlastfk =1 then 1000 else 1500 end as  tarif, jasapelayanan_t.jeniskomponen, case when pasiendaftar_t.objectkelompokpasienlastfk =1 then 1000 else 1500 end as  bruto, 0 as pph, case when pasiendaftar_t.objectkelompokpasienlastfk =1 then 1000 else 1500 end as netto, " & _
                 "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
                 " FROM pasien_m INNER JOIN" & _
                " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
                " jasapelayanan_t INNER JOIN" & _
                " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
                " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
                " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "'  and jasapelayanan_t.jeniskomponen=100 and jasapelayanan_t.bruto>0 and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and departemen_m.namadepartemen like '" & departement & "' order by namapasien"
    
    End If
End If
      
'      strSQL = "SELECT SELECT nocm,namapasien,norec, idpetugas, produkfk, tarif as tarif, jeniskomponen, 1000 as bruto, 0 as pph, 1000 as netto, " & _
'             "  noregistrasi, ruanganfk, tglpelayanan, tglverif, namaproduk, namaruangan,namadepartemen  from v_jasapelayanan where iddetailjenisproduk='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=100 and jasapelayanan_t.bruto>0 and departemen_m.namadepartemen like '" & departement & "' "
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)

            
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayananpendaftaranadmision(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, departement As String, namarekan As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If namarekan = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = namarekan
End If
judul = "DETAIL JASA ADMINISTRASI ADMISION"
txt4 = departement
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "DETAIL JASA ADMINISTRASI ADMISION DARI " + " ( " + namapenjamin + " )"
'waktu = " Tanggal " + tglAwal + " s/d " + tglAkhir + "  KELOMPOK TARIF PENDAFTARAN - ADMINSTRASI"
strFilter = ""
Reprortbol = True
Set Report = New crJasapelayanan
If idpenjamin = 1 Then
      strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, 1500 as tarif, jasapelayanan_t.jeniskomponen, 1500 as bruto, 0 AS pph, 1500 as netto, " & _
             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
             " FROM pasien_m INNER JOIN" & _
            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
            " jasapelayanan_t INNER JOIN" & _
            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 and jasapelayanan_t.bruto>0 and departemen_m.namadepartemen like '" & departement & "' order by namapasien"
Else
      strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, 1500 as tarif, jasapelayanan_t.jeniskomponen, 1500 as bruto, 0 AS pph, 1500 as netto, " & _
             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan,departemen_m.namadepartemen " & _
             " FROM pasien_m INNER JOIN" & _
            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
            " jasapelayanan_t INNER JOIN" & _
            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN" & _
            " departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id inner join  detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where rekanan_m.reportdisplay like '%" & namarekan & "%' and detailjenisproduk_m.id='2016' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 and jasapelayanan_t.bruto>0 and departemen_m.namadepartemen like '" & departement & "' order by namapasien"

End If
'          strSQL = "SELECT SELECT nocm,namapasien,norec, idpetugas, produkfk, bruto as tarif, jeniskomponen, 1000 as bruto, 0 as pph, 1000 as netto, " & _
'             "  noregistrasi, ruanganfk, tglpelayanan, tglverif, namaproduk, namaruangan,namadepartemen  from v_jasapelayanan where detailjenisproduk_m.id='2016' and tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and idpetugas like '%" & idDokter & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen=109 and bruto>0 and namadepartemen like '" & departement & "'"

    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayananrekap(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = "Pasien " + rekananjudul
judul = "REKAPITULASI JASA PELAYANAN TINDAKAN DOKTER "

waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
     strSQL = "select top 1 namarekap from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and idpenjamin = '" & idpenjamin & "'"
    ReadRs strSQL
    If rs.EOF = False Then

            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "', and idpenjamin = '" & idpenjamin & "', and rekanan = '" & reportdisplay & "'"

            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and uraian = '" & uraian & "'"

            ReadRs strSQL
    End If
    If idDokter = "25009" Then
        If idpenjamin = 1 Then
        strSQL = "insert into setorjasa_t SELECT '', golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto)-sum(pph) as netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "', '" & reportdisplay & "'" & _
                 " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk  INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id " & _
                 " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and (jasapelayanan_t.jeniskomponen in (94,96,98))  AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%' and (pegawai_m.namalengkap like '%dr%'  ) and pegawai_m.namaexternal<>'dl' and ruangan_m.objectdepartemenfk not in(3,27)" & _
                 " and jasapelayanan_t.bruto>0 and isberkasrs is null " & _
                 " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
                 " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,pegawai_m.namalengkap"
        Else
        strSQL = " insert into setorjasa_t SELECT '',golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto)-sum(pph) as netto,  1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "', '" & reportdisplay & "'" & _
                 " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk  INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id " & _
                 " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and (jasapelayanan_t.jeniskomponen in (94,96,98))  AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%' and (pegawai_m.namalengkap like '%dr%'  ) and pegawai_m.namaexternal<>'dl' and ruangan_m.objectdepartemenfk not in(3,27)" & _
                 " and jasapelayanan_t.bruto>0 and isberkasrs is null " & _
                 " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
                 " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,pegawai_m.namalengkap"
        
        End If
    
    Else
        If idpenjamin = 1 Then
        strSQL = "insert into setorjasa_t SELECT '',  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto)-sum(pph) as netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "', '" & reportdisplay & "'" & _
                 " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk  INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id " & _
                 " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and (jasapelayanan_t.jeniskomponen in (94,96,98))  AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%'  and (pegawai_m.namalengkap like '%dr%'  ) and pegawai_m.namaexternal<>'dl' and ruangan_m.objectdepartemenfk not in(3,27)" & _
                 " and jasapelayanan_t.bruto>0 and isberkasrs is null " & _
                 " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
                 " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,pegawai_m.namalengkap"
        Else
        strSQL = "insert into setorjasa_t SELECT '',   golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto)-sum(pph) as netto,1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "', '" & reportdisplay & "'" & _
                 " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk  INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id " & _
                 " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and (jasapelayanan_t.jeniskomponen in (94,96,98))  AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%'  and (pegawai_m.namalengkap like '%dr%'  ) and pegawai_m.namaexternal<>'dl' and ruangan_m.objectdepartemenfk not in(3,27)" & _
                 " and jasapelayanan_t.bruto>0 and isberkasrs is null " & _
                 " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
                 " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,pegawai_m.namalengkap"
        
        End If

    End If
    ReadRs strSQL

        
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
'            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
'            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
'            .Text2.SetText ("Nama Dokter")
'
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakJasapelayananrekappendaftarancsr(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, namadepartmen As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = "BERDASARKAN TARIF PENDAFTARAN - KELOMPOK DOKTER/ TENAGA AHLI RUMAH SAKIT"
judul = "REKAPITULASI JASA MEDIS PER-PELAKSANA MEDIS INSTALASI RAWAT JALAN"

waktu = rekananjudul + " BERKAS MASUK RS Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
    strSQL = "select top 1 namarekap from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and idpenjamin = '" & idpenjamin & "'"
    ReadRs strSQL
    If rs.EOF = False Then
            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and uraian = '" & uraian & "'"
            ReadRs strSQL
    End If
    strSQL = "insert into setorjasa_t SELECT '',  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) -sum(pph)  as netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk  INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id " & _
             " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where detailjenisproduk_m.id='2016' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and (jasapelayanan_t.jeniskomponen in (94,96,98))   and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%' and (pegawai_m.namalengkap like '%dr%'  ) and pegawai_m.namaexternal<>'dl' and ruangan_m.objectdepartemenfk not in(3,27)" & _
             " and jasapelayanan_t.bruto>0 and jasapelayanan_t.isberkasrs=1 and produk_m.objectbahanprodukfk is null" & _
             " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
             " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,pegawai_m.namalengkap"
             
    ReadRs strSQL
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
'            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
'            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
'            .Text2.SetText ("Nama Dokter")
'
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakJasapelayananrekappendaftaranatensi(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, namadepartemen As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = "BERDASARKAN TARIF PENDAFTARAN - KELOMPOK DOKTER/ TENAGA AHLI RUMAH SAKIT"
judul = "REKAPITULASI JASA MEDIS PER-PELAKSANA MEDIS INSTALASI RAWAT JALAN"

waktu = rekananjudul + " BERKAS ATENSI Tanggal " + tglAwal + " s/d " + tglAkhir

strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
     strSQL = "select top 1 namarekap from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and idpenjamin = '" & idpenjamin & "'"
    ReadRs strSQL
    If rs.EOF = False Then
            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "'"
            ReadRs strSQL
    End If
    strSQL = "insert into setorjasa_t SELECT '',  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) - sum(pph)  as netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk  INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id " & _
             " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where detailjenisproduk_m.id='2016' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and (jasapelayanan_t.jeniskomponen in (94,96,98))   and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%' and (pegawai_m.namalengkap like '%dr%'  ) and pegawai_m.namaexternal<>'dl' and ruangan_m.objectdepartemenfk not in(3,27)" & _
             " and jasapelayanan_t.bruto>0 and jasapelayanan_t.isberkasrs=2 and produk_m.objectbahanprodukfk is null " & _
             " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
             " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,pegawai_m.namalengkap"
             
    ReadRs strSQL
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
'
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
'            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
'            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
'            .Text2.SetText ("Nama Dokter")
'
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub

Public Sub CetakJasapelayananrekaptindakancsr(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, namadepartemen As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = "BERDASARKAN TARIF PELAYANAN DAN TINDAKAN - KELOMPOK DOKTER/ TENAGA AHLI RUMAH SAKIT"
judul = "REKAPITULASI JASA MEDIS PER-PELAKSANA MEDIS INSTALASI RAWAT JALAN"

waktu = rekananjudul + " BERKAS MASUK RS Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
    strSQL = "select top 1 namarekap from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and idpenjamin = '" & idpenjamin & "'"
    ReadRs strSQL
    If rs.EOF = False Then
            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and uraian = '" & uraian & "'"
            ReadRs strSQL
    End If
    strSQL = "insert into setorjasa_t SELECT '',  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) - sum(pph)  as netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk  INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id " & _
             " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where detailjenisproduk_m.id='2016' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and (jasapelayanan_t.jeniskomponen in (94,96,98))   and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%' and (pegawai_m.namalengkap like '%dr%'  ) and pegawai_m.namaexternal<>'dl' and ruangan_m.objectdepartemenfk not in(3,27)" & _
             " and jasapelayanan_t.bruto>0 and jasapelayanan_t.isberkasrs=1 and produk_m.objectbahanprodukfk=1 " & _
             " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
             " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,pegawai_m.namalengkap"
             
    ReadRs strSQL
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
'            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
'            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
'            .Text2.SetText ("Nama Dokter")
'
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakJasapelayananrekaptindakanatensi(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, namadepartmen As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = "BERDASARKAN TARIF PELAYANAN DAN TINDAKAN - KELOMPOK DOKTER/ TENAGA AHLI RUMAH SAKIT"
judul = "REKAPITULASI JASA MEDIS PER-PELAKSANA MEDIS INSTALASI RAWAT JALAN"

waktu = rekananjudul + " BERKAS ATENSI Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
  strSQL = "select top 1 namarekap from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and idpenjamin = '" & idpenjamin & "'"
    ReadRs strSQL
    If rs.EOF = False Then
            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "'"
            ReadRs strSQL
    End If
    
    strSQL = "insert into setorjasa_t SELECT '',  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) - sum(pph)  as netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk  INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id " & _
             " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and (jasapelayanan_t.jeniskomponen in (94,96,98))   and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%' and (pegawai_m.namalengkap like '%dr%'  ) and pegawai_m.namaexternal<>'dl' and ruangan_m.objectdepartemenfk not in(3,27)" & _
             " and jasapelayanan_t.bruto>0 and jasapelayanan_t.isberkasrs=2 and produk_m.objectbahanprodukfk=1 " & _
             " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
             " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,pegawai_m.namalengkap"
    ReadRs strSQL
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
'
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
'            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
'            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
'            .Text2.SetText ("Nama Dokter")
'
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub

Public Sub CetakJasapelayananrekapnonlayanan(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Judul2 = "Pasien " + reportdisplay
judul = "REKAPITULASI JASA PELAYANAN TINDAKAN DOKTER "

waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
  strSQL = "SELECT 'Golongan III (Pajak 5%)' as golonganpajakpegawai,'Resume medis' as namaproduk ,'ROSITA, SKM' as namalengkap,sum(strukpelayanandetail_t.qtyproduk) as jumlah ,sum(harganetto*strukpelayanandetail_t.qtyproduk) as tarif, sum(40000*strukpelayanandetail_t.qtyproduk) as bruto , sum(2000*strukpelayanandetail_t.qtyproduk) as pph , sum(38000*strukpelayanandetail_t.qtyproduk) as netto ,'-' as nocm , '-' as namaruangan,'-' as namadepartemen FROM            strukpelayanandetail_t INNER JOIN " & _
            " strukpelayanan_t ON strukpelayanandetail_t.nostrukfk = strukpelayanan_t.norec WHERE    strukpelayanan_t.tglstruk between '" & tglAwal & "' and '" & tglAkhir & "' and    (strukpelayanandetail_t.objectprodukfk IN ('4052552', '4054491', '4054492', '4056960', '4056961'))"



    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reportrekap
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
            .Text2.SetText ("Nama Dokter")

            .txtJudul.SetText UCase(judul)
            .txtjudul2.SetText UCase(Judul2)
            .txttanggal.SetText UCase(waktu)
            .txttanggal.SetText UCase(waktu)
            
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reportrekap
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

Public Sub CetakJasapelayananrekapdokterluar(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String

Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = " ( " + rekananjudul + " )"
judul = "REKAPITULASI JASA PELAYANAN TINDAKAN DOKTER LUAR "
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
    If idpenjamin = 1 Then
        strSQL = "SELECT  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) - sum(pph)  as netto" & _
                 " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where  " & _
                 " jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%' and pegawai_m.namalengkap like '%dr%' and pegawai_m.namaexternal='dl' " & _
                 " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
                 " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,pegawai_m.namalengkap"
    Else
        strSQL = "SELECT  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) - sum(pph)  as netto" & _
                 " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where rekanan_m.reportdisplay like '%" & reportdisplay & "%' " & _
                 " and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%' and pegawai_m.namalengkap like '%dr%' and pegawai_m.namaexternal='dl' " & _
                 " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
                 " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,pegawai_m.namalengkap"
    
    End If
'    strSQL = "SELECT 'Resume medis' as namaproduk ,strukpelayanan_t.namapasien_klien as namapasien, sum(harganetto*strukpelayanandetail_t.qtyproduk) as tarif, sum(40000*strukpelayanandetail_t.qtyproduk) as bruto , sum(2000*strukpelayanandetail_t.qtyproduk) as pph , sum(38000*strukpelayanandetail_t.qtyproduk) as netto ,strukpelayanandetail_t.tglpelayanan ,'-' as nocm , '-' as namaruangan,'-' as namadepartemen FROM            strukpelayanandetail_t INNER JOIN" & _
'            " strukpelayanan_t ON strukpelayanandetail_t.nostrukfk = strukpelayanan_t.norec WHERE    strukpelayanan_t.tglstruk between '" & tglAwal & "' and '" & tglAkhir & "' and    (strukpelayanandetail_t.objectprodukfk IN ('4052552', '4054491', '4054492', '4056960', '4056961'))" & _
'            " group by strukpelayanan_t.namapasien_klien,strukpelayanandetail_t.tglpelayanan "

    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reportrekap
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
            .Text2.SetText ("Nama Dokter")

            .txtJudul.SetText UCase(judul)
            .txtjudul2.SetText UCase(Judul2)
            .txttanggal.SetText UCase(waktu)
            
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reportrekap
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
Public Sub CetakJasapelayananrekappenunjang(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = " ( " + rekananjudul + " )"
judul = "REKAPITULASI JASA MEDIS PENUNJANG "
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reportbolpenunjang = True
  
Set Reportrekappenunjang = New crJasapelayananrekappenunjang
    strSQL = "select top 1 namarekap from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and idpenjamin = '" & idpenjamin & "'"
    ReadRs strSQL
    If rs.EOF = False Then
            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and uraian = '" & uraian & "'"
            ReadRs strSQL
    End If
    If idpenjamin = 1 Then
        strSQL = "insert into setorjasa_t SELECT '',  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(netto)   as netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
                 " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join  ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id inner join departemen_m on departemen_m.id = ruangan_m.objectdepartemenfk inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id" & _
                 " where  jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%' and pegawai_m.namalengkap like '%dr%' and " & _
                 " ruangan_m.objectdepartemenfk in(3,27)" & _
                 " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai ,ruangan_m.namaruangan" & _
                 " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,ruangan_m.namaruangan,pegawai_m.namalengkap"
    Else
        strSQL = "insert into setorjasa_t SELECT '',  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(netto)   as netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join  ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id inner join departemen_m on departemen_m.id = ruangan_m.objectdepartemenfk inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id" & _
             " where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%' and pegawai_m.namalengkap like '%dr%' and " & _
             " ruangan_m.objectdepartemenfk in(3,27)" & _
             " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai ,ruangan_m.namaruangan" & _
             " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,ruangan_m.namaruangan,pegawai_m.namalengkap"
    End If
    ReadRs strSQL
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekappenunjang
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
'            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
'            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
'            .uninstalasi.SetUnboundFieldSource ("{ado.namaruangan}")
'            .Text2.SetText ("Nama Dokter")
'
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekappenunjang
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub

Public Sub CetakJasapelayananrekapoperatoranastesi(tglAwal As String, tglAkhir As String, iddepartement As String, idRuangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = " ( " + rekananjudul + " )"
judul = "REKAPITULASI PERAWAT OPERATOR & ANESTESI "
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
  strSQL = "select top 1 namarekap from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and idpenjamin = '" & idpenjamin & "'"
    ReadRs strSQL
    If rs.EOF = False Then
            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and uraian = '" & uraian & "'"
            ReadRs strSQL
    End If
'    strSQL = "SELECT  ruangan_m.namaruangan,golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(netto) as netto" & _
'             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join  ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id inner join departemen_m on departemen_m.id = ruangan_m.objectdepartemenfk inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%' and pegawai_m.namalengkap like '%dr%' and " & _
'             " ruangan_m.objectdepartemenfk in(3,25,27)" & _
'             " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai ,ruangan_m.namaruangan" & _
'             " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,ruangan_m.namaruangan,pegawai_m.namalengkap"
    If idpenjamin = 1 Then
        strSQL = "insert into setorjasa_t SELECT '','','27672', 'Perawat Operator' as namalengkap,sum(x.jumlah) as jumlah,sum(x.tarif)as tarif,sum(x.bruto) as bruto,sum(x.pph) as pph,sum(x.netto) as netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "' from( " & _
               "SELECT        pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, pelayananpasiendetail_t.hargasatuan as tarif, jasapelayanan_t.jeniskomponen,case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 else (pelayananpasiendetail_t.hargasatuan * 10 / 100)* (pasiendaftar_t.persenJasaLast/100) end AS bruto, " & _
                 "  case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 else pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast/100)end AS pph,CASE WHEN pasiendaftar_t.persenJasaLast IS NULL THEN (pelayananpasiendetail_t.hargasatuan * 10 / 100) - (pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05) ELSE ((pelayananpasiendetail_t.hargasatuan * 10 / 100) * (pasiendaftar_t.persenJasaLast / 100)) -(pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast / 100))   END AS netto, jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan, pelayananpasiendetail_t.hargasatuan, pelayananpasiendetail_t.jumlah, pasiendaftar_t.persenJasaLast " & _
                 " FROM pasien_m INNER JOIN" & _
                " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
                " jasapelayanan_t INNER JOIN" & _
                " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
                " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id inner join pelayananpasiendetail_t ON jasapelayanan_t.norecppd = pelayananpasiendetail_t.norec LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id inner join departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "'  and jasapelayanan_t.jeniskomponen=96 and ruangan_m.id like '%" & idRuangan & "%' and ruangan_m.objectdepartemenfk like '%" & iddepartement & "%') as x"
        strSQL2 = "insert into setorjasa_t SELECT '','','27673','Perawat Anestesi' as namalengkap,sum(x.jumlah) as jumlah,sum(x.tarif)as tarif,sum(x.bruto) as bruto,sum(x.pph) as pph,sum(x.netto) as netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "' from( " & _
                 "SELECT        pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, pelayananpasiendetail_t.hargasatuan as tarif, jasapelayanan_t.jeniskomponen,case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 else (pelayananpasiendetail_t.hargasatuan * 10 / 100)* (pasiendaftar_t.persenJasaLast/100) end AS bruto, " & _
                 "  case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 else pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast/100)end AS pph,CASE WHEN pasiendaftar_t.persenJasaLast IS NULL THEN (pelayananpasiendetail_t.hargasatuan * 10 / 100) - (pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05) ELSE ((pelayananpasiendetail_t.hargasatuan * 10 / 100) * (pasiendaftar_t.persenJasaLast / 100)) -(pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast / 100))   END AS netto, jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan, pelayananpasiendetail_t.hargasatuan, pelayananpasiendetail_t.jumlah, pasiendaftar_t.persenJasaLast " & _
                 " FROM pasien_m INNER JOIN" & _
                " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
                " jasapelayanan_t INNER JOIN" & _
                " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
                " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id inner join pelayananpasiendetail_t ON jasapelayanan_t.norecppd = pelayananpasiendetail_t.norec LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and  pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=98 and ruangan_m.id like '%" & idRuangan & "%' and ruangan_m.objectdepartemenfk like '%" & iddepartement & "%') as x"
    Else
        strSQL = "insert into setorjasa_t SELECT '','','27672', 'Perawat Operator' as namalengkap,sum(x.jumlah) as jumlah,sum(x.tarif)as tarif,sum(x.bruto) as bruto,sum(x.pph) as pph,sum(x.netto) as netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "' from( " & _
               "SELECT        pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, pelayananpasiendetail_t.hargasatuan as tarif, jasapelayanan_t.jeniskomponen,case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 else (pelayananpasiendetail_t.hargasatuan * 10 / 100)* (pasiendaftar_t.persenJasaLast/100) end AS bruto, " & _
                 "  case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 else pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast/100)end AS pph,CASE WHEN pasiendaftar_t.persenJasaLast IS NULL THEN (pelayananpasiendetail_t.hargasatuan * 10 / 100) - (pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05) ELSE ((pelayananpasiendetail_t.hargasatuan * 10 / 100) * (pasiendaftar_t.persenJasaLast / 100)) -(pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast / 100))   END AS netto, jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan, pelayananpasiendetail_t.hargasatuan, pelayananpasiendetail_t.jumlah, pasiendaftar_t.persenJasaLast " & _
                 " FROM pasien_m INNER JOIN" & _
                " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
                " jasapelayanan_t INNER JOIN" & _
                " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
                " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id inner join pelayananpasiendetail_t ON jasapelayanan_t.norecppd = pelayananpasiendetail_t.norec LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id inner join departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.jeniskomponen=96 and ruangan_m.id like '%" & idRuangan & "%' and ruangan_m.objectdepartemenfk like '%" & iddepartement & "%') as x"
        strSQL2 = "insert into setorjasa_t SELECT '','','27673', 'Perawat Anestesi' as namalengkap,sum(x.jumlah) as jumlah,sum(x.tarif)as tarif,sum(x.bruto) as bruto,sum(x.pph) as pph,sum(x.netto) as netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "' from( " & _
                 "SELECT        pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, pelayananpasiendetail_t.hargasatuan as tarif, jasapelayanan_t.jeniskomponen,case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 else (pelayananpasiendetail_t.hargasatuan * 10 / 100)* (pasiendaftar_t.persenJasaLast/100) end AS bruto, " & _
                 "  case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 else pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast/100)end AS pph,CASE WHEN pasiendaftar_t.persenJasaLast IS NULL THEN (pelayananpasiendetail_t.hargasatuan * 10 / 100) - (pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05) ELSE ((pelayananpasiendetail_t.hargasatuan * 10 / 100) * (pasiendaftar_t.persenJasaLast / 100)) -(pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast / 100))   END AS netto, jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan, pelayananpasiendetail_t.hargasatuan, pelayananpasiendetail_t.jumlah, pasiendaftar_t.persenJasaLast " & _
                 " FROM pasien_m INNER JOIN" & _
                " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
                " jasapelayanan_t INNER JOIN" & _
                " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
                " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id inner join pelayananpasiendetail_t ON jasapelayanan_t.norecppd = pelayananpasiendetail_t.norec LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and  pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=98 and ruangan_m.id like '%" & idRuangan & "%' and ruangan_m.objectdepartemenfk like '%" & iddepartement & "%') as x"
    End If
    
    ReadRs strSQL
    ReadRs strSQL2
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
'            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
'            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
''            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
''            .uninstalasi.SetUnboundFieldSource ("{ado.namaruangan}")
'            .Text2.SetText ("Nama Dokter")
'
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakJasapelayananrekapbankdarah(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, view As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
judul = "REKAPITULASI PELAYANAN BANK DARAH " + " ( " + namapenjamin + " )"
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
  
'    strSQL = "SELECT distinct cast(jasapelayanan_t.jumlah as int) as jumlah, jasapelayanan_t.norecpp,pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif,  jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan" & _
'             " FROM pasien_m INNER JOIN" & _
'            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'            " jasapelayanan_t INNER JOIN" & _
'            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "'"
  
  strSQL = "SELECT  golonganpajakpegawai_m.golonganpajakpegawai,  pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(netto) as netto" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id where  between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.id='41' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' " & _
             " group by  pegawai_m.namalengkap,golonganpajakpegawai_m.golonganpajakpegawai "

'kodebankdarah=41
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reportrekap
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
'            .uninstalasi.SetUnboundFieldSource ("{ado.namaruangan}")
            .Text2.SetText ("Nama Dokter")

            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reportrekap
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
Public Sub CetakJasapelayananrekapparamedis(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = " ( " + rekananjudul + " )"
judul = "REKAPITULASI JASA PARAMEDIS"
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap2 = True
Set Reportrekap2 = New crJasapelayananrekapparamedis
  
'    strSQL = "SELECT  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(netto) as netto" & _
'             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%' and pegawai_m.namalengkap like '%dr%' " & _
'             " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
'             " order by golonganpajakpegawai_m.kodegolonganpajakpegawai"
'    strSQL = "SELECT DISTINCT '' as golonganpajakpegawai, CAST(SUM(jasapelayanan_t.jumlah) AS varchar) AS jumlah, SUM(jasapelayanan_t.tarif * jasapelayanan_t.jumlah) AS tarif, SUM(jasapelayanan_t.pph * jasapelayanan_t.jumlah) AS pph, SUM(jasapelayanan_t.bruto * jasapelayanan_t.jumlah) AS bruto, SUM(jasapelayanan_t.netto * jasapelayanan_t.jumlah)AS netto, ruangan_m.namaruangan" & _
'            " FROM pasien_m INNER JOIN pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN jasapelayanan_t INNER JOIN golonganpajakpegawai_m on golonganpajakpegawai_m.id = jasapelayanan_t.objectpajakfk inner join produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
'            " WHERE rekanan_m.reportdisplay like '%" & reportdisplay & "%' and (produk_m.namaproduk LIKE '%akomodasi%') AND (jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "') AND (pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "') AND (jasapelayanan_t.jeniskomponen = '25')" & _
'            "GROUP BY ruangan_m.namaruangan order by namaruangan"
'    strSQL = ""
    strSQL = "select top 1 namarekap from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and idpenjamin = '" & idpenjamin & "'"
    ReadRs strSQL
    If rs.EOF = False Then
            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and uraian = '" & uraian & "'"
            ReadRs strSQL
    End If
    If idpenjamin = 1 Then
        strSQL = "insert into setorjasa_t SELECT '','' as golonganpajakpegawai,ruanganfk, namaruangan,sum(cast(jumlah as int)), sum(tarif) as tarif,sum(pph) as pph ,sum(bruto) as bruto,sum(netto) as netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "' from v_jasaparamedis" & _
             " WHERE (namaproduk LIKE '%akomodasi%') AND (tglverif between '" & tglAwal & "' and '" & tglAkhir & "') AND (objectkelompokpasienlastfk = '" & idpenjamin & "') " & _
            " group by namaruangan,golonganpajakpegawai,ruanganfk order by namaruangan"
    Else
        strSQL = "insert into setorjasa_t SELECT '', '' as golonganpajakpegawai,ruanganfk, namaruangan,sum(cast(jumlah as int)), sum(tarif) as tarif,sum(pph) as pph ,sum(bruto) as bruto,sum(netto) as netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "' from v_jasaparamedis" & _
             " WHERE reportdisplay like '%" & reportdisplay & "%' and (namaproduk LIKE '%akomodasi%') AND (tglverif between '" & tglAwal & "' and '" & tglAkhir & "') AND (objectkelompokpasienlastfk = '" & idpenjamin & "') " & _
            " group by namaruangan,golonganpajakpegawai,ruanganfk order by namaruangan"

    End If
    
    ReadRs strSQL
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap2
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namaruangan}")
''            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
''            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
'            .Text2.SetText ("Nama Dokter")
'
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap2
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakJasapelayananrekapdokterruang(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = " ( " + rekananjudul + " )"
judul = "REKAPITULASI JASA DOKTER RUANG "
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap2 = True
Set Reportrekap2 = New crJasapelayananrekapparamedis
  

 
       
     If idpenjamin = 1 Then
         strSQL = "insert into setorjasa_t SELECT '','' as golonganpajakpegawai,ruanganfk, namaruangan,sum(cast(jumlah as int)),  sum(tarif) as tarif,sum(pph) as pph,sum(bruto) as bruto,sum(netto) as netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'  from v_jasadokterruang" & _
             " WHERE (namaproduk LIKE '%akomodasi%') AND (tglverif between '" & tglAwal & "' and '" & tglAkhir & "') AND (objectkelompokpasienlastfk = '" & idpenjamin & "') " & _
             " group by namaruangan,golonganpajakpegawai,ruanganfk order by namaruangan"
     
     Else
         strSQL = "insert into setorjasa_t SELECT '','' as golonganpajakpegawai,ruanganfk, namaruangan,sum(cast(jumlah as int)),  sum(tarif) as tarif,sum(pph) as pph,sum(bruto) as bruto,sum(netto) as netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'  from v_jasadokterruang" & _
             " WHERE reportdisplay like '%" & reportdisplay & "%' and (namaproduk LIKE '%akomodasi%') AND (tglverif between '" & tglAwal & "' and '" & tglAkhir & "') AND (objectkelompokpasienlastfk = '" & idpenjamin & "') " & _
             " group by namaruangan,golonganpajakpegawai,ruanganfk order by namaruangan"
     
     End If
     ReadRs strSQL
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
        
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap2
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namaruangan}")
''            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
''            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
'            .Text2.SetText ("Nama Dokter")
'
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap2
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakJasapelayananrekapjasamedis(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String

Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = " ( " + rekananjudul + " )"
judul = "REKAPITULASI JASA MEDIS PER-PELAKSANA  "
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap

     strSQL = "select top 1 namarekap from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and idpenjamin = '" & idpenjamin & "'"
    ReadRs strSQL
    If rs.EOF = False Then
            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and uraian = '" & uraian & "'"
            ReadRs strSQL
    End If
    If idpenjamin = 1 Then
    strSQL = "insert into setorjasa_t SELECT '',  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) - sum(pph)  as netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id" & _
             " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
             " where pegawai_m.namaexternal='jm' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%'  and pegawai_m.namalengkap not like '%dr%' and pegawai_m.namalengkap not like '%jasa%' and pegawai_m.namalengkap not in('Sewa alat') and bruto >0 and pegawai_m.namaexternal='jm'" & _
             " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
             " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,pegawai_m.namalengkap"
    Else
    strSQL = "insert into setorjasa_t SELECT '',  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) - sum(pph)  as netto  , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id" & _
             " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
             " where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and pegawai_m.namaexternal='jm' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%'  and pegawai_m.namalengkap not like '%dr%' and pegawai_m.namalengkap not like '%jasa%' and pegawai_m.namalengkap not in('Sewa alat') and bruto >0 and pegawai_m.namaexternal='jm'" & _
             " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
             " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,pegawai_m.namalengkap"
    
    End If
    ReadRs strSQL

        
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
'            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
'            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
'            .Text2.SetText ("Nama Dokter")
'
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakJasapelayananrekapjasamedisodc(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String

Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = " ( " + rekananjudul + " )"
judul = "REKAPITULASI JASA KEPERAWATAN ODC BEDAH SENTRAL  "
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
   strSQL = "select top 1 namarekap from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and idpenjamin = '" & idpenjamin & "'"
    ReadRs strSQL
    If rs.EOF = False Then
            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "'"
            ReadRs strSQL
    End If
'    strSQL = "SELECT  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) - sum(pph)  as netto" & _
'             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id" & _
'             " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
'             " where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and pegawai_m.namaexternal='jm' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%'  and pegawai_m.namalengkap not like '%dr%' and pegawai_m.namalengkap not like '%jasa%' and pegawai_m.namalengkap not in('Sewa alat') and bruto >0 and pegawai_m.namaexternal='jm'" & _
'             " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai "

    strSQL = "insert into setorjasa_t SELECT '',  ' Golongan III (Pajak 5%)' as golonganpajakpegawai,ruanganfk,namaruangan,count(norec) as jumlah, sum(harganetto) AS hargadipake,sum(harganetto) AS hargadipake, sum(harganetto * 0.05) as pph2 ,sum(harganetto -(harganetto * 0.05)) as netto2, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'  FROM v_odc " & _
            " where tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "' and ruanganfk='277' and idkomponen in (112,25,26,114)  " & _
            " group by namaruangan,ruanganfk"
    
    ReadRs strSQL
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namaruangan}")
'            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.hargadipake}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph2}")
'            .untarif.SetUnboundFieldSource ("{ado.hargadipake}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto2}")
'            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
''            .Text2.SetText ("Nama Dokter")
'
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakJasapelayananrekapjasamedispenunjang(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)

'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = " ( " + rekananjudul + " )"
judul = "REKAPITULASI JASA MEDIS PER-PELAKSANA PENUNJANG  "
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
  
    If idpenjamin = 1 Then
    strSQL = "insert into setorjasa_t SELECT '',  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) - sum(pph)  as netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id" & _
             " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
             " where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=25 AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%' and pegawai_m.namalengkap not like '%dr%' and pegawai_m.namalengkap not like '%jasa%' and pegawai_m.namalengkap not in('Sewa alat') and bruto >0 and pegawai_m.namaexternal='jmp'" & _
             " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
             " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,pegawai_m.namalengkap"
    Else
    strSQL = "insert into setorjasa_t SELECT '',  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) - sum(pph)  as netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id" & _
             " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
             " where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=25 AND (detailjenisproduk_m.id <> '2016') and produk_m.namaproduk not like '%cov%' and produk_m.namaproduk not like '%paket%' and pegawai_m.namalengkap not like '%dr%' and pegawai_m.namalengkap not like '%jasa%' and pegawai_m.namalengkap not in('Sewa alat') and bruto >0 and pegawai_m.namaexternal='jmp'" & _
             " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap ,golonganpajakpegawai_m.golonganpajakpegawai,golonganpajakpegawai_m.kodegolonganpajakpegawai " & _
             " order by golonganpajakpegawai_m.kodegolonganpajakpegawai,pegawai_m.namalengkap"

    End If
    ReadRs strSQL
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
    
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
'            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
'            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
'            .Text2.SetText ("Nama Dokter")
'
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub

Public Sub CetakJasapelayananrekapcovid(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = " ( " + rekananjudul + " )"
judul = "REKAPITULASI JASA COVID "
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
     strSQL = "select top 1 namarekap from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and idpenjamin = '" & idpenjamin & "'"
    ReadRs strSQL
    If rs.EOF = False Then
            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and uraian = '" & uraian & "'"
            ReadRs strSQL
    End If
    If idpenjamin = 1 Then
        strSQL = "insert into setorjasa_t SELECT '',  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) -sum(pph)  as netto   , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
                 " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id " & _
                 " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
                 " where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 and bruto>0 and detailjenisproduk_m.id<>'2016' and produk_m.namaproduk like '%cov%' " & _
                 " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap,golonganpajakpegawai_m.golonganpajakpegawai "
    Else
        strSQL = "insert into setorjasa_t SELECT '',  golonganpajakpegawai_m.golonganpajakpegawai, jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) -sum(pph)  as netto  , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id " & _
             " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
             " where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 and bruto>0 and detailjenisproduk_m.id<>'2016' and produk_m.namaproduk like '%cov%' " & _
             " group by jasapelayanan_t.idpetugas, pegawai_m.namalengkap,golonganpajakpegawai_m.golonganpajakpegawai "
    End If
    ReadRs strSQL
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
    
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
'            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
'            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .Text2.SetText ("Nama Dokter")
'
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakJasapelayananrekappendaftaran(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String

'Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
'Judul2 = namaDokter + " ( " + rekananjudul + " )"
judul = "REKAPITULASI JASA MEDIS PER-PELAKSANA MEDIS  (" + rekananjudul + " )"
Judul2 = "BERDASRAKAN TARIF PENDAFTARAN"
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap


    strSQL = "select top 1 namarekap from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and idpenjamin = '" & idpenjamin & "'"
    ReadRs strSQL
    If rs.EOF = False Then
            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and uraian = '" & uraian & "'"
            ReadRs strSQL
    End If
    If idpenjamin = 1 Then
    strSQL = "insert into setorjasa_t SELECT '',golonganpajakpegawai_m.golonganpajakpegawai,jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(netto)   as netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on pegawai_m.objectpajakpegawai = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id  where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id = '2016') and pegawai_m.namalengkap like '%dr%'  And pegawai_m.namaexternal <> 'dl' and isberkasrs is null " & _
             " group by jasapelayanan_t.idpetugas, golonganpajakpegawai_m.golonganpajakpegawai,pegawai_m.namalengkap order by pegawai_m.namalengkap"
    Else
    strSQL = "insert into setorjasa_t SELECT '',golonganpajakpegawai_m.golonganpajakpegawai,jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(netto)   as netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on pegawai_m.objectpajakpegawai = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id  where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id = '2016') and pegawai_m.namalengkap like '%dr%' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' And pegawai_m.namaexternal <> 'dl' and isberkasrs is null" & _
             " group by jasapelayanan_t.idpetugas, golonganpajakpegawai_m.golonganpajakpegawai,pegawai_m.namalengkap order by pegawai_m.namalengkap"
    End If
    ReadRs strSQL
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
'    With Reportrekap
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
'            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
'            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
'            .Text2.SetText ("Nama Dokter")
'
'            .txtJudul.SetText UCase(judul)
'            .txttanggal.SetText UCase(waktu)
'            .txtjudul2.SetText UCase(Judul2)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakJasapelayananrekappendaftarandokterluar(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = namaDokter + " ( " + rekananjudul + " )"
judul = "REKAPITULASI JASA MEDIS MEDIS LUAR PER-PELAKSANA"
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
    If idpenjamin = 1 Then
        strSQL = "SELECT golonganpajakpegawai_m.golonganpajakpegawai,jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto)  - sum(pph)  as netto" & _
                 " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on pegawai_m.objectpajakpegawai = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id = '2016') and pegawai_m.namalengkap like '%dr%' And pegawai_m.namaexternal = 'dl'" & _
                 " group by jasapelayanan_t.idpetugas, golonganpajakpegawai_m.golonganpajakpegawai,pegawai_m.namalengkap order by pegawai_m.namalengkap"
    Else
        strSQL = "SELECT golonganpajakpegawai_m.golonganpajakpegawai,jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto)  - sum(pph)  as netto" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on pegawai_m.objectpajakpegawai = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id = '2016') and pegawai_m.namalengkap like '%dr%' And pegawai_m.namaexternal = 'dl'" & _
             " group by jasapelayanan_t.idpetugas, golonganpajakpegawai_m.golonganpajakpegawai,pegawai_m.namalengkap order by pegawai_m.namalengkap"

    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reportrekap
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnama.SetUnboundFieldSource ("{ado.namalengkap}")
            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
            .Text2.SetText ("Nama Dokter")

            .txtJudul.SetText UCase(judul)
            .txtjudul2.SetText UCase(Judul2)
            .txttanggal.SetText UCase(waktu)
            
'
'
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reportrekap
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

Public Sub CetakJasapelayananrekappendaftaranmedis(tglAwal As String, tglAkhir As String, idDokter As String, namaDokter As String, idpenjamin As String, namapenjamin As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)

'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "REKAPITULASI JASA MEDIS PER-PELAKSANA MEDIS  (" + rekananjudul + " )"
Judul2 = "BERDASRAKAN TARIF PENDAFTARAN"
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
  Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap

 strSQL = "select top 1 namarekap from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and idpenjamin = '" & idpenjamin & "'"
    ReadRs strSQL
    If rs.EOF = False Then
            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and uraian = '" & uraian & "'"
            ReadRs strSQL
    End If
If idpenjamin = 1 Then

    strSQL = "insert into setorjasa_t SELECT '',golonganpajakpegawai_m.golonganpajakpegawai,jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(netto)   as netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on pegawai_m.objectpajakpegawai = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id = '2016') and pegawai_m.namalengkap not like '%dr%'" & _
             " group by jasapelayanan_t.idpetugas, golonganpajakpegawai_m.golonganpajakpegawai,pegawai_m.namalengkap order by pegawai_m.namalengkap"
Else
    strSQL = "insert into setorjasa_t SELECT '',golonganpajakpegawai_m.golonganpajakpegawai,jasapelayanan_t.idpetugas, pegawai_m.namalengkap,sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(netto)   as netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM produk_m INNER JOIN jasapelayanan_t INNER JOIN pegawai_m ON jasapelayanan_t.idpetugas = pegawai_m.id INNER JOIN golonganpajakpegawai_m on pegawai_m.objectpajakpegawai = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi ON produk_m.id = jasapelayanan_t.produkfk LEFT OUTER JOIN detailjenisproduk_m ON produk_m.objectdetailjenisprodukfk = detailjenisproduk_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and jasapelayanan_t.idpetugas like '%" & idDokter & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=94 AND (detailjenisproduk_m.id = '2016') and pegawai_m.namalengkap not like '%dr%'" & _
             " group by jasapelayanan_t.idpetugas, golonganpajakpegawai_m.golonganpajakpegawai,pegawai_m.namalengkap order by pegawai_m.namalengkap"
End If
ReadRs strSQL
    
Exit Sub
errLoad:
End Sub
Public Sub CetakJasapelayananperawat(tglAwal As String, tglAkhir As String, iddepartment As String, idRuangan As String, namaruangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakJasapelayanan = Nothing
Dim view As String
view = ""
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "JASA KEPERAWATAN"
txt4 = "RUANGAN " + namaruangan
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "REKAPITULASI JASA PERAWAT " + namaruangan + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""

Reprortbol2 = True
Set Report2 = New crJasapelayananperawat
'    If idRuangan = 44 Then
'        strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk,jasapelayanan_t.bruto as tarif, jasapelayanan_t.jeniskomponen, (jasapelayanan_t.bruto * 10 /100) as bruto, (jasapelayanan_t.pph / 10) as pph, (jasapelayanan_t.netto / 10) as netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan" & _
'             " FROM pasien_m INNER JOIN" & _
'            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'            " jasapelayanan_t INNER JOIN" & _
'            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen=96"
'    Else
    If idRuangan = "448" Then
        If idpenjamin = 1 Then
         strSQL = "SELECT * , bruto * (0.05) as pph2, bruto - ( bruto * 0.05) as netto2 FROM  v_jasapelayanan INNER JOIN  ruangan_m ON v_jasapelayanan.ruanganfk = ruangan_m.id INNER JOIN golonganpajakpegawai_m ON ruangan_m.objectpajakpegawai = golonganpajakpegawai_m.id where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and v_jasapelayanan.ruanganfk = '" & idRuangan & "' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen in ('25') and bruto>0  and objectjenispetugaspefk=4 order by namapasien,tglpelayanan"
        Else
         strSQL = "SELECT * , bruto * (0.05) as pph2, bruto - ( bruto * 0.05) as netto2 FROM  v_jasapelayanan INNER JOIN  ruangan_m ON v_jasapelayanan.ruanganfk = ruangan_m.id INNER JOIN golonganpajakpegawai_m ON ruangan_m.objectpajakpegawai = golonganpajakpegawai_m.id where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and v_jasapelayanan.ruanganfk = '" & idRuangan & "' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen in ('25') and bruto>0 and v_jasapelayanan.reportdisplay like '%" & reportdisplay & "%' and objectjenispetugaspefk=4 order by namapasien,tglpelayanan"
        End If
    Else
        If idpenjamin = 1 Then
            strSQL = "SELECT * , bruto * (0.05) as pph2, bruto - ( bruto * 0.05) as netto2 FROM  v_jasapelayanan INNER JOIN  ruangan_m ON v_jasapelayanan.ruanganfk = ruangan_m.id INNER JOIN golonganpajakpegawai_m ON ruangan_m.objectpajakpegawai = golonganpajakpegawai_m.id where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and v_jasapelayanan.ruanganfk = '" & idRuangan & "' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen in ('94','25') and idpetugas in ('27651') and bruto>0 order by namapasien,tglpelayanan" 'kalau ga keluar jasa medis ga keluar ('27651','27653','25250')
        Else
            strSQL = "SELECT * , bruto * (0.05) as pph2, bruto - ( bruto * 0.05) as netto2 FROM  v_jasapelayanan INNER JOIN  ruangan_m ON v_jasapelayanan.ruanganfk = ruangan_m.id INNER JOIN golonganpajakpegawai_m ON ruangan_m.objectpajakpegawai = golonganpajakpegawai_m.id where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and v_jasapelayanan.ruanganfk = '" & idRuangan & "' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen in ('94','25') and idpetugas in ('27651') and bruto>0 and v_jasapelayanan.reportdisplay like '%" & reportdisplay & "%' order by namapasien,tglpelayanan" 'kalau ga keluar jasa medis ga keluar ('27651','27653','25250')
        End If
    End If
    

'    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report2
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph2}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto2}")
             .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            '.undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayananperawatcovid(tglAwal As String, tglAkhir As String, iddepartment As String, idRuangan As String, namaruangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim view As String
view = ""
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "Jasa Tindakan Keperawatan Covid"
txt4 = "Ruangan " + namaruangan
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "Jasa Tindakan Keperawatan Covid " + namaruangan + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""

Reprortbol2 = True
Set Report2 = New crJasapelayananperawat
If iddepartment = "16" Then
    If idpenjamin = 1 Then
        strSQL = "SELECT nocm,namapasien,norec, idpetugas, produkfk, tarif, jeniskomponen, bruto, bruto * 0.05 as pph, bruto - (bruto * 0.05) as netto, " & _
                 " petugasverif , noregistrasi, ruanganfk, tglpelayanan, tglverif, namaproduk, ruanganasal as namaruangan" & _
                 " from v_jasadokterasalruangan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruanganfk like '%" & idRuangan & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen in ('25') and bruto>0 and produkfk in ('4074833')"
    Else
        strSQL = "SELECT nocm,namapasien,norec, idpetugas, produkfk, tarif, jeniskomponen, bruto, bruto * 0.05 as pph, bruto - (bruto * 0.05) as netto, " & _
                 " petugasverif , noregistrasi, ruanganfk, tglpelayanan, tglverif, namaproduk, ruanganasal as namaruangan" & _
                 " from v_jasadokterasalruangan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruanganfk like '%" & idRuangan & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen in ('25')and reportdisplay like '%" & reportdisplay & "%' and bruto>0 and produkfk in ('4074833')"
    
    End If
'ElseIf iddepartment = "18" Then
'    strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif, jasapelayanan_t.jeniskomponen, jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan" & _
'             " FROM pasien_m INNER JOIN" & _
'            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'            " jasapelayanan_t INNER JOIN" & _
'            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.objectdepartemenfk like '%" & iddepartment & "%' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen in ('108','25') and jasapelayanan_t.bruto>0 and produk_m.namaproduk like '%surat%'"
'
Else
    If idpenjamin = 1 Then
        strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif, jasapelayanan_t.jeniskomponen, jasapelayanan_t.bruto, bruto * 0.05 as pph, bruto - (bruto * 0.05) as netto, " & _
                 "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, 'Rikes (Medical Check ' as namaruangan" & _
                 " FROM pasien_m INNER JOIN" & _
                " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
                " jasapelayanan_t INNER JOIN" & _
                " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
                " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id  where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and ruangan_m.id in ('575','322') and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen in ('25') and jasapelayanan_t.bruto>0 and (produk_m.namaproduk like '%cov%' or produk_m.namaproduk like '%rapid%' or produk_m.namaproduk like '%surat%'  ) and produk_m.namaproduk not like '%inap%' order by produk_m.namaproduk,pasien_m.namapasien"
    Else
        strSQL = "SELECT pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif, jasapelayanan_t.jeniskomponen, jasapelayanan_t.bruto, bruto * 0.05 as pph, bruto - (bruto * 0.05) as netto, " & _
                 "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, 'Rikes (Medical Check ' as namaruangan" & _
                 " FROM pasien_m INNER JOIN" & _
                " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
                " jasapelayanan_t INNER JOIN" & _
                " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
                " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id  where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and ruangan_m.id in ('575','322') and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen in ('25') and jasapelayanan_t.bruto>0 and (produk_m.namaproduk like '%cov%' or produk_m.namaproduk like '%rapid%' or produk_m.namaproduk like '%surat%'  ) and produk_m.namaproduk not like '%inap%' order by produk_m.namaproduk,pasien_m.namapasien"
    
    End If
End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report2
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
             .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            '.undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayananperawatanastesi(tglAwal As String, tglAkhir As String, iddepartment As String, idRuangan As String, namaruangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "jasa Medik OK / Perawat anastesi"
'txt4 = namaruangan
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "jasa Medik OK / Perawat anastesi " + namaruangan + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""

Reprortbol2 = True
Set Report2 = New crJasapelayananperawat
    If idpenjamin = 1 Then
        strSQL = "SELECT        pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, pelayananpasiendetail_t.hargasatuan as tarif, jasapelayanan_t.jeniskomponen,case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 else (pelayananpasiendetail_t.hargasatuan * 10 / 100)* (pasiendaftar_t.persenJasaLast/100) end AS bruto, " & _
             "  case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 else pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast/100)end AS pph,CASE WHEN pasiendaftar_t.persenJasaLast IS NULL THEN (pelayananpasiendetail_t.hargasatuan * 10 / 100) - (pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05) ELSE ((pelayananpasiendetail_t.hargasatuan * 10 / 100) * (pasiendaftar_t.persenJasaLast / 100)) -(pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast / 100))   END AS netto, jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan, pelayananpasiendetail_t.hargasatuan, pelayananpasiendetail_t.jumlah, pasiendaftar_t.persenJasaLast " & _
             " FROM pasien_m INNER JOIN" & _
            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
            " jasapelayanan_t INNER JOIN" & _
            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id inner join pelayananpasiendetail_t ON jasapelayanan_t.norecppd = pelayananpasiendetail_t.norec LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "'  and jasapelayanan_t.jeniskomponen=98"
    Else
        strSQL = "SELECT        pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, pelayananpasiendetail_t.hargasatuan as tarif, jasapelayanan_t.jeniskomponen,case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 else (pelayananpasiendetail_t.hargasatuan * 10 / 100)* (pasiendaftar_t.persenJasaLast/100) end AS bruto, " & _
             "  case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 else pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast/100)end AS pph,CASE WHEN pasiendaftar_t.persenJasaLast IS NULL THEN (pelayananpasiendetail_t.hargasatuan * 10 / 100) - (pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05) ELSE ((pelayananpasiendetail_t.hargasatuan * 10 / 100) * (pasiendaftar_t.persenJasaLast / 100)) -(pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast / 100))   END AS netto, jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan, pelayananpasiendetail_t.hargasatuan, pelayananpasiendetail_t.jumlah, pasiendaftar_t.persenJasaLast " & _
             " FROM pasien_m INNER JOIN" & _
            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
            " jasapelayanan_t INNER JOIN" & _
            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id inner join pelayananpasiendetail_t ON jasapelayanan_t.norecppd = pelayananpasiendetail_t.norec LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.jeniskomponen=98"
    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report2
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
             .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            '.undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)

            
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayananperawatoperator(tglAwal As String, tglAkhir As String, iddepartment As String, idRuangan As String, namaruangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "Jasa Medik OK/Perawat OK"
'txt4 = namaDokter
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "Jasa Medik OK/Perawat OK" + namaruangan + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""

Reprortbol2 = True
Set Report2 = New crJasapelayananperawat
    If idpenjamin = 1 Then
        strSQL = "SELECT        pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, pelayananpasiendetail_t.hargasatuan as tarif, jasapelayanan_t.jeniskomponen,case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 else (pelayananpasiendetail_t.hargasatuan * 10 / 100)* (pasiendaftar_t.persenJasaLast/100) end AS bruto, " & _
                 "  case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 else pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast/100)end AS pph,CASE WHEN pasiendaftar_t.persenJasaLast IS NULL THEN (pelayananpasiendetail_t.hargasatuan * 10 / 100) - (pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05) ELSE ((pelayananpasiendetail_t.hargasatuan * 10 / 100) * (pasiendaftar_t.persenJasaLast / 100)) -(pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast / 100))   END AS netto, jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan, pelayananpasiendetail_t.hargasatuan, pelayananpasiendetail_t.jumlah, pasiendaftar_t.persenJasaLast " & _
                 " FROM pasien_m INNER JOIN" & _
                " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
                " jasapelayanan_t INNER JOIN" & _
                " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
                " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id inner join pelayananpasiendetail_t ON jasapelayanan_t.norecppd = pelayananpasiendetail_t.norec LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "'  and jasapelayanan_t.jeniskomponen=96"
    Else
    strSQL = "SELECT        pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.norec, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, pelayananpasiendetail_t.hargasatuan as tarif, jasapelayanan_t.jeniskomponen,case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 else (pelayananpasiendetail_t.hargasatuan * 10 / 100)* (pasiendaftar_t.persenJasaLast/100) end AS bruto, " & _
              "  case when pasiendaftar_t.persenJasaLast is null then pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 else pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast/100)end AS pph,CASE WHEN pasiendaftar_t.persenJasaLast IS NULL THEN (pelayananpasiendetail_t.hargasatuan * 10 / 100) - (pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05) ELSE ((pelayananpasiendetail_t.hargasatuan * 10 / 100) * (pasiendaftar_t.persenJasaLast / 100)) -(pelayananpasiendetail_t.hargasatuan * 10 / 100 * 0.05 * (pasiendaftar_t.persenJasaLast / 100))   END AS netto, jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan, pelayananpasiendetail_t.hargasatuan, pelayananpasiendetail_t.jumlah, pasiendaftar_t.persenJasaLast " & _
              " FROM pasien_m INNER JOIN" & _
             " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
             " jasapelayanan_t INNER JOIN" & _
             " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
             " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id inner join pelayananpasiendetail_t ON jasapelayanan_t.norecppd = pelayananpasiendetail_t.norec LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.jeniskomponen=96"
    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report2
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
             .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            '.undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)

'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayananperawatdarah(tglAwal As String, tglAkhir As String, iddepartment As String, idRuangan As String, namaruangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "Jasa PELAYANAN BANK DARAH"
txt4 = "Ruangan " + namaruangan
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "Jasa Tindakan Keperawatan " + namaruangan + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""

reportboldarah = True
Set Report3 = New crJasapelayanandarah
'    strSQL = "SELECT distinct departemen_m.namadepartemen, cast(jasapelayanan_t.jumlah as int) as jumlah, jasapelayanan_t.norecpp,pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif,  jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, " & _
'             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan" & _
'             " FROM pasien_m INNER JOIN" & _
'            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
'            " jasapelayanan_t INNER JOIN" & _
'            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id  left join rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id left join departemen_m ON ruangan_m.objectdepartemenfk = departemen_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and rekanan_m.reportdisplay like '%" & reportdisplay & "%'"
'   strSQL = "SELECT * from v_jasapelayanan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and namaruangan like '%" & namaruangan & "%' and objectkelompokpasienlastfk like '%" & idpenjamin & "%' and reportdisplay like '%" & reportdisplay & "%'"
    If idpenjamin = 1 Then
    strSQL = "SELECT DISTINCT departemen_m.namadepartemen, CAST(jasapelayanan_t.jumlah AS int) AS jumlah, jasapelayanan_t.norecpp, pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk," & _
                         " jasapelayanan_t.tarif, jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif," & _
                         " produk_m.namaproduk , ruangan_m.namaruangan FROM pasien_m INNER JOIN pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN jasapelayanan_t INNER JOIN " & _
                         " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN " & _
                         " antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN" & _
                         " ruangan_m AS ruangan_m_1 ON antrianpasiendiperiksa_t.objectruanganasalfk = ruangan_m_1.id INNER JOIN" & _
                         " departemen_m ON ruangan_m_1.objectdepartemenfk = departemen_m.id LEFT OUTER JOIN" & _
                         " rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id" & _
                         " where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and antrianpasiendiperiksa_t.objectruanganfk='41' order by namapasien"
    Else
        strSQL = "SELECT DISTINCT departemen_m.namadepartemen, CAST(jasapelayanan_t.jumlah AS int) AS jumlah, jasapelayanan_t.norecpp, pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk," & _
                         " jasapelayanan_t.tarif, jasapelayanan_t.bruto, jasapelayanan_t.pph, jasapelayanan_t.netto, jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, jasapelayanan_t.tglpelayanan, jasapelayanan_t.tglverif," & _
                         " produk_m.namaproduk , ruangan_m.namaruangan FROM pasien_m INNER JOIN pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN jasapelayanan_t INNER JOIN " & _
                         " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id INNER JOIN " & _
                         " antrianpasiendiperiksa_t ON pasiendaftar_t.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN" & _
                         " ruangan_m AS ruangan_m_1 ON antrianpasiendiperiksa_t.objectruanganasalfk = ruangan_m_1.id INNER JOIN" & _
                         " departemen_m ON ruangan_m_1.objectdepartemenfk = departemen_m.id LEFT OUTER JOIN" & _
                         " rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id" & _
                         " where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and antrianpasiendiperiksa_t.objectruanganfk='41' order by namapasien"

    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report3
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
             .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .unQty.SetUnboundFieldSource ("{ado.jumlah}")
            .undepartemen.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
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
Public Sub CetakJasapelayananrawatmondok(tglAwal As String, tglAkhir As String, iddepartment As String, idRuangan As String, namaruangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim strPrinter As String




strFilter = ""
If namapenjamin Like "*BPJS*" Or namapenjamin Like "*Umum*" Then
    judul = "HASIL PENERIMAAN RAWAT MONDOK " + namaruangan + " ( " + reportdisplay + " )"
    waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
    Reportbolmondok = True
Set Reportmondok = New crJasapelayananrawatmondok
    If idpenjamin = 1 Then
        strSQL = "select namapasien,sum(total) as total,namaruangan,noregistrasi from v_tindakan" & _
                " where tglclosing between '" & tglAwal & "' and '" & tglAkhir & "' and objectkelompokpasienlastfk = '" & idpenjamin & "' and  objectdepartemenfk='16' and noregistrasi in (select noregistrasi from jasapelayanan_t where tglverif  between '" & tglAwal & "' and '" & tglAkhir & "')  group by namapasien,namaruangan,noregistrasi "
    Else
        strSQL = "select namapasien,sum(total) as total,namaruangan,noregistrasi from v_tindakan" & _
                " where tglclosing between '" & tglAwal & "' and '" & tglAkhir & "' and objectkelompokpasienlastfk = '" & idpenjamin & "' and reportdisplay like '%" & reportdisplay & "%' and objectdepartemenfk='16' and noregistrasi in (select noregistrasi from jasapelayanan_t where tglverif  between '" & tglAwal & "' and '" & tglAkhir & "')  group by namapasien,namaruangan,noregistrasi "
    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reportmondok
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .unjumlah.SetUnboundFieldSource ("{ado.total}")
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
'                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reportmondok
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        'End If
    End With
Else
    judul = "HASIL PENERIMAAN RAWAT MONDOK " + namaruangan + " ( " + namapenjamin + " )"
    waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
    Reportbolmondokpenjamin = True
Set Reportmondok2 = New crJasapelayananrawatmondokpenjamin
    strSQL = "select namapasien,sum(total) as total,namaruangan,noregistrasi,tanggalnk from v_tindakan" & _
            " where tglclosing between '" & tglAwal & "' and '" & tglAkhir & "' and objectkelompokpasienlastfk = '" & idpenjamin & "' and reportdisplay like '%" & reportdisplay & "%' and objectdepartemenfk='16' and noregistrasi in (select noregistrasi from jasapelayanan_t where tglverif  between '" & tglAwal & "' and '" & tglAkhir & "')  group by namapasien,namaruangan,noregistrasi,tanggalnk "
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reportmondok2
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .unjumlah.SetUnboundFieldSource ("{ado.total}")
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .untanggalnk.SetUnboundFieldSource ("{ado.tanggalnk}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reportmondok2
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        'End If
    End With
End If

Exit Sub
errLoad:
End Sub
Public Sub Cetakpenagihanpenjamin(tglAwal As String, tglAkhir As String, iddepartment As String, idRuangan As String, namaruangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim strPrinter As String




strFilter = ""
'If namapenjamin Like "*BPJS*" Or namapenjamin Like "*Umum*" Then
    judul = "HASIL PENERIMAAN PEMERIKSAAN " + namaruangan + "  " + reportdisplay + " "
    waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
    reportboltagihan = True
    Set Reporttagihan = New crPenagihanpenjamin
    If idpenjamin = 1 Then
    strSQL = "select * from v_pelayananpetugas" & _
            " where tglclosing between '" & tglAwal & "' and '" & tglAkhir & "' and objectkelompokpasienlastfk = '" & idpenjamin & "'  and objectdepartemenfk like '%" & iddepartment & "%' order by namapasien "
    Else
    strSQL = "select * from v_pelayananpetugas" & _
            " where tglclosing between '" & tglAwal & "' and '" & tglAkhir & "' and objectkelompokpasienlastfk = '" & idpenjamin & "' and reportdisplay like '%" & reportdisplay & "%' and objectdepartemenfk like '%" & iddepartment & "%' order by namapasien "
 
    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reporttagihan
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unjumlah.SetUnboundFieldSource ("{ado.total}")
            .unnamadokter.SetUnboundFieldSource ("{ado.dokter}")
            .unnamapasien.SetUnboundFieldSource ("{ado.namapasien}")
            .untgltindakan.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .untglnk.SetUnboundFieldSource ("{ado.tanggalnk}")
            .untindakan.SetUnboundFieldSource ("{ado.namaproduk}")
            .unnamarekenan.SetUnboundFieldSource ("{ado.namarekanan}")
            .unnamaruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            If view = "false" Then
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reporttagihan
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
Public Sub CetakJasapelayananperawatadministrasi(tglAwal As String, tglAkhir As String, iddepartment As String, idRuangan As String, namaruangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
    ReadRs "select namadepartemen from departemen_m where id like '%" & iddepartment & "%' "

judul = "JASA ADMINISTRASI " + rs("namadepartemen")
'txt4 = namaruangan
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "ADMINISTRASI " + namaruangan + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""

Reportboladmin = True
Set Reportadministrasi = New crJasapelayananadministrasi
    If idpenjamin = 1 Then
    strSQL = "SELECT distinct pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif,   " & _
             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, cast(jasapelayanan_t.tglpelayanan as date) as tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan" & _
             " FROM pasien_m INNER JOIN" & _
            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
            " jasapelayanan_t INNER JOIN" & _
            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where (produk_m.namaproduk like '%administrasi rawat inap%') AND jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%'  and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' order by namapasien"
    
    Else
    strSQL = "SELECT distinct pasien_m.nocm,pasien_m.namapasien,jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, jasapelayanan_t.tarif,   " & _
             "  jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk, cast(jasapelayanan_t.tglpelayanan as date) as tglpelayanan, jasapelayanan_t.tglverif, produk_m.namaproduk, ruangan_m.namaruangan" & _
             " FROM pasien_m INNER JOIN" & _
            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
            " jasapelayanan_t INNER JOIN" & _
            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where (produk_m.namaproduk like '%administrasi rawat inap%') AND jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' order by namapasien"
    
    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reportadministrasi
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
             .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            '.undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reportadministrasi
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
Public Sub CetakJasapelayananperawatakomodasi(tglAwal As String, tglAkhir As String, iddepartment As String, idRuangan As String, namaruangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "Jasa Paramedis"
txt4 = namaruangan
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "Jasa Paramedis " + namaruangan + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""

Reportbolakomodasi = True
Set Reportakomodasi = New crJasapelayananakomodasi
'     strSQL = "SELECT DISTINCT  cast(sum(jasapelayanan_t.jumlah) as varchar) as jumlah, pasiendaftar_t.tglpulang, pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, " & _
'              " sum(jasapelayanan_t.tarif * jasapelayanan_t.jumlah) as tarif,SUM(jasapelayanan_t.pph * jasapelayanan_t.jumlah) AS pph,SUM(jasapelayanan_t.bruto * jasapelayanan_t.jumlah) AS bruto, SUM(jasapelayanan_t.netto * jasapelayanan_t.jumlah) AS netto,  " & _
'              "  jasapelayanan_t.Noregistrasi , jasapelayanan_t.ruanganfk, produk_m.namaproduk, ruangan_m.namaruangan " & _
'              " FROM            pasien_m INNER JOIN pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN jasapelayanan_t INNER JOIN " & _
'              " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'              " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where produk_m.namaproduk like '%akomodasi%' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen='25'" & _
'              " group by  pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, " & _
'              " jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk,  produk_m.namaproduk, ruangan_m.namaruangan,pasiendaftar_t.tglpulang"
    If idpenjamin = 1 Then
    strSQL = "SELECT  jumlah,tglpulang,nocm,namapasien,idpetugas,produkfk,tarif,pph,bruto,netto,namaruangan,namaproduk  from v_jasaparamedis" & _
             " where namaproduk like '%akomodasi%'  and tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and namaruangan like '%" & namaruangan & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' "
    Else
    strSQL = "SELECT  jumlah,tglpulang,nocm,namapasien,idpetugas,produkfk,tarif,pph,bruto,netto,namaruangan,namaproduk  from v_jasaparamedis" & _
             " where namaproduk like '%akomodasi%' and reportdisplay like '%" & reportdisplay & "%' and tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and namaruangan like '%" & namaruangan & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' "
    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reportakomodasi
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
             .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpulang}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
             .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
            '.undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reportakomodasi
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
Public Sub CetakJasapelayanantindakanperawatacovid(tglAwal As String, tglAkhir As String, iddepartment As String, idRuangan As String, namaruangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = " ( " + rekananjudul + " )"
judul = "REKAPITULASI JASA KEPERAWATAN COVID "
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""

Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
If iddepartment = "16" Then
    If idpenjamin = 1 Then
        strSQL = "insert into setorjasa_t SELECT distinct  '','',ruanganfk,  namaruangan, cast(sum(jasapelayanan_t.jumlah) as varchar) as jumlah,    sum(jasapelayanan_t.tarif * jasapelayanan_t.jumlah) as tarif,SUM(jasapelayanan_t.pph * jasapelayanan_t.jumlah) AS pph,SUM(jasapelayanan_t.bruto * jasapelayanan_t.jumlah) AS bruto, SUM(jasapelayanan_t.netto * jasapelayanan_t.jumlah) AS netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "' from( " & _
                 "SELECT nocm,namapasien,norec,jumlah, idpetugas, produkfk, tarif, jeniskomponen, bruto, bruto * 0.05 as pph, bruto - (bruto * 0.05) as netto, " & _
                 " petugasverif , noregistrasi, ruanganfk, tglpelayanan, tglverif, namaproduk, ruanganasal as namaruangan" & _
                 " from v_jasadokterasalruangan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruanganfk like '%" & idRuangan & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen in ('25') and bruto>0 and produkfk='4074833' " & _
                 " ) as jasapelayanan_t group by produkfk,ruanganfk,namaproduk,namaruangan order by namaruangan"
    Else
        strSQL = "insert into setorjasa_t SELECT distinct  '','',ruanganfk,  namaruangan,  cast(sum(jasapelayanan_t.jumlah) as varchar) as jumlah,    sum(jasapelayanan_t.tarif * jasapelayanan_t.jumlah) as tarif,SUM(jasapelayanan_t.pph * jasapelayanan_t.jumlah) AS pph,SUM(jasapelayanan_t.bruto * jasapelayanan_t.jumlah) AS bruto, SUM(jasapelayanan_t.netto * jasapelayanan_t.jumlah) AS netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "' from( " & _
                 "SELECT nocm,namapasien,norec,jumlah, idpetugas, produkfk, tarif, jeniskomponen, bruto, bruto * 0.05 as pph, bruto - (bruto * 0.05) as netto, " & _
                 " petugasverif , noregistrasi, ruanganfk, tglpelayanan, tglverif, namaproduk, ruanganasal as namaruangan" & _
                 " from v_jasadokterasalruangan where tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruanganfk like '%" & idRuangan & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' and jeniskomponen in ('25') and bruto>0 and produkfk='4074833' and reportdisplay like '%" & reportdisplay & "%' " & _
                 " ) as jasapelayanan_t group by produkfk,ruanganfk,namaproduk,namaruangan order by namaruangan"
    
    End If
Else
'bruto * 0.05 as pph, bruto - (bruto * 0.05) as netto,
    If idpenjamin = 1 Then
    strSQL = "insert into setorjasa_t SELECT distinct  '','',322,  'Rikes (Medical Check Up)', sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(bruto * 0.05) as pph,sum(bruto - (bruto * 0.05)) as netto, 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'  " & _
             " FROM pasien_m INNER JOIN" & _
            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
            " jasapelayanan_t INNER JOIN" & _
            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.id in ('575','322') and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen in ('25') and jasapelayanan_t.bruto>0 and (produk_m.namaproduk like '%cov%' or produk_m.namaproduk like '%rapid%' or produk_m.namaproduk like '%surat%' ) and produk_m.namaproduk not like '%inap%'"
    Else
    strSQL = "insert into setorjasa_t SELECT distinct  '','',322,  'Rikes (Medical Check Up)', sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(bruto * 0.05) as pph,sum(bruto - (bruto * 0.05)) as netto  , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " FROM pasien_m INNER JOIN" & _
            " pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN" & _
            " jasapelayanan_t INNER JOIN" & _
            " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
            " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.id in ('575','322') and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen in ('25') and jasapelayanan_t.bruto>0 and (produk_m.namaproduk like '%cov%' or produk_m.namaproduk like '%rapid%' or produk_m.namaproduk like '%surat%' ) and produk_m.namaproduk not like '%inap%'"
    
    End If
End If
    
ReadRs strSQL
MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namaruangan}")
''            .unJumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
'            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
''            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakJasapelayananperawatakomodasidokpol(tglAwal As String, tglAkhir As String, iddepartment As String, idRuangan As String, namaruangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "Jasa Paramedis Dokpol"
txt4 = namaruangan
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "Jasa Paramedis Dokpol " + namaruangan + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""

Reportbolakomodasi = True
Set Reportakomodasi = New crJasapelayananakomodasi
'If idRuangan = "745" Then
'     strSQL = "SELECT DISTINCT  cast(sum(jasapelayanan_t.jumlah) as varchar) as jumlah, pasiendaftar_t.tglpulang, pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, " & _
'              " sum(jasapelayanan_t.tarif * jasapelayanan_t.jumlah) as tarif,SUM(jasapelayanan_t.pph * jasapelayanan_t.jumlah) AS pph,SUM(jasapelayanan_t.bruto * jasapelayanan_t.jumlah) AS bruto, SUM(jasapelayanan_t.netto * jasapelayanan_t.jumlah) AS netto,  " & _
'              "  jasapelayanan_t.Noregistrasi , jasapelayanan_t.ruanganfk, produk_m.namaproduk, ruangan_m.namaruangan " & _
'              " FROM            pasien_m INNER JOIN pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN jasapelayanan_t INNER JOIN " & _
'              " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'              " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id inner join rekanan_m on rekanan_m.id = pasiendaftar_t.objectrekananfk where reportdisplay like '%tahanan%' and produk_m.namaproduk like '%akomodasi%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen='25'" & _
'              " group by  pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, " & _
'              " jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk,  produk_m.namaproduk, ruangan_m.namaruangan,pasiendaftar_t.tglpulang"
'Else
    If idpenjamin = 1 Then
     strSQL = "SELECT DISTINCT  cast(sum(jasapelayanan_t.jumlah) as varchar) as jumlah, pasiendaftar_t.tglpulang, pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, " & _
              " sum(jasapelayanan_t.tarif * jasapelayanan_t.jumlah) as tarif,SUM(jasapelayanan_t.pph * jasapelayanan_t.jumlah) AS pph,SUM(jasapelayanan_t.bruto * jasapelayanan_t.jumlah) AS bruto, SUM(jasapelayanan_t.netto * jasapelayanan_t.jumlah) AS netto,  " & _
              "  jasapelayanan_t.Noregistrasi , jasapelayanan_t.ruanganfk, produk_m.namaproduk, ruangan_m.namaruangan " & _
              " FROM            pasien_m INNER JOIN pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN jasapelayanan_t INNER JOIN " & _
              " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
              " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where produk_m.namaproduk like '%akomodasi%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen='25'" & _
              " group by  pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, " & _
              " jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk,  produk_m.namaproduk, ruangan_m.namaruangan,pasiendaftar_t.tglpulang"
    Else
     strSQL = "SELECT DISTINCT  cast(sum(jasapelayanan_t.jumlah) as varchar) as jumlah, pasiendaftar_t.tglpulang, pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, " & _
              " sum(jasapelayanan_t.tarif * jasapelayanan_t.jumlah) as tarif,SUM(jasapelayanan_t.pph * jasapelayanan_t.jumlah) AS pph,SUM(jasapelayanan_t.bruto * jasapelayanan_t.jumlah) AS bruto, SUM(jasapelayanan_t.netto * jasapelayanan_t.jumlah) AS netto,  " & _
              "  jasapelayanan_t.Noregistrasi , jasapelayanan_t.ruanganfk, produk_m.namaproduk, ruangan_m.namaruangan " & _
              " FROM            pasien_m INNER JOIN pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN jasapelayanan_t INNER JOIN " & _
              " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
              " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and produk_m.namaproduk like '%akomodasi%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and jasapelayanan_t.jeniskomponen='25'" & _
              " group by  pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, " & _
              " jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk,  produk_m.namaproduk, ruangan_m.namaruangan,pasiendaftar_t.tglpulang"
    
    
    End If
'End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reportakomodasi
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
             .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpulang}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
             .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
            '.undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)
'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reportakomodasi
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
Public Sub CetakJasapelayananperawatakomodasidokterruang(tglAwal As String, tglAkhir As String, iddepartment As String, idRuangan As String, namaruangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String)
'Public Sub CetakJasapelayanan(tglawal As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view  As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim txt3 As String
Dim txt4 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
judul = "Jasa Dokter Ruang"
txt4 = namaruangan
waktu = "Pasien ( " + rekananjudul + " ) "
txt3 = " Tanggal " + tglAwal + " s/d " + tglAkhir

'Judul = "Jasa Dokter Ruang " + namaruangan + " ( " + namapenjamin + " )"
'waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""

Reportbolakomodasi = True
Set Reportakomodasi = New crJasapelayananakomodasi
'     strSQL = "SELECT DISTINCT  cast(sum(jasapelayanan_t.jumlah) as varchar) as jumlah, pasiendaftar_t.tglpulang, pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, " & _
'              " sum(jasapelayanan_t.tarif * jasapelayanan_t.jumlah) as tarif,SUM(jasapelayanan_t.pph * jasapelayanan_t.jumlah) AS pph,SUM(jasapelayanan_t.bruto * jasapelayanan_t.jumlah) AS bruto, SUM(jasapelayanan_t.netto * jasapelayanan_t.jumlah) AS netto,  " & _
'              "  jasapelayanan_t.Noregistrasi , jasapelayanan_t.ruanganfk, produk_m.namaproduk, ruangan_m.namaruangan " & _
'              " FROM            pasien_m INNER JOIN pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN jasapelayanan_t INNER JOIN " & _
'              " produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN" & _
'              " ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = dbo.rekanan_m.id where pasien_m.namapasien not like  '%SALSABILLA A%' and produk_m.namaproduk like '%akomodasi%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.jeniskomponen='101'" & _
'              " group by  pasien_m.nocm, pasien_m.namapasien, jasapelayanan_t.idpetugas, jasapelayanan_t.produkfk, " & _
'              " jasapelayanan_t.noregistrasi, jasapelayanan_t.ruanganfk,  produk_m.namaproduk, ruangan_m.namaruangan,pasiendaftar_t.tglpulang"
    If idpenjamin = 1 Then
    strSQL = "SELECT  jumlah,tglpulang,nocm,namapasien,idpetugas,produkfk,tarif,pph,bruto,netto,namaruangan,namaproduk  from v_jasadokterruang" & _
                 " where namaproduk like '%akomodasi%' and tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and namaruangan like '%" & namaruangan & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' "
    Else
    strSQL = "SELECT  jumlah,tglpulang,nocm,namapasien,idpetugas,produkfk,tarif,pph,bruto,netto,namaruangan,namaproduk  from v_jasadokterruang" & _
             " where namaproduk like '%akomodasi%' and reportdisplay like '%" & reportdisplay & "%' and tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and namaruangan like '%" & namaruangan & "%' and objectkelompokpasienlastfk = '" & idpenjamin & "' "
    
    End If
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reportakomodasi
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
             .unnamapelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .untanggal.SetUnboundFieldSource ("{ado.tglpulang}")
            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
            .unpph21.SetUnboundFieldSource ("{ado.pph}")
            .untarif.SetUnboundFieldSource ("{ado.tarif}")
            .unnetto.SetUnboundFieldSource ("{ado.netto}")
             .unnocm.SetUnboundFieldSource ("{ado.nocm}")
            .unnama.SetUnboundFieldSource ("{ado.namapasien}")
            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
            '.undepartment.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            .unruangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .txtJudul.SetText UCase(judul)
            .txttanggal.SetText UCase(waktu)
            .txt3.SetText UCase(txt3)
            .txt4.SetText UCase(txt4)

'
'            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'
'            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reportakomodasi
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
Public Sub CetakJasapelayananperawatrekap(tglAwal As String, tglAkhir As String, iddepartment As String, idRuangan As String, namaruangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'On Error GoTo errLoad
'On Error Resume Next
Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = " ( " + rekananjudul + " )"
    ReadRs "select * from departemen_m where id like '%" & iddepartment & "%' "
judul = "REKAPITULASI JASA TINDAKAN KEPERAWATAN "
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
    If iddepartment = 18 Then
        If idpenjamin = 1 Then
        strSQL = "insert into setorjasa_t SELECT distinct '', ' Golongan III (Pajak 5%)' as golonganpajakpegawai,ruangan_m.id,ruangan_m.namaruangan, sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(bruto * 0.05) as pph,SUM(jasapelayanan_t.bruto) - SUM(bruto * 0.05) AS netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
                 " FROM jasapelayanan_t INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id " & _
                 " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
                 " where ruangan_m.id<>'448'  and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.objectdepartemenfk like '%" & iddepartment & "%' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and  jasapelayanan_t.jeniskomponen in ('25') and jasapelayanan_t.idpetugas in ('27651') and jasapelayanan_t.bruto>0 " & _
                 " GROUP BY ruangan_m.namaruangan ,ruangan_m.id"
        strSQL2 = " insert into setorjasa_t SELECT distinct '', ' Golongan III (Pajak 5%)' as golonganpajakpegawai,ruangan_m.id,ruangan_m.namaruangan, sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(bruto * 0.05) as pph,SUM(jasapelayanan_t.bruto) - SUM(bruto * 0.05) AS netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
                 " FROM jasapelayanan_t INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id " & _
                 " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
                 " where ruangan_m.id='448' and jasapelayanan_t.objectjenispetugaspefk=4 and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.objectdepartemenfk like '%" & iddepartment & "%' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and  jasapelayanan_t.jeniskomponen in ('25')  and jasapelayanan_t.bruto>0 " & _
                 " GROUP BY ruangan_m.namaruangan ,ruangan_m.id"
        Else
        strSQL = "insert into setorjasa_t SELECT distinct '', ' Golongan III (Pajak 5%)' as golonganpajakpegawai,ruangan_m.id,ruangan_m.namaruangan, sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(bruto * 0.05) as pph,SUM(jasapelayanan_t.bruto) - SUM(bruto * 0.05) AS netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
                 " FROM jasapelayanan_t INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id " & _
                 " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
                 " where ruangan_m.id<>'448' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.objectdepartemenfk like '%" & iddepartment & "%' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and  jasapelayanan_t.jeniskomponen in ('25') and jasapelayanan_t.idpetugas in ('27651') and jasapelayanan_t.bruto>0 " & _
                 " GROUP BY ruangan_m.namaruangan ,ruangan_m.id"
        strSQL2 = " insert into setorjasa_t SELECT distinct '', ' Golongan III (Pajak 5%)' as golonganpajakpegawai,ruangan_m.id,ruangan_m.namaruangan, sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(bruto * 0.05) as pph,SUM(jasapelayanan_t.bruto) - SUM(bruto * 0.05) AS netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
                 " FROM jasapelayanan_t INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id " & _
                 " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
                 " where ruangan_m.id='448' and jasapelayanan_t.objectjenispetugaspefk=4 and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.objectdepartemenfk like '%" & iddepartment & "%' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and  jasapelayanan_t.jeniskomponen in ('25')  and jasapelayanan_t.bruto>0 " & _
                 " GROUP BY ruangan_m.namaruangan ,ruangan_m.id"
        End If
    Else
        If idpenjamin = 1 Then
        strSQL = "insert into setorjasa_t SELECT distinct '', ' Golongan III (Pajak 5%)' as golonganpajakpegawai,ruangan_m.id,ruangan_m.namaruangan, sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(bruto * 0.05) as pph,SUM(jasapelayanan_t.bruto) - SUM(bruto * 0.05) AS netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
                 " FROM jasapelayanan_t INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id " & _
                 " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
                 " where ruangan_m.id<>'448'  and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.objectdepartemenfk like '%" & iddepartment & "%' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and  jasapelayanan_t.jeniskomponen in ('94','25') and jasapelayanan_t.idpetugas in ('27651') and jasapelayanan_t.bruto>0 " & _
                 " GROUP BY ruangan_m.namaruangan ,ruangan_m.id"
        strSQL2 = " insert into setorjasa_t SELECT distinct '', ' Golongan III (Pajak 5%)' as golonganpajakpegawai,ruangan_m.id,ruangan_m.namaruangan, sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(bruto * 0.05) as pph,SUM(jasapelayanan_t.bruto) - SUM(bruto * 0.05) AS netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
                 " FROM jasapelayanan_t INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id " & _
                 " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
                 " where ruangan_m.id='448' and jasapelayanan_t.objectjenispetugaspefk=4 and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.objectdepartemenfk like '%" & iddepartment & "%' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and  jasapelayanan_t.jeniskomponen in ('25')  and jasapelayanan_t.bruto>0 " & _
                 " GROUP BY ruangan_m.namaruangan ,ruangan_m.id"
        Else
        strSQL = "insert into setorjasa_t SELECT distinct '', ' Golongan III (Pajak 5%)' as golonganpajakpegawai,ruangan_m.id,ruangan_m.namaruangan, sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(bruto * 0.05) as pph,SUM(jasapelayanan_t.bruto) - SUM(bruto * 0.05) AS netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
                 " FROM jasapelayanan_t INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id " & _
                 " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
                 " where ruangan_m.id<>'448' and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.objectdepartemenfk like '%" & iddepartment & "%' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and  jasapelayanan_t.jeniskomponen in ('94','25') and jasapelayanan_t.idpetugas in ('27651') and jasapelayanan_t.bruto>0 " & _
                 " GROUP BY ruangan_m.namaruangan ,ruangan_m.id"
        strSQL2 = " insert into setorjasa_t SELECT distinct '', ' Golongan III (Pajak 5%)' as golonganpajakpegawai,ruangan_m.id,ruangan_m.namaruangan, sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(bruto * 0.05) as pph,SUM(jasapelayanan_t.bruto) - SUM(bruto * 0.05) AS netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
                 " FROM jasapelayanan_t INNER JOIN golonganpajakpegawai_m on jasapelayanan_t.objectpajakfk = golonganpajakpegawai_m.id inner join pasiendaftar_t ON jasapelayanan_t.noregistrasi = pasiendaftar_t.noregistrasi INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id " & _
                 " LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id " & _
                 " where ruangan_m.id='448' and jasapelayanan_t.objectjenispetugaspefk=4 and rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.objectdepartemenfk like '%" & iddepartment & "%' and ruangan_m.namaruangan like '%" & namaruangan & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' and  jasapelayanan_t.jeniskomponen in ('25')  and jasapelayanan_t.bruto>0 " & _
                 " GROUP BY ruangan_m.namaruangan ,ruangan_m.id"
        End If
    End If
    ReadRs strSQL
    ReadRs strSQL2
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namaruangan}")
'            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
'            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .ungolongan.SetUnboundFieldSource ("{ado.golonganpajakpegawai}")
'
'            .Text2.SetText ("Nama Ruangan")
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakJasapelayananperawatrekapdarah(tglAwal As String, tglAkhir As String, iddepartment As String, idRuangan As String, namaruangan As String, idpenjamin As String, namapenjamin As String, reportdisplay As String, periode As String, namarekap As String, departemensetor As String, uraian As String, periodeahir As String, tglsetor As String)
'On Error GoTo errLoad
'On Error Resume Next

Dim view As String
view = ""
Set frmCRCetakJasapelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Dim judul As String
Dim waktu As String
Dim Judul2 As String
Dim rekananjudul As String
If reportdisplay = "" Then
    rekananjudul = namapenjamin
Else
    rekananjudul = reportdisplay
End If
Judul2 = " ( " + rekananjudul + " )"
    ReadRs "select * from departemen_m where id like '%" & iddepartment & "%' "
judul = "REKAPITULASI JASA MEDIS KEPERAWATAN " + rs("namadepartemen")
waktu = "Tanggal " + tglAwal + " s/d " + tglAkhir
strFilter = ""
Reprortbolrekap = True
Set Reportrekap = New crJasapelayananrekap
    strSQL = "select top 1 namarekap from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and idpenjamin = '" & idpenjamin & "'"
    ReadRs strSQL
    If rs.EOF = False Then
            strSQL = "delete from setorjasa_t where tglsetor = '" & tglsetor & "' and namarekap = '" & namarekap & "' and uraian = '" & uraian & "'"
            ReadRs strSQL
    End If
    If idpenjamin = 1 Then
    strSQL = "insert into setorjasa_t SELECT '','',ruangan_m.id, ruangan_m.namaruangan, sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) - sum(pph)  as netto , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " from  pasien_m INNER JOIN pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN jasapelayanan_t INNER JOIN produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id" & _
             " where jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and ruangan_m.objectdepartemenfk like '%" & iddepartment & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' " & _
             "  and jeniskomponen in ('94','104') GROUP BY ruangan_m.id,ruangan_m.namaruangan  "
    Else
    strSQL = "insert into setorjasa_t SELECT '','',ruangan_m.id,ruangan_m.namaruangan, sum(jumlah) as jumlah,sum(tarif) as tarif,sum(bruto) as bruto,sum(pph) as pph,sum(bruto) - sum(pph)  as netto  , 1, '" & uraian & "' , '" & tglsetor & "' , '" & namarekap & "','" & periode & "', '" & periodeahir & "' , '" & departemensetor & "', '" & idpenjamin & "'" & _
             " from  pasien_m INNER JOIN pasiendaftar_t ON pasien_m.id = pasiendaftar_t.nocmfk INNER JOIN jasapelayanan_t INNER JOIN produk_m ON jasapelayanan_t.produkfk = produk_m.id ON pasiendaftar_t.noregistrasi = jasapelayanan_t.noregistrasi INNER JOIN ruangan_m ON jasapelayanan_t.ruanganfk = ruangan_m.id LEFT OUTER JOIN rekanan_m ON pasiendaftar_t.objectrekananfk = rekanan_m.id" & _
             " where rekanan_m.reportdisplay like '%" & reportdisplay & "%' and jasapelayanan_t.tglverif between '" & tglAwal & "' and '" & tglAkhir & "' and ruangan_m.namaruangan like '%" & namaruangan & "%' and ruangan_m.objectdepartemenfk like '%" & iddepartment & "%' and pasiendaftar_t.objectkelompokpasienlastfk = '" & idpenjamin & "' " & _
             "  and jeniskomponen in ('94','104') GROUP BY ruangan_m.id,ruangan_m.namaruangan  "
    
    End If
    ReadRs strSQL
    MsgBox "Data " + uraian + " Berhasil Di Setor", vbInformation, ".: Information":
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Reportrekap
'        .database.AddADOCommand CN_String, adocmd
'        'If Not RS.EOF Then
'            .unnama.SetUnboundFieldSource ("{ado.namaruangan}")
'            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unbruto.SetUnboundFieldSource ("{ado.bruto}")
'            .unpph21.SetUnboundFieldSource ("{ado.pph}")
'            .untarif.SetUnboundFieldSource ("{ado.tarif}")
'            .unnetto.SetUnboundFieldSource ("{ado.netto}")
'            .Text2.SetText ("Nama Ruangan")
'            .txtJudul.SetText UCase(judul)
'            .txtjudul2.SetText UCase(Judul2)
'            .txttanggal.SetText UCase(waktu)
'
''
''
''
''            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
''
''            .txtUser.SetText UCase(strIdPegawai)
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "JasaPelayanan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Reportrekap
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
Exit Sub
errLoad:
End Sub
