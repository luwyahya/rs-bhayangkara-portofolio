Attribute VB_Name = "modBridging"
Option Explicit

Public strGlobalKdRuanganNaikKelas As String
Public strGlobalKdKelasNaikKelas As String
Public strGlobalNamaRuanganNaikKelas As String
Public currGlobalTmpTotalDetailTarif As Currency
Public strGlobalNoSJP As String

Public currGlobalTarifCBG As Currency
Public currGlobalTarifSubAcute As Currency
Public currGlobalTarifChronic As Currency
Public currGlobalBiayaTambahan As Currency
Public currGlobalTarifINACBGKelas1 As Currency
Public currGlobalTarifINACBGKelas2 As Currency
Public currGlobalTarifINACBGKelas3 As Currency
Public strGlobalSpecialCMGOption() As Currency
Public currGlobalTotalSpecialCMG As Currency


Private Type SpecialCMGOption
    Code As String
    Description As String
    Type As String
End Type

Public globalSpecialCMGOption() As SpecialCMGOption


'----Inisialisasi objec context
Public strGlobalUrlINACBG As String
Public strGlobalINACBGKeyEnkripDanDekripEklaim As String
Public strGlobalINACBGKodeTarifRs As String
Public strGlobalINACBGJenisPasienId As String
Public strGlobalINACBGJenisPasienNama
Public strGlobalINACBGNIKPegawai
Public strGlobalPathReferenceBridgingINACBG As String
Public strGlobalINACBGVersiEklaim As String
Public strGlobalINACBGUrlEklaim51 As String
Public intCountingPesanErrorDiagnosaSalah As Integer
Public boolGlobalHanyaSyncron As Boolean
Public boolTombolSyncronKeNCCdiFrameDetailTanggunganDitekan As Boolean
Public strGlobalAdaKenaikanKelas As String
Public strGlobalKelasPerawatan As String
Public strGlobalNamaKelasTertinggiNaikKelas As String
Public context As BridgingInaCbg.context

Private Type strICD
    ICD10 As String
    ICD9 As String
End Type
Public strTypeGlobalICD As strICD
Public Sub inisialisasiObjekContext()
On Error GoTo hell

'    strGlobalPathReferenceBridgingINACBG = cariSettingGlobal("INACBGPathReferenceBridging")
'    strGlobalINACBGVersiEklaim = cariSettingGlobal("INACBGVersiEklaim")
'    strGlobalINACBGUrlEklaim51 = cariSettingGlobal("UrlEklaim51")
'    strGlobalUrlINACBG = cariSettingGlobal("UrlInaCbg")
'    strGlobalINACBGKeyEnkripDanDekripEklaim = cariSettingGlobal("INACBGKeyEnkripDanDekripEklaim")
'    strGlobalINACBGKodeTarifRs = cariSettingGlobal("INACBGKodeTarifRs")
'    strGlobalINACBGJenisPasienId = cariSettingGlobal("INACBGJenisPasienId")
'    strGlobalINACBGJenisPasienNama = cariSettingGlobal("INACBGJenisPasienNama")
'    strGlobalINACBGNIKPegawai = cariSettingGlobal("INACBGNIKPegawai")
    
    strIDPegawaiAktif = "8888888888"
    strGlobalINACBGNIKPegawai = "123123123123"
    
'
'        strSQLz = "Select NIP From DataCurrentPegawai Where IdPegawai='" & strIDPegawaiAktif & "'"
'        Call eksekusiQuery(rsZ, strSQLz)
'        strGlobalINACBGNIKPegawai = rsZ("NIP")
    
    
    
        
    If (Dir(strGlobalPathReferenceBridgingINACBG) <> "") Then
        
        
        If (strGlobalUrlINACBG <> "") Then
            
            Set context = New BridgingInaCbg.context
            
            context.SetEndpoint strGlobalUrlINACBG
            context.SetKey strGlobalINACBGKeyEnkripDanDekripEklaim
            
            'Antisipasi jika masih pakai 5.1
            If strGlobalINACBGVersiEklaim = "5.1" Then
                If strGlobalINACBGUrlEklaim51 <> "" Then
                    context.SetEndpoint strGlobalINACBGUrlEklaim51
                End If
            End If
        End If
    End If
    
    Exit Sub

hell:
    Call pesanError
    Resume 0
    
End Sub
'2+2=5
Public Function SyncronINACBGPerPasien( _
ParamNoPendaftaran As String, _
Optional ParamTotalBiaya As Currency, Optional ParamKoefisienTambahanBiayaKeVIP As Double) _
As String

On Error GoTo duaTambahDuaSamaDenganLima

Dim intLamaHariRawatNaikKelas As Integer
Dim intLamaHariRawatIntensif As Integer
Dim curBiayaTambahanPoliEksekutif As Currency
Dim strAdaKenaikanKelas As Integer
Dim strAdaPerawatanIntensif As String
Dim strNamaKelasTertinggiNaikKelas As String
Dim strKelasPerawatan As String
Dim strNamaPoli As String

