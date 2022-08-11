VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRLaporanRekapRetur 
   Caption         =   "Transmedic"
   ClientHeight    =   7200
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5775
   Icon            =   "frmCRLaporanRekapRetur.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7200
   ScaleWidth      =   5775
   WindowState     =   2  'Maximized
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
      TabIndex        =   3
      Top             =   600
      Width           =   2775
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
      Left            =   3720
      TabIndex        =   2
      Top             =   600
      Width           =   975
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
      Left            =   4680
      TabIndex        =   1
      Top             =   600
      Width           =   1095
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   7215
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   5775
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
      EnableSelectExpertButton=   0   'False
      EnableToolbar   =   -1  'True
      DisplayBorder   =   -1  'True
      DisplayTabs     =   -1  'True
      DisplayBackgroundEdge=   -1  'True
      SelectionFormula=   ""
      EnablePopupMenu =   -1  'True
      EnableExportButton=   -1  'True
      EnableSearchExpertButton=   0   'False
      EnableHelpButton=   0   'False
   End
End
Attribute VB_Name = "frmCRLaporanRekapRetur"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crDetailReturObatAlkes
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

    Set frmCRLaporanRekapRetur = Nothing
End Sub


Public Sub Cetak(a As String, tglAwal As String, tglAkhir As String, namaPrinted As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRLaporanRekapRetur = Nothing
Dim adocmd As New ADODB.Command
    Dim str1 As String
    Dim str2 As String
    Dim str3 As String
    
'    If idPegawai <> "" Then
'        str1 = "and pg.id=" & idPegawai & " "
'    End If
'    If idRuangan <> "" Then
'        str2 = " and ru.id=" & idRuangan & " "
'    End If
    
Set Report = New crDetailReturObatAlkes
    strSQL = "select srt.tglretur, srt.noretur, pd.noregistrasi, ps.nocm, ps.namapasien,rup.namaruangan as ruangan, " & _
            "kps.kelompokpasien, pg.namalengkap, ru.namaruangan as namaruangan, srt.norec, srt.keteranganlainnya, " & _
            "spd.tglpelayanan, spd.rke,jkm.jeniskemasan,pr.id as idproduk,pr.namaproduk, " & _
            "ss.satuanstandar,spd.jumlah,spd.hargajual,spd.hargadiscount, " & _
            "spd.jasa,((spd.hargasatuan-spd.hargadiscount)*spd.jumlah)+spd.jasa as total " & _
            "from strukretur_t as srt " & _
            "left join strukresep_t as sr on sr.norec = srt.strukresepfk " & _
            "INNER JOIN pelayananpasienretur_t as spd on spd.strukreturfk = srt.norec " & _
            "INNER JOIN produk_m as pr on pr.id=spd.produkfk " & _
            "INNER JOIN jeniskemasan_m as jkm on jkm.id=spd.jeniskemasanfk " & _
            "INNER JOIN satuanstandar_m as ss on ss.id=spd.satuanviewfk " & _
            "left join antrianpasiendiperiksa_t as apd on apd.norec = sr.pasienfk " & _
            "left join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk " & _
            "left join pasien_m as ps on ps.id = pd.nocmfk " & _
            "left join kelompokpasien_m as kps  on kps.id=pd.objectkelompokpasienlastfk " & _
            "left join ruangan_m as rup on rup.id = pd.objectruanganlastfk " & _
            "left join pegawai_m as pg on pg.id = srt.objectpegawaifk " & _
            "left join ruangan_m as ru on ru.id = srt.objectruanganfk " & _
            "where srt.tglretur BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' and srt.statusenabled = 't' " & _
            "order by srt.noretur asc"
            
'            "left join pegawai_m as pg3 on pg3.id = lu.objectpegawaifk inner JOIN ruangan_m as ru on ru.id=sp.objectruanganfk  " & _
'            "where sp.tglstruk BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
'            str1 & _
'            str2 & _
'            str3 & " order by sp.nostruk"
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtPrinted.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
'            .txtNamaUser.SetText namaPrinted
            .udtTanggal.SetUnboundFieldSource ("{ado.tglretur}")
            .usNoRetur.SetUnboundFieldSource ("{ado.noretur}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usNamaUser.SetUnboundFieldSource ("{ado.namalengkap}")
            .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .unIDProduk.SetUnboundFieldSource ("{ado.idproduk}")
            .usNamaProduk.SetUnboundFieldSource ("{ado.namaproduk}")
            .usSatuan.SetUnboundFieldSource ("{ado.satuanstandar}")
            .ucQty.SetUnboundFieldSource ("{ado.jumlah}")
            '.ucJasa.SetUnboundFieldSource ("{ado.jasa}")
            .ucDiskon.SetUnboundFieldSource ("{ado.hargadiscount}")
            .ucHarga.SetUnboundFieldSource ("{ado.hargajual}")
            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            .usJenisRacikan.SetUnboundFieldSource ("{ado.jeniskemasan}")
'            .usJK.SetUnboundFieldSource ("{ado.jeniskelamin}")
'            .usKelTransaksi.SetUnboundFieldSource ("{ado.kelompokpasien}")
            
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenjualanHarianFarmasi")
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
