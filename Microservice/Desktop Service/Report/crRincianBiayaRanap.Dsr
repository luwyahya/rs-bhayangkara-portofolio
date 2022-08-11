VERSION 5.00
Begin {BD4B4E61-F7B8-11D0-964D-00A0C9273C2A} crRincianBiayaRanap 
   ClientHeight    =   6615
   ClientLeft      =   0
   ClientTop       =   0
   ClientWidth     =   16305
   OleObjectBlob   =   "crRincianBiayaRanap.dsx":0000
End
Attribute VB_Name = "crRincianBiayaRanap"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
''Private Sub Section11_Format(ByVal pFormattingInfo As Object)
''kata bo rose tgl 26oktober 2017, pasien tidak mendapatkan billing
''sehingga terbilang ke tagihan perusahaan
''
''    Dim X As Double
''    X = Round(ucJumlahBill.Value)
''    txtPembulatan.SetText Format(X, "##,##0.00")
''
''    X = CDbl(ucDitanggungPerusahaan.Value) 'Round(CDbl(ucDitanggungPerusahaan.Value))
''    a.SetText Format(X, "##,##0.#0")
''    X = CDbl(ucDitanggungRS.Value) 'Round(CDbl(ucDitanggungRS.Value))
''    b.SetText Format(X, "##,##0.#0")
''    X = CDbl(ucDitanggungSendiri.Value) 'Round(CDbl(ucDitanggungSendiri.Value))
''    If X < 0 Then
''        c.SetText Format(X, "##,##0.#0")
''    Else
''        c.SetText Format(X, "##,##0.#0")
''    End If
''    X = CDbl(ucSurplusMinusRS.Value) 'Round(CDbl(ucSurplusMinusRS.Value))
''    d.SetText Format(X, "##,##0.#0")
''
''    If usTipe.Value = "Umum/Pribadi" Then
''
''
''    ucJumlahBill.Value = Replace(txtPembulatan.Text, ".", ",")
''    txtTerbilang.SetText "# " & TerbilangDesimal(Replace(txtPembulatan.Text, ".", ",")) & " #"
''
''End Sub

Private Sub Section14_Format(ByVal pFormattingInfo As Object)
    Dim x As Double
    x = Round(ucJumlahBill.Value)
    txtPembulatan.SetText Format(x, "##,##0.00")

    x = CDbl(ucDitanggungPerusahaan.Value) 'Round(CDbl(ucDitanggungPerusahaan.Value))
    a.SetText Format(x, "##,##0.#0")
    x = CDbl(ucDitanggungRS.Value) 'Round(CDbl(ucDitanggungRS.Value))
    b.SetText Format(x, "##,##0.#0")
    x = CDbl(ucDitanggungSendiri.Value) 'Round(CDbl(ucDitanggungSendiri.Value))
    'If X < 0 Then
        c.SetText Format(x, "##,##0.#0")
    'Else
        'c.SetText Format(X, "##,##0.#0")
    'End If
    x = CDbl(ucSurplusMinusRS.Value) 'Round(CDbl(ucSurplusMinusRS.Value))
    d.SetText Format(x, "##,##0.#0")

    'If usTipe.Value = "Umum/Pribadi" Then

'    ucJumlahBill.Value = Replace(txtPembulatan.Text, ".", ",")
'    txtTerbilang.SetText "# " & TerbilangDesimal(Replace(txtPembulatan.Text, ".", ",")) & " #"
    If CDbl(ucDitanggungPerusahaan.Value) = 0 Then
'        txtTerbilang.SetText "# " & TerbilangDesimal(txtPembulatan.Text) & " #"
        txtTerbilang.SetText "# " & TerbilangDesimal(ucJumlahBill.Value) & " #"
    Else
        txtTerbilang.SetText "# " & TerbilangDesimal(ucDitanggungPerusahaan.Value) & " #"
    End If
    
End Sub