Dim strTmpBalikanDariWebServiceINACBGS As String

'Dim context As BridgingInaCbg.context

Dim strNamaDokter As String
Dim strCaraPulang As String
Dim strDerajatKelasTanggungan As String
Dim intCountHariYgSama As Integer
Dim dateTglMasukNaikKelasSebelumnya As Date
Dim strKdKelasIntensif As String
Dim dateTglMasukIntensifSebelumnya As Date

Dim strDiagnosa As String
Dim strDiagnosaTindakan  As String
Dim strJenisRawat As String
Dim i As Integer

Dim boolNoSJPKosong As Boolean
Dim strBeratBadan As String


    If (Dir(strGlobalPathReferenceBridgingINACBG) <> "") Then
        
        currGlobalTarifCBG = 0
        currGlobalTarifSubAcute = 0
        currGlobalTarifChronic = 0
        currGlobalBiayaTambahan = 0
        currGlobalTarifINACBGKelas1 = 0
        currGlobalTarifINACBGKelas2 = 0
        currGlobalTarifINACBGKelas3 = 0
        
        If (strGlobalUrlINACBG <> "") Then
'            Set context = New BridgingInaCbg.context
'
'            context.SetEndpoint strGlobalUrlINACBG
''            context.SetKey strGlobalINACBGKeyEnkripDanDekripEklaim
'            context.SetKey Replace(strGlobalINACBGKeyEnkripDanDekripEklaim, vbNewLine, "", , , vbTextCompare)
'
'            'Antisipasi jika masih pakai 5.1
'            If strGlobalINACBGVersiEklaim = "5.1" Then
'                If strGlobalINACBGUrlEklaim51 <> "" Then
'                    context.SetEndpoint strGlobalINACBGUrlEklaim51
'                End If
'            End If
            
            
            'Diagnosa utama
            Dim strLokalKdRuanganAkhir As String
            
            strLokalKdRuanganAkhir = ""
            
            strSQL9 = "SELECT KdRuanganAkhir From PasienDaftar " _
                     & " WHERE (NoPendaftaran = '" & ParamNoPendaftaran & "') "
            Call eksekusiQuery(rs7, strSQL9)
            If rs7.RecordCount > 0 Then
                strLokalKdRuanganAkhir = rs7("KdRuanganAkhir")
            Else
'                MsgBox "Kode Ruangan Akhir Kosong", vbCritical
                SyncronINACBGPerPasien = "Kode Ruangan Akhir Kosong"
                Exit Function
            End If
            
            If strGlobalINACBGNIKPegawai = "" Then
'                MsgBox "NIK anda belum didaftarkan sebagai petugas grouping di NCC", vbInformation
                SyncronINACBGPerPasien = "NIK anda belum didaftarkan sebagai petugas grouping di NCC"
                Exit Function
            End If
            
            If IsNull(strGlobalINACBGNIKPegawai) = True Then
'                MsgBox "NIK anda belum didaftarkan sebagai petugas grouping di NCC", vbInformation
                SyncronINACBGPerPasien = "NIK anda belum didaftarkan sebagai petugas grouping di NCC"
                Exit Function
            End If
            
            strSQL = "SELECT Distinct KdDiagnosa, NamaDokter FROM V_PeriksaDiagnosaICD10 " _
                   & " WHERE (NoPendaftaran = '" & ParamNoPendaftaran & "') AND (Prefix = 'KdDiagnosaUtama' ) AND (KdRuangan='" & strLokalKdRuanganAkhir & "')"
            Call eksekusiQuery(rsD, strSQL)
            
            strDiagnosa = ""
            If rsD.RecordCount > 0 Then
                strDiagnosa = rsD(0).value
                strNamaDokter = rsD("NamaDokter")
            End If
                
            
            'Diagnosa tambahan
            strSQL = "SELECT Distinct KdDiagnosa FROM V_PeriksaDiagnosaICD10 " _
                     & " WHERE (NoPendaftaran = '" & ParamNoPendaftaran & "') AND (Prefix = 'KdDiagnosaTambahan' ) AND (KdRuangan='" & strLokalKdRuanganAkhir & "')"
                           
            Call eksekusiQuery(rsD, strSQL)
            For i = 1 To rsD.RecordCount
                strDiagnosa = strDiagnosa & ";" & rsD(0).value
                rsD.MoveNext
            Next i

            strTypeGlobalICD.ICD10 = strDiagnosa
            
            'Diangosa tindakan utama
            strSQL = "SELECT Distinct KdDiagnosaTindakan FROM V_PeriksaDiagnosaICD9 " _
                   & " WHERE (NoPendaftaran = '" & ParamNoPendaftaran & "') AND (Prefix = 'KdDiagnosaUtama' ) AND (KdRuangan='" & strLokalKdRuanganAkhir & "')"
                     
            Call eksekusiQuery(rsD, strSQL)
            
            strDiagnosaTindakan = ""
            For i = 1 To rsD.RecordCount
                strDiagnosaTindakan = strDiagnosaTindakan & rsD(0).value + ";"
                rsD.MoveNext
            Next i


            'Diagnosa tindakan tambahan
            strSQL = "SELECT Distinct KdDiagnosaTindakan FROM V_PeriksaDiagnosaICD9 " _
                   & " WHERE (NoPendaftaran = '" & ParamNoPendaftaran & "') AND (Prefix = 'KdDiagnosaTambahan' ) AND (KdRuangan='" & strLokalKdRuanganAkhir & "')"
           
            Call eksekusiQuery(rsD, strSQL)
            
            For i = 1 To rsD.RecordCount
                strDiagnosaTindakan = strDiagnosaTindakan & rsD(0).value + ";"
                rsD.MoveNext
            Next i
            
            strTypeGlobalICD.ICD9 = strDiagnosaTindakan
            
            If strDiagnosa = "" Then
