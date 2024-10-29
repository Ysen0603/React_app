import { View, Dimensions, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { Video } from 'expo-av';
import { useTheme } from '../../Context/ThemeContext';
import { lightTheme, darkTheme } from '../../themes';
import { AuthContext } from '../../Context/Auth';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const VIDEO_HEIGHT = height * 0.9; // 90% of screen height

const Video_FS = () => {
  const { id } = useLocalSearchParams();
  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? darkTheme : lightTheme;
  const [post, setPost] = useState(null);
  const { token } = useContext(AuthContext);
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://192.168.1.4:8000/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [id]);

  const handlePlayPause = async () => {
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    videoContainer: {
      width: width,
      height: VIDEO_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
    },
    video: {
      width: '100%',
      height: '100%',
    },
    controls: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 10,
    },
    controlButton: {
      padding: 10,
      marginHorizontal: 10,
    }
  });

  if (!post) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.buttonColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: `http://192.168.1.4:8000${post.video_url}` }}
          style={styles.video}
          resizeMode="contain"
          shouldPlay
          isLooping
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={handlePlayPause}>
            <Ionicons 
              name={status.isPlaying ? "pause" : "play"} 
              size={30} 
              color="white" 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={() => videoRef.current.setIsMutedAsync(!status.isMuted)}
          >
            <Ionicons 
              name={status.isMuted ? "volume-mute" : "volume-high"} 
              size={30} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default Video_FS;
