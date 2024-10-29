import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const API_URL = 'http://192.168.1.4:8000'; // Remplacez par l'adresse IP locale de votre serveur

// Créer le contexte Auth
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      router.push('(app)/Index'); // Rediriger vers la page de profil après connexion
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
      router.push('(app)/(Login)/Login'); // Rediriger vers la page de connexion après inscription
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Signup failed');
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
    router.push('(app)/(Login)/Login'); // Rediriger vers la page de connexion
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
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