'                MsgBox "Diagnosa ICD10 kosong", vbCritical
                SyncronINACBGPerPasien = "Diagnosa ICD10 kosong"
                Exit Function
            End If
            
'            If strDiagnosaTindakan = "" Then
'                MsgBox "Diagnosa ICD9 kosong", vbCritical
'                SyncronINACBGPerPasien = "Diagnosa ICD9 kosong"
'                Exit Function
'            End If
            
            If strNamaDokter = "" Then
'                MsgBox "Dokter penanggung jawab kosong", vbCritical
                SyncronINACBGPerPasien = "Dokter penanggung jawab kosong"
                Exit Function
            End If
            
            
            'BeratBadan
            strSQLz = "Select BeratBadan From PeriksaDiagnosaBeratBadan Where NoPendaftaran='" & ParamNoPendaftaran & "'"
            Call eksekusiQuery(rsZ, strSQLz)
            strBeratBadan = "0"
            If rsZ.RecordCount > 0 Then
                strBeratBadan = rsZ("BeratBadan")
            End If
            
            
            strSQL = "Select * From V_BridgingINACBGSNew Where NoPendaftaran='" & ParamNoPendaftaran & "'"
            Call eksekusiQuery(rs, strSQL)
            
            If rs.RecordCount = 0 Then
                strSQL = "Select * From V_BridgingINACBGS Where NoPendaftaran='" & ParamNoPendaftaran & "'"
                Call eksekusiQuery(rs, strSQL)
            End If
            
            
            If IsNull(rs("NoSJP")) = True Then
                boolNoSJPKosong = True
            End If
            
            If rs.RecordCount < 1 Then
                boolNoSJPKosong = True
            End If
            
            
            
            If boolNoSJPKosong = False Then
                If rs("NoSJP") = "" Then
                    boolNoSJPKosong = True
                End If
                
                If rs("JenisPasienNama") = "JKN" Then
                    If InStr(1, UCase(rs("NoSJP")), "R", vbTextCompare) = 0 Then
                        boolNoSJPKosong = True
                    End If
                    
                    If Len(rs("NoSJP")) <= 12 Then
                        boolNoSJPKosong = True
                    End If
                End If
                
            End If
            
            
            If boolNoSJPKosong = True Then
