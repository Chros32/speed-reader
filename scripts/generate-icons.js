const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// SVG template for the icon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="100%" style="stop-color:#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="200" fill="url(#bg)"/>
  <text x="512" y="560" font-family="Arial, sans-serif" font-size="420" font-weight="bold" fill="white" text-anchor="middle">SR</text>
</svg>`;

async function generateIcon(size, outputPath) {
  await sharp(Buffer.from(svgIcon))
    .resize(size, size)
    .png()
    .toFile(outputPath);
}

async function main() {
  const iosDir = path.join(__dirname, '../ios/App/App/Assets.xcassets/AppIcon.appiconset');
  const androidDir = path.join(__dirname, '../android/app/src/main/res');

  // iOS icon sizes
  const iosSizes = [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024];

  console.log('Generating iOS icons...');
  for (const size of iosSizes) {
    const filename = `icon-${size}.png`;
    await generateIcon(size, path.join(iosDir, filename));
    console.log(`  Created ${filename}`);
  }

  // Generate Contents.json for iOS
  const iosContents = {
    images: [
      { size: "20x20", idiom: "iphone", scale: "2x", filename: "icon-40.png" },
      { size: "20x20", idiom: "iphone", scale: "3x", filename: "icon-60.png" },
      { size: "29x29", idiom: "iphone", scale: "2x", filename: "icon-58.png" },
      { size: "29x29", idiom: "iphone", scale: "3x", filename: "icon-87.png" },
      { size: "40x40", idiom: "iphone", scale: "2x", filename: "icon-80.png" },
      { size: "40x40", idiom: "iphone", scale: "3x", filename: "icon-120.png" },
      { size: "60x60", idiom: "iphone", scale: "2x", filename: "icon-120.png" },
      { size: "60x60", idiom: "iphone", scale: "3x", filename: "icon-180.png" },
      { size: "20x20", idiom: "ipad", scale: "1x", filename: "icon-20.png" },
      { size: "20x20", idiom: "ipad", scale: "2x", filename: "icon-40.png" },
      { size: "29x29", idiom: "ipad", scale: "1x", filename: "icon-29.png" },
      { size: "29x29", idiom: "ipad", scale: "2x", filename: "icon-58.png" },
      { size: "40x40", idiom: "ipad", scale: "1x", filename: "icon-40.png" },
      { size: "40x40", idiom: "ipad", scale: "2x", filename: "icon-80.png" },
      { size: "76x76", idiom: "ipad", scale: "1x", filename: "icon-76.png" },
      { size: "76x76", idiom: "ipad", scale: "2x", filename: "icon-152.png" },
      { size: "83.5x83.5", idiom: "ipad", scale: "2x", filename: "icon-167.png" },
      { size: "1024x1024", idiom: "ios-marketing", scale: "1x", filename: "icon-1024.png" },
    ],
    info: { version: 1, author: "xcode" }
  };
  fs.writeFileSync(path.join(iosDir, 'Contents.json'), JSON.stringify(iosContents, null, 2));
  console.log('  Created Contents.json');

  // Android icon sizes and directories
  const androidSizes = {
    'mipmap-ldpi': 36,
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
  };

  console.log('Generating Android icons...');
  for (const [dir, size] of Object.entries(androidSizes)) {
    const dirPath = path.join(androidDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    await generateIcon(size, path.join(dirPath, 'ic_launcher.png'));
    console.log(`  Created ${dir}/ic_launcher.png`);
  }

  // Play Store icon
  await generateIcon(512, path.join(androidDir, 'playstore-icon.png'));
  console.log('  Created playstore-icon.png');

  console.log('Done!');
}

main().catch(console.error);
