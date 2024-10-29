import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { AuthContext } from '../../Context/Auth';
import { useTheme } from '../../Context/ThemeContext';
import { lightTheme, darkTheme } from '../../themes';

const NotificationsScreen = () => {
    const [followRequests, setFollowRequests] = useState([]);
    const [requestUsers, setRequestUsers] = useState({});
    const { getFollowRequests, handleFollowRequest, token } = useContext(AuthContext);
    const { isDarkTheme } = useTheme();
    const theme = isDarkTheme ? darkTheme : lightTheme;
    const { checkNotifications } = useContext(AuthContext);

    useEffect(() => {
      loadFollowRequests();
      checkNotifications();
    }, []);
    
    
    
    const fetchUserDetails = async (userId) => {
      try {
        const response = await fetch(`http://192.168.1.4:8000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const userData = await response.json();
          setRequestUsers(prev => ({...prev, [userId]: userData}));
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    const handleRequest = async (requestId, action) => {
        const result = await handleFollowRequest(requestId, action);
        if (result) {
          loadFollowRequests();
          checkNotifications();
        }
      };;
      
    const loadFollowRequests = async () => {
      const requests = await getFollowRequests();
      setFollowRequests(requests);
      requests.forEach(request => {
        fetchUserDetails(request.follower_id);
      });
    };
    useEffect(() => {
        loadFollowRequests();
      }, []);
      
    const renderRequest = ({ item }) => {
      const requester = requestUsers[item.follower_id];
      return (
        <View style={styles.requestCard}>
          <View style={styles.userContainer}>
            <Image 
              source={{ 
                uri: requester?.profile_image 
                  ? `http://192.168.1.4:8000${requester.profile_image}` 
                  : 'https://via.placeholder.com/150' 
              }}
              style={styles.userImage}
            />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: theme.textColor }]}>
                {requester?.name || `User ${item.follower_id}`}
              </Text>
              <Text style={[styles.requestText, { color: theme.secondaryTextColor }]}>
                wants to follow you
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.acceptButton]}
              onPress={() => handleRequest(item.id, 'accept')}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.rejectButton]}
              onPress={() => handleRequest(item.id, 'reject')}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
  
  
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 16,
        backgroundColor: theme.backgroundColor,
      },
      requestCard: {
        padding: 16,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: theme.cardBackground,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
      },
      userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
      },
      userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
      },
      userInfo: {
        flex: 1,
      },
      userName: {
        fontSize: 18,
        fontWeight: '600',
      },
      requestText: {
        fontSize: 14,
      },
      userInfoText: {
        fontSize: 14,
        color: 'gray',
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
      },
      button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 25,
        marginHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
      },
      acceptButton: {
        backgroundColor: theme.successColor,
      },
      rejectButton: {
        backgroundColor: theme.dangerColor,
      },
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
      },
    });

    return (
      <View style={styles.container}>
        <FlatList
          data={followRequests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
};

export default NotificationsScreen;
