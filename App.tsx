// App.tsx
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {View, Text} from 'react-native';
import IntroScreen from './components/IntroScreen';
// TabNavigator.tsx

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './components/HomeScreen'; // Create HomeScreen, MessagesScreen, and ProfileScreen components
import MessagesScreen from './components/MessagesScreen';
import ProfileScreen from './components/ProfileScreen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHome, faInbox, faUser} from '@fortawesome/free-solid-svg-icons';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
  webClientId:
    '358987476906-skqqm5usq665sun1gg8tqhhidsvlnnv6.apps.googleusercontent.com',
  // offlineAccess: true
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = ({onSignOut}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: [
          {
            display: 'flex',
          },
          null,
        ],
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesomeIcon icon={faHome} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          headerShown: false,
          tabBarBadge: 3,
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesomeIcon icon={faInbox} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesomeIcon icon={faUser} size={size} color={color} />
          ),
        }}>
        {() => <ProfileScreen onSignOut={onSignOut} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSignInStatus = async () => {
      // Check if the user is signed in
      const signedIn = await GoogleSignin.isSignedIn();
      setIsSignedIn(signedIn);
    };
    checkSignInStatus();
  }, [GoogleSignin.isSignedIn()]);

  const onSignIn = () => {
    setIsSignedIn(true); // Update the state when the user signs in
  };

  const onSignOut = () => {
    setIsSignedIn(false); // Update the state when the user signs out
  };

  if (isSignedIn === null) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {() => <TabNavigator onSignOut={onSignOut} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen
            name="Intro"
            component={IntroScreen}
            options={{headerShown: false}}
            initialParams={{onSignIn}} // Pass the callback as a prop
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
