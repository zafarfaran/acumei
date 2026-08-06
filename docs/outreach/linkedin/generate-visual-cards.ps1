# Generates visual LinkedIn cards (charts, mockups, diagrams) in the Acumei brand style.
# Run:  powershell -ExecutionPolicy Bypass -File .\generate-visual-cards.ps1
# Output: .\cards\visual-01.png ... visual-08.png
# NOTE: this file is ASCII-only on purpose; special glyphs are built from char codes.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$outDir = Join-Path $here 'cards'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

# Glyphs (script stays ASCII)
$GBP   = [string][char]0x00A3   # pound sign
$CHK   = [string][char]0x2713   # check mark
$DASH  = [string][char]0x2014   # em dash
$ARROW = [string][char]0x2192   # right arrow
$MID   = [string][char]0x00B7   # middle dot
$TIMES = [string][char]0x00D7   # multiplication x
$LQ    = [string][char]0x201C
$RQ    = [string][char]0x201D
$APO   = [string][char]0x2019

# Brand palette
$colBg     = [System.Drawing.ColorTranslator]::FromHtml('#0e0e10')
$colBgAlt  = [System.Drawing.ColorTranslator]::FromHtml('#16161a')
$colSurf   = [System.Drawing.ColorTranslator]::FromHtml('#18181c')
$colInk    = [System.Drawing.ColorTranslator]::FromHtml('#f3eee2')
$colSoft   = [System.Drawing.ColorTranslator]::FromHtml('#b9b3a4')
$colMuted  = [System.Drawing.ColorTranslator]::FromHtml('#7a746a')
$colBorder = [System.Drawing.ColorTranslator]::FromHtml('#2a2a2e')
$colAccent = [System.Drawing.ColorTranslator]::FromHtml('#e8a04b')
$colAccSoft= [System.Drawing.ColorTranslator]::FromHtml('#3a2e1c')

$W = 1200; $H = 1500; $M = 110
$contentW = $W - 2 * $M

function New-Card {
    $bmp = New-Object System.Drawing.Bitmap $W, $H
    $bmp.SetResolution(144, 144)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear($colBg)
    return @($bmp, $g)
}

function Draw-Logo($g, $x, $y, $s) {
    $penOuter = New-Object System.Drawing.Pen($colInk, [Math]::Max(2, $s * 0.07))
    $penGrid  = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, $colInk), [Math]::Max(1, $s * 0.025))
    $brush    = New-Object System.Drawing.SolidBrush($colAccent)
    $pad = $s * 0.06
    $cx = $x + $s / 2; $cy = $y + $s / 2
    $g.DrawEllipse($penOuter, ($x + $pad), ($y + $pad), ($s - 2 * $pad), ($s - 2 * $pad))
    $g.DrawLine($penGrid, $cx, ($y + $pad), $cx, ($y + $s - $pad))
    $g.DrawLine($penGrid, ($x + $pad), $cy, ($x + $s - $pad), $cy)
    $r = $s * 0.14
    $g.FillEllipse($brush, ($cx - $r), ($cy - $r), (2 * $r), (2 * $r))
    $penOuter.Dispose(); $penGrid.Dispose(); $brush.Dispose()
}

