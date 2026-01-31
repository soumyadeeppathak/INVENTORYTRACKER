// Simple icon generator for PWA
// Run with: node scripts/generate-icons.js

const fs = require('node:fs')
const path = require('node:path')

const iconsDir = path.join(__dirname, '../public/icons')

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// Create SVG icons that can be used as placeholders
const createSVGIcon = (size, text) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#6366F1"/>
  <text x="50%" y="50%" font-size="${size * 0.4}" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif">${text}</text>
</svg>`
}

// For now, create SVG files as placeholders
fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), createSVGIcon(192, '📦'))
fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), createSVGIcon(512, '📦'))
fs.writeFileSync(path.join(iconsDir, 'icon-maskable.svg'), createSVGIcon(512, '📦'))

// Create a README
fs.writeFileSync(
  path.join(iconsDir, 'README.md'),
  `# PWA Icons

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
\`\`\`bash
convert icon-192.svg icon-192.png
convert icon-512.svg icon-512.png
convert icon-maskable.svg icon-maskable.png
\`\`\`
`,
)

console.log('✓ Icon placeholders created in public/icons/')
console.log('  Note: SVG placeholders created. Replace with PNG for production.')
