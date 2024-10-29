import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Context/Auth'
import { useTheme } from '../../Context/ThemeContext'
import { lightTheme, darkTheme } from '../../themes'
import { Ionicons } from '@expo/vector-icons'
import { Video } from 'expo-av'

const { width, height } = Dimensions.get('window')
const FOOTER_HEIGHT = 80
const CONTENT_HEIGHT = height - FOOTER_HEIGHT

const Index = () => {
  const { user, token } = useContext(AuthContext)
  const { isDarkTheme } = useTheme()
  const theme = isDarkTheme ? darkTheme : lightTheme
  const [posts, setPosts] = useState([])
  const [activePostIndex, setActivePostIndex] = useState(0)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    reelContainer: {
      width: width,
      height: CONTENT_HEIGHT,
      backgroundColor: theme.backgroundColor,
    },
    reelVideo: {
      width: '100%',
      height: CONTENT_HEIGHT,
      backgroundColor: theme.backgroundColor,
    },
    textOnlyContainer: {
      width: '100%',
      height: CONTENT_HEIGHT,
      backgroundColor: theme.cardBackground,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    textContent: {
      color: theme.textColor,
      fontSize: 18,
      textAlign: 'center',
      lineHeight: 24,
    },
    reelOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    bottomContainer: {
      marginBottom: 30,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: theme.textColor,
    },
    userTextInfo: {
      marginLeft: 10,
      flex: 1,
    },
    userName: {
      color: theme.textColor,
      fontSize: 16,
      fontWeight: 'bold',
    },
    postTime: {
      color: theme.secondaryTextColor,
      fontSize: 12,
    },
    reelContent: {
      marginBottom: 15,
    },
    reelDescription: {
      color: theme.textColor,
      fontSize: 14,
      lineHeight: 20,
      textShadowColor: theme.shadowColor,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    reelActions: {
      position: 'absolute',
      right: 8,
      bottom: 20,
      alignItems: 'center',
    },
    actionButton: {
      alignItems: 'center',
      marginVertical: 8,
    },
    actionText: {
      color: theme.textColor,
      fontSize: 12,
      marginTop: 3,
      fontWeight: '500',
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: FOOTER_HEIGHT,
      backgroundColor: theme.cardBackground,
      borderTopWidth: 0.5,
      borderTopColor: theme.borderColor,
      paddingVertical: 10,
    },
    userFooterItem: {
      alignItems: 'center',
      marginHorizontal: 8,
    },
    userFooterAvatar: {
      width: 35,
      height: 35,
      borderRadius: 17.5,
      borderWidth: 2,
      borderColor: theme.textColor,
    },
    userFooterName: {
      color: theme.textColor,
      fontSize: 12,
      marginTop: 4,
    }
  })

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://192.168.1.4:8000/posts/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }
    fetchPosts()
  }, [token])

  const onViewableItemsChanged = React.useRef(({ viewableItems }) => {
    if (viewableItems[0]) {
      setActivePostIndex(viewableItems[0].index)
    }
  }).current

  const renderPost = ({ item, index }) => (
    <View style={[styles.reelContainer]}>
      {item.video_url ? (
        <Video
          source={{ uri: `http://192.168.1.4:8000${item.video_url}` }}
          style={styles.reelVideo}
          resizeMode="cover"
          shouldPlay={index === activePostIndex}
          isLooping
          useNativeControls={false}
        />
      ) : item.image_url ? (
        <Image
          source={{ uri: `http://192.168.1.4:8000${item.image_url}` }}
          style={styles.reelVideo}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.textOnlyContainer}>
          <Text style={styles.textContent}>{item.content}</Text>
        </View>
      )}

      <View style={styles.reelOverlay}>
        <View style={styles.bottomContainer}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: item.user?.avatar || 'https://via.placeholder.com/150' }}
              style={styles.userAvatar}
            />
            <View style={styles.userTextInfo}>
              <Text style={styles.userName}>{item.user?.name}</Text>
              <Text style={styles.postTime}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.reelContent}>
          <Text style={styles.reelDescription} numberOfLines={3}>
            {item.content}
          </Text>
        </View>
      </View>

      <View style={styles.reelActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={28} color={theme.textColor} />
          <Text style={styles.actionText}>87.5k</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={28} color={theme.textColor} />
          <Text style={styles.actionText}>1.2k</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bookmark-outline" size={28} color={theme.textColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={28} color={theme.textColor} />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id.toString()}
        pagingEnabled
        snapToInterval={CONTENT_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
      />

      <View style={styles.footer}>
        <FlatList
          horizontal
          data={[1,2,3,4,5,6,7,8]}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.userFooterItem}>
              <Image
                source={{ uri: 'https://via.placeholder.com/150' }}
                style={styles.userFooterAvatar}
              />
              <Text style={styles.userFooterName}>User {item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.toString()}
        />
      </View>
    </View>
  )
}

export default Index