import React from 'react';
import { Button } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const GoogleLogoutButton = ({ onLogout }) => {
  const signOutWithGoogle = async () => {
    try {
      await GoogleSignin.signOut();
      onLogout(); // Trigger the logout callback
    } catch (error) {
      console.error('Error signing out with Google:', error);
      // Handle the error as needed
    }
  };

  return (
    <Button
      title="Sign out"
      onPress={signOutWithGoogle}
    />
  );
};

export default GoogleLogoutButton;
