Add-Type -AssemblyName System.Drawing

$inputPath = 'C:\Users\admin\Downloads\Gemini_Generated_Image_82f4r882f4r882f4.png'
$outputPath = 'C:\Users\admin\Downloads\AEON Cloud Connect JS\public\hyper-wireless-logo.png'

$bmp = New-Object System.Drawing.Bitmap($inputPath)
$w = $bmp.Width
$h = $bmp.Height

# Create output bitmap with alpha
$out = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Copy pixels first
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $out.SetPixel($x, $y, $bmp.GetPixel($x, $y))
    }
}

# BFS flood fill from borders to remove background checkerboard
$visited = New-Object 'Boolean[,]' $w, $h
$queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]

# Enqueue border points
for ($x = 0; $x -lt $w; $x++) {
    $queue.Enqueue((New-Object System.Drawing.Point($x, 0)))
    $queue.Enqueue((New-Object System.Drawing.Point($x, ($h - 1))))
}
for ($y = 0; $y -lt $h; $y++) {
    $queue.Enqueue((New-Object System.Drawing.Point(0, $y)))
    $queue.Enqueue((New-Object System.Drawing.Point(($w - 1), $y)))
}

function Is-BgColor ($c) {
    # Check if pixel is neutral grey/white of the checkerboard (light grey squares ~195 and white squares ~255)
    if ($c.R -gt 160 -and $c.G -gt 160 -and $c.B -gt 160) {
        $diffRG = [Math]::Abs($c.R - $c.G)
        $diffGB = [Math]::Abs($c.G - $c.B)
        $diffRB = [Math]::Abs($c.R - $c.B)
        if ($diffRG -lt 25 -and $diffGB -lt 25 -and $diffRB -lt 25) {
            return $true
        }
    }
    return $false
}

$dx = @(-1, 1, 0, 0)
$dy = @(0, 0, -1, 1)

while ($queue.Count -gt 0) {
    $pt = $queue.Dequeue()
    $x = $pt.X
    $y = $pt.Y
    if ($x -lt 0 -or $x -ge $w -or $y -lt 0 -or $y -ge $h) { continue }
    if ($visited[$x, $y]) { continue }
    $visited[$x, $y] = $true

    $c = $out.GetPixel($x, $y)
    if (Is-BgColor $c) {
        $out.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        for ($i = 0; $i -lt 4; $i++) {
            $nx = $x + $dx[$i]
            $ny = $y + $dy[$i]
            if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h -and -not $visited[$nx, $ny]) {
                $queue.Enqueue((New-Object System.Drawing.Point($nx, $ny)))
            }
        }
    }
}

# Also remove any remaining checkerboard background pixels that might be detached
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $c = $out.GetPixel($x, $y)
        if ($c.A -gt 0 -and (Is-BgColor $c)) {
            # Only remove if it's strictly matching checkerboard colors (around 195 or 255)
            if (($c.R -ge 190 -and $c.R -le 205 -and $c.G -ge 190 -and $c.G -le 205 -and $c.B -ge 190 -and $c.B -le 205) -or ($c.R -ge 245 -and $c.G -ge 245 -and $c.B -ge 245)) {
                $out.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            }
        }
    }
}

# Find bounding box of non-transparent pixels to crop neatly
$minX = $w
$minY = $h
$maxX = 0
$maxY = 0

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $c = $out.GetPixel($x, $y)
        if ($c.A -gt 20) {
            if ($x -lt $minX) { $minX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

if ($minX -ge $maxX -or $minY -ge $maxY) {
    "No non-transparent pixels found, saving entire image"
    $minX = 0; $minY = 0; $maxX = $w - 1; $maxY = $h - 1
}

# Add padding
$pad = 20
$minX = [Math]::Max(0, $minX - $pad)
$minY = [Math]::Max(0, $minY - $pad)
$maxX = [Math]::Min(($w - 1), $maxX + $pad)
$maxY = [Math]::Min(($h - 1), $maxY + $pad)

$cropW = $maxX - $minX + 1
$cropH = $maxY - $minY + 1

$cropped = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($cropped)
$g.DrawImage($out, (New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)), (New-Object System.Drawing.Rectangle($minX, $minY, $cropW, $cropH)), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$cropped.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

"Saved cropped transparent logo to $outputPath (Size: $cropW x $cropH)"

$cropped.Dispose()
$out.Dispose()
$bmp.Dispose()
