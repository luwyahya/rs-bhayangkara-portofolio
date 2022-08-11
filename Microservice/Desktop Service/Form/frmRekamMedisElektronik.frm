VERSION 5.00
Begin VB.Form frmRekamMedisElektronik 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Elektronik RekamMedis"
   ClientHeight    =   960
   ClientLeft      =   45
   ClientTop       =   375
   ClientWidth     =   5040
   Icon            =   "frmRekamMedisElektronik.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   960
   ScaleWidth      =   5040
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmRekamMedisElektronik"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Public Function Fungsi(ByVal QueryText As String) As Byte()
    On Error Resume Next
    Dim Root As JNode
    Dim Param1() As String
    Dim Param2() As String
    Dim Param3() As String
    Dim Param4() As String
    Dim Param5() As String
    Dim arrItem() As String
   
    If CN.State = adStateClosed Then Call openConnection
        
    If Len(QueryText) > 0 Then
        arrItem = Split(QueryText, "&")
        Param1 = Split(arrItem(0), "=")
        Param2 = Split(arrItem(1), "=")
        Param3 = Split(arrItem(2), "=")
        Param4 = Split(arrItem(3), "=")
        Param5 = Split(arrItem(4), "=")
        
        Select Case Param1(0)

            Case "cek-konek"
                Set Root = New JNode
                Root("Status") = "Ok!!"

            Case "cetak-tindakan-anastersi-Umum"
                Call frmCetakTindakanAnastesiUmum.Cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-anastersi-Umum&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"

            Case "cetak-tindakan-fiksasi-mekanik"
                Call frmCetakTindakanFiksasi.Cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-fiksasi-mekanik&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-tindakan-injeksi"
                Call frmCetakTindakanInjeksi.Cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-injeksi&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-tindakan-ECT"
                Call frmCetakTindakanECT.Cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-ECT&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                           
            Case "cetak-surat-pernyataan-penolakan"
                Call frmCetakSuratPernyataanPenolakan.Cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-surat-pernyataan-penolakan&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                           
            Case "cetak-pemberian-informasi"
                Call frmCetakPemberianInformasi.Cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-pemberian-informasi&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                                   
            Case "cetak-barang-milik-pasien"
                Call frmCetakSuratBarangMilikPasien.Cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-barang-milik-pasien&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-kebutuhan-rencana-pulang"
                Call frmCetakKebutuhanRencanaPulang.Cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-kebutuhan-rencana-pulang&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-tindakan-infus"
                Call frmCetakTindakanInfus.Cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-infus&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-tindakan-kateter"
                Call frmCetakTindakanKateter.Cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-kateter&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
             Case "cetak-surat-permintaan-ri"
                Call frmCetakSuratPermintaanRawatInap.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-surat-permintaan-ri&id=048792&emr=b1275960-1a9d-11ea-9c77-5f6e48d8&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
           
             Case "cetak-emr-asesmen-gd"
                Call frmCetakEmrAsesmenMedisGadar.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-gd&id=035221&emr=34bc5f00-1a8a-11ea-a8df-3353a270&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
           
             Case "cetak-emr-asesmen-rj"
                Call frmCetakEmrAsesmenMedisRaJal.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-rj&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
             Case "cetak-emr-asesmen-keperawatan-jiwa-anakremaja-rj"
                Call frmCetakEmrAsesmenKeperawatanJiwaARRaJal.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-keperawatan-jiwa-anakremaja-rj&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            
             Case "cetak-emr-asesmen-pemeriksaandaycare"
                Call frmCetakEmrPemeriksaanDayCare.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-pemeriksaandaycare&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-asesmen-ctrs"
                Call frmCetakEmrCTRS.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-ctrs&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-asesmen-pansssingkat"
                Call frmCetakPanssSingkat.Cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-pansssingkat&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-cpk"
                Call frmCetakEmrCPK.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-cpk&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-hpp-wisc"
                Call frmCetakEmrHPPwisc.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-hpp-wisc&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-hpp-nst"
                Call frmCetakEmrHPPNst.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-hpp-nst&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-asesmen-ri"
                Call frmCetakEmrAsesmenMedisRanap.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-ri&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-asesmen-hiv"
                Call frmCetakEmrHiv.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-hiv&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-skriningtb"
                Call frmCetakEmrSkriningTB.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-skriningtb&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-hasilrad"
                Call frmCetakEmrHasilRad.Cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-hasilrad&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true&idemr=373
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-smpp"
                Call frmCetakEmrSkriningMpp.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-smpp&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-hasilradd"
                Call frmCetakEmrHasilRadkosong.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-hasilradd&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-totalcare"
                Call frmCetakEmrTotalcare.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-totalcare&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-forma"
                Call frmCetakEmrForma.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-forma&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-pans"
                Call frmCetakAsesmenPanssSingkatReal.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-pans&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-observasifisik"
                Call frmCetakEmrObservasiFisik.Cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-observasifisik&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true&idemr=280
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-cppt"
                Call frmCetakEmrCppt.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-cppt&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-restrain"
                Call frmCetakEmrRestrain.Cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-restrain&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
             Case "cetak-emr-asesmen-awal-perawat-igd"
                Call frmCetakEmrAsesmenAwalKeperawatanGadar.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-awal-perawat-igd&id=341936&emr=dca01bd0-fe10-11e9-8809-17862b7c&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-asesmen-awal-perawat-inap"
                Call frmCetakEmrAsesmenAwalKeperawatanInap.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-awal-perawat-inap&id=341936&emr=dca01bd0-fe10-11e9-8809-17862b7c&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
           
           Case "cetak-emr-grafik-tanda-vital"
                Call frmCetakEmrGrafikTandaVital.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-grafik-tanda-vital&id=069516&emr=52dd8210-5c3b-11ea-a693-7122d0f3&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-formanew"
                Call frmCetakEmrFormaNew.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-formanew&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-shj"
                Call frmCetakEmrSHJ.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-shj&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-beritaalihdpjp"
                Call frmCetakEmrBeritaAlihDpjp.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-beritaalihdpjp&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-formb"
                Call frmCetakEmrFormb.Cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-formb=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-daftarmecta"
                Call frmCetakEmrDaftarMecta.Cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-daftarmecta&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            
            Case "cetak-emr-traseprimer"
                Call frmCetakEmrTriasePrimer.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-traseprimer&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true&idemr=160
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                                
             Case "cetak-emr-formulirtransfer"
                Call frmCetakEmrFormulirTransfer.Cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-formulirtransfer&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true&idemr=317
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"

            Case "cetak-emr-assawalpasienberesiko"
                Call frmCetakEmrAssAwalPasienBeresiko.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-assawalpasienberesiko&id=048380&emr=fe796ee0-82c1-11ea-be17-2bab0529&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-hasil-rad"
                Call frmCetakHasilRad.Cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-hasilrad&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true&idemr=373
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
           
           
            Case "cetak-emr-kebutuhanedukasi"
                Call frmCetakEmrKebutuhanEdukasi.Cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-kebutuhanedukasi&id=048380&emr=9c6e6440-9780-11ea-be27-190ffb75&idemr=221&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                'tab 1 221, tab 2 302 tab 3 303
                
            Case "cetak-emr-cpk"
                Call frmCetakEmrCatatPerkembanganPer.Cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-cpk&id=048380&emr=9c6e6440-9780-11ea-be27-190ffb75&idemr=221&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-riwayatperkembangan"
                Call frmCetakEmrRiwayatPerkembangan.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-riwayatperkembangan&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
                
                
           
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
        farmasiApotik = .Read(adReadAll)
        .Close
    End With
    If CN.State = adStateOpen Then CN.Close
    Unload Me
    Exit Function
errLoad:
End Function


