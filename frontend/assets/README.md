# FamilyCore Assets

This folder contains app icons and splash screens.

## Missing Assets

The following asset files are referenced in `app.json` but not included in the repository:

- `icon.png` - App icon (1024x1024 recommended)
- `splash.png` - Splash screen
- `adaptive-icon.png` - Android adaptive icon
- `favicon.png` - Web favicon

## Quick Fix for Development

To get the app running quickly without custom icons:

### Windows PowerShell:
```powershell
# Create simple placeholder images (1x1 pixel PNG files)
# These are temporary - replace with real icons later

# Navigate to assets folder
cd assets

# Download a simple placeholder icon (or create your own)
# For now, you can use any PNG image or download one
```

### OR Use Online Tools:
1. Go to: https://www.favicon-generator.org/
2. Upload any image or create a simple design
3. Download the generated icons
4. Place them in this `assets` folder

## Recommended Sizes:
- **icon.png**: 1024x1024 px
- **splash.png**: 1284x2778 px (iPhone 14 Pro Max)
- **adaptive-icon.png**: 1024x1024 px
- **favicon.png**: 48x48 px (or any size, will be resized)

## For Production:
Replace these placeholders with your actual FamilyCore branding and icons.
