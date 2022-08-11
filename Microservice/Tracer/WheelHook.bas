Attribute VB_Name = "WheelHook"
Public MyProperty As Object
Public Const MK_CONTROL = &H8
Public Const MK_LBUTTON = &H1
Public Const MK_RBUTTON = &H2
Public Const MK_MBUTTON = &H10
Public Const MK_SHIFT = &H4
Public Const GWL_WNDPROC = -4
Public Const WM_MOUSEWHEEL = &H20A
Public LocalHwnd As Long
Public LocalPrevWndProc As Long
Public MyControl As Object
Public Declare Function CallWindowProc Lib "user32.dll" Alias _
"CallWindowProcA" (ByVal lpPrevWndFunc As Long, ByVal hWnd As Long, _
ByVal msg As Long, _
ByVal wParam As Long, ByVal lParam As Long) As Long
Public Declare Function SetWindowLong Lib "user32.dll" Alias _
"SetWindowLongA" (ByVal hWnd As Long, ByVal nIndex As Long, ByVal dwNewLong _
As Long) As Long
'Mouse Wheel for FlexGrid
Private Declare Function GetProp Lib "user32.dll" Alias "GetPropA" ( _
                ByVal hWnd As Long, _
                ByVal lpString As String) As Long

Private Declare Function SetProp Lib "user32.dll" Alias "SetPropA" ( _
                ByVal hWnd As Long, _
                ByVal lpString As String, _
                ByVal hData As Long) As Long

Private Declare Function RemoveProp Lib "user32.dll" Alias "RemovePropA" ( _
                ByVal hWnd As Long, _
                ByVal lpString As String) As Long

' Hooking
Private Declare Function CallWindowProcFlexGrid Lib "user32.dll" Alias "CallWindowProcA" ( _
                ByVal lpPrevWndFunc As Long, _
                ByVal hWnd As Long, _
                ByVal msg As Long, _
                ByVal wParam As Long, _
                ByVal lParam As Long) As Long

Private Declare Function SetWindowLongFlexGrid Lib "user32.dll" Alias "SetWindowLongA" ( _
                ByVal hWnd As Long, _
                ByVal nIndex As Long, _
                ByVal dwNewLong As Long) As Long

Private Declare Function SendMessage Lib "user32.dll" Alias "SendMessageA" ( _
                ByVal hWnd As Long, _
                ByVal msg As Long, _
                wParam As Any, _
                lParam As Any) As Long

' Position Checking
Private Declare Function GetWindowRect Lib "user32" ( _
                ByVal hWnd As Long, _
                lpRect As RECT) As Long
                
Private Declare Function GetParent Lib "user32" ( _
                ByVal hWnd As Long) As Long

'Private Const GWL_WNDPROC = -4
'Private Const WM_MOUSEWHEEL = &H20A
Private Const CB_GETDROPPEDSTATE = &H157

Private Type RECT
  Left As Long
  Top As Long
  Right As Long
  Bottom As Long
End Type
'-------------------------

' Hook / UnHook
' ================================================
Public Sub WheelHookFlexGrid(ByVal hWnd As Long)
  On Error Resume Next
  SetProp hWnd, "PrevWndProc", SetWindowLongFlexGrid(hWnd, GWL_WNDPROC, AddressOf WindowProcFlexGrid)
End Sub

Public Sub WheelUnHookFlexGrid(ByVal hWnd As Long)
  On Error Resume Next
  SetWindowLongFlexGrid hWnd, GWL_WNDPROC, GetProp(hWnd, "PrevWndProc")
  RemoveProp hWnd, "PrevWndProc"
