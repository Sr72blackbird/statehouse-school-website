#!/usr/bin/env node

/**
 * Logo setup script for State House Boys Senior School
 * This script converts your logo image to multiple formats for web use
 * 
 * Usage: node setup-logo.js
 */

const fs = require('fs');
const path = require('path');

console.log('🎓 State House Boys Senior School - Logo Setup\n');

// Check for required dependencies
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('📦 Installing sharp (image processor)...\n');
  require('child_process').execSync('npm install sharp', { stdio: 'inherit' });
  sharp = require('sharp');
}

const sourceFile = path.join(process.cwd(), 'logo-source.png');
const outputDir = path.join(process.cwd(), 'frontend', 'public');

async function setupLogo() {
  // Check if source file exists
  if (!fs.existsSync(sourceFile)) {
    console.error('❌ Error: logo-source.png not found');
    console.log('\n📋 Please follow these steps:');
    console.log('   1. Download the school logo image you provided');
    console.log('   2. Save it as "logo-source.png" in the project root:');
    console.log('      ' + sourceFile);
    console.log('   3. Run this script again: node setup-logo.js\n');
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    console.log('📦 Processing logo...\n');

    // Read source image
    const sourceImage = sharp(sourceFile);
    const metadata = await sourceImage.metadata();
    console.log(`   Source: ${metadata.width}×${metadata.height} pixels\n`);

    // Generate favicon (32x32 ICO)
    console.log('  → Generating favicon.ico (32×32)');
    await sharp(sourceFile)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toFormat('png')
      .toFile(path.join(outputDir, 'favicon-temp.png'));
    
    // Convert PNG to ICO using raw buffer (simpler approach)
    const pngBuffer = await sharp(sourceFile)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toFormat('png')
      .toBuffer();
    
    fs.writeFileSync(path.join(outputDir, 'favicon.png'), pngBuffer);
    console.log('     ✓ favicon.png (use .ico converter online if needed)');

    // Main logo PNG
    console.log('  → Generating logo.png');
    const maxSize = 512;
    const width = Math.min(metadata.width, maxSize);
    const height = Math.min(metadata.height, maxSize);
    
    await sharp(sourceFile)
      .resize(width, height, { fit: 'inside', withoutEnlargement: true })
      .toFormat('png')
      .toFile(path.join(outputDir, 'logo.png'));
    console.log('     ✓ logo.png');

    // Generate sizes for different uses
    const sizes = [
      { name: 'logo-192x192.png', size: 192 },
      { name: 'logo-256x256.png', size: 256 },
      { name: 'logo-512x512.png', size: 512 },
    ];

    for (const { name, size } of sizes) {
      console.log(`  → Generating ${name}`);
      await sharp(sourceFile)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .toFormat('png')
        .toFile(path.join(outputDir, name));
      console.log(`     ✓ ${name}`);
    }

    // Generate WebP version
    console.log('  → Generating logo.webp');
    await sharp(sourceFile)
      .toFormat('webp')
      .toFile(path.join(outputDir, 'logo.webp'));
    console.log('     ✓ logo.webp');

    console.log('\n✅ All done! Your logo files are ready:\n');
    console.log(`   📁 ${outputDir}/\n`);

    // List generated files
    const files = [
      'favicon.png',
      'logo.png',
      'logo-192x192.png',
      'logo-256x256.png',
      'logo-512x512.png',
      'logo.webp',
    ];

    for (const file of files) {
      const filePath = path.join(outputDir, file);
      if (fs.existsSync(filePath)) {
        const sizeKb = (fs.statSync(filePath).size / 1024).toFixed(1);
        console.log(`   ✓ ${file.padEnd(25)} (${sizeKb} KB)`);
      }
    }

    console.log('\n💡 Tip: favicon.png works, but for IE11 compatibility:');
    console.log('   Convert favicon.png to .ico format at: https://icoconvert.com/\n');

  } catch (error) {
    console.error('❌ Error processing logo:', error.message);
    process.exit(1);
  }
}

setupLogo();
