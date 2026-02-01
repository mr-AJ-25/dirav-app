// This script generates PWA icons
// Run with: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple SVG for each size
sizes.forEach(size => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C3AED"/>
      <stop offset="100%" style="stop-color:#C026D3"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bgGradient)"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="240" font-weight="bold" fill="white" text-anchor="middle">D</text>
  <circle cx="380" cy="140" r="40" fill="rgba(255,255,255,0.3)"/>
  <circle cx="420" cy="380" r="60" fill="rgba(255,255,255,0.15)"/>
</svg>`;
  
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg);
  console.log(`Created icon-${size}x${size}.svg`);
});

console.log('\nSVG icons created! For PNG conversion, use an online tool or image editor.');
console.log('Recommended: https://cloudconvert.com/svg-to-png');
