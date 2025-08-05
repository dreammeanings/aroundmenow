import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  const [isLogin, setIsLogin] = useState(true);

  return (
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
      {isLogin ? (
        <Stack.Screen name="Login">
          {() => <LoginScreen onSwitchToRegister={() => setIsLogin(false)} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Register">
          {() => <RegisterScreen onSwitchToLogin={() => setIsLogin(true)} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
} 