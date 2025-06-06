# LinkHub Mobile - React Native App

This is the mobile version of LinkHub, converted from the React web application to React Native.

## 📱 Project Structure

```
linkHubMobile/
├── App.tsx                 # Main app with navigation setup
├── src/
│   ├── screens/           # All screen components
│   │   ├── HomeScreen.tsx
│   │   ├── AuthScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── CreateScreen.tsx
│   │   ├── EditScreen.tsx
│   │   ├── FullViewScreen.tsx
│   │   └── ForgotPasswordScreen.tsx
│   ├── components/        # Reusable components
│   ├── utils/             # Utility functions
│   │   ├── config.ts      # Backend URL configuration
│   │   └── storage.ts     # AsyncStorage utilities
│   └── assets/            # Images, fonts, etc.
```

## 🚀 Setup Instructions

### Prerequisites

1. **Node.js** (v20 or higher recommended, though v18 works with warnings)
2. **React Native development environment**
   - For iOS: Xcode (macOS only)
   - For Android: Android Studio and Android SDK

### Installation

1. **Install dependencies:**

   ```bash
   cd linkHubMobile
   npm install
   ```

2. **Configure Backend URL:**

   - Open `src/utils/config.ts`
   - Replace `'YOUR_BACKEND_URL_HERE'` with your actual backend URL

   ```typescript
   export const BACKEND_URL = 'https://your-backend.com';
   // or 'http://localhost:3000' for local development
   ```

3. **iOS Setup (macOS only):**

   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

4. **Android Setup:**
   - Make sure you have Android SDK installed
   - Vector icons need to be linked (see below)

### Setting Up Icons

For **Android**, add this to `android/app/build.gradle`:

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

For **iOS**, icons should auto-link, but if not:

```bash
cd ios && pod install
```

## 🏃 Running the App

### iOS (macOS only):

```bash
npx react-native run-ios
```

### Android:

```bash
npx react-native run-android
```

Make sure you have an emulator running or a device connected.

## 📝 Key Differences from Web App

### 1. **Components Conversion**

| Web Component           | React Native Component |
| ----------------------- | ---------------------- |
| `<div>`                 | `<View>`               |
| `<span>`, `<p>`, `<h1>` | `<Text>`               |
| `<button>`              | `<TouchableOpacity>`   |
| `<input>`               | `<TextInput>`          |
| `<img>`                 | `<Image>`              |

### 2. **Routing**

- **Web:** `react-router-dom` with `<Route>`, `<Link>`
- **Mobile:** `@react-navigation/native` with Stack Navigator

### 3. **Storage**

- **Web:** `localStorage.setItem()`, `localStorage.getItem()`
- **Mobile:** `AsyncStorage.setItem()`, `AsyncStorage.getItem()` (async)

### 4. **Styling**

- **Web:** CSS files
- **Mobile:** `StyleSheet.create()` with flexbox

### 5. **Icons**

- **Web:** `@fortawesome/react-fontawesome`
- **Mobile:** `react-native-vector-icons`

## 🎨 Features Implemented

✅ **Authentication**

- Sign Up
- Sign In
- Forgot Password

✅ **Dashboard**

- View all links
- Search functionality
- Link cards with status badges

✅ **Create Link**

- Profile image (placeholder)
- Contact information
- Bio
- Social handles (GitHub, X, YouTube, Instagram)
- Custom links

✅ **Profile**

- User profile view
- Logout functionality

✅ **Navigation**

- Stack navigation
- Bottom tab navigation on Dashboard

## ⚠️ Known Limitations & Future Improvements

### Not Implemented:

1. **Rich Text Editor** - The web version uses `react-quill`, which doesn't work in React Native. Consider using:
   - `react-native-pell-rich-editor`
   - `react-native-cn-quill`
2. **Image Upload** - Profile image upload needs:

   - `react-native-image-picker` or
   - `expo-image-picker`

3. **Edit Screen** - Currently a placeholder, needs full implementation

4. **Full View Screen** - Currently a placeholder, needs implementation

### To Improve:

- Add loading states for better UX
- Add pull-to-refresh on Dashboard
- Implement image caching
- Add offline support
- Better error handling
- Form validation improvements

## 📦 Dependencies

```json
{
  "@react-navigation/native": "^6.x",
  "@react-navigation/native-stack": "^6.x",
  "react-native-screens": "^3.x",
  "react-native-safe-area-context": "^4.x",
  "@react-native-async-storage/async-storage": "^1.x",
  "react-native-vector-icons": "^10.x",
  "axios": "^1.x"
}
```

## 🔧 Configuration

### Backend Integration

The app is configured to work with your existing backend. Make sure to:

1. Update `BACKEND_URL` in `src/utils/config.ts`
2. Ensure CORS is configured on your backend to accept mobile requests
3. The authentication endpoints remain the same:
   - `/register`
   - `/login`
   - `/dashboard`
   - `/create-link`
   - `/forgot-password`

### Environment Variables

For production, consider using:

- `react-native-config` for environment variables
- `.env` files for different environments (dev, staging, prod)

## 🐛 Troubleshooting

### Icons not showing:

```bash
# For iOS
cd ios && pod install && cd ..

# For Android
Rebuild the app after adding the gradle config
```

### Metro bundler issues:

```bash
# Clear cache
npx react-native start --reset-cache
```

### Build errors:

```bash
# Clean build
# iOS
cd ios && xcodebuild clean && cd ..

# Android
cd android && ./gradlew clean && cd ..
```

## 📱 Testing

### On iOS Simulator:

- Press `Cmd + D` to open developer menu
- Enable Fast Refresh

### On Android Emulator:

- Press `Cmd + M` (Mac) or `Ctrl + M` (Windows/Linux)
- Enable Fast Refresh

### Physical Device:

- Make sure device is connected
- Developer mode enabled
- USB debugging enabled (Android)

## 🚢 Deployment

### iOS (App Store):

1. Configure signing in Xcode
2. Archive the app
3. Upload to App Store Connect
4. Submit for review

### Android (Play Store):

1. Generate release APK/AAB
2. Sign with release keystore
3. Upload to Google Play Console
4. Submit for review

For detailed deployment instructions, refer to React Native documentation.

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Vector Icons](https://github.com/oblador/react-native-vector-icons)

## 👨‍💻 Development Tips

1. **Use TypeScript** - Already configured, provides better type safety
2. **Test on both platforms** - iOS and Android may behave differently
3. **Handle permissions** - Camera, storage, etc. need permission handling
4. **Optimize images** - Use appropriate image sizes for mobile
5. **Test on real devices** - Simulators don't represent real performance

## 📄 License

Same license as the main LinkHub project.

## 🤝 Contributing

This is a conversion of the LinkHub web app to React Native. Contributions are welcome!

---

**Note:** This mobile app uses the same backend as the web version. Make sure your backend is running and accessible before testing the mobile app.
