import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View, TouchableOpacity, } from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { GoogleSignin, statusCodes, } from '@react-native-google-signin/google-signin'; 
GoogleSignin.configure({
  // scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
  webClientId: "358987476906-skqqm5usq665sun1gg8tqhhidsvlnnv6.apps.googleusercontent.com",
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
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      console.log('Google Sign-In Success', user);
      setUserLoggedIn(true);
      setUserInfo('User', user);

      const currentUser = GoogleSignin.getTokens().then(res => {
        // console.log('res.accessToken', res.accessToken);
        console.log('currentUser', currentUser);
      });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) { console.log('Google Sign-In Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) { console.log('Google Sign-In is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) { console.log('Play Services not available');
      } else { console.log('Error with Google Sign-In', error); }
    }
  };

  const handleLogout = async () => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    setUserLoggedIn(false);
    setUserInfo(null);
    // You can add your own logout logic here.
  };

  // const youtubeUserData = async () => {
  //   https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&myRating=like&key=[YOUR_API_KEY] HTTP/1.1

  //   Authorization: Bearer [YOUR_ACCESS_TOKEN]
  //   Accept: application/json

  // }

  useEffect(() => {
    // Check the user's login status and info when the component mounts.
    GoogleSignin.isSignedIn().then(isSignedIn => {
      setUserLoggedIn(isSignedIn);
      if (isSignedIn) {
        GoogleSignin.getCurrentUser().then(user => {
          setUserInfo(user);
          console.log('effect user', user);
        });
      }
    });
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
        <View style={{ backgroundColor: isDarkMode ? Colors.black : Colors.white, }}>
          <TouchableOpacity
            onPress={isUserLoggedIn ? handleLogout : handleGoogleLogin}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>
                {isUserLoggedIn ? 'Logout' : 'Google Login'}
              </Text>
            </View>
          </TouchableOpacity>
          {isUserLoggedIn && (
            <View style={styles.userInfoContainer}>
              <Text style={styles.userInfoText}>User Information:</Text>
              {Object.entries(userInfo?.user || {}).map(([key, value]) => (
                <Text key={key}>
                  {key}: {value !== null ? value : 'null'}
                </Text>
              ))}
            </View>
          )}
        </View>
        <Text>{JSON.stringify(userInfo)}</Text>
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
