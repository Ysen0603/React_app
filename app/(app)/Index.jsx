import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator,} from 'react-native';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from '../Context/Auth';
import { useTheme } from '../Context/ThemeContext';
import { lightTheme, darkTheme } from '../themes';
import { Ionicons } from '@expo/vector-icons';
import { useRouter,useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Video} from 'expo-av';
import VideoPlayer from './components/VideoPlayer';



const Index = () => {
  const [posts, setPosts] = useState([]);
  const { token, user } = useContext(AuthContext);
  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? darkTheme : lightTheme;
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      console.log(user);
      const fetchPosts = async () => {
        try {
          const response = await fetch('http://192.168.1.4:8000/posts/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };
  
      if (user) {
        fetchPosts();
      }
    }, [user, token])
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      setSelectedVideo(null);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedVideo(result.assets[0]);
      setSelectedImage(null);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      if (selectedImage) {
        const filename = selectedImage.uri.split('/').pop();
        const fileExtension = filename.split('.').pop();
        formData.append('image', {
          uri: selectedImage.uri,
          type: 'image/jpeg',
          name: `image.${fileExtension}`
        });
      }

      if (selectedVideo) {
        const filename = selectedVideo.uri.split('/').pop();
        const fileExtension = filename.split('.').pop();
        formData.append('video', {
          uri: selectedVideo.uri,
          type: 'video/mp4',
          name: `video.${fileExtension}`
        });
      }

      const url = `http://192.168.1.4:8000/posts/?title=${encodeURIComponent(newPost.title.trim())}&content=${encodeURIComponent(newPost.content.trim())}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      setPosts(prevPosts => [data, ...prevPosts]);
      setNewPost({ title: '', content: '' });
      setSelectedImage(null);
      setSelectedVideo(null);
      setModalVisible(false);
    } catch (error) {
      console.log('Error details:', error);
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.headerBackground,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
    },
    welcomeText: {
      fontSize: 14,
      color: theme.secondaryTextColor,
    },
    userName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textColor,
    },
    newPostButton: {
      backgroundColor: theme.buttonColor,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      padding: 16,
    },
    postCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 16,
      marginBottom: 16,
      padding: 16,
      shadowColor: theme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    authorAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    postHeaderText: {
      flex: 1,
    },
    authorName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textColor,
    },
    postDate: {
      fontSize: 12,
      color: theme.secondaryTextColor,
    },
    postTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.textColor,
      marginBottom: 8,
    },
    postContent: {
      fontSize: 15,
      color: theme.secondaryTextColor,
      lineHeight: 22,
      marginBottom: 16,
    },
    postImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: 12,
    },
    postFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: theme.borderColor,
      paddingTop: 12,
    },
    footerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
    },
    footerButtonText: {
      marginLeft: 4,
      fontSize: 14,
      color: theme.secondaryTextColor,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.modalBackground,
      padding: 20,
    },
    modalContent: {
      backgroundColor: theme.cardBackground,
      borderRadius: 20,
      padding: 20,
      shadowColor: theme.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textColor,
    },
    closeButton: {
      padding: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 10,
      padding: 12,
      marginBottom: 16,
      fontSize: 16,
      backgroundColor: theme.inputBackground,
      color: theme.textColor,
    },
    contentInput: {
      height: 150,
      textAlignVertical: 'top',
      
    },
    mediaPreview: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: 16,
    },
    mediaButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    mediaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 10,
      flex: 0.48,
    },
    mediaButtonText: {
      marginLeft: 8,
      color: theme.secondaryTextColor,
      fontSize: 16,
    },
    submitButton: {
      backgroundColor: theme.buttonColor,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    submitButtonDisabled: {
      backgroundColor: theme.secondaryTextColor,
    },
    submitButtonText: {
      color: theme.textColor,
      fontSize: 16,
      fontWeight: 'bold',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
    },
  });
  return (
    <>
      {user ? (
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/(app)/Profile/Index')}>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: `http://192.168.1.4:8000${user.profile_image}` || 'https://via.placeholder.com/40' }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.userName}>{user.name}</Text>
              </View>
            </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.newPostButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {posts.map((post) => (
              <View key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Image
                    source={{ uri: `http://192.168.1.4:8000${post.user.profile_image}` || 'https://via.placeholder.com/40' }}
                    style={styles.authorAvatar}
                  />
                  <View style={styles.postHeaderText}>
                    <Text style={styles.authorName}>{post.user.name}</Text>
                    <Text style={styles.postDate}>
                      {new Date(post.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.postTitle}>{post.title}</Text>
                {post.image_url && (
                  <Image
                    source={{ uri: `http://192.168.1.4:8000${post.image_url}` }}
                    style={styles.postImage}
                  />
                )}
                {post.video_url && (
                  <VideoPlayer videoUrl={post.video_url} videoID={post.id} />
                )}
                <Text style={styles.postContent} numberOfLines={3}>
                  {post.content}
                </Text>
                
                <View style={styles.postFooter}>
                  <TouchableOpacity style={styles.footerButton}>
                    <Ionicons name="heart-outline" size={20} color="#666" />
                    <Text style={styles.footerButtonText}>Like</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerButton}>
                    <Ionicons name="chatbubble-outline" size={20} color="#666" />
                    <Text style={styles.footerButtonText}>Comment</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerButton}>
                    <Ionicons name="share-outline" size={20} color="#666" />
                    <Text style={styles.footerButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Create New Post</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={newPost.title}
                  onChangeText={(text) => setNewPost(prev => ({...prev, title: text}))}
                />

                <TextInput
                  style={[styles.input, styles.contentInput]}
                  placeholder="Write your post..."
                  value={newPost.content}
                  onChangeText={(text) => setNewPost(prev => ({...prev, content: text}))}
                  multiline
                  textAlignVertical="top"
                />

                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage.uri }}
                    style={styles.mediaPreview}
                  />
                )}

                {selectedVideo && (
                  <Video
                    source={{ uri: selectedVideo.uri }}
                    style={styles.mediaPreview}
                    useNativeControls
                    resizeMode="contain"
                  />
                )}

                <View style={styles.mediaButtons}>
                  <TouchableOpacity
                    style={styles.mediaButton}
                    onPress={pickImage}
                  >
                    <Ionicons name="image-outline" size={24} color="#666" />
                    <Text style={styles.mediaButtonText}>Add Image</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.mediaButton}
                    onPress={pickVideo}
                  >
                    <Ionicons name="videocam-outline" size={24} color="#666" />
                    <Text style={styles.mediaButtonText}>Add Video</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    isSubmitting && styles.submitButtonDisabled
                  ]}
                  onPress={handleCreatePost}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.submitButtonText}>Publish Post</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </>
  );
};




export default Index;

