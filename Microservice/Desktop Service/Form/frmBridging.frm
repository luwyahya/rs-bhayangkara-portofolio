VERSION 5.00
Begin VB.Form frmBridging 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Elektronik RekamMedis"
   ClientHeight    =   960
   ClientLeft      =   45
   ClientTop       =   375
   ClientWidth     =   5040
   Icon            =   "frmBridging.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   960
   ScaleWidth      =   5040
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmBridging"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Public Function Fungsi(ByVal QueryText As String) As Byte()
'    On Error Resume Next
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
    Dim arrItem() As String
   
    If CN.State = adStateClosed Then Call openConnection
        
    If Len(QueryText) > 0 Then
        arrItem = Split(QueryText, "&")
        Param1 = Split(arrItem(0), "=")
        Param2 = Split(arrItem(1), "=")
        Param3 = Split(arrItem(2), "=")
        Param4 = Split(arrItem(3), "=")
        Param5 = Split(arrItem(4), "=")
        Param6 = Split(arrItem(5), "=")
        Param7 = Split(arrItem(6), "=")
        
        Select Case Param1(0)

            Case "cek-konek"
                Set Root = New JNode
                Root("Status") = "Ok!!"

            Case "cetak-pacs-order"
'                Call frmCetakTindakanAnastesiUmum.Cetak(Param2(1), Param3(1))
                Call BridgingFlatFile(Param2(1), Param3(1), 0)
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "as@epic"

            Case "cetak-pacs-report"
'                Call frmCetakTindakanAnastesiUmum.Cetak(Param2(1), Param3(1))
                Call BridgingFlatFile("report", Param3(1), Param4(1))
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "as@epic"
                
            Case "cetak-hasil-lab"
                Param2 = Split(arrItem(1), "=")
                Param3 = Split(arrItem(2), "=")
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(6), "=")
                Param1 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(7), "=")
                Param8 = Split(arrItem(8), "=")
                Param9 = Split(arrItem(9), "=")
                Param10 = Split(arrItem(10), "=")
                Param11 = Split(arrItem(11), "=")
                Param12 = Split(arrItem(12), "=")
                Call frmExpertiseLaboratorium.Cetak(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param1(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1))
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "@epic"
            Case "cetak-hasil-lab-polri"
                Param2 = Split(arrItem(1), "=")
                Param3 = Split(arrItem(2), "=")
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(6), "=")
                Param1 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(7), "=")
                Param8 = Split(arrItem(8), "=")
                Param9 = Split(arrItem(9), "=")
                Param10 = Split(arrItem(10), "=")
                Param11 = Split(arrItem(11), "=")
                Call frmExpertiseLaboratoriumPolri.CetakPolri(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param1(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1))
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "@epic"
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

