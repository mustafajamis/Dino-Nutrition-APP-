# 🎯 Developer Quick Reference

## Installation Commands

```bash
# Clone repository
git clone https://github.com/mustafajamis/Dino-Nutrition-APP-.git
cd Dino-Nutrition-APP-

# Install dependencies
npm install --legacy-peer-deps

# iOS only (macOS)
cd ios && pod install && cd ..
```

## Run Commands

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Development Commands

```bash
# Run tests
npm test

# Run linter
npm run lint

# Clear Metro cache
npm start -- --reset-cache
```

## Project Status

✅ **Ready for Development**
- Dependencies: Installed
- Tests: Passing (1/1)
- Linting: Passing (0 errors)
- Features: Complete

## Core Features Implemented

1. ✅ User Authentication (Login/Signup)
2. ✅ Calorie Tracking
3. ✅ Activity Logging
4. ✅ Charts & Analytics
5. ✅ Profile Management
6. ✅ Database (AsyncStorage)

## Tech Stack

- React Native 0.77.0
- React Navigation 7
- AsyncStorage 2.2.0
- React Native Chart Kit
- Context API for state management

## Key Files

```
App.js                      - Main entry
navigation/AppNavigator.js  - Navigation
context/AuthContext.js      - State management
services/DatabaseService.js - Data layer
screens/                    - UI components
```

## Need Help?

- See QUICK_START.md for detailed setup
- See PROJECT_VERIFICATION.md for verification
- See README.md for full documentation
- See DATABASE_IMPLEMENTATION_SUMMARY.md for database info
