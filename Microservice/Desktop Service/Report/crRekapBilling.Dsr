VERSION 5.00
Begin {BD4B4E61-F7B8-11D0-964D-00A0C9273C2A} crRekapBilling 
   ClientHeight    =   9630
   ClientLeft      =   0
   ClientTop       =   0
   ClientWidth     =   15855
   OleObjectBlob   =   "crRekapBilling.dsx":0000
End
Attribute VB_Name = "crRekapBilling"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub Section12_Format(ByVal pFormattingInfo As Object)
'kata bo rose tgl 26oktober 2017, pasien tidak mendapatkan billing
'sehingga terbilang ke tagihan perusahaan

    Dim x As Double
    x = Round(ucJumlahBill.Value)
    'txtPembulatan.SetText Format(x, "##,##0.00")

    x = CDbl(ucDitanggungPerusahaan.Value) 'Round(CDbl(ucDitanggungPerusahaan.Value))
  '  a.SetText Format(x, "##,##0.#0")
    x = CDbl(ucDitanggungRS.Value) 'Round(CDbl(ucDitanggungRS.Value))
    'b.SetText Format(x, "##,##0.#0")
    x = CDbl(UnboundCurrency1.Value) 'Round(CDbl(ucDitanggungSendiri.Value))
'    If x < 0 Then
'        c.SetText Format(x, "##,##0.#0")
'    Else
'        c.SetText Format(x, "##,##0.#0")
'    End If
'    X = CDbl(ucSurplusMinusRS.Value) 'Round(CDbl(ucSurplusMinusRS.Value))
'    d.SetText Format(X, "##,##0.#0")
'
'    'If usTipe.Value = "Umum/Pribadi" Then
'    If CDbl(ucDitanggungPerusahaan.Value) = 0 Then
''        txtTerbilang.SetText "# " & TerbilangDesimal(txtPembulatan.Text) & " #"
        txtTerbilang.SetText "# " & TerbilangDesimal(Round(ucTotalTotal.Value, 2)) & " #"
'    Else
'        txtTerbilang.SetText "# " & TerbilangDesimal(ucDitanggungPerusahaan.Value) & " #"
'    End If

'    ucJumlahBill.Value = Replace(txtPembulatan.Text, ".", ",")
'    txtTerbilang.SetText "# " & TerbilangDesimal(Replace(txtPembulatan.Text, ".", ",")) & " #"
    
End Sub
