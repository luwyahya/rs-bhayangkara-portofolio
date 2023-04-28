VERSION 5.00
Begin {BD4B4E61-F7B8-11D0-964D-00A0C9273C2A} Cr_cetakBuktiPendaftaran 
   ClientHeight    =   9630
   ClientLeft      =   0
   ClientTop       =   0
   ClientWidth     =   14010
   OleObjectBlob   =   "Cr_cetakBuktiPendaftaran.dsx":0000
End
Attribute VB_Name = "Cr_cetakBuktiPendaftaran"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub Section6_Format(ByVal pFormattingInfo As Object)
    If usruid.Value = 567 Then  'KLINIK GERIATRI
        txtHurufNoAntri.SetText ("A")
    ElseIf usruid.Value = 566 Then    ' PK006   KLINIK JIWA DEWASA
        txtHurufNoAntri.SetText ("B")
    ElseIf usruid.Value = 563 Then  'PK001 KLINIK MEDIKOLEGAL
        txtHurufNoAntri.SetText ("C")
    ElseIf usruid.Value = 564 Then    'PK002   KLINIK NAPZA
        txtHurufNoAntri.SetText ("D")
    Else
        txtHurufNoAntri.SetText ("")
    End If
    
End Sub

Private Sub Section9_Format(ByVal pFormattingInfo As Object)
    If tglreservasi.Value = "" Then
        Section9.Suppress = True
    End If
End Sub
