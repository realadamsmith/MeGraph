// ProfileScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


const ProfileScreen = ({onSignOut}) => {

  const handleLogout = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();

    if (!isSignedIn) {
      onSignOut(); // Trigger the sign-out callback
      return;
    }
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    onSignOut(); // Trigger the sign-out callback
  };

  return (
    <View style={styles.container}>
      <Text>Hello Profile!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
