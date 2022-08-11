VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRCetakKuitansiPasienV2 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCetakKuitansiPasienV2.frx":0000
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
Attribute VB_Name = "frmCRCetakKuitansiPasienV2"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crKuitansiPasien
'Dim Report As New crKuitansiPasienNew
Dim bolSuppresDetailSection10 As Boolean
Dim ii As Integer
Dim tempPrint1 As String
Dim p As Printer
Dim p2 As Printer
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "Kwitansi")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRCetakKuitansiPasienV2 = Nothing
End Sub

Public Sub CetakUlangJenisKuitansi(strNoregistrasi As String, jumlahCetak As Integer, strIdPegawai As String, STD As String, view As String)
'On Error GoTo errLoad

Dim strKet As Boolean
Dim jenisKwitansi As String
Dim NamaKasir As String
Dim obat As Boolean
Dim cetakdari As Boolean

    strKet = True
    obat = False
    cetakdari = False
    Set frmCRCetakKuitansiPasienV2 = Nothing
    Set Report = New crKuitansiPasien
    If Len(strNoregistrasi) = 10 Then
        
        ReadRs "select pd.noregistrasi,sbp.totaldibayar,ps.namapasien, sbp.keteranganlainnya,pd.nocmfk,ru.namaruangan,pg.namalengkap,ps.nocm, " & _
               "pd.tglregistrasi,pd.tglpulang,convert(varchar, sbp.tglsbm, 105) as tanggal,sbp.nosbm as nobayar from pasiendaftar_t as pd,sbp.iscorona " & _
               "inner join strukpelayanan_t as sp on sp.noregistrasifk=pd.norec " & _
               "inner join strukbuktipenerimaan_t as sbp  on sbp.nostrukfk=sp.norec " & _
               "inner join pasien_m as ps on ps.id=pd.nocmfk " & _
               "inner join ruangan_m as ru on ru.id=pd.objectruanganlastfk " & _
               "inner join loginuser_s as lu on lu.id=sbp.objectpegawaipenerimafk " & _
               "inner join pegawai_m as pg on pg.id=lu.objectpegawaifk " & _
               "where pd.noregistrasi='" & strNoregistrasi & "'"
    End If
    If Len(strNoregistrasi) = 14 Then
   
        ReadRs "select sp.nostruk as noregistrasi,sp.totalharusdibayar as totaldibayar,sp.namapasien_klien as namapasien,pg.namalengkap, sp.keteranganlainnya,'Tindakan Non Layanan' as namaruangan,'-' as nocm, " & _
               "sp.tglstruk as tglregistrasi,sp.tglstruk as tglpulang,convert(varchar, sbp.tglsbm, 105) as tanggal,sbp.nosbm as nobayar,sbp.iscorona " & _
               "from strukpelayanan_t as sp  " & _
               "inner join strukbuktipenerimaan_t as sbp on sbp.nostrukfk=sp.norec " & _
               "inner join loginuser_s as lu on lu.id=sbp.objectpegawaipenerimafk " & _
               "inner join pegawai_m as pg on pg.id=lu.objectpegawaifk " & _
               "where sbp.nosbm='" & strNoregistrasi & "'"
        obat = True
        strKet = False ' perbaikan cetakan non layanan
    End If
    If Len(strNoregistrasi) > 14 Then
        If Left(strNoregistrasi, 7) = "DEPOSIT" Then
            strNoregistrasi = Replace(strNoregistrasi, "DEPOSIT", "")
            
            ReadRs "select sp.nostruk as noregistrasi,sbp.totaldibayar as totaldibayar, ps.namapasien as namapasien, " & _
                    "pg.namalengkap, sbp.keteranganlainnya,sbp.keteranganlainnya as namaruangan,ps.nocm as nocm, " & _
                    "sp.tglstruk as tglregistrasi,sp.tglstruk as tglpulang,convert(varchar, sbp.tglsbm, 105) as tanggal,sbp.nosbm as nobayar, sbp.iscorona,ru.namaruangan as ruanganterakhir,rk.namarekanan " & _
                    "from   strukpelayanan_t as sp " & _
                    "inner join strukbuktipenerimaan_t as sbp  on sbp.nostrukfk=sp.norec " & _
                    "left join loginuser_s as lu on lu.id=sbp.objectpegawaipenerimafk " & _
                    "left join pasien_m as ps on ps.id=sp.nocmfk " & _
                    "left join pegawai_m as pg on pg.id=lu.objectpegawaifk " & _
                    "LEFT JOIN pasiendaftar_t AS pd ON pd.norec = sp.noregistrasifk " & _
                    "LEFT JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk " & _
                    "LEFT JOIN rekanan_m AS rk ON rk.id = pd.objectrekananfk " & _
                    "where sbp.nosbm='" & strNoregistrasi & "'"
            strKet = False
