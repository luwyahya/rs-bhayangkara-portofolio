VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRLaporanPendapatan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5790
   Icon            =   "frmLaporanPendapatan.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   5790
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
   Begin VB.TextBox txtNamaFormPengirim 
      Height          =   495
      Left            =   3120
      TabIndex        =   1
      Top             =   600
      Width           =   2175
   End
End
Attribute VB_Name = "frmCRLaporanPendapatan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
    Option Explicit
Dim Report As New crLaporanPendapatan
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

    Set frmCRLaporanPendapatan = Nothing
End Sub

Public Sub CetakLaporanPendapatan(idKasir As String, tglAwal As String, tglAkhir As String, idDepartemen As String, idRuangan As String, idDokter As String, idKelompok As String, namaPrinted As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRLaporanPendapatan = Nothing
Dim adocmd As New ADODB.Command

    Dim str1, str2, str3, str4 As String
    
    If idDokter <> "" Then
        str1 = " and apd.objectpegawaifk=" & idDokter & " "
    End If
    If idDepartemen <> "" Then
        If idDepartemen = 16 Then
            str2 = " and ru.objectdepartemenfk in (16,17,26) "
        Else
            If idDepartemen <> "" Then
                str2 = " and ru.objectdepartemenfk =" & idDepartemen & " "
            End If
        End If
    End If
    If idRuangan <> "" Then
        str3 = " and apd.objectruanganfk=" & idRuangan & " "
    End If
    
    If idKelompok <> "" Then
        If idKelompok = 153 Then
            str4 = " and kps.id in (1,3,5) "
        Else
            If idKelompok <> "" Then
                str4 = " and kps.id =" & idKelompok & " "
            End If
        End If
    End If
    
    
Set Report = New crLaporanPendapatan

'    strSQL = "select distinct apd.objectruanganfk, ru.namaruangan, pg.namalengkap, ps.nocm,upper(ps.namapasien) as namapasien, kp.id as kpid, pr.id as prid, " & _
'            "case when kp.id =25 and pr.id in (395) then pp.hargajual* pp.jumlah else 0 end as karcis, " & _
'            "case when kp.id=25 and pr.id in (10013116)  then pp.hargajual* pp.jumlah else 0 end as embos, " & _
'            "case when kp.id = 26 and pr.id not in(395,10013116) then pp.hargajual* pp.jumlah else 0 end as konsul, " & _
'            "case when kp.id in (1, 2, 3, 4, 8, 9, 10, 11, 13, 14) and pr.id not in (395,10013116) then pp.hargajual* pp.jumlah else 0 end as tindakan, " & _
'            "(case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah as diskon, " & _
'            "pd.noregistrasi,kps.kelompokpasien, " & _
'            "case when pd.objectkelompokpasienlastfk > 1 then '-' else 'v' end as nonpj,case when pd.objectkelompokpasienlastfk = 1 then '-' else 'v' end as pj , case when sp.norec is null then '-' else 'v' end as verif " & _
'            "from pasiendaftar_t as pd " & _
'            "left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
'            "left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
'            "left join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec " & _
'            "left join pegawai_m as pg on pg.id=ppp.objectpegawaifk " & _
'            "left join ruangan_m as ru on ru.id=apd.objectruanganfk " & _
'            "left join produk_m as pr on pr.id=pp.produkfk left join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk " & _
'            "left join jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk left join kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk " & _
'            "left join pasien_m as ps on ps.id=pd.nocmfk " & _
'            "left join kelompokpasien_m as kps on kps.id=pd.objectkelompokpasienlastfk " & _
'            "left join strukpelayanan_t as sp on sp.norec=pp.strukfk " & _
'             "where pd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "' and djp.objectjenisprodukfk <> 97 and ppp.objectjenispetugaspefk=4 and  sp.statusenabled is null " & _
'             str1 & _
'             str2 & _
'             str3 & _
'             str4 & _
'             "order by pd.noregistrasi"

 strSQL = "select * from (select sp.statusenabled, apd.objectruanganfk, ru.namaruangan, pg.namalengkap, ps.nocm,upper(ps.namapasien) as namapasien, kp.id as kpid, pr.id as prid, " & _
            "case when kp.id =25 and pr.id in (395) then pp.hargajual* pp.jumlah else 0 end as karcis, " & _
            "case when kp.id=25 and pr.id in (10013116)  then pp.hargajual* pp.jumlah else 0 end as embos, " & _
            "case when kp.id = 26 and pr.id not in(395,10013116) then pp.hargajual* pp.jumlah else 0 end as konsul, " & _
            "case when kp.id in (1, 2, 3, 4, 8, 9, 10, 11, 13, 14) and pr.id not in (395,10013116) then pp.hargajual* pp.jumlah else 0 end as tindakan, " & _
            "(case when pp.hargadiscount is null then 0 else pp.hargadiscount end)* pp.jumlah as diskon, " & _
            "pd.noregistrasi,kps.kelompokpasien, " & _
            "case when pd.objectkelompokpasienlastfk > 1 then '-' else 'v' end as nonpj,case when pd.objectkelompokpasienlastfk = 1 then '-' else 'v' end as pj , case when sp.norec is null then '-' else 'v' end as verif " & _
            "from pasiendaftar_t as pd " & _
            "left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
            "left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
            "left join pegawai_m as pg on pg.id=apd.objectpegawaifk " & _
            "left join ruangan_m as ru on ru.id=apd.objectruanganfk " & _
            "left join produk_m as pr on pr.id=pp.produkfk left join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk " & _
            "left join jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk left join kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk " & _
            "left join pasien_m as ps on ps.id=pd.nocmfk " & _
            "left join kelompokpasien_m as kps on kps.id=pd.objectkelompokpasienlastfk " & _
            "left join strukpelayanan_t as sp on sp.norec=pp.strukfk " & _
             "where apd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "' and djp.objectjenisprodukfk <> 97 " & _
             str1 & _
             str2 & _
             str3 & _
             str4 & _
             ")as x where x.statusenabled is null"


    ReadRs3 "select * from (select sp.statusenabled, pd.tglregistrasi,((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end))*pp.jumlah) as total " & _
            "from pasiendaftar_t pd " & _
            "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec left JOIN kelompokpasien_m as kps on kps.id=pd.objectkelompokpasienlastfk " & _
            "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
            "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec left join produk_m as pr on pr.id=pp.produkfk left join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk left join ruangan_m as ru on ru.id=apd.objectruanganfk left join strukpelayanan_t as sp on sp.norec=pp.strukfk " & _
             "where apd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "' and ppd.komponenhargafk=35 and djp.objectjenisprodukfk <> 97 " & _
             "" & str1 & " " & str2 & str3 & str4 & _
             ") as x where x.statusenabled is null"
             
    ReadRs4 "select * from (select sp.statusenabled, pd.tglregistrasi,((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end))*pp.jumlah) as total " & _
            "from pasiendaftar_t pd " & _
            "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec left JOIN kelompokpasien_m as kps on kps.id=pd.objectkelompokpasienlastfk " & _
            "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
            "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec left join produk_m as pr on pr.id=pp.produkfk left join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk  left join ruangan_m as ru on ru.id=apd.objectruanganfk left join strukpelayanan_t as sp on sp.norec=pp.strukfk " & _
             "where apd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "' and ppd.komponenhargafk=25 and djp.objectjenisprodukfk <> 97   and  sp.statusenabled is null " & _
             "" & str1 & " " & str2 & str3 & str4 & _
             ") as x where x.statusenabled is null"
             
Dim tCash, tKk, tPj, tJm, tJR, tPm, tPR As Double
    Dim i As Integer
    
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
        RS3.MoveNext
        
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
        RS4.MoveNext
    Next
    
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
            .usNoCM.SetUnboundFieldSource ("{ado.nocm}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .ucKarcis.SetUnboundFieldSource ("{ado.karcis}")
            .ucEmbos.SetUnboundFieldSource ("{ado.embos}")
            .ucKonsul.SetUnboundFieldSource ("{ado.konsul}")
            .ucTindakan.SetUnboundFieldSource ("{ado.tindakan}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .usCC.SetUnboundFieldSource ("{ado.NonPj}")
            .usPJ.SetUnboundFieldSource ("{ado.pj}")
            .usKelompokPasien.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usVR.SetUnboundFieldSource ("{ado.verif}")

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
    MsgBox Err.Number & " " & Err.Description
End Sub
