# 🚀 Dino – Your Personal Nutrition Assistant  

**Dino** is a simple and fun mobile application designed to help you **track your daily calorie intake** effortlessly. With features like **easy meal logging**, **calorie tracking**, and **food scanning**, Dino makes staying on top of your nutrition goals simple and enjoyable.

---

## 📋 Table of Contents  

- [✨ Features](#-features)  
- [🚀 Getting Started](#-getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Running the App](#running-the-app)  
- [🏗 Technical Architecture](#-technical-architecture)  
  - [Core Technologies](#core-technologies)  
  - [Project Structure](#project-structure)  
- [🤝 Contributing](#-contributing)  
  - [Coding Standards](#coding-standards)  
- [👥 Contributors](#-contributors)  
- [❓ Troubleshooting](#-troubleshooting)  
  - [Common Issues](#common-issues)  
  - [Getting Help](#getting-help)  
- [📄 License](#-license)  
- [🎉 Acknowledgments](#-acknowledgments)  

---

## ✨ Features  

✅ **Simple Calorie Tracking** – Easily log your meals and track daily calorie intake  
✅ **Quick Add Foods** – Instantly add common foods with pre-set calorie counts  
✅ **Food Scanner** – Take pictures of your food for easy logging  
✅ **Daily Goals** – Set and track your daily calorie targets  
✅ **Meal History** – View your eating history and patterns  
✅ **Clean & Simple UI** – Fun emojis and intuitive design make tracking enjoyable  

---

## 🚀 Getting Started  

### Prerequisites  

Before you begin, ensure you have the following installed:  

- **Node.js** (v16 or higher)  
- **Yarn** (or npm) package manager  
- **React Native CLI**  
- **Xcode** (Mac only, for iOS development)  
- **Android Studio** (for Android development)  
- **Git** (for version control)  

---

### Installation  

Clone the repository:  
```sh
git clone https://github.com/mustafajamis/Dino-Nutrition-APP-.git
```

Navigate to the project directory:  
```sh
cd Dino-Nutrition-APP
```

Install dependencies:  
```sh
npm install --legacy-peer-deps
```

For iOS (Mac only):  
```sh
cd ios && pod install && cd ..
```

---

### Running the App  

#### For Android:  
```sh
npx react-native run-android
```

#### For iOS:  
```sh
npx react-native run-ios
```

#### For Development:  
```sh
npx react-native start
```

---

## 🏗 Technical Architecture  

### Core Technologies  

- **React Native** – Cross-platform mobile development  
- **AsyncStorage** – Local data storage  
- **React Navigation** – App navigation and routing  
- **Context API** – State management for user data and authentication  

---

### Project Structure  

```
Dino-Nutrition-APP/
│
├── assets/                 # All static assets
│   ├── images/             # App images
│   ├── fonts/              # Custom fonts
│   └── icons/              # SVGs or icon sets (optional)
│
├── components/             # Reusable UI components (buttons, cards, etc.)
│   ├── Button/
│   ├── Header/
│   └── FoodCard/
│
├── constants/              # App-wide constants (colors, strings, etc.)
│   ├── colors.js
│   ├── images.js
│   └── fonts.js
│
├── navigation/             # React Navigation setup
│   ├── AppNavigator.js
│   └── TabNavigator.js
│
├── screens/                # One folder per screen
│   ├── Welcome/
│   ├── Onboarding/
│   ├── Login/
│   ├── Home/
│   ├── Food/               # Food scanner
│   ├── Calories/           # Calorie tracking
│   └── Profile/
│
├── context/                # Context API setup (auth, theme, etc.)
│   └── AuthContext.js
│
├── services/               # API services or async functions
│   └── foodRecognitionAPI.js
│
├── utils/                  # Helper functions
│   └── formatCalories.js
│
├── App.js
├── package.json
└── README.md
```

---

## 🤝 Contributing  

We welcome contributions! Here's how you can contribute:  

1. **Fork the repository**  
2. **Create a feature branch**:  
   ```sh
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**:  
   ```sh
   git commit -m "Add amazing feature"
   ```
4. **Push to your branch**:  
   ```sh
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**  

---

### Coding Standards  

- Follow the **React Native & TypeScript (if applicable) style guide**  
- Write **clear and meaningful commit messages**  
- Include **tests for new features**  
- Update documentation when necessary  

---

## 👥 Contributors  

Thank you to all our amazing contributors who have helped make Dino possible!

### Core Team

- [Minh-Tri Bui]
- [Mustafa Jamshidi](https://github.com/mustafajamis)
- [Kyle Liu]

---

## ❓ Troubleshooting  

### Common Issues  

#### **Build Failures**  

- Clear the cache and reinstall dependencies:  
  ```sh
  yarn clean && yarn install
  ```

#### **iOS Issues**  

- Reset iOS dependencies:  
  ```sh
  cd ios && pod deintegrate && pod install
  ```

#### **Android Issues**  

- Clear Gradle cache:  
  ```sh
  cd android && ./gradlew clean
  ```

---

### Getting Help  

- Open an **issue** for bugs  
- Join **discussions** for questions  
- Submit **pull requests** for contributions  

---

## 📄 License  

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.  

---

## 🎉 Acknowledgments  

💡 Thanks to all contributors!  
🚀 Built with **React Native** for simple, cross-platform calorie tracking  
📢 Inspired by the idea of making **healthy eating simple and fun**  

