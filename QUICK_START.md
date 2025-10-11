# Quick Start Guide - Dino Nutrition App

## ✅ Verified Working Setup

This project has been verified to work with the following setup:

### System Requirements
- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- For iOS: **Xcode** (macOS only)
- For Android: **Android Studio** with Android SDK

---

## 🚀 Getting Started (Step by Step)

### 1. Clone the Repository
```bash
git clone https://github.com/mustafajamis/Dino-Nutrition-APP-.git
cd Dino-Nutrition-APP-
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

**Important:** Use the `--legacy-peer-deps` flag to avoid dependency conflicts.

### 3. For iOS Development (macOS only)
```bash
cd ios
pod install
cd ..
```

### 4. Running the App

#### Start Metro Bundler (Terminal 1)
```bash
npm start
```

#### Run on Android (Terminal 2)
```bash
npm run android
```

#### Run on iOS (Terminal 2)
```bash
npm run ios
```

---

## 🧪 Testing

Run the test suite:
```bash
npm test
```

All tests should pass. Some warnings about async operations in navigation are expected and don't affect functionality.

---

## 🔍 Linting

Check code quality:
```bash
npm run lint
```

Note: There may be some warnings about unused variables and inline styles. These are minor and don't prevent the app from working.

---

## 🛠 Project Status

### ✅ What's Working
- ✅ Dependencies install successfully
- ✅ Tests pass
- ✅ Linting runs without errors
- ✅ Database service is implemented and functional
- ✅ User authentication system
- ✅ Calorie tracking with AsyncStorage
- ✅ Dynamic charts and analytics
- ✅ All core screens implemented

### 🎯 Features Available
1. **User Authentication** - Sign up and log in
2. **Calorie Tracking** - Log meals and track daily intake
3. **Activity Logging** - Track exercises and activities
4. **Charts & Analytics** - View weekly and monthly statistics
5. **Profile Management** - Update user information and goals

---

## 📝 Development Notes

### Database
- Uses **AsyncStorage** for local data persistence
- All data is stored locally on the device
- See `services/DatabaseService.js` for implementation details

### State Management
- Uses **React Context API** (`context/AuthContext.js`)
- Global state for user authentication and data

### Navigation
- **React Navigation v7** with Stack and Tab navigators
- Screens: Welcome → Onboarding → Login/Signup → Main App

---

## ❓ Common Issues & Solutions

### Issue: `npm install` fails
**Solution:** Make sure to use `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

### Issue: iOS build fails
**Solution:** Clean and reinstall pods:
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Issue: Android build fails
**Solution:** Clean Gradle cache:
```bash
cd android
./gradlew clean
cd ..
```

### Issue: Metro bundler cache issues
**Solution:** Reset Metro cache:
```bash
npm start -- --reset-cache
```

---

## 🎉 You're Ready!

The project is fully set up and ready for development. All core features are implemented and working:
- Database ✅
- Authentication ✅
- Calorie tracking ✅
- Charts ✅
- Profile management ✅

Happy coding! 🦕
