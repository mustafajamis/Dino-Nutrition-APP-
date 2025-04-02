# 🚀 Dino – Your Personal Nutrition Assistant  

**Dino** is a mobile application designed to help students make **healthier food choices** using **AI-driven meal recognition** and **personalized meal plans**. With features like **calorie estimation**, **daily intake tracking**, and **dining hall integration**, Dino makes nutrition tracking effortless.

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

✅ **AI-Powered Meal Recognition** – Take a picture of your meal and get an estimated calorie count.  
✅ **Daily Calorie Tracking** – Log meals and track daily intake.  
✅ **Personalized Meal Plans** – Get tailored meal recommendations based on dietary preferences.  
✅ **Dining Hall Integration** – View meal options available in university dining halls.  
✅ **Nutritional Insights** – Receive detailed reports on eating habits.  
✅ **Progress Tracking** – Monitor long-term nutrition trends and improvements.  

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
- **TypeScript (if used)** – Strongly typed JavaScript for reliability  
- **Python (Flask/FastAPI)** – Backend API services  
- **TensorFlow/Keras** – AI-based meal recognition  
- **PostgreSQL / Firebase** – Database for user data  
- **AWS S3 / Google Cloud Storage** – Storing meal images  

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
│   ├── ScanFood/
│   ├── Calories/
│   ├── Activity/
│   ├── Profile/
│   └── Settings/
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
🚀 Built with **React Native**, **Python**, and **AI-powered meal recognition**  
📢 Inspired by the idea of making **healthy eating effortless for students**  