'                MsgBox "NoSJP kosong atau salah", vbCritical
                SyncronINACBGPerPasien = "NoSJP kosong"
                Exit Function
            Else
                strGlobalNoSJP = Replace(rs("NoSJP"), vbNewLine, "", , , vbTextCompare)
            End If
            
            
            'Jenis rawat
            strSQL = "select * From RegistrasiRI where NoPendaftaran='" & ParamNoPendaftaran & "' "
            Call eksekusiQuery(rsE, strSQL)
            If rsE.RecordCount <> 0 Then
                strJenisRawat = "1"
            Else
                strJenisRawat = "2"
            End If
            
            
            
            '2+2=5, cara pulang
            'Rawat Inap
            If strJenisRawat = 1 Then
                strSQL = "Select KdKondisiPulang From PasienPulang Where NoPendaftaran='" & ParamNoPendaftaran & "'"
                Call eksekusiQuery(rsE, strSQL)
                If rsE.RecordCount <> 0 Then
                    strSQL = "Select KdCaraPulangINACBGS From MappingCaraPulangINACBGS Where KdKondisiPulangSIMRS='" & rsE("KdKondisiPulang") & "'"
                    Call eksekusiQuery(rsF, strSQL)
                    If IsNull(rsF("KdCaraPulangINACBGS")) = True Then
                        strCaraPulang = ""
                    Else
                        strCaraPulang = rsF("KdCaraPulangINACBGS")
                    End If
                Else
                    strCaraPulang = ""
                End If
                
            Else
                strSQL = "Select KdKondisiPulang From PasienIGDKeluar Where NoPendaftaran='" & ParamNoPendaftaran & "'"
                Call eksekusiQuery(rsE, strSQL)
                
                'IGD
                If rsE.RecordCount <> 0 Then
                    If IsNull(rsE("KdKondisiPulang")) = True Then
                        strCaraPulang = ""
                    Else
                        strSQL = "Select KdCaraPulangINACBGS From MappingCaraPulangINACBGS Where KdKondisiPulangSIMRS='" & rsE("KdKondisiPulang") & "'"
                        Call eksekusiQuery(rsF, strSQL)
                        If IsNull(rsF("KdCaraPulangINACBGS")) = True Then
                            strCaraPulang = ""
                        Else
                            strCaraPulang = rsF("KdCaraPulangINACBGS")
                        End If
                    End If
                Else
                    'Rawat Jalan
                    strSQL = "Select KdKondisiPulang, KdRuangan From PasienRJPulang Where NoPendaftaran='" & ParamNoPendaftaran & "'"
                    Call eksekusiQuery(rsE, strSQL)
                    If rsE.RecordCount <> 0 Then
                        If IsNull(rsE("KdKondisiPulang")) = True Then
                            strCaraPulang = ""
                        Else
                            strSQL = "Select KdCaraPulangINACBGS From MappingCaraPulangINACBGS Where KdKondisiPulangSIMRS='" & rsE("KdKondisiPulang") & "'"
                            Call eksekusiQuery(rsF, strSQL)
                            If IsNull(rsF("KdCaraPulangINACBGS")) = True Then
                                strCaraPulang = ""
                            Else
                                strCaraPulang = rsF("KdCaraPulangINACBGS")
                            End If
                        End If
                        
                        'Khusus poli eksekutif, mencari biaya tambahan untuk poli eksekutif
                        strSQL = "Select NamaExternal From Ruangan Where KdRuangan='" & rsE("KdRuangan") & "'"
                        Call eksekusiQuery(rsG, strSQL)
                        strNamaPoli = rsG("NamaExternal")
                        If strNamaPoli = "Poli Eksekutif" Then
                            strSQL = "Select Value From SettingGlobal Where Prefix='BiayaTambahanPoliEksekutif'"
                            Call eksekusiQuery(rsG, strSQL)
                            If rsG.RecordCount <> 0 Then
                                curBiayaTambahanPoliEksekutif = rsG("Value")
                            Else
                                curBiayaTambahanPoliEksekutif = 0
                            End If
                            
                        Else
                            curBiayaTambahanPoliEksekutif = 0
                        End If
                        
                        
                    Else
                        strCaraPulang = ""
                    End If
                    
                End If
            End If
                        
            
            
            'Kelas perawatan(Kelas Tanggungan)
            strKelasPerawatan = 1
            If strJenisRawat = "1" Then
                If rs("KdKelasDitanggung") = "01" Then
                    strKelasPerawatan = "3"
                ElseIf rs("KdKelasDitanggung") = "02" Then
                    strKelasPerawatan = "2"
                ElseIf rs("KdKelasDitanggung") = "03" Then
                    strKelasPerawatan = "1"
                End If
            Else
                'Saya patok IGD ke kelas reguler karena IGD tidak ada yang eksekutif. IGD masuk ke rawat jalan di E-Klaim INACBGS
                strKelasPerawatan = "3"
                
                'Replace Kelas perawatan jika ke poli eksekutif
                If strNamaPoli = "Poli Eksekutif" Then
                    strKelasPerawatan = "1"
                End If
            End If
            
            
            
            
            'Menentukan derajat kelas tanggungan
            If strJenisRawat = 1 Then
                If strKelasPerawatan = 1 Then
                    strDerajatKelasTanggungan = 3
                ElseIf strKelasPerawatan = 2 Then
                    strDerajatKelasTanggungan = 2
                Else
                    strDerajatKelasTanggungan = 1
                End If
            End If
            
            
            'Pengecekan apakah ada pernah naik kelas atau tidak
            strAdaKenaikanKelas = "0"
            intLamaHariRawatNaikKelas = 0
            intCountHariYgSama = 0
            
            If strJenisRawat = 1 Then
                strSQL = "Select TglMasuk, TglKeluar, DerajatKelas, NamaEksternal, KdRuangan, KdKelas, KdKelasPel, NamaRuangan From V_DerajatKelasPemakaianKamar " _
                       & " Where NoPendaftaran='" & ParamNoPendaftaran & "' And DerajatKelas > '" & strDerajatKelasTanggungan & "' Order By DerajatKelas Asc"
                Call eksekusiQuery(rsF, strSQL)
                
                If rsF.RecordCount > 0 Then
                    strAdaKenaikanKelas = "1"
                    
                    
                    'Jumlah hari rawat naik kelas
                    For i = 1 To rsF.RecordCount
                        
                        'Untuk kasus naik kelas berkali-kali di hari yang sama
                        If DateDiff("d", dateTglMasukNaikKelasSebelumnya, rsF("TglMasuk")) = 0 Then
                            intCountHariYgSama = intCountHariYgSama + 1
                        End If
                        
                        
                        If DateDiff("d", rsF("TglMasuk"), rsF("TglKeluar")) = 0 Then
                            intLamaHariRawatNaikKelas = intLamaHariRawatNaikKelas + 1
                        Else
                            intLamaHariRawatNaikKelas = intLamaHariRawatNaikKelas + (DateDiff("d", rsF("TglMasuk"), rsF("TglKeluar")) + 1)
                        End If
                          
                        If i = rsF.RecordCount Then
                            strNamaKelasTertinggiNaikKelas = rsF("NamaEksternal")
                            strGlobalKdRuanganNaikKelas = rsF("KdRuangan")
                            strGlobalKdKelasNaikKelas = rsF("KdKelasPel")
                            strGlobalNamaRuanganNaikKelas = rsF("NamaRuangan")
                        End If
                        
                        dateTglMasukNaikKelasSebelumnya = Format(rsF("TglMasuk"), "yyyy-MM-dd HH:mm:ss")
                        
                        rsF.MoveNext
                        
                        
                    Next i
                        
                    'Untuk kasus naik kelas berkali-kali di hari yang sama
                    intLamaHariRawatNaikKelas = intLamaHariRawatNaikKelas - intCountHariYgSama
                    intCountHariYgSama = 0
                
                End If
                
                
                'Ada perawatan intensif
                strSQL = "Select Value From SettingGlobal Where Prefix='KdKelasIntensif'"
                Call eksekusiQuery(rsE, strSQL)
                If rsE.RecordCount <> 0 Then
                    strKdKelasIntensif = rsE("Value")
                Else
                    strKdKelasIntensif = "08"
                End If
                    
                
                strSQL = "Select TglMasuk, TglKeluar From V_DerajatKelasPemakaianKamar Where NoPendaftaran='" & ParamNoPendaftaran & "' And KdKelasPel='" & strKdKelasIntensif & "'"
                Call eksekusiQuery(rsE, strSQL)
                If rsE.RecordCount <> 0 Then
                    
                    strAdaPerawatanIntensif = "1"
                    
                    For i = 1 To rsE.RecordCount
                        
                        'Untuk kasus masuk intensif berkali-kali di hari yang sama
                        If DateDiff("d", dateTglMasukIntensifSebelumnya, rsE("TglMasuk")) = 0 Then
                            intCountHariYgSama = intCountHariYgSama + 1
                        End If
                        
                        If DateDiff("d", rsE("TglMasuk"), rsE("TglKeluar")) = 0 Then
                            intLamaHariRawatIntensif = intLamaHariRawatIntensif + 1
                        Else
                            intLamaHariRawatIntensif = intLamaHariRawatIntensif + (DateDiff("d", rsE("TglMasuk"), rsE("TglKeluar")) + 1)
                        End If
                        rsE.MoveNext
                    Next i
                    
                    'Untuk kasus masuk intensif berkali-kali di hari yang sama
                    intLamaHariRawatNaikKelas = intLamaHariRawatNaikKelas - intCountHariYgSama
                    
                Else
                    strAdaPerawatanIntensif = 0
                End If
                
                
                
            End If

            
            '2+2=5, untuk kasus pasien titipan
            If cekStatusPasienTitipan(ParamNoPendaftaran) = True Then
                strAdaKenaikanKelas = 0
            End If
            
            
            
             If strGlobalINACBGVersiEklaim = "5.2" Then
