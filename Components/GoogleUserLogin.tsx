import React from 'react';
import { Button } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


const GoogleLoginButton: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {

  const signInWithGoogle = async () => {
    await GoogleSignin.configure({
      // webClientId: '358987476906-j67d68k894ntkm799jlp5285dhu1fhgf.apps.googleusercontent.com'
      // Your Google Client ID
    });

    try {
      const user = await GoogleSignin.signIn();
      console.log('1User logged in:', user, user.idToken, "end"); // Log the user object

      // Handle the Google login response here

      // Call the parent component's onLogin function to indicate successful login
      onLogin(user.idToken);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <Button
      title="Sign in with Google"
      onPress={signInWithGoogle}
    />
  );
};

export default GoogleLoginButton;