'            ReadRs "select sp.nostruk as noregistrasi,sp.totalharusdibayar as totaldibayar,sp.namapasien_klien as namapasien,pg.namalengkap, sp.keteranganlainnya,sp.keteranganlainnya as namaruangan,'-' as nocm from  " & _
'               " strukpelayanan_t as sp  " & _
'               "inner join strukbuktipenerimaan_t as sbp  on sbp.nostrukfk=sp.norec " & _
'               "left join loginuser_s as lu on lu.id=sbp.objectpegawaipenerimafk " & _
'               "left join pegawai_m as pg on pg.id=lu.objectpegawaifk " & _
'               "where sbp.nosbm='" & strNoregistrasi & "'"
        ElseIf Left(strNoregistrasi, 14) = "KEMBALIDEPOSIT" Then
            jenisKwitansi = "KEMBALIDEPOSIT"
            strNoregistrasi = Replace(strNoregistrasi, "KEMBALIDEPOSIT", "")
            ReadRs "select sbp.nosbm as noregistrasi,sbp.totaldibayar as totaldibayar,  namapasien, " & _
                    "pg.namalengkap, sbp.keteranganlainnya,sbp.keteranganlainnya as namaruangan,ps.nocm as nocm, " & _
                    "pd.tglregistrasi,pd.tglpulang,convert(varchar, sbp.tglsbm, 105) as tanggal,sbp.nosbm as nobayar,sbp.iscorona " & _
                    "from strukpelayanan_t as sp " & _
                    "LEFT JOIN pasiendaftar_t as pd on pd.noregistrasifk = sp.noregistrasifk " & _
                    "inner join strukbuktipenerimaan_t as sbp on sbp.nostrukfk=sp.norec " & _
                    "left join loginuser_s as lu on lu.id=sbp.objectpegawaipenerimafk " & _
                    "left join pasien_m as ps on ps.id=sp.nocmfk " & _
                    "left join pegawai_m as pg on pg.id=lu.objectpegawaifk " & _
                    "where sbp.nosbm='" & strNoregistrasi & "'"
            strKet = False
        ElseIf Left(strNoregistrasi, 13) = "KWITANSITOTAL" Then
            jenisKwitansi = "KWITANSITOTAL"
            strNoregistrasi = Replace(strNoregistrasi, "KWITANSITOTAL", "")
            ReadRs2 "select lu.objectpegawaifk,pg.namalengkap,0 as iscorona " & _
                    "from loginuser_s as lu " & _
                    "INNER JOIN pegawai_m as pg on pg.id =lu.objectpegawaifk " & _
                    "where lu.namauser='" & strIdPegawai & "'"
                    
            If Not RS2.EOF Then
                NamaKasir = RS2("namalengkap")
            Else
                NamaKasir = "-"
            End If
                        
            ReadRs "select pd.noregistrasi as noregistrasi," & STD & " as totaldibayar,ps.namapasien, '" & NamaKasir & "' as namalengkap, " & _
                   " '-' as keteranganlainnya,ru.namaruangan as namaruangan,ps.nocm, " & _
                   "pd.tglregistrasi,pd.tglpulang,'' as tanggal, " & _
                   "case when pd.nosbmlastfk is null then '' else sbm.nosbm end as nobayar,sbm.iscorona  " & _
                   "from pasiendaftar_t as pd " & _
                   "left join ruangan_m as ru on ru.id=pd.objectruanganlastfk " & _
                   "left join pasien_m as ps on ps.id=pd.nocmfk " & _
                   "left join strukbuktipenerimaan_t as sbm on sbm.norec = pd.nosbmlastfk " & _
                   "where pd.noregistrasi='" & strNoregistrasi & "'"
            strKet = False