'                strTmpBalikanDariWebServiceINACBGS = context.SyncronPasien(rs("NoKartu"), rs("NoSJP"), rs("NoCM"), rs("NamaPasien"), _
'                                                                        Format(rs("TglLahir"), "yyyy-MM-dd HH:mm:ss"), IIf(rs("JenisKelamin") = "L", "1", "2"), _
'                                                                        strDiagnosa, strDiagnosaTindakan, strCaraPulang, strJenisRawat, _
'                                                                        Format(rs("TglMasuk"), "yyyy-MM-dd HH:mm:ss"), _
'                                                                        Format(rs("TglPulang"), "yyyy-MM-dd HH:mm:ss"), _
'                                                                        strKelasPerawatan, _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Prosedur Non Bedah"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Prosedur Bedah"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Konsultasi"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Tenaga Ahli"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Keperawatan"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Penunjang"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Radiologi"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Laboratorium"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Pelayanan Darah"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Rehabilitasi"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Kamar / Akomodasi"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Rawat Intensif"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Obat"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Alkes"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "BMHP"), _
'                                                                        getDetailTarif(ParamNoPendaftaran, "Sewa Alat"), _
'                                                                        curBiayaTambahanPoliEksekutif, strNamaDokter, strGlobalINACBGKodeTarifRs, strGlobalINACBGJenisPasienId, _
'                                                                        strGlobalINACBGJenisPasienNama, strGlobalINACBGNIKPegawai, strAdaKenaikanKelas, strNamaKelasTertinggiNaikKelas, _
'                                                                        intLamaHariRawatNaikKelas, ParamKoefisienTambahanBiayaKeVIP, strAdaPerawatanIntensif, intLamaHariRawatIntensif, strBeratBadan)
'
'
                strTmpBalikanDariWebServiceINACBGS = context.SyncronPasien(Replace(rs("NoKartu"), vbNewLine, "", , , vbTextCompare), Replace(rs("NoSJP"), vbNewLine, "", , , vbTextCompare), rs("NoCM"), rs("NamaPasien"), _
                                                                        Format(rs("TglLahir"), "yyyy-MM-dd HH:mm:ss"), IIf(rs("JenisKelamin") = "L", "1", "2"), _
                                                                        strDiagnosa, strDiagnosaTindakan, strCaraPulang, strJenisRawat, _
                                                                        Format(rs("TglMasuk"), "yyyy-MM-dd HH:mm:ss"), _
                                                                        Format(rs("TglMasuk"), "yyyy-MM-dd HH:mm:ss"), _
                                                                        strKelasPerawatan, _
                                                                        getDetailTarif(ParamNoPendaftaran, "Prosedur Non Bedah"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "Prosedur Bedah"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "Konsultasi"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "Tenaga Ahli"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "Keperawatan"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "Penunjang"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "Radiologi"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "Laboratorium"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "Pelayanan Darah"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "Rehabilitasi"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "Kamar / Akomodasi"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "Rawat Intensif"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "Obat"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "Alkes"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "BMHP"), _
                                                                        getDetailTarif(ParamNoPendaftaran, "Sewa Alat"), _
                                                                        curBiayaTambahanPoliEksekutif, Replace(strNamaDokter, vbNewLine, "", , , vbTextCompare), strGlobalINACBGKodeTarifRs, rs("JenisPasienID"), _
                                                                        rs("JenisPasienNama"), strGlobalINACBGNIKPegawai, strAdaKenaikanKelas, strNamaKelasTertinggiNaikKelas, _
                                                                        intLamaHariRawatNaikKelas, ParamKoefisienTambahanBiayaKeVIP, strAdaPerawatanIntensif, intLamaHariRawatIntensif, strBeratBadan)
                
                
            Else
                strTmpBalikanDariWebServiceINACBGS = context.SyncronPasien51(rs("NoKartu"), _
                                                                    rs("NoSJP"), _
                                                                    rs("NoCM"), _
                                                                    rs("NamaPasien"), _
                                                                    Format(rs("TglLahir"), "yyyy-MM-dd HH:mm:ss"), _
                                                                    IIf(rs("JenisKelamin") = "L", "1", "2"), _
                                                                    strDiagnosa, _
                                                                    strDiagnosaTindakan, _
                                                                    strCaraPulang, _
                                                                    strJenisRawat, _
                                                                    Format(rs("TglMasuk"), "yyyy-MM-dd HH:mm:ss"), _
                                                                    Format(rs("TglMasuk"), "yyyy-MM-dd HH:mm:ss"), _
                                                                    strKelasPerawatan, _
                                                                    Format(ParamTotalBiaya), _
                                                                    curBiayaTambahanPoliEksekutif, _
                                                                    strNamaDokter, _
                                                                    strGlobalINACBGKodeTarifRs, _
                                                                    strGlobalINACBGJenisPasienId, _
                                                                    strGlobalINACBGJenisPasienNama, _
                                                                    strGlobalINACBGNIKPegawai, _
                                                                    strAdaKenaikanKelas, _
                                                                    strNamaKelasTertinggiNaikKelas, _
                                                                    intLamaHariRawatNaikKelas, _
                                                                    ParamKoefisienTambahanBiayaKeVIP, strAdaPerawatanIntensif, intLamaHariRawatIntensif)
            End If
                
                
            