End Sub
' Check Messages
' WheelHook FlexGrid================================================
Private Function WindowProcFlexGrid(ByVal Lwnd As Long, ByVal Lmsg As Long, ByVal wParam As Long, ByVal lParam As Long) As Long
  Dim MouseKeys As Long
  Dim Rotation As Long
  Dim Xpos As Long
  Dim Ypos As Long
  Dim fFrm As Form

  Select Case Lmsg
  
    Case WM_MOUSEWHEEL
    
      MouseKeys = wParam And 65535
      Rotation = wParam / 65536
      Xpos = lParam And 65535
      Ypos = lParam / 65536
      
      Set fFrm = GetForm(Lwnd)
      If fFrm Is Nothing Then
        ' it's not a form
        If Not IsOver(Lwnd, Xpos, Ypos) And IsOver(GetParent(Lwnd), Xpos, Ypos) Then
          ' it's not over the control and is over the form,
          ' so fire mousewheel on form (if it's not a dropped down combo)
          If SendMessage(Lwnd, CB_GETDROPPEDSTATE, 0&, 0&) <> 1 Then
            GetForm(GetParent(Lwnd)).MouseWheel MouseKeys, Rotation, Xpos, Ypos
            Exit Function ' Discard scroll message to control
          End If
        End If
      Else
        ' it's a form so fire mousewheel
        If IsOver(fFrm.hWnd, Xpos, Ypos) Then fFrm.MouseWheel MouseKeys, Rotation, Xpos, Ypos
      End If
  End Select
  
  WindowProcFlexGrid = CallWindowProcFlexGrid(GetProp(Lwnd, "PrevWndProc"), Lwnd, Lmsg, wParam, lParam)
End Function
Public Function WindowProc(ByVal Lwnd As Long, ByVal Lmsg As Long, ByVal _
    wParam As Long, ByVal lParam As Long) As Long
    Dim MouseKeys As Long
    Dim Rotation As Long
    Dim Xpos As Long
    Dim Ypos As Long
    If Lmsg = WM_MOUSEWHEEL Then
        MouseKeys = wParam And 65535
        Rotation = wParam / 65536
        Xpos = lParam And 65535
        Ypos = lParam / 65536
        If Rotation = -120 Then
            MyProperty.Scroll 0, 3
        Else
            MyProperty.Scroll 0, -3
        End If
    End If
    WindowProc = CallWindowProc(LocalPrevWndProc, Lwnd, Lmsg, wParam, lParam)
End Function

Public Sub WheelHook(PassedControl As Object)
    On Error Resume Next
    Set MyControl = PassedControl
    LocalHwnd = PassedControl.hWnd
    LocalPrevWndProc = SetWindowLong(LocalHwnd, GWL_WNDPROC, AddressOf WindowProc)
End Sub

Sub WheelUnHook()
    Dim WorkFlag As Long
    On Error Resume Next
    WorkFlag = SetWindowLong(LocalHwnd, GWL_WNDPROC, LocalPrevWndProc)
    Set MyControl = Nothing
End Sub
Private Function GetForm(ByVal hWnd As Long) As Form
  For Each GetForm In Forms
    If GetForm.hWnd = hWnd Then Exit Function
  Next GetForm
  Set GetForm = Nothing
End Function
' Window Checks
' ================================================
Public Function IsOver(ByVal hWnd As Long, ByVal lX As Long, ByVal lY As Long) As Boolean
  Dim rectCtl As RECT
  GetWindowRect hWnd, rectCtl
  With rectCtl
    IsOver = (lX >= .Left And lX <= .Right And lY >= .Top And lY <= .Bottom)
  End With
End Function
' Control Specific Behaviour
' ================================================
'Public Sub FlexGridScroll(ByRef FG As MSFlexGrid, ByVal MouseKeys As Long, ByVal Rotation As Long, ByVal Xpos As Long, ByVal Ypos As Long)
'  Dim NewValue As Long
'  Dim Lstep As Single
'
'  On Error Resume Next
'  With FG
'    Lstep = .Height / .RowHeight(0)
'    Lstep = Int(Lstep)
'    If .rows < Lstep Then Exit Sub
'    Do While Not (.RowIsVisible(.TopRow + Lstep))
'      Lstep = Lstep - 1
'    Loop
'    If Rotation > 0 Then
'        NewValue = .TopRow - Lstep
'        If NewValue < 1 Then
'            NewValue = 1
'        End If
'    Else
'        NewValue = .TopRow + Lstep
'        If NewValue > .rows - 1 Then
'            NewValue = .rows - 1
'        End If
'    End If
'    .TopRow = NewValue
'  End With
'End Sub


