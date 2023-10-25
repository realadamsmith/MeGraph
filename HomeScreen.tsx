import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import HistoryButton from './YoutubeCalls';
import HistoryButton from './YoutubeCalls';
import GoogleLoginButton from './Components/GoogleUserLogin';
import { Button } from 'react-native';
import GoogleLogoutButton from './Components/GoogleLogOut';

function HomeScreen() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (user) => {
    const { idToken } = user; // Extract the access token from the user object
    setAccessToken(idToken);
    setIsLoggedIn(true);
  
    console.log("accesstoken", accessToken, idToken)

  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccessToken(null); // Clear the access token
  };
   
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      {!accessToken && <GoogleLoginButton onLogin={() => handleLogin('access_token_here')} />}
      {accessToken && <Text>Logged in: {accessToken}</Text>}
      {isLoggedIn && <GoogleLogoutButton onLogout={handleLogout} />}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
