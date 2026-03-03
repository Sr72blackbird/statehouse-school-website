#!/usr/bin/env python3
"""
Logo processing script to generate favicons and optimized versions
from the school logo for different uses.
"""

from PIL import Image
import os
from pathlib import Path

# The logo you provided (stored in attachments)
INPUT_LOGO_PATH = "logo_original.png"  # Download from attachments and save here
OUTPUT_DIR = "frontend/public"

def ensure_output_dir():
    """Create output directory if it doesn't exist"""
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)

def generate_favicon(input_path, output_path):
    """Generate favicon.ico from logo"""
    try:
        img = Image.open(input_path)
        # Convert RGBA to RGB for ICO format
        if img.mode == 'RGBA':
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])
            img = background
        
        # Resize to 32x32 for favicon
        img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
        img_32.save(output_path, format='ICO')
        print(f"✓ Generated favicon: {output_path}")
    except Exception as e:
        print(f"✗ Error generating favicon: {e}")

def generate_logo_sizes(input_path, output_dir):
    """Generate various sizes of the logo for different uses"""
    sizes = {
        'logo-192x192.png': 192,  # PWA icon
        'logo-512x512.png': 512,  # PWA icon (large)
        'logo-256x256.png': 256,  # Social preview
        'logo-128x128.png': 128,  # Smaller previews
    }
    
    try:
        img = Image.open(input_path)
        
        for filename, size in sizes.items():
            output_path = os.path.join(output_dir, filename)
            resized = img.resize((size, size), Image.Resampling.LANCZOS)
            resized.save(output_path, 'PNG', optimize=True)
            print(f"✓ Generated {filename}")
            
    except Exception as e:
        print(f"✗ Error generating sizes: {e}")

def generate_webp(input_path, output_dir):
    """Generate WebP versions for better web performance"""
    try:
        img = Image.open(input_path)
        output_path = os.path.join(output_dir, 'logo.webp')
        img.save(output_path, 'WEBP', quality=90)
        print(f"✓ Generated WebP: {output_path}")
    except Exception as e:
        print(f"✗ Error generating WebP: {e}")

if __name__ == "__main__":
    print("🎓 State House Boys Senior School - Logo Processing")
    print("=" * 50)
    
    if not os.path.exists(INPUT_LOGO_PATH):
        print(f"\n⚠️  Please save the logo image as '{INPUT_LOGO_PATH}' in this directory")
        print("   The logo should be in PNG format with transparency (RGBA)")
        exit(1)
    
    ensure_output_dir()
    
    print("\nProcessing logo...")
    generate_favicon(INPUT_LOGO_PATH, os.path.join(OUTPUT_DIR, 'favicon.ico'))
    generate_logo_sizes(INPUT_LOGO_PATH, OUTPUT_DIR)
    generate_webp(INPUT_LOGO_PATH, OUTPUT_DIR)
    
    print("\n✓ All done! Your logo files are ready in:", OUTPUT_DIR)
    print("\nGenerated files:")
    print("  • favicon.ico - For browser tabs")
    print("  • logo.png - Main logo (from metadata)")
    print("  • logo-192x192.png - PWA icon")
    print("  • logo-512x512.png - PWA icon (large)")
    print("  • logo-256x256.png - Social preview")
    print("  • logo-128x128.png - Smaller sizes")
    print("  • logo.webp - Web-optimized version")
