# PK Chrome Shortcuts - Chrome Web Store Deployment Guide

## 1. Manifest Configuration
- **manifest_version**: 3
- **author**: cmondary
- **website**: https://mondary.design
- **version format**: X.YY (e.g., 1.27)
- **name**: PK Chrome Shortcuts (67🎛️)

## 2. ZIP Command for Extension
```bash
cd /Users/clm/Documents/GitHub/PROJECTS/Chrome_PKchromeShortcuts/extension
zip -r pk-chrome-shortcuts-1.27.zip -C ../src .
```

Or from src directory:
```bash
zip -r ../extension/pk-chrome-shortcuts-1.27.zip .
```

## 3. Image Requirements for Chrome Web Store
Required images for Chrome Web Store listing:

### Screenshot Requirements (1280x800 or 640x400)
```bash
# Create screenshots from your browser
# Or crop existing images
convert screenshot.png -crop 1280x800+0+0 PKShortcuts_1280x800.png
convert screenshot.png -crop 640x400+0+0 PKShortcuts_640x400.png
```

### Store Icon (128x128)
```bash
# Already created in /store directory
sips -z 128 128 ../icon.png --out icon-128.png
```

### Marquee Image (440x280) - Optional but recommended
```bash
convert preview.png -crop 440x280+0+0 PKShortcuts_440x280.png
```

### Featured Image (1400x560) - For featured listings
```bash
convert banner.png -crop 1400x560+0+0 PKShortcuts_1400x560.png
```

## 4. Permission Justification
**For Chrome Web Store Review:**

### Active Tab Permission
- **Purpose**: Required to interact with and manipulate the active tab's content
- **Use Case**: Enables keyboard shortcuts to work within the currently active tab

### Tabs Permission  
- **Purpose**: Needed for tab management functions (move, close, duplicate tabs)
- **Use Case**: Core functionality for tab organization shortcuts

### Windows Permission
- **Purpose**: Required for window management (minimize, hide, new windows)
- **Use Case**: Window control shortcuts like minimize and window management

### Scripting Permission
- **Purpose**: Enables content script injection for split view and other features
- **Use Case**: Advanced tab utilities and simulated split view functionality

### Storage Permission
- **Purpose**: Saves user preferences and settings
- **Use Case**: Persists user settings like autocopy toggle and other preferences

### ClipboardWrite Permission
- **Purpose**: Required for autocopy functionality
- **Use Case**: Automatically copies selected text when enabled by user

### host_permissions: <all_urls>
- **Purpose**: Required for split view simulation and tab utilities across all websites
- **Use Case**: Core functionality must work regardless of which website is active

## 5. Extension Features
- 67 keyboard shortcuts for Chrome
- Tab management (move, close, duplicate, pin, mute)
- Window management (minimize, hide, new windows)
- Navigation shortcuts (back, forward, search)
- Simulated split view functionality
- Autocopy feature
- Chrome utility shortcuts (bookmarks, history, settings, etc.)

## 6. Deployment Checklist
- [ ] Update version in manifest.json
- [ ] Update name/locales if needed  
- [ ] Test extension locally by loading src/ folder
- [ ] Create zip file from src/ directory
- [ ] Prepare store icon (128x128)
- [ ] Prepare screenshots (1280x800 or 640x400)
- [ ] Upload to Chrome Web Store
- [ ] Fill in store listing details
- [ ] Submit for review