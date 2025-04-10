import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { Text, Button, Avatar } from 'react-native-paper';
import { AuthContext } from '../Context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const SettingsClient = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        if (storedName) {
          setNombre(storedName);
        }
      } catch (error) {
        console.error('Error al obtener el nombre:', error);
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRol');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2f5f2c" />
      <View style={styles.content}>
        <Avatar.Image size={120} source={{  uri: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nombre) + '&background=2f5f2c&color=fff' }}  />
        <Text style={styles.userName}>{nombre || 'Cargando...'}</Text>

        <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ed',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f5f2c',
  },
  logoutButton: {
    backgroundColor: '#2f5f2c',
    marginTop: 20,
  },
});

export default SettingsClient;