Private Sub BridgingFlatFile(jenis As String, norec As String, noorderfromfrontend As String)
    Dim iFileNo As Integer
    iFileNo = FreeFile
    'open the file for writing
    Dim folderOrder As String
    Dim folderReport As String
    
    ReadRs "select * from settingdatafixed_m where id in (1223,1224)"
    
    If rs.RecordCount = 0 Then Exit Sub
    For i = 0 To rs.RecordCount - 1
        If rs("id") = 1223 Then folderOrder = rs!nilaifield
        If rs("id") = 1224 Then folderReport = rs!nilaifield
        rs.MoveNext
    Next
    If jenis = "order" Then
        ReadRs2 "select op.norec as norec_op,pr.id as prid,pr.namaproduk, " & _
                "format(op.tglpelayanan,'yyyyMMddHHmmss') as tglpelayanan,op.qtyproduk ,ru.namaruangan as ruangantujuan,ru.objectdepartemenfk, " & _
                "op.strukorderfk,so.objectruangantujuanfk, " & _
                "dpm.namadepartemen, " & _
                "pps.norec as norec_pp,so.objectpegawaiorderfk,pg.namalengkap as namadokter, " & _
                "ps.nocm,ps.namapasien,format(ps.tgllahir,'yyyyMMdd') as tgllahir,jk.kodeexternal as mf,so.noorder, " & _
                "case WHEN jp.namaexternal is null then 'DX' else jp.namaexternal end as modality " & _
                "from orderpelayanan_t op " & _
                "left join strukorder_t as so on so.norec=op.strukorderfk " & _
                "left join pegawai_m as pg on pg.id=so.objectpegawaiorderfk " & _
                "left join pasiendaftar_t as pd on pd.norec=so.noregistrasifk " & _
                "left join pasien_m as ps on ps.id=pd.nocmfk " & _
                "left join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
                "INNER JOIN produk_m as pr on pr.id=op.objectprodukfk " & _
                "INNER JOIN detailjenisproduk_m as djp On djp.id=pr.objectdetailjenisprodukfk " & _
                "LEFT JOIN jenisproduk_m as jp On jp.id=djp.objectjenisprodukfk " & _
                "left join ruangan_m as ru on ru.id =so.objectruangantujuanfk " & _
                "left join departemen_m as dpm on dpm.id=ru.objectdepartemenfk " & _
                "left JOIN pelayananpasien_t as pps on pps.strukorderfk=so.norec " & _
                "and op.objectprodukfk =pps.produkfk " & _
                "where op.strukorderfk='" & norec & "' " & _
                "ORDER by op.tglpelayanan"
                
        If RS2.RecordCount = 0 Then Exit Sub
        RS2.MoveFirst
        Dim noOrder As String
        Dim pathh As String
        Dim fso As New FileSystemObject
        For i = 0 To RS2.RecordCount - 1
            noOrder = Right(RS2!noOrder, 10) & i + 1
            'Open folderOrder & "\ORD" & noorder & ".txt" For Output As #iFileNo
            pathh = "C:/ORD" & noOrder & ".txt"
            Open pathh For Output As #iFileNo
            'please note, if this file already exists it will be overwritten!
            
            'write some example text to the file
            Dim strTxt As String
            strTxt = "" & noOrder & "|" & RS2!tglpelayanan & "|ANY|||" & RS2!modality & "|" & RS2!tglpelayanan & "|" & RS2!modality & "|" & RS2!modality & "||" & _
                    "" & RS2!prid & "|" & RS2!namaproduk & "||120|||" & RS2!prid & "|" & RS2!namaproduk & "|" & RS2!namaproduk & "||||" & _
                    "1.2.410.2000010.82.121.300860727." & noOrder & "|||" & noOrder & "|" & _
                    "" & RS2!objectpegawaiorderfk & "||||" & RS2!namaDokter & "|" & RS2!namadepartemen & "||||||||||" & _
                    "" & RS2!namapasien & "|" & RS2!noCm & "|||" & RS2!tgllahir & "|" & RS2!mf & "||||||||||||"
            Print #iFileNo, strTxt
            
            'close the file (if you dont do this, you wont be able to open it again!)
            Close #iFileNo
            'Shell ("cmd.exe /c copy " & Replace(pathh, "/", "\") & " K:\")
            Shell ("cmd.exe /c copy " & Replace(pathh, "/", "\") & " " & folderOrder & " ")
           ' fso.CopyFile pathh, "K:\", True
            
            RS2.MoveNext
        Next
    Else
        ReadRs2 "select hr.*,ps.nocm,ps.namapasien,pp.produkfk,pg.namalengkap as namadokter,hr.pegawaifk " & _
                "from hasilradiologi_t as hr " & _
                "INNER JOIN pasiendaftar_t as pd on pd.norec=hr.noregristrasifk " & _
                "INNER JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
                "INNER JOIN pelayananpasien_t as pp on pp.norec=hr.pelayananpasienfk " & _
                "INNER JOIN pegawai_m as pg on pg.id=hr.pegawaifk where pelayananpasienfk='" & norec & "'"
                
        If RS2.RecordCount = 0 Then Exit Sub
        RS2.MoveFirst
'        Dim noorder As String
        For i = 0 To RS2.RecordCount - 1
            noOrder = Right(noorderfromfrontend, 11) 'RS2!norec ' Right(RS2!noorder, 10) & i + 1
'            Open folderReport & "\RES" & noorder & ".txt" For Output As #iFileNo
            
            pathh = "C:/RES" & noOrder & ".txt"
            Open pathh For Output As #iFileNo

            
            'please note, if this file already exists it will be overwritten!
            
            'write some example text to the file
            Dim kodekode As String
            Dim Tgl As String
            Tgl = Format(RS2!tanggal, "yyyyMMddHHmmss")
            
            kodekode = "" & noOrder & "|" & Tgl & "|ANY|" & noOrder & "|" & RS2!noCm & "|240|||||" & _
                     "" & RS2!ProdukFk & "|||||" & RS2!pegawaifk & "|" & RS2!namaDokter & "|" & Tgl & "|||||" & _
                     "" & RS2!Keterangan & "|"
            Print #iFileNo, kodekode
            
            'close the file (if you dont do this, you wont be able to open it again!)
            Close #iFileNo
            
            Shell ("cmd.exe /c copy " & Replace(pathh, "/", "\") & " " & folderReport & " ")
            
            RS2.MoveNext
        Next
    End If
    
    
    
End Sub


