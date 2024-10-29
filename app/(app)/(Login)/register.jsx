import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from '../../Context/Auth';
import { useRouter } from 'expo-router';
import { useTheme } from '../../Context/ThemeContext';
import { lightTheme, darkTheme } from '../../themes';

export default function Register() {
  const { signup, loading, user } = useContext(AuthContext);
  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? darkTheme : lightTheme;
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      router.replace('(app)/Index');
    }
  }, [user, router]);

  const handleSignup = async () => {
    try {
      setError(null);
      await signup(name, email, password);
    } catch (err) {
      setError('Échec de l\'inscription. Veuillez réessayer.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
      padding: 24,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: theme.textColor,
      marginBottom: 24,
    },
    errorText: {
      color: theme.dangerColor,
      marginBottom: 16,
    },
    input: {
      width: '100%',
      padding: 12,
      backgroundColor: theme.inputBackground,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.borderColor,
      marginBottom: 16,
      color: theme.textColor,
    },
    registerButton: {
      width: '100%',
      backgroundColor: theme.buttonColor,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    registerButtonText: {
      color: theme.textColor,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    loginContainer: {
      marginTop: 16,
    },
    loginText: {
      color: theme.accentColor,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        placeholder="Nom complet"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor={theme.placeholderColor}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={theme.placeholderColor}
      />

      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        placeholderTextColor={theme.placeholderColor}
      />

      <TouchableOpacity
        onPress={handleSignup}
        style={styles.registerButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.textColor} />
        ) : (
          <Text style={styles.registerButtonText}>S'inscrire</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.loginContainer} 
        onPress={() => router.push('(Login)/Login')}
      >
        <Text style={styles.loginText}>Déjà un compte ? Connectez-vous</Text>
      </TouchableOpacity>
    </View>
  );
}
