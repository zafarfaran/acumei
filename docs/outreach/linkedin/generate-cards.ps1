# Generates the 10 LinkedIn post cards (1200x1500), each with a bespoke visual.
# Run:  powershell -ExecutionPolicy Bypass -File .\generate-cards.ps1
# Output: .\cards\post-01.png ... post-10.png
# NOTE: ASCII-only file; special glyphs built from char codes.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$outDir = Join-Path $here 'cards'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

# Glyphs
$GBP   = [string][char]0x00A3
$CHK   = [string][char]0x2713
$DASH  = [string][char]0x2014
$NDASH = [string][char]0x2013
$ARROW = [string][char]0x2192
$MID   = [string][char]0x00B7
$TIMES = [string][char]0x00D7
$LQ    = [string][char]0x201C
$RQ    = [string][char]0x201D
$APO   = [string][char]0x2019
$NL    = [string][char]10

# Palette
$colBg     = [System.Drawing.ColorTranslator]::FromHtml('#0e0e10')
$colBgAlt  = [System.Drawing.ColorTranslator]::FromHtml('#16161a')
$colSurf   = [System.Drawing.ColorTranslator]::FromHtml('#18181c')
$colInk    = [System.Drawing.ColorTranslator]::FromHtml('#f3eee2')
$colSoft   = [System.Drawing.ColorTranslator]::FromHtml('#b9b3a4')
$colMuted  = [System.Drawing.ColorTranslator]::FromHtml('#7a746a')
$colBorder = [System.Drawing.ColorTranslator]::FromHtml('#2a2a2e')
$colAccent = [System.Drawing.ColorTranslator]::FromHtml('#e8a04b')

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

function Draw-Logo($g, $x, $y, $s, $alpha) {
    if (-not $alpha) { $alpha = 255 }
    $ink = [System.Drawing.Color]::FromArgb($alpha, $colInk)
    $penOuter = New-Object System.Drawing.Pen($ink, [Math]::Max(2, $s * 0.07))
    $penGrid  = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb([Math]::Min(80, $alpha), $colInk), [Math]::Max(1, $s * 0.025))
    $brush    = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb($alpha, $colAccent))
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

    Draw-Logo $g $M 92 54 255
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
    $y += $measured.Height + 26
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

$sfCenter = New-Object System.Drawing.StringFormat
$sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
$sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center
$sfCenterTop = New-Object System.Drawing.StringFormat
$sfCenterTop.Alignment = [System.Drawing.StringAlignment]::Center

