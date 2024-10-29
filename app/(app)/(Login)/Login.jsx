import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from '../../Context/Auth';
import { useRouter } from 'expo-router';
import { useTheme } from '../../Context/ThemeContext';
import { lightTheme, darkTheme } from '../../themes';

export default function Login() {
  const { login, loading, user } = useContext(AuthContext);
  const { isDarkTheme } = useTheme();
  const theme = isDarkTheme ? darkTheme : lightTheme;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      router.replace('(app)/Index');
    }
  }, [user, router]);

  const handleLogin = async () => {
    try {
      setError(null);
      await login(email, password);
      router.replace('(app)/Index');
    } catch (err) {
      setError('Échec de la connexion. Veuillez vérifier vos identifiants.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.textColor,
      marginBottom: 32,
      textAlign: 'center',
    },
    errorText: {
      color: theme.dangerColor,
      marginBottom: 16,
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: 14,
      backgroundColor: theme.inputBackground,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.borderColor,
      marginBottom: 16,
      color: theme.textColor,
      fontSize: 16,
    },
    loginButton: {
      width: '100%',
      backgroundColor: theme.buttonColor,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: 20,
    },
    loginButtonText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
    },
    signupText: {
      color: theme.accentColor,
      fontSize: 16,
    },
    inputContainer: {
      width: '100%',
      marginBottom: 20,
    },
    forgotPasswordText: {
      color: theme.accentColor,
      textAlign: 'right',
      marginBottom: 20,
      fontSize: 14,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={theme.placeholderColor}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          placeholderTextColor={theme.placeholderColor}
        />
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.loginButton, loading && styles.buttonDisabled]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.loginButtonText}>Se connecter</Text>
        )}
      </TouchableOpacity>

      <Text
        style={styles.forgotPasswordText}
        onPress={() => router.push('(app)/(Login)/ForgotPassword')}
      >
        Mot de passe oublié ?
      </Text>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Pas de compte ? </Text>
        <TouchableOpacity onPress={() => router.push('register')}>
          <Text style={[styles.signupText, { fontWeight: 'bold' }]}>Inscrivez-vous</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
