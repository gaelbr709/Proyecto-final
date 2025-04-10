'use client';

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar
} from 'react-native';
import { TextInput, Button, Text, Divider } from 'react-native-paper';
import { Svg, Circle, Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { AuthContext } from '../Context/AuthContext';
import { useContext } from 'react';

const { width, height } = Dimensions.get('window');

const theme = {
  colors: {
    primary: '#6ec341',
    accent: '#2f5f2c',
    background: '#f0f8ed',
    surface: '#FFFFFF',
    text: '#333333',
    placeholder: '#88c46a',
    error: '#D0021B',
  },
};

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setIsAuthenticated, setUserRol, setUserid, Setusername } = useContext(AuthContext);

  const handleLogin = async () => {
    console.log('Iniciando login...');
    if (!email || !password) {
      setError('Por favor ingresa el correo y la contraseña.');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const endpoint = `${config.API_URL}/login`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      console.log('Respuesta recibida:', response.status);
      const data = await response.json();
      console.log('Datos de respuesta:', data);
  
      if (response.ok) {
        await AsyncStorage.setItem('userToken', data.access_token);
        await AsyncStorage.setItem('userRol', data.user.rol);
        await AsyncStorage.setItem('userId', String(data.user.id));
        await AsyncStorage.setItem('userName', data.user.name);
  
        setIsAuthenticated(true);
        setUserRol(data.user.rol);
        setUserid(data.user.id);
        Setusername(data.user.name)
      } else {
        setError(data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      setError('Hubo un problema al intentar iniciar sesión. ' + error);
      console.error('Error en login:', error);
    } finally {
      setLoading(false);
      console.log('Finalizando login...');
    }
  };
  
  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.accent} />
      <View style={styles.topDecoration}>
        <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Circle cx="100" cy="0" r="80" fill={theme.colors.primary} fillOpacity="0.3" />
          <Circle cx="0" cy="100" r="60" fill={theme.colors.accent} fillOpacity="0.3" />
        </Svg>
      </View>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/file.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>Bienvenido</Text>
        <TextInput
          style={styles.input}
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          mode="outlined"
          theme={{ colors: { primary: theme.colors.accent } }}
        />
        <TextInput
          style={styles.input}
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          theme={{ colors: { primary: theme.colors.accent } }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonText}
        >
          Iniciar Sesión
        </Button>
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        
        <View style={styles.registerSection}>
          <Divider style={styles.divider} />
          <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
          <Button
            mode="outlined"
            onPress={handleRegister}
            style={styles.registerButton}
            contentStyle={styles.registerButtonContent}
            labelStyle={styles.registerButtonText}
          >
            Registrarse
          </Button>
        </View>
      </View>
      <View style={styles.bottomDecoration}>
        <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Path
            d="M0 100 C 20 80, 50 80, 100 100 Z"
            fill={theme.colors.primary}
            fillOpacity="0.3"
          />
        </Svg>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.accent,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  button: {
    marginTop: 20,
    backgroundColor: theme.colors.accent,
  },
  buttonContent: {
    height: 50,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.surface,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 10,
  },
  forgotPassword: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: theme.colors.accent,
    fontSize: 16,
  },
  registerSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  divider: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: theme.colors.accent,
    opacity: 0.2,
  },
  registerText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 10,
  },
  registerButton: {
    width: '100%',
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  registerButtonContent: {
    height: 50,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  bottomDecoration: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.1,
  },
});

export default Login;