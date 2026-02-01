# 💰 Dirav - Smart Financial Management App

<p align="center">
  <img src="public/icons/icon.svg" alt="Dirav Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Your Personal AI-Powered Financial Advisor</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#installation">Installation</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#configuration">Configuration</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat-square&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa" alt="PWA Ready">
</p>

---

## 📱 About Dirav

**Dirav** is a production-ready Progressive Web App (PWA) designed to help students and young professionals manage their finances intelligently. With AI-powered insights, budget tracking, savings goals, and curated financial opportunities, Dirav makes personal finance simple and engaging.

---

## ✨ Features

### 📊 Dashboard
- Real-time financial overview
- Total balance, savings, and income tracking
- Recent transactions with detailed view
- Featured promotional banners

### 💰 Budget Planning
- Add income and expense transactions
- Category-based organization
- Visual budget progress tracking
- Monthly allowance management

### 🎯 Savings Goals
- Create custom savings goals with icons
- Track progress with visual indicators
- Add money with quick-amount buttons
- Celebration animations on goal completion

### 🏷️ Opportunities (Discover)
- Student discounts and deals
- Scholarship listings
- Filter by category
- Apply/claim tracking

### 📰 Blogs (Discover)
- Financial literacy articles
- Bookmark favorite articles
- Share functionality
- Newsletter subscription

### 🤖 AI Financial Advisor
- Powered by **Google Gemini AI**
- Personalized financial advice
- Budget analysis and tips
- Smart demo mode without API key

### 👤 User Profile
- Authentication (Sign in/Sign up)
- Motivational daily quotes
- Financial statistics overview
- Achievement badges system
- Settings and preferences

### 📱 PWA Features
- Install as native app on any device
- Offline functionality
- Push notification ready
- Responsive design (Mobile, Tablet, Desktop)

---

## 🎬 Demo

### Live Demo
🔗 **[https://dirav-app.vercel.app](https://dirav-app.vercel.app)**

### Screenshots

<details>
<summary>📱 Mobile View</summary>

| Dashboard | Savings | AI Advisor |
|-----------|---------|------------|
| Overview of finances | Track goals | Get AI advice |

</details>

<details>
<summary>💻 Desktop View</summary>

| Full Dashboard | Budget Planning |
|----------------|-----------------|
| Complete financial overview | Detailed transaction management |

</details>

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/dirav-app.git
cd dirav-app
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## ☁️ Deployment

### Deploy to Vercel (Recommended)

#### Option 1: Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"**
4. Import your repository
5. Click **"Deploy"** (Vercel auto-detects Vite)
6. Your app is live! 🎉

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Deploy to Other Platforms

<details>
<summary>Netlify</summary>

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Click "Deploy"

</details>

<details>
<summary>GitHub Pages</summary>

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

</details>

---

## 📲 Install as Native App

### Android (APK)

1. Go to [pwabuilder.com](https://pwabuilder.com)
2. Enter your deployed URL
3. Click "Build My PWA"
4. Select "Android" → Download APK
5. Share APK via Google Drive, WhatsApp, etc.

**To Install APK:**
1. Download the APK file
2. Settings → Security → Enable "Unknown Sources"
3. Tap the APK file → Install

### iOS (iPhone/iPad)

1. Open **Safari** (must be Safari)
2. Go to your app URL
3. Tap **Share** button (⬆️)
4. Scroll down → **"Add to Home Screen"**
5. Tap **"Add"**

### Windows/Mac/Linux

1. Open the app in **Chrome** or **Edge**
2. Click the install icon (⊕) in the address bar
3. Click **"Install"**

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite 7** | Build Tool & Dev Server |
| **Tailwind CSS 4** | Styling |
| **Google Gemini AI** | AI-Powered Advisor |
| **LocalStorage** | Data Persistence |
| **Service Workers** | Offline Support & PWA |

---

## ⚙️ Configuration

### Google Gemini AI API Key

To enable real AI responses:

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the API key
4. Open `src/config/api.ts`
5. Replace the placeholder:

```typescript
export const API_CONFIG = {
  GEMINI_API_KEY: 'YOUR_API_KEY_HERE',  // ← Replace with your key
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
};
```

> **Note:** The app works in Demo Mode without an API key, providing smart contextual responses.

---

## 📁 Project Structure

```
dirav-app/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── icons/                 # App icons
│
├── src/
│   ├── config/
│   │   └── api.ts             # API configuration
│   │
│   ├── context/
│   │   └── AuthContext.tsx    # Authentication state
│   │
│   ├── core/
│   │   ├── icons/             # SVG icon components
│   │   ├── theme/
│   │   │   └── colors.ts      # Design system colors
│   │   └── widgets/
│   │       └── index.tsx      # Reusable UI components
│   │
│   ├── data/
│   │   └── mockDatabase.ts    # Initial data & models
│   │
│   ├── features/
│   │   ├── ai-advisor/
│   │   │   └── AIAdvisorScreen.tsx
│   │   ├── auth/
│   │   │   └── AuthScreen.tsx
│   │   ├── blogs/
│   │   │   └── BlogsScreen.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.tsx
│   │   ├── discover/
│   │   │   └── DiscoverScreen.tsx
│   │   ├── opportunities/
│   │   │   └── OpportunitiesScreen.tsx
│   │   ├── planning/
│   │   │   └── PlanningScreen.tsx
│   │   ├── profile/
│   │   │   └── ProfileScreen.tsx
│   │   └── savings/
│   │       └── SavingsScreen.tsx
│   │
│   ├── layout/
│   │   └── AppShell.tsx       # Main navigation layout
│   │
│   ├── services/
│   │   ├── geminiService.ts   # Gemini AI integration
│   │   └── storageService.ts  # LocalStorage utilities
│   │
│   ├── App.tsx                # Root component
│   ├── index.css              # Global styles
│   └── main.tsx               # Entry point
│
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── vercel.json                # Vercel deployment config
```

---

## 🎨 Design System

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#7C3AED` | Buttons, links, accents |
| Primary Light | `#8B5CF6` | Hover states |
| Accent Gradient | `#7C3AED → #C026D3` | Hero banners |
| Background | `#F8F9FC` | Page background |
| Surface | `#FFFFFF` | Cards, modals |
| Text Primary | `#111827` | Headings |
| Text Secondary | `#6B7280` | Body text |
| Success | `#10B981` | Positive indicators |
| Error | `#EF4444` | Negative indicators |
| Warning | `#F59E0B` | Alerts |
| Info | `#3B82F6` | Information |

### Components

- **DiravCard** - Rounded container with shadow
- **DiravButton** - Primary/Outlined button styles
- **DiravBadge** - Status labels
- **SectionHeader** - Title with action link

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://react.dev/) for the UI framework
- [Vite](https://vitejs.dev/) for the build tool
- [Vercel](https://vercel.com/) for hosting

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

If you have any questions or need help, please:

- Open an [Issue](https://github.com/YOUR_USERNAME/dirav-app/issues)
- Email: your.email@example.com

---

<p align="center">
  Made with ❤️ for students everywhere
</p>

<p align="center">
  ⭐ Star this repo if you find it helpful!
</p>
