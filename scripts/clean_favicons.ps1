$source = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

public class FaviconCleaner
{
    private static bool IsWhiteBg(Color c)
    {
        if (c.R > 210 && c.G > 210 && c.B > 210)
        {
            return true;
        }
        return false;
    }

    public static void CleanPng(string path)
    {
        if (!File.Exists(path)) return;
        using (Bitmap bmp = new Bitmap(path))
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
            outBmp.Save(path + ".tmp", ImageFormat.Png);
        }
        File.Delete(path);
        File.Move(path + ".tmp", path);
    }

    public static void SaveAsIco(string pngPath, string icoPath)
    {
        if (!File.Exists(pngPath)) return;
        using (Bitmap bmp = new Bitmap(pngPath))
        using (FileStream fs = new FileStream(icoPath, FileMode.Create))
        using (MemoryStream ms = new MemoryStream())
        {
            bmp.Save(ms, ImageFormat.Png);
            byte[] pngData = ms.ToArray();
            
            // Write ICO header
            fs.WriteByte(0); fs.WriteByte(0); // Reserved
            fs.WriteByte(1); fs.WriteByte(0); // ICO type
            fs.WriteByte(1); fs.WriteByte(0); // 1 image
            
            // Image directory
            fs.WriteByte((byte)bmp.Width);
            fs.WriteByte((byte)bmp.Height);
            fs.WriteByte(0); // No palette
            fs.WriteByte(0); // Reserved
            fs.WriteByte(1); fs.WriteByte(0); // Color planes
            fs.WriteByte(32); fs.WriteByte(0); // 32 bpp
            
            int size = pngData.Length;
            fs.WriteByte((byte)(size & 0xFF));
            fs.WriteByte((byte)((size >> 8) & 0xFF));
            fs.WriteByte((byte)((size >> 16) & 0xFF));
            fs.WriteByte((byte)((size >> 24) & 0xFF));
            
            int offset = 22; // Header size
            fs.WriteByte((byte)(offset & 0xFF));
            fs.WriteByte((byte)((offset >> 8) & 0xFF));
            fs.WriteByte((byte)((offset >> 16) & 0xFF));
            fs.WriteByte((byte)((offset >> 24) & 0xFF));
            
            fs.Write(pngData, 0, size);
        }
    }
}
"@

Add-Type -TypeDefinition $source -ReferencedAssemblies System.Drawing
$pub = "C:\Users\admin\Downloads\AEON Cloud Connect JS\public"

[FaviconCleaner]::CleanPng("$pub\favicon-32x32.png")
[FaviconCleaner]::CleanPng("$pub\favicon-16x16.png")
[FaviconCleaner]::CleanPng("$pub\apple-touch-icon.png")
[FaviconCleaner]::CleanPng("$pub\android-chrome-192x192.png")
[FaviconCleaner]::CleanPng("$pub\android-chrome-512x512.png")

[FaviconCleaner]::SaveAsIco("$pub\favicon-32x32.png", "$pub\favicon.ico")

"SUCCESS: All favicons cleaned of white background and transparent favicon.ico generated!"
