Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

$root = 'C:\Users\HomePC\Desktop\ng.ab-labs.cv'
$srcPath = Join-Path $root 'public\assets\favicon\source.png'
$outDir = Join-Path $root 'public\assets\favicon'

$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# Sample background colour from a corner
$bg = $src.GetPixel(2, 2)

# Find the bounding box of dark (logo) pixels
$minX = $src.Width; $minY = $src.Height; $maxX = -1; $maxY = -1
for ($y = 0; $y -lt $src.Height; $y += 2) {
    for ($x = 0; $x -lt $src.Width; $x += 2) {
        $p = $src.GetPixel($x, $y)
        $lum = 0.299 * $p.R + 0.587 * $p.G + 0.114 * $p.B
        if ($lum -lt 110) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "logo bbox: $minX,$minY -> $maxX,$maxY (bg=$($bg.R),$($bg.G),$($bg.B))"

$logoW = $maxX - $minX
$logoH = $maxY - $minY
$pad = [int]([Math]::Max($logoW, $logoH) * 0.08)
$side = [Math]::Max($logoW, $logoH) + ($pad * 2)

$cx = $minX + $logoW / 2.0
$cy = $minY + $logoH / 2.0
$cropX = [int]($cx - $side / 2.0)
$cropY = [int]($cy - $side / 2.0)

# Clamp the square crop to the source bounds
if ($cropX -lt 0) { $cropX = 0 }
if ($cropY -lt 0) { $cropY = 0 }
if (($cropX + $side) -gt $src.Width) { $side = $src.Width - $cropX }
if (($cropY + $side) -gt $src.Height) { $side = $src.Height - $cropY }

Write-Output "crop: $cropX,$cropY ${side}x${side}"

$sizes = @{
    'favicon-32.png'         = 32
    'favicon-192.png'        = 192
    'favicon-512.png'        = 512
    'apple-touch-icon.png'   = 180
}

foreach ($name in $sizes.Keys) {
    $size = $sizes[$name]
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $bgBrush = New-Object System.Drawing.SolidBrush($bg)
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $side, $side)
    $g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

    $bmp.Save((Join-Path $outDir $name), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "wrote $name ($size x $size)"
}

$src.Dispose()
