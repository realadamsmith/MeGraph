import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useRef, memo} from 'react';
import {WebView} from 'react-native-webview';
const youtubeinstance = 'http://18.217.174.213:5000';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const lastUser = useRef(null);
  const lastUserStyle = useRef('odd');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`${youtubeinstance}/homeFeed?page=${page}`);
      const newData = await response.json();

      const processedData = newData.data.map(item => {
        let userChanged = false;
        if (!lastUser.current || lastUser.current !== item.userName) {
          userChanged = true;
          lastUser.current = item.userName;
          lastUserStyle.current =
            lastUserStyle.current === 'even' ? 'odd' : 'even';
        }

        return {
          ...item,
          userRowStyle:
            lastUserStyle.current === 'even'
              ? styles.userRowEven
              : styles.userRowOdd,
          detailStyle:
            lastUserStyle.current === 'even'
              ? styles.detailEven
              : styles.detailOdd,
        };
      });

      if (processedData && processedData.length > 0) {
        setData(prevData => [...prevData, ...processedData]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Ensure loading is set to false in all cases
    }
  };

  const loadMore = () => {
    if (!loading) {
      fetchData();
    }
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

  const likePost = async videoId => {
    try {
      const response = await fetch(`${youtubeinstance}/likePost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'yourUserId', // Replace with actual user ID
          videoId,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const commentPost = async (videoId, comment) => {
    try {
      const response = await fetch(`${youtubeinstance}/commentPost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'yourUserId', // Replace with actual user ID
          videoId,
          comment,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log('fetch');

  const RenderItem = ({item}) => {
    if (!item.video) {
      return null;
    }
    const hasUserData = item.userName && item.userPhoto;
    console.log('2');
    return (
      <View style={styles.item}>
        {hasUserData && (
          <View style={item.userRowStyle}>
            <Image
              source={{uri: item.userPhoto || 'default_photo_url_here'}}
              style={styles.userPhoto}
            />
            <Text style={item.detailStyle}>{item.userName || 'Anonymous'}</Text>
          </View>
        )}
        <View style={styles.youtubeDataRow}>
          <View style={styles.videoContainer}>
            <WebView
              style={styles.video}
              source={{
                uri: `https://www.youtube.com/embed/${item.video.videoId}`,
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              shouldStartLoadWithRequest={(request) => {
                return request.url === 'https://www.youtube.com/embed/';
              }}
            />
          </View>
          <Text style={styles.videoId}>Title: {item.video.title}</Text>
          <TouchableOpacity
            onPress={() => likePost(item.video.videoId)}
            style={[styles.likeButton]} // Apply liked style if the post is liked
          >
            <Text style={{color: 'white'}}>Like</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            onSubmitEditing={({nativeEvent: {text}}) =>
              commentPost(item.video.videoId, text)
            }
          />
        </View>
      </View>
    );
  };
  const MemoizedRenderItem = memo(RenderItem, (prevProps, nextProps) => {
    return prevProps.item.video.videoId === nextProps.item.video.videoId;
  });
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={RenderItem}
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
  detailEven: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 10, // Space between image and text for even rows
  },
  detailOdd: {
    fontSize: 16,
    color: 'gray',
    marginRight: 10, // Space between image and text for odd rows
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
    width: 33,
    height: 33,
    borderRadius: 25,
  },
  loader: {
    marginVertical: 20,
    alignItems: 'center',
  },
  likeButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginTop: 10,
    // flexDirection: 'row', // Align icon and text horizontally
    // alignItems: 'center', // Center items vertically
    // justifyContent: 'center', // Center items horizontally
  },
  liked: {
    backgroundColor: 'red', // Change color to red when liked
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    paddingLeft: 14,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  commentButton: {
    padding: 10,
    backgroundColor: '#2196F3', // Blue background
    color: 'white',
    textAlign: 'center',
    borderRadius: 5,
    marginTop: 5,
  },
});

export default HomeScreen;
