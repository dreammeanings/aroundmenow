# 🚪 Logout Function Test Guide

## ✅ **Logout Functionality - ENHANCED**

The logout functionality has been enhanced with:
- ✅ **Better Debugging**: Console logs track the entire logout process
- ✅ **Proper Navigation**: Returns to landing screen after logout
- ✅ **Error Handling**: Graceful error handling with user feedback
- ✅ **State Management**: Properly clears all user data and tokens

## 🧪 **How to Test Logout:**

### **Step 1: Login First**
1. **Open**: http://localhost:8081
2. **Login** using the "Sign In" button or "Test Login (Dev)" button
3. **Verify** you're in the main app (should see Discover, Map, Saved, Profile tabs)

### **Step 2: Test Logout**
1. **Navigate to Profile** tab (bottom right)
2. **Scroll down** to find the "Sign Out" button (red button with logout icon)
3. **Click "Sign Out"** button
4. **Confirm** in the alert dialog
5. **Should navigate** back to landing screen

### **Step 3: Verify Logout**
1. **Check** that you're back on the landing screen
2. **Verify** you can't access protected screens
3. **Test** that login works again

## 🔍 **Expected Console Messages:**

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

## 🎯 **What Should Happen:**

### **1. Logout Button Click**
- ✅ Shows confirmation alert
- ✅ "Sign Out" button is red with logout icon
- ✅ Located at bottom of Profile screen

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

## 🐛 **If Logout Doesn't Work:**

### **Check Browser Console (F12):**
- Look for any JavaScript errors
- Verify console messages appear
- Check for network errors

### **Common Issues:**
1. **Button not visible** - Scroll down in Profile screen
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

## 🎉 **Success Indicators:**

- ✅ Logout button is visible and clickable
- ✅ Confirmation dialog appears
- ✅ Console shows debug messages
- ✅ Navigation returns to landing screen
- ✅ Can't access protected screens after logout
- ✅ Can login again after logout

## 📱 **Test Both User Types:**

### **Regular User Logout:**
1. Login as regular user
2. Go to Profile tab
3. Click "Sign Out"
4. Should return to landing screen

### **Venue Owner Logout:**
1. Login as venue owner
2. Go to Profile tab in venue dashboard
3. Click "Sign Out"
4. Should return to landing screen

## 🚀 **Enhanced Features:**

- **Debug Logging**: Complete trace of logout process
- **Error Handling**: Graceful error handling with user feedback
- **State Management**: Properly clears all user data
- **Navigation Reset**: Returns to landing screen
- **Analytics Tracking**: Tracks logout events

**The logout functionality should now work perfectly!** 🎉 