// GoogleLogin.tsx
import React, {useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, } from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
  webClientId:
    '358987476906-skqqm5usq665sun1gg8tqhhidsvlnnv6.apps.googleusercontent.com',
  // offlineAccess: true
});
const GoogleLogin = ({onAccessTokenChange, onSignIn }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);
  const [accessT, setaccessT] = useState<any>(null);

  useEffect(() => {
    // Check the user's login status and info when the component mounts.
    GoogleSignin.isSignedIn().then(isSignedIn => {
      setUserLoggedIn(isSignedIn);
    });
  }, []);

  useEffect(() => {
    // Call the callback whenever accessT changes
    onAccessTokenChange(accessT);
  }, [accessT, onAccessTokenChange]);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      setUserLoggedIn(true);
      setUserInfo(user);

      const res = await GoogleSignin.getTokens();
      if (res.accessToken) {
        setaccessT(res.accessToken);
         // Callback to get Accesstoken
      }
        // store glog user in MongoDB
      const { idToken, ...userWithoutToken } = user;
      // if (onUserChange) {
      //   onUserChange(userWithoutToken);
      // }
      if (onSignIn) {
        onSignIn(res.accessToken, userWithoutToken);
      }
      
    } catch (error) {
      console.error('Error handlelogin 51', error);
    }
  };

  const handleLogout = async () => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    setUserLoggedIn(false);
    setUserInfo(null);
    // You can add your own logout logic here.
  };

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={isUserLoggedIn ? handleLogout : handleGoogleLogin}>
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>
            {isUserLoggedIn ? 'Logout' : 'Google Login'}
          </Text>
        </View>
      </TouchableOpacity>
      <ScrollView>
        <View>
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
      </ScrollView>
    </SafeAreaView>
  );
};

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

export default GoogleLogin;
