import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import InboxScreen from './InboxScreen';
import ProfileScreen from './ProfileScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faInbox, faUser } from '@fortawesome/free-solid-svg-icons';

import { Colors } from 'react-native/Libraries/NewAppScreen';

const Tab = createBottomTabNavigator();

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundStyle.backgroundColor }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <NavigationContainer>
        <Tab.Navigator
          
        >
          <Tab.Screen
    name="Home"
    component={HomeScreen}
    options={{
      tabBarIcon: ({ focused, color, size }) => (
        <FontAwesomeIcon
          icon={faHome}
          size={size}
          color={color}
        />
      ),
    }}
  />
          <Tab.Screen
    name="Inbox"
    component={InboxScreen}
    options={{
      tabBarIcon: ({ focused, color, size }) => (
        <FontAwesomeIcon
          icon={faInbox}
          size={size}
          color={color}
        />
      ),
    }}
  />
          <Tab.Screen
    name="Profile"
    component={ProfileScreen}
    options={{
      tabBarIcon: ({ focused, color, size }) => (
        <FontAwesomeIcon
          icon={faUser}
          size={size}
          color={color}
        />
      ),
    }}
  />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
