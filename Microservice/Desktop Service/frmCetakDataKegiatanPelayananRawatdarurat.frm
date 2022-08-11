VERSION 5.00
Begin VB.Form frmCetakDataKegiatanPelayananRawatdarurat 
   Caption         =   "Transmedic"
   ClientHeight    =   3135
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4680
   Icon            =   "frmCetakDataKegiatanPelayananRawatdarurat.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3135
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmCetakDataKegiatanPelayananRawatdarurat"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
'made by mario 15/04/12
Option Explicit

'Special Buat Excel
Dim oXL As Excel.Application
Dim oWB As Excel.Workbook
Dim oSheet As Excel.Worksheet
Dim oRng As Excel.Range
Dim oResizeRange As Excel.Range
Dim i, j, k, l As Integer
Dim w, x, Y, z As String
Dim Cell22 As String
Dim Cell23 As String
Dim Cell24 As String
Dim Cell25 As String
Dim Cell26 As String
Dim Cell27 As String
Dim Cell28 As String
'Special Buat Excel
Private Sub cmdTutup_Click()
    Unload Me
End Sub

Public Function Cetak(tglAwal As String)
On Error GoTo error
    
    
    Screen.MousePointer = vbHourglass
    
    'Buka Excel
    Set oXL = CreateObject("Excel.Application")
    
    'Buat Buka Template
    Set oWB = oXL.Workbooks.Open(App.Path & "\Formulir RL 3.2.xlsx")
    Set oSheet = oWB.ActiveSheet
    
    
    strSQL = "SELECT * From profile_m WHERE id=1"
             'and KdRuanganPelayanan= '" & .TextMatrix(j, 0) & "' and Statuspasien='Baru' "
'    Set rsb = Nothing
'    rsb.Open strSQL, dbConn, adOpenForwardOnly, adLockReadOnly
    
    ReadRs strSQL
    
    With oSheet
            .Cells(7, 4) = rs("kodeexternal").Value
            .Cells(8, 4) = rs("namalengkap").Value
            .Cells(9, 4) = tglAwal
    End With
    
    '###################################################---splakuk revision on 2013-07-09
'    oXL.Visible = True

    Set rs = Nothing
    strSQL = "Select distinct NoUrut,JenisPelayanan from V_Master_RL_3_2 order by NoUrut"
'    Call msubRecFO(rs, strSQL)
    ReadRs strSQL
    
    k = 15
    For i = 1 To rs.RecordCount
            
            With oSheet

                strSQL = "Select isnull(sum(Rujukan),0) as Rujukan,isnull(sum(NonRujukan),0) as nonrujukan,isnull(sum(Dirawat),0) as dirawat,isnull(sum(Dirujuk),0) as dirujuk,isnull(sum(Pulang),0) as pulang,isnull(sum(MatidiIGD),0) matidiigd,isnull(sum(Mati),0) as mati from V_RL_3_2 where NoUrut=" & i & " and Year(TglMasuk)='" & tglAwal & "'"
'                Call msubRecFO(rs1, strSQL1)
                ReadRs2 strSQL
                .Cells(k, 5) = RS2(0).Value
                .Cells(k, 6) = RS2(1).Value
                .Cells(k, 7) = RS2(2).Value
                .Cells(k, 8) = RS2(3).Value
                .Cells(k, 9) = RS2(4).Value
                .Cells(k, 10) = RS2(5).Value
                .Cells(k, 11) = RS2(6).Value
                
            End With
'            ProgressBar1.value = Int(ProgressBar1.value) + 1
'            lblPersen.Caption = Int(ProgressBar1.value / rs.RecordCount * 100) & " %"
        k = k + 1
        rs.MoveNext
    Next i
   
'######################################################
    
    
    oXL.Visible = True
    Screen.MousePointer = vbDefault
Exit Function
error:
'    MsgBox "Data Tidak Ada", vbInformation, "Validasi"
'    Call msubPesanError
    MsgBox Err.Description
    
    Screen.MousePointer = vbDefault
'    Resume 0
End Function

Private Sub Form_Unload(Cancel As Integer)
On Error Resume Next
oXL.Quit
End Sub

