import React, { useContext ,useEffect} from 'react';
import { AuthContext } from '../Context/Auth';
import { useTheme } from '../Context/ThemeContext';
import { lightTheme, darkTheme } from '../themes';
import { useRouter, Stack } from 'expo-router';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StatusBar } from 'react-native';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkTheme,toggleTheme } = useTheme();
  const theme = isDarkTheme ? darkTheme : lightTheme;
  const router = useRouter();;

  useEffect(() => {
    if (!user) {
      router.replace('/(Login)/Login');
    }
  }, [user]);

  const CustomHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Ionicons name="book" size={24} color={theme.buttonColor} />
        <Text style={styles.logoText}>Blog App</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={toggleTheme}
        >
          <Ionicons 
            name={isDarkTheme ? "sunny-outline" : "moon-outline"} 
            size={24} 
            color={theme.textColor} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => {/* notifications */}}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => router.push('/(Videos_Reels)/Index')}
        >
          <MaterialIcons name="ondemand-video" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.textColor} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  const CustomLoginHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Ionicons name="book" size={24} color="#007AFF" />
        <Text style={styles.logoText}>Blog App</Text>
      </View>
    </View>
  )
  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.headerBackground,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.headerBackground,
      paddingHorizontal: 16,
      paddingTop: 50,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logoText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 8,
      color: theme.textColor,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconButton: {
      padding: 8,
      marginRight: 8,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.buttonColor,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
    },
    logoutText: {
      color: theme.textColor,
      marginLeft: 4,
      fontSize: 14,
      fontWeight: '500',
    },
  });
  return (
    <Stack screenOptions={{
      headerStyle: styles.header,
      headerShadowVisible: false,
      headerTintColor: '#333',
    }}>

      <Stack.Screen 
        name="Index" 
        options={{
          header: () => <CustomHeader />,
        }}
      />
      <Stack.Screen 
        name="(Login)/Login" 
        options={{
          header: () => <CustomLoginHeader/>,
        }}
      />
       <Stack.Screen 
        name="(Login)/register" 
        options={{
          header: () => <CustomLoginHeader/>,
        }}
      />
      <Stack.Screen
        name="(Profile)/Index"
        options={{
          header: () => <CustomHeader />,
          
        }}
        />
     <Stack.Screen
  name="(Videos_Reels)/Index"
  options={{
    headerShown: false
  }}
/>
<Stack.Screen
  name="Video_FullScreen/[id]"
  options={{
    headerShown: false
  }}
/>
<Stack.Screen
  name="Friends/Index"
  options={{
    header: () => <CustomHeader />,
    
  }}
/>

      
    </Stack>
  );
};




export default Layout;