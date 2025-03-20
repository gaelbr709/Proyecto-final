import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { Text, Button, Avatar, List } from 'react-native-paper';
import { AuthContext } from '../Context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const PendingOrders = () => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRol');
      setIsAuthenticated(false); // 🔥 Esto actualizará toda la app y cambiará la navegación
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2f5f2c" />
      <View style={styles.content}>
        <Avatar.Image size={120} source={{ uri: 'https://randomuser.me/api/portraits/women/17.jpg' }} />
        <Text style={styles.userName}>María González</Text>
        <Text style={styles.userRole}>Conductor de Envíos</Text>

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

export default PendingOrders;


