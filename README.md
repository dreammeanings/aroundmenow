# Around Me Now 🎉

A modern React Native app that connects people to local events near them, based on preferences, price, vibe, and location. Built with Expo and TypeScript.

## 🎯 Features

### For Event Goers
- **Discover Events Nearby**: Auto-location detection with scrollable feed and map view
- **Smart Filters**: Date range, price range, distance radius, event types, and vibe filters
- **Event Interactions**: Save events, add to calendar, share, and view detailed information
- **Social Layer**: See friends attending events and mutual interests
- **Personalized Recommendations**: Weekly push notifications and smart suggestions
- **User Profile**: Manage preferences, saved events, and notification settings

### For Venues/Hosts
- **Venue Profiles**: Complete venue information with social links
- **Event Management**: Manual event creation and calendar sync
- **Featured Listings**: Premium visibility options
- **Analytics**: Track views, saves, and engagement (Pro+)

## 🏗️ Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for routing
- **React Native Maps** for location features
- **Expo Location** for GPS functionality
- **Expo Notifications** for push notifications
- **Expo Calendar** for calendar integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd around-me-now
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   ├── EventCard.tsx   # Event display component
│   └── FilterModal.tsx # Filter interface
├── screens/            # Main app screens
│   ├── DiscoverScreen.tsx
│   ├── MapScreen.tsx
│   ├── SavedScreen.tsx
│   └── ProfileScreen.tsx
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── services/           # Data and API services
│   └── mockData.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utilities and constants
│   └── constants.ts
└── assets/            # Images and static assets
```

## 🎨 Design System

### Colors
- **Primary**: `#FF6B6B` (Coral Red)
- **Secondary**: `#4ECDC4` (Turquoise)
- **Accent**: `#45B7D1` (Sky Blue)
- **Background**: `#F8F9FA` (Light Gray)
- **Surface**: `#FFFFFF` (White)

### Typography
- **Headings**: Bold, 18-24px
- **Body**: Regular, 14-16px
- **Captions**: Medium, 12-14px

### Spacing
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px

## 💰 Monetization Model

### User Side
- **Always Free**: No barriers to exploration
- **Premium Features**: Enhanced filtering, unlimited saves

### Venue Pricing Tiers
| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 2 events/month, basic listing |
| Lite | $19/mo | Unlimited events, calendar sync, 3 images |
| Pro | $49/mo | Everything + ticket links, featured listings, analytics |
| Elite | $99/mo | Pro + push notifications, RSVPs, front-page boosts |

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
EXPO_PUBLIC_API_URL=your_api_endpoint
```

### API Keys Required
- **Google Maps API Key**: For map functionality
- **Expo Push Token**: For notifications
- **Calendar Permissions**: For calendar integration

## 📊 Mock Data

The app includes comprehensive mock data for development:

- **5 Sample Events**: Various types, prices, and locations
- **3 Sample Venues**: Different tiers and features
- **1 Sample User**: Complete profile with preferences

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📦 Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Build for web
expo build:web
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo** for the amazing development platform
- **React Native** community for the excellent ecosystem
- **Unsplash** for the beautiful sample images
- **Ionicons** for the icon set

## 📞 Support

For support, email support@aroundmenow.com or join our Slack channel.

---

**Around Me Now** - Connecting people to amazing local experiences! 🎉 # aroundmenow
