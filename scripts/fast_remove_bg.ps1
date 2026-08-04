$source = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class ImageCleaner
{
    private static bool IsBg(Color c)
    {
        if (c.R > 170 && c.G > 170 && c.B > 170)
        {
            int diffRG = Math.Abs(c.R - c.G);
            int diffGB = Math.Abs(c.G - c.B);
            int diffRB = Math.Abs(c.R - c.B);
            if (diffRG < 25 && diffGB < 25 && diffRB < 25)
            {
                return true;
            }
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
                    outBmp.SetPixel(x, y, bmp.GetPixel(x, y));
                }
            }

            bool[,] visited = new bool[w, h];
            Queue<Point> queue = new Queue<Point>();

            for (int x = 0; x < w; x++)
            {
                queue.Enqueue(new Point(x, 0));
                queue.Enqueue(new Point(x, h - 1));
            }
            for (int y = 0; y < h; y++)
            {
                queue.Enqueue(new Point(0, y));
                queue.Enqueue(new Point(w - 1, y));
            }

            int[] dx = { -1, 1, 0, 0 };
            int[] dy = { 0, 0, -1, 1 };

            while (queue.Count > 0)
            {
                Point pt = queue.Dequeue();
                int x = pt.X;
                int y = pt.Y;
                if (x < 0 || x >= w || y < 0 || y >= h) continue;
                if (visited[x, y]) continue;
                visited[x, y] = true;

                Color c = outBmp.GetPixel(x, y);
                if (IsBg(c))
                {
                    outBmp.SetPixel(x, y, Color.Transparent);
                    for (int i = 0; i < 4; i++)
                    {
                        int nx = x + dx[i];
                        int ny = y + dy[i];
                        if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[nx, ny])
                        {
                            queue.Enqueue(new Point(nx, ny));
                        }
                    }
                }
            }

            // Clean up any stray background checkerboard squares
            for (int y = 0; y < h; y++)
            {
                for (int x = 0; x < w; x++)
                {
                    Color c = outBmp.GetPixel(x, y);
                    if (c.A > 0 && IsBg(c))
                    {
                        if ((c.R >= 185 && c.R <= 208 && c.G >= 185 && c.G <= 208 && c.B >= 185 && c.B <= 208) ||
                            (c.R >= 245 && c.G >= 245 && c.B >= 245))
                        {
                            outBmp.SetPixel(x, y, Color.Transparent);
                        }
                    }
                }
            }

            // Find bounding box
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
[ImageCleaner]::Process("C:\Users\admin\Downloads\Gemini_Generated_Image_82f4r882f4r882f4.png", "C:\Users\admin\Downloads\AEON Cloud Connect JS\public\hyper-wireless-logo-clean.png")
"SUCCESS: Cleaned and cropped logo saved!"
