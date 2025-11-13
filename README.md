# 🦕 Dino - Simple Nutrition Tracker

A fun and easy-to-use mobile app for tracking your daily calories. Take photos of food, scan for nutrition info, and reach your daily goals!

## ✨ What It Does

- 📸 **Scan Food** - Take photos and get instant nutrition info
- 🍎 **Track Calories** - Log meals and monitor daily intake
- 🎯 **Set Goals** - Create and track your calorie targets
- 📊 **See Progress** - View your daily nutrition summary

## 🚀 Quick Start

### For New Team Members

```bash
# 1. Clone the project
git clone https://github.com/mustafajamis/Dino-Nutrition-APP-.git
cd Dino-Nutrition-APP-

# 2. Run the setup script
npm run setup

# 3. Add your API keys to the .env file that was created
# (See API Setup section below)

# 4. Install dependencies
npm install --legacy-peer-deps

# 5. For iOS only
cd ios && pod install && cd ..

# 6. Run the app
npm run ios      # iOS
npm run android  # Android
```

## 🔑 API Setup

After running `npm run setup`, you'll need to add these API keys to your `.env` file:

### 1. Supabase (User accounts & database)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project (or ask team for access)
3. Go to Settings → API
4. Copy the URL and anon key to your `.env` file

### 2. Calorie Mama (Food recognition)

1. Visit [dev.caloriemama.ai](https://dev.caloriemama.ai/)
2. Sign up for an API key
3. Add it to your `.env` file

**Example .env file:**

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
CALORIE_MAMA_API_KEY=your-api-key-here
CALORIE_MAMA_API_URL=https://api-2445582032290.production.gw.apicast.io/v1/foodrecognition
```

## 🏗️ How It's Built

- **React Native** - Cross-platform mobile app
- **Supabase** - User accounts and data storage
- **Calorie Mama API** - Food recognition from photos
- **AsyncStorage** - Local data backup

## 📱 App Structure

```
📦 Main Screens
├── 🏠 Home - Daily summary and quick actions
├── 🍽️ Calories - Track meals and view progress
├── 📸 Food Scanner - Take photos to scan food
└── 👤 Profile - Settings and user info
```

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 👥 Team

- [Minh-Tri Bui]
- [Mustafa Jamshidi](https://github.com/mustafajamis)
- [Kyle Liu]

## 📄 License

MIT License - see LICENSE file

---

**Made with ❤️ to make healthy eating simple and fun!**
