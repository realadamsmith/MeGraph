import React, { useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity, // Added this import
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'; // Added this import
GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
  // webClientId: "358987476906-inarjkrt33i1dfjpgaa4cg32i9182v4d.apps.googleusercontent.com",
  // offlineAccess: true
});
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): JSX.Element {
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleGoogleLogin = async () => {
    try {
      // Initialize Google Sign-In

      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      console.log('Google Sign-In Success', user);
      // You can add your own logic here after successful login.
      setUserLoggedIn(true);
      setUserInfo("User", user);

      const currentUser = GoogleSignin.getTokens().then((res)=>{
        console.log("res.accessToken", res.accessToken );
      console.log("currentUser", currentUser)
});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Google Sign-In Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Google Sign-In is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services not available');
      } else {
        console.log('Error with Google Sign-In', error);
      }
    }
  };

  const handleLogout = async () => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    setUserLoggedIn(false);
    setUserInfo(null);
    // You can add your own logout logic here.
  };

  useEffect(() => {
    // Check the user's login status and info when the component mounts.
    GoogleSignin.isSignedIn().then((isSignedIn) => {
      setUserLoggedIn(isSignedIn);
      if (isSignedIn) {
        GoogleSignin.getCurrentUser().then((user) => {
          setUserInfo(user);
          console.log("effect user", user)
        });
      }
    });
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <TouchableOpacity
            onPress={isUserLoggedIn ? handleLogout : handleGoogleLogin}
          >
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>
                {isUserLoggedIn ? 'Logout' : 'Google Login'}
              </Text>
            </View>
          </TouchableOpacity>
          {isUserLoggedIn && userInfo && (
  <View style={styles.userInfoContainer}>
    <Text style={styles.userInfoText}>User Information:</Text>
    {(() => {
      const user = userInfo.user;
      const userInfoElements = [];

      for (const key in user) {
        if (user.hasOwnProperty(key)) {
          userInfoElements.push(
            <Text key={key}>
              {key}: {user[key] || 'N/A'}
            </Text>
          );
        }
      }

      return userInfoElements;
    })()}
  </View>
)}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'salmon', // Change this to your desired button styling
    padding: 20,
    borderRadius: 20,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  userInfoContainer: {
    margin: 20,
  },
  userInfoText: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default App;
