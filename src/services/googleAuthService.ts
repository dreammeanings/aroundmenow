import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

class GoogleAuthService {
  constructor() {
    // Configure Google Sign-In
    GoogleSignin.configure({
      // You'll need to add your Google OAuth client ID here
      // For now, we'll use a placeholder
      webClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID', // Get this from Google Cloud Console
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
    });
  }

  async signIn() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices();
      
      // Get the users ID token
      const userInfo = await GoogleSignin.signIn();
      
      // Get the ID token
      const tokens = await GoogleSignin.getTokens();
      const idToken = tokens.idToken;
      
      if (!idToken) {
        throw new Error('Failed to get ID token from Google');
      }

      return {
        idToken,
        user: {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          photo: userInfo.photo,
        },
      };
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Play services not available');
      } else {
        throw new Error('Google sign in failed');
      }
    }
  }

  async signOut() {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Google sign out error:', error);
    }
  }

  async isSignedIn() {
    try {
      return await GoogleSignin.isSignedIn();
    } catch (error) {
      console.error('Google is signed in check error:', error);
      return false;
    }
  }

  async getCurrentUser() {
    try {
      return await GoogleSignin.getCurrentUser();
    } catch (error) {
      console.error('Google get current user error:', error);
      return null;
    }
  }
}

export const googleAuthService = new GoogleAuthService(); 