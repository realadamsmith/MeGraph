// IntroScreen.tsx

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GoogleLogin from './GoogleLogin';

const IntroScreen = ({route}) => {
  const [accessToken, setAccessToken] = useState(null); // New state

  const handleAccessTokenChange = newAccessToken => {
    setAccessToken(newAccessToken);
  };
  const signInYoutubeData = async (accessToken, userData) => {
    if (route.params?.onSignIn) {
      route.params.onSignIn();
  
      const likedVideosPlaylistId = 'LL';
      const maxResults = 10;
      const apiKey = 'AIzaSyAV1gM105vVypxeHr4SGBeGXvY8T7WTits';
      const endpoint = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&playlistId=${likedVideosPlaylistId}&maxResults=${maxResults}&key=${apiKey}`;
  
      try {
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${accessToken}`);
        const requestOptions = { method: 'GET', headers: myHeaders, redirect: 'follow' };
        const response = await fetch(endpoint, requestOptions);
        const result = await response.json();
        // result.items.forEach((item, index) => {
        // console.log(`videos ${index}:`, item.contentDetails.videoId);
        // });
        if (userData && result.items) {
          const likesData = result.items.map(item => ({
            userId: userData.user.id,
            userName: userData.user.name, // Include user's name
            userPhoto: userData.user.photo, // Include user's photo URL
            video: {
              videoId: item.contentDetails.videoId,
              title: item.snippet.title,
              // ... other video details you wish to store
            }
            // likedAt: new Date().toISOString() // Current timestamp, if needed
          }));
  
          await fetch('http://192.168.1.149:5000/storeLikes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ likes: likesData })
          });
        }
      } catch (error) {
        console.error('Error fetching YouTube data:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <GoogleLogin
        onAccessTokenChange={handleAccessTokenChange}
        onSignIn={signInYoutubeData}
      />
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

export default IntroScreen;
