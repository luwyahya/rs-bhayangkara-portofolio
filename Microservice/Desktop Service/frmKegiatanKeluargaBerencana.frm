VERSION 5.00
Begin VB.Form frmKegiatanKeluargaBerencana 
   Caption         =   "Form1"
   ClientHeight    =   3135
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4680
   Icon            =   "frmKegiatanKeluargaBerencana.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3135
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmKegiatanKeluargaBerencana"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
'made by mario 19/04/12
Option Explicit

'Special Buat Excel
Dim oXL As Excel.Application
Dim oWB As Excel.Workbook
Dim oSheet As Excel.Worksheet
Dim oRng As Excel.Range
Dim oResizeRange As Excel.Range
Dim i, j, k, l As Integer
Dim w, x, Y, z As String
Dim Cell3 As String
Dim Cell4 As String
Dim Cell5 As String
Dim Cell7 As String
Dim Cell8 As String
Dim Cell9 As String
'Special Buat Excel

Private Sub cmdTutup_Click()
    Unload Me
End Sub


Public Function Cetak(tglAwal As String)
On Error GoTo error
    
    
    Screen.MousePointer = vbHourglass
    
    'Buka Excel
    Set oXL = CreateObject("Excel.Application")
'    oXL.Visible = True
    'Buat Buka Template
    Set oWB = oXL.Workbooks.Open(App.Path & "\Formulir RL 3.12.xlsx")
    Set oSheet = oWB.ActiveSheet



    strSQL = "SELECT * From profile_m WHERE id='1'"
             'and KdRuanganPelayanan= '" & .TextMatrix(j, 0) & "' and Statuspasien='Baru' "
    ReadRs strSQL
    
    With oSheet
            .Cells(7, 4) = rs("kodeexternal").Value
            .Cells(8, 4) = rs("namalengkap").Value
            .Cells(9, 4) = tglAwal
    End With
    
    '###################################################---splakuk revision on 2013-09-30
'    oXL.Visible = True

    Set rs = Nothing
    strSQL = "Select distinct KdJenisKontrasepsi,JenisKontrasepsi from V_RL_3_12 order by KdJenisKontrasepsi"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    k = 14
    For i = 1 To rs.RecordCount

            With oSheet

                strSQL2 = "Select isnull(count(NoCM),0),isnull(SUM(ANC),0),isnull(SUM(PascaPersalinan),0),isnull(SUM(BukanRujukan),0),isnull(SUM(RujukanRI),0), " & _
                        "isnull(SUM(RujukanRJ),0),isnull(SUM(Nifas),0),isnull(SUM(Abortus),0),isnull(SUM(Lainnya),0),isnull(SUM(KunjunganUlang),0), " & _
                        "isnull(SUM(JmlEfek),0),isnull(SUM(DirujukKeatas),0) from V_RL_3_12 where KdJenisKontrasepsi='" & rs(0).Value & "' and Year(TglPeriksa)='" & tglAwal & "' "
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL2
                .Cells(k, 5) = RS2(1).Value 'anc
                .Cells(k, 6) = RS2(2).Value 'pasca persalinan
                .Cells(k, 7) = RS2(3).Value 'bukan rujukan
                .Cells(k, 8) = RS2(4).Value 'rujukan RI
                .Cells(k, 9) = RS2(5).Value 'rujukan RJ
                .Cells(k, 11) = RS2(6).Value 'nifas
                .Cells(k, 12) = RS2(7).Value 'abortus
                .Cells(k, 13) = RS2(8).Value 'lainnya
                .Cells(k, 14) = RS2(9).Value 'kunjungan ulang
                .Cells(k, 15) = RS2(10).Value 'jmlkeluhan
                .Cells(k, 16) = RS2(11).Value 'dirujuka keatas
                
            End With
        k = k + 1
        rs.MoveNext
        
    Next i
   
'######################################################

    oXL.Visible = True
    Screen.MousePointer = vbDefault
Exit Function
error:
'    Call msubPesanError
    MsgBox Err.Description
    Screen.MousePointer = vbDefault
End Function

Private Sub Form_Unload(Cancel As Integer)
On Error Resume Next
oXL.Quit
End Sub


