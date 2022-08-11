Attribute VB_Name = "Barcode_128"
'
'
'Public Sub make128()
'Dim X As Long, y As Long, pos As Long
'Dim Bardata As String
'Dim Cur As String
'Dim CurVal As Long
'Dim chksum As Long
'Dim temp As String
'Dim BC(106) As String
'    'code 128 is basically the ASCII chr set.
'    '4 element sizes : 1=narrowest, 4=widest
'    BC(0) = "212222" '<SPC>
'    BC(1) = "222122" '!
'    BC(2) = "222221" '"
'    BC(3) = "121223" '#
'    BC(4) = "121322" '$
'    BC(5) = "131222" '%
'    BC(6) = "122213" '&
'    BC(7) = "122312" ''
'    BC(8) = "132212" '(
'    BC(9) = "221213" ')
'    BC(10) = "221312" '*
'    BC(11) = "231212" '+
'    BC(12) = "112232" ',
'    BC(13) = "122132" '-
'    BC(14) = "122231" '.
'    BC(15) = "113222" '/
'    BC(16) = "123122" '0
'    BC(17) = "123221" '1
'    BC(18) = "223211" '2
'    BC(19) = "221132" '3
'    BC(20) = "221231" '4
'    BC(21) = "213212" '5
'    BC(22) = "223112" '6
'    BC(23) = "312131" '7
'    BC(24) = "311222" '8
'    BC(25) = "321122" '9
'    BC(26) = "321221" ':
'    BC(27) = "312212" ';
'    BC(28) = "322112" '<
'    BC(29) = "322211" '=
'    BC(30) = "212123" '>
'    BC(31) = "212321" '?
'    BC(32) = "232121" '@
'    BC(33) = "111323" 'A
'    BC(34) = "131123" 'B
'    BC(35) = "131321" 'C
'    BC(36) = "112313" 'D
'    BC(37) = "132113" 'E
'    BC(38) = "132311" 'F
'    BC(39) = "211313" 'G
'    BC(40) = "231113" 'H
'    BC(41) = "231311" 'I
'    BC(42) = "112133" 'J
'    BC(43) = "112331" 'K
'    BC(44) = "132131" 'L
'    BC(45) = "113123" 'M
'    BC(46) = "113321" 'N
'    BC(47) = "133121" 'O
'    BC(48) = "313121" 'P
'    BC(49) = "211331" 'Q
'    BC(50) = "231131" 'R
'    BC(51) = "213113" 'S
'    BC(52) = "213311" 'T
'    BC(53) = "213131" 'U
'    BC(54) = "311123" 'V
'    BC(55) = "311321" 'W
'    BC(56) = "331121" 'X
'    BC(57) = "312113" 'Y
'    BC(58) = "312311" 'Z
'    BC(59) = "332111" '[
'    BC(60) = "314111" '\
'    BC(61) = "221411" ']
'    BC(62) = "431111" '^
'    BC(63) = "111224" '_
'    BC(64) = "111422" '`
'    BC(65) = "121124" 'a
'    BC(66) = "121421" 'b
'    BC(67) = "141122" 'c
'    BC(68) = "141221" 'd
'    BC(69) = "112214" 'e
'    BC(70) = "112412" 'f
'    BC(71) = "122114" 'g
'    BC(72) = "122411" 'h
'    BC(73) = "142112" 'i
'    BC(74) = "142211" 'j
'    BC(75) = "241211" 'k
'    BC(76) = "221114" 'l
'    BC(77) = "413111" 'm
'    BC(78) = "241112" 'n
'    BC(79) = "134111" 'o
'    BC(80) = "111242" 'p
'    BC(81) = "121142" 'q
'    BC(82) = "121241" 'r
'    BC(83) = "114212" 's
'    BC(84) = "124112" 't
'    BC(85) = "124211" 'u
'    BC(86) = "411212" 'v
'    BC(87) = "421112" 'w
'    BC(88) = "421211" 'x
'    BC(89) = "212141" 'y
'    BC(90) = "214121" 'z
'    BC(91) = "412121" '{
'    BC(92) = "111143" '|
'    BC(93) = "111341" '}
'    BC(94) = "131141" '~
'    BC(95) = "114113" '<DEL>        *not used in this sub
'    BC(96) = "114311" 'FNC 3        *not used in this sub
'    BC(97) = "411113" 'FNC 2        *not used in this sub
'    BC(98) = "411311" 'SHIFT        *not used in this sub
'    BC(99) = "113141" 'CODE C       *not used in this sub
'    BC(100) = "114131" 'FNC 4       *not used in this sub
'    BC(101) = "311141" 'CODE A      *not used in this sub
'    BC(102) = "411131" 'FNC 1       *not used in this sub
'    BC(103) = "211412" 'START A     *not used in this sub
'    BC(104) = "211214" 'START B
'    BC(105) = "211232" 'START C     *not used in this sub
'    BC(106) = "2331112" 'STOP
'
'    Picture1.Cls
'    If Text1.Text = "" Then Exit Sub
'    pos = 20
'    Bardata = Text1.Text
'
'    'Check for invalid characters, calculate check sum & build temp string
'    For X = 1 To Len(Bardata)
'        Cur = Mid$(Bardata, X, 1)
'        If Cur < " " Or Cur > "~" Then
'            Picture1.Print "Invalid Character(s)"
'            Exit Sub
'        End If
'        CurVal = Asc(Cur) - 32
'        temp = temp + BC(CurVal)
'        chksum = chksum + CurVal * X
'    Next
'
'    'Add start, stop & check characters
'    chksum = (chksum + 104) Mod 103
'    temp = BC(104) & temp & BC(chksum) & BC(106)
'
'    'Generate Barcode
'    For X = 1 To Len(temp)
'        If X Mod 2 = 0 Then
'                'SPACE
'                pos = pos + (Val(Mid$(temp, X, 1))) + Check1(0).Value
'        Else
'                'BAR
'                For y = 1 To (Val(Mid$(temp, X, 1)))
'                    Picture1.Line (pos, 1)-(pos, 58 - Check1(1) * 8)
'                    pos = pos + 1
'                Next
'        End If
'    Next
'
'    'Add Label?
'    If Check1(1).Value Then
'        Picture1.CurrentX = 30 + Len(Bardata) * (3 + Check1(0).Value * 2) 'kinda center
'        Picture1.CurrentY = 50
'        Picture1.Print Bardata;
'    End If
'End Sub
'
