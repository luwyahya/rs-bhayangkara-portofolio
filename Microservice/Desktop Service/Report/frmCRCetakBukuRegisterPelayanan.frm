VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRCetakBukuRegisterPelayanan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCRCetakBukuRegisterPelayanan.frx":0000
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
Attribute VB_Name = "frmCRCetakBukuRegisterPelayanan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crBukuRegisterPelayananPasien
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "RegisterPelayanan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCRCetakBukuRegisterPelayanan = Nothing
End Sub

Public Sub CetakBukuRegisterPelayanan(tglAwal As String, tglAkhir As String, strIdRuangan As String, strIdDepartement As String, _
                                        strIdKelompokPasien As String, strIdDokter As String, strIdPegawai As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakBukuRegisterPelayanan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
Set Report = New crBukuRegisterPelayananPasien

    strFilter = ""

    strFilter = " where pp.tglpelayanan BETWEEN '" & _
    Format(tglAwal, "yyyy-MM-dd 00:00:00") & "' AND '" & _
    Format(tglAkhir, "yyyy-MM-dd 23:59:59") & "'"
'    strFilter = strFilter & " and IdRuangan like '%" & strIdRuangan & "%' and IdDepartement like '%" & strIdDepartement & "%' and IdKelompokPasien like '%" & strIdKelompokPasien & "%' and IdDokter Like '%" & strIdDokter & "%'"
    
    If strIdRuangan <> "" Then strFilter = strFilter & " AND ru2.id = '" & strIdRuangan & "' "
    If strIdDepartement <> "" Then strFilter = strFilter & " AND ru2.objectdepartemenfk = '" & strIdDepartement & "' "
    If strIdKelompokPasien <> "" Then strFilter = strFilter & " AND klp.id = '" & strIdKelompokPasien & "' "
    If strIdDokter <> "" Then strFilter = strFilter & " AND pg2.id = '" & strIdDokter & "' "
    
    strFilter = strFilter & " group by pd.noregistrasi,ps.nocm,ps.namapasien,jk.reportdisplay,ru.namaruangan,kl.namakelas,   " & _
"                 pg.namalengkap,pd.tglregistrasi,pd.tglpulang,rk.namarekanan,ru2.namaruangan,pr.namaproduk,jp.jenisproduk, pg2.namalengkap,pp.hargajual,   " & _
"                 kmr.namakamar,ru2.id,ru2.objectdepartemenfk, klp.id, klp.kelompokpasien,pg2.id order by pd.tglregistrasi"
        
    strSQL = "SELECT pd.noregistrasi,ps.nocm,(ps.namapasien  +  ' ( '  +  jk.reportdisplay  +  ' )' ) as namapasienjk ,ru.namaruangan,kl.namakelas,   " & _
"                 pg.namalengkap,pd.tglregistrasi,pd.tglpulang,rk.namarekanan,ru2.namaruangan as ruanganTindakan,   " & _
"                 pr.namaproduk,jp.jenisproduk, pg2.namalengkap as dokter,sum(pp.jumlah) as jumlah,pp.hargajual,   " & _
"                 sum(case when pp.hargadiscount is null then 0 else pp.hargadiscount end) as diskon,   " & _
"                 sum(pp.jumlah*(pp.hargajual-case when pp.hargadiscount is null then 0 else pp.hargadiscount end)) as total, kmr.namakamar " & _
"                 ,ru2.id as idRuanganTindakan,ru2.objectdepartemenfk as idDepartementTindakan, klp.id as IdKelompokPasien, klp.kelompokpasien, " & _
"                 pg2.id as idDokter " & _
"                 from pasiendaftar_t as pd  " & _
"                 INNER join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec   " & _
"                 INNER join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec   " & _
"                 INNER join produk_m as pr on pr.id=pp.produkfk   " & _
"                 INNER join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk   " & _
"                 INNER join jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk   " & _
"                 INNER join pasien_m as ps on ps.id=pd.nocmfk   " & _
"                 INNER join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk   " & _
"                 INNER join ruangan_m  as ru on ru.id=pd.objectruanganlastfk   " & _
"                 INNER join ruangan_m  as ru2 on ru2.id=apd.objectruanganfk   " & _
"                 left join kelas_m  as kl on kl.id=apd.objectkelasfk   " & _
"                 left join pegawai_m  as pg on pg.id=pd.objectpegawaifk   " & _
"                 left join pegawai_m  as pg2 on pg2.id=apd.objectpegawaifk   " & _
"                 left join rekanan_m  as rk on rk.id=pd.objectrekananfk   " & _
"                 left join kamar_m  as kmr on kmr.id=apd.objectkamarfk " & _
"                 INNER join kelompokpasien_m as klp on klp.id=pd.objectkelompokpasienlastfk " & strFilter

    
'    ReadRs2 "SELECT " & _
'            "sum((pp.jumlah*(pp.hargajual-case when pp.hargadiscount is null then 0 else pp.hargadiscount end))) as total " & _
'            "from pasiendaftar_t as pd " & _
'            "inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
'            "inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
'            "inner join produk_m as pr on pr.id=pp.produkfk " & _
'            "inner join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk " & _
'            "inner join jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk " & _
'            "inner join pasien_m as ps on ps.id=pd.nocmfk " & _
'            "inner join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
'            "inner join ruangan_m  as ru on ru.id=pd.objectruanganlastfk " & _
'            "inner join ruangan_m  as ru2 on ru2.id=apd.objectruanganfk " & _
'            "LEFT join kelas_m  as kl on kl.id=pd.objectkelasfk " & _
'            "inner join pegawai_m  as pg on pg.id=pd.objectpegawaifk " & _
'            "inner join pegawai_m  as pg2 on pg2.id=apd.objectpegawaifk " & _
'            "left join rekanan_m  as rk on rk.id=pd.objectrekananfk " & _
'            "where pd.noregistrasi='" & strNoregistrasi & "' "

   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
'            .udtTglPelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .udTglRegistrasi.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usNoPendaftaran.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
            .usPasien.SetUnboundFieldSource ("{ado.namapasienjk}")
            .usRuanganPelayanan.SetUnboundFieldSource ("{ado.ruanganTindakan}")
            .usJenisPasien.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usKelas.SetUnboundFieldSource ("{ado.namakelas}")
            .usJenisPelayanan.SetUnboundFieldSource ("{ado.jenisproduk}")
            .usNamaPelayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .usQty.SetUnboundFieldSource ("{ado.jumlah}")
            .ucHarga.SetUnboundFieldSource ("{ado.hargajual}")
            .ucTotalBiaya.SetUnboundFieldSource ("{ado.total}")
            
            .TxtTgl.SetText Format(tglAwal, "dd/MM/yyyy 00:00:00") & "  s/d  " & Format(tglAkhir, "dd/MM/yyyy 23:59:59")
             
            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
            If RS2.BOF Then
                .txtUser.SetText "-"
            Else
                .txtUser.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
            End If
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "RegisterPelayanan")
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