# ---------------------------------------------------------------- 01: intro
function Card-01 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    # decorative oversize mark, outlines only, right side
    $dX = 640; $dY = 560; $dS = 760
    $penO = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(34, $colInk), 30)
    $penG = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(22, $colInk), 8)
    $penA = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(110, $colAccent), 10)
    $dPad = $dS * 0.06
    $dCx = $dX + $dS / 2; $dCy = $dY + $dS / 2
    $g.DrawEllipse($penO, ($dX + $dPad), ($dY + $dPad), ($dS - 2 * $dPad), ($dS - 2 * $dPad))
    $g.DrawLine($penG, $dCx, ($dY + $dPad), $dCx, ($dY + $dS - $dPad))
    $g.DrawLine($penG, ($dX + $dPad), $dCy, ($dX + $dS - $dPad), $dCy)
    $dR = $dS * 0.14
    $g.DrawEllipse($penA, ($dCx - $dR), ($dCy - $dR), (2 * $dR), (2 * $dR))
    $penO.Dispose(); $penG.Dispose(); $penA.Dispose()
    Draw-Chrome $g '01 / 10'
    $y = [double]340
    Draw-KickerTitle $g 'A NEW STUDIO' ("Your business," + $NL + "quietly automated.") 104 ([ref]$y)
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($colAccent)), $M, ($y + 8), 72, 5)
    $y += 60
    $fBody = New-Object System.Drawing.Font('Segoe UI', 42, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(("AI assistants for British SMEs." + $NL + "Built for you. Owned by you." + $NL + "Running in the background."), $fBody, (New-Object System.Drawing.SolidBrush($colSoft)), $M, $y)
    $bmp.Save((Join-Path $outDir 'post-01.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 02: three wins
function Card-02 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '02 / 10'
    $y = [double]300
    Draw-KickerTitle $g 'THREE QUICK WINS' ("What could you automate" + $NL + "this week?") 84 ([ref]$y)
    $y += 36

    $items = @(
        @{ t = 'The after-hours phone';        d = 'Answered and triaged while you sleep.' },
        @{ t = 'The follow-ups';               d = ('Lapsed customers, unpaid invoices ' + $DASH + ' sent for you.') },
        @{ t = 'The weekly admin ritual';      d = 'Stock orders and rotas, drafted for one-tap approval.' }
    )
    $fNum = New-Object System.Drawing.Font('Georgia', 56, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fT = New-Object System.Drawing.Font('Segoe UI', 42, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fD = New-Object System.Drawing.Font('Segoe UI', 32, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $penAcc = New-Object System.Drawing.Pen($colAccent, 3)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)

    $i = 0
    foreach ($it in $items) {
        $cy = $y + $i * 220
        $g.DrawEllipse($penAcc, $M, $cy, 110, 110)
        $g.DrawString(('0' + ($i + 1)), $fNum, $brushAccent, (New-Object System.Drawing.RectangleF($M, $cy, 110, 110)), $sfCenter)
        $g.DrawString($it.t, $fT, $brushInk, ($M + 150), ($cy - 2))
        $g.DrawString($it.d, $fD, $brushSoft, (New-Object System.Drawing.RectangleF(($M + 150), ($cy + 60), ($contentW - 170), 120)))
        $i++
    }

    $bmp.Save((Join-Path $outDir 'post-02.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 03: 49% donut
function Card-03 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '03 / 10'
    $y = [double]300
    Draw-KickerTitle $g 'BRITISH CHAMBERS OF COMMERCE' ("Half of SMEs don" + $APO + "t know" + $NL + "where to start with AI.") 76 ([ref]$y)

    $size = 540
    $dx = ($W - $size) / 2; $dy = $y + 36
    $penTrack = New-Object System.Drawing.Pen($colBorder, 62)
    $penArc = New-Object System.Drawing.Pen($colAccent, 62)
    $g.DrawEllipse($penTrack, $dx, $dy, $size, $size)
    $g.DrawArc($penArc, $dx, $dy, $size, $size, -90, (360 * 0.49))

    $fBig = New-Object System.Drawing.Font('Georgia', 144, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fSub = New-Object System.Drawing.Font('Consolas', 27, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('49%', $fBig, (New-Object System.Drawing.SolidBrush($colInk)), (New-Object System.Drawing.RectangleF($dx, ($dy - 20), $size, $size)), $sfCenter)
    $g.DrawString(($LQ + 'we don' + $APO + 't know where to start' + $RQ), $fSub, (New-Object System.Drawing.SolidBrush($colMuted)), (New-Object System.Drawing.RectangleF($dx, ($dy + 104), $size, $size)), $sfCenter)

    $fCap = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(('Start with one repetitive task ' + $DASH + ' not a strategy deck.'), $fCap, (New-Object System.Drawing.SolidBrush($colSoft)), (New-Object System.Drawing.RectangleF($M, ($dy + $size + 48), $contentW, 60)), $sfCenterTop)

    $bmp.Save((Join-Path $outDir 'post-03.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 04: missed call maths
function Card-04 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '04 / 10'
    $y = [double]300
    Draw-KickerTitle $g 'THE MATHS OF A MISSED CALL' ("What rings your phone" + $NL + "and leaves.") 84 ([ref]$y)
    $y += 40

    # equation boxes
    $boxW = 280; $boxH = 170; $gap = 22
    $labels = @(
        @{ a = '4';     b = 'missed calls / wk' },
        @{ a = ($GBP + '300'); b = 'average job' },
        @{ a = '52';    b = 'weeks a year' }
    )
    $fA = New-Object System.Drawing.Font('Georgia', 64, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fB = New-Object System.Drawing.Font('Consolas', 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fOp = New-Object System.Drawing.Font('Georgia', 56, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushMuted = New-Object System.Drawing.SolidBrush($colMuted)
    $penBorder = New-Object System.Drawing.Pen($colBorder, 2)

    $x = $M
    for ($i = 0; $i -lt 3; $i++) {
        $g.FillRectangle((New-Object System.Drawing.SolidBrush($colBgAlt)), $x, $y, $boxW, $boxH)
        $g.DrawRectangle($penBorder, $x, $y, $boxW, $boxH)
        $g.DrawString($labels[$i].a, $fA, $brushInk, (New-Object System.Drawing.RectangleF($x, ($y + 18), $boxW, 80)), $sfCenterTop)
        $g.DrawString($labels[$i].b, $fB, $brushMuted, (New-Object System.Drawing.RectangleF($x, ($y + 112), $boxW, 40)), $sfCenterTop)
        if ($i -lt 2) {
            $g.DrawString($TIMES, $fOp, $brushMuted, ($x + $boxW + 4), ($y + 44))
        }
        $x += $boxW + $gap + 48
    }
    $y += $boxH + 56

    $fEq = New-Object System.Drawing.Font('Georgia', 60, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('=', $fEq, $brushMuted, $M, $y)
    $fBig = New-Object System.Drawing.Font('Georgia', 150, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(($GBP + '62,400'), $fBig, (New-Object System.Drawing.SolidBrush($colAccent)), ($M + 70), ($y - 50))
    $y += 170

    $fCap = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(("a year, gone at dinner time." + $NL + "Nobody leaves voicemails anymore."), $fCap, (New-Object System.Drawing.SolidBrush($colSoft)), $M, $y)

    $bmp.Save((Join-Path $outDir 'post-04.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 05: myth vs reality
function Card-05 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '05 / 10'
    $y = [double]300
    Draw-KickerTitle $g 'MYTH NO. 1 OF 5' ("The biggest lie SMEs" + $NL + "are told about AI.") 80 ([ref]$y)
    $y += 30

    $panelH = 270
    $fHead = New-Object System.Drawing.Font('Consolas', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fQuote = New-Object System.Drawing.Font('Georgia', 52, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $brushMuted = New-Object System.Drawing.SolidBrush($colMuted)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $penBorder = New-Object System.Drawing.Pen($colBorder, 2)
    $penAcc = New-Object System.Drawing.Pen($colAccent, 2)

    # myth panel
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($colBgAlt)), $M, $y, $contentW, $panelH)
    $g.DrawRectangle($penBorder, $M, $y, $contentW, $panelH)
    $g.DrawString(($TIMES + '  THE MYTH'), $fHead, $brushMuted, ($M + 40), ($y + 36))
    $g.DrawString(($LQ + 'AI is for big companies, not' + $NL + 'businesses like mine.' + $RQ), $fQuote, $brushMuted, ($M + 40), ($y + 96))
    $y += $panelH + 36

    # reality panel
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($colSurf)), $M, $y, $contentW, $panelH)
    $g.DrawRectangle($penAcc, $M, $y, $contentW, $panelH)
    $g.DrawString(($CHK + '  THE REALITY'), $fHead, $brushAccent, ($M + 40), ($y + 36))
    $g.DrawString(("Big companies have departments for" + $NL + "the admin. You" + $APO + "re doing it at 10pm."), $fQuote, $brushInk, ($M + 40), ($y + 96))
    $y += $panelH + 40

    $fCap = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('The smaller the team, the bigger the win. 4 more myths in the post.', $fCap, (New-Object System.Drawing.SolidBrush($colSoft)), $M, $y)

    $bmp.Save((Join-Path $outDir 'post-05.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 06: 10-day timeline
function Card-06 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '06 / 10'
    $y = [double]300
    Draw-KickerTitle $g 'HOW A BUILD WORKS' ("Idea to running system" + $NL + "in 10 days.") 88 ([ref]$y)
    $y += 50

    $steps = @(
        @{ d = 'DAY 0';    t = 'Discovery call';   s = 'Free. Honest. If AI isn' + $APO + 't it, I say so.' },
        @{ d = 'DAY 1-2';  t = 'The plan';         s = 'One page. Fixed price.' },
        @{ d = 'DAY 3-10'; t = 'The build';        s = 'Around your existing tools.' },
        @{ d = 'DAY 10';   t = 'Handover';         s = ('It runs. You own everything.') }
    )

    $lineY = $y + 30
    $penLine = New-Object System.Drawing.Pen($colBorder, 4)
    $g.DrawLine($penLine, ($M + 20), $lineY, ($W - $M - 20), $lineY)

    $stepW = $contentW / 4
    $fD = New-Object System.Drawing.Font('Consolas', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fT = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fS = New-Object System.Drawing.Font('Segoe UI', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $brushBg = New-Object System.Drawing.SolidBrush($colBg)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $penAcc = New-Object System.Drawing.Pen($colAccent, 4)

    for ($i = 0; $i -lt 4; $i++) {
        $cx = $M + $stepW * $i + $stepW / 2
        $g.FillEllipse($brushBg, ($cx - 22), ($lineY - 22), 44, 44)
        $g.DrawEllipse($penAcc, ($cx - 22), ($lineY - 22), 44, 44)
        if ($i -eq 3) { $g.FillEllipse($brushAccent, ($cx - 11), ($lineY - 11), 22, 22) }
        $rect = New-Object System.Drawing.RectangleF(($M + $stepW * $i - 10), ($lineY + 50), ($stepW + 20), 300)
        $g.DrawString($steps[$i].d, $fD, $brushAccent, $rect, $sfCenterTop)
        $rect2 = New-Object System.Drawing.RectangleF(($M + $stepW * $i - 10), ($lineY + 92), ($stepW + 20), 300)
        $g.DrawString($steps[$i].t, $fT, $brushInk, $rect2, $sfCenterTop)
        $rect3 = New-Object System.Drawing.RectangleF(($M + $stepW * $i + 4), ($lineY + 146), ($stepW - 8), 300)
        $g.DrawString($steps[$i].s, $fS, $brushSoft, $rect3, $sfCenterTop)
    }
    $y = $lineY + 420

    $fCap = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(("No six-month project. No consultants." + $NL + "Two weeks, one workflow, done properly."), $fCap, $brushSoft, $M, $y)

    $bmp.Save((Join-Path $outDir 'post-06.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 07: pricing
function Card-07 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '07 / 10'
    $y = [double]300
    Draw-KickerTitle $g 'STRAIGHT ANSWERS' 'What does it actually cost?' 92 ([ref]$y)
    $y += 36

    $panelW = ($contentW - 36) / 2
    $panelH = 360
    $fPrice = New-Object System.Drawing.Font('Georgia', 84, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fLbl = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $penBorder = New-Object System.Drawing.Pen($colBorder, 2)
    $penAcc = New-Object System.Drawing.Pen($colAccent, 2)

    $g.FillRectangle((New-Object System.Drawing.SolidBrush($colBgAlt)), $M, $y, $panelW, $panelH)
    $g.DrawRectangle($penBorder, $M, $y, $panelW, $panelH)
    $g.DrawString(($GBP + '2' + $NDASH + '4k'), $fPrice, $brushInk, (New-Object System.Drawing.RectangleF($M, ($y + 70), $panelW, 120)), $sfCenterTop)
    $g.DrawString(("one focused" + $NL + "workflow"), $fLbl, $brushSoft, (New-Object System.Drawing.RectangleF($M, ($y + 210), $panelW, 120)), $sfCenterTop)

    $ax = $M + $panelW + 36
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($colSurf)), $ax, $y, $panelW, $panelH)
    $g.DrawRectangle($penAcc, $ax, $y, $panelW, $panelH)
    $g.DrawString(($GBP + '5' + $NDASH + '10k'), $fPrice, $brushInk, (New-Object System.Drawing.RectangleF($ax, ($y + 70), $panelW, 120)), $sfCenterTop)
    $g.DrawString(("connected systems" + $NL + "(the AI brain)"), $fLbl, $brushSoft, (New-Object System.Drawing.RectangleF($ax, ($y + 210), $panelW, 120)), $sfCenterTop)

    $y += $panelH + 44

    # accent strip
    $stripH = 150
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($colAccent)), $M, $y, $contentW, $stripH)
    $fStrip = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(("If it can" + $APO + "t pay for itself in 3 months," + $NL + "I" + $APO + "ll tell you not to buy it."), $fStrip, (New-Object System.Drawing.SolidBrush($colBg)), (New-Object System.Drawing.RectangleF($M, $y, $contentW, $stripH)), $sfCenter)
    $y += $stripH + 32

    $fCap = New-Object System.Drawing.Font('Segoe UI', 32, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('One-off. You own the result. No subscriptions.', $fCap, $brushSoft, $M, $y)

    $bmp.Save((Join-Path $outDir 'post-07.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 08: rent vs own
function Card-08 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '08 / 10'
    $y = [double]300
    Draw-KickerTitle $g 'AN UNPOPULAR OPINION' ("Stop renting your" + $NL + "automation. Own it.") 88 ([ref]$y)
    $y += 30

    $panelW = ($contentW - 36) / 2
    $fHead = New-Object System.Drawing.Font('Consolas', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fBox = New-Object System.Drawing.Font('Consolas', 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $brushMuted = New-Object System.Drawing.SolidBrush($colMuted)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $penBorder = New-Object System.Drawing.Pen($colBorder, 2)
    $penAcc = New-Object System.Drawing.Pen($colAccent, 2)

    $g.DrawString('RENTING', $fHead, $brushMuted, $M, $y)
    $boxes = @(
        ('booking bot     ' + $GBP + '99/mo'),
        ('review tool    ' + $GBP + '149/mo'),
        ('call texter     ' + $GBP + '79/mo'),
        ('email robot    ' + $GBP + '129/mo')
    )
    $by = $y + 56
    foreach ($b in $boxes) {
        $g.FillRectangle((New-Object System.Drawing.SolidBrush($colBgAlt)), $M, $by, $panelW, 88)
        $g.DrawRectangle($penBorder, $M, $by, $panelW, 88)
        $g.DrawString($b, $fBox, $brushSoft, (New-Object System.Drawing.RectangleF($M, $by, $panelW, 88)), $sfCenter)
        $by += 104
    }
    $fSum = New-Object System.Drawing.Font('Segoe UI', 32, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(('= ' + $GBP + '5,464 a year.' + $NL + 'Forever. Going up.'), $fSum, $brushMuted, $M, ($by + 12))

    $ax = $M + $panelW + 36
    $g.DrawString('OWNING', $fHead, $brushAccent, $ax, $y)
    $ownY = $y + 56
    $ownH = 4 * 88 + 3 * 16
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($colSurf)), $ax, $ownY, $panelW, $ownH)
    $g.DrawRectangle($penAcc, $ax, $ownY, $panelW, $ownH)
    $g.DrawString(('one custom build' + $NL + $NL + 'approx ' + $GBP + '4k, once' + $NL + $NL + 'yours for good'), $fBox, $brushInk, (New-Object System.Drawing.RectangleF($ax, $ownY, $panelW, $ownH)), $sfCenter)
    $g.DrawString(('= pennies in server' + $NL + 'costs from year two.'), $fSum, $brushAccent, $ax, ($ownY + $ownH + 12))

    $bmp.Save((Join-Path $outDir 'post-08.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 09: checklist
function Card-09 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '09 / 10'
    $y = [double]300
    Draw-KickerTitle $g 'A QUICK CHECKLIST' ("5 signs you" + $APO + "re ready" + $NL + "to automate.") 88 ([ref]$y)
    $y += 30

    $items = @(
        'Same admin task 3+ times a week',
        'Customers waiting hours for replies',
        'Jobs lost to an unanswered phone',
        ('Follow-ups ' + $LQ + 'when I get a minute' + $RQ),
        'A second shift of evening paperwork'
    )
    $fItem = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fChk = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $penBorder = New-Object System.Drawing.Pen($colBorder, 2)
    $penAcc = New-Object System.Drawing.Pen($colAccent, 3)

    foreach ($item in $items) {
        $g.FillRectangle((New-Object System.Drawing.SolidBrush($colBgAlt)), $M, $y, $contentW, 104)
        $g.DrawRectangle($penBorder, $M, $y, $contentW, 104)
        $g.DrawEllipse($penAcc, ($M + 28), ($y + 26), 52, 52)
        $g.DrawString($CHK, $fChk, $brushAccent, (New-Object System.Drawing.RectangleF(($M + 28), ($y + 26), 54, 52)), $sfCenter)
        $g.DrawString($item, $fItem, $brushInk, ($M + 116), ($y + 26))
        $y += 122
    }
    $y += 24

    $fCap = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('Ticked 3 or more? It probably pays for itself in months.', $fCap, (New-Object System.Drawing.SolidBrush($colSoft)), $M, $y)

    $bmp.Save((Join-Path $outDir 'post-09.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 10: CTA booking card
function Card-10 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '10 / 10'
    $y = [double]300
    Draw-KickerTitle $g ('FREE ' + $MID + ' 30 MINUTES ' + $MID + ' NO PITCH') ("A discovery call that might" + $NL + "end in " + $LQ + "don" + $APO + "t buy it." + $RQ) 78 ([ref]$y)
    $y += 30

    # booking card mockup
    $cardW = $contentW; $cardH = 420
    $path = New-RoundRect $M $y $cardW $cardH 28
    $g.FillPath((New-Object System.Drawing.SolidBrush($colBgAlt)), $path)
    $g.DrawPath((New-Object System.Drawing.Pen($colBorder, 3)), $path)

    # clock icon
    $ccx = $M + 130; $ccy = $y + 130
    $penClock = New-Object System.Drawing.Pen($colAccent, 6)
    $g.DrawEllipse($penClock, ($ccx - 64), ($ccy - 64), 128, 128)
    $g.DrawLine($penClock, $ccx, $ccy, $ccx, ($ccy - 42))
    $g.DrawLine($penClock, $ccx, $ccy, ($ccx + 30), ($ccy + 14))

    $fT = New-Object System.Drawing.Font('Segoe UI', 44, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fS = New-Object System.Drawing.Font('Segoe UI', 32, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $g.DrawString('Discovery call', $fT, $brushInk, ($M + 240), ($y + 70))
    $g.DrawString(("Where does your time actually go" + $DASH + "and" + $NL + "is automation worth it for you? A straight" + $NL + "answer either way."), $fS, $brushSoft, ($M + 240), ($y + 140))

    # CTA pill
    $pillW = 420; $pillH = 96
    $pillX = $M + 240; $pillY = $y + 290
    $pill = New-RoundRect $pillX $pillY $pillW $pillH 48
    $g.FillPath((New-Object System.Drawing.SolidBrush($colAccent)), $pill)
    $fPill = New-Object System.Drawing.Font('Segoe UI', 38, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(('Book a slot  ' + $ARROW), $fPill, (New-Object System.Drawing.SolidBrush($colBg)), (New-Object System.Drawing.RectangleF($pillX, $pillY, $pillW, $pillH)), $sfCenter)

    $y += $cardH + 44
    $fCap = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(("DM me or grab a slot via the link in the" + $NL + "comments. Know someone drowning in admin?" + $NL + "Tag them " + $DASH + " best favour you" + $APO + "ll do them this week."), $fCap, $brushSoft, $M, $y)

    $bmp.Save((Join-Path $outDir 'post-10.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

Card-01; Card-02; Card-03; Card-04; Card-05
Card-06; Card-07; Card-08; Card-09; Card-10
Write-Host 'done: 10 post cards'
