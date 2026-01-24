# HYDR801 Infusion & Wellness - PWA

A Progressive Web App for GLP-1 patient wellness tracking, nutrition planning, and provider management.

## 🚀 Quick Deploy to Vercel (5 minutes)

### Option A: One-Click Deploy
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign up (free)
3. Click "Import Project" → Select your GitHub repo
4. Click "Deploy" - Done!

### Option B: Command Line Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to this folder
cd hydr801-pwa

# Deploy (follow prompts)
vercel

# Your app will be live at: https://your-project.vercel.app
```

## 📱 Installing as App on Phone

Once deployed, users can install the PWA:

**iPhone/iOS:**
1. Open your deployed URL in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

**Android:**
1. Open your deployed URL in Chrome
2. Tap the menu (3 dots)
3. Tap "Add to Home Screen" or "Install App"
4. Tap "Install"

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
hydr801-pwa/
├── app/
│   ├── layout.js        # App shell with PWA meta tags
│   ├── page.js          # Main page with SW registration
│   ├── HYDR801App.js    # Main React application
│   └── globals.css      # Global styles and animations
├── public/
│   ├── manifest.json    # PWA manifest (app name, icons, colors)
│   ├── sw.js            # Service worker for offline support
│   ├── icon.svg         # App icon (convert to PNG)
│   ├── icon-192.png     # Required: 192x192 app icon
│   └── icon-512.png     # Required: 512x512 app icon
├── package.json
├── next.config.js
└── README.md
```

## ⚠️ Before Deploying: Create App Icons

You need PNG icons for the PWA to work properly:

1. **Use the included SVG:** Open `public/icon.svg` in a browser or design tool
2. **Export as PNG:**
   - `icon-192.png` (192x192 pixels)
   - `icon-512.png` (512x512 pixels)
3. **Or use an online tool:** 
   - [realfavicongenerator.net](https://realfavicongenerator.net)
   - [favicon.io](https://favicon.io)

**Quick Icon Creation (if you have ImageMagick):**
```bash
# From the public folder
convert icon.svg -resize 192x192 icon-192.png
convert icon.svg -resize 512x512 icon-512.png
```

## 🎨 Customization

### Change Brand Colors
Edit `public/manifest.json`:
```json
{
  "theme_color": "#4A6741",    // Your primary color
  "background_color": "#FAF9F7" // Your background color
}
```

### Change App Name
Edit `public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "AppName"
}
```

## 🔧 Environment Variables (Optional)

Create `.env.local` for API keys:
```
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_key_here
```

Then update the AI calls in `HYDR801App.js` to use:
```javascript
headers: {
  'x-api-key': process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
}
```

## 📊 Features

### Patient Features
- ✅ Onboarding flow
- ✅ Daily goal tracking (water, protein, fiber, exercise)
- ✅ AI-powered meal planning
- ✅ Camera fitness assessment
- ✅ Equipment-based workout generation
- ✅ Gamification (streaks, points, badges)
- ✅ Weight logging with charts
- ✅ Full HYDR801 service catalog

### Provider Features
- ✅ Patient dashboard
- ✅ Compliance tracking
- ✅ Patient alerts
- ✅ Weight progress visualization
- ✅ Nutrition/fitness monitoring
- ✅ Messaging interface
- ✅ Practice analytics

## 🔜 Next Steps After PWA

1. **Add Backend Database:**
   - Supabase (free tier available)
   - Firebase (free tier available)
   - PlanetScale (free tier available)

2. **Add User Authentication:**
   - NextAuth.js (free)
   - Clerk (free tier)
   - Auth0 (free tier)

3. **Add Push Notifications:**
   - OneSignal (free tier)
   - Firebase Cloud Messaging (free)

4. **Convert to Native App:**
   - Use Expo to wrap this for App Store
   - Timeline: 4-6 weeks additional

## 📞 Support

HYDR801 Infusion & Wellness
- Phone: 801-917-4386
- Email: hydr801infusion@gmail.com
- Location: West Haven & South Ogden, UT

## 📄 License

Proprietary - HYDR801 Infusion & Wellness © 2025
