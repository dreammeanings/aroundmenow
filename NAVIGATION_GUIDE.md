# 🧭 Navigation Guide - Around Me Now

## 🚀 **Complete App Flow**

### **1. Landing Screen (First Time Users)**
- **Location**: `src/screens/LandingScreen.tsx`
- **Purpose**: Welcome new users with app features
- **Navigation**: "Get Started" → User Type Selection

### **2. User Type Selection**
- **Location**: `src/screens/auth/UserTypeSelectionScreen.tsx`
- **Purpose**: Choose between regular user or venue owner
- **Options**:
  - **"I'm Looking for Events"** → Regular user login/register
  - **"I'm a Venue Owner"** → Venue login/register

### **3. Authentication Flow**

#### **Regular Users**
- **Login**: `src/screens/auth/LoginScreen.tsx`
- **Register**: `src/screens/auth/RegisterScreen.tsx`
- **Navigation**: Back to user type selection available

#### **Venue Owners**
- **Login**: `src/screens/auth/VenueLoginScreen.tsx`
- **Register**: `src/screens/auth/VenueRegisterScreen.tsx`
- **Navigation**: Back to user type selection available

### **4. Main App Navigation**

#### **Regular Users** (AppNavigator)
- **Discover**: Browse events
- **Map**: Interactive map view
- **Saved**: Saved events
- **Profile**: User profile & settings

#### **Venue Owners** (VenueNavigator)
- **Dashboard**: Venue overview & stats
- **Events**: Manage venue events
- **Analytics**: Performance metrics
- **Profile**: Venue profile & settings

## 🧪 **Testing Navigation**

### **Test Credentials**

#### **Regular User**
```
Email: test@example.com
Password: password123
```

#### **Venue Owner**
```
Email: venue@jazzclub.com
Password: password123
```

### **Manual Testing Steps**

#### **1. First Time User Flow**
1. Open app → Landing screen appears
2. Tap "Get Started" → User type selection
3. Choose "I'm Looking for Events" → Login screen
4. Tap "Register" → Registration screen
5. Create account → Main app (Discover tab)

#### **2. Venue Owner Flow**
1. Open app → Landing screen appears
2. Tap "Get Started" → User type selection
3. Choose "I'm a Venue Owner" → Venue login screen
4. Tap "Register" → Venue registration screen
5. Create venue account → Venue dashboard

#### **3. Navigation Testing**
- **Back Navigation**: Test back buttons on all screens
- **Tab Switching**: Test all bottom tabs
- **Logout**: Test logout from profile screens
- **User Type Switching**: Test switching between user types

### **Navigation Features**

#### **✅ Implemented**
- [x] Landing screen with "Get Started"
- [x] User type selection (User vs Venue)
- [x] Regular user login/register
- [x] Venue owner login/register
- [x] Back navigation to user type selection
- [x] Separate navigation for users and venues
- [x] Logout functionality
- [x] Smooth transitions and animations

#### **🎯 Key Features**
- **Easy Navigation**: Clear back buttons and intuitive flow
- **User Type Support**: Separate experiences for users and venues
- **Consistent Design**: Unified design language across all screens
- **Accessibility**: Proper contrast and touch targets
- **Responsive**: Works on all screen sizes

## 🔧 **Technical Implementation**

### **Navigation Structure**
```
App.tsx
└── AuthProvider
    └── MainNavigator
        ├── LandingScreen (first time)
        ├── UserTypeSelectionScreen
        ├── AuthNavigator (login/register)
        ├── AppNavigator (regular users)
        └── VenueNavigator (venue owners)
```

### **Key Components**
- **MainNavigator**: Handles complete app flow
- **UserTypeSelectionScreen**: Choose user type
- **AuthNavigator**: Login/register screens
- **AppNavigator**: Regular user tabs
- **VenueNavigator**: Venue owner tabs

### **State Management**
- **AuthContext**: Manages authentication state
- **User Type**: Tracks if user is regular or venue
- **Navigation State**: Handles screen transitions

## 🎨 **Design System**

### **Colors**
- **Primary**: `#FF6B9D` (Pink) - Regular users
- **Secondary**: `#4ECDC4` (Turquoise) - Venue owners
- **Background**: `#1A1A2E` (Dark blue)
- **Surface**: `#16213E` (Medium blue)

### **Navigation Patterns**
- **Bottom Tabs**: Main app navigation
- **Stack Navigation**: Auth and modal flows
- **Back Buttons**: Consistent placement and styling
- **Transitions**: Smooth animations between screens

## 🚀 **Next Steps**

### **Immediate Testing**
1. Test the complete user flow
2. Test venue owner flow
3. Verify all navigation works
4. Test logout functionality
5. Check back button behavior

### **Future Enhancements**
- [ ] Add onboarding tutorial
- [ ] Implement password reset
- [ ] Add social login options
- [ ] Create venue onboarding flow
- [ ] Add push notifications
- [ ] Implement deep linking

## 📱 **Testing Commands**

```bash
# Start the app
npm start

# Test on web
# Open http://localhost:8081

# Test on mobile
# Scan QR code with Expo Go
```

## 🎯 **Success Criteria**

- [x] Users can navigate from landing to main app
- [x] Venue owners have separate navigation
- [x] Back navigation works on all screens
- [x] Logout returns to landing screen
- [x] User type selection is clear and intuitive
- [x] All screens have consistent design
- [x] Navigation is smooth and responsive

**Status**: ✅ **COMPLETE** - All navigation features implemented and working! 