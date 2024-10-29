import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/Auth'
import { useTheme } from '../../Context/ThemeContext'
import { lightTheme, darkTheme } from '../../themes'
import { Ionicons } from '@expo/vector-icons'
import { Video } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'

const { width } = Dimensions.get('window')
const ITEM_WIDTH = width / 2 - 24

const Index = () => {
  const { user, logout, token, setUser, getFollowing,getFollowers,togglePrivacy} = useContext(AuthContext)
  const { isDarkTheme } = useTheme()
  const theme = isDarkTheme ? darkTheme : lightTheme
  const [userPosts, setUserPosts] = useState([])
  const [following, setFollowing] = useState([])
  const [followers, setFollowers] = useState([])

  useEffect(() => {
    const loadFollowData = async () => {
      const followingData = await getFollowing()
      const followersData = await getFollowers()
      setFollowers(followersData)
      setFollowing(followingData)
    }
    
    if (user) {
      loadFollowData()
    }
  }, [user])

  const updateProfileImage = async (imageFile) => {
    try {
      const formData = new FormData()
      const filename = imageFile.uri.split('/').pop()
      const fileExtension = filename.split('.').pop()
      
      formData.append('profile_image', {
        uri: imageFile.uri,
        type: 'image/jpeg',
        name: `profile_image.${fileExtension}`
      })
  
      const response = await fetch('http://192.168.1.4:8000/users/profile-image/', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })
  
      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
      }
    } catch (error) {
      console.error('Error updating profile image:', error)
    }
  }

  const confirmDelete = (postId) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => deletePost(postId),
          style: "destructive"
        }
      ]
    )
  }

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`http://192.168.1.4:8000/posts/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      
      if (response.ok) {
        setUserPosts(userPosts.filter(post => post.id !== postId))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      updateProfileImage(result.assets[0])
    }
  }

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await fetch('http://192.168.1.4:8000/posts/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        const filteredPosts = data.filter(post => post.user.id === user.id)
        setUserPosts(filteredPosts)
      } catch (error) {
        console.error('Error fetching user posts:', error)
      }
    }
    fetchUserPosts()
  }, [user, token])

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    container: {
      flex: 1,
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
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.textColor,
    },
    email: {
      fontSize: 14,
      color: theme.secondaryTextColor,
      marginTop: 4,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statDivider: {
      width: 1,
      height: 30,
      backgroundColor: theme.borderColor,
    },
    statNumber: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textColor,
    },
    statLabel: {
      fontSize: 12,
      color: theme.secondaryTextColor,
      marginTop: 4,
    },
    contentSection: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      color: theme.textColor,
    },
    postsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    postCard: {
      width: ITEM_WIDTH,
      marginBottom: 20,
      borderRadius: 12,
      backgroundColor: theme.cardBackground,
      shadowColor: theme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    deleteButton: {
      position: 'absolute',
      right: 8,
      top: 8,
      zIndex: 1,
      backgroundColor: theme.cardBackground,
      borderRadius: 15,
      padding: 5,
    },
    postMedia: {
      width: '100%',
      height: ITEM_WIDTH,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    videoWrapper: {
      width: '100%',
      height: ITEM_WIDTH,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      overflow: 'hidden',
    },
    videoOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    textPost: {
      width: '100%',
      height: ITEM_WIDTH,
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    textContent: {
      fontSize: 14,
      color: theme.textColor,
      textAlign: 'center',
    },
    postInfo: {
      padding: 12,
    },
    postTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.textColor,
    },
    postDate: {
      fontSize: 12,
      color: theme.secondaryTextColor,
      marginTop: 4,
    },
    bottomMenu: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: 15,
      borderTopWidth: 1,
      borderTopColor: theme.borderColor,
      backgroundColor: theme.cardBackground,
    },
    menuButton: {
      padding: 10,
    },
    logoutButton: {
      padding: 10,
    },
  })

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <View style={styles.profileInfo}>
            <TouchableOpacity onPress={pickProfileImage}>
              <Image 
                source={{ 
                  uri: user?.profile_image 
                    ? `http://192.168.1.4:8000${user.profile_image}` 
                    : 'https://via.placeholder.com/150' 
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.name}>{user?.name}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{followers.length}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{following.length}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>My Posts</Text>
          <View style={styles.postsGrid}>
            {userPosts.map((post) => (
              <TouchableOpacity key={post.id} style={styles.postCard}>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => confirmDelete(post.id)}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.dangerColor} />
                </TouchableOpacity>
                {post.image_url ? (
                  <Image
                    source={{ uri: `http://192.168.1.4:8000${post.image_url}` }}
                    style={styles.postMedia}
                  />
                ) : post.video_url ? (
                  <View style={styles.videoWrapper}>
                    <Video
                      source={{ uri: `http://192.168.1.4:8000${post.video_url}` }}
                      style={styles.postMedia}
                      useNativeControls
                      resizeMode="cover"
                      isLooping
                    />
                    <View style={styles.videoOverlay}>
                      <Ionicons name="play-circle" size={40} color={theme.textColor} />
                    </View>
                  </View>
                ) : (
                  <View style={styles.textPost}>
                    <Text numberOfLines={4} style={styles.textContent}>
                      {post.content}
                    </Text>
                  </View>
                )}
                <View style={styles.postInfo}>
                  <Text numberOfLines={1} style={styles.postTitle}>
                    {post.title}
                  </Text>
                  <Text style={styles.postDate}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuButton} onPress={togglePrivacy}>
          <Ionicons 
            name={user?.is_private ? "lock-closed-outline" : "lock-open-outline"} 
            size={24} 
            color={theme.textColor} 
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="settings-outline" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/Friends/Index')}>
          <Ionicons name="person-outline" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color={theme.dangerColor} />
        </TouchableOpacity>

      </View>
    </View>
  )
}

export default Index
