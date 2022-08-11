VERSION 5.00
Begin VB.Form frmKasir 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Kasir"
   ClientHeight    =   1035
   ClientLeft      =   45
   ClientTop       =   375
   ClientWidth     =   4005
   Icon            =   "frmKasir.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   1035
   ScaleWidth      =   4005
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmKasir"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Public Function kasir(ByVal QueryText As String) As Byte()
On Error Resume Next
    Dim Root As JNode
    Dim Param1() As String
    Dim Param2() As String
    Dim Param3() As String
    Dim Param4() As String
    Dim Param5() As String
    Dim Param6() As String
    Dim Param7() As String
    Dim Param8() As String
    Dim Param9() As String
    Dim Param10() As String
    Dim Param11() As String
    Dim Param12() As String
    Dim Param13() As String
    Dim Param14() As String
    Dim arrItem() As String
'    QueryText = "cetak-kwitansiv2=1&noregistrasi=RV-21040002298&idPegawai=1&STD=&view=false"
   If cn.State = adStateClosed Then Call openConnection
    
    If Len(QueryText) > 0 Then
    
        arrItem = Split(QueryText, "&")
        Param1 = Split(arrItem(0), "=")
        Param2 = Split(arrItem(1), "=")
        Param3 = Split(arrItem(2), "=")
        Param4 = Split(arrItem(3), "=")
        Param5 = Split(arrItem(4), "=")
        Param6 = Split(arrItem(5), "=")
        Param7 = Split(arrItem(6), "=")
        Param8 = Split(arrItem(7), "=")
        Param9 = Split(arrItem(8), "=")
        Param10 = Split(arrItem(9), "=")
        Param11 = Split(arrItem(10), "=")
        Param12 = Split(arrItem(11), "=")
        

        Select Case Param1(0)
            Case "cetak-billing"
                Call frmCRCetakBilling.CetakBilling(Param2(1), Val(Param1(1)), Param3(1))
                Set Root = New JNode
                Root("Status") = "Cetak Billing!!"
                '127.0.0.1:1237/printvb/kasir?cetak-billing=1&noregistrasi=1707000053&view=false
            
            Case "cetak-kwitansi"
                Call frmCRCetakKuitansiPasien.CetakUlangJenisKuitansi(Param2(1), Val(Param1(1)), Param3(1))
                Set Root = New JNode
                Root("Status") = "Cetak Kwitansi"
                '127.0.0.1:1237/printvb/kasir?cetak-kwitansi=1&noregistrasi=1708000446&view=false
            
            Case "cetak-kwitansiv2"
           
                Param4 = Split(arrItem(3), "=")
                Call frmCRCetakKuitansiPasienV2.CetakUlangJenisKuitansi(Param2(1), Val(Param1(1)), Param3(1), Param4(1), Param5(1))
                Set Root = New JNode
                Root("Status") = "Cetak Kwitansi"
                '127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=1708000446&strIdPegawai=1&view=false
                
            Case "cetak-kwitansiv2-kembali-deposit"
                Param4 = Split(arrItem(3), "=")
                Call frmCRCetakKuitansiPasienV2.CetakUlangJenisKuitansi(Param2(1), Val(Param1(1)), Param3(1), Param4(1), Param5(1))
                Call frmCRCetakKuitansiPasienV2.CetakUlangJenisKuitansi(Param6(1), Val(Param1(1)), Param3(1), Param4(1), Param5(1))
                Set Root = New JNode
                Root("Status") = "Cetak Kwitansi"
                '127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=1708000446&strIdPegawai=1&view=false
            
            Case "cetak-kip"
                Param4 = Split(arrItem(3), "=")
                Call frmCRCetakKIP.CetakKIP(Param2(1), Val(Param1(1)), Param3(1), Param4(1), Param5(1))
                Set Root = New JNode
                Root("Status") = "Cetak Kwitansi"
                '127.0.0.1:1237/printvb/kasir?cetak-kip=1&noregistrasi=1708000446&strIdPegawai=1&view=false
                
             Case "cetak-kip-pasien"
                Param4 = Split(arrItem(3), "=")
                Call frmCRKIP.CetakKIP(Param2(1), Val(Param1(1)), Param3(1), Param4(1))
                Set Root = New JNode
                Root("Status") = "Cetak Kartu Pulang Pasien"
                '127.0.0.1:1237/printvb/kasir?cetak-kip=1&noregistrasi=1708000446&strIdPegawai=1&view=false
            
            Case "cetak-LaporanPasienPulang"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