'            MsgBox strTmpBalikanDariWebServiceINACBGS
            SyncronINACBGPerPasien = strTmpBalikanDariWebServiceINACBGS
            
'            If UCase(strTmpBalikanDariWebServiceINACBGS) = "SUKSES" Then
'                sp_ADDKegiatanGrouping dbcmd, ParamNoPendaftaran, "Grouping"
'            End If
            
'            SyncronINACBGPerPasien = ""
            
            'Global
            strGlobalAdaKenaikanKelas = strAdaKenaikanKelas
            strGlobalKelasPerawatan = strKelasPerawatan
            strGlobalNamaKelasTertinggiNaikKelas = strNamaKelasTertinggiNaikKelas
                
        End If
    End If

    'Kalau eksekusi code sudah sampai sini dianggap sukses
    SyncronINACBGPerPasien = "Sukses"
Exit Function

duaTambahDuaSamaDenganLima:

Call pesanError
'Resume 0

End Function
Private Function getDetailTarif(ParamNoPendaftaran As String, ParamNamaDetailTarif As String) As Currency
    On Error GoTo duaDuaLima
   
    Dim tmpTotalBiayaDarah As Currency
    Dim strKdRuanganBankDarah As String
    
    strKdRuanganBankDarah = cariSettingGlobal("KdRuanganBankDarah")
    If Trim(strKdRuanganBankDarah) = "" Then strKdRuanganBankDarah = "010"
    
    getDetailTarif = 0
    tmpTotalBiayaDarah = 0
    If ParamNamaDetailTarif = "Obat" Then
        strSQLe = "Select Sum(TotalBiaya) As 'DetailTarif' From V_DaftarObatAlkesEklaim Where NoPendaftaran='" & ParamNoPendaftaran & "' And KdDetailJenisBarang <>'00001' And KdRuangan<>'" & strKdRuanganBankDarah & "'"
        Call eksekusiQuery(rsE, strSQLe)
    ElseIf ParamNamaDetailTarif = "Alkes" Then
        strSQLe = "Select Sum(TotalBiaya) As 'DetailTarif' From V_DaftarObatAlkesEklaim Where NoPendaftaran='" & ParamNoPendaftaran & "' And KdDetailJenisBarang='00001'"
        Call eksekusiQuery(rsE, strSQLe)
    Else
        strSQLe = "Select Sum(Tarif) As 'DetailTarif' From V_DetailTarif Where NoPendaftaran='" & ParamNoPendaftaran & "' And NamaDetailTarif='" & ParamNamaDetailTarif & "'"
        Call eksekusiQuery(rsE, strSQLe)
    End If
    
