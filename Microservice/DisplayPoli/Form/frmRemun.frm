VERSION 5.00
Begin VB.Form frmRemun 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Remun"
   ClientHeight    =   1035
   ClientLeft      =   45
   ClientTop       =   375
   ClientWidth     =   4005
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
        Param8 = Split(arrItem(7), "=")
        Param9 = Split(arrItem(8), "=")
        Param10 = Split(arrItem(9), "=")
        Param11 = Split(arrItem(10), "=")
        

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
                '127.0.0.1:2905/printvb/kasir?cetak-billing=1&noregistrasi=1707000053&view=false
                
             Case "cetak-laporan-detail-remunerasi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmLaporanDetailRemunerasi.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Detail Remunerasi!!"
                '127.0.0.1:2905/printvb/kasir?cetak-billing=1&noregistrasi=1707000053&view=false
                
            Case "cetak-laporan-rekap-remunerasi"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Call frmLaporanRekapRemunerasi.CetakLaporan(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Rekap Remunerasi!!"
                '127.0.0.1:2905/printvb/kasir?cetak-billing=1&noregistrasi=1707000053&view=false
                
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
                '127.0.0.1:2905/printvb/kasir?cetak-billing=1&noregistrasi=1707000053&view=false
                
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
                '127.0.0.1:2905/printvb/kasir?cetak-billing=1&noregistrasi=1707000053&view=false
                
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
        Kasir = .Read(adReadAll)
        .Close
    End With
    If CN.State = adStateOpen Then CN.Close
    Unload Me
    Exit Function
    
errLoad:
End Function
