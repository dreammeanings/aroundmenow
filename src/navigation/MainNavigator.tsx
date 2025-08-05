import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import VenueLoginScreen from '../screens/auth/VenueLoginScreen';
import VenueRegisterScreen from '../screens/auth/VenueRegisterScreen';
import UserTypeSelectionScreen from '../screens/auth/UserTypeSelectionScreen';
import AppNavigator from './AppNavigator';
import VenueNavigator from './VenueNavigator';
import { analyticsService } from '../services/analyticsService';

const Stack = createStackNavigator();

// Wrapper components to access navigation
const LoginScreenWrapper = ({ onBackToUserType }: { onBackToUserType: () => void }) => {
  const navigation = useNavigation();
  return (
    <LoginScreen 
      onSwitchToRegister={() => navigation.navigate('Register')} 
      onBackToUserType={onBackToUserType}
    />
  );
};

const RegisterScreenWrapper = ({ onBackToUserType }: { onBackToUserType: () => void }) => {
  const navigation = useNavigation();
  return (
    <RegisterScreen 
      onSwitchToLogin={() => navigation.navigate('Login')} 
      onBackToUserType={onBackToUserType}
    />
  );
};

const VenueLoginScreenWrapper = ({ onBackToUserType }: { onBackToUserType: () => void }) => {
  const navigation = useNavigation();
  return (
    <VenueLoginScreen 
      onSwitchToRegister={() => navigation.navigate('VenueRegister')} 
      onBackToUserType={onBackToUserType}
    />
  );
};

const VenueRegisterScreenWrapper = ({ onBackToUserType }: { onBackToUserType: () => void }) => {
  const navigation = useNavigation();
  return (
    <VenueRegisterScreen 
      onSwitchToLogin={() => navigation.navigate('VenueLogin')} 
      onBackToUserType={onBackToUserType}
    />
  );
};

export default function MainNavigator() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [userType, setUserType] = useState<'user' | 'venue' | null>(null);

  useEffect(() => {
    // Track app launch
    analyticsService.trackScreenView('AppLaunch');
    
    // Check if user has seen landing before
    const checkLandingStatus = async () => {
      try {
        // You can implement AsyncStorage here to remember if user has seen landing
        // For now, we'll show landing for new users
        setShowLanding(!isAuthenticated);
      } catch (error) {
        console.log('Error checking landing status:', error);
      }
    };

    checkLandingStatus();
  }, [isAuthenticated]);

  // Reset showLanding when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('🚪 User logged out, resetting to landing screen');
      console.log('📊 Current state:', { isAuthenticated, showLanding, userType });
      setShowLanding(true);
      setUserType(null);
      console.log('✅ Navigation state reset complete');
    }
  }, [isAuthenticated]);

  const handleGetStarted = () => {
    console.log('🎯 Get Started pressed in MainNavigator');
    console.log('📱 Setting showLanding to false');
    setShowLanding(false);
    analyticsService.trackScreenView('UserTypeSelection');
  };

  const handleUserTypeSelection = (type: 'user' | 'venue') => {
    console.log('User type selected:', type);
    setUserType(type);
    analyticsService.track({
      type: 'user_type_selection',
      userId: 'anonymous',
      properties: { userType: type },
    });
  };

  const handleBackToUserType = () => {
    setUserType(null);
  };

  // Show loading screen
  if (isLoading) {
    console.log('🔄 MainNavigator: Loading...');
    return null; // This will show the loading screen from App.tsx
  }

  // Show landing screen for first-time users
  if (showLanding && !isAuthenticated) {
    console.log('🏠 MainNavigator: Showing Landing Screen');
    console.log('📊 State:', { showLanding, isAuthenticated, userType });
    return <LandingScreen onGetStarted={handleGetStarted} />;
  }

  // Show user type selection
  if (!isAuthenticated && !userType) {
    console.log('👥 MainNavigator: Showing User Type Selection');
    return (
      <NavigationContainer>
        <UserTypeSelectionScreen onUserTypeSelect={handleUserTypeSelection} />
      </NavigationContainer>
    );
  }

  // Show auth screens
  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        >
          {userType === 'venue' ? (
            <>
              <Stack.Screen name="VenueLogin">
                {() => (
                  <VenueLoginScreenWrapper 
                    onBackToUserType={handleBackToUserType}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="VenueRegister">
                {() => (
                  <VenueRegisterScreenWrapper 
                    onBackToUserType={handleBackToUserType}
                  />
                )}
              </Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen name="Login">
                {() => (
                  <LoginScreenWrapper 
                    onBackToUserType={handleBackToUserType}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Register">
                {() => (
                  <RegisterScreenWrapper 
                    onBackToUserType={handleBackToUserType}
                  />
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // Show main app based on user type
  return (
    <NavigationContainer>
      {user?.userType === 'venue' ? <VenueNavigator /> : <AppNavigator />}
    </NavigationContainer>
  );
} 