#!/usr/bin/env python3
"""Build local web assets from authentic captures; --vendor fetches pinned animation libraries."""
import argparse
import hashlib
import json
from pathlib import Path
import urllib.request
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageFilter

STORE = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--wallpaper', type=Path)
    parser.add_argument('--vendor', action='store_true')
    args = parser.parse_args()
    assets = STORE / 'assets'
    assets.mkdir(exist_ok=True)
    if args.vendor:
        vendor = STORE / 'vendor'
        vendor.mkdir(exist_ok=True)
        sources = {
            'gsap.min.js': 'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js',
            'ScrollTrigger.min.js': 'https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js',
            'three.module.min.js': 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.min.js',
            'three.core.min.js': 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.core.min.js',
            'THREE-LICENSE.txt': 'https://cdn.jsdelivr.net/npm/three@0.180.0/LICENSE',
        }
        manifest = []
        for name, url in sources.items():
            with urllib.request.urlopen(url, timeout=40) as response:
                data = response.read()
            (vendor / name).write_bytes(data)
            manifest.append({'file': name, 'url': url, 'sha256': hashlib.sha256(data).hexdigest()})
        (vendor / 'sources.json').write_text(json.dumps(manifest, indent=2) + '\n')
    if args.wallpaper:
        image = Image.open(args.wallpaper).convert('RGB')
        image.thumbnail((1600, 1600))
        image.save(assets / 'wallpaper-1600.webp', quality=86)
        ImageOps.fit(image, (800, 900), centering=(.5, .52)).save(assets / 'wallpaper-mobile.webp', quality=82)
        (assets / 'provenance.json').write_text(json.dumps({
            'wallpaper': {'library': 'premium-promo-media/assets/wallpapers', 'id': '8de42736e150',
                          'sha256': hashlib.sha256(args.wallpaper.read_bytes()).hexdigest(),
                          'source_name': 'Image ChatGPT 28 sept. 2026, 10_45_19.png',
                          'provenance': 'User-provided appWall collection; visual selected by user-approved plan',
                          'crop': '50% 52%'},
            'screenshots': {'source': 'src/keyword-highlighter.js on store/media-kit/demo.html',
                            'viewport': [1280, 800], 'device_scale_factor': 2,
                            'data': 'fictional editorial text',
                            'bridge': 'chrome.runtime.onMessage is a no-op in the web fixture; no installed-extension claim'},
        }, ensure_ascii=False, indent=2) + '\n')
    names = {'05-reading-after': 'reading-after', '06-reading-before': 'reading-before', '07-settings': 'reading-settings'}
    for original, name in names.items():
        path = STORE / 'screenshots' / (original + '.png')
        if path.exists():
            with Image.open(path) as source:
                for width in (1280, 1920):
                    image = source.convert('RGB')
                    image.thumbnail((width, 2000))
                    image.save(assets / f'{name}-{width}.webp', quality=88)
    for path in [assets / 'settings.png', *sorted((assets / 'styles').glob('*.png'))]:
        if path.exists():
            with Image.open(path) as image:
                if path.name == 'settings.png':
                    image = image.crop((32, 32, image.width - 32, image.height - 32)).convert('RGBA')
                    mask = Image.new('L', image.size)
                    ImageDraw.Draw(mask).rounded_rectangle((0, 0, image.width, image.height), radius=20, fill=255)
                    image.putalpha(mask)
                image.save(path.with_suffix('.webp'), quality=92)
    with Image.open(STORE.parent / 'icon.png') as icon:
        icon.thumbnail((128, 128))
        icon.save(assets / 'icon-128.webp', quality=90)
    # Social exports: authentic screenshot composed with the selected wallpaper.
    if (assets / 'wallpaper-1600.webp').exists() and (STORE / 'screenshots/07-settings.png').exists():
        for width, height, name in [(1544, 500, 'banner-1544x500.png'), (1200, 630, 'card-1200x630.png')]:
            poster = Image.new('RGB', (width, height), '#f5f5f7')
            draw = ImageDraw.Draw(poster)
            font = lambda size: ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', size)
            left = 64
            draw.text((left, 42), 'PK HIGHLIGHTER', font=font(18), fill='#52525b')
            title_size = 72 if width > 1200 else 64
            draw.multiline_text((left, 120), 'Surlignez\nl’essentiel.', font=font(title_size), fill='#171717', spacing=2)
            draw.text((left, height - 92), 'Votre web. En plus clair.', font=font(23), fill='#52525b')
            photo_left = 650 if width > 1200 else 530
            wallpaper = ImageOps.fit(Image.open(assets / 'wallpaper-1600.webp'), (width - photo_left, height), centering=(.5, .52))
            poster.paste(wallpaper, (photo_left, 0))
            screen = Image.open(STORE / 'screenshots/07-settings.png').convert('RGB')
            target_width = width - photo_left - 50
            screen = screen.resize((target_width, round(target_width * screen.height / screen.width)), Image.Resampling.LANCZOS)
            y = (height - screen.height) // 2
            shadow = Image.new('RGBA', poster.size)
            ImageDraw.Draw(shadow).rounded_rectangle((photo_left + 17, y + 8, width - 18, y + screen.height + 14), radius=12, fill=(28, 37, 29, 75))
            poster = Image.alpha_composite(poster.convert('RGBA'), shadow.filter(ImageFilter.GaussianBlur(14)))
            mask = Image.new('L', screen.size)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, screen.width, screen.height), radius=10, fill=255)
            poster.paste(screen, (photo_left + 25, y), mask)
            poster.convert('RGB').save(assets / name, optimize=True)
    print('Local media prepared.')


if __name__ == '__main__':
    main()
