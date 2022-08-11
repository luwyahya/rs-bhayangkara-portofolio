VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRPemakaianVaksin 
   Caption         =   "Transmedic"
   ClientHeight    =   7200
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5745
   Icon            =   "frmCRPemakaianVaksin.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7200
   ScaleWidth      =   5745
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
Attribute VB_Name = "frmCRPemakaianVaksin"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crDetailPemkaianVaksin
Dim Reports As New crRekapPemkaianVaksin
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
    Reports.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    Report.PrintOut False
    Reports.PrintOut False
End Sub

Private Sub CmdOption_Click()
    Report.PrinterSetup Me.hwnd
    Reports.PrinterSetup Me.hwnd
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

    Set frmCRPemakaianVaksin = Nothing
End Sub


Public Sub CetakDetail(a As String, tglAwal As String, tglAkhir As String, namaPrinted As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRPemakaianVaksin = Nothing
Dim adocmd As New ADODB.Command

Set Report = New crDetailPemkaianVaksin
    strSQL = "select to_char(pp.tglpelayanan,'DD-MM-YYYY HH24:MI')as tanggal, " & _
            "pro.id as idBarang, pro.kdproduk as kdBarang,pro.namaproduk as namavaksin, " & _
            "ss.satuanstandar,pp.hargajual as harga,sum(case when pp.jumlah is null then 0 else pp.jumlah end)as qty, " & _
            "sum(case when pp.jumlah is null then 0 else pp.jumlah end * pp.hargajual )as total, " & _
            "pd.noregistrasi, ps.nocm, ps.namapasien,to_char(ps.tgllahir,'dd-MM-yyyy')as tgllahir,case when jk.id = 1 then 'L' else 'P' end as jeniskelamin,al.alamatlengkap,ps.namaibu, " & _
            "pg.namalengkap as dokter,kp.kelompokpasien,dp.namadepartemen,ru.namaruangan " & _
            "from pasiendaftar_t as pd left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
            "left join ruangan_m as ru on ru.id = apd.objectruanganfk left join departemen_m as dp on dp.id=ru.objectdepartemenfk " & _
            "left join pasien_m as ps on ps.id = pd.nocmfk left join alamat_m as al on al.nocmfk= ps.id " & _
            "left join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk left join kelompokpasien_m as kp on kp.id=pd.objectkelompokpasienlastfk " & _
            "left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec left join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec " & _
            "left join pegawai_m as pg on pg.id=ppp.objectpegawaifk left join produk_m as pro on pro.id = pp.produkfk left join satuanstandar_m as ss on ss.id=pro.objectsatuanstandarfk " & _
            "where pp.tglpelayanan BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
            "and pro.id in(10017198,10017199,18861,9,10016288,10016290,10016287,10016289,18860,8,10012693,10021175,18668,18866,20,8,100217790,18858,1002115441,1002116843,10017482,1002116846,11021175,18669,18867,19,18863,1002116795,18670,403530,10021330,10021331,10021332,1002115586) " & _
            "group by pro.id,ru.namaruangan,ru.objectdepartemenfk,pd.noregistrasi,ps.namapasien,ps.tgllahir,ps.namaibu,kp.kelompokpasien,ps.nocm,ss.satuanstandar , al.alamatlengkap, pro.kdproduk, pp.hargajual, pp.tglpelayanan, jk.id, dp.namadepartemen, pg.namalengkap " & _
            "order by pro.namaproduk desc"
            
'             "(case when pro.id=10017198 then 'HB - O INJ' when pro.id=10017199 then 'HB - O INJ' when pro.id=18861 then 'HB - O INJ' when pro.id=3 then 'PENTABIO SINGLE DOSE INJ' " & _
'            "when pro.id=18858 then 'PENTABIO MULTI DOSE INJ' when pro.id=9 then 'BCG INJ + PELARUT' when pro.id=10021187 then 'Vaksin DTP-HB-Hib multi dose Injeksi' when pro.id=10016288 then 'DPT,HIB,POLIO INJ' " & _
'            "when pro.id=10016290 then 'DPT,HIB,POLIO INJ' when pro.id=10016287 then 'DPT,HIB,Polio Injeksi' when pro.id=10016289 then 'DPT, HIB, Polio injeksi Injeksi' when pro.id=18860 then 'DPT,HIB,POLIO INJ (GENERIK BERMERK)' " & _
'            "when pro.id=8 then 'VACCIN POLIO bOPV' when pro.id=10012693 then 'VACCIN POLIO bOPV' when pro.id=10021175 then 'VACCIN POLIO bOPV' when pro.id=18668 then 'VACCIN POLIO (ORAL)' " & _
'            "when pro.id=18866 then 'VACC. POLIO (oral)' when pro.id=20 then 'Vaksin Polio (Oral)' when pro.id=100217790 then 'VAKSIN MR' when pro.id=1002115441 then 'VAKSIN MR' " & _
'            "when pro.id=1002116843 then 'VACCIN IPV INJ' when pro.id=10017482 then 'INFANRIX IPV-HIB' when pro.id =1002116846 then 'VACCIN JERAP Td 5 ML' when pro.id=11021175 then 'VACCIN JERAP TD. 5ML (MULTIDOSE)' " & _
'            "when pro.id =18669 then 'VACCIN TT' when pro.id=18867 then 'VACCIN T.T (TETANUS TOXOID) donasi' when pro.id =19 then 'VACC CAMPAK + PELARUT' when pro.id=18863 then 'VACC. CAMPAK + PELARUT' " & _
'            "when pro.id =1002116795 then 'VACCIN CAMPAK INJ' when pro.id=18670 then 'VAKSIN CAMPAK' when pro.id =403530 then 'VAKSIN CAMPAK E' when pro.id=10021330 then 'VIRUS CAMPAK HIDUP, KANAMYCIN,ERITR. INJ' " & _
'            "when pro.id =10021331 then 'VIRUS CAMPAK HIDUP, KANAMYCIN,ERITR. INJ' when pro.id=10021332 then 'Virus campak, kanamycin, eritromisin Inj' end) as namavaksin,
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtPrinted.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .udTanggal.SetUnboundFieldSource ("{ado.tanggal}")
            .usIdProduk.SetUnboundFieldSource ("{ado.idbarang}")
            .uskdproduk.SetUnboundFieldSource ("{ado.kdbarang}")
            .usNamaProduk.SetUnboundFieldSource ("{ado.namavaksin}")
            .usSatuan.SetUnboundFieldSource ("{ado.satuanstandar}")
            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
            .usJK.SetUnboundFieldSource ("{ado.jeniskelamin}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
            .usNamaIbu.SetUnboundFieldSource ("{ado.namaibu}")
            .usDokter.SetUnboundFieldSource ("{ado.dokter}")
            .usKelompok.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .ucQty.SetUnboundFieldSource ("{ado.qty}")
            .ucHarga.SetUnboundFieldSource ("{ado.harga}")
            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            
            
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

Public Sub cetakRekap(a As String, tglAwal As String, tglAkhir As String, namaPrinted As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRPemakaianVaksin = Nothing
Dim adocmd As New ADODB.Command

Set Reports = New crRekapPemkaianVaksin
    strSQL = "select ru.namaruangan, " & _
            "sum(case when pro.id=10017198 then pp.jumlah else 0 end) as vks1,sum(case when pro.id=10017199 then pp.jumlah else 0 end) as vks2, " & _
            "sum(case when pro.id=18861 then pp.jumlah else 0 end) as vks3,sum(case when pro.id=3 then pp.jumlah else 0 end) as vks4, " & _
            "sum(case when pro.id=18858 then pp.jumlah else 0 end) as vks5,sum(case when pro.id=9 then pp.jumlah else 0 end) as vks6, " & _
            "sum(case when pro.id=10021187 then pp.jumlah else 0 end) as vks7,sum(case when pro.id in (10016288) then pp.jumlah else 0 end) as vks8, " & _
            "sum(case when pro.id=10016290 then pp.jumlah else 0 end) as vks9,sum(case when pro.id in (10016287) then pp.jumlah else 0 end) as vks10, " & _
            "sum(case when pro.id=10016289 then pp.jumlah else 0 end) as vks11,sum(case when pro.id in (18860) then pp.jumlah else 0 end) as vks12, " & _
            "sum(case when pro.id=8 then pp.jumlah else 0 end) as vks13, sum(case when pro.id in (10012693) then pp.jumlah else 0 end) as vks14, " & _
            "sum(case when pro.id=10021175 then pp.jumlah else 0 end) as vks15,sum(case when pro.id in (18668) then pp.jumlah else 0 end) as vks16, " & _
            "sum(case when pro.id=18866 then pp.jumlah else 0 end) as vks17, " & _
            "sum(case when pro.id=20 then pp.jumlah else 0 end) as vks18, " & _
            "sum(case when pro.id=100217790 then pp.jumlah else 0 end) as vks19, " & _
            "sum(case when pro.id=1002115441 then pp.jumlah else 0 end) as vks20, " & _
            "sum(case when pro.id=1002115586 then pp.jumlah else 0 end) as vks21, " & _
            "sum(case when pro.id=1002116843 then pp.jumlah else 0 end) as vks22, " & _
            "sum(case when pro.id=10017482 then pp.jumlah else 0 end) as vks23 " & _
            "from pasiendaftar_t as pd " & _
            "left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
            "left join ruangan_m as ru on ru.id = apd.objectruanganfk " & _
            "left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
            "left join produk_m as pro on pro.id = pp.produkfk " & _
            "where pp.tglpelayanan BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
            "and pro.id in(10017198,10017199,18861,9,10016288,10016290,10016287,10016289,18860,8,10012693,10021175,18668,18866,20,8,100217790,18858,1002115441,1002116843,10017482,1002115586) " & _
            "group by ru.namaruangan"
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reports
        .database.AddADOCommand CN_String, adocmd
            .txtPrinted.SetText namaPrinted
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .un1.SetUnboundFieldSource ("{ado.vks1}")
            .un2.SetUnboundFieldSource ("{ado.vks2}")
            .un3.SetUnboundFieldSource ("{ado.vks3}")
            .un4.SetUnboundFieldSource ("{ado.vks4}")
            .un5.SetUnboundFieldSource ("{ado.vks5}")
            .un6.SetUnboundFieldSource ("{ado.vks6}")
            .un7.SetUnboundFieldSource ("{ado.vks7}")
            .un8.SetUnboundFieldSource ("{ado.vks8}")
            .un9.SetUnboundFieldSource ("{ado.vks9}")
            .un10.SetUnboundFieldSource ("{ado.vks10}")
            .un11.SetUnboundFieldSource ("{ado.vks11}")
            .un12.SetUnboundFieldSource ("{ado.vks12}")
            .un13.SetUnboundFieldSource ("{ado.vks13}")
            .un14.SetUnboundFieldSource ("{ado.vks14}")
            .un15.SetUnboundFieldSource ("{ado.vks15}")
            .un16.SetUnboundFieldSource ("{ado.vks16}")
            .un17.SetUnboundFieldSource ("{ado.vks17}")
            .un18.SetUnboundFieldSource ("{ado.vks18}")
            .un19.SetUnboundFieldSource ("{ado.vks19}")
            .un20.SetUnboundFieldSource ("{ado.vks20}")
            .un21.SetUnboundFieldSource ("{ado.vks21}")
            .un22.SetUnboundFieldSource ("{ado.vks22}")
            .un23.SetUnboundFieldSource ("{ado.vks23}")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenjualanHarianFarmasi")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reports
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
