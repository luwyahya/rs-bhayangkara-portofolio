VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmIpsrsPermohonanPerbaikan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmIpsrsPermohonanPerbaikan.frx":0000
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
Attribute VB_Name = "frmIpsrsPermohonanPerbaikan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crCetakPermohonanPerbaikan
'Dim Report As New crLaporanPasienDaftar
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
    Set frmIpsrsPermohonanPerbaikan = Nothing
End Sub

Public Sub Cetak(strNorec As String, stridDirektur As String, strJabKabid As String, stridKabid As String, _
                 stridUnitkerja As String, stridKaRuangan As String, stridKaIpsrs As String, _
                 stridTeknisi As String, view As String, strUser As String)
'On Error GoTo errLoad
'On Error Resume Next
Set frmIpsrsPermohonanPerbaikan = Nothing
Set Report = New crCetakPermohonanPerbaikan
Dim adocmd As New ADODB.Command
Dim namaUser, strNamaDirektur, strNamaKabid, strNamaUK, strNamaKaR, strKaIps, strTeknisi, strJabatan, _
    Nip1, Nip2, Nip3, Nip4, Nip5, Nip6 As String
If strJabKabid <> "" Then
   strJabatan = strJabKabid
Else
   strJabatan = "Ka Bid         /Ka Bag         "
End If
If strUser <> "" Then
    namaUser = strUser
Else
    namaUser = ""
End If
            
    strSQL = " SELECT stp.norec,rg.namaruangan,convert(varchar, stp.tglplanning, 105) as tglplanning,convert(varchar, stp.tglplanning, 8) as jamplanning, " & _
             " pg.nama,stp.startdate,stp.duedate,stp.rincianexecuteplanning_askep,stp.pelapor,stp.deskripsiplanning,stp.keteranganverifikasi,sttp.namaexternal, " & _
             " stp.signdate,stp.worklist,stp.keteranganverifikasi,pg2.nama as namainspektor, pg3.nama as namapelapor,sttp.reportdisplay as statuspekerjaan, " & _
             " jpk.reportdisplay as jeniskerusakan,jpk2.reportdisplay as jenisalat, " & _
             " convert(varchar, stp.startdate, 105) as tglmulai,convert(varchar, stp.startdate, 8) as jammulai," & _
             " convert(varchar, stp.duedate, 105) as tglselesai,convert(varchar, stp.duedate, 8) as jamselesai, " & _
             " CASE WHEN pd.namaproduk IS NULL THEN '' ELSE pd.namaproduk END AS produk, " & _
             " CASE WHEN stp.qtyproduk IS NULL THEN 0 ELSE stp.qtyproduk END AS qtyproduk, " & _
             " CASE WHEN stp.nomerlaporan IS NULL THEN '     /IPSRS/     /     ' ELSE stp.nomerlaporan END AS nomerlaporan " & _
             " FROM strukplanning_t as stp " & _
             " INNER JOIN ruangan_m as rg on rg.id = stp.objectruanganfk " & _
             " LEFT JOIN pegawai_m as pg on pg.id = stp.objectpegawaipjawabfk " & _
             " LEFT JOIN pegawai_m as pg2 on pg2.id = stp.objectpegawaipjawabevaluasifk " & _
             " LEFT JOIN pegawai_m as pg3 on pg3.id = stp.narasumberfk " & _
             " LEFT JOIN statuspekerjaan_m as sttp on sttp.id = stp.objectstatuspekerjaanfk " & _
             " LEFT JOIN jenispekerjaan_m as jpk on jpk.id = stp.objectjenispekerjaanfk " & _
             " LEFT JOIN jenispekerjaan_m as jpk2 on jpk2.id = stp.objectjenisalatfk " & _
             " LEFT JOIN produk_m as pd on pd.id = stp.objectprodukfk " & _
             " WHERE stp.norec = '" & strNorec & "' AND stp.statusenabled = 1 "
             
    ReadRs strSQL
    
    If stridDirektur <> "" Then
       ReadRs2 " select pg.namalengkap,pg.nippns,jb.namajabatan " & _
                " from pegawai_m as pg " & _
                " left join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                " where pg.id = '" & stridDirektur & "'"
        
       If RS2.EOF = False Then
          strNamaDirektur = RS2!namalengkap
          Nip1 = "NIP. " & RS2!nippns
       Else
          strNamaDirektur = "-"
          Nip1 = "NIP. -"
       End If
    Else
        strNamaDirektur = "-"
        Nip1 = "NIP. -"
    End If
    
    If stridKabid <> "" Then
       ReadRs3 " select pg.namalengkap,pg.nippns,jb.namajabatan " & _
                " from pegawai_m as pg " & _
                " left join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                " where pg.id = '" & stridKabid & "'"
        
       If RS3.EOF = False Then
          strNamaKabid = RS3!namalengkap
          Nip2 = "NIP. " & RS3!nippns
       Else
          strNamaKabid = "-"
          Nip2 = "NIP. -"
       End If
    Else
        strNamaKabid = "-"
        Nip2 = "NIP. -"
    End If
    
    If stridUnitkerja <> "" Then
       ReadRs4 " select pg.namalengkap,pg.nippns,jb.namajabatan " & _
                " from pegawai_m as pg " & _
                " left join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                " where pg.id = '" & stridUnitkerja & "'"
        
       If RS4.EOF = False Then
          strNamaUK = RS4!namalengkap
          Nip3 = "NIP. " & RS4!nippns
       Else
          strNamaUK = "-"
          Nip3 = "NIP. -"
       End If
    Else
        strNamaUK = "-"
        Nip3 = "NIP. -"
    End If
    
    If stridKaRuangan <> "" Then
       ReadRs5 " select pg.namalengkap,pg.nippns,jb.namajabatan " & _
                " from pegawai_m as pg " & _
                " left join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                " where pg.id = '" & stridKaRuangan & "'"
        
       If RS5.EOF = False Then
          strNamaKaR = RS5!namalengkap
          Nip4 = "NIP. " & RS5!nippns
       Else
          strNamaKaR = "-"
          Nip4 = "NIP. -"
       End If
    Else
        strNamaKaR = "-"
        Nip4 = "NIP. -"
    End If
    
    If stridKaIpsrs <> "" Then
       ReadRs6 " select pg.namalengkap,pg.nippns,jb.namajabatan " & _
                " from pegawai_m as pg " & _
                " left join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                " where pg.id = '" & stridKaIpsrs & "'"
        
       If RS6.EOF = False Then
          strKaIps = RS6!namalengkap
          Nip5 = "NIP. " & RS6!nippns
       Else
          strKaIps = "-"
          Nip5 = "NIP. -"
       End If
    Else
        strKaIps = "-"
        Nip5 = "NIP. -"
    End If
    
    If stridTeknisi <> "" Then
       ReadRs7 " select pg.namalengkap,pg.nippns,jb.namajabatan " & _
                " from pegawai_m as pg " & _
                " left join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                " where pg.id = '" & stridTeknisi & "'"
        
       If RS7.EOF = False Then
          strTeknisi = RS7!namalengkap
          Nip6 = "NIP. " & RS7!nippns
       Else
          strTeknisi = "-"
          Nip6 = "NIP. -"
       End If
    Else
        strTeknisi = "-"
        Nip6 = "NIP. -"
    End If
    
   
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    With Report
        .database.AddADOCommand CN_String, adocmd 'rincianexecuteplanning_askep
            If Not rs.EOF Then
