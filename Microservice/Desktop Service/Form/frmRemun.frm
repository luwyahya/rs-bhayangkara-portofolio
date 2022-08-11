VERSION 5.00
Begin VB.Form frmRemun 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Remun"
   ClientHeight    =   1035
   ClientLeft      =   45
   ClientTop       =   375
   ClientWidth     =   4005
   Icon            =   "frmRemun.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   1035
   ScaleWidth      =   4005
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmRemun"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Public Function Remun(ByVal QueryText As String) As Byte()
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
    Dim Param15() As String
    Dim arrItem() As String
    
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
        Param13 = Split(arrItem(12), "=")
        Param14 = Split(arrItem(13), "=")
        
        Param15 = Split(arrItem(14), "=")
        

        Select Case Param1(0)
            Case "cetak-laporan-remunerasi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmLaporanRemunerasi.CetakLaporan(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Remunerasi!!"
                '127.0.0.1:1237/printvb/kasir?cetak-billing=1&noregistrasi=1707000053&view=false
                
             Case "cetak-laporan-detail-remunerasi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmLaporanDetailRemunerasi.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Detail Remunerasi!!"
                '127.0.0.1:1237/printvb/kasir?cetak-billing=1&noregistrasi=1707000053&view=false
                
            Case "cetak-laporan-rekap-remunerasi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmLaporanRekapRemunerasi.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Rekap Remunerasi!!"
                '127.0.0.1:1237/printvb/kasir?cetak-billing=1&noregistrasi=1707000053&view=false
                
             Case "cetak-laporan-detail-remunerasi-dokter"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmLaporanDetailRemunerasi.CetakLaporanDetailDokter(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Detail Remunerasi Dokter!!"
                '127.0.0.1:1237/printvb/kasir?cetak-billing=1&noregistrasi=1707000053&view=false
                
             Case "cetak-laporan-detail-remunerasi-paramedis"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmLaporanDetailRemunerasi.CetakLaporanDetailParamedis(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Detail Remunerasi Paramedis!!"
                '127.0.0.1:1237/printvb/kasir?cetak-billing=1&noregistrasi=1707000053&view=false
                'p
             Case "cetak-laporanjasadokter"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayanan(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasadokternonlayanan"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayanannonlayanan(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterluar"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakTindakanDokterLuar(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokteranastesi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayanananastesi(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasamedis"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananmedis(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Call frmCRCetakJasapelayanan.CetakJasapelayananmedispenunjang(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasamedisodc"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananmedisodc(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))

                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
              Case "cetak-laporanrekapjasamedisodc"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekapjasamedisodc(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))

                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasamedispenunjang"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananmedispenunjang(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadoktercovid"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayanancovid(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            
            Case "cetak-laporanjasadokterpendaftaran"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananpendaftaran(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param7(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
              Case "cetak-laporanjasadokterpendaftaran"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananpendaftaran(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param7(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasadokterpendaftarancsr"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananpendaftarancsr(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param7(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
                
             Case "cetak-laporanjasabiddokpol"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananBiddokpol(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param7(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasadokterpendaftaranatensi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananpendaftaranatensi(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param7(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterpendaftarankonsul"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananpendaftarankonsul(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param7(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterpendaftarankonsulatensi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananpendaftarankonsulatensi(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param7(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasaperawat"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananperawat(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
'                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatasuhan(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Call frmCRCetakJasapelayanan.CetakJasapelayananKebidananAll(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Call frmCRCetakJasapelayanan.CetakJasapelayananPerawatBiddokpol(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                
                
                
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasaperawatcovid"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatcovid(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
                
             Case "cetak-laporanjasaperawatanastesi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatanastesi(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasaperawatoperator"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatoperator(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
                
             Case "cetak-laporanjasaperawatdarah"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatdarah(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasaperawatadministrasi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatadministrasi(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasaperawatakomodasi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatakomodasi(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatakomodasidokterruang(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasatindakanperawatacovid"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayanantindakanperawatacovid(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasatindakanperawatacovidsetor"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Param10 = Split(arrItem(10), "=")
                 Param11 = Split(arrItem(11), "=")
                 Param12 = Split(arrItem(12), "=")
                 Param13 = Split(arrItem(13), "=")
                 Param14 = Split(arrItem(14), "=")
                 Param15 = Split(arrItem(15), "=")
                Call frmCRCetakJasapelayanansetor.CetakJasapelayanantindakanperawatacovid(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1), Param15(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasaperawatakomodasidokpol"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatakomodasidokpol(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
              Case "cetak-laporanjasadokpolrekap"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekapdokpol(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasadokterrekap"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekap(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasadokterrekapsetor"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(9), "=")
                Param10 = Split(arrItem(10), "=")
                 Param11 = Split(arrItem(11), "=")
                 Param12 = Split(arrItem(12), "=")
                 Param13 = Split(arrItem(13), "=")
                 Param14 = Split(arrItem(14), "=")
                 Param15 = Split(arrItem(15), "=")
                Call frmCRCetakJasapelayanansetor.CetakJasapelayananrekap(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasadokterrekappendaftarancsr"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekappendaftarancsr(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasadokterrekappendaftarancsrsetor"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Param9 = Split(arrItem(9), "=")
                Param10 = Split(arrItem(10), "=")
                 Param11 = Split(arrItem(11), "=")
                 Param12 = Split(arrItem(12), "=")
                 Param13 = Split(arrItem(13), "=")
                 Param14 = Split(arrItem(14), "=")
                 Param15 = Split(arrItem(15), "=")
                Call frmCRCetakJasapelayanansetor.CetakJasapelayananrekappendaftarancsr(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1), Param15(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterrekappendaftaranatensi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekappendaftaranatensi(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterrekaptindakancsr"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekaptindakancsr(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterrekaptindakancsrsetor"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Param10 = Split(arrItem(10), "=")
                 Param11 = Split(arrItem(11), "=")
                 Param12 = Split(arrItem(12), "=")
                 Param13 = Split(arrItem(13), "=")
                 Param14 = Split(arrItem(14), "=")
                 Param15 = Split(arrItem(15), "=")
                Call frmCRCetakJasapelayanansetor.CetakJasapelayananrekaptindakancsr(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1), Param15(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterrekaptindakanatensi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekaptindakanatensi(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"

              Case "cetak-laporanjasadokterrekapdokternonlayanan"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekapnonlayanan(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterrekapdokterluar"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekapdokterluar(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasadokterrekapdokterluarall"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakTindakanDokterLuar(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterluarrekap"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakTindakanDokterLuarRekap(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterrekappenunjang"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekappenunjang(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterrekappenunjangsetor"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Param10 = Split(arrItem(10), "=")
                 Param11 = Split(arrItem(11), "=")
                 Param12 = Split(arrItem(12), "=")
                 Param13 = Split(arrItem(13), "=")
                 Param14 = Split(arrItem(14), "=")
                 Param15 = Split(arrItem(15), "=")
                Call frmCRCetakJasapelayanansetor.CetakJasapelayananrekappenunjang(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasaoperatordananastesi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekapoperatoranastesi(Param2(1), Param3(1), Param4(1), Param5(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasaoperatordananastesisetor"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Param10 = Split(arrItem(10), "=")
                 Param11 = Split(arrItem(11), "=")
                 Param12 = Split(arrItem(12), "=")
                 Param13 = Split(arrItem(13), "=")
                 Param14 = Split(arrItem(14), "=")
                 Param15 = Split(arrItem(15), "=")
                Call frmCRCetakJasapelayanansetor.CetakJasapelayananrekapoperatoranastesi(Param2(1), Param3(1), Param4(1), Param5(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1), Param15(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterrekapjasaparamedis"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekapparamedis(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekapdokterruang(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasadokterrekapjasaparamedissetor"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(9), "=")
                Param10 = Split(arrItem(10), "=")
                 Param11 = Split(arrItem(11), "=")
                 Param12 = Split(arrItem(12), "=")
                 Param13 = Split(arrItem(13), "=")
                 Param14 = Split(arrItem(14), "=")
                 Param15 = Split(arrItem(15), "=")
                Call frmCRCetakJasapelayanansetor.CetakJasapelayananrekapparamedis(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1))
                Call frmCRCetakJasapelayanansetor.CetakJasapelayananrekapdokterruang(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterrekapakomodasi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
'                Call frmCRCetakJasapelayanan.CetakJasapelayananrekapakomodasi(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterrekapjasamedissetor"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(9), "=")
                Param10 = Split(arrItem(10), "=")
                 Param11 = Split(arrItem(11), "=")
                 Param12 = Split(arrItem(12), "=")
                 Param13 = Split(arrItem(13), "=")
                 Param14 = Split(arrItem(14), "=")
                 Param15 = Split(arrItem(15), "=")
                Call frmCRCetakJasapelayanansetor.CetakJasapelayananrekapjasamedis(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1))
                Call frmCRCetakJasapelayanansetor.CetakJasapelayananrekapjasamedispenunjang(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1))
                
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasadokterrekapjasamedis"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekapjasamedis(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekapjasamedispenunjang(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterrekapjasamedispenunjang"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekapjasamedispenunjang(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
'            Case "cetak-laporanjasadokterrekapjasamedispenunjangsetor"
'                Param4 = Split(arrItem(3), "=")
'                Param5 = Split(arrItem(4), "=")
'                Param6 = Split(arrItem(5), "=")
'                Param7 = Split(arrItem(6), "=")
'                Param8 = Split(arrItem(7), "=")
'                Param9 = Split(arrItem(8), "=")
'                Call frmCRCetakJasapelayanansetor.CetakJasapelayananrekapjasamedispenunjang(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param7(1))
'                Set Root = New JNode
'                Root("Status") = "Cetak Rincian Biaya"
           Case "cetak-laporanjasadokterrekappendaftaran"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                 Param8 = Split(arrItem(7), "=")
                 Param9 = Split(arrItem(8), "=")
                
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekappendaftaran(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterrekappendaftaransetor"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                 Param8 = Split(arrItem(7), "=")
                 Param9 = Split(arrItem(8), "=")
                Param10 = Split(arrItem(10), "=")
                 Param11 = Split(arrItem(11), "=")
                 Param12 = Split(arrItem(12), "=")
                 Param13 = Split(arrItem(13), "=")
                 Param14 = Split(arrItem(14), "=")
                 Param15 = Split(arrItem(15), "=")
                
                Call frmCRCetakJasapelayanansetor.CetakJasapelayananrekappendaftaran(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1), Param15(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
           Case "cetak-laporanjasadokterrekappendaftarandokterluar"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                 Param8 = Split(arrItem(7), "=")
                 Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekappendaftarandokterluar(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
          
          Case "cetak-laporanjasadokterrekappendaftaranmedis"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                 Param8 = Split(arrItem(7), "=")
                 Param9 = Split(arrItem(8), "=")

                Call frmCRCetakJasapelayanan.CetakJasapelayananrekappendaftaranmedis(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
           Case "cetak-laporanjasadokterrekappendaftaranmedissetor"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                 Param8 = Split(arrItem(7), "=")
                 Param9 = Split(arrItem(8), "=")

                Param10 = Split(arrItem(10), "=")
                 Param11 = Split(arrItem(11), "=")
                 Param12 = Split(arrItem(12), "=")
                 Param13 = Split(arrItem(13), "=")
                 Param14 = Split(arrItem(14), "=")
                 Param15 = Split(arrItem(15), "=")
                 
                Call frmCRCetakJasapelayanansetor.CetakJasapelayananrekappendaftaranmedis(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1), Param15(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
           Case "cetak-laporanjasadokterpendaftaranbillling"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                
                Call frmCRCetakJasapelayanan.CetakJasapelayananpendaftaranbilling(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterpendaftaranrm"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                
                Call frmCRCetakJasapelayanan.CetakJasapelayananpendaftaranrm(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasadokterpendaftaranadmision"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                
                Call frmCRCetakJasapelayanan.CetakJasapelayananpendaftaranadmision(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            
            Case "cetak-laporanjasadokterpendaftaranperawatregistrasi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                
                Call frmCRCetakJasapelayanan.CetakJasapelayananpendaftaranperawat(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            
            Case "cetak-laporanjasaperawatrekap"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatrekap(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatrekapasup(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatrekapasupGilut(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                
                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatrekapbiddokpol(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
'                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatrekapasupBidan(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
              
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasaperawatrekapsetor"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Param10 = Split(arrItem(10), "=")
                 Param11 = Split(arrItem(11), "=")
                 Param12 = Split(arrItem(12), "=")
                 Param13 = Split(arrItem(13), "=")
                 Param14 = Split(arrItem(14), "=")
                 Param15 = Split(arrItem(15), "=")
                
                Call frmCRCetakJasapelayanansetor.CetakJasapelayananperawatrekap(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1), Param15(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasaperawatrekapdarah"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananperawatrekapdarah(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasaperawatrekapdarahsetor"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param9 = Split(arrItem(9), "=")
                Param10 = Split(arrItem(10), "=")
                 Param11 = Split(arrItem(11), "=")
                 Param12 = Split(arrItem(12), "=")
                 Param13 = Split(arrItem(13), "=")
                 Param14 = Split(arrItem(14), "=")
                 Param15 = Split(arrItem(15), "=")
                Call frmCRCetakJasapelayanansetor.CetakJasapelayananperawatrekapdarah(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1), Param15(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
             Case "cetak-laporanjasaperawatrekapcovid"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekapcovid(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanjasaperawatrekapcovidsetor"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(9), "=")
                Param10 = Split(arrItem(10), "=")
                 Param11 = Split(arrItem(11), "=")
                 Param12 = Split(arrItem(12), "=")
                 Param13 = Split(arrItem(13), "=")
                 Param14 = Split(arrItem(14), "=")
                 Param15 = Split(arrItem(15), "=")
                Call frmCRCetakJasapelayanansetor.CetakJasapelayananrekapcovid(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1), Param13(1), Param14(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanpendaftaran"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekap(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanpendaftaranrekap"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrekap(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanpenerimaanrawatmondok"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.CetakJasapelayananrawatmondok(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
            Case "cetak-laporanpenagihanpenjamin"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Call frmCRCetakJasapelayanan.Cetakpenagihanpenjamin(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rincian Biaya"
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
