# PWA Icons

## Placeholder Icons

The current icons are SVG placeholders. For production, replace with PNG files:

- icon-192.png (192x192)
- icon-512.png (512x512)
- icon-maskable.png (512x512, with safe area padding)

## Generate PNG Icons

You can use tools like:
- https://www.pwabuilder.com/ (PWA Builder)
- https://realfavicongenerator.net/
- Figma/Sketch export

Or convert SVG to PNG using ImageMagick:
```bash
convert icon-192.svg icon-192.png
convert icon-512.svg icon-512.png
convert icon-maskable.svg icon-maskable.png
```