'            jumlahDuit = STD
            STD = ""
        ElseIf Left(strNoregistrasi, 14) = "CICILANTAGIHAN" Then
            jenisKwitansi = "CICILANTAGIHAN"
            strNoregistrasi = Replace(strNoregistrasi, "CICILANTAGIHAN", "")
            ReadRs "select pd.noregistrasi,sbp.totaldibayar,ps.namapasien, sbp.keteranganlainnya,pd.nocmfk,ru.namaruangan, " & _
                   "pg.namalengkap,ps.nocm,pd.tglregistrasi,pd.tglpulang,convert(varchar, sbp.tglsbm, 105) as tanggal,sbp.nosbm as nobayar,sbp.iscorona  from strukbuktipenerimaan_t as sbp " & _
                   "inner join strukpelayanan_t as sp on sp.norec=sbp.nostrukfk " & _
                   "inner join pasien_m as ps on ps.id=sp.nocmfk " & _
                   "inner join pasiendaftar_t as pd on pd.norec=sp.noregistrasifk " & _
                   "inner join ruangan_m as ru on ru.id=pd.objectruanganlastfk " & _
                   "inner join loginuser_s as lu on lu.id=sbp.objectpegawaipenerimafk " & _
                   "inner join pegawai_m as pg on pg.id=lu.objectpegawaifk " & _
                   "Where sbp.nosbm ='" & strNoregistrasi & "'"
        Else
            Dim Noreg, nostruk As String
            Noreg = Left(strNoregistrasi, 10)
            nostruk = Replace(strNoregistrasi, Noreg, "")
            ReadRs "select case when sbp.diterimadari = '-' then ps.namapasien else sbp.diterimadari end as diterimadari,pd.noregistrasi,sbp.totaldibayar,ps.namapasien, sbp.keteranganlainnya,pd.nocmfk,ru.namaruangan,pg.namalengkap,ps.nocm, " & _
                   "pd.tglregistrasi,pd.tglpulang,convert(varchar, sbp.tglsbm, 105) as tanggal,sbp.nosbm as nobayar,sp.iscorona from pasiendaftar_t as pd " & _
                   "inner join strukpelayanan_t as sp on sp.noregistrasifk=pd.norec " & _
                   "inner join strukbuktipenerimaan_t as sbp  on sbp.nostrukfk=sp.norec " & _
                   "inner join pasien_m as ps on ps.id=pd.nocmfk " & _
                   "inner join ruangan_m as ru on ru.id=pd.objectruanganlastfk " & _
                   "inner join loginuser_s as lu on lu.id=sbp.objectpegawaipenerimafk " & _
                   "inner join pegawai_m as pg on pg.id=lu.objectpegawaifk " & _
                   "where pd.noregistrasi='" & Noreg & "' and sp.norec='" & nostruk & "'"
                   
                   
'          ReadRs " SELECT        CASE WHEN sbp.diterimadari = '-' THEN ps.namapasien ELSE sbp.diterimadari END AS diterimadari, pd.noregistrasi, sbp.totaldibayar, ps.namapasien, sbp.keteranganlainnya, pd.nocmfk, ru.namaruangan, pg.namalengkap,  " & _
'                  "       ps.nocm, pd.tglregistrasi, pd.tglpulang, CONVERT(varchar, sbp.tglsbm, 105) AS tanggal, sbp.nosbm AS nobayar, sp.iscorona  " & _
'                  "  FROM            pasiendaftar_t AS pd INNER JOIN " & _
'                  "       strukpelayanan_t AS sp ON sp.noregistrasifk = pd.norec INNER JOIN " & _
'                  "       strukbuktipenerimaan_t AS sbp ON sbp.nostrukfk = sp.norec INNER JOIN " & _
'                  "       pasien_m AS ps ON ps.id = pd.nocmfk INNER JOIN " & _
'                  "       loginuser_s AS lu ON lu.id = sbp.objectpegawaipenerimafk INNER JOIN " & _
'                  "       pegawai_m AS pg ON pg.id = lu.objectpegawaifk INNER JOIN  " & _
'                  "       antrianpasiendiperiksa_t ON pd.norec = antrianpasiendiperiksa_t.noregistrasifk INNER JOIN  " & _
'                  "       ruangan_m AS ru ON antrianpasiendiperiksa_t.objectruanganfk = ru.id  " & _
'                  " where pd.noregistrasi='" & Noreg & "' and sp.norec='" & nostruk & "'"
            cetakdari = True
