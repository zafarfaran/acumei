# Generates LinkedIn post cards 11-20 (1200x1500) with richer visuals:
# gradients, glows, gauges, flows, mockups. Brand style throughout.
# Run:  powershell -ExecutionPolicy Bypass -File .\generate-cards-2.ps1
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
$ARROW = [string][char]0x2192
$MID   = [string][char]0x00B7
$TIMES = [string][char]0x00D7
$LQ    = [string][char]0x201C
$RQ    = [string][char]0x201D
$APO   = [string][char]0x2019
$NL    = [string][char]10
$APPROX= [string][char]0x2248

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

$sfCenter = New-Object System.Drawing.StringFormat
$sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
$sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center
$sfCenterTop = New-Object System.Drawing.StringFormat
$sfCenterTop.Alignment = [System.Drawing.StringAlignment]::Center
$sfRight = New-Object System.Drawing.StringFormat
$sfRight.Alignment = [System.Drawing.StringAlignment]::Far

function New-Card {
    $bmp = New-Object System.Drawing.Bitmap $W, $H
    $bmp.SetResolution(144, 144)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear($colBg)
    return @($bmp, $g)
}

function Draw-Glow($g, $cx, $cy, $radius, $alpha) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse(($cx - $radius), ($cy - $radius), (2 * $radius), (2 * $radius))
    $pgb = New-Object System.Drawing.Drawing2D.PathGradientBrush($path)
    $pgb.CenterColor = [System.Drawing.Color]::FromArgb($alpha, $colAccent)
    $pgb.SurroundColors = @([System.Drawing.Color]::FromArgb(0, $colAccent))
    $g.FillPath($pgb, $path)
    $pgb.Dispose(); $path.Dispose()
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

function New-PanelBrush($x, $y, $w, $h) {
    $rect = New-Object System.Drawing.RectangleF($x, $y, $w, $h)
    return New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $colSurf, $colBgAlt, 115)
}

