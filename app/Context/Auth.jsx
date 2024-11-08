import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';



const API_URL = 'http://192.168.1.4:8000'; // Remplacez par l'adresse IP locale de votre serveur

// Créer le contexte Auth
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [acceptedFollows, setAcceptedFollows] = useState([]);
  useEffect(() => {
    // Charger le token stocké au démarrage
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          await fetchUser(storedToken);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du token:', error);
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  useEffect(() => {
    if (token) {
      const ws = new WebSocket(`ws://192.168.1.4:8000/ws/notifications?token=${token}`);
      
      ws.onopen = () => {
        console.log('WebSocket Connected');
      };
  
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'follow_request') {
          checkNotifications();
        }
      };
  
      setSocket(ws);
  
      return () => {
        if (socket) {
          socket.close();
        }
      };
    }
  }, [token]);
  
  useEffect(() => {
    if (token && user) {
      const ws = new WebSocket(`ws://192.168.1.4:8000/ws/notifications/${user.id}`);
      
      ws.onopen = () => {
        console.log('WebSocket Connected');
      };
  
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'follow_accepted') {
          setAcceptedFollows(prev => [...prev, data]);
          checkNotifications();
        }
      };
  
      setSocket(ws);
  
      return () => {
        if (socket) {
          socket.close();
        }
      };
    }
  }, [token, user]);
  
  // Fonction pour récupérer les informations de l'utilisateur
  const fetchUser = async (token) => {
    try {
      const response = await fetch(`${API_URL}/users/me/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      const accessToken = data.access_token;
      setToken(accessToken);
      await AsyncStorage.setItem('token', accessToken);
      await fetchUser(accessToken);
      router.replace('(app)/Index'); // Rediriger vers la page de profil après connexion
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  };

  // Fonction d'inscription
  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) throw new Error('Signup failed');
      router.replace('(app)/(Login)/Login'); // Rediriger vers la page de connexion après inscription
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Signup failed');
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    router.replace('(app)/(Login)/Login'); // Rediriger vers la page de connexion

    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
  };
  // Add these functions inside the AuthProvider component
const followUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/follow`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to follow user');
    await fetchUser(token); // Refresh user data
    return true;
  } catch (error) {
    console.error('Follow error:', error);
    return false;
  }
};

const unfollowUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/unfollow`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to unfollow user');
    await fetchUser(token); // Refresh user data
    return true;
  } catch (error) {
    console.error('Unfollow error:', error);
    return false;
  }
};
const checkIsFollowing = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/is-following`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to check following status');
    return await response.json();
  } catch (error) {
    console.error('Check following status error:', error);
    return false;
  }
};


const getFollowing = async () => {
  try {
    const response = await fetch(`${API_URL}/users/me/following`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to get following list');
    return await response.json();
  } catch (error) {
    console.error('Get following error:', error);
    return [];
  }
};
  const getFollowers = async () => {
    try {
      const response = await fetch(`${API_URL}/users/me/followers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to get followers list');
      return await response.json();
    } catch (error) {
      console.error('Get followers error:', error);
      return [];
    }
  };
  const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to get users list');
    return await response.json();
  } catch (error) {
    console.error('Get users error:', error);
    return [];
  }
};
const togglePrivacy = async () => {
  try {
    const response = await fetch(`${API_URL}/users/toggle-privacy`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const updatedUser = await response.json();
      setUser(updatedUser);
      return true;
    }
  } catch (error) {
    console.error('Error toggling privacy:', error);
    return false;
  }
};
const sendFollowRequest = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/follow-request`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error sending follow request:', error);
    return null;
  }
};

const getFollowRequests = async () => {
  try {
    const response = await fetch(`${API_URL}/users/me/follow-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Error getting follow requests:', error);
    return [];
  }
};

const handleFollowRequest = async (requestId, action) => {
  try {
    const response = await fetch(`${API_URL}/users/follow-requests/${requestId}/${action}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error handling follow request:', error);
    return null;
  }
};

const checkNotifications = async () => {
  const requests = await getFollowRequests();
  setNotificationCount(requests.length);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        loading,
        setUser,
        followUser,
        unfollowUser,
        getFollowing,
        getFollowers,
        getAllUsers,
        checkIsFollowing,
        togglePrivacy,
        sendFollowRequest,
        getFollowRequests,
        handleFollowRequest,
        notificationCount,
        checkNotifications,
        acceptedFollows,
        setAcceptedFollows,

      }}
    >
    {!loading && children}
  </AuthContext.Provider>

  );
};
