# 🚪 Logout Function Test Guide

## ✅ **ENHANCED LOGOUT FUNCTIONALITY**

The logout functionality has been **ENHANCED** with:
- ✅ **Prominent Logout Button**: Red background with white text and shadow
- ✅ **Test Logout Button**: Easy-to-find test button in header
- ✅ **Better Debugging**: Comprehensive console logging
- ✅ **Proper Navigation**: Returns to landing screen after logout
- ✅ **Error Handling**: Graceful error handling with user feedback

## 🧪 **HOW TO TEST LOGOUT:**

### **Step 1: Start the App**
1. **Open**: http://localhost:8081
2. **Wait** for the app to load completely
3. **Verify** you see the landing screen

### **Step 2: Login**
1. **Click "Get Started"** on landing screen
2. **Select "User"** (not venue)
3. **Click "Sign In"** or **"Test Login (Dev)"** button
4. **Verify** you're in the main app (Discover, Map, Saved, Profile tabs)

### **Step 3: Test Logout - EASY WAY**
1. **Go to Profile tab** (bottom right)
2. **Look for "Test Logout" button** in the header (red button)
3. **Click "Test Logout"** button
4. **Confirm** in the alert dialog
5. **Should return** to landing screen

### **Step 4: Test Logout - REGULAR WAY**
1. **Go to Profile tab** (bottom right)
2. **Scroll down** to find the large red "Sign Out" button
3. **Click "Sign Out"** button
4. **Confirm** in the alert dialog
5. **Should return** to landing screen

### **Step 5: Verify Logout**
1. **Check** that you're back on the landing screen
2. **Verify** you can't access protected screens
3. **Test** that login works again

## 🔍 **EXPECTED CONSOLE MESSAGES:**

### **When Logout is Initiated:**
```
🔐 ProfileScreen: Logout requested
```

### **When User Confirms:**
```
✅ User confirmed logout
🚪 Logging out user: test@example.com
✅ Auth token removed from storage
✅ API service token cleared
✅ User state cleared
🎉 Logout completed successfully
✅ Logout completed, navigating to landing screen
🚪 User logged out, resetting to landing screen
🏠 MainNavigator: Showing Landing Screen
```

## 🎯 **WHAT SHOULD HAPPEN:**

### **1. Logout Buttons**
- ✅ **Test Logout Button**: Red button in header with "Test Logout" text
- ✅ **Main Logout Button**: Large red button at bottom with "Sign Out" text
- ✅ **Both buttons** are clickable and visible

### **2. Confirmation Dialog**
- ✅ "Are you sure you want to sign out?" message
- ✅ "Cancel" and "Sign Out" options
- ✅ "Sign Out" is red (destructive style)

### **3. Logout Process**
- ✅ Clears authentication token
- ✅ Clears user data
- ✅ Resets navigation state
- ✅ Shows console debug messages

### **4. Navigation After Logout**
- ✅ Returns to landing screen
- ✅ Can't access protected screens
- ✅ Can login again normally

## 🐛 **IF LOGOUT DOESN'T WORK:**

### **Check Browser Console (F12):**
- Look for any JavaScript errors
- Verify console messages appear
- Check for network errors

### **Common Issues:**
1. **Button not visible** - Check both test button in header and main button at bottom
2. **No confirmation dialog** - Check if Alert is working
3. **Stuck on Profile screen** - Check navigation state
4. **Can still access app** - Check if user state was cleared

### **Test Commands:**
```bash
# Check if backend is running
curl http://localhost:3000/health

# Check if app is accessible
curl http://localhost:8081
```

## 🎉 **SUCCESS INDICATORS:**

- ✅ **Test Logout button** is visible in header (red)
- ✅ **Main Logout button** is visible at bottom (large red)
- ✅ **Confirmation dialog** appears
- ✅ **Console shows** debug messages
- ✅ **Navigation returns** to landing screen
- ✅ **Can't access** protected screens after logout
- ✅ **Can login again** after logout

## 📱 **TEST BOTH USER TYPES:**

### **Regular User Logout:**
1. Login as regular user
2. Go to Profile tab
3. Click either "Test Logout" or "Sign Out"
4. Should return to landing screen

### **Venue Owner Logout:**
1. Login as venue owner
2. Go to Profile tab in venue dashboard
3. Click "Sign Out"
4. Should return to landing screen

## 🚀 **ENHANCED FEATURES:**

- **Two Logout Buttons**: Test button in header + main button at bottom
- **Prominent Styling**: Red background with white text and shadow
- **Debug Logging**: Complete trace of logout process
- **Error Handling**: Graceful error handling with user feedback
- **State Management**: Properly clears all user data
- **Navigation Reset**: Returns to landing screen
- **Analytics Tracking**: Tracks logout events

## 🎯 **QUICK TEST:**

1. **Open**: http://localhost:8081
2. **Login** using any method
3. **Go to Profile tab**
4. **Click "Test Logout"** (red button in header)
5. **Confirm** logout
6. **Should return** to landing screen

**The logout functionality should now work perfectly with TWO easy ways to test it!** 🎉 