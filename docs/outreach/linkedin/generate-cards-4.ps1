# Generates LinkedIn post cards 27-30: the training track.
# In-company AI seminars - teach engineering teams to use AI properly.
# Run:  powershell -ExecutionPolicy Bypass -File .\generate-cards-4.ps1
# NOTE: ASCII-only file; special glyphs built from char codes.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$outDir = Join-Path $here 'cards'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

# Glyphs
$CHK   = [string][char]0x2713
$ARROW = [string][char]0x2192
$MID   = [string][char]0x00B7
$APO   = [string][char]0x2019
$DASH  = [string][char]0x2014
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
    $g.DrawString('AI training for teams', $fFoot, $brushMuted, (New-Object System.Drawing.RectangleF($M, ($H - 118), $contentW, 40)), $sfRight)
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

# ---------------------------------------------------------------- 27: the seminar agenda
function Card-27 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'TR 1 / 4'
    $y = [double]300
    Draw-KickerTitle $g 'IN-COMPANY SEMINARS' ("We teach your engineers" + $NL + "to use AI properly.") 76 ([ref]$y)
    $y += 16

    $sessions = @(
        @{ n = '01'; t = 'Where AI actually helps';      d = 'and where it confidently lies to you' },
        @{ n = '02'; t = 'Prompting + context';           d = 'getting senior-level output, reliably' },
        @{ n = '03'; t = 'Hands-on: your codebase';       d = 'real tickets, real code, live' },
        @{ n = '04'; t = 'Guardrails + data safety';      d = 'what never goes in a prompt, and why' }
    )
    $rowH = 128; $gap = 22
    $fN = New-Object System.Drawing.Font('Georgia', 52, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $fT = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fD = New-Object System.Drawing.Font('Segoe UI', 29, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)

    foreach ($s in $sessions) {
        $path = New-RoundRect $M $y $contentW $rowH 20
        $pb = New-PanelBrush $M $y $contentW $rowH
        $g.FillPath($pb, $path); $pb.Dispose()
        $g.DrawPath((New-Object System.Drawing.Pen($colBorder, 3)), $path)
        # accent edge
        $g.FillRectangle((New-Object System.Drawing.SolidBrush($colAccent)), ($M + 2), ($y + 24), 8, ($rowH - 48))
        $g.DrawString($s.n, $fN, $brushAccent, ($M + 38), ($y + 32))
        $g.DrawString($s.t, $fT, $brushInk, ($M + 150), ($y + 22))
        $g.DrawString($s.d, $fD, $brushSoft, ($M + 150), ($y + 70))
        $y += $rowH + $gap
    }
    $y += 22

    $fCap = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('Run on-site, built around your stack.', $fCap, $brushSoft, (New-Object System.Drawing.RectangleF($M, $y, $contentW, 60)), $sfCenterTop)

    $bmp.Save((Join-Path $outDir 'post-27.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 28: the training gap pictogram
function Card-28 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'TR 2 / 4'
    $y = [double]300
    Draw-KickerTitle $g 'THE ADOPTION ILLUSION' 'The training gap.' 96 ([ref]$y)
    $y += 30

    $fLbl = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fBig = New-Object System.Drawing.Font('Consolas', 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $brushMuted = New-Object System.Drawing.SolidBrush($colMuted)

    # group A: have tools
    $g.DrawString('Engineers with AI tools', $fLbl, $brushInk, $M, $y)
    $g.DrawString('9 in 10', $fBig, $brushAccent, (New-Object System.Drawing.RectangleF($M, ($y + 8), $contentW, 40)), $sfRight)
    $dy = $y + 70
    $dotR = 33; $dotGap = 109
    for ($i = 0; $i -lt 10; $i++) {
        $dx = $M + $i * $dotGap
        if ($i -lt 9) {
            $g.FillEllipse($brushAccent, $dx, $dy, (2 * $dotR), (2 * $dotR))
        } else {
            $g.DrawEllipse((New-Object System.Drawing.Pen($colBorder, 4)), $dx, $dy, (2 * $dotR), (2 * $dotR))
        }
    }
    $y = $dy + 2 * $dotR + 76

    # group B: trained
    $g.DrawString('Engineers shown how to use them well', $fLbl, $brushInk, $M, $y)
    $g.DrawString('2 in 10', $fBig, $brushAccent, (New-Object System.Drawing.RectangleF($M, ($y + 8), $contentW, 40)), $sfRight)
    $dy = $y + 70
    for ($i = 0; $i -lt 10; $i++) {
        $dx = $M + $i * $dotGap
        if ($i -lt 2) {
            $g.FillEllipse($brushAccent, $dx, $dy, (2 * $dotR), (2 * $dotR))
        } else {
            $g.DrawEllipse((New-Object System.Drawing.Pen($colBorder, 4)), $dx, $dy, (2 * $dotR), (2 * $dotR))
        }
    }
    $y = $dy + 2 * $dotR + 84

    $fQuote = New-Object System.Drawing.Font('Georgia', 58, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(("The tools aren" + $APO + "t the bottleneck." + $NL + "The habits are."), $fQuote, $brushInk, $M, $y)

    $bmp.Save((Join-Path $outDir 'post-28.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 29: the curriculum
function Card-29 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'TR 3 / 4'
    $y = [double]300
    Draw-KickerTitle $g 'WHAT WE ACTUALLY COVER' ("A curriculum, not a" + $NL + "demo reel.") 84 ([ref]$y)
    $y += 26

    $mods = @(
        ('Where AI helps ' + $DASH + ' and where it lies'),
        'Prompting + context engineering',
        'Agentic workflows and MCP basics',
        'Security, data + IP hygiene',
        ('Verifying output ' + $DASH + ' tests, review, evals')
    )
    $fNum = New-Object System.Drawing.Font('Georgia', 64, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $fQ = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $penBorder = New-Object System.Drawing.Pen($colBorder, 2)

    for ($i = 0; $i -lt 5; $i++) {
        $g.DrawString(("{0}" -f ($i + 1)), $fNum, $brushAccent, $M, ($y - 8))
        $g.DrawString($mods[$i], $fQ, $brushInk, (New-Object System.Drawing.RectangleF(($M + 90), $y, ($contentW - 100), 110)))
        $y += 96
        if ($i -lt 4) { $g.DrawLine($penBorder, ($M + 90), ($y - 14), ($W - $M), ($y - 14)) }
        $y += 30
    }
    $y += 6

    $fCap = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $g.DrawString(("Every module hands-on, on your stack." + $NL + "Nobody learns from slides."), $fCap, $brushSoft, $M, $y)

    $bmp.Save((Join-Path $outDir 'post-29.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 30: one day, on site
function Card-30 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'TR 4 / 4'
    $y = [double]300
    Draw-KickerTitle $g 'THE FORMAT' 'One day. On site.' 92 ([ref]$y)
    $y += 20

    $slots = @(
        @{ t = '09:30'; h = 'Kick-off';            d = 'where AI fits your team, honestly' },
        @{ t = '10:30'; h = 'Live patterns';        d = 'prompting + context, on real examples' },
        @{ t = '12:00'; h = 'Hands-on';             d = 'your tickets, your codebase, paired' },
        @{ t = '14:30'; h = 'Build an automation';  d = 'one small agent, working by 4pm' },
        @{ t = '16:00'; h = 'The playbook';         d = 'written habits your team keeps' }
    )
    $lineX = $M + 108
    $penLine = New-Object System.Drawing.Pen($colBorder, 4)
    $g.DrawLine($penLine, $lineX, ($y + 10), $lineX, ($y + 5 * 138 - 60))

    $fTime = New-Object System.Drawing.Font('Consolas', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fH = New-Object System.Drawing.Font('Segoe UI', 38, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fD = New-Object System.Drawing.Font('Segoe UI', 30, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)

    foreach ($s in $slots) {
        # node
        $g.FillEllipse((New-Object System.Drawing.SolidBrush($colBg)), ($lineX - 16), ($y + 6), 32, 32)
        $g.DrawEllipse((New-Object System.Drawing.Pen($colAccent, 4)), ($lineX - 16), ($y + 6), 32, 32)
        $g.DrawString($s.t, $fTime, $brushAccent, ($M - 14), ($y + 8))
        $g.DrawString($s.h, $fH, $brushInk, ($lineX + 44), $y)
        $g.DrawString($s.d, $fD, $brushSoft, ($lineX + 44), ($y + 52))
        $y += 138
    }
    $y += 4

    $stripH = 110
    Draw-Glow $g ($W / 2) ($y + $stripH / 2) 520 28
    $strip = New-RoundRect $M $y $contentW $stripH 20
    $g.FillPath((New-Object System.Drawing.SolidBrush($colAccent)), $strip)
    $fStrip = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(('Your office ' + $MID + ' your stack ' + $MID + ' up to 15 engineers'), $fStrip, (New-Object System.Drawing.SolidBrush($colBg)), (New-Object System.Drawing.RectangleF($M, $y, $contentW, $stripH)), $sfCenter)

    $bmp.Save((Join-Path $outDir 'post-30.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

Card-27; Card-28; Card-29; Card-30
Write-Host 'done: cards 27-30'