function Draw-Chrome($g, $number) {
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushMuted = New-Object System.Drawing.SolidBrush($colMuted)
    $penBorder = New-Object System.Drawing.Pen($colBorder, 2)
    $sfRight = New-Object System.Drawing.StringFormat
    $sfRight.Alignment = [System.Drawing.StringAlignment]::Far

    Draw-Logo $g $M 92 54
    $fWord = New-Object System.Drawing.Font('Georgia', 42, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('acumei', $fWord, $brushInk, ($M + 70), 96)
    $fNum = New-Object System.Drawing.Font('Consolas', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString($number, $fNum, $brushMuted, (New-Object System.Drawing.RectangleF($M, 108, $contentW, 40)), $sfRight)

    $g.DrawLine($penBorder, $M, ($H - 150), ($W - $M), ($H - 150))
    $fFoot = New-Object System.Drawing.Font('Consolas', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('acumei.co.uk', $fFoot, $brushMuted, $M, ($H - 118))
    $g.DrawString('AI for British businesses', $fFoot, $brushMuted, (New-Object System.Drawing.RectangleF($M, ($H - 118), $contentW, 40)), $sfRight)

    $fWord.Dispose(); $fNum.Dispose(); $fFoot.Dispose()
    $brushInk.Dispose(); $brushMuted.Dispose(); $penBorder.Dispose()
}

function Draw-KickerTitle($g, $kicker, $title, $titleSize, [ref]$yRef) {
    $y = $yRef.Value
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $fKick = New-Object System.Drawing.Font('Consolas', 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString($kicker, $fKick, $brushAccent, $M, $y)
    $y += 74
    $fTitle = New-Object System.Drawing.Font('Georgia', $titleSize, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $measured = $g.MeasureString($title, $fTitle, $contentW)
    $g.DrawString($title, $fTitle, $brushInk, (New-Object System.Drawing.RectangleF($M, $y, $contentW, 500)))
    $y += $measured.Height + 30
    $fKick.Dispose(); $fTitle.Dispose(); $brushInk.Dispose(); $brushAccent.Dispose()
    $yRef.Value = $y
}

function New-RoundRect($x, $y, $w, $h, $r) {
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = 2 * $r
    $p.AddArc($x, $y, $d, $d, 180, 90)
    $p.AddArc(($x + $w - $d), $y, $d, $d, 270, 90)
    $p.AddArc(($x + $w - $d), ($y + $h - $d), $d, $d, 0, 90)
    $p.AddArc($x, ($y + $h - $d), $d, $d, 90, 90)
    $p.CloseFigure()
    return $p
}

# ---------------------------------------------------------------- V1: before / after
function Card-BeforeAfter {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'V01'
    $y = [double]300
    Draw-KickerTitle $g 'THE SAME WEEK, TWICE' 'Before and after automation.' 84 ([ref]$y)
    $y += 20

    $panelW = ($contentW - 36) / 2
    $panelH = 640
    $fHead = New-Object System.Drawing.Font('Consolas', 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fItem = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $brushMuted = New-Object System.Drawing.SolidBrush($colMuted)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $brushAlt = New-Object System.Drawing.SolidBrush($colBgAlt)
    $penBorder = New-Object System.Drawing.Pen($colBorder, 2)
    $penAccent = New-Object System.Drawing.Pen($colAccent, 2)

    # BEFORE panel
    $bx = $M
    $g.FillRectangle($brushAlt, $bx, $y, $panelW, $panelH)
    $g.DrawRectangle($penBorder, $bx, $y, $panelW, $panelH)
    $g.DrawString('BEFORE', $fHead, $brushMuted, ($bx + 36), ($y + 40))
    $beforeItems = @(
        'Calls hit voicemail after 6pm',
        'Follow-ups forgotten',
        ("Sunday night stock order"),
        'Invoices chased at 10pm',
        'Lapsed customers drift away'
    )
    $iy = $y + 130
    foreach ($item in $beforeItems) {
        $g.DrawString($TIMES, $fItem, $brushMuted, ($bx + 36), $iy)
        $g.DrawString($item, $fItem, $brushSoft, (New-Object System.Drawing.RectangleF(($bx + 90), $iy, ($panelW - 120), 120)))
        $iy += 100
    }

    # AFTER panel
    $ax = $M + $panelW + 36
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($colSurf)), $ax, $y, $panelW, $panelH)
    $g.DrawRectangle($penAccent, $ax, $y, $panelW, $panelH)
    $g.DrawString('AFTER', $fHead, $brushAccent, ($ax + 36), ($y + 40))
    $afterItems = @(
        'Every call answered, 24/7',
        'Follow-ups send themselves',
        'Order drafted, approved in a tap',
        'Invoices chase politely',
        ('Rebooking texts in your voice')
    )
    $iy = $y + 130
    foreach ($item in $afterItems) {
        $g.DrawString($CHK, $fItem, $brushAccent, ($ax + 36), $iy)
        $g.DrawString($item, $fItem, $brushInk, (New-Object System.Drawing.RectangleF(($ax + 90), $iy, ($panelW - 120), 120)))
        $iy += 100
    }

    $fCap = New-Object System.Drawing.Font('Segoe UI', 32, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('Same business. Same team. Less admin.', $fCap, $brushSoft, $M, ($y + $panelH + 36))

    $bmp.Save((Join-Path $outDir 'visual-01.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- V2: bar chart
function Card-BarChart {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'V02'
    $y = [double]300
    Draw-KickerTitle $g 'WHERE THE WEEK ACTUALLY GOES' ("9 hours a week, lost to" + [char]10 + "repeatable admin.") 80 ([ref]$y)
    $y += 30

    $rows = @(
        @{ label = 'Answering + returning calls'; hours = 3.0 },
        @{ label = 'Quotes and estimates';        hours = 2.0 },
        @{ label = 'Chasing payments';            hours = 1.5 },
        @{ label = 'Scheduling + rebooking';      hours = 1.5 },
        @{ label = 'Stock or supplies ordering';  hours = 1.0 }
    )
    $maxHours = 3.0
    $barAreaW = $contentW - 120
    $fLabel = New-Object System.Drawing.Font('Segoe UI', 32, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fVal = New-Object System.Drawing.Font('Consolas', 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $brushBar = New-Object System.Drawing.SolidBrush($colBorder)

    $i = 0
    foreach ($row in $rows) {
        $g.DrawString($row.label, $fLabel, $brushSoft, $M, $y)
        $barY = $y + 52
        $barW = [Math]::Max(40, $barAreaW * ($row.hours / $maxHours))
        $brush = if ($i -eq 0) { $brushAccent } else { $brushBar }
        $g.FillRectangle($brush, $M, $barY, $barW, 34)
        $valColor = if ($i -eq 0) { $brushAccent } else { $brushSoft }
        $g.DrawString(("{0}h" -f $row.hours), $fVal, $valColor, ($M + $barW + 20), ($barY - 2))
        $y += 120
        $i++
    }

    $fCap = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('Every one of these can run itself. Which goes first?', $fCap, $brushSoft, $M, ($y + 24))

    $bmp.Save((Join-Path $outDir 'visual-02.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- V3: phone conversation
function Card-Phone {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'V03'
    $y = [double]290
    Draw-KickerTitle $g ('02:47 AM ' + $MID + ' A REAL WORKFLOW') 'Who answers when you sleep?' 78 ([ref]$y)

    # Phone body
    $phW = 640; $phH = 720
    $phX = ($W - $phW) / 2; $phY = $y
    $phonePath = New-RoundRect $phX $phY $phW $phH 42
    $g.FillPath((New-Object System.Drawing.SolidBrush($colBgAlt)), $phonePath)
    $g.DrawPath((New-Object System.Drawing.Pen($colBorder, 3)), $phonePath)

    $fMeta = New-Object System.Drawing.Font('Consolas', 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fMsg = New-Object System.Drawing.Font('Segoe UI', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushMuted = New-Object System.Drawing.SolidBrush($colMuted)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushDark = New-Object System.Drawing.SolidBrush($colBg)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $sfCenter = New-Object System.Drawing.StringFormat
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center

    $g.DrawString(('MISSED CALL ' + $MID + ' 02:47'), $fMeta, $brushMuted, (New-Object System.Drawing.RectangleF($phX, ($phY + 36), $phW, 40)), $sfCenter)

    $pad = 36
    $bubbleMaxW = $phW - 2 * $pad - 110

    # Incoming bubble
    $msg1 = ("Boiler" + $APO + "s died and we" + $APO + "ve got a newborn" + [char]10 + $DASH + " is anyone there?")
    $size1 = $g.MeasureString($msg1, $fMsg, ($bubbleMaxW - 48))
    $b1H = $size1.Height + 44
    $b1 = New-RoundRect ($phX + $pad) ($phY + 100) ($bubbleMaxW) $b1H 24
    $g.FillPath((New-Object System.Drawing.SolidBrush($colSurf)), $b1)
    $g.DrawPath((New-Object System.Drawing.Pen($colBorder, 2)), $b1)
    $g.DrawString($msg1, $fMsg, $brushInk, (New-Object System.Drawing.RectangleF(($phX + $pad + 24), ($phY + 122), ($bubbleMaxW - 48), $size1.Height)))

    # Outgoing bubble (the AI)
    $msg2 = ("We can have an engineer with" + [char]10 + "you 7" + $DASH + "8am. Reply YES to" + [char]10 + "confirm the booking.")
    $size2 = $g.MeasureString($msg2, $fMsg, ($bubbleMaxW - 48))
    $b2H = $size2.Height + 44
    $b2Y = $phY + 100 + $b1H + 28
    $b2X = $phX + $phW - $pad - $bubbleMaxW
    $b2 = New-RoundRect $b2X $b2Y $bubbleMaxW $b2H 24
    $g.FillPath($brushAccent, $b2)
    $g.DrawString($msg2, $fMsg, $brushDark, (New-Object System.Drawing.RectangleF(($b2X + 24), ($b2Y + 22), ($bubbleMaxW - 48), $size2.Height)))

    # Incoming reply
    $msg3 = 'YES please. Thank you!!'
    $size3 = $g.MeasureString($msg3, $fMsg, ($bubbleMaxW - 48))
    $b3H = $size3.Height + 44
    $b3Y = $b2Y + $b2H + 28
    $b3W = $size3.Width + 60
    $b3 = New-RoundRect ($phX + $pad) $b3Y $b3W $b3H 24
    $g.FillPath((New-Object System.Drawing.SolidBrush($colSurf)), $b3)
    $g.DrawPath((New-Object System.Drawing.Pen($colBorder, 2)), $b3)
    $g.DrawString($msg3, $fMsg, $brushInk, (New-Object System.Drawing.RectangleF(($phX + $pad + 24), ($b3Y + 22), ($bubbleMaxW - 48), $size3.Height)))

    # Status + caption inside phone
    $status = ($ARROW + ' engineer texted ' + $MID + ' booked ' + $MID + ' 14 sec')
    $g.DrawString($status, $fMeta, $brushAccent, (New-Object System.Drawing.RectangleF($phX, ($b3Y + $b3H + 36), $phW, 40)), $sfCenter)

    $fCap = New-Object System.Drawing.Font('Segoe UI', 30, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('The owner found out at breakfast.', $fCap, (New-Object System.Drawing.SolidBrush($colSoft)), (New-Object System.Drawing.RectangleF($phX, ($b3Y + $b3H + 92), $phW, 50)), $sfCenter)

    $bmp.Save((Join-Path $outDir 'visual-03.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- V4: flow / timeline
function Card-Flow {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'V04'
    $y = [double]300
    Draw-KickerTitle $g 'WHAT THE AI BRAIN DOES' 'One missed call, handled end to end.' 78 ([ref]$y)
    $y += 30

    $steps = @(
        @{ t = 'Call rings out at 2am';            d = 'No voicemail black hole. The agent picks it up.' },
        @{ t = 'Details triaged';                  d = 'What, where, how urgent ' + $DASH + ' asked naturally.' },
        @{ t = 'On-call engineer texted';          d = 'Name, address, job and urgency in one message.' },
        @{ t = 'Slot confirmed and booked';        d = 'Customer gets a time. Calendar updated. Done.' }
    )

    $fStep = New-Object System.Drawing.Font('Segoe UI', 40, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fDesc = New-Object System.Drawing.Font('Segoe UI', 31, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fNum = New-Object System.Drawing.Font('Consolas', 34, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $brushBg = New-Object System.Drawing.SolidBrush($colBg)
    $penLine = New-Object System.Drawing.Pen($colBorder, 3)
    $penAcc = New-Object System.Drawing.Pen($colAccent, 3)
    $sfCenter = New-Object System.Drawing.StringFormat
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
    $sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center

    $cx = $M + 42
    $stepGap = 178
    $lineTop = $y + 42

    # spine
    $g.DrawLine($penLine, $cx, $lineTop, $cx, ($lineTop + $stepGap * 3))

    $i = 0
    foreach ($s in $steps) {
        $cy = $y + 42 + $stepGap * $i
        $g.FillEllipse($brushBg, ($cx - 42), ($cy - 42), 84, 84)
        $g.DrawEllipse($penAcc, ($cx - 42), ($cy - 42), 84, 84)
        $g.DrawString(("{0}" -f ($i + 1)), $fNum, $brushAccent, (New-Object System.Drawing.RectangleF(($cx - 42), ($cy - 42), 84, 84)), $sfCenter)
        $g.DrawString($s.t, $fStep, $brushInk, ($cx + 70), ($cy - 44))
        $g.DrawString($s.d, $fDesc, $brushSoft, (New-Object System.Drawing.RectangleF(($cx + 70), ($cy + 12), ($contentW - 160), 100)))
        $i++
    }

    $bmp.Save((Join-Path $outDir 'visual-04.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- V5: donut 49%
function Card-Donut {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'V05'
    $y = [double]300
    Draw-KickerTitle $g 'BRITISH CHAMBERS OF COMMERCE' ("Half of SMEs don" + $APO + "t know" + [char]10 + "where to start with AI.") 76 ([ref]$y)

    $size = 560
    $dx = ($W - $size) / 2; $dy = $y + 30
    $penTrack = New-Object System.Drawing.Pen($colBorder, 64)
    $penArc = New-Object System.Drawing.Pen($colAccent, 64)
    $g.DrawEllipse($penTrack, $dx, $dy, $size, $size)
    $g.DrawArc($penArc, $dx, $dy, $size, $size, -90, (360 * 0.49))

    $fBig = New-Object System.Drawing.Font('Georgia', 150, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fSub = New-Object System.Drawing.Font('Consolas', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $sfCenter = New-Object System.Drawing.StringFormat
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
    $sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString('49%', $fBig, (New-Object System.Drawing.SolidBrush($colInk)), (New-Object System.Drawing.RectangleF($dx, ($dy - 20), $size, $size)), $sfCenter)
    $g.DrawString(($LQ + 'we don' + $APO + 't know where to start' + $RQ), $fSub, (New-Object System.Drawing.SolidBrush($colMuted)), (New-Object System.Drawing.RectangleF($dx, ($dy + 110), $size, $size)), $sfCenter)

    $fCap = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $sfC2 = New-Object System.Drawing.StringFormat
    $sfC2.Alignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString(('Start with one repetitive task ' + $DASH + ' not a strategy deck.'), $fCap, (New-Object System.Drawing.SolidBrush($colSoft)), (New-Object System.Drawing.RectangleF($M, ($dy + $size + 56), $contentW, 60)), $sfC2)

    $bmp.Save((Join-Path $outDir 'visual-05.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- V6: payback chart
function Card-Payback {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'V06'
    $y = [double]300
    Draw-KickerTitle $g 'THE PAYBACK MATHS' ("A " + $GBP + "3k build, paying for" + [char]10 + "itself in 10 weeks.") 80 ([ref]$y)
    $y += 40

    # Chart area
    $chX = $M + 20; $chY = $y; $chW = $contentW - 60; $chH = 540
    $penAxis = New-Object System.Drawing.Pen($colBorder, 3)
    $g.DrawLine($penAxis, $chX, $chY, $chX, ($chY + $chH))
    $g.DrawLine($penAxis, $chX, ($chY + $chH), ($chX + $chW), ($chY + $chH))

    $maxWeeks = 16.0; $maxVal = 4800.0
    $costVal = 3000.0
    $weeklySaving = 300.0

    # dashed cost line
    $penCost = New-Object System.Drawing.Pen($colMuted, 3)
    $penCost.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $costY = $chY + $chH - ($costVal / $maxVal) * $chH
    $g.DrawLine($penCost, $chX, $costY, ($chX + $chW), $costY)
    $fLbl = New-Object System.Drawing.Font('Consolas', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(($GBP + '3,000 build cost'), $fLbl, (New-Object System.Drawing.SolidBrush($colMuted)), ($chX + 16), ($costY - 42))

    # cumulative savings line
    $penSave = New-Object System.Drawing.Pen($colAccent, 5)
    $prevX = $chX; $prevY = $chY + $chH
    for ($wk = 1; $wk -le $maxWeeks; $wk++) {
        $val = [Math]::Min($maxVal, $wk * $weeklySaving)
        $px = $chX + ($wk / $maxWeeks) * $chW
        $py = $chY + $chH - ($val / $maxVal) * $chH
        $g.DrawLine($penSave, $prevX, $prevY, $px, $py)
        $prevX = $px; $prevY = $py
    }

    # break-even dot
    $beX = $chX + (10 / $maxWeeks) * $chW
    $beY = $chY + $chH - ($costVal / $maxVal) * $chH
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($colAccent)), ($beX - 16), ($beY - 16), 32, 32)
    $fBe = New-Object System.Drawing.Font('Segoe UI', 32, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('break-even: week 10', $fBe, (New-Object System.Drawing.SolidBrush($colInk)), ($beX - 290), ($beY - 70))

    # axis labels
    $g.DrawString('weeks', $fLbl, (New-Object System.Drawing.SolidBrush($colMuted)), ($chX + $chW - 90), ($chY + $chH + 18))
    $g.DrawString(('saved: 8 hrs/week at ' + $GBP + '37/hr'), $fLbl, (New-Object System.Drawing.SolidBrush($colMuted)), $chX, ($chY + $chH + 18))

    $fCap = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('After week 10, the savings are just... yours.', $fCap, (New-Object System.Drawing.SolidBrush($colSoft)), $M, ($chY + $chH + 80))

    $bmp.Save((Join-Path $outDir 'visual-06.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- V7: year grid
function Card-YearGrid {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'V07'
    $y = [double]300
    Draw-KickerTitle $g '9 HOURS A WEEK, COMPOUNDED' ("468 hours a year." + [char]10 + "That" + $APO + "s 12 working weeks.") 80 ([ref]$y)
    $y += 30

    # 52 squares, 13 per row; 12 accent = working weeks lost to admin
    $cols = 13; $rows = 4
    $cell = 64; $gap = 14
    $gridW = $cols * $cell + ($cols - 1) * $gap
    $gx = $M + ($contentW - $gridW) / 2
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $brushCell = New-Object System.Drawing.SolidBrush($colBgAlt)
    $penBorder = New-Object System.Drawing.Pen($colBorder, 2)

    $idx = 0
    for ($row = 0; $row -lt $rows; $row++) {
        for ($col = 0; $col -lt $cols; $col++) {
            $x = $gx + $col * ($cell + $gap)
            $cy = $y + $row * ($cell + $gap)
            if ($idx -lt 12) {
                $g.FillRectangle($brushAccent, $x, $cy, $cell, $cell)
            } else {
                $g.FillRectangle($brushCell, $x, $cy, $cell, $cell)
                $g.DrawRectangle($penBorder, $x, $cy, $cell, $cell)
            }
            $idx++
        }
    }
    $y += $rows * ($cell + $gap) + 40

    $fLeg = New-Object System.Drawing.Font('Segoe UI', 32, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $g.FillRectangle($brushAccent, $M, ($y + 8), 36, 36)
    $g.DrawString('= weeks of your year spent on repeatable admin', $fLeg, $brushSoft, ($M + 56), $y)
    $y += 64
    $g.FillRectangle($brushCell, $M, ($y + 8), 36, 36)
    $g.DrawRectangle($penBorder, $M, ($y + 8), 36, 36)
    $g.DrawString('= weeks spent running the actual business', $fLeg, $brushSoft, ($M + 56), $y)

    $fCap = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(("Each square is one week. Twelve of them" + [char]10 + "are paperwork. What would you do with" + [char]10 + "them back?"), $fCap, (New-Object System.Drawing.SolidBrush($colInk)), $M, ($y + 90))

    $bmp.Save((Join-Path $outDir 'visual-07.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- V8: rent vs own
function Card-RentVsOwn {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'V08'
    $y = [double]300
    Draw-KickerTitle $g 'THE SUBSCRIPTION TRAP' 'Renting tools vs owning your system.' 80 ([ref]$y)
    $y += 24

    $panelW = ($contentW - 36) / 2
    $fHead = New-Object System.Drawing.Font('Consolas', 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fBox = New-Object System.Drawing.Font('Consolas', 32, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fSum = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $brushMuted = New-Object System.Drawing.SolidBrush($colMuted)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $penBorder = New-Object System.Drawing.Pen($colBorder, 2)
    $penAccent = New-Object System.Drawing.Pen($colAccent, 2)
    $sfCenter = New-Object System.Drawing.StringFormat
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
    $sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center

    # LEFT: stack of subscriptions
    $g.DrawString('RENTING', $fHead, $brushMuted, $M, $y)
    $boxes = @(
        ('booking bot      ' + $GBP + '99/mo'),
        ('review tool     ' + $GBP + '149/mo'),
        ('call texter      ' + $GBP + '79/mo'),
        ('email robot     ' + $GBP + '129/mo')
    )
    $by = $y + 60
    foreach ($b in $boxes) {
        $g.FillRectangle((New-Object System.Drawing.SolidBrush($colBgAlt)), $M, $by, $panelW, 96)
        $g.DrawRectangle($penBorder, $M, $by, $panelW, 96)
        $g.DrawString($b, $fBox, $brushSoft, (New-Object System.Drawing.RectangleF($M, $by, $panelW, 96)), $sfCenter)
        $by += 112
    }
    $g.DrawString(('= ' + $GBP + '5,464 a year.' + [char]10 + 'Forever. Going up.'), $fSum, $brushMuted, $M, ($by + 16))

    # RIGHT: one owned box
    $ax = $M + $panelW + 36
    $g.DrawString('OWNING', $fHead, $brushAccent, $ax, $y)
    $ownY = $y + 60
    $ownH = 4 * 96 + 3 * 16
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($colSurf)), $ax, $ownY, $panelW, $ownH)
    $g.DrawRectangle($penAccent, $ax, $ownY, $panelW, $ownH)
    $ownText = ('one custom build' + [char]10 + [char]10 + 'approx ' + $GBP + '4k, once' + [char]10 + [char]10 + 'yours for good')
    $g.DrawString($ownText, $fBox, $brushInk, (New-Object System.Drawing.RectangleF($ax, $ownY, $panelW, $ownH)), $sfCenter)
    $g.DrawString(('= pennies in server' + [char]10 + 'costs from year two.'), $fSum, $brushAccent, $ax, ($ownY + $ownH + 16))

    $fCap = New-Object System.Drawing.Font('Segoe UI', 32, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('Rented tools never talk to each other. One owned system does.', $fCap, $brushSoft, $M, ($by + 124))

    $bmp.Save((Join-Path $outDir 'visual-08.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

Card-BeforeAfter
Card-BarChart
Card-Phone
Card-Flow
Card-Donut
Card-Payback
Card-YearGrid
Card-RentVsOwn
Write-Host 'done: 8 visual cards'