'    Debug.Print strsqlE
    
    If rsE.RecordCount > 0 Then
        If IsNull(rsE("DetailTarif")) = False Then
            If ParamNamaDetailTarif = "Pelayanan Darah" Then
                strSQLe = "Select Sum(TotalBiaya) As 'DetailTarif' From V_DaftarObatAlkesEklaim Where NoPendaftaran='" & ParamNoPendaftaran & "' And KdRuangan='" & strKdRuanganBankDarah & "'"
                Call eksekusiQuery(rsZ, strSQLe)
                If rsZ.RecordCount > 0 Then
                    If IsNull(rsZ("DetailTarif")) = False Then
                        getDetailTarif = CCur(rsE("DetailTarif")) + CCur(rsZ("DetailTarif"))
                    Else
                        getDetailTarif = rsE("DetailTarif")
                    End If
                Else
                    getDetailTarif = rsE("DetailTarif")
                End If
            Else
            
                getDetailTarif = rsE("DetailTarif")
'                currGlobalTmpTotalDetailTarif = currGlobalTmpTotalDetailTarif + rsE("DetailTarif")
                
            End If
            
        Else
            If ParamNamaDetailTarif = "Pelayanan Darah" Then
                strSQLe = "Select Sum(TotalBiaya) As 'DetailTarif' From V_DaftarObatAlkesEklaim Where NoPendaftaran='" & ParamNoPendaftaran & "' And KdRuangan='" & strKdRuanganBankDarah & "'"
                Call eksekusiQuery(rsZ, strSQLe)
                If rsZ.RecordCount > 0 Then
                    If IsNull(rsZ("DetailTarif")) = False Then
                        getDetailTarif = rsZ("DetailTarif")
'                        currGlobalTmpTotalDetailTarif = currGlobalTmpTotalDetailTarif + rsz("DetailTarif")
                    Else
                        getDetailTarif = 0
                    End If
                    
                    
                End If
            End If
        End If
    End If
            
    getDetailTarif = FormatCurrency(getDetailTarif, 2)
    currGlobalTmpTotalDetailTarif = currGlobalTmpTotalDetailTarif + getDetailTarif
    
    Exit Function
    
duaDuaLima:
    Call pesanError
    
'Resume 0
End Function

Public Function cekStatusPasienTitipan(ParamNoPendaftaran As String) As Boolean

    strSQLz = "Select NoPendaftaran From PasienTitipan Where NoPendaftaran='" & ParamNoPendaftaran & "'"
    Call eksekusiQuery(rsZ, strSQLz)
    If rsZ.RecordCount > 0 Then
        cekStatusPasienTitipan = True
    Else
        cekStatusPasienTitipan = False
    End If

