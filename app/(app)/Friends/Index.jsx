import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native'
import React, { useContext, useState, useEffect,useCallback } from 'react'
import { AuthContext } from '../../Context/Auth'
import { useTheme } from '../../Context/ThemeContext'
import { lightTheme, darkTheme } from '../../themes'
import { Ionicons } from '@expo/vector-icons'
import { router,useFocusEffect } from 'expo-router'

const Index = () => {
  const { user, token, getAllUsers, followUser, unfollowUser, checkIsFollowing } = useContext(AuthContext)
  const { isDarkTheme } = useTheme()
  const theme = isDarkTheme ? darkTheme : lightTheme
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [userFollowers, setUserFollowers] = useState({})
  const [followingStatus, setFollowingStatus] = useState({})


  const fetchUserFollowers = async (userId) => {
    try {
      const response = await fetch(`http://192.168.1.4:8000/users/${userId}/followers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const followers = await response.json();
        setUserFollowers(prev => ({
          ...prev,
          [userId]: followers
        }));
        
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const checkFollowingStatus = async (userId) => {
    const isFollowing = await checkIsFollowing(userId);
    setFollowingStatus(prev => ({
      ...prev,
      [userId]: isFollowing
    }));
  };

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      const filteredUsers = data.filter(u => u.id !== user.id);
      setUsers(filteredUsers);
      filteredUsers.forEach(user => {
        fetchUserFollowers(user.id);
        checkFollowingStatus(user.id);
      });
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      await checkFollowingStatus(userId);
      await fetchUserFollowers(userId);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const renderUserItem = ({ item }) => {
    const isFollowing = followingStatus[item.id] || false;
    const followersCount = userFollowers[item.id]?.length || 0;
    
    return (
      <View style={[styles.userCard, { backgroundColor: theme.cardBackground }]}>
        <Image
          source={{
            uri: item.profile_image
              ? `http://192.168.1.4:8000${item.profile_image}`
              : 'https://via.placeholder.com/150'
          }}
          style={styles.avatar}
        />
        <Pressable style={styles.userInfo} onPress={() => router.push(`/(app)/Profile/${item.id}`)}>
          <Text style={[styles.userName, { color: theme.textColor }]}>{item.name}</Text>
          <Text style={[styles.userEmail, { color: theme.secondaryTextColor }]}>{item.email}</Text>
          <Text style={[styles.followersCount, { color: theme.secondaryTextColor }]}>
            {followersCount} followers
          </Text>
          
        </Pressable>
        <TouchableOpacity
          style={[
            styles.followButton,
            { backgroundColor: isFollowing ? '#FF4444' : theme.accentColor }
          ]}
          onPress={() => handleFollowToggle(item.id, isFollowing)}
        >
          <Text style={styles.followButtonText}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Text>
          <Ionicons
            name={isFollowing ? "person-remove" : "person-add"}
            size={16}
            color="white"
            style={styles.followIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    profileImages: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    avatar_mini: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginLeft: -10,
      borderWidth: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      padding: 16,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.textColor,
      marginBottom: 16,
      paddingHorizontal: 16,
    },
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      shadowColor: theme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.placeholderColor,
    },
    userInfo: {
      flex: 1,
      marginLeft: 16,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
    },
    userEmail: {
      fontSize: 14,
      marginTop: 4,
    },
    followersCount: {
      fontSize: 12,
      marginTop: 4,
      color: '#666',
    },
    followButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    followButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
      marginRight: 4,
    },
    followIcon: {
      marginLeft: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.accentColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Find Friends</Text>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Index;