# ---------------------------------------------------------------- 11: salon playbook
function Card-11 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '11 / 20'
    $y = [double]300
    Draw-KickerTitle $g ('ONE INDUSTRY ' + $MID + ' SALONS') ("Where a salon wins" + $NL + "first.") 88 ([ref]$y)
    $y += 30

    $rows = @(
        @{ t = 'Rebooking lapsed clients';  h = 3.0 },
        @{ t = 'No-show reminders';         h = 2.5 },
        @{ t = 'Stock counts + ordering';   h = 1.5 },
        @{ t = 'Review requests';           h = 1.0 },
        @{ t = 'Rota drafting';             h = 1.0 }
    )
    $maxH = 3.0
    $fT = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fV = New-Object System.Drawing.Font('Consolas', 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $barMaxW = $contentW - 140

    foreach ($row in $rows) {
        $g.DrawString($row.t, $fT, $brushSoft, $M, $y)
        $barY = $y + 50
        $barW = [Math]::Max(60, $barMaxW * ($row.h / $maxH))
        $rect = New-Object System.Drawing.RectangleF($M, $barY, $barW, 30)
        $lgb = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, [System.Drawing.Color]::FromArgb(120, $colAccent), $colAccent, 0)
        $g.FillRectangle($lgb, $M, $barY, $barW, 30)
        $lgb.Dispose()
        $g.DrawString(("{0}h" -f $row.h), $fV, $brushAccent, ($M + $barW + 18), ($barY - 4))
        $y += 116
    }
    $y += 16

    # total strip
    $stripH = 110
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($colAccent)), $M, $y, $contentW, $stripH)
    $fStrip = New-Object System.Drawing.Font('Segoe UI', 38, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(($APPROX + ' 9 hours a week, back in the chair'), $fStrip, (New-Object System.Drawing.SolidBrush($colBg)), (New-Object System.Drawing.RectangleF($M, $y, $contentW, $stripH)), $sfCenter)

    $bmp.Save((Join-Path $outDir 'post-11.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 12: two-minute test (decision flow)
function Card-12 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '12 / 20'
    $y = [double]300
    Draw-KickerTitle $g 'A RULE OF THUMB' 'The two-minute test.' 96 ([ref]$y)
    $y += 20

    # question diamond
    $cx = $W / 2
    $diaW = 760; $diaH = 320
    $dia = New-Object System.Drawing.Drawing2D.GraphicsPath
    $dia.AddPolygon(@(
        (New-Object System.Drawing.PointF($cx, $y)),
        (New-Object System.Drawing.PointF(($cx + $diaW / 2), ($y + $diaH / 2))),
        (New-Object System.Drawing.PointF($cx, ($y + $diaH))),
        (New-Object System.Drawing.PointF(($cx - $diaW / 2), ($y + $diaH / 2)))
    ))
    $pb = New-PanelBrush ($cx - $diaW / 2) $y $diaW $diaH
    $g.FillPath($pb, $dia); $pb.Dispose()
    $g.DrawPath((New-Object System.Drawing.Pen($colBorder, 3)), $dia)
    $fQ = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(("Same steps" + $NL + "every time?"), $fQ, (New-Object System.Drawing.SolidBrush($colInk)), (New-Object System.Drawing.RectangleF(($cx - 250), $y, 500, $diaH)), $sfCenter)

    # branches
    $branchY = $y + $diaH + 70
    $boxW = 430; $boxH = 190
    $penArrow = New-Object System.Drawing.Pen($colMuted, 4)
    $penArrow.EndCap = [System.Drawing.Drawing2D.LineCap]::ArrowAnchor
    $lx = $M + $boxW / 2
    $rx = $W - $M - $boxW / 2
    $g.DrawLine($penArrow, ($cx - $diaW / 4 - 40), ($y + $diaH * 0.75), $lx, ($branchY - 8))
    $g.DrawLine($penArrow, ($cx + $diaW / 4 + 40), ($y + $diaH * 0.75), $rx, ($branchY - 8))

    $fLbl = New-Object System.Drawing.Font('Consolas', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('YES', $fLbl, (New-Object System.Drawing.SolidBrush($colAccent)), ($lx + 50), ($branchY - 70))
    $g.DrawString('NO', $fLbl, (New-Object System.Drawing.SolidBrush($colMuted)), ($rx - 100), ($branchY - 70))

    # YES box (accent)
    Draw-Glow $g $lx ($branchY + $boxH / 2) 320 36
    $yesPath = New-RoundRect $M $branchY $boxW $boxH 20
    $g.FillPath((New-Object System.Drawing.SolidBrush($colAccent)), $yesPath)
    $fBox = New-Object System.Drawing.Font('Segoe UI', 38, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('Automate it.', $fBox, (New-Object System.Drawing.SolidBrush($colBg)), (New-Object System.Drawing.RectangleF($M, $branchY, $boxW, $boxH)), $sfCenter)

    # NO box (muted)
    $noPath = New-RoundRect ($W - $M - $boxW) $branchY $boxW $boxH 20
    $pb2 = New-PanelBrush ($W - $M - $boxW) $branchY $boxW $boxH
    $g.FillPath($pb2, $noPath); $pb2.Dispose()
    $g.DrawPath((New-Object System.Drawing.Pen($colBorder, 3)), $noPath)
    $g.DrawString(("Fix the process" + $NL + "first."), $fBox, (New-Object System.Drawing.SolidBrush($colSoft)), (New-Object System.Drawing.RectangleF(($W - $M - $boxW), $branchY, $boxW, $boxH)), $sfCenter)

    $fCap = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('Automation amplifies a process. It cannot invent one.', $fCap, (New-Object System.Drawing.SolidBrush($colSoft)), (New-Object System.Drawing.RectangleF($M, ($branchY + $boxH + 56), $contentW, 60)), $sfCenterTop)

    $bmp.Save((Join-Path $outDir 'post-12.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 13: iceberg costs
function Card-13 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '13 / 20'
    $y = [double]300
    Draw-KickerTitle $g 'THE INVISIBLE LEDGER' ("The costs that never" + $NL + "hit your P&L.") 84 ([ref]$y)
    $y += 6

    # visible panel (above waterline)
    $visH = 150
    $fHead = New-Object System.Drawing.Font('Consolas', 27, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fItem = New-Object System.Drawing.Font('Segoe UI', 32, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushMuted = New-Object System.Drawing.SolidBrush($colMuted)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)

    $g.DrawString('ON THE BOOKS', $fHead, $brushMuted, $M, $y)
    $g.DrawString(('Wages ' + $MID + ' materials ' + $MID + ' rent ' + $MID + ' software subscriptions'), $fItem, $brushSoft, $M, ($y + 52))

    $y += $visH

    # waterline
    $penWater = New-Object System.Drawing.Pen($colAccent, 4)
    $penWater.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $g.DrawLine($penWater, $M, $y, ($W - $M), $y)
    $fWl = New-Object System.Drawing.Font('Consolas', 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('the waterline', $fWl, (New-Object System.Drawing.SolidBrush($colAccent)), (New-Object System.Drawing.RectangleF($M, ($y - 40), $contentW, 36)), $sfRight)
    $y += 40

    # hidden panel (below waterline) with depth gradient
    $depthH = 500
    $rect = New-Object System.Drawing.RectangleF($M, $y, $contentW, $depthH)
    $lgb = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $colBgAlt, [System.Drawing.Color]::FromArgb(255, 20, 16, 10), 90)
    $g.FillRectangle($lgb, $M, $y, $contentW, $depthH); $lgb.Dispose()
    $g.DrawRectangle((New-Object System.Drawing.Pen($colBorder, 2)), $M, $y, $contentW, $depthH)

    $g.DrawString('BELOW THE WATERLINE', $fHead, (New-Object System.Drawing.SolidBrush($colAccent)), ($M + 44), ($y + 36))
    $hidden = @(
        ('Missed after-hours calls ' + $DASH + ' often ' + $GBP + '20k+/yr'),
        'Follow-ups that never get sent',
        'No-shows nobody reminded',
        'Lapsed customers nobody re-invited',
        'Your evenings, doing the books'
    )
    $iy = $y + 96
    $fH2 = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    foreach ($itm in $hidden) {
        $g.FillEllipse((New-Object System.Drawing.SolidBrush($colAccent)), ($M + 44), ($iy + 16), 14, 14)
        $g.DrawString($itm, $fH2, $brushInk, ($M + 84), $iy)
        $iy += 78
    }

    $bmp.Save((Join-Path $outDir 'post-13.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 14: anatomy of an automation
function Card-14 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '14 / 20'
    $y = [double]300
    Draw-KickerTitle $g 'UNDER THE BONNET' 'Anatomy of an automation.' 68 ([ref]$y)
    $y += 16

    $blocks = @(
        @{ t = 'TRIGGER'; d = 'A missed call lands. An invoice goes unpaid.' },
        @{ t = 'BRAIN';   d = 'Decides what it needs, in context.' },
        @{ t = 'ACTION';  d = 'Texts, books, orders, chases.' },
        @{ t = 'LOG';     d = 'A record of every action, and why.' }
    )
    $bw = 700; $bh = 140; $gapY = 42
    $cx = $W / 2
    $fT = New-Object System.Drawing.Font('Consolas', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fD = New-Object System.Drawing.Font('Segoe UI', 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $penArrow = New-Object System.Drawing.Pen($colAccent, 5)
    $penArrow.EndCap = [System.Drawing.Drawing2D.LineCap]::ArrowAnchor

    for ($i = 0; $i -lt 4; $i++) {
        $bx = $cx - $bw / 2
        $by = $y + $i * ($bh + $gapY)
        $isBrain = ($i -eq 1)
        $path = New-RoundRect $bx $by $bw $bh 22
        if ($isBrain) { Draw-Glow $g $cx ($by + $bh / 2) 420 42 }
        $pb = New-PanelBrush $bx $by $bw $bh
        $g.FillPath($pb, $path); $pb.Dispose()
        $pen = if ($isBrain) { New-Object System.Drawing.Pen($colAccent, 3) } else { New-Object System.Drawing.Pen($colBorder, 3) }
        $g.DrawPath($pen, $path); $pen.Dispose()
        $col = if ($isBrain) { $brushAccent } else { New-Object System.Drawing.SolidBrush($colMuted) }
        $g.DrawString($blocks[$i].t, $fT, $col, (New-Object System.Drawing.RectangleF($bx, ($by + 22), $bw, 36)), $sfCenterTop)
        $g.DrawString($blocks[$i].d, $fD, $brushInk, (New-Object System.Drawing.RectangleF($bx, ($by + 66), $bw, 60)), $sfCenterTop)
        if ($i -lt 3) {
            $g.DrawLine($penArrow, $cx, ($by + $bh + 6), $cx, ($by + $bh + $gapY - 10))
        }
    }
    $y += 4 * ($bh + $gapY) - $gapY + 44

    $fSide = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('No black box. Ever.', $fSide, (New-Object System.Drawing.SolidBrush($colSoft)), (New-Object System.Drawing.RectangleF($M, $y, $contentW, 60)), $sfCenterTop)

    $bmp.Save((Join-Path $outDir 'post-14.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 15: can / can't
function Card-15 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '15 / 20'
    $y = [double]300
    Draw-KickerTitle $g 'AN HONEST LIST' ("What AI can " + $DASH + " and" + $NL + "can" + $APO + "t " + $DASH + " do for you.") 84 ([ref]$y)
    $y += 30

    $panelW = ($contentW - 36) / 2
    $panelH = 600
    $can = @('Answer + triage calls', 'Send the follow-ups', 'Draft orders + rotas', 'Chase invoices politely', 'Rebook lapsed clients')
    $cant = @('Run your business', 'Fix a broken process', 'Replace judgement', 'Know your trade', 'Work miracles')

    $fHead = New-Object System.Drawing.Font('Consolas', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fItem = New-Object System.Drawing.Font('Segoe UI', 32, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $brushMuted = New-Object System.Drawing.SolidBrush($colMuted)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)

    # CAN panel
    $p1 = New-RoundRect $M $y $panelW $panelH 22
    $pb1 = New-PanelBrush $M $y $panelW $panelH
    $g.FillPath($pb1, $p1); $pb1.Dispose()
    $g.DrawPath((New-Object System.Drawing.Pen($colAccent, 3)), $p1)
    $g.DrawString(($CHK + '  CAN'), $fHead, $brushAccent, ($M + 36), ($y + 38))
    $iy = $y + 108
    foreach ($c in $can) {
        $g.DrawString($CHK, $fItem, $brushAccent, ($M + 36), $iy)
        $g.DrawString($c, $fItem, $brushInk, (New-Object System.Drawing.RectangleF(($M + 86), $iy, ($panelW - 110), 100)))
        $iy += 94
    }

    # CAN'T panel
    $ax = $M + $panelW + 36
    $p2 = New-RoundRect $ax $y $panelW $panelH 22
    $pb2 = New-PanelBrush $ax $y $panelW $panelH
    $g.FillPath($pb2, $p2); $pb2.Dispose()
    $g.DrawPath((New-Object System.Drawing.Pen($colBorder, 3)), $p2)
    $g.DrawString(($TIMES + '  CAN' + $APO + 'T'), $fHead, $brushMuted, ($ax + 36), ($y + 38))
    $iy = $y + 108
    foreach ($c in $cant) {
        $g.DrawString($TIMES, $fItem, $brushMuted, ($ax + 36), $iy)
        $g.DrawString($c, $fItem, $brushSoft, (New-Object System.Drawing.RectangleF(($ax + 86), $iy, ($panelW - 110), 100)))
        $iy += 94
    }

    $fCap = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('Anyone selling the right column is selling a story.', $fCap, $brushSoft, (New-Object System.Drawing.RectangleF($M, ($y + $panelH + 36), $contentW, 60)), $sfCenterTop)

    $bmp.Save((Join-Path $outDir 'post-15.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 16: a week handled
function Card-16 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '16 / 20'
    $y = [double]300
    Draw-KickerTitle $g 'SEVEN DAYS, ZERO DRAMA' 'A week, quietly handled.' 88 ([ref]$y)
    $y += 40

    $days = @('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN')
    $counts = @(24, 19, 22, 27, 31, 14, 10)
    $maxC = 31
    $colW = $contentW / 7
    $chartH = 420
    $baseY = $y + $chartH

    $fDay = New-Object System.Drawing.Font('Consolas', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fCnt = New-Object System.Drawing.Font('Consolas', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushMuted = New-Object System.Drawing.SolidBrush($colMuted)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)

    for ($i = 0; $i -lt 7; $i++) {
        $bx = $M + $colW * $i + 18
        $bw = $colW - 36
        $bh = $chartH * ($counts[$i] / $maxC)
        $rect = New-Object System.Drawing.RectangleF($bx, ($baseY - $bh), $bw, $bh)
        $lgb = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $colAccent, [System.Drawing.Color]::FromArgb(70, $colAccent), 90)
        $g.FillRectangle($lgb, $bx, ($baseY - $bh), $bw, $bh); $lgb.Dispose()
        $g.DrawString(("{0}" -f $counts[$i]), $fCnt, $brushAccent, (New-Object System.Drawing.RectangleF(($bx - 18), ($baseY - $bh - 44), ($bw + 36), 40)), $sfCenterTop)
        $g.DrawString($days[$i], $fDay, $brushMuted, (New-Object System.Drawing.RectangleF(($bx - 18), ($baseY + 18), ($bw + 36), 40)), $sfCenterTop)
    }
    $g.DrawLine((New-Object System.Drawing.Pen($colBorder, 3)), $M, $baseY, ($W - $M), $baseY)
    $y = $baseY + 90

    $fBig = New-Object System.Drawing.Font('Georgia', 56, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('147 tasks handled.', $fBig, (New-Object System.Drawing.SolidBrush($colInk)), $M, $y)
    $fSub = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('Zero you had to think about.', $fSub, (New-Object System.Drawing.SolidBrush($colAccent)), $M, ($y + 80))

    $bmp.Save((Join-Path $outDir 'post-16.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 17: pull quote
function Card-17 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    # offset double frame
    $g2 = $r[1]
    Draw-Chrome $g '17 / 20'

    Draw-Glow $g 240 540 460 30

    $fMark = New-Object System.Drawing.Font('Georgia', 380, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString($LQ, $fMark, (New-Object System.Drawing.SolidBrush($colAccent)), ($M - 40), 250)

    $fQuote = New-Object System.Drawing.Font('Georgia', 96, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(("Stop buying" + $NL + "tools. Start" + $NL + "fixing" + $NL + "workflows."), $fQuote, (New-Object System.Drawing.SolidBrush($colInk)), $M, 560)

    # accent underline under "workflows."
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($colAccent)), $M, 1110, 480, 6)

    $fSub = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(("The tool is never the point. The" + $NL + "Tuesday-night invoicing is."), $fSub, (New-Object System.Drawing.SolidBrush($colSoft)), $M, 1170)

    $bmp.Save((Join-Path $outDir 'post-17.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 18: the L37/hour gauge
function Card-18 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '18 / 20'
    $y = [double]300
    Draw-KickerTitle $g 'KNOW YOUR NUMBER' ("What" + $APO + "s an hour of" + $NL + "you worth?") 88 ([ref]$y)
    $y += 6

    # gauge
    $gaugeW = 540
    $gx = ($W - $gaugeW) / 2; $gy = $y + 30
    Draw-Glow $g ($gx + $gaugeW / 2) ($gy + $gaugeW / 2 - 60) 340 30
    $penTrack = New-Object System.Drawing.Pen($colBorder, 46)
    $penVal = New-Object System.Drawing.Pen($colAccent, 46)
    $g.DrawArc($penTrack, $gx, $gy, $gaugeW, $gaugeW, 180, 180)
    $g.DrawArc($penVal, $gx, $gy, $gaugeW, $gaugeW, 180, 122)

    $ccx = $gx + $gaugeW / 2; $ccy = $gy + $gaugeW / 2
    $fBig = New-Object System.Drawing.Font('Georgia', 110, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(($GBP + '37'), $fBig, (New-Object System.Drawing.SolidBrush($colInk)), (New-Object System.Drawing.RectangleF(($ccx - 300), ($ccy - 155), 600, 150)), $sfCenterTop)
    $fSm = New-Object System.Drawing.Font('Consolas', 27, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('a typical owner-hour, conservatively', $fSm, (New-Object System.Drawing.SolidBrush($colMuted)), (New-Object System.Drawing.RectangleF(($ccx - 300), ($ccy - 6), 600, 40)), $sfCenterTop)

    $y = $ccy + 70

    # math row
    $fMath = New-Object System.Drawing.Font('Consolas', 34, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $math = ('9 admin hrs ' + $TIMES + ' ' + $GBP + '37 ' + $TIMES + ' 52 wks')
    $g.DrawString($math, $fMath, (New-Object System.Drawing.SolidBrush($colSoft)), (New-Object System.Drawing.RectangleF($M, $y, $contentW, 50)), $sfCenterTop)
    $y += 64
    $fRes = New-Object System.Drawing.Font('Georgia', 104, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(('= ' + $GBP + '17,316 a year'), $fRes, (New-Object System.Drawing.SolidBrush($colAccent)), (New-Object System.Drawing.RectangleF($M, $y, $contentW, 150)), $sfCenterTop)
    $y += 152
    $fCap = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('spent being your own admin assistant.', $fCap, (New-Object System.Drawing.SolidBrush($colSoft)), (New-Object System.Drawing.RectangleF($M, $y, $contentW, 60)), $sfCenterTop)

    $bmp.Save((Join-Path $outDir 'post-18.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 19: five questions
function Card-19 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '19 / 20'
    $y = [double]300
    Draw-KickerTitle $g 'BUYER PROTECTION' ("Five questions for any AI" + $NL + "consultant. Including me.") 76 ([ref]$y)
    $y += 36

    $qs = @(
        'What exactly will it do, in plain words?',
        'What does it plug into that I already use?',
        'Who owns it when you walk away?',
        'What happens when it breaks at 9pm?',
        ('When does it pay for itself ' + $DASH + ' in my numbers?')
    )
    $fNum = New-Object System.Drawing.Font('Georgia', 64, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $fQ = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $penBorder = New-Object System.Drawing.Pen($colBorder, 2)

    for ($i = 0; $i -lt 5; $i++) {
        $g.DrawString(("{0}" -f ($i + 1)), $fNum, $brushAccent, $M, ($y - 8))
        $g.DrawString($qs[$i], $fQ, $brushInk, (New-Object System.Drawing.RectangleF(($M + 90), $y, ($contentW - 100), 110)))
        $y += 96
        if ($i -lt 4) { $g.DrawLine($penBorder, ($M + 90), ($y - 14), ($W - $M), ($y - 14)) }
        $y += 30
    }
    $y += 6

    $fCap = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(("If the answers are vague, keep your money." + $NL + "Mine are in the post."), $fCap, (New-Object System.Drawing.SolidBrush($colSoft)), $M, $y)

    $bmp.Save((Join-Path $outDir 'post-19.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 20: the quiet dashboard
function Card-20 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g '20 / 20'
    $y = [double]300
    Draw-KickerTitle $g 'WHAT YOU ACTUALLY SEE' 'The quiet dashboard.' 92 ([ref]$y)
    $y += 30

    # dashboard panel
    $dW = $contentW; $dH = 640
    $panel = New-RoundRect $M $y $dW $dH 26
    $pb = New-PanelBrush $M $y $dW $dH
    $g.FillPath($pb, $panel); $pb.Dispose()
    $g.DrawPath((New-Object System.Drawing.Pen($colBorder, 3)), $panel)

    # window dots
    $dots = @($colMuted, $colMuted, $colAccent)
    for ($i = 0; $i -lt 3; $i++) {
        $g.FillEllipse((New-Object System.Drawing.SolidBrush($dots[$i])), ($M + 36 + $i * 36), ($y + 32), 18, 18)
    }

    # stat tiles
    $tiles = @(
        @{ v = '38';            l = 'calls answered' },
        @{ v = '12';            l = 'rebookings' },
        @{ v = ($GBP + '2,140'); l = 'recovered' }
    )
    $tileW = ($dW - 72 - 48) / 3
    $fV = New-Object System.Drawing.Font('Georgia', 64, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fL = New-Object System.Drawing.Font('Consolas', 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $ty = $y + 80
    for ($i = 0; $i -lt 3; $i++) {
        $tx = $M + 36 + $i * ($tileW + 24)
        $tp = New-RoundRect $tx $ty $tileW 170 16
        $g.FillPath((New-Object System.Drawing.SolidBrush($colBg)), $tp)
        $g.DrawPath((New-Object System.Drawing.Pen($colBorder, 2)), $tp)
        $g.DrawString($tiles[$i].v, $fV, (New-Object System.Drawing.SolidBrush($colInk)), (New-Object System.Drawing.RectangleF($tx, ($ty + 24), $tileW, 80)), $sfCenterTop)
        $g.DrawString($tiles[$i].l, $fL, (New-Object System.Drawing.SolidBrush($colMuted)), (New-Object System.Drawing.RectangleF($tx, ($ty + 112), $tileW, 40)), $sfCenterTop)
    }

    # sparkline
    $sy = $ty + 220
    $sH = 180; $sW = $dW - 72
    $sx = $M + 36
    $vals = @(8, 12, 9, 16, 14, 19, 17, 24, 21, 27, 25, 31)
    $maxV = 31
    $pts = @()
    for ($i = 0; $i -lt $vals.Count; $i++) {
        $px = $sx + ($sW / ($vals.Count - 1)) * $i
        $py = $sy + $sH - ($vals[$i] / $maxV) * $sH
        $pts += (New-Object System.Drawing.PointF($px, $py))
    }
    # area fill
    $area = @((New-Object System.Drawing.PointF($sx, ($sy + $sH)))) + $pts + @((New-Object System.Drawing.PointF(($sx + $sW), ($sy + $sH))))
    $g.FillPolygon((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(36, $colAccent))), $area)
    $g.DrawLines((New-Object System.Drawing.Pen($colAccent, 5)), $pts)
    $last = $pts[$pts.Count - 1]
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($colAccent)), ($last.X - 12), ($last.Y - 12), 24, 24)
    $g.DrawString('tasks handled / week', $fL, (New-Object System.Drawing.SolidBrush($colMuted)), $sx, ($sy + $sH + 16))

    # status row
    $stY = $y + $dH - 76
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($colAccent)), ($M + 40), ($stY + 8), 16, 16)
    $fSt = New-Object System.Drawing.Font('Consolas', 27, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(('all systems running ' + $MID + ' nothing needs you'), $fSt, (New-Object System.Drawing.SolidBrush($colSoft)), ($M + 76), $stY)

    $y += $dH + 40
    $fCap = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('The best week is the one where you never opened it.', $fCap, (New-Object System.Drawing.SolidBrush($colSoft)), $M, $y)

    $bmp.Save((Join-Path $outDir 'post-20.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

Card-11; Card-12; Card-13; Card-14; Card-15
Card-16; Card-17; Card-18; Card-19; Card-20
Write-Host 'done: cards 11-20'