End Function

Public Sub InsertValueDariArrayHasilGrouperKeVariabel(ParamArrHasilSimulasiTarifGrouper() As String)

On Error GoTo duaTambahDuaSamaDenganLima

Dim strTmpSpecialCMGOptionCode As String
Dim strTmpSpecialCMGOptionDescription As String
Dim intCountingSpecialCMGOption As Integer

intCountingSpecialCMGOption = 0

currGlobalTarifCBG = 0
currGlobalTarifSubAcute = 0
currGlobalTarifChronic = 0
currGlobalBiayaTambahan = 0
currGlobalTarifINACBGKelas1 = 0
currGlobalTarifINACBGKelas2 = 0
currGlobalTarifINACBGKelas3 = 0

currGlobalTotalSpecialCMG = 0


Dim i As Integer
Dim j As Integer

j = 1
        For i = LBound(ParamArrHasilSimulasiTarifGrouper) To UBound(ParamArrHasilSimulasiTarifGrouper)
            Dim arr() As String
            arr = Split(ParamArrHasilSimulasiTarifGrouper(i), ":")
            Select Case arr(0)
                    
                    Case "response->cbg->tariff"
                        currGlobalTarifCBG = CCur(cekArrayTarif(arr(1)))
                        
                    Case "response->sub_acute->tariff"
                        currGlobalTarifSubAcute = CCur(cekArrayTarif(arr(1)))
                         
                    Case "response->chronic->tariff"
                        currGlobalTarifChronic = CCur(cekArrayTarif(arr(1)))
                        
                    Case "response->add_payment_amt"
                        currGlobalBiayaTambahan = CCur(cekArrayTarif(arr(1)))
                    
                    
                    Case "special_cmg_option->code"
                        strTmpSpecialCMGOptionCode = arr(1)
                        
                    Case "special_cmg_option->description"
                        strTmpSpecialCMGOptionDescription = arr(1)
                        
                    Case "special_cmg_option->type"
                        If strTmpSpecialCMGOptionCode <> "" And strTmpSpecialCMGOptionDescription <> "" Then
                            
                            ReDim Preserve globalSpecialCMGOption(intCountingSpecialCMGOption + 1)
                            globalSpecialCMGOption(intCountingSpecialCMGOption).Code = strTmpSpecialCMGOptionCode
                            globalSpecialCMGOption(intCountingSpecialCMGOption).Description = strTmpSpecialCMGOptionDescription
                            globalSpecialCMGOption(intCountingSpecialCMGOption).Type = arr(1)
                            
                            intCountingSpecialCMGOption = intCountingSpecialCMGOption + 1
                            strTmpSpecialCMGOptionCode = ""
                            strTmpSpecialCMGOptionDescription = ""
                        End If
                    
                    
                    Case "response->special_cmg->tariff"
                        currGlobalTotalSpecialCMG = currGlobalTotalSpecialCMG + CCur(cekArrayTarif(arr(1)))
                        
                    Case "tarif_alt->tarif_inacbg"
                        If j = 1 Then
                            If currGlobalTarifINACBGKelas1 = 0 Then
                                currGlobalTarifINACBGKelas1 = CCur(cekArrayTarif(arr(1)))
                            End If
                        End If
                        
                        If j = 2 Then
                            If currGlobalTarifINACBGKelas1 <> 0 Then
                                currGlobalTarifINACBGKelas2 = CCur(cekArrayTarif(arr(1)))
                            End If
                        End If
                        
                        If j = 3 Then
                            If currGlobalTarifINACBGKelas2 <> 0 Then
                                currGlobalTarifINACBGKelas3 = CCur(cekArrayTarif(arr(1)))
                            End If
                        End If
                        j = j + 1
            End Select
        Next i

Exit Sub

duaTambahDuaSamaDenganLima:
Call pesanError

'Resume 0
End Sub

Public Function cekArrayTarif(value As String) As Currency

On Error GoTo duaTambahDuaSamaDenganLima


    cekArrayTarif = value

Exit Function

duaTambahDuaSamaDenganLima:
cekArrayTarif = "0"
End Function

Public Function cariSettingGlobal(ParamPrefix As String, Optional ParamValue As String) As String
On Error GoTo duaDuaLima
Dim strFilterValue As String

    If ParamValue <> "" Then
        strFilterValue = " And Value='" & ParamValue & "'"
    End If

    strSQLz = "Select Value from SettingGlobal Where Prefix='" & ParamPrefix & "'" & strFilterValue
    Call eksekusiQuery(rsM, strSQLz)
    
    If rsM.RecordCount > 0 Then
        cariSettingGlobal = rsM("Value")
    Else
        cariSettingGlobal = ""
    End If

Exit Function
duaDuaLima:
    cariSettingGlobal = ""
    Call pesanError
End Function