'            strKet = False
        End If
    End If
    
    Dim i As Integer
    Dim jumlahDuit As Double
    Dim kembaliDeposit As Boolean
    Dim corona As String
        
    For i = 0 To rs.RecordCount - 1
        jumlahDuit = jumlahDuit + CDbl(rs!totaldibayar)
        rs.MoveNext
        
    Next
    rs.MoveFirst
    
    kembaliDeposit = False
    If jumlahDuit < 0 Then
        kembaliDeposit = True
    End If
    
    With Report
        If Not rs.EOF Then
            If (rs!iscorona) = 1 Then
            corona = "KLB"
            Else
            corona = "-"
            End If
            .txtNoBKM.SetText rs("noregistrasi")
            .txtNoBayar.SetText rs("nobayar")
            If STD = "" Then
                If cetakdari = True Then
                    .txtNamaPenyetor.SetText UCase(rs("diterimadari"))
                Else
                    .txtNamaPenyetor.SetText UCase(rs("namapasien"))
                End If
            Else
                .txtNamaPenyetor.SetText UCase(STD)
            End If
            .txtNamaPasien.SetText UCase(rs("namapasien"))
            If jenisKwitansi = "KEMBALIDEPOSIT" Then
                .txtNamaPenyetor.SetText "RS Bhayangkara TK.I Said Sukanto"
            End If
            
            If strKet = True Then
                'start
                 Dim norecapdapotik As String
                Dim strukresepfk As String
                 ReadRs6 "SELECT   ruangan_m.objectdepartemenfk,ruangan_m.namaruangan FROM   pasiendaftar_t INNER JOIN   ruangan_m ON pasiendaftar_t.objectruanganlastfk = ruangan_m.id where pasiendaftar_t.noregistrasi='" & Noreg & "' "
                 
                If RS6.EOF = False Then
                        If RS6!objectdepartemenfk = 16 Then
                            .txtKeterangan.SetText UCase("Biaya " & rs("keteranganlainnya") & " Ruangan " & RS6("namaruangan")) 'RS("keteranganlainnya")
                            GoTo endLah:
                        Else
                            ReadRs6 "select norec,produkfk,noregistrasifk,case when isobat is null then 'false' else isobat end as isobat,strukresepfk from pelayananpasien_t where strukfk='" & nostruk & "' order by isobat"
                           
                            For i = 1 To RS6.RecordCount
                                If (i = 1 And RS6!isobat = True) Then
                                    obat = True
                                    norecapdapotik = RS6!noregistrasifk
                                    strukresepfk = RS6!strukresepfk
                                    
                                ElseIf (RS6!isobat = False) Then
                                    obat = False
                                    norecapdapotik = RS6!noregistrasifk
                                End If
                                RS6.MoveNext
                            Next
                        End If
                End If
                If obat = False Then
                Dim dataNorec As String
'           Khusus Radiology pake query yang bawah, jadi kalo radiology hidupin query yang bawah
'                dataNorec = "     SELECT     top 1   pelayananpasien_t.norec, pelayananpasien_t.produkfk, pelayananpasien_t.noregistrasifk, ruangan_m.namaruangan " & _
'                            " FROM            pelayananpasien_t INNER JOIN  " & _
'                            "  antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN  " & _
'                            "  pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec INNER JOIN  " & _
'                            "  ruangan_m ON pasiendaftar_t.objectruanganlastfk = ruangan_m.id  " & _
'                            "   WHERE        (pelayananpasien_t.strukfk = '" & nostruk & "') "
  

           dataNorec = "     SELECT     top 1   pelayananpasien_t.norec, pelayananpasien_t.produkfk, pelayananpasien_t.noregistrasifk, ruangan_m.namaruangan " & _
                       " FROM            pelayananpasien_t INNER JOIN  " & _
                       "  antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec INNER JOIN  " & _
                       "  pasiendaftar_t ON antrianpasiendiperiksa_t.noregistrasifk = pasiendaftar_t.norec INNER JOIN  " & _
                       "  ruangan_m ON antrianpasiendiperiksa_t.objectruanganfk = ruangan_m.id  " & _
                       "   WHERE        (pelayananpasien_t.strukfk = '" & nostruk & "') "
                    ReadRs6 dataNorec
                    Dim konsul As Boolean
                    Dim norecapd As String
                    konsul = False
                    norecapd = ""
                    'ini dibuka untuk ruangan tidak melihat ke ruangan terakhir
'                    For i = 1 To RS6.RecordCount
'                        If (RS6!ProdukFk = "4056968") Then
                            konsul = True
                            norecapd = RS6!noregistrasifk