'               Call frmCRCetakLaporanPasienPulang2.CetakLaporanPasienPulang(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Call frmCRCetakLaporanPasienPulangTemp.CetakLaporanPasienPulang(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param1(1))
                
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Pasien Pulang"
                '127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-08%2023:59:59&strIdRuangan=18&strIdKelompokPasien=1&strIdPegawai=1&view=true
            
'            Case "cetak-LaporanTagihanPenjamin"
'                Call frmCRLaporanTagihanPenjamin.CetakLaporanTagihanPenjamin(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
'                Set Root = New JNode
'                Root("Status") = "Cetak Laporan Tagihan Penjamin"
'                '127.0.0.1:1237/printvb/kasir?cetak-LaporanPasienPulang=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-08%2023:59:59&strIdRuangan=18&strIdKelompokPasien=1&strIdPegawai=1&view=true
            
            Case "cetak-LaporanPendapatanRuangan"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Call frmCRCetakLaporanPendapatanRuangan.CetakLaporanPendapatanRuangan(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Pendapatan Ruangan"
                '127.0.0.1:1237/printvb/kasir?cetak-LaporanPendapatanRuangan=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-08%2023:59:59&strIdRuangan=18&strIdKelompokPasien=1&strIdPegawai=1&view=true
            
            Case "cetak-RincianBiaya"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Call frmCRCetakRincianBiaya.CetakRincianBiaya(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
                '127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=1707000166&strNoStruk=S000000159&strNoKwitansi=RV-17080000002&strIdPegawai=1&view=true
                '127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=&strNoStruk=S000000168&strNoKwitansi=&strIdPegawai=1&view=true
            
            Case "cetak-RincianBiaya-kelas-dijamin"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Call frmCRCetakRincianBiaya_kelasdijamin.CetakRincianBiaya(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
                '127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=1707000166&strNoStruk=S000000159&strNoKwitansi=RV-17080000002&strIdPegawai=1&view=true
                '127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=&strNoStruk=S000000168&strNoKwitansi=&strIdPegawai=1&view=true
            
            Case "cetak-LaporanPendapatanRuanganDetail"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Call frmCRCetakLaporanPendapatanRuanganDetail.CetakLaporanPendapatanRuanganDetail(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Pendapatan Ruangan Detail"
                '127.0.0.1:1237/printvb/kasir?cetak-LaporanPendapatanRuanganDetail=1&tglAwal=2017-08-01%2000:00:00&tglAkhir=2017-09-08%2023:59:59&strIdRuangan=18&strIdKelompokPasien=1&strIdPegawai=1&view=true
            
            Case "cetak-laporan-penerimaan"
                Call frmCRLaporanPenerimaan.CetakLaporanPenerimaan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
                'http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan=403&tglAwal=2017-09-02&tglAkhir=2017-09-02&idRuangan=&idDokter=&view=true
            
            Case "cetak-laporan-penerimaan-ffs"
                Call frmCRLaporanPenerimaanFFS.CetakLaporanPenerimaan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
                'http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan=403&tglAwal=2017-09-02&tglAkhir=2017-09-02&idRuangan=&idDokter=&view=true
            
            Case "cetak-laporan-penerimaan-remun"
                Call frmCRLaporanPenerimaanRemun.CetakLaporanPenerimaan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
                'http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan=403&tglAwal=2017-09-02&tglAkhir=2017-09-02&idRuangan=&idDokter=&view=true
            
            Case "cetak-rekap-penerimaan"
                Call frmRekapPenerimaan.CetakRekapPenerimaan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rekap Penerimaan Kasir"
                Root("by") = "as@epic"
'                http://127.0.0.1:1237/printvb/kasir?cetak-rekap-penerimaan=403&tglAwal=2017-09-02&tglAkhir=2017-09-02&idRuangan=&idDokter=&namaKasir=DADAn&view=true
                
            Case "cetak-laporan-pendapatan"
                If cn.State = adStateClosed Then Call openConnection
                Call frmCRLaporanPendapatan.CetakLaporanPendapatan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
                '127.0.0.1:1237/printvb/kasir?cetak-laporan-pendapatan=403&tglAwal=2017-09-02&tglAkhir=2017-09-02&view=false
            
            Case "cetak-laporan-pendapatan-perdokter"
                If cn.State = adStateClosed Then Call openConnection
                Call frmLaporanPendapatanPerDokter.CetakLaporanPendapatanPerDokter(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
                '127.0.0.1:1237/printvb/kasir?cetak-laporan-pendapatan=403&tglAwal=2017-09-02&tglAkhir=2017-09-02&view=false
              
            Case "cetak-laporan-pendapatan-ffs"
                If cn.State = adStateClosed Then Call openConnection
                Call frmCRLaporanPendapatanFFS.CetakLaporanPendapatan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
                '127.0.0.1:1237/printvb/kasir?cetak-laporan-pendapatan=403&tglAwal=2017-09-02&tglAkhir=2017-09-02&view=false
              
            Case "cetak-laporan-pendapatan-remun"
                If cn.State = adStateClosed Then Call openConnection
                Call frmCRLaporanPendapatanRemun.CetakLaporanPendapatan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
                '127.0.0.1:1237/printvb/kasir?cetak-laporan-pendapatan=403&tglAwal=2017-09-02&tglAkhir=2017-09-02&view=false
            
            Case "cetak-rekap-pendapatan"
                Call frmRekapPendapatan.CetakRekapPendapatan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rekap Penerimaan Kasir"
                Root("by") = "as@epic"
                '127.0.0.1:1237/printvb/kasir?cetak-rekap-pendapatan=403&tglAwal=2017-09-02&tglAkhir=2017-09-02&view=false
                
            Case "cetak-rekap-pendapatan-keuangan"
                Call frmRekapPendapatanKeuangan.CetakRekapPendapatanKeuangan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rekap Pendapatan"
                Root("by") = "as@epic"
                '127.0.0.1:1237/printvb/kasir?cetak-rekap-pendapatan=403&tglAwal=2017-09-02&tglAkhir=2017-09-02&view=false
                
            Case "cetak-laporan-penerimaan-kasir"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Param10 = Split(arrItem(9), "=")
                Call frmCRLaporanPenerimaanKasir.CetakLaporanPenerimaanKasir(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
                'http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan=403&tglAwal=2017-09-02&tglAkhir=2017-09-02&idRuangan=&idDokter=&view=true
            
            Case "cetak-laporan-penerimaan-kasir-perusahaan"
                Call frmLaporanPenerimaanKasirPerusahaan.CetakLaporanPenerimaanKasirPerusahaan(Param1(1), Param2(1), Param3(1), Param6(1), Param5(1), Param4(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir Perusahaan"
                Root("by") = "as@epic"
                'http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan=403&tglAwal=2017-09-02&tglAkhir=2017-09-02&idRuangan=&idDokter=&view=true
                
             Case "cetak-laporan-ffs-gawatdarurat"
                Call frmCRLaporanffsIGD.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan"
                Root("by") = "as@epic"
                
              
             Case "cetak-rekap-ffs-gawatdarurat"
                Call frmCRRekapffsIGD.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan"
                Root("by") = "as@epic"
                
             Case "cetak-laporan-ffs-ranap"
                Call frmCRLaporanffsRI.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan"
                Root("by") = "as@epic"
                
              
             Case "cetak-rekap-ffs-ranap"
                Call frmCRRekapffsRI.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan"
                Root("by") = "as@epic"
                
             Case "cetak-laporan-ffs-bedah"
                If Param7(1) = 1 Then
                    Call frmCRLaporanffsIBS.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Laporan"
                    Root("by") = "as@epic"
                ElseIf Param7(1) = 2 Then
                    Call frmLaporanffsIBSAnes.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Laporan"
                    Root("by") = "as@epic"
                ElseIf Param7(1) = 3 Then
                    Call frmLaporanffsIBSAsist.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Laporan"
                    Root("by") = "as@epic"
                End If
              
             Case "cetak-rekap-ffs-bedah"
                'Call frmCRRekapffsIBS.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                'Set Root = New JNode
                'Root("Status") = "Cetak Laporan"
                'Root("by") = "as@epic"
                If Param7(1) = 1 Then
                    Call frmCRRekapffsIBS.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Laporan"
                    Root("by") = "as@epic"
                ElseIf Param7(1) = 2 Then
                    Call frmRekapffsIBSAnes.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Laporan"
                    Root("by") = "as@epic"
                ElseIf Param7(1) = 3 Then
                    Call frmRekapffsIBSAsist.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Laporan"
                    Root("by") = "as@epic"
                End If
              
             Case "cetak-laporan-pendapatan-adminmaterai"
                Call frmCRLaporanPendapatanAdminMaterai.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan"
                Root("by") = "as@epic"
                
             Case "cetak-laporan-ffs-penunjangRad"
                Call frmCRLaporanffsPenunjangRad.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan"
                Root("by") = "as@epic"
                
              
             Case "cetak-rekap-ffs-penunjangRad"
                Call frmCRRekapffsPenunjangRad.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan"
                Root("by") = "as@epic"
                
             Case "cetak-laporan-ffs-penunjang"
                Call frmCRLaporanffsPenunjang.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan"
                Root("by") = "as@epic"
                
              
             Case "cetak-rekap-ffs-penunjang"
                Call frmCRRekapffsPenunjang.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan"
                Root("by") = "as@epic"
                
            Case "cetak-RekapBiaya" 'rincian tanpa keterangan di bawah
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Call frmCRCetakRekapBiaya.CetakRincianBiaya(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
                '127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=1707000166&strNoStruk=S000000159&strNoKwitansi=RV-17080000002&strIdPegawai=1&view=true
                '127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=&strNoStruk=S000000168&strNoKwitansi=&strIdPegawai=1&view=true

            Case "cetak-RekapBiayaPelayanan" 'rekap bpjs
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Call frmCRCetakRekapBilling.CetakRincianBiaya(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
                '127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=1707000166&strNoStruk=S000000159&strNoKwitansi=RV-17080000002&strIdPegawai=1&view=true
                '127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=&strNoStruk=S000000168&strNoKwitansi=&strIdPegawai=1&view=true
             
             Case "xxx"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Call frmCRCetakRincianBiayaBPJS.CetakRincianBiaya(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
                '127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=1707000166&strNoStruk=S000000159&strNoKwitansi=RV-17080000002&strIdPegawai=1&view=true
                '127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=&strNoStruk=S000000168&strNoKwitansi=&strIdPegawai=1&view=true
            
            Case "cetak-suratTagihanDeposit"
                Call frmCRSuratTagihanDeposit.Cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan"
                Root("by") = "as@epic"
                
            Case "cetak-setoranKasir"
                Call frmCRSetoranKasir.Cetak(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan"
                Root("by") = "as@epic"
                        
            Case "cetak-laporan-penerimaan-pertransaksi"
                Call frmCRLaporanPenerimaanPertransaksi.CetakLaporanPenerimaanPertransaksi(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
                'http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-pertransaksi=890901&tglAwal=2018-06-28%2000:00:00&tglAkhir=2018-06-28%2023:30:00&idRuangan=&idDokter=&view=true&strIdPegawai=Egie
              
            Case "cetak-laporan-harian-kasbank"
                Call frmCRLaporanHarianKasBank.Cetak(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Harian Kas Bank"
                Root("by") = "as@epic"
                'http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-pertransaksi=890901&tglAwal=2018-06-28%2000:00:00&tglAkhir=2018-06-28%2023:30:00&idRuangan=&idDokter=&view=true&strIdPegawai=Egie
             
            Case "cetak-lapporan-detailkasir-pertransaksi"
                Call frmPenerimaanPertransaksiDetail.Cetak(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir Detail"
                Root("by") = "as@epic"
                'http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-pertransaksi=890901&tglAwal=2018-06-28%2000:00:00&tglAkhir=2018-06-28%2023:30:00&idRuangan=&idDokter=&view=true&strIdPegawai=Egie
         
            Case "cetak-lap-pasien-dalam-perawatan"
                Call frmCrPasienDalamPerawatan.Cetak(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Pasien Dalam Perawatan"
                Root("by") = "as@epic"
                'http://127.0.0.1:1237/printvb/kasir?cetak-lap-pasien-dalam-perawatan=890901&tglAwal=2018-06-28%2000:00:00&tglAkhir=2018-06-28%2023:30:00&idRuangan=&idDokter=&view=true&strIdPegawai=Egie
      
            Case "cetak-laporan-ffs-jalan"
               Call frmLaporanffsRJ.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1))
               Set Root = New JNode
               Root("Status") = "Cetak Laporan"
               Root("by") = "as@epic"
              
            Case "cetak-rekap-ffs-jalan"
               Call frmRekapffsRJ.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1))
               Set Root = New JNode
               Root("Status") = "Cetak Laporan"
               Root("by") = "as@epic"
                
            Case "cetak-penerimaan-deposit-pasienpulang"
                Call frmCrPenerimaanDeposit.Cetak(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Deposit"
                Root("by") = "as@epic"
                'http://127.0.0.1:1237/printvb/kasir?cetak-lap-pasien-dalam-perawatan=890901&tglAwal=2018-06-28%2000:00:00&tglAkhir=2018-06-28%2023:30:00&idRuangan=&idDokter=&view=true&strIdPegawai=Egie
            
            Case "cetak-kwitansi-sbk"
'                Param4 = Split(arrItem(3), "=")
                Call frmCetakKuitansiSbk.CetakUlangJenisKuitansi(Param2(1), Val(Param1(1)), Param3(1), Param4(1), Param5(1))
                Set Root = New JNode
                Root("Status") = "Cetak Kwitansi"
                '127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=1708000446&strIdPegawai=1&view=false
                
            Case "cetak-laporan-ffs-edelweis"
               Call frmLaporanEdelweisFfs.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1))
               Set Root = New JNode
               Root("Status") = "Cetak Laporan"
               Root("by") = "as@epic"
              
            Case "cetak-rekap-ffs-edelweis"
               Call frmRekapEdelweisffs.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1))
               Set Root = New JNode
               Root("Status") = "Cetak Laporan"
               Root("by") = "as@epic"
            
            Case "cetak-berita-acara-kasbank"
                'Call frmCRBeritaAcaraKasBank.Cetak(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Call frmCRBeritaAcaraKasBank.Cetak(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Harian Kas Bank"
                Root("by") = "as@epic"
        
            Case "cetak-lampiran-berita-acara-kasbank"
                Call frmCRLampiranBeritaAcaraKasBank.Cetak(Param1(1), Param2(1))
                Set Root = New JNode
                Root("Status") = "Cetak Lampiran Berita Acara"
                Root("by") = "as@epic"
                
            Case "cetak-kwitansi-layanan"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Call frmKwitansiLayanan.Cetak(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1))
                Set Root = New JNode
                Root("Status") = "Cetak Kwitansi Layanan"
                Root("by") = "as@epic"
            
             Case "cetak-RincianBiayaRanap"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Call frmCRCetakRincianBiayaRanap.CetakRincianBiayaRanap(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            
             Case "cetak-RincianBiayaObatAlkes"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Call frmCRCetakRincianBiayaObat.CetakRincianBiayaObat(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-RincianBiayaObatAlkesApt"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakRincianBiayaObat.CetakRincianBiayaObatApt(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
                
            Case "cetak-RincianBiayaObatAlkesTap"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Call frmCRCetakRincianBiayaObat.CetakRincianBiayaObatTap(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            
            Case "cetak-laporan-penerimaan-kasir-lama"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRLaporanPenerimaanKasirLama.CetakLaporanPenerimaanKasirLama(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
             Case "cetak-laporan-penerimaan-kasir-lamamondok"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRLaporanPenerimaanKasirLamaMondok.CetakLaporanPenerimaanKasirLama(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
            Case "cetak-laporan-penerimaan-kasir-RJ"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Param10 = Split(arrItem(9), "=")
                Param11 = Split(arrItem(10), "=")
                Param12 = Split(arrItem(11), "=")
                Call frmCRLaporanPenerimaanKasirLama.CetakLaporanPenerimaanKasirLama(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
                'http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan=403&tglAwal=2017-09-02&tglAkhir=2017-09-02&idRuangan=&idDokter=&view=true
            Case "cetak-laporan-penerimaan-kasir-apd"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRLaporanPenerimaanKasirApd.Cetak(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
            Case "cetak-laporan-penerimaan-kasir-apd1"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
'                Call frmCRLaporanPenerimaanKasirApd.Cetak1(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
            Case "cetak-RekapRincianBiaya"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Call frmCRCetakRekapRincianBiaya.Cetak(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-RekapRincianBiayav2"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Call frmCRCetakRekapRincianBiaya.Cetakv2(Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporan-penerimaan-kasir-setorRJ"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRLaporanPenerimaanKasir.CetakLaporanPenerimaanKasirRJ(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
            Case "cetak-laporan-penerimaan-kasir-rekonpendaftaran"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Param10 = Split(arrItem(9), "=")
                Param11 = Split(arrItem(10), "=")
                Call frmCRLaporanPenerimaanKasir.CetakLaporanRekonPendaftaran(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
             Case "cetak-laporan-penerimaan-kasir-rekontindakan"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRLaporanPenerimaanKasir.CetakLaporanRekontindakan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Penerimaan Kasir"
                Root("by") = "as@epic"
            Case Else
                Set Root = New JNode
                Root("Status") = "Error"
        End Select
    End If
    With GossRESTMain.STM
        .Open
        .Type = adTypeText
        .CharSet = "utf-8"
        .WriteText Root.JSON, adWriteChar
        .Position = 0
        .Type = adTypeBinary
        kasir = .Read(adReadAll)
        .Close
    End With
    If cn.State = adStateOpen Then cn.Close
    Unload Me
    Exit Function
    
errLoad:
End Function

Private Sub CETAK_Billing(strNoregistrasi As String, jumlahCetak As Integer, view As String)
On Error GoTo errLoad
    Dim prn As Printer
    Dim strPrinter As String
  
    ReadRs "select pp.norec,pp.tglpelayanan,pr.id as prid, pr.namaproduk, pp.jumlah,kl.id as klid, kl.namakelas, " & _
           "ru.id as ruid,ru.namaruangan,pp.produkfk,pp.hargajual,pg.id as pgid,pg.namalengkap,sp.nostruk, " & _
           "jpp.id as jppid,jpp.jenispetugaspe from " & _
           "pasiendaftar_t As pd " & _
           "inner  join antrianpasiendiperiksa_t as apd on apd.noregistrasifk= pd.norec " & _
           "inner join pelayananpasien_t as pp on pp.noregistrasifk= apd.norec " & _
           "inner join produk_m as pr ON pr.id= pp.produkfk " & _
           "inner JOIN  kelas_m as kl ON kl.id= apd.objectkelasfk " & _
           "inner join ruangan_m as ru ON ru.id= apd.objectruanganfk " & _
           "inner join pelayananpasienpetugas_t as ptu ON ptu.pelayananpasien= pp.norec " & _
           "inner join jenispetugaspelaksana_m as jpp ON jpp.id= ptu.objectjenispetugaspefk " & _
           "inner join pegawai_m as pg ON pg.id= ptu.objectpegawaifk " & _
           "left join strukpelayanan_t as sp ON sp.norec= pp.strukfk " & _
           "Where pd.tglpulang Is Not Null " & _
           "and pd.noregistrasi='" & strNoregistrasi & "'"
    
'    Dim NoAntri As String
'    Dim jmlAntrian As Integer
'    Dim jenis As String
'
'    Set RS = Nothing
'    RS.Open "select * from antrianpasienregistrasi_t where norec ='" & strNorec & "'", CN, adOpenStatic, adLockReadOnly
'    NoAntri = RS!jenis & "-" & RS!noantrian
'    jenis = RS!jenis
'    Set RS = Nothing
'    RS.Open "select count(noantrian) as jmlAntri from antrianpasienregistrasi_t where jenis ='" & jenis & "' and statuspanggil='0'", CN, adOpenStatic, adLockReadOnly
'    jmlAntrian = RS(0)
    
    strPrinter = GetTxt("Setting.ini", "Printer", "CetakAntrian")
    'GetSetting("Jasamedika Service", "CetakAntrian", "Printer")
    If Printers.Count > 0 Then
        For Each prn In Printers
            If prn.DeviceName = strPrinter Then
                Set Printer = prn
                Exit For
            End If
        Next prn
    End If
    
   '
    Printer.fontSize = 10
        Printer.Print "     RUMAH SAKIT ANAK DAN BUNDA"
        Printer.fontSize = 18
        Printer.FontBold = True
        Printer.Print "      HARAPAN KITA"
        Printer.FontBold = False
        Printer.fontSize = 10
        Printer.Print "   Jl. S. Parman Kav.87, Slipi, Jakarta Barat"
        Printer.Print "      Telp. 021-5668286, 021-5668284"
        Printer.Print "      Fax.  021-5601816, 021-5673832"
        Printer.Print "___________________________________"
        Printer.Print ""
        Printer.Print "Tanggal :" & Format(Now(), "yyyy MM dd hh:mm")
        Printer.Print ""
    For i = 0 To rs.RecordCount - 1
        'MsgBox "CETAK"

        Printer.fontSize = 12
          '1,3,,4,6,8,10,12,13,15
        Printer.Print rs(1) & " " & rs(1) & " " & rs(3) & " " & rs(4) & " " & rs(6) & " " & rs(8) & " " & rs(10) & " " & rs(12) & " "
        rs.MoveNext
    Next
    Printer.EndDoc
    Exit Sub
errLoad:
End Sub






