# LinkHub Mobile

LinkHub Mobile is a React Native application that brings the full LinkHub experience to iOS and Android devices. It enables users to create, manage, and share personalized linktrees or personal pages on the go, offering seamless mobile access to all LinkHub features.

- Backend API: Connected to LinkHub backend
- Web version: [LinkHub](https://linkhub-frontend-deploy.vercel.app/)
- Demo Hub view: [Hub view](https://linkhub-frontend-deploy.vercel.app/shortview/lvu3d80y)
- Demo Page view: [Page view](https://linkhub-frontend-deploy.vercel.app/pageview/lvu3d80y)

![LinkHub Mobile](../show_images/logo-white.png)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

LinkHub Mobile is the native mobile companion to the LinkHub web application. Built with React Native, it allows users to manage their personalized link pages directly from their smartphones. The app includes user authentication with credential caching, comprehensive link management, and native sharing capabilities.

## Features

- **Secure Authentication**: JWT-based login with "Remember Me" functionality for credential caching
- **Dashboard Management**: View and manage all your LinkHubs in one place
- **Create & Edit LinkHubs**: Full-featured editors with profile customization
- **Action Menu**:
  - View Hub and Page View in browser
  - Share Hub and Page URLs via native share
  - Publish/Unpublish links
  - Update profile icons
- **Social Media Integration**: Add GitHub, Twitter/X, YouTube, and Instagram handles
- **Custom Links**: Add unlimited custom hyperlinks with names
- **Password Recovery**: Forgot password functionality with email verification
- **Responsive Design**: Optimized for both iOS and Android devices
- **Purple Theme**: Beautiful gradient purple theme matching web version (#512da8)

## Screenshots

### Authentication Screens

- **Home Screen**: Welcome page with login/signup options
- **Login Screen**: Secure login with "Remember Me" option
- **Register Screen**: Create new account
- **Forgot Password**: Password recovery via email

### Main Application Screens

- **Dashboard**: View all your LinkHubs with publish status
- **Create LinkHub**: Create new personalized link pages
- **Edit LinkHub**: Full editor with action menu (view, share, publish, update icon)
- **Profile**: View profile and manage account settings
- **Full View**: Preview your LinkHub page

## Technologies Used

### Frontend (Mobile)

- **React Native** 0.82.1
- **TypeScript** 5.3.3
- **React Navigation** (Native Stack)
- **React Native Vector Icons** (FontAwesome)
- **AsyncStorage** for local data persistence

### Backend Integration

- **Node.js** backend API
- **JWT** authentication
- **RESTful API** endpoints

### Development Tools

- **Metro Bundler** 0.83.3
- **React Native CLI**
- **Xcode** (iOS development)
- **Android Studio** (Android development)

## Installation

### Prerequisites

- Node.js (v20.x recommended)
- npm or yarn
- React Native development environment set up
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and Android SDK

> **Note**: Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Vishal-Github-21/lnkhub.git
   cd LinkHub/linkHubMobile
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Install iOS dependencies (iOS only):**

   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

4. **Configure backend URL:**

   Edit `src/utils/config.ts` to set your backend URL:

   ```typescript
   export const BACKEND_URL = 'http://10.0.2.2:4500'; // Android emulator
   // or
   export const BACKEND_URL = 'http://localhost:4500'; // iOS simulator
   ```

## Usage

### Running on Android

1. **Start Metro bundler:**

   ```bash
   npm start
   ```

2. **Run on Android emulator/device:**

   ```bash
   npm run android
   ```

### Running on iOS

1. **Start Metro bundler:**

   ```bash
   npm start
   ```

2. **Run on iOS simulator/device:**

   ```bash
   npm run ios
   ```

If everything is set up correctly, you should see LinkHub Mobile running in the Android Emulator, iOS Simulator, or your connected device.

### Development

- Metro bundler runs on `http://localhost:8081`
- Backend API should be running on configured URL (default: `http://10.0.2.2:4500` for Android)
- Hot reloading is enabled by default

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

### Modifying the App

Open `App.tsx` or any screen in `src/screens/` in your text editor and make changes. When you save, your app will automatically update via [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

To forcefully reload:

- **Android**: Press <kbd>R</kbd> twice or <kbd>Ctrl</kbd>+<kbd>M</kbd> (Windows/Linux) / <kbd>Cmd ⌘</kbd>+<kbd>M</kbd> (macOS) for Dev Menu
- **iOS**: Press <kbd>Cmd ⌘</kbd>+<kbd>R</kbd> in iOS Simulator

## Project Structure

```plaintext
linkHubMobile/
├── android/                  # Android native code
│   ├── app/
│   └── build.gradle
├── ios/                      # iOS native code
│   ├── linkHubMobile/
│   ├── linkHubMobile.xcodeproj/
│   └── Podfile
├── src/
│   ├── assets/              # Images and static assets
│   ├── components/          # Reusable React components
│   ├── screens/             # Application screens
│   │   ├── AuthScreen.tsx        # Login/Register
│   │   ├── DashboardScreen.tsx   # Dashboard
│   │   ├── CreateScreen.tsx      # Create LinkHub
│   │   ├── EditScreen.tsx        # Edit LinkHub
│   │   ├── ProfileScreen.tsx     # User profile
│   │   ├── FullViewScreen.tsx    # Preview page
│   │   └── ForgotPasswordScreen.tsx
│   └── utils/
│       ├── config.ts        # API configuration
│       └── storage.ts       # AsyncStorage wrapper
├── App.tsx                  # Root component with navigation
├── index.js                 # Entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Configuration

### Backend URL Configuration

The app connects to the LinkHub backend. Update the configuration in `src/utils/config.ts`:

```typescript
// For Android Emulator (localhost from host machine)
export const BACKEND_URL = 'http://10.0.2.2:4500';

// For iOS Simulator
export const BACKEND_URL = 'http://localhost:4500';

// For physical devices (use your computer's local IP)
export const BACKEND_URL = 'http://192.168.x.x:4500';

// For production
export const BACKEND_URL = 'https://your-backend-url.com';

// Frontend URL for sharing
export const FRONTEND_URL = 'https://linkhub-frontend-deploy.vercel.app';
```

## API Endpoints

The mobile app consumes the same API endpoints as the web version:

### Authentication

- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /forgot-password` - Send password reset email
- `POST /reset-password/:token` - Reset password

### Link Management (Authenticated)

- `GET /dashboard` - Get user's LinkHubs
- `POST /create-link` - Create new LinkHub
- `PUT /update-link` - Update LinkHub
- `DELETE /delete-link/:linkId` - Delete LinkHub
- `PUT /publish-link/:linkId` - Publish LinkHub
- `PUT /unpublish-link/:linkId` - Unpublish LinkHub
- `GET /view-link/:linkId` - View public LinkHub
- `GET /get-link/:linkId` - Get LinkHub details

### User Management (Authenticated)

- `PUT /update-password` - Update password

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow React Native best practices
- Use TypeScript for type safety
- Maintain consistent code formatting
- Test on both iOS and Android
- Update documentation for new features

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for more details.

## Contact

For any inquiries or feedback, please reach out:

- **Email**: vishalmukkannavar690@gmail.com
- **GitHub**: [@Vishal-Github-21](https://github.com/Vishal-Github-21)
- **Web**: [LinkHub](https://linkhub-frontend-deploy.vercel.app/)

---

**Note**: This is the mobile version of LinkHub. For the web application, see the main [LinkHub repository](../Readme.md).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
