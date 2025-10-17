# Favicon Setup

A favicon is the small icon that appears in browser tabs, bookmarks, and browser history.

## What You Need:

Create these files and place them in the `public` folder:

1. **favicon.ico** - 32x32 px (classic favicon)
2. **apple-touch-icon.png** - 180x180 px (for iOS devices)
3. **favicon-16x16.png** - 16x16 px
4. **favicon-32x32.png** - 32x32 px

## Easy Way to Create Favicons:

1. **RealFaviconGenerator** (recommended): https://realfavicongenerator.net/
   - Upload a square logo (at least 260x260 px)
   - Customize for different platforms
   - Download all generated files
   - Copy them to the `public` folder

2. **Favicon.io**: https://favicon.io/
   - Create from text, image, or emoji
   - Automatically generates all sizes
   - Free and simple

## Design Tips:

- Use a simple, recognizable symbol
- Consider using your initials "LL" for Lincoln Law
- Use your brand color (blue)
- Avoid complex details (won't be visible at small size)
- Test at actual size (16x16px) to ensure legibility

## Next.js Automatic Detection:

Next.js will automatically detect and serve these files from the `public` folder:
- `/favicon.ico`
- `/apple-touch-icon.png`

No configuration needed!

## Quick Solution for Testing:

You can temporarily use an emoji as a favicon. Add this to `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90">⚖️</text>
</svg>
```

This scales emoji (⚖️ = scales of justice) is perfect for a law firm and works at any size!
