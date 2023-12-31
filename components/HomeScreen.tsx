import { FlatList, Text, View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchData();
    };

    fetchInitialData();
  }, []);

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`http://192.168.1.149:5000/homeFeed?page=${page}`);
      const newData = await response.json();
      
      setData(prevData => [...prevData, ...newData.data]);
      setLoading(false);

      if (!newData.isMore) {
        // Disable further requests if no more data is available
        setLoading(true);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    if (page > 1) {
      fetchData();
    }
  }, [page]);

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    const isEven = index % 2 === 0;
    const userRowStyle = isEven ? styles.userRowEven : styles.userRowOdd;
  
    // Check if user data is available
    const hasUserData = item.userName && item.userPhoto;
  
    return (
      <View style={styles.item}>
        {hasUserData && (
          <View style={userRowStyle}>
            <Image
              source={{ uri: item.userPhoto || 'default_photo_url_here' }}
              style={styles.userPhoto}
            />
            <Text style={styles.detail}>{item.userName || 'Anonymous'}</Text>
          </View>
        )}
        <View style={styles.youtubeDataRow}>
          <View style={styles.videoContainer}>
            <WebView
              style={styles.video}
              source={{ uri: `https://www.youtube.com/embed/${item.video.videoId}` }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
            />
          </View>
          <Text style={styles.videoId}>
            Title: {item.video.title}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.userId}-${index}`}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width: '100%',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userRowEven: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userRowOdd: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 10, // Space between image and text
  },
  youtubeDataRow: {
    flex: 1,
    marginBottom: 5,
  },
  videoContainer: {
    height: 200,
    width: '100%',
    marginBottom: 20,
  },
  video: {
    height: '100%',
    width: '100%',
  },
  userPhoto: {
    width: 35,
    height: 35,
    borderRadius: 25,
  },
  loader: {
    marginVertical: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;