'                If rs!NamaProduk <> "" Then
'                   NamaProduk = rs!NamaProduk
'                End If
                .usBagian.SetUnboundFieldSource ("{ado.namaruangan}")
                .usJenisPerbaikan.SetUnboundFieldSource ("{ado.jenisalat}")
                .usJenisKerusakan.SetUnboundFieldSource ("{ado.jeniskerusakan}")
                .usKeterangan.SetUnboundFieldSource ("{ado.rincianexecuteplanning_askep}")
                .usTglTerima.SetUnboundFieldSource ("{ado.tglplanning}")
                .usJamLaporan.SetUnboundFieldSource ("{ado.jamplanning}")
                .usUnitKerja.SetUnboundFieldSource ("{ado.namaruangan}")
                .usPelapor.SetUnboundFieldSource ("{ado.namapelapor}")
                .usLaporanKerusakan.SetUnboundFieldSource ("{ado.rincianexecuteplanning_askep}")
                .usNamaBarang.SetUnboundFieldSource ("{ado.produk}")
                .usJumlah.SetUnboundFieldSource ("{ado.qtyproduk}")
                .usTindakan.SetUnboundFieldSource ("{ado.deskripsiplanning}")
                .txtTglMulai.SetText rs!tglmulai
                .txtJamMulai.SetText rs!jammulai
                .txtTglSelesai.SetText rs!tglselesai
                .txtJamSelesai.SetText rs!jamselesai
                .txtTglDiserahkan.SetText rs!tglselesai
                .txtJamDiserahkan.SetText rs!jamselesai
                .txtHasilAkhir.SetText rs!statuspekerjaan
                .txtNamaAlat.SetText rs!produk
                .txtUser.SetText strUser
                .txtNomorIpsrs.SetText rs!nomerlaporan
                
                '    TANDA TANGAN DIBAWAH INI      '
                .txtJabatanKaBid.SetText strJabatan
                .txtDirektur.SetText strNamaDirektur
                .txtNipDirektur.SetText Nip1
                .txtNamaKaBid.SetText strNamaKabid
                .txtNipKaBid.SetText Nip2
                .txtNamaUnitKerja.SetText strNamaUK
                .txtNipUnitKerja.SetText Nip3
                .txtMengetahui.SetText strNamaKaR
                .txtNipMengetahui.SetText Nip4
                .txtKaIpsrs.SetText strKaIps
                .txtNipKaIpsrs.SetText Nip5
                .txtTeknisi.SetText strTeknisi
                .txtNipTeknisi.SetText Nip6
                '    TANDA TANGAN DIBAWAH INI      '
                
                
                
                
            End If
            If view = "false" Then
                Dim strPrinter As String
                strPrinter = GetTxt("Setting.ini", "Printer", "PermohonanPerbaikan")
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
