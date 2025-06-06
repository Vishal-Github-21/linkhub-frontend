# 🚀 Quick Start Guide - LinkHub Mobile

## ⚡ Get Running in 5 Minutes!

### Step 1: Configure Backend (30 seconds)

```bash
cd linkHubMobile
```

Open `src/utils/config.ts` and replace the backend URL:

```typescript
export const BACKEND_URL = 'https://your-backend-url.com';
```

### Step 2: Run on iOS (macOS only)

**First time only:**

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

**Run the app:**

```bash
npx react-native run-ios
```

### Step 3: Run on Android

**Make sure you have:**

- Android Studio installed
- Android emulator running OR device connected

**Run the app:**

```bash
npx react-native run-android
```

## ✅ That's it!

The app should now be running on your device/emulator.

## 🎯 Quick Test

1. Open the app → See Home screen
2. Tap "Get Started" → See Sign Up screen
3. Toggle to "Sign In" → Test login
4. Create account → See Dashboard
5. Tap "Create New Link" → Create a link
6. Done! ✨

## 🐛 Quick Fixes

### Icons not showing?

**Android:**
Add to `android/app/build.gradle`:

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

Then rebuild.

**iOS:**

```bash
cd ios && pod install && cd ..
```

### Metro bundler issues?

```bash
npx react-native start --reset-cache
```

### Can't connect to backend?

- Check `BACKEND_URL` in `src/utils/config.ts`
- Make sure backend is running
- For localhost on Android: use `http://10.0.2.2:3000` instead of `localhost:3000`

## 📚 More Help?

- Full setup guide: `README_MOBILE.md`
- Technical details: `MIGRATION_GUIDE.md`
- What was done: `CONVERSION_SUMMARY.md`

---

**Happy coding! 🎉**
