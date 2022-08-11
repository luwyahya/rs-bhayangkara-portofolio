VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLaporanPendapatanPerDokter 
   Caption         =   "Transmedic"
   ClientHeight    =   7200
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   6240
   Icon            =   "frmLaporanPendapatanPerDokter.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7200
   ScaleWidth      =   6240
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
      Height          =   7215
      Left            =   0
      TabIndex        =   3
      Top             =   0
      Width           =   6255
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
      EnableExportButton=   0   'False
      EnableSearchExpertButton=   0   'False
      EnableHelpButton=   0   'False
   End
End
Attribute VB_Name = "frmLaporanPendapatanPerDokter"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanPendapatanPerDokter
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

    Set frmLaporanPendapatanPerDokter = Nothing
End Sub

Public Sub CetakLaporanPendapatanPerDokter(idKasir As String, tglAwal As String, tglAkhir As String, idRuangan As String, idDokter As String, idKelompok As String, namaPrinted As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmLaporanPendapatanPerDokter = Nothing
Dim adocmd As New ADODB.Command

    Dim str1 As String
    Dim str2 As String
    Dim str3 As String
    
    If idDokter <> "" Then
        str1 = "and apd.objectpegawaifk=" & idDokter & " "
    End If
    If idRuangan <> "" Then
        str2 = " and apd.objectruanganfk=" & idRuangan & " "
    End If
    If idKelompok <> "" Then
        str3 = " and kps.id=" & idKelompok & " "
    End If
    
Set Report = New crLaporanPendapatanPerDokter
    strSQL = "select apd.objectruanganfk,ru.namaruangan, apd.objectpegawaifk,pg.namalengkap,ps.nocm , " & _
             "upper(ps.namapasien) as namapasien,pd.statuspasien, " & _
             "case when pr.id =395 then pp.hargajual* pp.jumlah else 0 end as karcis, " & _
             "case when pr.id =10013116  then pp.hargajual* pp.jumlah else 0 end as embos, " & _
             "case when kp.id = 26 then pp.hargajual* pp.jumlah else 0 end as konsul, " & _
             "case when kp.id in (1,2,3,4,8,9,10,11,13,14) then pp.hargajual* pp.jumlah else 0 end as tindakan, " & _
             "(case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah as diskon, " & _
             "pd.noregistrasi,kps.kelompokpasien, " & _
             "case when cb.id = 1 or cb.id is null then '-' else 'v' end as cc, case when pd.objectkelompokpasienlastfk = 1 then '-' else 'v' end as pj , cb.id, " & _
             "case when sp.norec is null then '-' else 'v' end as verif, " & _
             "case when sbm.norec is null then '-' else 'v' end as sbm " & _
             "from pasiendaftar_t as pd " & _
             "inner JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec left JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
             "left JOIN pegawai_m as pg on pg.id=apd.objectpegawaifk left JOIN ruangan_m as ru on ru.id=apd.objectruanganfk " & _
             "inner JOIN produk_m as pr on pr.id=pp.produkfk inner JOIN detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk " & _
             "inner JOIN jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk inner JOIN kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk " & _
             "inner JOIN pasien_m as ps on ps.id=pd.nocmfk left JOIN kelompokpasien_m as kps on kps.id=pd.objectkelompokpasienlastfk " & _
             "left JOIN strukpelayanan_t as sp  on sp.noregistrasifk=pd.norec left JOIN strukbuktipenerimaan_t as sbm  on sbm.norec=sp.nosbmlastfk " & _
             "left JOIN strukbuktipenerimaancarabayar_t as sbmc  on sbmc.nosbmfk=sbm.norec left JOIN carabayar_m as cb  on cb.id=sbmc.objectcarabayarfk " & _
             "where pd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "' and djp.objectjenisprodukfk <> 97 and kps.id != '4' and kps.id != '2' " & _
             str2 & _
             str1 & _
             str3 & _
             "order by pd.noregistrasi"

   ReadRs2 "select " & _
           "sum(case when sbmc.objectcarabayarfk is not null and cb.id=1 then (pp.hargajual-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end ))*pp.jumlah else 0 end) as cash, " & _
           "sum(case when sbmc.objectcarabayarfk is not null and cb.id>1 then (pp.hargajual-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end ))*pp.jumlah else 0 end) as kk, " & _
           "sum(case when pd.objectkelompokpasienlastfk >1 and sp.norec is not null then (pp.hargajual-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end ))*pp.jumlah else 0 end) as jm " & _
           "from pasiendaftar_t pd " & _
           "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec  " & _
           "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec  " & _
           "INNER JOIN produk_m pr on pr.id=pp.produkfk " & _
           "INNER JOIN detailjenisproduk_m djp on djp.id=pr.objectdetailjenisprodukfk " & _
           "INNER JOIN pasien_m ps on ps.id=pd.nocmfk " & _
           "left JOIN strukpelayanan_t sp on sp.noregistrasifk=pd.norec " & _
           "left JOIN strukbuktipenerimaan_t sbm on sbm.norec=sp.nosbmlastfk " & _
           "left JOIN strukbuktipenerimaancarabayar_t sbmc on sbm.norec=sbmc.nosbmfk " & _
           "left JOIN carabayar_m cb on cb.id=sbmc.objectcarabayarfk " & _
           "left JOIN ruangan_m ru on ru.id=pd.objectruanganlastfk " & _
           "left JOIN pegawai_m pg on pg.id=apd.objectpegawaifk " & _
             "where pd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "' and djp.objectjenisprodukfk <> 97 " & _
             "" & str1 & " " & str2
    ReadRs3 "select pd.tglregistrasi,((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end))*ppd.jumlah) as total " & _
            "from pasiendaftar_t pd " & _
            "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
            "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
            "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec " & _
             "where pd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "' and ppd.komponenhargafk=35 " & _
             "" & str1 & " " & str2
    ReadRs4 "select pd.tglregistrasi,((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end))*ppd.jumlah) as total " & _
            "from pasiendaftar_t pd " & _
            "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
            "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
            "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec " & _
             "where pd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "' and ppd.komponenhargafk=25 " & _
             "" & str1 & " " & str2
    ReadRs5 "select " & _
            "sum(case when pd.objectkelompokpasienlastfk=1 then (pp.hargajual-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end ))*pp.jumlah else 0 end) as umum, " & _
            "sum(case when pd.objectkelompokpasienlastfk in (2,4) then (pp.hargajual-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end ))*pp.jumlah else 0 end) as bpjs, " & _
            "sum(case when pd.objectkelompokpasienlastfk=3 then (pp.hargajual-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end ))*pp.jumlah else 0 end) as asuransi, " & _
            "sum(case when pd.objectkelompokpasienlastfk=5 then (pp.hargajual-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end ))*pp.jumlah else 0 end) as perusahaan " & _
           "from pasiendaftar_t pd " & _
           "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec  " & _
           "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec  " & _
           "INNER JOIN produk_m pr on pr.id=pp.produkfk " & _
           "INNER JOIN detailjenisproduk_m djp on djp.id=pr.objectdetailjenisprodukfk " & _
           "INNER JOIN pasien_m ps on ps.id=pd.nocmfk " & _
           "left JOIN strukpelayanan_t sp on sp.noregistrasifk=pd.norec " & _
           "left JOIN strukbuktipenerimaan_t sbm on sbm.norec=sp.nosbmlastfk " & _
           "left JOIN strukbuktipenerimaancarabayar_t sbmc on sbm.norec=sbmc.nosbmfk " & _
           "left JOIN carabayar_m cb on cb.id=sbmc.objectcarabayarfk " & _
           "left JOIN ruangan_m ru on ru.id=pd.objectruanganlastfk " & _
           "left JOIN pegawai_m pg on pg.id=apd.objectpegawaifk " & _
             "where pd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "' and djp.objectjenisprodukfk <> 97 " & _
             "" & str1 & " " & str2
             
    Dim D1, D2, D3, D4 As Double
    D1 = RS5!umum
    D2 = RS5!bpjs
    D3 = RS5!asuransi
    D4 = RS5!perusahaan
    
    Dim tCash, tKk, tPj, tJm, tJR, tPm, tPR As Double
    Dim i As Integer
    
    tCash = RS2!cash
    tKk = IIf(IsNull(RS2!kk), 0, RS2!kk)
    tPj = IIf(IsNull(RS2!jm), 0, RS2!jm)
    
    tJm = 0
    tJR = 0
    tPm = 0
    tPR = 0
    For i = 0 To RS3.RecordCount - 1
        tJm = tJm + CDbl(IIf(IsNull(RS3!total), 0, RS3!total))
        If Weekday(RS3!tglRegistrasi, vbMonday) < 6 Then
            If CDate(RS3!tglRegistrasi) > CDate(Format(RS3!tglRegistrasi, "yyyy-MM-dd 07:00")) And _
                CDate(RS3!tglRegistrasi) < CDate(Format(RS3!tglRegistrasi, "yyyy-MM-dd 13:00")) Then
                tJR = tJR + CDbl(IIf(IsNull(RS3!total), 0, RS3!total))
            Else
                
            End If
        Else
'            tJm = tJm + CDbl(IIf(isnull(RS3!total), 0, RS3!total))
'            tJR = 0
        End If
    Next
    
    For i = 0 To RS4.RecordCount - 1
        tPm = tPm + CDbl(IIf(IsNull(RS4!total), 0, RS4!total))
        If Weekday(RS4!tglRegistrasi, vbMonday) < 6 Then
            If CDate(RS4!tglRegistrasi) > CDate(Format(RS4!tglRegistrasi, "yyyy-MM-dd 07:00")) And _
                CDate(RS4!tglRegistrasi) < CDate(Format(RS4!tglRegistrasi, "yyyy-MM-dd 13:00")) Then
                tPR = tPR + CDbl(IIf(IsNull(RS4!total), 0, RS4!total))
            Else
                
            End If
        Else
'            tPm = tPm + CDbl(IIf(isnull(RS4!total), 0, RS4!total))
'            tPR = 0
        End If
    Next
    
    
'    tJm = IIf(isnull(RS3!total), 0, RS3!total)
'    tPm = IIf(isnull(RS4!total), 0, RS4!total)
'
'    tJR = IIf(isnull(RS3!total), 0, RS3!total)
'    tPR = IIf(isnull(RS4!total), 0, RS4!total)
    
    Dim tAdmCc, tB3, tBPajak, tB5 As Double
    
    tAdmCc = (tKk * 3) / 100
    tB3 = tJm '+ tJR
    tJR = (tJR * 10) / 100
    tBPajak = (tB3 * 7.5) / 100
    tB5 = tB3 - tBPajak
    
    Dim tC3, tCPajak, tC5, tC7 As Double
    
    tC3 = tPm '+ tPR
    tPR = (tPR * 10) / 100
    tCPajak = (tC3 * 7.5) / 100
    tC5 = tC3 - tCPajak
    tC7 = tC5
            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtNamaKasir.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
'            .usNamaKasir.SetUnboundFieldSource ("{ado.kasir}")
            .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usNamaDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usStatusPasien.SetUnboundFieldSource ("{ado.statuspasien}")
            .ucKarcis.SetUnboundFieldSource ("{ado.karcis}")
            .ucEmbos.SetUnboundFieldSource ("{ado.embos}")
            .ucKonsul.SetUnboundFieldSource ("{ado.konsul}")
            .ucTindakan.SetUnboundFieldSource ("{ado.tindakan}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
'            .ucTotal.SetUnboundFieldSource ("{ado.kasir}")
            .usCC.SetUnboundFieldSource ("{ado.cc}")
            .usPJ.SetUnboundFieldSource ("{ado.pj}")
            .usKelompokPasien.SetUnboundFieldSource ("{ado.kelompokpasien}")
            '.usVR.SetUnboundFieldSource ("{ado.verif}")
            '.usSBM.SetUnboundFieldSource ("{ado.sbm}")
            
            .txtA1.SetText Format(tCash, "##,##0.00")
            .txtA2.SetText Format(tKk, "##,##0.00")
            .txtA3.SetText Format(tAdmCc, "##,##0.00")
            .txtA4.SetText Format(tPj, "##,##0.00")
            
            .txtB1.SetText Format(tJm, "##,##0.00")
            .txtB2.SetText Format(tJR, "##,##0.00")
            .txtB3.SetText Format(tB3, "##,##0.00")
            .txtB4.SetText Format(tBPajak, "##,##0.00")
            .txtB5.SetText Format(tB5, "##,##0.00")
            
            .txtC1.SetText Format(tPm, "##,##0.00")
            .txtC2.SetText Format(tPR, "##,##0.00")
            .txtC3.SetText Format(tC3, "##,##0.00")
            .txtC4.SetText Format(tCPajak, "##,##0.00")
            .txtC5.SetText Format(tC5, "##,##0.00")
            .txtC6.SetText Format(0, "##,##0.00")
            .txtC7.SetText Format(tC7, "##,##0.00")
            
            '.D1.SetText Format(D1, "##,##0.00")
            '.D2.SetText Format(D2, "##,##0.00")
            '.D3.SetText Format(D3, "##,##0.00")
            '.D4.SetText Format(D4, "##,##0.00")
            '.D5.SetText Format(D1 + D2 + D3 + D4, "##,##0.00")
            
            
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
