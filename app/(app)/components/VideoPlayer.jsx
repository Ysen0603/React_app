import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../Context/ThemeContext';
import { lightTheme, darkTheme } from '../../themes';
import { router } from 'expo-router';

const VideoPlayer = ({ videoUrl,videoID }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? darkTheme : lightTheme;

  const Go_to_FullScreen = async() => {
    await videoRef.current.pauseAsync();
    router.push(`/Video_FullScreen/${videoID}`)

  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const styles = StyleSheet.create({
    videoContainer: {
      width: '100%',
      height: 250,
      backgroundColor: theme.backgroundColor,
      borderRadius: 10,
      marginVertical: 12,
      position: 'relative',
    },
    postVideo: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
    },
    videoControls: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.modalBackground,
      padding: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    videoButton: {
      width: 40,
      height: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
    },
    progressContainer: {
      width: '100%',
      paddingHorizontal: 10,
      marginBottom: 5,
    },
    progressBar: {
      width: '100%',
      height: 3,
      backgroundColor: theme.borderColor,
      borderRadius: 3,
    },
    progress: {
      height: '100%',
      backgroundColor: theme.buttonColor,
      borderRadius: 3,
    },
    timeText: {
      color: theme.textColor,
      fontSize: 12,
      marginTop: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
  });
  return (
    <View style={styles.videoContainer}>
      <Video
        ref={videoRef}
        source={{ uri: `http://192.168.1.4:8000${videoUrl}` }}
        style={styles.postVideo}
        resizeMode={ResizeMode.CONTAIN}
        
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <View style={styles.videoControls}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progress, 
                { 
                  width: `${status.positionMillis ? (status.positionMillis / status.durationMillis) * 100 : 0}%` 
                }
              ]} 
            />
          </View>
          <Text style={styles.timeText}>
            {formatTime(status.positionMillis || 0)} / {formatTime(status.durationMillis || 0)}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.videoButton}
            onPress={() => status.isPlaying ? videoRef.current.pauseAsync() : videoRef.current.playAsync()}
          >
            <Ionicons
              name={status.isPlaying ? "pause" : "play"}
              size={17}
              color="white"
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.videoButton}
            onPress={() => videoRef.current.setIsMutedAsync(!status.isMuted)}
          >
            <Ionicons
              name={status.isMuted ? "volume-mute" : "volume-high"}
              size={17}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.videoButton}
            onPress={() => {
              Go_to_FullScreen();
            }}
          >
            <Ionicons name="expand" size={17} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default VideoPlayer;

