VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRCetakSensus 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCRCetakSensus.frx":0000
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
Attribute VB_Name = "frmCRCetakSensus"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanSensusPasien
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "PasienDaftar")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRCetakSensus = Nothing
End Sub

Public Sub CetakSensus(tglAwal As String, tglAkhir As String, strIdRuangan As String, strIdDepartement As String, _
                                        strIdKelompokPasien As String, strIdPegawai As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakSensus = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Set Report = New crLaporanSensusPasien

    strFilter = ""

    strFilter = " where pd.tglregistrasi BETWEEN '" & _
    Format(tglAwal, "yyyy-MM-dd HH:mm") & "' AND '" & _
    Format(tglAkhir, "yyyy-MM-dd HH:mm") & "' AND pd.tglpulang is null"
'    strFilter = strFilter & " and IdRuangan like '%" & strIdRuangan & "%' and IdDepartement like '%" & strIdDepartement & "%' and IdKelompokPasien like '%" & strIdKelompokPasien & "%' and IdDokter Like '%" & strIdDokter & "%'"
    
    If strIdRuangan <> "" Then strFilter = strFilter & " AND apd.objectruanganfk = '" & strIdRuangan & "' "
    If strIdDepartement <> "" Then strFilter = strFilter & " AND ru.objectdepartemenfk = '" & strIdDepartement & "' "
    If strIdKelompokPasien <> "" Then strFilter = strFilter & " AND pd.objectkelompokpasienlastfk = '" & strIdKelompokPasien & "' "
'    If strIdDokter <> "" Then strFilter = strFilter & " AND pg2.id = '" & strIdDokter & "' "
    
    strFilter = strFilter & " order by pd.noregistrasi "
    
    strSQL = "SELECT DISTINCT pd.noregistrasi,ps.nocm,ps.namapasien,ps.tgllahir,age(ps.tgllahir) as umur,jk.reportdisplay as jk," & _
"                 ru.namaruangan as ruanganakhir, pg.namalengkap as dokter, klp.kelompokpasien, " & _
"                 dpt.namadepartemen," & _
"                 case when ddp.keterangan is null then '-' else ddp.keterangan end as diagnosa " & _
"                 from pasiendaftar_t as pd  " & _
"                 INNER join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec   " & _
"                 INNER join pasien_m as ps on ps.id=pd.nocmfk   " & _
"                 INNER join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk   " & _
"                 INNER join ruangan_m  as ru on ru.id=apd.objectruanganfk   " & _
"                 left join pegawai_m  as pg on pg.id=apd.objectpegawaifk   " & _
"                 left join rekanan_m  as rk on rk.id=pd.objectrekananfk   " & _
"                 INNER join kelompokpasien_m as klp on klp.id=pd.objectkelompokpasienlastfk " & _
"                 LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec " & _
"                 LEFT JOIN diagnosa_m as dgs on dgs.id=ddp.objectdiagnosafk " & _
"                 LEFT JOIN jenisdiagnosa_m as jd on jd.id=ddp.objectjenisdiagnosafk " & _
"                 inner join departemen_m as dpt on dpt.id=ru.objectdepartemenfk" & strFilter

'    strSQL = "SELECT DISTINCT pd.noregistrasi,ps.nocm,ps.namapasien,ps.tgllahir,age(ps.tgllahir) as umur,jk.reportdisplay as jk,ru.namaruangan as ruanganakhir,kl.namakelas, pg.namalengkap as dokterpj,apd.tglregistrasi,apd.tglkeluar as tglpulang,rk.namarekanan, " & _
'"                 case when ru.objectdepartemenfk in (16,35) then 'Y' ELSE 'N' END as inap,   " & _
'"                 pg2.namalengkap as dokter, kmr.namakamar,cast(apd.nobed as varchar(10)) as nobed,ru.id as idruangandaftar,ru.objectdepartemenfk as iddepartementdaftar, klp.id as IdKelompokPasien, klp.kelompokpasien, " & _
'"                 pg2.id as idDokter,ar.asalrujukan,case when apd.statuskunjungan='BARU' then 'Y' ELSE 'N' END as statuskunjungan,alm.alamatlengkap,kdp.kondisipasien,dpt.namadepartemen," & _
'"                 case when dgs.namadiagnosa is null then '-' else dgs.namadiagnosa end as diagnosa " & _
'"                 from pasiendaftar_t as pd  " & _
'"                 INNER join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec   " & _
'"                 INNER join pasien_m as ps on ps.id=pd.nocmfk   " & _
'"                 INNER join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk   " & _
'"                 INNER join ruangan_m  as ru on ru.id=apd.objectruanganfk   " & _
'"                 left join kelas_m  as kl on kl.id=apd.objectkelasfk   " & _
'"                 left join pegawai_m  as pg on pg.id=pd.objectpegawaifk   " & _
'"                 left join pegawai_m  as pg2 on pg2.id=apd.objectpegawaifk   " & _
'"                 left join rekanan_m  as rk on rk.id=pd.objectrekananfk   " & _
'"                 left join kamar_m  as kmr on kmr.id=apd.objectkamarfk " & _
'"                 INNER join kelompokpasien_m as klp on klp.id=pd.objectkelompokpasienlastfk " & _
'"                 left join asalrujukan_m as ar on ar.id=apd.objectasalrujukanfk " & _
'"                 left join alamat_m as alm on ps.id=alm.nocmfk " & _
'"                 left join kondisipasien_m as kdp on kdp.id=pd.objectkondisipasienfk " & _
'"                 LEFT JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk = apd.norec " & _
'"                 LEFT JOIN diagnosa_m as dgs on dgs.id=ddp.objectdiagnosafk " & _
'"                 LEFT JOIN jenisdiagnosa_m as jd on jd.id=ddp.objectjenisdiagnosafk " & _
'"                 inner join departemen_m as dpt on dpt.id=ru.objectdepartemenfk" & strFilter

'"                 INNER join ruangan_m  as ru on ru.id=pd.objectruanganlastfk   " & _
'case when ru.objectdepartemenfk in (16,35) then ru2.namaruangan else ru3.namaruangan end as ruangandaftar,
'"                 INNER join ruangan_m  as ru3 on ru3.id=apd.objectruanganasalfk   " & _

    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            '.udTglMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
            '.usNoPendaftaran.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
            .usPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usRuanganPelayanan.SetUnboundFieldSource ("{ado.ruanganakhir}")
            '.usPenjamin.SetUnboundFieldSource ("if isnull({ado.namarekanan})  then "" - "" else {ado.namarekanan} ")
            .usJK.SetUnboundFieldSource ("{ado.jk}")
            .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
            .usUmur.SetUnboundFieldSource ("{ado.umur}")
            '.usBaru.SetUnboundFieldSource ("{ado.statuskunjungan}")
            '.usInap.SetUnboundFieldSource ("{ado.inap}")
            .usJenisPasien.SetUnboundFieldSource ("{ado.kelompokpasien}")
            '.usKelas.SetUnboundFieldSource ("if isnull({ado.namakelas})  then "" - "" else {ado.namakelas} ") '("{ado.namakelas}")
            '.usBed.SetUnboundFieldSource ("if isnull({ado.nobed})  then "" - "" else {ado.nobed} ") '("{ado.nobed}")
            .usDokter.SetUnboundFieldSource ("if isnull({ado.dokter})  then "" - "" else {ado.dokter} ") '("{ado.dokter}")
'            .usDokterPengirim.SetUnboundFieldSource ("{ado.dokterpengirim}")
            '.usAsalPasien.SetUnboundFieldSource ("{ado.asalrujukan}")
            '.udTglPulang.SetUnboundFieldSource ("{ado.tglpulang}")
'            .usCaraMasuk.SetUnboundFieldSource ("{ado.caramasuk}")
            '.usKeadaan.SetUnboundFieldSource ("if isnull({ado.kondisipasien})  then "" - "" else {ado.kondisipasien} ") '("{ado.kondisipasien}")
            .usDiagnosa.SetUnboundFieldSource ("{ado.diagnosa}")
            .usDepartement.SetUnboundFieldSource ("{ado.namadepartemen}")
            
            '.txtTgl.SetText Format(tglAwal, "dd/MM/yyyy 00:00:00") & "  s/d  " & Format(tglAkhir, "dd/MM/yyyy 23:59:59")
             
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
                strPrinter = GetTxt("Setting.ini", "Printer", "Sensus")
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
