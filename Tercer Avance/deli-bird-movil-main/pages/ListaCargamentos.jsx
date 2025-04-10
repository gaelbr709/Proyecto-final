// pages/ListaCargamentos.js
import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Datos simulados de cargamentos
const cargamentos = [
  {
    id: '1',
    rutaVuelo: 'México - Nueva York',
    almacen: 'Almacén Central',
    fechaEnvio: '2023-10-25',
    avion: 'Boeing 737',
  },
  {
    id: '2',
    rutaVuelo: 'Madrid - París',
    almacen: 'Almacén Norte',
    fechaEnvio: '2023-10-26',
    avion: 'Airbus A320',
  },
  {
    id: '3',
    rutaVuelo: 'Tokio - Seúl',
    almacen: 'Almacén Este',
    fechaEnvio: '2023-10-27',
    avion: 'Boeing 787',
  },
  // Puedes agregar más cargamentos aquí
];

// Componente para renderizar cada ítem de la lista
const Item = ({ id, rutaVuelo, almacen, fechaEnvio, avion, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.item}>
      <Text style={styles.title}>ID: {id}</Text>
      <Text style={styles.detail}>Ruta de vuelo: {rutaVuelo}</Text>
      <Text style={styles.detail}>Almacén: {almacen}</Text>
      <Text style={styles.detail}>Fecha de envío: {fechaEnvio}</Text>
      <Text style={styles.detail}>Avión: {avion}</Text>
    </View>
  </TouchableOpacity>
);

// Pantalla principal
const ListaCargamentos = () => {
  const navigation = useNavigation();

  const handlePressCargamento = (id) => {
    // Navegar a la pantalla de detalles con el ID del cargamento
    navigation.navigate('DetallesCargamento', { id });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cargamentos}
        renderItem={({ item }) => (
          <Item
            id={item.id}
            rutaVuelo={item.rutaVuelo}
            almacen={item.almacen}
            fechaEnvio={item.fechaEnvio}
            avion={item.avion}
            onPress={() => handlePressCargamento(item.id)} // Pasar solo el ID
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
});

export default ListaCargamentos;