# Generates LinkedIn post cards 21-26: the IT-companies track.
# Custom AI workflows, agents, MCP integrations for dev teams / agencies / MSPs.
# Run:  powershell -ExecutionPolicy Bypass -File .\generate-cards-3.ps1
# NOTE: ASCII-only file; special glyphs built from char codes.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$outDir = Join-Path $here 'cards'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

# Glyphs
$GBP   = [string][char]0x00A3
$CHK   = [string][char]0x2713
$ARROW = [string][char]0x2192
$MID   = [string][char]0x00B7
$TIMES = [string][char]0x00D7
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
    $g.DrawString('Custom AI workflows', $fFoot, $brushMuted, (New-Object System.Drawing.RectangleF($M, ($H - 118), $contentW, 40)), $sfRight)
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

# ---------------------------------------------------------------- 21: the overnight terminal
function Card-21 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'IT 1 / 6'
    $y = [double]300
    Draw-KickerTitle $g 'FOR IT TEAMS + AGENCIES' ("The agent your team" + $NL + "didn" + $APO + "t have to write.") 80 ([ref]$y)
    $y += 16

    # terminal panel
    $tH = 560
    $panel = New-RoundRect $M $y $contentW $tH 24
    $pb = New-PanelBrush $M $y $contentW $tH
    $g.FillPath($pb, $panel); $pb.Dispose()
    $g.DrawPath((New-Object System.Drawing.Pen($colBorder, 3)), $panel)
    $dots = @($colMuted, $colMuted, $colAccent)
    for ($i = 0; $i -lt 3; $i++) {
        $g.FillEllipse((New-Object System.Drawing.SolidBrush($dots[$i])), ($M + 36 + $i * 36), ($y + 30), 18, 18)
    }
    $fPath = New-Object System.Drawing.Font('Consolas', 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('agent.log', $fPath, (New-Object System.Drawing.SolidBrush($colMuted)), (New-Object System.Drawing.RectangleF($M, ($y + 28), ($contentW - 40), 30)), $sfRight)

    $lines = @(
        @{ t = '02:14'; s = ('ticket #4812 triaged ' + $ARROW + ' P2, assigned: infra') },
        @{ t = '02:15'; s = 'customer reply drafted, queued for approval' },
        @{ t = '06:00'; s = ('overnight alerts summarised ' + $ARROW + ' #ops') },
        @{ t = '08:55'; s = ('standup notes posted from yesterday' + $APO + 's PRs') },
        @{ t = '09:30'; s = 'release notes drafted for v2.4.1' },
        @{ t = '16:40'; s = 'weekly client report generated + sent' }
    )
    $fTime = New-Object System.Drawing.Font('Consolas', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fLine = New-Object System.Drawing.Font('Consolas', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $ly = $y + 96
    foreach ($l in $lines) {
        $g.DrawString($l.t, $fTime, $brushAccent, ($M + 40), $ly)
        $g.DrawString($l.s, $fLine, $brushInk, ($M + 144), $ly)
        $ly += 70
    }
    # blinking cursor row
    $g.FillRectangle($brushAccent, ($M + 40), ($ly + 6), 18, 32)

    $y += $tH + 44
    $fCap = New-Object System.Drawing.Font('Segoe UI', 34, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('All of it while your engineers were building.', $fCap, (New-Object System.Drawing.SolidBrush($colSoft)), (New-Object System.Drawing.RectangleF($M, $y, $contentW, 60)), $sfCenterTop)

    $bmp.Save((Join-Path $outDir 'post-21.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 22: MCP hub diagram
function Card-22 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'IT 2 / 6'
    $y = [double]300
    Draw-KickerTitle $g 'MCP, IN ONE PICTURE' ("Your tools, speaking" + $NL + "AI.") 84 ([ref]$y)

    $cx = $W / 2; $cy = 1000
    # spokes first (under the hub)
    $tools = @(
        @{ t = 'Ticketing';  x = 240;  yy = 720 },
        @{ t = 'CI / CD';    x = 960;  yy = 720 },
        @{ t = 'CRM';        x = 190;  yy = 1090 },
        @{ t = 'Database';   x = 1010; yy = 1090 },
        @{ t = 'Docs + wiki';x = 600;  yy = 1280 }
    )
    $penLine = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(150, $colMuted), 3)
    $fMcp = New-Object System.Drawing.Font('Consolas', 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    foreach ($t in $tools) {
        $g.DrawLine($penLine, $cx, $cy, $t.x, $t.yy)
        # MCP pill, pushed past the hub edge along the spoke
        $mx = $cx + ($t.x - $cx) * 0.6; $my = $cy + ($t.yy - $cy) * 0.6
        $pill = New-RoundRect ($mx - 44) ($my - 24) 88 48 22
        $g.FillPath((New-Object System.Drawing.SolidBrush($colBg)), $pill)
        $g.DrawPath((New-Object System.Drawing.Pen($colAccent, 2)), $pill)
        $g.DrawString('MCP', $fMcp, $brushAccent, (New-Object System.Drawing.RectangleF(($mx - 44), ($my - 14), 88, 30)), $sfCenterTop)
    }

    # hub
    Draw-Glow $g $cx $cy 300 50
    $hubR = 130
    $g.FillEllipse((New-Object System.Drawing.SolidBrush($colSurf)), ($cx - $hubR), ($cy - $hubR), (2 * $hubR), (2 * $hubR))
    $g.DrawEllipse((New-Object System.Drawing.Pen($colAccent, 4)), ($cx - $hubR), ($cy - $hubR), (2 * $hubR), (2 * $hubR))
    $fHub = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(("AI" + $NL + "agent"), $fHub, (New-Object System.Drawing.SolidBrush($colInk)), (New-Object System.Drawing.RectangleF(($cx - $hubR), ($cy - $hubR), (2 * $hubR), (2 * $hubR))), $sfCenter)

    # tool boxes
    $fTool = New-Object System.Drawing.Font('Segoe UI', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    foreach ($t in $tools) {
        $bw = 230; $bh = 86
        $bx = $t.x - $bw / 2; $by = $t.yy - $bh / 2
        $box = New-RoundRect $bx $by $bw $bh 16
        $pb = New-PanelBrush $bx $by $bw $bh
        $g.FillPath($pb, $box); $pb.Dispose()
        $g.DrawPath((New-Object System.Drawing.Pen($colBorder, 3)), $box)
        $g.DrawString($t.t, $fTool, $brushInk, (New-Object System.Drawing.RectangleF($bx, $by, $bw, $bh)), $sfCenter)
    }

    $bmp.Save((Join-Path $outDir 'post-22.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 23: engineer-hours bars
function Card-23 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'IT 3 / 6'
    $y = [double]300
    Draw-KickerTitle $g 'THE HIDDEN SPRINT TAX' ("Where engineer-hours" + $NL + "quietly go.") 84 ([ref]$y)
    $y += 24

    $rows = @(
        @{ t = 'Ticket triage + routing';      h = 4.0 },
        @{ t = 'Status updates + reporting';   h = 2.0 },
        @{ t = 'Client comms + chasing';       h = 2.0 },
        @{ t = 'Release notes + changelogs';   h = 1.0 },
        @{ t = 'Onboarding + runbook lookups'; h = 1.0 }
    )
    $maxH = 4.0
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

    $stripH = 110
    $g.FillRectangle((New-Object System.Drawing.SolidBrush($colAccent)), $M, $y, $contentW, $stripH)
    $fStrip = New-Object System.Drawing.Font('Segoe UI', 38, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(($APPROX + ' 10 engineer-hours a week, per team'), $fStrip, (New-Object System.Drawing.SolidBrush($colBg)), (New-Object System.Drawing.RectangleF($M, $y, $contentW, $stripH)), $sfCenter)

    $bmp.Save((Join-Path $outDir 'post-23.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 24: ticket pipeline
function Card-24 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'IT 4 / 6'
    $y = [double]300
    Draw-KickerTitle $g 'ONE WORKFLOW, END TO END' 'A support ticket, handled.' 64 ([ref]$y)
    $y += 20

    $steps = @(
        @{ t = 'NEW TICKET';  d = 'lands in the queue at 2am' },
        @{ t = 'CLASSIFY';    d = 'severity, product area, customer tier' },
        @{ t = 'ENRICH';      d = 'pulls logs, account history, known issues' },
        @{ t = 'DRAFT';       d = 'reply + suggested fix, written up' },
        @{ t = 'APPROVE';     d = 'engineer reviews and sends. 90 seconds.' }
    )
    $bw = 760; $bh = 116; $gapY = 40
    $cx = $W / 2
    $fT = New-Object System.Drawing.Font('Consolas', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fD = New-Object System.Drawing.Font('Segoe UI', 29, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $penArrow = New-Object System.Drawing.Pen($colAccent, 5)
    $penArrow.EndCap = [System.Drawing.Drawing2D.LineCap]::ArrowAnchor

    for ($i = 0; $i -lt 5; $i++) {
        $bx = $cx - $bw / 2
        $by = $y + $i * ($bh + $gapY)
        $isHuman = ($i -eq 4)
        $path = New-RoundRect $bx $by $bw $bh 20
        if ($isHuman) { Draw-Glow $g $cx ($by + $bh / 2) 430 42 }
        $pb = New-PanelBrush $bx $by $bw $bh
        $g.FillPath($pb, $path); $pb.Dispose()
        $pen = if ($isHuman) { New-Object System.Drawing.Pen($colAccent, 3) } else { New-Object System.Drawing.Pen($colBorder, 3) }
        $g.DrawPath($pen, $path); $pen.Dispose()
        $col = if ($isHuman) { $brushAccent } else { New-Object System.Drawing.SolidBrush($colMuted) }
        $g.DrawString($steps[$i].t, $fT, $col, (New-Object System.Drawing.RectangleF($bx, ($by + 16), $bw, 34)), $sfCenterTop)
        $g.DrawString($steps[$i].d, $fD, $brushInk, (New-Object System.Drawing.RectangleF($bx, ($by + 56), $bw, 50)), $sfCenterTop)
        if ($i -lt 4) {
            $g.DrawLine($penArrow, $cx, ($by + $bh + 4), $cx, ($by + $bh + $gapY - 8))
        }
    }
    $y += 5 * ($bh + $gapY) - $gapY + 40

    $fCap = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('Four steps automated. The judgement stays human.', $fCap, (New-Object System.Drawing.SolidBrush($colSoft)), (New-Object System.Drawing.RectangleF($M, $y, $contentW, 60)), $sfCenterTop)

    $bmp.Save((Join-Path $outDir 'post-24.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 25: copilot vs custom
function Card-25 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'IT 5 / 6'
    $y = [double]300
    Draw-KickerTitle $g 'SEATS VS SYSTEMS' ("Copilot licences vs" + $NL + "custom flows.") 84 ([ref]$y)
    $y += 24

    $panelW = ($contentW - 36) / 2
    $panelH = 600
    $left = @('Generic suggestions', 'Ignores your stack', 'Per-seat, forever', 'Data leaves the building', 'Adoption = hope')
    $right = @('Built around your stack', 'Plugs in via MCPs', 'You own the code', 'Runs where you choose', 'Measured in hours')

    $fHead = New-Object System.Drawing.Font('Consolas', 28, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $fItem = New-Object System.Drawing.Font('Segoe UI', 31, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $brushMuted = New-Object System.Drawing.SolidBrush($colMuted)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)

    # left: off-the-shelf (muted)
    $p1 = New-RoundRect $M $y $panelW $panelH 22
    $pb1 = New-PanelBrush $M $y $panelW $panelH
    $g.FillPath($pb1, $p1); $pb1.Dispose()
    $g.DrawPath((New-Object System.Drawing.Pen($colBorder, 3)), $p1)
    $g.DrawString('OFF-THE-SHELF', $fHead, $brushMuted, ($M + 36), ($y + 38))
    $iy = $y + 108
    foreach ($c in $left) {
        $g.DrawString($TIMES, $fItem, $brushMuted, ($M + 36), $iy)
        $g.DrawString($c, $fItem, $brushSoft, (New-Object System.Drawing.RectangleF(($M + 86), $iy, ($panelW - 110), 100)))
        $iy += 94
    }

    # right: custom (accent)
    $ax = $M + $panelW + 36
    $p2 = New-RoundRect $ax $y $panelW $panelH 22
    $pb2 = New-PanelBrush $ax $y $panelW $panelH
    $g.FillPath($pb2, $p2); $pb2.Dispose()
    $g.DrawPath((New-Object System.Drawing.Pen($colAccent, 3)), $p2)
    $g.DrawString('CUSTOM FLOW', $fHead, $brushAccent, ($ax + 36), ($y + 38))
    $iy = $y + 108
    foreach ($c in $right) {
        $g.DrawString($CHK, $fItem, $brushAccent, ($ax + 36), $iy)
        $g.DrawString($c, $fItem, $brushInk, (New-Object System.Drawing.RectangleF(($ax + 86), $iy, ($panelW - 110), 100)))
        $iy += 94
    }

    $fCap = New-Object System.Drawing.Font('Segoe UI', 33, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString('A licence gives you autocomplete. A system gives you hours.', $fCap, $brushSoft, (New-Object System.Drawing.RectangleF($M, ($y + $panelH + 36), $contentW, 60)), $sfCenterTop)

    $bmp.Save((Join-Path $outDir 'post-25.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

# ---------------------------------------------------------------- 26: pilot offer
function Card-26 {
    $r = New-Card; $bmp = $r[0]; $g = $r[1]
    Draw-Chrome $g 'IT 6 / 6'
    $y = [double]300
    Draw-KickerTitle $g 'A SMALL, SAFE START' 'Pilot one workflow.' 92 ([ref]$y)
    $y += 24

    $steps = @(
        @{ n = '01'; t = 'Pick the workflow';   d = 'The one your team groans about most.' },
        @{ n = '02'; t = 'We build + wire it';  d = 'Agent, MCP connectors, approvals. On your infra.' },
        @{ n = '03'; t = 'Measure the hours';   d = 'Two weeks later you have numbers, not a deck.' }
    )
    $fN = New-Object System.Drawing.Font('Georgia', 72, [System.Drawing.FontStyle]::Italic, [System.Drawing.GraphicsUnit]::Pixel)
    $fT = New-Object System.Drawing.Font('Segoe UI', 40, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fD = New-Object System.Drawing.Font('Segoe UI', 31, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $brushInk = New-Object System.Drawing.SolidBrush($colInk)
    $brushSoft = New-Object System.Drawing.SolidBrush($colSoft)
    $brushAccent = New-Object System.Drawing.SolidBrush($colAccent)
    $penBorder = New-Object System.Drawing.Pen($colBorder, 2)

    foreach ($s in $steps) {
        $g.DrawString($s.n, $fN, $brushAccent, $M, ($y - 10))
        $g.DrawString($s.t, $fT, $brushInk, ($M + 130), $y)
        $g.DrawString($s.d, $fD, $brushSoft, (New-Object System.Drawing.RectangleF(($M + 130), ($y + 58), ($contentW - 140), 90)))
        $y += 160
        $g.DrawLine($penBorder, ($M + 130), ($y - 20), ($W - $M), ($y - 20))
        $y += 22
    }
    $y += 10

    # offer strip
    $stripH = 120
    Draw-Glow $g ($W / 2) ($y + $stripH / 2) 520 30
    $strip = New-RoundRect $M $y $contentW $stripH 20
    $g.FillPath((New-Object System.Drawing.SolidBrush($colAccent)), $strip)
    $fStrip = New-Object System.Drawing.Font('Segoe UI', 38, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString(('Fixed scope ' + $MID + ' 2 weeks ' + $MID + ' you own the result'), $fStrip, (New-Object System.Drawing.SolidBrush($colBg)), (New-Object System.Drawing.RectangleF($M, $y, $contentW, $stripH)), $sfCenter)

    $bmp.Save((Join-Path $outDir 'post-26.png'), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
}

Card-21; Card-22; Card-23; Card-24; Card-25; Card-26
Write-Host 'done: cards 21-26'
