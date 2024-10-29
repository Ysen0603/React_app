import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native'
import React, { useContext, useEffect, useState,useCallback } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { AuthContext } from '../../Context/Auth'
import { useTheme } from '../../Context/ThemeContext'
import { lightTheme, darkTheme } from '../../themes'
import { Ionicons } from '@expo/vector-icons'
import { Video } from 'expo-av'
import { useFocusEffect } from 'expo-router'

const { width } = Dimensions.get('window')
const ITEM_WIDTH = width / 2 - 24

const UserProfile = () => {
  const { id } = useLocalSearchParams()
  const { token, followUser, unfollowUser, checkIsFollowing ,sendFollowRequest} = useContext(AuthContext)
  const { isDarkTheme } = useTheme()
  const theme = isDarkTheme ? darkTheme : lightTheme

  const [profileUser, setProfileUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)


  // Inside the UserProfile component, add this effect:
useFocusEffect(
  useCallback(() => {
    loadProfileData();
  }, [id, token])
);

// Move the loadProfileData function outside of useEffect
const loadProfileData = async () => {
  try {
    const userResponse = await fetch(`http://192.168.1.4:8000/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      setProfileUser(userData);
      
      const followingStatus = await checkIsFollowing(id);
      setIsFollowing(followingStatus);

      if (!userData.is_private || followingStatus) {
        const postsResponse = await fetch(`http://192.168.1.4:8000/posts/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setUserPosts(postsData);
        }
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  } finally {
    setLoading(false);
  }
};
// Update handleFollowToggle in [id].jsx
const handleFollowToggle = async () => {
  if (profileUser.is_private && !isFollowing) {
    const request = await sendFollowRequest(id);
    if (request) {
      Alert.alert('Success', 'Follow request sent');
    } else {
      Alert.alert('Error', 'Failed to send follow request');
    }
  } else {
    const success = isFollowing 
      ? await unfollowUser(id)
      : await followUser(id);
    
    if (success) {
      setIsFollowing(!isFollowing);
      loadProfileData();
    }
  }
};

  

  

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    headerSection: {
      padding: 20,
      backgroundColor: theme.cardBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
    },
    profileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 15,
    },
    userInfo: {
      flex: 1,
      gap: 5,
      
      
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.textColor,
    },
    followButton: {
      backgroundColor: isFollowing ? theme.cardBackground : theme.cardBackground,
      padding: 10,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: theme.borderColor,
      width: 180,
      
    },
    followButtonText: {
      color: isFollowing ? theme.textColor : theme.textColor,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    privateAccountMessage: {
      padding: 20,
      alignItems: 'center',
    },
    privateText: {
      color: theme.textColor,
      fontSize: 16,
      textAlign: 'center',
    },
    postsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 20,
      justifyContent: 'space-between',
    },
    postCard: {
      width: ITEM_WIDTH,
      marginBottom: 20,
      borderRadius: 12,
      backgroundColor: theme.cardBackground,
    },
    postMedia: {
      width: '100%',
      height: ITEM_WIDTH,
      borderRadius: 12,
    },
  })



  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <View style={styles.headerSection}>
          <View style={styles.profileInfo}>
            <Image
              source={{
                uri: profileUser?.profile_image
                  ? `http://192.168.1.4:8000${profileUser.profile_image}`
                  : 'https://via.placeholder.com/150'
              }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.name}>{profileUser?.name}</Text>
              <TouchableOpacity
                style={styles.followButton}
                onPress={handleFollowToggle}
              >
                <Text style={styles.followButtonText}>
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {profileUser && (
  profileUser.is_private && !isFollowing ? (
    <View style={styles.privateAccountMessage}>
      <Ionicons name="lock-closed" size={50} color={theme.textColor} />
      <Text style={styles.privateText}>
        This account is private. Follow to see their posts.
      </Text>
    </View>
  ) : (
    <View style={styles.postsGrid}>
      {userPosts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                {post.image_url ? (
                  <Image
                    source={{ uri: `http://192.168.1.4:8000${post.image_url}` }}
                    style={styles.postMedia}
                  />
                ) : post.video_url ? (
                  <Video
                    source={{ uri: `http://192.168.1.4:8000${post.video_url}` }}
                    style={styles.postMedia}
                    useNativeControls
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.postMedia}>
                    <Text style={{ color: theme.textColor }}>{post.content}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default UserProfile