'                        End If
'                        RS6.MoveNext
'                    Next
'                    If konsul = True Then
'                        ReadRs6 "select objectruanganfk from antrianpasiendiperiksa_t  where norec ='" & norecapd & "'"
'                        ReadRs7 "select namaruangan from ruangan_m where id = '" & RS6("objectruanganfk") & "'"
'                        .txtKeterangan.SetText UCase(rs("keteranganlainnya") & " Ruangan " & RS7("namaruangan"))  'RS("keteranganlainnya")
'                    Else
'                        .txtKeterangan.SetText UCase(rs("keteranganlainnya") & " Ruangan " & rs("namaruangan"))  'RS("keteranganlainnya")
                        .txtKeterangan.SetText UCase(rs("keteranganlainnya") & " Ruangan " & RS6!namaruangan) 'ini untuk radiology
'                    End If
                Else
'
                        ReadRs6 "select ruanganfk from strukresep_t  where norec ='" & strukresepfk & "'"
                        ReadRs7 "select namaruangan from ruangan_m where id = '" & RS6("ruanganfk") & "'"
                        .txtKeterangan.SetText UCase("Biaya " & rs("keteranganlainnya") & " Ruangan " & RS7("namaruangan")) 'RS("keteranganlainnya")
'
                End If
            Else
endLah:
                If kembaliDeposit = False Then
'                    If obat = True Then ' perbaikan cetakan non layanan
'                        .txtKeterangan.SetText UCase(rs("namaruangan"))
'                    Else
'                        .txtKeterangan.SetText UCase(rs("namaruangan") & " " & rs("ruanganterakhir") & " Jenis Pasien " & IIf(IsNull(rs("namarekanan")), "-", rs("namarekanan")))   'RS("keteranganlainnya")
'                    End If
                    If rs("keteranganlainnya") = "Penjualan Obat Bebas" Then
                      .txtKeterangan.SetText UCase("Biaya " & "Penjualan Obat  Langsung")   'RS("keteranganlainnya")
                    ElseIf rs("keteranganlainnya") = "Penjualan Resep Obat Bebas " Then
                       .txtKeterangan.SetText UCase("Biaya " & "Penjualan Obat  Langsung")
                    ElseIf Len(strNoregistrasi) = 14 Then
                        .txtKeterangan.SetText UCase(rs("namaruangan")) & "  \ " & UCase(rs("ruanganterakhir")) & "  \ " & UCase(rs("namarekanan"))
                    Else
                        .txtKeterangan.SetText UCase(rs("namaruangan")) & "  \ " & UCase(rs("ruanganterakhir")) & "  \ " & UCase(rs("namarekanan"))
                        
                    End If
                    
'                    ruanganterakhir, rk.namarekanan
                Else
                    .txtKeterangan.SetText Replace(UCase(rs("namaruangan")), "PEMBAYARAN", "PENGEMBALIAN")
                    jumlahDuit = jumlahDuit * (-1)
                End If
            End If
            jumlahDuit = Round(jumlahDuit)
            .txtRp.SetText "Rp. " & Format(jumlahDuit, "##,##0.00")
            .txtTerbilang.SetText TerbilangDesimal(CStr(jumlahDuit))
'            .txtKeterangan.SetText "Biaya Perawatan Pasien"
            
'            .txtRp.SetText "Rp. " & Format(11789104, "##,##0.00")
            
            .txtRuangan.SetText UCase(rs("namaruangan"))
'            .txtNoPen2.SetText RS("noregistrasi")
            .txtnocm2.SetText rs("nocm")
            .txtJnsKelamin.SetText rs("nocm")
    
            .txtPrintTglBKM.SetText rs("tanggal")
            .txtPetugasKasir.SetText rs("namalengkap")
            '.txtTglSbm.SetText Format(RS("tanggal"), "dd-MM-yyyy")
'            .txtTglMasuk.SetText RS("tglpulang")
            '.udtTanggal.SetUnboundFieldSource ado{"()"}
            If jenisKwitansi = "KEMBALIDEPOSIT" Then
                .txtPetugasKasir.SetText rs("namapasien")
            End If
            .txtDesc.SetText UCase("NAMA/MR/No.REG/KET  : " & rs("namapasien") & "/ " & rs("nocm") & "/ " & rs("noregistrasi") & "/ " & corona & "/ " & rs("keteranganlainnya"))
'            .txtDesc.SetText UCase("NAMA/MR/No.REG  : " & RS("namapasien") & "/ " & RS("nocm") & "/ " & "1711001100")
            .txtPetugasCetak.SetText strIdPegawai
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "Kwitansi")
                Report.SelectPrinter "winspool", strPrinter, "Ne00:"
                Report.PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Report
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        End If
    End With
Exit Sub
errLoad:
End Sub

