$source = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;

public class WhiteBgCleanerV3
{
    private static bool IsWhiteBg(Color c)
    {
        // Any light neutral background pixel (white/light grey card background)
        if (c.R > 200 && c.G > 200 && c.B > 200)
        {
            return true;
        }
        return false;
    }

    public static void Process(string inputPath, string outputPath)
    {
        using (Bitmap bmp = new Bitmap(inputPath))
        {
            int w = bmp.Width;
            int h = bmp.Height;
            Bitmap outBmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);

            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < w; x++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (IsWhiteBg(c))
                    {
                        outBmp.SetPixel(x, y, Color.Transparent);
                    }
                    else
                    {
                        outBmp.SetPixel(x, y, c);
                    }
                }
            }

            // Find bounding box of remaining logo pixels
            int minX = w, minY = h, maxX = 0, maxY = 0;
            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < w; x++)
                {
                    Color c = outBmp.GetPixel(x, y);
                    if (c.A > 20)
                    {
                        if (x < minX) minX = x;
                        if (y < minY) minY = y;
                        if (x > maxX) maxX = x;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            if (minX >= maxX || minY >= maxY)
            {
                minX = 0; minY = 0; maxX = w - 1; maxY = h - 1;
            }

            int pad = 20;
            minX = Math.Max(0, minX - pad);
            minY = Math.Max(0, minY - pad);
            maxX = Math.Min(w - 1, maxX + pad);
            maxY = Math.Min(h - 1, maxY + pad);

            int cropW = maxX - minX + 1;
            int cropH = maxY - minY + 1;

            using (Bitmap cropped = new Bitmap(cropW, cropH, PixelFormat.Format32bppArgb))
            {
                using (Graphics g = Graphics.FromImage(cropped))
                {
                    g.DrawImage(outBmp, new Rectangle(0, 0, cropW, cropH), new Rectangle(minX, minY, cropW, cropH), GraphicsUnit.Pixel);
                }
                cropped.Save(outputPath, ImageFormat.Png);
            }
        }
    }
}
"@

Add-Type -TypeDefinition $source -ReferencedAssemblies System.Drawing
[WhiteBgCleanerV3]::Process("C:\Users\admin\Downloads\Hyper-Wireless.png", "C:\Users\admin\Downloads\AEON Cloud Connect JS\public\hyper-wireless-logo.png")
"SUCCESS: Cleaned and cropped clean-look logo saved to public/hyper-wireless-logo.png!"
