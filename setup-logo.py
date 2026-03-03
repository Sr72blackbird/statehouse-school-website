#!/usr/bin/env python3
"""
Quick setup: Save your logo image as 'logo-source.png' in the same folder as this script,
then run: python setup-logo.py
"""

import os
import sys
from pathlib import Path

# Check if Pillow is available
try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

def setup_logo():
    """Convert and optimize logo for web"""
    
    source_logo = Path("logo-source.png")
    output_dir = Path("frontend/public")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    if not source_logo.exists():
        print("❌ Please save your logo as 'logo-source.png' first")
        print("   Run this script again once the file is in place.")
        return False
    
    if not HAS_PIL:
        print("⚠️  Pillow not installed. Install with: pip install pillow")
        return False
    
    try:
        print("📦 Processing logo...")
        img = Image.open(source_logo)
        
        # Generate favicon (32x32 ICO)
        print("  → Creating favicon.ico (32x32)")
        if img.mode == 'RGBA':
            bg = Image.new('RGB', img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[3])
            img_ico = bg
        else:
            img_ico = img.convert('RGB')
        
        img_ico_32 = img_ico.resize((32, 32), Image.Resampling.LANCZOS)
        img_ico_32.save(output_dir / 'favicon.ico', format='ICO')
        
        # Main logo PNG (keep original size or max 512px)
        print("  → Creating logo.png")
        max_size = 512
        if img.width > max_size or img.height > max_size:
            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        img.save(output_dir / 'logo.png', 'PNG', optimize=True)
        
        # Generate sizes for different uses
        sizes = {
            'logo-192x192.png': 192,  # PWA
            'logo-256x256.png': 256,  # Social preview
            'logo-512x512.png': 512,  # PWA large
        }
        
        for filename, size in sizes.items():
            print(f"  → Creating {filename}")
            img_resized = Image.open(source_logo)
            img_resized.thumbnail((size, size), Image.Resampling.LANCZOS)
            img_resized.save(output_dir / filename, 'PNG', optimize=True)
        
        # WebP version (better compression)
        print("  → Creating logo.webp")
        img_webp = Image.open(source_logo)
        img_webp.save(output_dir / 'logo.webp', 'WEBP', quality=90)
        
        print(f"\n✅ All done! Your logo files are ready in {output_dir}/")
        print("\n📁 Generated files:")
        for f in ['favicon.ico', 'logo.png', 'logo-192x192.png', 'logo-256x256.png', 
                  'logo-512x512.png', 'logo.webp']:
            file_path = output_dir / f
            if file_path.exists():
                size_kb = file_path.stat().st_size / 1024
                print(f"  ✓ {f:25} ({size_kb:.1f} KB)")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = setup_logo()
    sys.exit(0 if success else 1)
